import { ApiError } from "@/core/api";
import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import type { InvoiceDto, InvoicePaymentStatusDto } from "@/modules/invoices/api/accountant-invoice.dto";
import { mapInvoice } from "@/modules/invoices/api/accountant-invoice.mapper";
import type {
  AccountantInvoice, AccountantInvoiceListData, AccountantInvoicePayment,
  RecordInvoicePaymentInput, UpdateInvoicePaymentInput,
} from "@/modules/invoices/types/accountant-invoice.types";

const BASE_PATH = "/api/v1/billing/invoices";

const getPaymentStatus = (invoiceId: number) =>
  authenticatedRequest<InvoicePaymentStatusDto>("GET", `${BASE_PATH}/${invoiceId}/payment-status`);

const loadInvoice = async (invoice: InvoiceDto): Promise<AccountantInvoice> =>
  mapInvoice(invoice, await getPaymentStatus(invoice.id));

const getSummary = (invoices: AccountantInvoice[]) => ({
  totalInvoices: invoices.length,
  unpaidCount: invoices.filter(({ status }) => ["DRAFT", "ISSUED", "UNPAID"].includes(status)).length,
  partiallyPaidCount: invoices.filter(({ status }) => status === "PARTIALLY_PAID").length,
  paidCount: invoices.filter(({ status }) => status === "PAID").length,
  overdueCount: invoices.filter(({ status }) => status === "OVERDUE").length,
  outstandingAmount: invoices
    .filter(({ status }) => status !== "CANCELLED")
    .reduce((total, invoice) => total + invoice.remainingAmount, 0),
});

const getList = async (): Promise<AccountantInvoiceListData> => {
  const response = await authenticatedRequest<InvoiceDto[]>("GET", BASE_PATH);
  if (!Array.isArray(response)) {
    throw new ApiError("Unexpected invoice list response", { code: "INVOICE_CONTRACT_INVALID" });
  }
  const invoices = await Promise.all(response.map(loadInvoice));
  return { invoices, summary: getSummary(invoices) };
};

const getById = async (invoiceId: string): Promise<AccountantInvoice> => {
  const invoice = await authenticatedRequest<InvoiceDto>("GET", `${BASE_PATH}/${invoiceId}`);
  return loadInvoice(invoice);
};

const unsupportedWrite = (): never => {
  throw new ApiError("Invoice write actions are not integrated in this phase", {
    code: "INVOICE_WRITE_NOT_IMPLEMENTED",
  });
};

export const accountantInvoicesApi = {
  getList,
  getById,
  issue: async (_invoiceId: string): Promise<AccountantInvoice> => unsupportedWrite(),
  cancel: async (_invoiceId: string): Promise<AccountantInvoice> => unsupportedWrite(),
  recordPayment: async (_input: RecordInvoicePaymentInput): Promise<{
    invoice: AccountantInvoice; payment: AccountantInvoicePayment;
  }> => unsupportedWrite(),
  updatePayment: async (_input: UpdateInvoicePaymentInput): Promise<AccountantInvoicePayment> => unsupportedWrite(),
  voidPayment: async (_paymentId: string): Promise<AccountantInvoice> => unsupportedWrite(),
  getSnapshot: (): AccountantInvoice[] => [],
  resetMockData: async (): Promise<void> => unsupportedWrite(),
};
