import { storageKeys } from "@/core/storage/storageKeys";
import { defaultMockUsers } from "@/modules/auth/mocks/auth.mock";

import {
  isUserRole,
  type AccountType,
  type AuthSession,
  type AuthUser,
  type StoredAuthUser,
} from "@/modules/auth/types/auth.types";

const parseJson = (
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

const isAuthUser = (
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

const isStoredAuthUser = (
  value: unknown,
): value is StoredAuthUser => {
  if (
    !isRecord(value) ||
    !isAuthUser(value)
  ) {
    return false;
  }

  return (
    typeof value.password === "string"
  );
};

const isAuthSession = (
  value: unknown,
): value is AuthSession => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.accessToken ===
      "string" &&
    isAuthUser(value.user)
  );
};

const normalize = (
  value: string,
): string => {
  return value.trim().toLowerCase();
};

export const authStorage = {
  getUsers(): StoredAuthUser[] {
    const storedValue = parseJson(
      localStorage.getItem(
        storageKeys.mockUsers,
      ),
    );

    const storedUsers =
      Array.isArray(storedValue)
        ? storedValue.filter(
            isStoredAuthUser,
          )
        : [];

    const mergedUsers = [
      ...storedUsers,
    ];

    for (
      const defaultUser
      of defaultMockUsers
    ) {
      const existingIndex =
        mergedUsers.findIndex(
          (storedUser) =>
            storedUser.id ===
              defaultUser.id ||
            normalize(
              storedUser.email,
            ) ===
              normalize(
                defaultUser.email,
              ),
        );

      if (existingIndex >= 0) {
        mergedUsers[existingIndex] =
          defaultUser;
      } else {
        mergedUsers.push(
          defaultUser,
        );
      }
    }

    localStorage.setItem(
      storageKeys.mockUsers,
      JSON.stringify(
        mergedUsers,
      ),
    );

    return mergedUsers;
  },

  saveUsers(
    users: StoredAuthUser[],
  ): void {
    localStorage.setItem(
      storageKeys.mockUsers,
      JSON.stringify(users),
    );
  },

  getSession(): AuthSession | null {
    const localValue = parseJson(
      localStorage.getItem(
        storageKeys.authSession,
      ),
    );

    if (isAuthSession(localValue)) {
      return localValue;
    }

    if (localValue !== null) {
      localStorage.removeItem(
        storageKeys.authSession,
      );
    }

    const sessionValue = parseJson(
      sessionStorage.getItem(
        storageKeys.authSession,
      ),
    );

    if (isAuthSession(sessionValue)) {
      return sessionValue;
    }

    if (sessionValue !== null) {
      sessionStorage.removeItem(
        storageKeys.authSession,
      );
    }

    return null;
  },

  saveSession(
    session: AuthSession,
    rememberMe: boolean,
  ): void {
    this.clearSession();

    const targetStorage =
      rememberMe
        ? localStorage
        : sessionStorage;

    targetStorage.setItem(
      storageKeys.authSession,
      JSON.stringify(session),
    );
  },

  clearSession(): void {
    localStorage.removeItem(
      storageKeys.authSession,
    );

    sessionStorage.removeItem(
      storageKeys.authSession,
    );
  },
};
