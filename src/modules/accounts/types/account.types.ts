import type {
  UserRole,
} from "@/modules/auth/types/auth.types";

export type AccountStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "LOCKED"
  | "PENDING";

export interface Account {
  organizationId?: number | null;
  branchIds?: number[];
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  branchName: string;
  status: AccountStatus;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface CreateAccountPayload {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  branchName: string;
  status: AccountStatus;
  temporaryPassword: string;
}

export interface UpdateAccountPayload {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  branchName: string;
  status: AccountStatus;
}

export interface AccountFilters {
  search: string;
  role: UserRole | "ALL";
  status: AccountStatus | "ALL";
  branchName: string | "ALL";
}

export interface AccountListResult {
  branches?: string[];
  items: Account[];
  total: number;
}

export interface PasswordResetResult {
  temporaryPassword: string;
}
