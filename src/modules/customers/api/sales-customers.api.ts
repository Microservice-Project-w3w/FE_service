import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import type { SalesCustomerItem } from "@/modules/customers/types/sales-customer.types";
interface CustomerDto {
  id: number; branchId: number; customerCode: string; displayName: string;
  email: string | null; phone: string | null; companyName: string | null;
  representativeName: string | null; fullName: string | null;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED"; updatedAt: string;
}
export const salesCustomersApi = {
  async list(organizationId: number, branchIds: number[]): Promise<SalesCustomerItem[]> {
    // Sales can read customers in assigned branches, but cannot list all branches.
    const scoped = [...new Set(branchIds)];
    const groups = await Promise.all(scoped.map((branchId) =>
      authenticatedRequest<CustomerDto[]>(
        "GET", `/api/v1/organizations/${organizationId}/customers?branchId=${branchId}`,
      ).then((customers) => customers.map((customer): SalesCustomerItem => ({
        id: String(customer.id), customerCode: customer.customerCode,
        companyName: customer.companyName ?? customer.displayName,
        contactName: customer.representativeName ?? customer.fullName ?? customer.displayName,
        phone: customer.phone ?? "", email: customer.email ?? "",
        branchId: customer.branchId, branch: `Chi nhánh #${customer.branchId}`,
        totalTransactions: 0, potentialValue: 0,
        status: customer.status === "ACTIVE" ? "CUSTOMER"
          : customer.status === "BLOCKED" ? "NEGOTIATING" : "NEW",
        lastInteraction: customer.updatedAt,
      }))),
    ));
    return groups.flat();
  },
};
