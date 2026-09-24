export type BranchStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface Branch {
  id: string;
  organizationId: string;
  branchCode: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  managerEmployeeId: string | null;
  managerName: string | null;
  managerEmail: string | null;
  employeeCount: number;
  activeRentalCount: number;
  status: BranchStatus;
  openedAt: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface BranchListFilters {
  search: string;
  status: BranchStatus | "ALL";
  province: string | "ALL";
}

export interface CreateBranchInput {
  organizationId: string;
  branchCode: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  openedAt: string;
  description: string;
  managerEmployeeId?: string | null;
  managerName?: string | null;
  managerEmail?: string | null;
}

export type UpdateBranchInput =
  CreateBranchInput;

export interface AssignBranchManagerInput {
  managerEmployeeId: string | null;
  managerName: string | null;
  managerEmail: string | null;
}
