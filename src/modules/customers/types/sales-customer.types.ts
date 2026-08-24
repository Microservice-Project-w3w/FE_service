export type SalesCustomerStatus = "NEW" | "INTERESTED" | "NEGOTIATING" | "CUSTOMER";
export interface SalesCustomerItem {
  id: string; customerCode: string; companyName: string; contactName: string;
  phone: string; email: string; branchId?: number; branch: string; totalTransactions: number;
  potentialValue: number; status: SalesCustomerStatus; lastInteraction: string;
}
