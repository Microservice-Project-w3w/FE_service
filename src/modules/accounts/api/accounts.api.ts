import type {
  Account, AccountFilters, AccountListResult, CreateAccountPayload,
  PasswordResetResult, UpdateAccountPayload,
} from "@/modules/accounts/types/account.types";
import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import type { ApiEnvelope } from "@/modules/auth/types/auth.types";

export const accountsApi = {
  async getAll(filters: AccountFilters): Promise<AccountListResult> {
    const res = await authenticatedRequest<ApiEnvelope<any[]>>("GET", "/api/v1/users");
    
    let items = res.data.map((u: any) => ({
      id: String(u.id),
      fullName: u.fullName,
      email: u.email,
      phone: "",
      role: u.roleCode,
      branchName: (u.branchIds && u.branchIds.length > 0) ? `Branch ${u.branchIds[0]}` : "HQ",
      status: u.status,
      lastLoginAt: null,
      createdAt: new Date().toISOString()
    }));
    
    if (filters.search) {
      items = items.filter((i: any) => 
        i.fullName.toLowerCase().includes(filters.search.toLowerCase()) || 
        i.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.role !== "ALL") {
      items = items.filter((i: any) => i.role === filters.role);
    }
    if (filters.status !== "ALL") {
      items = items.filter((i: any) => i.status === filters.status);
    }

    return { items, total: items.length };
  },

  async getById(accountId: string): Promise<Account> {
    const res = await authenticatedRequest<ApiEnvelope<any>>("GET", `/api/v1/users/${accountId}`);
    const u = res.data;
    return {
      id: String(u.id),
      fullName: u.fullName,
      email: u.email,
      phone: "",
      role: u.roleCode,
      branchName: (u.branchIds && u.branchIds.length > 0) ? `Branch ${u.branchIds[0]}` : "HQ",
      status: u.status,
      lastLoginAt: null,
      createdAt: new Date().toISOString()
    };
  },

  async create(payload: CreateAccountPayload): Promise<Account> {
    const res = await authenticatedRequest<ApiEnvelope<any>>("POST", "/api/v1/users", {
       body: {
         fullName: payload.fullName,
         email: payload.email,
         password: payload.temporaryPassword,
         roleCode: payload.role,
         organizationId: 1,
         branchIds: [1],
         status: payload.status,
         emailVerified: true
       }
    });
    const u = res.data;
    return {
      id: String(u.id),
      fullName: u.fullName,
      email: u.email,
      phone: "",
      role: u.roleCode,
      branchName: "Branch 1",
      status: u.status,
      lastLoginAt: null,
      createdAt: new Date().toISOString()
    };
  },

  async update(accountId: string, payload: UpdateAccountPayload): Promise<Account> {
    await authenticatedRequest("PUT", `/api/v1/users/${accountId}/role`, {
       body: { roleCode: payload.role }
    });
    return this.getById(accountId);
  },

  async toggleLock(accountId: string): Promise<Account> {
    const current = await this.getById(accountId);
    if (current.status === "LOCKED") {
       await authenticatedRequest("PATCH", `/api/v1/users/${accountId}/unlock`);
    } else {
       await authenticatedRequest("PATCH", `/api/v1/users/${accountId}/lock`);
    }
    return this.getById(accountId);
  },

  async resetPassword(
    accountId: string, newPassword?: string,
  ): Promise<PasswordResetResult> { 
    if (!newPassword) throw new Error("Mật khẩu mới là bắt buộc.");
    await authenticatedRequest<ApiEnvelope<null>>(
      "POST", `/api/v1/users/${accountId}/reset-password`,
      { body: { newPassword } },
    );
    return { temporaryPassword: newPassword };
  },
  
  async remove(accountId: string): Promise<void> {
    await authenticatedRequest<null>("DELETE", `/api/v1/users/${accountId}`);
  },
  
  async resetMockData(): Promise<AccountListResult> { 
    throw new Error("Khôi phục dữ liệu mẫu đã bị vô hiệu hóa.");
  },
};
