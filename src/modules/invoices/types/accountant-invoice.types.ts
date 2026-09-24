export type AccountantInvoiceStatus =
  | "DRAFT"
  | "ISSUED"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

export type AccountantPaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "CARD"
  | "OTHER";

export type AccountantPaymentStatus = "SUCCESS" | "VOIDED";

export interface AccountantInvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface AccountantInvoicePayment {
  id: string;
  invoiceId: string;
  amount: number;
  method: AccountantPaymentMethod;
  referenceCode: string | null;
  note: string | null;
  paidAt: string;
  recordedBy: string;
  status: AccountantPaymentStatus;
}

export interface AccountantInvoice {
  id: string;
  organizationId?: string;
  invoiceCode: string;
  branchId: string;
  branchName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  rentalId: string;
  rentalCode: string;
  contractCode: string | null;
  issuedAt: string | null;
  dueDate: string;
  subtotal: number;
  depositAmount: number;
  taxAmount: number;
  discountAmount: number;
  supplementalAmountsAvailable?: boolean;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: AccountantInvoiceStatus;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  lines: AccountantInvoiceLine[];
  payments: AccountantInvoicePayment[];
  paymentsAvailable?: boolean;
}

export interface AccountantInvoiceSummary {
  totalInvoices: number;
  unpaidCount: number;
  partiallyPaidCount: number;
  paidCount: number;
  overdueCount: number;
  outstandingAmount: number;
}

export interface RecordInvoicePaymentInput {
  invoiceId: string;
  amount: number;
  method: AccountantPaymentMethod;
  referenceCode: string;
  paidAt: string;
  note: string;
  recordedBy: string;
}

export interface UpdateInvoicePaymentInput {
  paymentId: string;
  referenceCode: string;
  note: string;
}

export interface AccountantInvoiceListData {
  invoices: AccountantInvoice[];
  summary: AccountantInvoiceSummary;
}
