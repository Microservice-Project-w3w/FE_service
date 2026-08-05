import {
  readStoredEmployees,
  resetStoredEmployees,
  writeStoredEmployees,
} from "@/modules/employees/api/employees.storage";

import type {
  CreateEmployeeInput,
  Employee,
  EmployeeFilters,
  TransferEmployeeBranchInput,
  UpdateEmployeeInput,
  UpdateEmployeeStatusInput,
} from "@/modules/employees/types/employee.types";

const API_DELAY = 250;

const delay = async (): Promise<void> => {
  await new Promise<void>(
    (resolve) => {
      window.setTimeout(
        resolve,
        API_DELAY,
      );
    },
  );
};

const normalizeText = (
  value: string,
): string => {
  return value
    .trim()
    .toLocaleLowerCase("vi");
};

const createEmployeeId = (): string => {
  return [
    "employee",
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2, 8),
  ].join("-");
};

const findEmployeeIndex = (
  employees: Employee[],
  employeeId: string,
): number => {
  return employees.findIndex(
    (employee) =>
      employee.id === employeeId,
  );
};

const assertUniqueEmployee = (
  employees: Employee[],
  input: {
    employeeCode?: string;
    email?: string;
    phone?: string;
    linkedAccountId?: string | null;
  },
  ignoredEmployeeId?: string,
): void => {
  const duplicatedEmployee =
    employees.find((employee) => {
      if (
        employee.id ===
        ignoredEmployeeId
      ) {
        return false;
      }

      if (
        input.employeeCode &&
        normalizeText(
          employee.employeeCode,
        ) ===
          normalizeText(
            input.employeeCode,
          )
      ) {
        return true;
      }

      if (
        input.email &&
        normalizeText(
          employee.email,
        ) ===
          normalizeText(
            input.email,
          )
      ) {
        return true;
      }

      if (
        input.phone &&
        employee.phone.trim() ===
          input.phone.trim()
      ) {
        return true;
      }

      if (
        input.linkedAccountId &&
        employee.linkedAccountId ===
          input.linkedAccountId
      ) {
        return true;
      }

      return false;
    });

  if (!duplicatedEmployee) {
    return;
  }

  if (
    input.employeeCode &&
    normalizeText(
      duplicatedEmployee.employeeCode,
    ) ===
      normalizeText(
        input.employeeCode,
      )
  ) {
    throw new Error(
      "Mã nhân viên đã tồn tại.",
    );
  }

  if (
    input.email &&
    normalizeText(
      duplicatedEmployee.email,
    ) ===
      normalizeText(input.email)
  ) {
    throw new Error(
      "Email nhân viên đã tồn tại.",
    );
  }

  if (
    input.phone &&
    duplicatedEmployee.phone.trim() ===
      input.phone.trim()
  ) {
    throw new Error(
      "Số điện thoại đã tồn tại.",
    );
  }

  throw new Error(
    "Tài khoản đăng nhập đã được liên kết với nhân viên khác.",
  );
};

const filterEmployees = (
  employees: Employee[],
  filters?: EmployeeFilters,
): Employee[] => {
  if (!filters) {
    return employees;
  }

  const searchValue =
    normalizeText(filters.search);

  return employees.filter(
    (employee) => {
      const matchesSearch =
        !searchValue ||
        [
          employee.employeeCode,
          employee.fullName,
          employee.email,
          employee.phone,
        ].some((value) =>
          normalizeText(
            value,
          ).includes(
            searchValue,
          ),
        );

      const matchesBranch =
        filters.branchId ===
          "ALL" ||
        employee.branchId ===
          filters.branchId;

      const matchesPosition =
        filters.position ===
          "ALL" ||
        employee.position ===
          filters.position;

      const matchesStatus =
        filters.status ===
          "ALL" ||
        employee.status ===
          filters.status;

      return (
        matchesSearch &&
        matchesBranch &&
        matchesPosition &&
        matchesStatus
      );
    },
  );
};

const list = async (
  filters?: EmployeeFilters,
): Promise<Employee[]> => {
  await delay();

  return filterEmployees(
    readStoredEmployees(),
    filters,
  );
};

const getById = async (
  employeeId: string,
): Promise<Employee> => {
  await delay();

  const employee =
    readStoredEmployees().find(
      (item) =>
        item.id === employeeId,
    );

  if (!employee) {
    throw new Error(
      "Không tìm thấy nhân viên.",
    );
  }

  return {
    ...employee,
  };
};

const create = async (
  input: CreateEmployeeInput,
): Promise<Employee> => {
  await delay();

  const employees =
    readStoredEmployees();

  assertUniqueEmployee(
    employees,
    input,
  );

  const now =
    new Date().toISOString();

  const newEmployee: Employee = {
    id: createEmployeeId(),
    ...input,
    employeeCode:
      input.employeeCode
        .trim()
        .toUpperCase(),
    fullName:
      input.fullName.trim(),
    email:
      normalizeText(
        input.email,
      ),
    phone:
      input.phone.trim(),
    createdAt: now,
    updatedAt: now,
  };

  writeStoredEmployees([
    newEmployee,
    ...employees,
  ]);

  return {
    ...newEmployee,
  };
};

const update = async (
  employeeId: string,
  input: UpdateEmployeeInput,
): Promise<Employee> => {
  await delay();

  const employees =
    readStoredEmployees();

  const employeeIndex =
    findEmployeeIndex(
      employees,
      employeeId,
    );

  if (employeeIndex < 0) {
    throw new Error(
      "Không tìm thấy nhân viên cần cập nhật.",
    );
  }

  assertUniqueEmployee(
    employees,
    input,
    employeeId,
  );

  const currentEmployee =
    employees[employeeIndex];

  const updatedEmployee: Employee = {
    ...currentEmployee,
    ...input,
    fullName:
      input.fullName?.trim() ??
      currentEmployee.fullName,
    email:
      input.email
        ? normalizeText(
            input.email,
          )
        : currentEmployee.email,
    phone:
      input.phone?.trim() ??
      currentEmployee.phone,
    updatedAt:
      new Date().toISOString(),
  };

  employees[employeeIndex] =
    updatedEmployee;

  writeStoredEmployees(
    employees,
  );

  return {
    ...updatedEmployee,
  };
};

const transferBranch = async (
  employeeId: string,
  input: TransferEmployeeBranchInput,
): Promise<Employee> => {
  return update(
    employeeId,
    {
      branchId: input.branchId,
      branchName:
        input.branchName,
    },
  );
};

const updateStatus = async (
  employeeId: string,
  input: UpdateEmployeeStatusInput,
): Promise<Employee> => {
  return update(
    employeeId,
    {
      status: input.status,
    },
  );
};

const remove = async (
  employeeId: string,
): Promise<void> => {
  await delay();

  const employees =
    readStoredEmployees();

  const employee =
    employees.find(
      (item) =>
        item.id === employeeId,
    );

  if (!employee) {
    throw new Error(
      "Không tìm thấy nhân viên cần xóa.",
    );
  }

  if (
    employee.status !== "RESIGNED"
  ) {
    throw new Error(
      "Chỉ có thể xóa hồ sơ nhân viên đã nghỉ việc.",
    );
  }

  writeStoredEmployees(
    employees.filter(
      (item) =>
        item.id !== employeeId,
    ),
  );
};

const resetMockData =
  async (): Promise<Employee[]> => {
    await delay();

    return resetStoredEmployees();
  };

export const employeesApi = {
  list,
  getById,
  create,
  update,
  transferBranch,
  updateStatus,
  remove,
  resetMockData,
};
