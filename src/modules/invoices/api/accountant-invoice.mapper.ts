import { ApiError } from "@/core/api";
import type { InvoiceDto, InvoicePaymentStatusDto } from "@/modules/invoices/api/accountant-invoice.dto";
import type { AccountantInvoice, AccountantInvoiceStatus } from "@/modules/invoices/types/accountant-invoice.types";

const invoiceStatuses = new Set<AccountantInvoiceStatus>([
  "DRAFT", "ISSUED", "UNPAID", "PARTIALLY_PAID", "PAID", "CANCELLED",
]);

const mapStatus = (value: string): AccountantInvoiceStatus => {
  if (invoiceStatuses.has(value as AccountantInvoiceStatus)) return value as AccountantInvoiceStatus;
  throw new ApiError(`Unsupported invoice status: ${value}`, { code: "INVOICE_STATUS_UNSUPPORTED" });
};

const finiteNumber = (value: number, field: string): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ApiError(`Invalid invoice numeric field: ${field}`, { code: "INVOICE_CONTRACT_INVALID" });
  }
  return value;
};

export const mapInvoice = (invoice: InvoiceDto, payment: InvoicePaymentStatusDto): AccountantInvoice => ({
  id: String(invoice.id), invoiceCode: "",
  branchId: String(invoice.branchId), branchName: "",
  customerId: String(invoice.customerId), customerName: "", customerPhone: "", customerEmail: "",
  rentalId: String(invoice.rentalOrderId), rentalCode: "",
  contractCode: invoice.rentalContractId == null ? null : String(invoice.rentalContractId),
  issuedAt: null, dueDate: invoice.dueAt ?? "",
  subtotal: finiteNumber(invoice.subtotal, "subtotal"),
  depositAmount: 0, taxAmount: 0, discountAmount: 0, supplementalAmountsAvailable: false,
  totalAmount: finiteNumber(payment.totalAmount, "totalAmount"),
  paidAmount: finiteNumber(payment.paidAmount, "paidAmount"),
  remainingAmount: finiteNumber(payment.remainingAmount, "remainingAmount"),
  status: mapStatus(invoice.status), note: null, createdAt: "", updatedAt: "",
  lines: invoice.items.map((item) => ({
    id: String(item.id), description: item.description,
    quantity: finiteNumber(item.quantity, "item.quantity"),
    unitPrice: finiteNumber(item.unitPrice, "item.unitPrice"),
    amount: finiteNumber(item.amount, "item.amount"),
  })),
  payments: [], paymentsAvailable: false,
});
