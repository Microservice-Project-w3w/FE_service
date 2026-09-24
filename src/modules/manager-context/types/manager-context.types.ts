export type ManagerScopeId =
  | "ALL"
  | string;

export type ManagerBranchStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface ManagerBranchAccess {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  province: string;
  address: string;
  status: ManagerBranchStatus;
}

export interface ManagerAccessContext {
  userId: string;
  organizationId: string;
  defaultBranchId: string;
  assignedBranches:
    ManagerBranchAccess[];
}

export interface GetManagerAccessContextInput {
  userId: string;
  organizationId?: number;
  branchIds: number[];
}
