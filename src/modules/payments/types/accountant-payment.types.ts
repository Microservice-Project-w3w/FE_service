import type {
  AccountantInvoice,
  AccountantPaymentMethod,
  RecordInvoicePaymentInput,
} from "@/modules/invoices";

export type AccountantPaymentStatus = "SUCCESS" | "PENDING" | "FAILED" | "VOIDED";
export type AccountantPaymentSource = "MANUAL" | "BANK_GATEWAY";

export interface AccountantPayment {
  id: string;
  invoiceId: string;
  invoiceCode: string;
  customerName: string;
  branchId: string;
  branchName: string;
  amount: number;
  method: AccountantPaymentMethod;
  referenceCode: string | null;
  paidAt: string;
  recordedBy: string;
  status: AccountantPaymentStatus;
  source: AccountantPaymentSource;
  note: string | null;
}

export interface AccountantPaymentSummary {
  collectedAmount: number;
  collectedToday: number;
  successCount: number;
  pendingCount: number;
  failedOrVoidedCount: number;
}

export interface AccountantPaymentListData {
  payments: AccountantPayment[];
  summary: AccountantPaymentSummary;
  payableInvoices: AccountantInvoice[];
}

export interface UpdateAccountantPaymentInput {
  paymentId: string;
  referenceCode: string;
  note: string;
}

export type RecordAccountantPaymentInput = RecordInvoicePaymentInput;

export type AccountantDepositStatus = "PENDING" | "HELD" | "PARTIALLY_DEDUCTED" | "PARTIALLY_REFUNDED" | "REFUNDED";

export interface AccountantDepositHistory {
  id: string;
  action: string;
  amount: number | null;
  oldStatus: string | null;
  newStatus: string | null;
  description: string | null;
  createdAt: string;
}

export interface AccountantDeposit {
  id: string;
  invoiceId: string;
  invoiceCode: string;
  rentalCode: string;
  customerName: string;
  branchName: string;
  depositAmount: number;
  deductedAmount: number;
  heldAmount: number;
  refundedAmount: number;
  remainingAmount: number;
  history: AccountantDepositHistory[];
  status: AccountantDepositStatus;
  updatedAt: string;
}

export interface AccountantDepositSummary {
  totalDeposit: number;
  heldAmount: number;
  refundableAmount: number;
  refundedAmount: number;
}

export interface AccountantDepositListData {
  deposits: AccountantDeposit[];
  summary: AccountantDepositSummary;
}
