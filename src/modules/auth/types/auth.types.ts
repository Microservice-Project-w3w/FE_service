export type AccountType =
  | "personal"
  | "business";

export type UserRole =
  | "ADMIN"
  | "CUSTOMER"
  | "EMPLOYEE";

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
