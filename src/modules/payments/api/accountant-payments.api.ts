import {
  accountantInvoicesApi,
  type AccountantInvoice,
  type AccountantInvoicePayment,
} from "@/modules/invoices";
import {
  cloneAccountantExternalPayments,
  initialDepositRefunds,
} from "@/modules/payments/mocks/accountant-payments.mock";
import type {
  AccountantDeposit,
  AccountantDepositListData,
  AccountantDepositStatus,
  AccountantPayment,
  AccountantPaymentListData,
  AccountantPaymentSummary,
  RecordAccountantPaymentInput,
  UpdateAccountantPaymentInput,
} from "@/modules/payments/types/accountant-payment.types";

const MOCK_DELAY_MS = 180;
const TODAY = "2026-08-13";
let externalPayments = cloneAccountantExternalPayments();
let depositRefunds = structuredClone(initialDepositRefunds);

const delay = () => new Promise<void>((resolve) => window.setTimeout(resolve, MOCK_DELAY_MS));
const clone = <T,>(value: T): T => structuredClone(value);

const mapInvoicePayment = (
  payment: AccountantInvoicePayment,
  invoice: AccountantInvoice,
): AccountantPayment => ({
  id: payment.id,
  invoiceId: invoice.id,
  invoiceCode: invoice.invoiceCode,
  customerName: invoice.customerName,
  branchId: invoice.branchId,
  branchName: invoice.branchName,
  amount: payment.amount,
  method: payment.method,
  referenceCode: payment.referenceCode,
  paidAt: payment.paidAt,
  recordedBy: payment.recordedBy,
  status: payment.status,
  source: "MANUAL",
  note: payment.note,
});

const snapshotPayments = (): AccountantPayment[] => {
  const invoicePayments = accountantInvoicesApi.getSnapshot().flatMap((invoice) =>
    invoice.payments.map((payment) => mapInvoicePayment(payment, invoice)),
  );
  return [...invoicePayments, ...externalPayments].sort((a, b) => b.paidAt.localeCompare(a.paidAt));
};

const getSummary = (payments: AccountantPayment[]): AccountantPaymentSummary => {
  const successful = payments.filter((payment) => payment.status === "SUCCESS");
  return {
    collectedAmount: successful.reduce((total, payment) => total + payment.amount, 0),
    collectedToday: successful.filter((payment) => payment.paidAt.startsWith(TODAY)).reduce((total, payment) => total + payment.amount, 0),
    successCount: successful.length,
    pendingCount: payments.filter((payment) => payment.status === "PENDING").length,
    failedOrVoidedCount: payments.filter((payment) => ["FAILED", "VOIDED"].includes(payment.status)).length,
  };
};

const getList = async (): Promise<AccountantPaymentListData> => {
  await delay();
  const payments = snapshotPayments();
  const payableInvoices = accountantInvoicesApi.getSnapshot().filter((invoice) =>
    !["DRAFT", "PAID", "CANCELLED"].includes(invoice.status) && invoice.remainingAmount > 0,
  );
  return { payments: clone(payments), summary: getSummary(payments), payableInvoices: clone(payableInvoices) };
};

const getById = async (paymentId: string): Promise<AccountantPayment> => {
  await delay();
  const payment = snapshotPayments().find((item) => item.id === paymentId);
  if (!payment) throw new Error("Không tìm thấy giao dịch thanh toán.");
  return clone(payment);
};

const record = async (input: RecordAccountantPaymentInput): Promise<AccountantPayment> => {
  const result = await accountantInvoicesApi.recordPayment(input);
  const invoice = accountantInvoicesApi.getSnapshot().find((item) => item.id === input.invoiceId);
  if (!invoice) throw new Error("Không thể đồng bộ hóa đơn sau thanh toán.");
  return mapInvoicePayment(result.payment, invoice);
};

const update = async (input: UpdateAccountantPaymentInput): Promise<AccountantPayment> => {
  const invoicePayment = accountantInvoicesApi.getSnapshot().some((invoice) => invoice.payments.some((payment) => payment.id === input.paymentId));
  if (invoicePayment) await accountantInvoicesApi.updatePayment(input);
  else {
    await delay();
    const payment = externalPayments.find((item) => item.id === input.paymentId);
    if (!payment) throw new Error("Không tìm thấy giao dịch thanh toán.");
    if (payment.status === "VOIDED") throw new Error("Không thể sửa giao dịch đã hủy.");
    payment.referenceCode = input.referenceCode.trim() || null;
    payment.note = input.note.trim() || null;
  }
  return getById(input.paymentId);
};

const voidPayment = async (paymentId: string): Promise<void> => {
  const invoicePayment = accountantInvoicesApi.getSnapshot().some((invoice) => invoice.payments.some((payment) => payment.id === paymentId));
  if (invoicePayment) {
    await accountantInvoicesApi.voidPayment(paymentId);
    return;
  }
  await delay();
  const payment = externalPayments.find((item) => item.id === paymentId);
  if (!payment) throw new Error("Không tìm thấy giao dịch thanh toán.");
  if (payment.status === "VOIDED") throw new Error("Giao dịch đã được hủy.");
  payment.status = "VOIDED";
};

const getDepositStatus = (held: number, refunded: number): AccountantDepositStatus => {
  if (held === 0) return "PENDING";
  if (refunded === 0) return "HELD";
  return refunded >= held ? "REFUNDED" : "PARTIALLY_REFUNDED";
};

const getDeposits = async (): Promise<AccountantDepositListData> => {
  await delay();
  const deposits = accountantInvoicesApi.getSnapshot()
    .filter((invoice) => invoice.depositAmount > 0 && invoice.status !== "CANCELLED")
    .map((invoice): AccountantDeposit => {
      const heldAmount = Math.min(invoice.depositAmount, invoice.paidAmount);
      const refundedAmount = Math.min(depositRefunds[invoice.id] ?? 0, heldAmount);
      return {
        id: `deposit-${invoice.id}`,
        invoiceId: invoice.id,
        invoiceCode: invoice.invoiceCode,
        rentalCode: invoice.rentalCode,
        customerName: invoice.customerName,
        branchName: invoice.branchName,
        depositAmount: invoice.depositAmount,
        heldAmount,
        refundedAmount,
        status: getDepositStatus(heldAmount, refundedAmount),
        updatedAt: invoice.updatedAt,
      };
    });
  return {
    deposits: clone(deposits),
    summary: {
      totalDeposit: deposits.reduce((total, item) => total + item.depositAmount, 0),
      heldAmount: deposits.reduce((total, item) => total + item.heldAmount, 0),
      refundableAmount: deposits.reduce((total, item) => total + item.heldAmount - item.refundedAmount, 0),
      refundedAmount: deposits.reduce((total, item) => total + item.refundedAmount, 0),
    },
  };
};

const refundDeposit = async (invoiceId: string): Promise<void> => {
  const data = await getDeposits();
  const deposit = data.deposits.find((item) => item.invoiceId === invoiceId);
  if (!deposit || deposit.heldAmount <= deposit.refundedAmount) throw new Error("Khoản cọc không còn số dư để hoàn.");
  depositRefunds[invoiceId] = deposit.heldAmount;
};

export const accountantPaymentsApi = { getList, getById, record, update, voidPayment, getDeposits, refundDeposit };
