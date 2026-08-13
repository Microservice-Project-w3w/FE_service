import { accountantInvoicesApi, type AccountantInvoice } from "@/modules/invoices";
import type {
  AccountantDebtAgingData,
  AccountantDebtAgingRow,
  AccountantReceivable,
  AccountantReceivableListData,
  AccountantReceivableStatus,
  AccountantReceivableSummary,
} from "@/modules/receivables/types/accountant-receivable.types";

const MOCK_DELAY_MS = 180;
const MOCK_NOW = new Date("2026-08-13T12:00:00+07:00");
const receivableNotes: Record<string, string | null> = {};
const delay = () => new Promise<void>((resolve) => window.setTimeout(resolve, MOCK_DELAY_MS));
const clone = <T,>(value: T): T => structuredClone(value);

const mapStatus = (invoice: AccountantInvoice): AccountantReceivableStatus => {
  if (invoice.status === "PAID") return "PAID";
  if (invoice.status === "OVERDUE") return "OVERDUE";
  return invoice.paidAmount > 0 ? "PARTIALLY_PAID" : "UNPAID";
};

const mapInvoice = (invoice: AccountantInvoice): AccountantReceivable => ({
  id: `receivable-${invoice.id}`,
  invoiceId: invoice.id,
  receivableCode: invoice.invoiceCode.replace("INV-", "CN-"),
  invoiceCode: invoice.invoiceCode,
  rentalCode: invoice.rentalCode,
  contractCode: invoice.contractCode,
  branchId: invoice.branchId,
  branchName: invoice.branchName,
  customerId: invoice.customerId,
  customerName: invoice.customerName,
  customerPhone: invoice.customerPhone,
  customerEmail: invoice.customerEmail,
  totalAmount: invoice.totalAmount,
  paidAmount: invoice.paidAmount,
  outstandingAmount: invoice.remainingAmount,
  dueDate: invoice.dueDate,
  status: mapStatus(invoice),
  note: receivableNotes[invoice.id] ?? invoice.note,
  updatedAt: invoice.updatedAt,
  payments: invoice.payments,
});

const snapshot = (): AccountantReceivable[] => accountantInvoicesApi.getSnapshot()
  .filter((invoice) => !["DRAFT", "CANCELLED"].includes(invoice.status))
  .map(mapInvoice)
  .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

const summary = (items: AccountantReceivable[]): AccountantReceivableSummary => {
  const dueSoonLimit = new Date(MOCK_NOW); dueSoonLimit.setDate(dueSoonLimit.getDate() + 7);
  return {
    totalAmount: items.reduce((total, item) => total + item.totalAmount, 0),
    paidAmount: items.reduce((total, item) => total + item.paidAmount, 0),
    outstandingAmount: items.reduce((total, item) => total + item.outstandingAmount, 0),
    overdueAmount: items.filter((item) => item.status === "OVERDUE").reduce((total, item) => total + item.outstandingAmount, 0),
    dueSoonAmount: items.filter((item) => item.status !== "PAID" && new Date(item.dueDate) >= MOCK_NOW && new Date(item.dueDate) <= dueSoonLimit).reduce((total, item) => total + item.outstandingAmount, 0),
  };
};

const getList = async (): Promise<AccountantReceivableListData> => {
  await delay(); const receivables = snapshot(); return { receivables: clone(receivables), summary: summary(receivables) };
};
const getById = async (receivableId: string): Promise<AccountantReceivable> => {
  await delay(); const item = snapshot().find((receivable) => receivable.id === receivableId);
  if (!item) throw new Error("Không tìm thấy công nợ."); return clone(item);
};
const updateNote = async (invoiceId: string, note: string): Promise<AccountantReceivable> => {
  await delay(); if (note.trim().length > 300) throw new Error("Ghi chú tối đa 300 ký tự."); receivableNotes[invoiceId] = note.trim() || null;
  const item = snapshot().find((receivable) => receivable.invoiceId === invoiceId);
  if (!item) throw new Error("Không tìm thấy công nợ."); return clone(item);
};

const getDebtAging = async (): Promise<AccountantDebtAgingData> => {
  await delay(); const groups = new Map<string, AccountantDebtAgingRow>();
  for (const item of snapshot().filter((receivable) => receivable.outstandingAmount > 0)) {
    const row = groups.get(item.customerId) ?? { customerId: item.customerId, customerName: item.customerName, totalDebt: 0, currentAmount: 0, oneToThirtyDays: 0, overThirtyDays: 0, invoiceCount: 0, status: "GOOD" };
    const overdueDays = Math.max(0, Math.floor((MOCK_NOW.getTime() - new Date(item.dueDate).getTime()) / 86_400_000));
    row.totalDebt += item.outstandingAmount; row.invoiceCount += 1;
    if (overdueDays === 0) row.currentAmount += item.outstandingAmount;
    else if (overdueDays <= 30) row.oneToThirtyDays += item.outstandingAmount;
    else row.overThirtyDays += item.outstandingAmount;
    row.status = row.overThirtyDays > 0 ? "CRITICAL" : row.oneToThirtyDays > 0 ? "WARNING" : "GOOD";
    groups.set(item.customerId, row);
  }
  const rows = [...groups.values()].sort((a, b) => b.totalDebt - a.totalDebt);
  return { rows: clone(rows), totalDebt: rows.reduce((t, r) => t + r.totalDebt, 0), currentAmount: rows.reduce((t, r) => t + r.currentAmount, 0), oneToThirtyDays: rows.reduce((t, r) => t + r.oneToThirtyDays, 0), overThirtyDays: rows.reduce((t, r) => t + r.overThirtyDays, 0) };
};

export const accountantReceivablesApi = { getList, getById, updateNote, getDebtAging };
