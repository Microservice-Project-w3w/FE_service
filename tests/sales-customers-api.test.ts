import { afterEach, expect, it, vi } from "vitest";
import { salesCustomersApi } from "@/modules/customers/api/sales-customers.api";
import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";

vi.mock("@/modules/auth/api/authenticatedClient", () => ({
  authenticatedRequest: vi.fn(),
}));
afterEach(() => vi.clearAllMocks());

it("loads Sales customers only from assigned branches without requiring branch-list permission", async () => {
  vi.mocked(authenticatedRequest).mockResolvedValue([
    {
      id: 7,
      branchId: 2,
      customerCode: "CUS-7",
      displayName: "Khách demo",
      status: "ACTIVE",
      updatedAt: "2026-10-07T10:00:00",
    },
  ]);
  const customers = await salesCustomersApi.list(1, [2, 2]);
  expect(authenticatedRequest).toHaveBeenCalledTimes(1);
  expect(authenticatedRequest).toHaveBeenCalledWith(
    "GET",
    "/api/v1/organizations/1/customers?branchId=2",
  );
  expect(customers[0].contactName).toBe("Khách demo");
});

it("does not query all customers when the user has no assigned branches", async () => {
  expect(await salesCustomersApi.list(1, [])).toEqual([]);
  expect(authenticatedRequest).not.toHaveBeenCalled();
});
