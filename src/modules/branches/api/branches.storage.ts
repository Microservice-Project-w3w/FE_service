import {
  initialBranches,
} from "@/modules/branches/mocks/branches.mock";

import type {
  Branch,
} from "@/modules/branches/types/branch.types";

export const BRANCHES_STORAGE_KEY =
  "rentai_mock_branches_v1";

const cloneBranches = (
  branches: Branch[],
): Branch[] => {
  return branches.map((branch) => ({
    ...branch,
  }));
};

const isBranch = (
  value: unknown,
): value is Branch => {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const branch =
    value as Record<string, unknown>;

  return (
    typeof branch.id === "string" &&
    typeof branch.organizationId ===
      "string" &&
    typeof branch.branchCode ===
      "string" &&
    typeof branch.name === "string" &&
    typeof branch.phone === "string" &&
    typeof branch.email === "string" &&
    typeof branch.address === "string" &&
    typeof branch.province === "string" &&
    typeof branch.employeeCount ===
      "number" &&
    typeof branch.activeRentalCount ===
      "number" &&
    (branch.status === "ACTIVE" ||
      branch.status === "INACTIVE")
  );
};

export const readBranches = (): Branch[] => {
  try {
    const storedValue =
      localStorage.getItem(
        BRANCHES_STORAGE_KEY,
      );

    if (!storedValue) {
      const defaultBranches =
        cloneBranches(initialBranches);

      localStorage.setItem(
        BRANCHES_STORAGE_KEY,
        JSON.stringify(defaultBranches),
      );

      return defaultBranches;
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    if (
      !Array.isArray(parsedValue) ||
      !parsedValue.every(isBranch)
    ) {
      throw new Error(
        "Dữ liệu chi nhánh không hợp lệ.",
      );
    }

    return cloneBranches(parsedValue);
  } catch {
    const defaultBranches =
      cloneBranches(initialBranches);

    localStorage.setItem(
      BRANCHES_STORAGE_KEY,
      JSON.stringify(defaultBranches),
    );

    return defaultBranches;
  }
};

export const writeBranches = (
  branches: Branch[],
): void => {
  localStorage.setItem(
    BRANCHES_STORAGE_KEY,
    JSON.stringify(branches),
  );
};

export const resetBranches = (): Branch[] => {
  const defaultBranches =
    cloneBranches(initialBranches);

  writeBranches(defaultBranches);

  return defaultBranches;
};
