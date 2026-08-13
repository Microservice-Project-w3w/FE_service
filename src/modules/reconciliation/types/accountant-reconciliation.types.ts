export type AccountantReconciliationStatus = "PENDING" | "MATCHED" | "MISMATCH" | "RECONCILED";

export interface AccountantReconciliation {
  id: string;
  paymentId: string;
  invoiceCode: string;
  customerName: string;
  branchId: string;
  branchName: string;
  expectedAmount: number;
  statementAmount: number;
  differenceAmount: number;
  referenceCode: string | null;
  transactionDate: string;
  status: AccountantReconciliationStatus;
  paymentMethod: string;
  resolutionNote: string | null;
  reconciledAt: string | null;
  reconciledBy: string | null;
}

export interface AccountantReconciliationSummary {
  pendingCount: number;
  matchedCount: number;
  mismatchCount: number;
  reconciledCount: number;
  differenceAmount: number;
}

export interface AccountantReconciliationListData {
  reconciliations: AccountantReconciliation[];
  summary: AccountantReconciliationSummary;
}

export interface ConfirmReconciliationInput {
  reconciliationId: string;
  note: string;
  reconciledBy: string;
}
