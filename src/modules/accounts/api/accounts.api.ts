import type {
  Account,
  AccountFilters,
  AccountListResult,
  CreateAccountPayload,
  PasswordResetResult,
  UpdateAccountPayload,
} from "@/modules/accounts/types/account.types";
import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import type { ApiEnvelope, UserRole } from "@/modules/auth/types/auth.types";

interface UserDto {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  roleCode: UserRole;
  organizationId: number | null;
  branchIds: number[];
  status: Account["status"] | "DELETED";
  createdAt: string;
  lastLoginAt: string | null;
}
interface BranchOption {
  organizationId: number;
  id: number;
  label: string;
}
const HQ = "Trụ sở (ADMIN)";
async function branchOptions(): Promise<BranchOption[]> {
  const organizations = await authenticatedRequest<
    { id: number; organizationName: string }[]
  >("GET", "/api/v1/organizations");
  return (
    await Promise.all(
      organizations.map(async (org) => {
        const branches = await authenticatedRequest<
          { id: number; branchName: string }[]
        >("GET", `/api/v1/organizations/${org.id}/branches`);
        return branches.map((branch) => ({
          organizationId: org.id,
          id: branch.id,
          label: `${org.organizationName} / ${branch.branchName} (#${branch.id})`,
        }));
      }),
    )
  ).flat();
}
function toAccount(user: UserDto, branches: BranchOption[]): Account {
  const branch = branches.find(
    (b) =>
      b.organizationId === user.organizationId && b.id === user.branchIds?.[0],
  );
  return {
    id: String(user.id),
    fullName: user.fullName ?? "",
    email: user.email,
    phone: user.phone ?? "",
    role: user.roleCode,
    organizationId: user.organizationId,
    branchIds: user.branchIds ?? [],
    branchName:
      branch?.label ??
      (user.branchIds?.length ? `Chi nhánh #${user.branchIds[0]}` : HQ),
    status: user.status as Account["status"],
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}
async function requestBody(payload: UpdateAccountPayload, current?: Account) {
  const options = await branchOptions();
  const branch = options.find((b) => b.label === payload.branchName);
  if (!branch && !(payload.role === "ADMIN" && payload.branchName === HQ))
    throw new Error("Hãy chọn một chi nhánh hợp lệ.");
  const keepScope = current && current.branchName === payload.branchName;
  return {
    fullName: payload.fullName.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    roleCode: payload.role,
    status: payload.status,
    organizationId: keepScope
      ? current.organizationId
      : (branch?.organizationId ?? null),
    branchIds: keepScope ? current.branchIds : branch ? [branch.id] : [],
  };
}
export const accountsApi = {
  async getAll(filters: AccountFilters): Promise<AccountListResult> {
    const [response, branches] = await Promise.all([
      authenticatedRequest<ApiEnvelope<UserDto[]>>("GET", "/api/v1/users"),
      branchOptions(),
    ]);
    const query = filters.search.trim().toLocaleLowerCase("vi");
    const items = response.data
      .filter((u) => u.status !== "DELETED")
      .map((u) => toAccount(u, branches))
      .filter(
        (u) =>
          (!query ||
            `${u.fullName} ${u.email} ${u.phone}`
              .toLocaleLowerCase("vi")
              .includes(query)) &&
          (filters.role === "ALL" || filters.role === u.role) &&
          (filters.status === "ALL" || filters.status === u.status) &&
          (filters.branchName === "ALL" || filters.branchName === u.branchName),
      );
    return {
      items,
      total: items.length,
      branches: [HQ, ...branches.map((b) => b.label)],
    };
  },
  async getById(id: string): Promise<Account> {
    const [response, branches] = await Promise.all([
      authenticatedRequest<ApiEnvelope<UserDto>>("GET", `/api/v1/users/${id}`),
      branchOptions(),
    ]);
    return toAccount(response.data, branches);
  },
  async create(payload: CreateAccountPayload): Promise<Account> {
    const response = await authenticatedRequest<ApiEnvelope<UserDto>>(
      "POST",
      "/api/v1/users",
      {
        body: {
          ...(await requestBody(payload)),
          password: payload.temporaryPassword,
          emailVerified: true,
        },
      },
    );
    return toAccount(response.data, await branchOptions());
  },
  async update(id: string, payload: UpdateAccountPayload): Promise<Account> {
    const current = await this.getById(id);
    const response = await authenticatedRequest<ApiEnvelope<UserDto>>(
      "PUT",
      `/api/v1/users/${id}`,
      { body: await requestBody(payload, current) },
    );
    return toAccount(response.data, await branchOptions());
  },
  async toggleLock(id: string): Promise<Account> {
    const current = await this.getById(id);
    await authenticatedRequest(
      "PATCH",
      `/api/v1/users/${id}/${current.status === "LOCKED" ? "unlock" : "lock"}`,
    );
    return this.getById(id);
  },
  async resetPassword(
    id: string,
    newPassword?: string,
  ): Promise<PasswordResetResult> {
    if (!newPassword) throw new Error("Mật khẩu mới là bắt buộc.");
    await authenticatedRequest("POST", `/api/v1/users/${id}/reset-password`, {
      body: { newPassword },
    });
    return { temporaryPassword: newPassword };
  },
  async remove(id: string): Promise<void> {
    await authenticatedRequest("DELETE", `/api/v1/users/${id}`);
  },
  async resetMockData(): Promise<AccountListResult> {
    throw new Error("Khôi phục mock đã bị vô hiệu hóa.");
  },
};
