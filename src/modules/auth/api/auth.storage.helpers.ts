import {
    isUserRole,
    type AccountType,
    type AuthSession,
    type AuthUser,
    type StoredAuthUser,
} from "@/modules/auth/types/auth.types";

export const parseJson = (
    value: string | null,
): unknown => {
    if (!value) {
        return null;
    }

    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
};

const isRecord = (
    value: unknown,
): value is Record<string, unknown> => {
    return (
        typeof value === "object" &&
        value !== null
    );
};

const isAccountType = (
    value: unknown,
): value is AccountType => {
    return (
        value === "personal" ||
        value === "business"
    );
};

const hasOptionalString = (
    value: Record<string, unknown>,
    key: string,
): boolean => {
    return (
        value[key] === undefined ||
        typeof value[key] === "string"
    );
};

export const isAuthUser = (
    value: unknown,
): value is AuthUser => {
    if (!isRecord(value)) {
        return false;
    }

    return (
        typeof value.id === "string" &&
        typeof value.fullName === "string" &&
        typeof value.email === "string" &&
        typeof value.phone === "string" &&
        isAccountType(value.accountType) &&
        isUserRole(value.role) &&
        hasOptionalString(
            value,
            "companyName",
        ) &&
        hasOptionalString(
            value,
            "taxCode",
        )
    );
};

export const isStoredAuthUser = (
    value: unknown,
): value is StoredAuthUser => {
    return (
        isRecord(value) &&
        isAuthUser(value) &&
        typeof value.password === "string"
    );
};

export const isAuthSession = (
    value: unknown,
): value is AuthSession => {
    return (
        isRecord(value) &&
        typeof value.accessToken ===
        "string" &&
        isAuthUser(value.user)
    );
};