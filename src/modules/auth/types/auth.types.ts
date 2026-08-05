export type AccountType =
  | "personal"
  | "business";

export const USER_ROLES = [
  "ADMIN",
  "MANAGER",
  "SALES_STAFF",
  "OPERATIONS_STAFF",
  "ACCOUNTANT",
  "CUSTOMER",
] as const;

export type UserRole =
  (typeof USER_ROLES)[number];

export const isUserRole = (
  value: unknown,
): value is UserRole => {
  return (
    typeof value === "string" &&
    (
      USER_ROLES as readonly string[]
    ).includes(value)
  );
};

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  accountType: AccountType;
  role: UserRole;
  companyName?: string;
  taxCode?: string;
}

export interface StoredAuthUser
  extends AuthUser {
  password: string;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

export interface LoginPayload {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterPayload {
  accountType: AccountType;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  companyName?: string;
  taxCode?: string;
}
