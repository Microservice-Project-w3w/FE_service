import {
  accountsStorage,
} from "@/modules/accounts/api/accounts.storage";

import type {
  Account,
  AccountFilters,
  AccountListResult,
  CreateAccountPayload,
  PasswordResetResult,
  UpdateAccountPayload,
} from "@/modules/accounts/types/account.types";

const wait = async (
  milliseconds = 350,
): Promise<void> => {
  await new Promise((resolve) => {
    window.setTimeout(
      resolve,
      milliseconds,
    );
  });
};

const normalize = (
  value: string,
): string => {
  return value
    .trim()
    .toLowerCase();
};

const cloneAccount = (
  account: Account,
): Account => {
  return {
    ...account,
  };
};

const createId = (): string => {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `account-${Date.now()}`;
};

const createTemporaryPassword =
  (): string => {
    const randomPart = Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase();

    return `RentAI@${randomPart}`;
  };

let accountsDatabase =
  accountsStorage.getAccounts();

const persistAccounts = (): void => {
  accountsStorage.saveAccounts(
    accountsDatabase,
  );
};

const ensureUniqueContact = (
  email: string,
  phone: string,
  excludedId?: string,
): void => {
  const normalizedEmail =
    normalize(email);

  const normalizedPhone =
    normalize(phone);

  const duplicatedEmail =
    accountsDatabase.some(
      (account) =>
        account.id !== excludedId &&
        normalize(account.email) ===
          normalizedEmail,
    );

  if (duplicatedEmail) {
    throw new Error(
      "Email đã được sử dụng bởi tài khoản khác.",
    );
  }

  const duplicatedPhone =
    accountsDatabase.some(
      (account) =>
        account.id !== excludedId &&
        normalize(account.phone) ===
          normalizedPhone,
    );

  if (duplicatedPhone) {
    throw new Error(
      "Số điện thoại đã được sử dụng bởi tài khoản khác.",
    );
  }
};

export const accountsApi = {
  async getAll(
    filters: AccountFilters,
  ): Promise<AccountListResult> {
    await wait();

    const keyword =
      normalize(filters.search);

    const items =
      accountsDatabase.filter(
        (account) => {
          const matchesKeyword =
            keyword.length === 0 ||
            normalize(
              account.fullName,
            ).includes(keyword) ||
            normalize(
              account.email,
            ).includes(keyword) ||
            normalize(
              account.phone,
            ).includes(keyword);

          const matchesRole =
            filters.role === "ALL" ||
            account.role ===
              filters.role;

          const matchesStatus =
            filters.status === "ALL" ||
            account.status ===
              filters.status;

          const matchesBranch =
            filters.branchName ===
              "ALL" ||
            account.branchName ===
              filters.branchName;

          return (
            matchesKeyword &&
            matchesRole &&
            matchesStatus &&
            matchesBranch
          );
        },
      );

    return {
      items: items.map(
        cloneAccount,
      ),
      total: items.length,
    };
  },

  async getById(
    accountId: string,
  ): Promise<Account> {
    await wait(250);

    const account =
      accountsDatabase.find(
        (item) =>
          item.id === accountId,
      );

    if (!account) {
      throw new Error(
        "Không tìm thấy tài khoản.",
      );
    }

    return cloneAccount(account);
  },

  async create(
    payload: CreateAccountPayload,
  ): Promise<Account> {
    await wait(450);

    ensureUniqueContact(
      payload.email,
      payload.phone,
    );

    const account: Account = {
      id: createId(),
      fullName:
        payload.fullName.trim(),
      email:
        payload.email.trim(),
      phone:
        payload.phone.trim(),
      role: payload.role,
      branchName:
        payload.branchName,
      status: payload.status,
      lastLoginAt: null,
      createdAt:
        new Date().toISOString(),
    };

    accountsDatabase = [
      account,
      ...accountsDatabase,
    ];

    persistAccounts();

    return cloneAccount(account);
  },

  async update(
    accountId: string,
    payload: UpdateAccountPayload,
  ): Promise<Account> {
    await wait(400);

    const accountIndex =
      accountsDatabase.findIndex(
        (account) =>
          account.id === accountId,
      );

    if (accountIndex < 0) {
      throw new Error(
        "Không tìm thấy tài khoản.",
      );
    }

    ensureUniqueContact(
      payload.email,
      payload.phone,
      accountId,
    );

    const existingAccount =
      accountsDatabase[
        accountIndex
      ];

    const updatedAccount: Account = {
      ...existingAccount,
      fullName:
        payload.fullName.trim(),
      email:
        payload.email.trim(),
      phone:
        payload.phone.trim(),
      role: payload.role,
      branchName:
        payload.branchName,
      status: payload.status,
    };

    accountsDatabase[
      accountIndex
    ] = updatedAccount;

    persistAccounts();

    return cloneAccount(
      updatedAccount,
    );
  },

  async toggleLock(
    accountId: string,
  ): Promise<Account> {
    await wait(350);

    const accountIndex =
      accountsDatabase.findIndex(
        (account) =>
          account.id === accountId,
      );

    if (accountIndex < 0) {
      throw new Error(
        "Không tìm thấy tài khoản.",
      );
    }

    const account =
      accountsDatabase[
        accountIndex
      ];

    if (
      account.id ===
      "account-admin-001"
    ) {
      throw new Error(
        "Không thể khóa tài khoản quản trị viên chính.",
      );
    }

    const updatedAccount: Account = {
      ...account,
      status:
        account.status === "LOCKED"
          ? "ACTIVE"
          : "LOCKED",
    };

    accountsDatabase[
      accountIndex
    ] = updatedAccount;

    persistAccounts();

    return cloneAccount(
      updatedAccount,
    );
  },

  async resetPassword(
    accountId: string,
    newPassword?: string,
  ): Promise<PasswordResetResult> {
    await wait(450);

    const accountExists =
      accountsDatabase.some(
        (account) =>
          account.id === accountId,
      );

    if (!accountExists) {
      throw new Error(
        "Không tìm thấy tài khoản.",
      );
    }

    const temporaryPassword =
      newPassword?.trim() ||
      createTemporaryPassword();

    if (
      temporaryPassword.length < 8
    ) {
      throw new Error(
        "Mật khẩu mới phải có ít nhất 8 ký tự.",
      );
    }

    return {
      temporaryPassword,
    };
  },

  async remove(
    accountId: string,
  ): Promise<void> {
    await wait(400);

    const account =
      accountsDatabase.find(
        (item) =>
          item.id === accountId,
      );

    if (!account) {
      throw new Error(
        "Không tìm thấy tài khoản.",
      );
    }

    if (
      account.id ===
      "account-admin-001"
    ) {
      throw new Error(
        "Không thể xóa tài khoản quản trị viên chính.",
      );
    }

    accountsDatabase =
      accountsDatabase.filter(
        (item) =>
          item.id !== accountId,
      );

    persistAccounts();
  },

  async resetMockData(): Promise<
    AccountListResult
  > {
    await wait(300);

    accountsDatabase =
      accountsStorage.resetAccounts();

    return {
      items:
        accountsDatabase.map(
          cloneAccount,
        ),
      total:
        accountsDatabase.length,
    };
  },
};
