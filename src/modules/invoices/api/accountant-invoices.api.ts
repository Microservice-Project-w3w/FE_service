import {
  cloneAccountantInvoiceMocks,
  invoiceStatusAfterPayment,
} from "@/modules/invoices/mocks/accountant-invoices.mock";
import type {
  AccountantInvoice,
  AccountantInvoiceListData,
  AccountantInvoicePayment,
  AccountantInvoiceSummary,
  RecordInvoicePaymentInput,
  UpdateInvoicePaymentInput,
} from "@/modules/invoices/types/accountant-invoice.types";

const MOCK_DELAY_MS = 180;
let invoices = cloneAccountantInvoiceMocks();

const delay = () => new Promise<void>((resolve) => window.setTimeout(resolve, MOCK_DELAY_MS));
const clone = <T,>(value: T): T => structuredClone(value);

const requireInvoice = (invoiceId: string): AccountantInvoice => {
  const invoice = invoices.find((item) => item.id === invoiceId);
  if (!invoice) throw new Error("Không tìm thấy hóa đơn.");
  return invoice;
};

const getSummary = (items: AccountantInvoice[]): AccountantInvoiceSummary => ({
  totalInvoices: items.length,
  unpaidCount: items.filter((item) => item.status === "UNPAID" || item.status === "DRAFT").length,
  partiallyPaidCount: items.filter((item) => item.status === "PARTIALLY_PAID").length,
  paidCount: items.filter((item) => item.status === "PAID").length,
  overdueCount: items.filter((item) => item.status === "OVERDUE").length,
  outstandingAmount: items
    .filter((item) => item.status !== "CANCELLED")
    .reduce((total, item) => total + item.remainingAmount, 0),
});

const getList = async (): Promise<AccountantInvoiceListData> => {
  await delay();
  const sorted = [...invoices].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return { invoices: clone(sorted), summary: getSummary(sorted) };
};

const getById = async (invoiceId: string): Promise<AccountantInvoice> => {
  await delay();
  return clone(requireInvoice(invoiceId));
};

const issue = async (invoiceId: string): Promise<AccountantInvoice> => {
  await delay();
  const invoice = requireInvoice(invoiceId);
  if (invoice.status !== "DRAFT") throw new Error("Chỉ hóa đơn nháp mới có thể phát hành.");
  invoice.status = "UNPAID";
  invoice.issuedAt = new Date().toISOString();
  invoice.updatedAt = invoice.issuedAt;
  return clone(invoice);
};

const cancel = async (invoiceId: string): Promise<AccountantInvoice> => {
  await delay();
  const invoice = requireInvoice(invoiceId);
  if (!(["DRAFT", "UNPAID"] as const).includes(invoice.status as "DRAFT" | "UNPAID") || invoice.paidAmount > 0) {
    throw new Error("Hóa đơn đã có thanh toán hoặc không còn ở trạng thái có thể hủy.");
  }
  invoice.status = "CANCELLED";
  invoice.updatedAt = new Date().toISOString();
  return clone(invoice);
};

const recordPayment = async (
  input: RecordInvoicePaymentInput,
): Promise<{ invoice: AccountantInvoice; payment: AccountantInvoicePayment }> => {
  await delay();
  const invoice = requireInvoice(input.invoiceId);
  if (["DRAFT", "PAID", "CANCELLED"].includes(invoice.status)) {
    throw new Error("Hóa đơn không ở trạng thái có thể ghi nhận thanh toán.");
  }
  if (input.amount <= 0 || input.amount > invoice.remainingAmount) {
    throw new Error("Số tiền thanh toán không hợp lệ.");
  }
  const payment: AccountantInvoicePayment = {
    id: `payment-${Date.now()}`,
    invoiceId: invoice.id,
    amount: input.amount,
    method: input.method,
    referenceCode: input.referenceCode || null,
    note: input.note || null,
    paidAt: input.paidAt,
    recordedBy: input.recordedBy,
    status: "SUCCESS",
  };
  invoice.payments.unshift(payment);
  invoice.paidAmount += input.amount;
  invoice.remainingAmount = Math.max(0, invoice.totalAmount - invoice.paidAmount);
  invoice.status = invoiceStatusAfterPayment(invoice);
  invoice.updatedAt = new Date().toISOString();
  return { invoice: clone(invoice), payment: clone(payment) };
};

const updatePayment = async (input: UpdateInvoicePaymentInput): Promise<AccountantInvoicePayment> => {
  await delay();
  for (const invoice of invoices) {
    const payment = invoice.payments.find((item) => item.id === input.paymentId);
    if (payment) {
      if (payment.status === "VOIDED") throw new Error("Không thể sửa giao dịch đã hủy.");
      payment.referenceCode = input.referenceCode.trim() || null;
      payment.note = input.note.trim() || null;
      invoice.updatedAt = new Date().toISOString();
      return clone(payment);
    }
  }
  throw new Error("Không tìm thấy giao dịch thanh toán.");
};

const voidPayment = async (paymentId: string): Promise<AccountantInvoice> => {
  await delay();
  for (const invoice of invoices) {
    const payment = invoice.payments.find((item) => item.id === paymentId);
    if (payment) {
      if (payment.status === "VOIDED") throw new Error("Giao dịch đã được hủy trước đó.");
      payment.status = "VOIDED";
      invoice.paidAmount = Math.max(0, invoice.paidAmount - payment.amount);
      invoice.remainingAmount = invoice.totalAmount - invoice.paidAmount;
      invoice.status = invoiceStatusAfterPayment(invoice);
      invoice.updatedAt = new Date().toISOString();
      return clone(invoice);
    }
  }
  throw new Error("Không tìm thấy giao dịch thanh toán.");
};

const getSnapshot = (): AccountantInvoice[] => clone(invoices);
const resetMockData = async (): Promise<void> => {
  await delay();
  invoices = cloneAccountantInvoiceMocks();
};

export const accountantInvoicesApi = {
  getList,
  getById,
  issue,
  cancel,
  recordPayment,
  updatePayment,
  voidPayment,
  getSnapshot,
  resetMockData,
};
