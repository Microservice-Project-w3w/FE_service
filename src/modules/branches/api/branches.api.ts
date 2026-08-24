import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import type {
  AssignBranchManagerInput, Branch, BranchListFilters, BranchStatus,
  CreateBranchInput, UpdateBranchInput,
} from "@/modules/branches/types/branch.types";

interface OrganizationDto { id: number; }
interface BranchDto {
  id: number; organizationId: number; branchCode: string; branchName: string;
  email: string | null; phone: string | null; address: string | null;
  status: BranchStatus; createdAt: string; updatedAt: string;
}
const toBranch = (dto: BranchDto): Branch => ({
  id: String(dto.id), organizationId: String(dto.organizationId),
  branchCode: dto.branchCode, name: dto.branchName, phone: dto.phone ?? "",
  email: dto.email ?? "", address: dto.address ?? "", province: "",
  managerEmployeeId: null, managerName: null, managerEmail: null,
  employeeCount: 0, activeRentalCount: 0, status: dto.status,
  openedAt: "", description: "", createdAt: dto.createdAt, updatedAt: dto.updatedAt,
});
const normalizeText = (value: string): string => value.trim().toLocaleLowerCase("vi");
const branchPath = (organizationId: string, id?: string): string =>
  `/api/v1/organizations/${Number(organizationId)}/branches${id ? `/${id}` : ""}`;
const requestBody = (input: CreateBranchInput | UpdateBranchInput, status: BranchStatus) => ({
  branchCode: input.branchCode.trim().toUpperCase(),
  branchName: input.name.trim(), email: input.email.trim() || null,
  phone: input.phone.trim() || null,
  address: [input.address.trim(), input.province.trim()].filter(Boolean).join(", "),
  status,
});
const unsupported = (action: string): never => { throw new Error(`${action} chưa được backend hỗ trợ.`); };

export const branchesApi = {
  async list(filters?: BranchListFilters): Promise<Branch[]> {
    const organizations = await authenticatedRequest<OrganizationDto[]>("GET", "/api/v1/organizations");
    const groups = await Promise.all(organizations.map((organization) =>
      authenticatedRequest<BranchDto[]>("GET", branchPath(String(organization.id))),
    ));
    const branches = groups.flat().map(toBranch);
    if (!filters) return branches;
    const search = normalizeText(filters.search);
    return branches.filter((branch) => {
      const matchesSearch = search.length === 0 || [
        branch.branchCode, branch.name, branch.email, branch.phone, branch.address,
      ].some((value) => normalizeText(value).includes(search));
      return matchesSearch &&
        (filters.status === "ALL" || branch.status === filters.status) &&
        (filters.province === "ALL" || branch.province === filters.province);
    });
  },

  async getById(id: string): Promise<Branch> {
    const branch = (await this.list()).find((item) => item.id === id);
    if (!branch) throw new Error("Không tìm thấy chi nhánh.");
    return branch;
  },

  async create(input: CreateBranchInput): Promise<Branch> {
    return toBranch(await authenticatedRequest<BranchDto>(
      "POST", branchPath(input.organizationId), { body: requestBody(input, "ACTIVE") },
    ));
  },

  async update(id: string, input: UpdateBranchInput): Promise<Branch> {
    const current = await this.getById(id);
    return toBranch(await authenticatedRequest<BranchDto>(
      "PUT", branchPath(input.organizationId, id), { body: requestBody(input, current.status) },
    ));
  },

  async assignManager(_id: string, _input: AssignBranchManagerInput): Promise<Branch> {
    return unsupported("Gán quản lý chi nhánh");
  },

  async updateStatus(id: string, status: BranchStatus): Promise<Branch> {
    const current = await this.getById(id);
    return toBranch(await authenticatedRequest<BranchDto>(
      "PUT", branchPath(current.organizationId, id), {
        body: {
          branchCode: current.branchCode, branchName: current.name,
          email: current.email || null, phone: current.phone || null,
          address: current.address || null, status,
        },
      },
    ));
  },

  async remove(id: string): Promise<void> {
    const current = await this.getById(id);
    await authenticatedRequest("DELETE", branchPath(current.organizationId, id));
  },

  async resetMockData(): Promise<Branch[]> {
    return unsupported("Khôi phục dữ liệu mẫu");
  },
};
