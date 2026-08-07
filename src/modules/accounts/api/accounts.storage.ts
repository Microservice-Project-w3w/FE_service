import {
  mockAccounts,
} from "@/modules/accounts/mocks/accounts.mock";

import type {
  Account,
  AccountStatus,
} from "@/modules/accounts/types/account.types";

import {
  isUserRole,
} from "@/modules/auth/types/auth.types";

const ACCOUNTS_STORAGE_KEY =
  "rentai_mock_accounts_v1";

const ACCOUNT_STATUSES: readonly AccountStatus[] =
  [
    "ACTIVE",
    "INACTIVE",
    "LOCKED",
    "PENDING",
  ];

const isRecord = (
  value: unknown,
): value is Record<string, unknown> => {
  return (
    typeof value === "object" &&
    value !== null
  );
};

const isAccountStatus = (
  value: unknown,
): value is AccountStatus => {
  return (
    typeof value === "string" &&
    (
      ACCOUNT_STATUSES as readonly string[]
    ).includes(value)
  );
};

const isNullableString = (
  value: unknown,
): value is string | null => {
  return (
    typeof value === "string" ||
    value === null
  );
};

const isAccount = (
  value: unknown,
): value is Account => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.fullName === "string" &&
    typeof value.email === "string" &&
    typeof value.phone === "string" &&
    isUserRole(value.role) &&
    typeof value.branchName === "string" &&
    isAccountStatus(value.status) &&
    isNullableString(
      value.lastLoginAt,
    ) &&
    typeof value.createdAt === "string"
  );
};

const cloneAccounts = (
  accounts: Account[],
): Account[] => {
  return accounts.map((account) => ({
    ...account,
  }));
};

const parseStoredAccounts = (
  value: string,
): Account[] | null => {
  try {
    const parsed: unknown =
      JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return null;
    }

    if (!parsed.every(isAccount)) {
      return null;
    }

    return cloneAccounts(parsed);
  } catch {
    return null;
  }
};

export const accountsStorage = {
  getAccounts(): Account[] {
    if (
      typeof window === "undefined"
    ) {
      return cloneAccounts(
        mockAccounts,
      );
    }

    const storedValue =
      window.localStorage.getItem(
        ACCOUNTS_STORAGE_KEY,
      );

    if (storedValue === null) {
      const initialAccounts =
        cloneAccounts(mockAccounts);

      this.saveAccounts(
        initialAccounts,
      );

      return initialAccounts;
    }

    const storedAccounts =
      parseStoredAccounts(
        storedValue,
      );

    if (storedAccounts) {
      return storedAccounts;
    }

    const fallbackAccounts =
      cloneAccounts(mockAccounts);

    this.saveAccounts(
      fallbackAccounts,
    );

    return fallbackAccounts;
  },

  saveAccounts(
    accounts: Account[],
  ): void {
    if (
      typeof window === "undefined"
    ) {
      return;
    }

    window.localStorage.setItem(
      ACCOUNTS_STORAGE_KEY,
      JSON.stringify(accounts),
    );
  },

  resetAccounts(): Account[] {
    const initialAccounts =
      cloneAccounts(mockAccounts);

    this.saveAccounts(
      initialAccounts,
    );

    return initialAccounts;
  },
};
