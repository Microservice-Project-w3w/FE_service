import {
  readBranches,
  resetBranches,
  writeBranches,
} from "@/modules/branches/api/branches.storage";

import type {
  AssignBranchManagerInput,
  Branch,
  BranchListFilters,
  BranchStatus,
  CreateBranchInput,
  UpdateBranchInput,
} from "@/modules/branches/types/branch.types";

const delay = async (
  milliseconds = 150,
): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
};

const normalizeText = (
  value: string,
): string => {
  return value
    .trim()
    .toLocaleLowerCase("vi");
};

const createId = (): string => {
  return `branch-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};

const ensureUniqueBranch = (
  branches: Branch[],
  input: CreateBranchInput,
  ignoredId?: string,
): void => {
  const normalizedCode = normalizeText(
    input.branchCode,
  );

  const normalizedEmail = normalizeText(
    input.email,
  );

  const normalizedPhone =
    input.phone.replace(/\s+/g, "");

  const duplicatedCode = branches.some(
    (branch) =>
      branch.id !== ignoredId &&
      normalizeText(branch.branchCode) ===
        normalizedCode,
  );

  if (duplicatedCode) {
    throw new Error(
      "Mã chi nhánh đã tồn tại.",
    );
  }

  const duplicatedEmail = branches.some(
    (branch) =>
      branch.id !== ignoredId &&
      normalizeText(branch.email) ===
        normalizedEmail,
  );

  if (duplicatedEmail) {
    throw new Error(
      "Email chi nhánh đã tồn tại.",
    );
  }

  const duplicatedPhone = branches.some(
    (branch) =>
      branch.id !== ignoredId &&
      branch.phone.replace(/\s+/g, "") ===
        normalizedPhone,
  );

  if (duplicatedPhone) {
    throw new Error(
      "Số điện thoại chi nhánh đã tồn tại.",
    );
  }
};

export const branchesApi = {
  async list(
    filters?: BranchListFilters,
  ): Promise<Branch[]> {
    await delay();

    const branches = readBranches();

    if (!filters) {
      return branches;
    }

    const normalizedSearch = normalizeText(
      filters.search,
    );

    return branches.filter((branch) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          branch.branchCode,
          branch.name,
          branch.email,
          branch.phone,
          branch.address,
          branch.province,
          branch.managerName ?? "",
        ].some((value) =>
          normalizeText(value).includes(
            normalizedSearch,
          ),
        );

      const matchesStatus =
        filters.status === "ALL" ||
        branch.status === filters.status;

      const matchesProvince =
        filters.province === "ALL" ||
        branch.province ===
          filters.province;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesProvince
      );
    });
  },

  async getById(
    id: string,
  ): Promise<Branch> {
    await delay();

    const branch = readBranches().find(
      (item) => item.id === id,
    );

    if (!branch) {
      throw new Error(
        "Không tìm thấy chi nhánh.",
      );
    }

    return branch;
  },

  async create(
    input: CreateBranchInput,
  ): Promise<Branch> {
    await delay();

    const branches = readBranches();

    ensureUniqueBranch(branches, input);

    const now = new Date().toISOString();

    const branch: Branch = {
      id: createId(),
      organizationId:
        input.organizationId,
      branchCode:
        input.branchCode.trim().toUpperCase(),
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: normalizeText(input.email),
      address: input.address.trim(),
      province: input.province.trim(),
      managerEmployeeId:
        input.managerEmployeeId ?? null,
      managerName:
        input.managerName?.trim() || null,
      managerEmail:
        input.managerEmail
          ? normalizeText(
              input.managerEmail,
            )
          : null,
      employeeCount: 0,
      activeRentalCount: 0,
      status: "ACTIVE",
      openedAt: input.openedAt,
      description:
        input.description.trim(),
      createdAt: now,
      updatedAt: now,
    };

    writeBranches([
      branch,
      ...branches,
    ]);

    return branch;
  },

  async update(
    id: string,
    input: UpdateBranchInput,
  ): Promise<Branch> {
    await delay();

    const branches = readBranches();

    const currentBranch = branches.find(
      (branch) => branch.id === id,
    );

    if (!currentBranch) {
      throw new Error(
        "Không tìm thấy chi nhánh.",
      );
    }

    ensureUniqueBranch(
      branches,
      input,
      id,
    );

    const updatedBranch: Branch = {
      ...currentBranch,
      organizationId:
        input.organizationId,
      branchCode:
        input.branchCode.trim().toUpperCase(),
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: normalizeText(input.email),
      address: input.address.trim(),
      province: input.province.trim(),
      managerEmployeeId:
        input.managerEmployeeId ?? null,
      managerName:
        input.managerName?.trim() || null,
      managerEmail:
        input.managerEmail
          ? normalizeText(
              input.managerEmail,
            )
          : null,
      openedAt: input.openedAt,
      description:
        input.description.trim(),
      updatedAt: new Date().toISOString(),
    };

    writeBranches(
      branches.map((branch) =>
        branch.id === id
          ? updatedBranch
          : branch,
      ),
    );

    return updatedBranch;
  },

  async assignManager(
    id: string,
    input: AssignBranchManagerInput,
  ): Promise<Branch> {
    await delay();

    const branches = readBranches();

    const currentBranch = branches.find(
      (branch) => branch.id === id,
    );

    if (!currentBranch) {
      throw new Error(
        "Không tìm thấy chi nhánh.",
      );
    }

    const managerAssignedElsewhere =
      input.managerEmployeeId !== null &&
      branches.some(
        (branch) =>
          branch.id !== id &&
          branch.managerEmployeeId ===
            input.managerEmployeeId,
      );

    if (managerAssignedElsewhere) {
      throw new Error(
        "Nhân viên này đang quản lý một chi nhánh khác.",
      );
    }

    const updatedBranch: Branch = {
      ...currentBranch,
      managerEmployeeId:
        input.managerEmployeeId,
      managerName:
        input.managerName,
      managerEmail:
        input.managerEmail,
      updatedAt: new Date().toISOString(),
    };

    writeBranches(
      branches.map((branch) =>
        branch.id === id
          ? updatedBranch
          : branch,
      ),
    );

    return updatedBranch;
  },

  async updateStatus(
    id: string,
    status: BranchStatus,
  ): Promise<Branch> {
    await delay();

    const branches = readBranches();

    const currentBranch = branches.find(
      (branch) => branch.id === id,
    );

    if (!currentBranch) {
      throw new Error(
        "Không tìm thấy chi nhánh.",
      );
    }

    if (
      status === "INACTIVE" &&
      currentBranch.activeRentalCount > 0
    ) {
      throw new Error(
        "Không thể ngừng hoạt động chi nhánh đang có đơn thuê.",
      );
    }

    const updatedBranch: Branch = {
      ...currentBranch,
      status,
      updatedAt: new Date().toISOString(),
    };

    writeBranches(
      branches.map((branch) =>
        branch.id === id
          ? updatedBranch
          : branch,
      ),
    );

    return updatedBranch;
  },

  async remove(
    id: string,
  ): Promise<void> {
    await delay();

    const branches = readBranches();

    const branch = branches.find(
      (item) => item.id === id,
    );

    if (!branch) {
      throw new Error(
        "Không tìm thấy chi nhánh.",
      );
    }

    if (branch.employeeCount > 0) {
      throw new Error(
        "Không thể xóa chi nhánh đang có nhân viên.",
      );
    }

    if (branch.activeRentalCount > 0) {
      throw new Error(
        "Không thể xóa chi nhánh đang có đơn thuê.",
      );
    }

    if (branch.status !== "INACTIVE") {
      throw new Error(
        "Chỉ có thể xóa chi nhánh đã ngừng hoạt động.",
      );
    }

    writeBranches(
      branches.filter(
        (item) => item.id !== id,
      ),
    );
  },

  async resetMockData(): Promise<
    Branch[]
  > {
    await delay();

    return resetBranches();
  },
};
