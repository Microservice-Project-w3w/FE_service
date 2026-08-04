import { storageKeys } from "@/core/storage/storageKeys";
import { defaultMockUsers } from "@/modules/auth/mocks/auth.mock";

import type {
  AuthSession,
  StoredAuthUser,
} from "@/modules/auth/types/auth.types";

const parseJson = <TValue>(
  value: string | null,
): TValue | null => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as TValue;
  } catch {
    return null;
  }
};

const normalize = (
  value: string,
): string => {
  return value.trim().toLowerCase();
};

export const authStorage = {
  getUsers(): StoredAuthUser[] {
    const storedUsers =
      parseJson<StoredAuthUser[]>(
        localStorage.getItem(
          storageKeys.mockUsers,
        ),
      ) ?? [];

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
    const localSession =
      parseJson<AuthSession>(
        localStorage.getItem(
          storageKeys.authSession,
        ),
      );

    if (localSession) {
      return localSession;
    }

    return parseJson<AuthSession>(
      sessionStorage.getItem(
        storageKeys.authSession,
      ),
    );
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
