import type {
    AuthUser,
    StoredAuthUser,
} from "@/modules/auth/types/auth.types";

export const wait = async (
    milliseconds: number,
): Promise<void> => {
    await new Promise((resolve) => {
        window.setTimeout(
            resolve,
            milliseconds,
        );
    });
};

export const normalize = (
    value: string,
): string => {
    return value.trim().toLowerCase();
};

export const createId = (): string => {
    if (
        typeof crypto !== "undefined" &&
        "randomUUID" in crypto
    ) {
        return crypto.randomUUID();
    }

    return `user-${Date.now()}`;
};

export const createAccessToken =
    (): string => {
        return [
            "mock",
            Date.now(),
            Math.random()
                .toString(36)
                .slice(2),
        ].join("-");
    };

export const toAuthUser = (
    user: StoredAuthUser,
): AuthUser => {
    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        accountType: user.accountType,
        role: user.role,
        companyName: user.companyName,
        taxCode: user.taxCode,
    };
};