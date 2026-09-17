import { ApiError } from "@/core/api";
import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";

export interface InvoiceBranchReference { id: number; organizationId: number; branchCode: string; branchName: string }
export interface InvoiceCustomerReference { id: number; organizationId: number; branchId: number; customerCode: string; displayName: string }
export interface InvoiceOrderReference { id: number; organizationId: number; branchId: number; customerId: number; orderCode: string; status: string }
export interface InvoiceContractReference { id: number; organizationId: number; branchId: number; customerId: number; rentalOrderId: number; contractCode: string; status: string }
export interface InvoiceReferences {
  branches: InvoiceBranchReference[];
  customers: InvoiceCustomerReference[];
  orders: InvoiceOrderReference[];
  contracts: InvoiceContractReference[];
}

const requireList = <T,>(value: unknown, name: string): T[] => {
  if (!Array.isArray(value)) throw new ApiError(`Unexpected ${name} reference response`, { code: "INVOICE_REFERENCE_CONTRACT_INVALID" });
  return value as T[];
};

export const getInvoiceReferences = async (
  organizationId: number,
  branchIds: number[],
): Promise<InvoiceReferences> => {
  const branches = requireList<InvoiceBranchReference>(
    await authenticatedRequest("GET", `/api/v1/organizations/${organizationId}/branches`), "branch",
  ).filter((branch) => branchIds.includes(branch.id));
  const sets = await Promise.all(branches.map(async (branch) => {
    const query = `organizationId=${organizationId}&branchId=${branch.id}`;
    const [customers, orders, contracts] = await Promise.all([
      authenticatedRequest("GET", `/api/v1/organizations/${organizationId}/customers?branchId=${branch.id}`),
      authenticatedRequest("GET", `/api/v1/rental-orders?${query}`),
      authenticatedRequest("GET", `/api/v1/rental-contracts?${query}`),
    ]);
    return {
      customers: requireList<InvoiceCustomerReference>(customers, "customer"),
      orders: requireList<InvoiceOrderReference>(orders, "rental order"),
      contracts: requireList<InvoiceContractReference>(contracts, "rental contract"),
    };
  }));
  return {
    branches,
    customers: sets.flatMap((set) => set.customers),
    orders: sets.flatMap((set) => set.orders),
    contracts: sets.flatMap((set) => set.contracts),
  };
};
