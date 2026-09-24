import { accountantPaymentsApi, type AccountantPayment } from "@/modules/payments";
import { initialReconciliationNotes, statementAmountOverrides } from "@/modules/reconciliation/mocks/accountant-reconciliation.mock";
import type {
  AccountantReconciliation,
  AccountantReconciliationListData,
  AccountantReconciliationStatus,
  AccountantReconciliationSummary,
  ConfirmReconciliationInput,
} from "@/modules/reconciliation/types/accountant-reconciliation.types";

interface ReconciliationOverride { status: "RECONCILED"; note: string; reconciledAt: string; reconciledBy: string; }
const overrides: Record<string, ReconciliationOverride> = {
  "reconciliation-payment-inv-dn-0019-01": { status: "RECONCILED", note: initialReconciliationNotes["reconciliation-payment-inv-dn-0019-01"], reconciledAt: "2026-08-12T10:00:00+07:00", reconciledBy: "Phạm Thị Kế Toán" },
};
const clone = <T,>(value: T): T => structuredClone(value);

const defaultStatus = (payment: AccountantPayment, difference: number): AccountantReconciliationStatus => {
  if (payment.status === "PENDING" || !payment.referenceCode) return "PENDING";
  return difference === 0 ? "MATCHED" : "MISMATCH";
};

const mapPayment = (payment: AccountantPayment): AccountantReconciliation => {
  const id = `reconciliation-${payment.id}`;
  const statementAmount = statementAmountOverrides[payment.id] ?? payment.amount;
  const differenceAmount = statementAmount - payment.amount;
  const override = overrides[id];
  return {
    id,
    paymentId: payment.id,
    invoiceCode: payment.invoiceCode,
    customerName: payment.customerName,
    branchId: payment.branchId,
    branchName: payment.branchName,
    expectedAmount: payment.amount,
    statementAmount,
    differenceAmount,
    referenceCode: payment.referenceCode,
    transactionDate: payment.paidAt,
    status: override?.status ?? defaultStatus(payment, differenceAmount),
    paymentMethod: payment.method,
    resolutionNote: override?.note ?? null,
    reconciledAt: override?.reconciledAt ?? null,
    reconciledBy: override?.reconciledBy ?? null,
  };
};

const snapshot = async (): Promise<AccountantReconciliation[]> => {
  const paymentData = await accountantPaymentsApi.getList();
  return paymentData.payments
    .filter((payment) => payment.status !== "FAILED" && payment.status !== "VOIDED" && payment.method !== "CASH")
    .map(mapPayment)
    .sort((a, b) => b.transactionDate.localeCompare(a.transactionDate));
};

const getSummary = (items: AccountantReconciliation[]): AccountantReconciliationSummary => ({
  pendingCount: items.filter((item) => item.status === "PENDING").length,
  matchedCount: items.filter((item) => item.status === "MATCHED").length,
  mismatchCount: items.filter((item) => item.status === "MISMATCH").length,
  reconciledCount: items.filter((item) => item.status === "RECONCILED").length,
  differenceAmount: items.filter((item) => item.status === "MISMATCH").reduce((total, item) => total + Math.abs(item.differenceAmount), 0),
});

const getList = async (): Promise<AccountantReconciliationListData> => {
  const reconciliations = await snapshot(); return { reconciliations: clone(reconciliations), summary: getSummary(reconciliations) };
};
const getById = async (id: string): Promise<AccountantReconciliation> => {
  const item = (await snapshot()).find((reconciliation) => reconciliation.id === id);
  if (!item) throw new Error("Không tìm thấy giao dịch đối soát."); return clone(item);
};
const confirm = async (input: ConfirmReconciliationInput): Promise<AccountantReconciliation> => {
  const item = await getById(input.reconciliationId);
  if (item.status === "PENDING") throw new Error("Giao dịch đang chờ dữ liệu ngân hàng, chưa thể đối soát.");
  if (item.status === "RECONCILED") throw new Error("Giao dịch đã được đối soát.");
  if (item.status === "MISMATCH" && input.note.trim().length < 5) throw new Error("Giao dịch lệch cần ghi rõ cách xử lý (tối thiểu 5 ký tự).");
  overrides[item.id] = { status: "RECONCILED", note: input.note.trim() || "Đã kiểm tra và xác nhận giao dịch khớp.", reconciledAt: new Date().toISOString(), reconciledBy: input.reconciledBy };
  return getById(item.id);
};

export const accountantReconciliationApi = { getList, getById, confirm };
