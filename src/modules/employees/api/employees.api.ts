import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import { branchesApi } from "@/modules/branches/api/branches.api";
import {
  employeePositions,
  type CreateEmployeeInput,
  type Employee,
  type EmployeeFilters,
  type EmployeePosition,
  type EmployeeStatus,
  type TransferEmployeeBranchInput,
  type UpdateEmployeeInput,
  type UpdateEmployeeStatusInput,
} from "@/modules/employees/types/employee.types";

interface OrganizationDto { id: number; }
interface EmployeeDto {
  id: number; organizationId: number; userId: number | null; employeeCode: string;
  fullName: string; email: string | null; phone: string | null; jobTitle: string | null;
  status: "ACTIVE" | "INACTIVE" | "RESIGNED" | "DELETED"; hireDate: string | null;
  createdAt: string; updatedAt: string;
}
interface AssignmentDto {
  id: number; organizationId: number; employeeId: number; branchId: number;
  primaryAssignment: boolean; assignedFrom: string | null; status: "ACTIVE" | "INACTIVE";
}

const normalizeText = (value: string): string => value.trim().toLocaleLowerCase("vi");
const employeePath = (organizationId: string | number, id?: string): string =>
  `/api/v1/organizations/${organizationId}/employees${id ? `/${id}` : ""}`;
const assignmentPath = (organizationId: string | number, suffix = ""): string =>
  `/api/v1/organizations/${organizationId}/employee-branch-assignments${suffix}`;
const uiStatus = (status: EmployeeDto["status"]): EmployeeStatus =>
  status === "INACTIVE" ? "ON_LEAVE" : status === "ACTIVE" ? "ACTIVE" : "RESIGNED";
const backendStatus = (status: EmployeeStatus): EmployeeDto["status"] =>
  status === "ON_LEAVE" ? "INACTIVE" : status;
const position = (jobTitle: string | null): EmployeePosition =>
  employeePositions.includes(jobTitle as EmployeePosition)
    ? jobTitle as EmployeePosition : "SALES_STAFF";

const loadOrganization = async (organizationId: number) => {
  const [employees, assignments, branches] = await Promise.all([
    authenticatedRequest<EmployeeDto[]>("GET", employeePath(organizationId)),
    authenticatedRequest<AssignmentDto[]>("GET", assignmentPath(organizationId)),
    branchesApi.list(),
  ]);
  const activeAssignments = assignments.filter((item) => item.status === "ACTIVE");
  return employees.filter((dto) => dto.status !== "DELETED").map((dto): Employee => {
    const assignment = activeAssignments.find((item) => item.employeeId === dto.id);
    const branch = branches.find((item) => item.id === String(assignment?.branchId ?? ""));
    return {
      id: String(dto.id), employeeCode: dto.employeeCode, fullName: dto.fullName,
      email: dto.email ?? "", phone: dto.phone ?? "", dateOfBirth: null, address: "",
      branchId: branch?.id ?? "", branchName: branch?.name ?? "",
      departmentName: "", position: position(dto.jobTitle), employmentType: "FULL_TIME",
      startDate: dto.hireDate ?? "", status: uiStatus(dto.status),
      linkedAccountId: dto.userId === null ? null : String(dto.userId),
      linkedAccountEmail: dto.email, note: "",
      createdAt: dto.createdAt, updatedAt: dto.updatedAt,
    };
  });
};

const list = async (filters?: EmployeeFilters): Promise<Employee[]> => {
  const organizations = await authenticatedRequest<OrganizationDto[]>("GET", "/api/v1/organizations");
  const employees = (await Promise.all(organizations.map((item) => loadOrganization(item.id)))).flat();
  if (!filters) return employees;
  const search = normalizeText(filters.search);
  return employees.filter((employee) =>
    (search.length === 0 || [
      employee.employeeCode, employee.fullName, employee.email, employee.phone,
    ].some((value) => normalizeText(value).includes(search))) &&
    (filters.branchId === "ALL" || employee.branchId === filters.branchId) &&
    (filters.position === "ALL" || employee.position === filters.position) &&
    (filters.status === "ALL" || employee.status === filters.status),
  );
};

const locate = async (employeeId: string) => {
  const organizations = await authenticatedRequest<OrganizationDto[]>("GET", "/api/v1/organizations");
  for (const organization of organizations) {
    const employees = await loadOrganization(organization.id);
    const employee = employees.find((item) => item.id === employeeId);
    if (employee) return { employee, organizationId: organization.id };
  }
  throw new Error("Không tìm thấy nhân viên.");
};
const getById = async (employeeId: string): Promise<Employee> => (await locate(employeeId)).employee;

const body = (input: CreateEmployeeInput | Employee) => ({
  userId: input.linkedAccountId ? Number(input.linkedAccountId) : null,
  employeeCode: input.employeeCode.trim().toUpperCase(), fullName: input.fullName.trim(),
  email: input.email.trim() || null, phone: input.phone.trim() || null,
  jobTitle: input.position, status: backendStatus(input.status), hireDate: input.startDate || null,
});

const create = async (input: CreateEmployeeInput): Promise<Employee> => {
  const branch = await branchesApi.getById(input.branchId);
  const dto = await authenticatedRequest<EmployeeDto>(
    "POST", employeePath(branch.organizationId), { body: body(input) },
  );
  await authenticatedRequest<AssignmentDto>("POST", assignmentPath(branch.organizationId), {
    body: {
      employeeId: dto.id, branchId: Number(input.branchId), primaryAssignment: true,
      assignedFrom: input.startDate || null, assignedTo: null, status: "ACTIVE",
    },
  });
  return getById(String(dto.id));
};

const update = async (employeeId: string, input: UpdateEmployeeInput): Promise<Employee> => {
  const current = await locate(employeeId);
  const merged: Employee = { ...current.employee, ...input };
  await authenticatedRequest<EmployeeDto>(
    "PUT", employeePath(current.organizationId, employeeId), { body: body(merged) },
  );
  return getById(employeeId);
};

const transferBranch = async (
  employeeId: string, input: TransferEmployeeBranchInput,
): Promise<Employee> => {
  const current = await locate(employeeId);
  const assignments = await authenticatedRequest<AssignmentDto[]>(
    "GET", `${assignmentPath(current.organizationId)}?employeeId=${employeeId}`,
  );
  await Promise.all(assignments.filter((item) => item.status === "ACTIVE").map((item) =>
    authenticatedRequest("PATCH", assignmentPath(current.organizationId, `/${item.id}/deactivate`)),
  ));
  const branch = await branchesApi.getById(input.branchId);
  await authenticatedRequest("POST", assignmentPath(branch.organizationId), {
    body: {
      employeeId: Number(employeeId), branchId: Number(input.branchId),
      primaryAssignment: true, assignedFrom: new Date().toISOString().slice(0, 10),
      assignedTo: null, status: "ACTIVE",
    },
  });
  return getById(employeeId);
};
const updateStatus = (
  employeeId: string, input: UpdateEmployeeStatusInput,
): Promise<Employee> => update(employeeId, { status: input.status });
const remove = async (employeeId: string): Promise<void> => {
  const current = await locate(employeeId);
  await authenticatedRequest("DELETE", employeePath(current.organizationId, employeeId));
};
const resetMockData = async (): Promise<Employee[]> => {
  throw new Error("Khôi phục dữ liệu mẫu chưa được backend hỗ trợ.");
};

export const employeesApi = {
  list, getById, create, update, transferBranch, updateStatus, remove, resetMockData,
};
