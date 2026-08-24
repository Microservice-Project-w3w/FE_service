import { branchesApi } from "@/modules/branches/api/branches.api";
import type {
  GetManagerAccessContextInput, ManagerAccessContext,
} from "@/modules/manager-context/types/manager-context.types";

export const managerContextApi = {
  async getMyAccessContext(input: GetManagerAccessContextInput): Promise<ManagerAccessContext> {
    if (!input.organizationId || input.branchIds.length === 0) {
      throw new Error("Tài khoản quản lý chưa có organization/branch scope trong JWT.");
    }
    const allowedIds = new Set(input.branchIds.map(String));
    const assignedBranches = (await branchesApi.list())
      .filter((branch) =>
        branch.organizationId === String(input.organizationId) &&
        allowedIds.has(branch.id) && branch.status === "ACTIVE",
      )
      .map((branch) => ({
        id: branch.id, organizationId: branch.organizationId,
        code: branch.branchCode, name: branch.name, province: branch.province,
        address: branch.address, status: branch.status,
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
