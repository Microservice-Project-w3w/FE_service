import {
  storageKeys,
} from "@/core/storage/storageKeys";

import {
  isAuthSession,
  isStoredAuthUser,
  parseJson,
} from "@/modules/auth/api/auth.storage.helpers";

import {
  defaultMockUsers,
} from "@/modules/auth/mocks/auth.mock";

import type {
  AuthSession,
  AuthUser,
  StoredAuthUser,
} from "@/modules/auth/types/auth.types";

const normalize = (
    value: string,
): string => {
  return value.trim().toLowerCase();
};

const updateSessionInStorage = (
    storage: Storage,
    user: AuthUser,
): void => {
  const storedValue = parseJson(
      storage.getItem(
          storageKeys.authSession,
      ),
  );

  if (!isAuthSession(storedValue)) {
    return;
  }

  storage.setItem(
      storageKeys.authSession,
      JSON.stringify({
        ...storedValue,
        user,
      }),
  );
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
        mergedUsers[existingIndex] = {
          ...defaultUser,
          ...mergedUsers[
              existingIndex
              ],
        };
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

  updateSessionUser(
      user: AuthUser,
  ): void {
    updateSessionInStorage(
        localStorage,
        user,
    );

    updateSessionInStorage(
        sessionStorage,
        user,
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