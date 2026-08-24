import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import type {
  GetManagerAccessContextInput, ManagerAccessContext,
} from "@/modules/manager-context/types/manager-context.types";

export const managerContextApi = {
  async getMyAccessContext(input: GetManagerAccessContextInput): Promise<ManagerAccessContext> {
    if (!input.organizationId || input.branchIds.length === 0) {
      throw new Error("Tài khoản quản lý chưa có organization/branch scope trong JWT.");
    }
    interface BranchDto {
      id: number; organizationId: number; branchCode: string; branchName: string;
      address: string | null; status: "ACTIVE" | "INACTIVE";
    }
    const branches = await authenticatedRequest<BranchDto[]>(
      "GET", `/api/v1/organizations/${input.organizationId}/branches`,
    );
    const allowedIds = new Set(input.branchIds);
    const assignedBranches = branches
      .filter((branch) =>
        allowedIds.has(branch.id) && branch.status === "ACTIVE",
      )
      .map((branch) => ({
        id: String(branch.id), organizationId: String(branch.organizationId),
        code: branch.branchCode, name: branch.branchName, province: "",
        address: branch.address ?? "", status: branch.status,
      }));
    if (assignedBranches.length === 0) {
      throw new Error("Không tìm thấy chi nhánh hoạt động trong phạm vi JWT.");
    }
    return {
      userId: input.userId, organizationId: String(input.organizationId),
      defaultBranchId: assignedBranches[0].id, assignedBranches,
    };
  },
};
