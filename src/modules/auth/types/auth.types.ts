export type AccountType = "personal" | "business";

export const USER_ROLES = ["ADMIN", "MANAGER", "SALES_STAFF", "OPERATIONS_STAFF", "ACCOUNTANT", "CUSTOMER"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const isUserRole = (value: unknown): value is UserRole =>
  typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  accountType: AccountType;
  role: UserRole;
  roles: UserRole[];
  permissions: string[];
  organizationId?: number;
  branchIds: number[];
  sessionId?: string;
  companyName?: string;
  taxCode?: string;
}

export interface StoredAuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  accountType: AccountType;
  role: UserRole;
  password: string;
  companyName?: string;
  taxCode?: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  rememberMe: boolean;
  user: AuthUser;
}

export interface LoginPayload { identifier: string; password: string; rememberMe: boolean; }
export interface RegisterPayload {
  accountType: AccountType; fullName: string; email: string; phone: string;
  password: string; companyName?: string; taxCode?: string;
}
export interface UpdateProfilePayload {
  fullName: string; phone: string; companyName?: string; taxCode?: string;
}
export interface ChangePasswordPayload { currentPassword: string; newPassword: string; }

export interface ApiEnvelope<T> { success: boolean; data: T; message?: string; }
export interface BackendAuthData {
  accessToken: string; tokenType: string; expiresIn: number; refreshToken: string;
  userId: number; email: string; fullName: string; role: string;
}
export interface BackendMeData { userId: string; email: string; roles: unknown; }
export interface JwtAuthClaims {
  roles: UserRole[]; permissions: string[]; branchIds: number[];
  organizationId?: number; sessionId?: string; exp?: number;
}
