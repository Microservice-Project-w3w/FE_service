import {
  initialBranches,
} from "@/modules/branches/mocks/branches.mock";

import {
  managerBranchAssignmentMock,
} from "@/modules/manager-context/mocks/manager-context.mock";

import type {
  GetManagerAccessContextInput,
  ManagerAccessContext,
} from "@/modules/manager-context/types/manager-context.types";

const delay = async (
  milliseconds = 180,
): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(
      resolve,
      milliseconds,
    );
  });
};

export const managerContextApi = {
  async getMyAccessContext(
    input: GetManagerAccessContextInput,
  ): Promise<ManagerAccessContext> {
    await delay();

    const branchIds =
      managerBranchAssignmentMock[
        input.userId
      ] ?? [];

    const assignedBranches =
      initialBranches
        .filter(
          (branch) =>
            branchIds.includes(
              branch.id,
            ) &&
            branch.status ===
              "ACTIVE",
        )
        .map((branch) => ({
          id: branch.id,
          organizationId:
            branch.organizationId,
          code: branch.branchCode,
          name: branch.name,
          province:
            branch.province,
          address:
            branch.address,
          status:
            branch.status,
        }));

    if (
      assignedBranches.length === 0
    ) {
      throw new Error(
        "Tài khoản quản lý chưa được phân công chi nhánh hoạt động.",
      );
    }

    const organizationId =
      assignedBranches[0]
        .organizationId;

    const hasDifferentOrganization =
      assignedBranches.some(
        (branch) =>
          branch.organizationId !==
          organizationId,
      );

    if (hasDifferentOrganization) {
      throw new Error(
        "Các chi nhánh được phân công không thuộc cùng một doanh nghiệp.",
      );
    }

    return {
      userId: input.userId,
      organizationId,
      defaultBranchId:
        assignedBranches[0].id,
      assignedBranches:
        structuredClone(
          assignedBranches,
        ),
    };
  },
};
