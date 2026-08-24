import { isUserRole } from "@/modules/auth/types/auth.types";
import type { AccountType, AuthSession, AuthUser } from "@/modules/auth/types/auth.types";

export const parseJson = (value: string | null): unknown => {
  if (!value) return null;
  try { return JSON.parse(value) as unknown; } catch { return null; }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
const isAccountType = (value: unknown): value is AccountType =>
  value === "personal" || value === "business";
const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");
const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === "number");

export const isAuthUser = (value: unknown): value is AuthUser => {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" && typeof value.fullName === "string" &&
    typeof value.email === "string" && typeof value.phone === "string" &&
    isAccountType(value.accountType) && isUserRole(value.role) &&
    isStringArray(value.roles) && value.roles.every(isUserRole) &&
    isStringArray(value.permissions) && isNumberArray(value.branchIds) &&
    (value.organizationId === undefined || typeof value.organizationId === "number") &&
    (value.sessionId === undefined || typeof value.sessionId === "string");
};

export const isAuthSession = (value: unknown): value is AuthSession =>
  isRecord(value) && typeof value.accessToken === "string" &&
  typeof value.refreshToken === "string" && typeof value.expiresIn === "number" &&
  typeof value.rememberMe === "boolean" && isAuthUser(value.user);
