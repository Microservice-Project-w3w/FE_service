import { ApiError } from "@/core/api";
import { isUserRole } from "@/modules/auth/types/auth.types";
import type {
  AuthSession, AuthUser, BackendAuthData, BackendMeData, JwtAuthClaims, UserRole,
} from "@/modules/auth/types/auth.types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
const stringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const numberArray = (value: unknown): number[] =>
  Array.isArray(value) ? value.filter((item): item is number => typeof item === "number") : [];

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized + "=".repeat((4 - (normalized.length % 4)) % 4));
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const decodeJwtClaims = (accessToken: string): JwtAuthClaims => {
  try {
    const payload = accessToken.split(".")[1];
    if (!payload) throw new Error("JWT payload is missing");
    const claims: unknown = JSON.parse(decodeBase64Url(payload));
    if (!isRecord(claims)) throw new Error("JWT payload is invalid");
    const roles = stringArray(claims.roles);
    if (!roles.every(isUserRole)) throw new Error("JWT contains an unsupported role");
    return {
      roles,
      permissions: stringArray(claims.permissions),
      branchIds: numberArray(claims.branchIds),
      organizationId: typeof claims.organizationId === "number" ? claims.organizationId : undefined,
      sessionId: typeof claims.sessionId === "string" ? claims.sessionId : undefined,
      exp: typeof claims.exp === "number" ? claims.exp : undefined,
    };
  } catch (error: unknown) {
    throw new ApiError("Invalid access token payload", {
      cause: error, code: "AUTH_TOKEN_INVALID",
    });
  }
};

export const assertBackendAuthData = (value: unknown): BackendAuthData => {
  if (!isRecord(value) || typeof value.accessToken !== "string" ||
    typeof value.refreshToken !== "string" || typeof value.expiresIn !== "number" ||
    typeof value.userId !== "number" || typeof value.email !== "string" ||
    typeof value.fullName !== "string" || typeof value.role !== "string" ||
    typeof value.tokenType !== "string" || !isUserRole(value.role)) {
    throw new ApiError("Unexpected authentication response", {
      code: "AUTH_CONTRACT_INVALID", details: value,
    });
  }
  return value as unknown as BackendAuthData;
};

export const authDataToSession = (
  data: BackendAuthData,
  rememberMe: boolean,
  previousUser?: AuthUser,
): AuthSession => {
  const claims = decodeJwtClaims(data.accessToken);
  const tokenRole = claims.roles[0];
  if (!tokenRole || tokenRole !== data.role) {
    throw new ApiError("Role mismatch in authentication response", {
      code: "AUTH_ROLE_MISMATCH",
    });
  }
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresIn: data.expiresIn,
    rememberMe,
    user: {
      id: String(data.userId),
      fullName: data.fullName || previousUser?.fullName || "",
      email: data.email,
      phone: previousUser?.phone ?? "",
      accountType: previousUser?.accountType ?? "personal",
      role: data.role as UserRole,
      roles: claims.roles,
      permissions: claims.permissions,
      organizationId: claims.organizationId,
      branchIds: claims.branchIds,
      sessionId: claims.sessionId,
      companyName: previousUser?.companyName,
      taxCode: previousUser?.taxCode,
    },
  };
};

export const mergeMeIntoUser = (currentUser: AuthUser, data: BackendMeData): AuthUser => {
  const roles = stringArray(data.roles);
  if (!roles.every(isUserRole) || !roles.includes(currentUser.role)) {
    throw new ApiError("Unexpected current-user role response", {
      code: "AUTH_ME_CONTRACT_INVALID", details: data,
    });
  }
  return { ...currentUser, id: data.userId, email: data.email, roles: roles as UserRole[] };
};
