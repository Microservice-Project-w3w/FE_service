import type {
  Account, AccountFilters, AccountListResult, CreateAccountPayload,
  PasswordResetResult, UpdateAccountPayload,
} from "@/modules/accounts/types/account.types";

const unsupported = (): never => {
  throw new Error(
    "Identity backend hiện chưa có API danh sách/tạo/xóa/reset mật khẩu tài khoản quản trị.",
  );
};

export const accountsApi = {
  async getAll(_filters: AccountFilters): Promise<AccountListResult> { return unsupported(); },
  async getById(_accountId: string): Promise<Account> { return unsupported(); },
  async create(_payload: CreateAccountPayload): Promise<Account> { return unsupported(); },
  async update(_accountId: string, _payload: UpdateAccountPayload): Promise<Account> {
    return unsupported();
  },
  async toggleLock(_accountId: string): Promise<Account> { return unsupported(); },
  async resetPassword(
    _accountId: string, _newPassword?: string,
  ): Promise<PasswordResetResult> { return unsupported(); },
  async remove(_accountId: string): Promise<void> { unsupported(); },
  async resetMockData(): Promise<AccountListResult> { return unsupported(); },
};
