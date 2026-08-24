import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import type { SalesCustomerItem } from "@/modules/customers/types/sales-customer.types";
interface BranchDto { id: number; branchName: string; }
interface CustomerDto {
  id: number; branchId: number; customerCode: string; displayName: string;
  email: string | null; phone: string | null; companyName: string | null;
  representativeName: string | null; fullName: string | null;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED"; updatedAt: string;
}
export const salesCustomersApi = {
  async list(organizationId: number, branchIds: number[]): Promise<SalesCustomerItem[]> {
    const branches = await authenticatedRequest<BranchDto[]>(
      "GET", `/api/v1/organizations/${organizationId}/branches`,
    );
    const allowed = new Set(branchIds);
    const scoped = branches.filter((branch) => allowed.has(branch.id));
    const groups = await Promise.all(scoped.map((branch) =>
      authenticatedRequest<CustomerDto[]>(
        "GET", `/api/v1/organizations/${organizationId}/customers?branchId=${branch.id}`,
      ).then((customers) => customers.map((customer): SalesCustomerItem => ({
        id: String(customer.id), customerCode: customer.customerCode,
        companyName: customer.companyName ?? customer.displayName,
        contactName: customer.representativeName ?? customer.fullName ?? customer.displayName,
        phone: customer.phone ?? "", email: customer.email ?? "",
        branchId: customer.branchId, branch: branch.branchName,
        totalTransactions: 0, potentialValue: 0,
        status: customer.status === "ACTIVE" ? "CUSTOMER"
          : customer.status === "BLOCKED" ? "NEGOTIATING" : "NEW",
        lastInteraction: customer.updatedAt,
      }))),
    ));
    return groups.flat();
  },
};
