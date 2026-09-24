import { ApiError } from "@/core/api";
import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import { accountantInvoicesApi } from "@/modules/invoices";
import { accountantPaymentsApi } from "@/modules/payments";
import type {
  AccountantDebtAgingData,
  AccountantDebtAgingRow,
  AccountantReceivable,
  AccountantReceivableListData,
  AccountantReceivableStatus,
} from "@/modules/receivables/types/accountant-receivable.types";

interface DebtDto {
  id: number;
  organizationId: number;
  branchId: number;
  customerId: number;
  invoiceId: number;
  amount: number;
  remainingAmount: number;
  dueAt: string;
  reason: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const BASE_PATH = "/api/v1/billing/debts";

const requireList = (value: unknown): DebtDto[] => {
  if (!Array.isArray(value)) {
    throw new ApiError("Unexpected debt list response", { code: "DEBT_CONTRACT_INVALID" });
  }
  return value as DebtDto[];
};

const mapStatus = (debt: DebtDto): AccountantReceivableStatus => {
  if (Number(debt.remainingAmount) <= 0 || debt.status === "PAID" || debt.status === "SETTLED") return "PAID";
  if (new Date(debt.dueAt).getTime() < Date.now() || debt.status === "OVERDUE") return "OVERDUE";
  if (Number(debt.remainingAmount) < Number(debt.amount)) return "PARTIALLY_PAID";
  return "UNPAID";
};

const loadReceivable = async (debt: DebtDto): Promise<AccountantReceivable> => {
  const [invoice, paymentData] = await Promise.all([
    accountantInvoicesApi.getById(String(debt.invoiceId)),
    accountantPaymentsApi.getList(),
  ]);
  return {
    id: String(debt.id),
    invoiceId: String(debt.invoiceId),
    receivableCode: `DEBT-${debt.id}`,
    invoiceCode: invoice.invoiceCode || `Invoice #${debt.invoiceId}`,
    rentalCode: invoice.rentalCode || `Order #${invoice.rentalId}`,
    contractCode: invoice.contractCode,
    branchId: String(debt.branchId),
    branchName: invoice.branchName || `Branch #${debt.branchId}`,
    customerId: String(debt.customerId),
    customerName: invoice.customerName || `Customer #${debt.customerId}`,
    customerPhone: invoice.customerPhone,
    customerEmail: invoice.customerEmail,
    totalAmount: Number(debt.amount),
    paidAmount: Math.max(0, Number(debt.amount) - Number(debt.remainingAmount)),
    outstandingAmount: Number(debt.remainingAmount),
    dueDate: debt.dueAt,
    status: mapStatus(debt),
    note: debt.reason,
    updatedAt: debt.updatedAt,
    payments: paymentData.payments
      .filter((payment) => payment.invoiceId === String(debt.invoiceId))
      .filter((payment) => payment.status === "SUCCESS" || payment.status === "VOIDED")
      .map((payment) => ({
        id: payment.id,
        invoiceId: payment.invoiceId,
        amount: payment.amount,
        method: payment.method,
        referenceCode: payment.referenceCode,
        paidAt: payment.paidAt,
        recordedBy: payment.recordedBy,
        status: payment.status === "VOIDED" ? "VOIDED" as const : "SUCCESS" as const,
        note: payment.note,
      })),
  };
};

const summarize = (receivables: AccountantReceivable[]) => {
  const dueSoonLimit = Date.now() + 7 * 24 * 60 * 60 * 1000;
  return {
    totalAmount: receivables.reduce((sum, item) => sum + item.totalAmount, 0),
    paidAmount: receivables.reduce((sum, item) => sum + item.paidAmount, 0),
    outstandingAmount: receivables.reduce((sum, item) => sum + item.outstandingAmount, 0),
    overdueAmount: receivables.filter((item) => item.status === "OVERDUE").reduce((sum, item) => sum + item.outstandingAmount, 0),
    dueSoonAmount: receivables
      .filter((item) => item.status !== "PAID" && new Date(item.dueDate).getTime() >= Date.now() && new Date(item.dueDate).getTime() <= dueSoonLimit)
      .reduce((sum, item) => sum + item.outstandingAmount, 0),
  };
};

const getList = async (): Promise<AccountantReceivableListData> => {
  const debts = requireList(await authenticatedRequest<DebtDto[]>("GET", BASE_PATH));
  const receivables = await Promise.all(debts.map(loadReceivable));
  return { receivables, summary: summarize(receivables) };
};

const getById = async (id: string): Promise<AccountantReceivable> =>
  loadReceivable(await authenticatedRequest<DebtDto>("GET", `${BASE_PATH}/${id}`));

const getAging = async (): Promise<AccountantDebtAgingData> => {
  const { receivables } = await getList();
  const grouped = new Map<string, AccountantDebtAgingRow>();
  const now = Date.now();
  for (const item of receivables.filter(({ outstandingAmount }) => outstandingAmount > 0)) {
    const daysOverdue = Math.floor((now - new Date(item.dueDate).getTime()) / 86_400_000);
    const row = grouped.get(item.customerId) ?? { customerId: item.customerId, customerName: item.customerName, totalDebt: 0, currentAmount: 0, oneToThirtyDays: 0, overThirtyDays: 0, invoiceCount: 0, status: "GOOD" };
    row.totalDebt += item.outstandingAmount;
    row.invoiceCount += 1;
    if (daysOverdue <= 0) row.currentAmount += item.outstandingAmount;
    else if (daysOverdue <= 30) row.oneToThirtyDays += item.outstandingAmount;
    else row.overThirtyDays += item.outstandingAmount;
    row.status = row.overThirtyDays > 0 ? "CRITICAL" : row.oneToThirtyDays > 0 ? "WARNING" : "GOOD";
    grouped.set(item.customerId, row);
  }
  const rows = [...grouped.values()];
  return {
    rows,
    totalDebt: rows.reduce((sum, row) => sum + row.totalDebt, 0),
    currentAmount: rows.reduce((sum, row) => sum + row.currentAmount, 0),
    oneToThirtyDays: rows.reduce((sum, row) => sum + row.oneToThirtyDays, 0),
    overThirtyDays: rows.reduce((sum, row) => sum + row.overThirtyDays, 0),
  };
};

const updateNote = async (): Promise<never> => {
  throw new ApiError("Backend does not provide a debt note update endpoint", { code: "DEBT_NOTE_UNSUPPORTED" });
};

export const accountantReceivablesApi = { getList, getById, getAging, getDebtAging: getAging, updateNote };
