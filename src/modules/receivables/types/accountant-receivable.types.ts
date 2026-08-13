import type { AccountantInvoicePayment } from "@/modules/invoices";

export type AccountantReceivableStatus = "UNPAID" | "PARTIALLY_PAID" | "PAID" | "OVERDUE";
export type AccountantReceivableDueFilter = "ALL" | "OVERDUE" | "DUE_SOON" | "CURRENT";

export interface AccountantReceivable {
  id: string;
  invoiceId: string;
  receivableCode: string;
  invoiceCode: string;
  rentalCode: string;
  contractCode: string | null;
  branchId: string;
  branchName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  dueDate: string;
  status: AccountantReceivableStatus;
  note: string | null;
  updatedAt: string;
  payments: AccountantInvoicePayment[];
}

export interface AccountantReceivableSummary {
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  overdueAmount: number;
  dueSoonAmount: number;
}

export interface AccountantReceivableListData {
  receivables: AccountantReceivable[];
  summary: AccountantReceivableSummary;
}

export interface AccountantDebtAgingRow {
  customerId: string;
  customerName: string;
  totalDebt: number;
  currentAmount: number;
  oneToThirtyDays: number;
  overThirtyDays: number;
  invoiceCount: number;
  status: "GOOD" | "WARNING" | "CRITICAL";
}

export interface AccountantDebtAgingData {
  rows: AccountantDebtAgingRow[];
  totalDebt: number;
  currentAmount: number;
  oneToThirtyDays: number;
  overThirtyDays: number;
}
