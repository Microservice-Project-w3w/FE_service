import { beforeEach, expect, it, vi } from "vitest";
import { accountsApi } from "@/modules/accounts/api/accounts.api";
import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";

vi.mock("@/modules/auth/api/authenticatedClient", () => ({
  authenticatedRequest: vi.fn(),
}));
const request = vi.mocked(authenticatedRequest);
const label = "Organization 9 / Chi nhánh 23 (#23)";
const user = {
  id: 11,
  fullName: "Demo",
  email: "demo@gmail.com",
  phone: "0901234567",
  roleCode: "SALES_STAFF",
  organizationId: 9,
  branchIds: [23, 24],
  status: "ACTIVE",
  createdAt: "2026-10-08T10:00:00",
  lastLoginAt: null,
};
const payload = {
  fullName: "Changed",
  email: "changed@gmail.com",
  phone: "0987654321",
  role: "SALES_STAFF" as const,
  branchName: label,
  status: "ACTIVE" as const,
};
beforeEach(() => {
  request.mockReset();
  request.mockImplementation(async (_method, path) => {
    if (path === "/api/v1/organizations")
      return [{ id: 9, organizationName: "Organization 9" }];
    if (path === "/api/v1/organizations/9/branches")
      return [
        { id: 23, branchName: "Chi nhánh 23" },
        { id: 24, branchName: "Chi nhánh 24" },
      ];
    if (path === "/api/v1/users")
      return { data: [user, { ...user, id: 12, status: "DELETED" }] };
    return { data: user };
  });
});
it("reads actual phone/dates and excludes soft-deleted accounts", async () => {
  const list = await accountsApi.getAll({
    search: "",
    role: "ALL",
    status: "ALL",
    branchName: "ALL",
  });
  expect(list.items).toHaveLength(1);
  expect(list.items[0]).toMatchObject({
    phone: user.phone,
    createdAt: user.createdAt,
    branchName: label,
  });
});
it("creates accounts with the selected organization and branch IDs", async () => {
  await accountsApi.create({ ...payload, temporaryPassword: "Demo@123" });
  expect(request).toHaveBeenCalledWith("POST", "/api/v1/users", {
    body: expect.objectContaining({
      organizationId: 9,
      branchIds: [23],
      phone: payload.phone,
      fullName: payload.fullName,
      email: payload.email,
      password: "Demo@123",
    }),
  });
});
it("updates all form fields without removing the other assigned branches", async () => {
  await accountsApi.update("11", payload);
  expect(request).toHaveBeenCalledWith("PUT", "/api/v1/users/11", {
    body: {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      roleCode: payload.role,
      status: payload.status,
      organizationId: 9,
      branchIds: [23, 24],
    },
  });
});
it("refuses placeholder branches before sending a write request", async () => {
  await expect(
    accountsApi.create({
      ...payload,
      branchName: "Chi nhánh không có thật",
      temporaryPassword: "Demo@123",
    }),
  ).rejects.toThrow("chi nhánh hợp lệ");
  expect(request.mock.calls.some(([method]) => method === "POST")).toBe(false);
});
