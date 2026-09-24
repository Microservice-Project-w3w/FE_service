import { accountantReceivablesApi } from "@/modules/receivables/api/accountant-receivables.api";
import type { AccountantReceivable } from "@/modules/receivables/types/accountant-receivable.types";
import type {
  GetManagerReceivablesInput, ManagerReceivable, ManagerReceivableListData,
} from "@/modules/receivables/types/manager-receivable.types";

const toManager = (item: AccountantReceivable, organizationId: string): ManagerReceivable => ({
  id: item.id, organizationId, branchId: item.branchId, branchName: item.branchName,
  receivableCode: item.receivableCode, invoiceCode: item.invoiceCode,
  rentalId: "", rentalCode: item.rentalCode, contractId: null,
  contractCode: item.contractCode, customerId: item.customerId,
  customerName: item.customerName, customerPhone: item.customerPhone,
  customerEmail: item.customerEmail, totalAmount: item.totalAmount,
  paidAmount: item.paidAmount, outstandingAmount: item.outstandingAmount,
  dueDate: item.dueDate, status: item.status,
  priority: item.status === "OVERDUE" ? "URGENT" : "NORMAL",
  lastPaymentAt: item.payments.at(-1)?.paidAt ?? null, note: item.note,
  createdAt: item.updatedAt, updatedAt: item.updatedAt,
  transactions: item.payments.map((payment) => ({
    id: payment.id, amount: payment.amount,
    method: payment.method === "CASH" || payment.method === "BANK_TRANSFER"
      ? payment.method : "CARD",
    referenceCode: payment.referenceCode, note: payment.note, paidAt: payment.paidAt,
  })),
});
const summarize = (items: ManagerReceivable[]) => {
  const dueSoon = Date.now() + 3 * 86_400_000;
  return {
    totalBilledAmount: items.reduce((sum, item) => sum + item.totalAmount, 0),
    paidAmount: items.reduce((sum, item) => sum + item.paidAmount, 0),
    outstandingAmount: items.reduce((sum, item) => sum + item.outstandingAmount, 0),
    overdueAmount: items.filter((item) => item.status === "OVERDUE")
      .reduce((sum, item) => sum + item.outstandingAmount, 0),
    dueSoonAmount: items.filter((item) =>
      item.status !== "PAID" && item.status !== "OVERDUE" &&
      new Date(item.dueDate).getTime() <= dueSoon,
    ).reduce((sum, item) => sum + item.outstandingAmount, 0),
    overdueCount: items.filter((item) => item.status === "OVERDUE").length,
  };
};
let lastOrganizationId = "";

export const managerReceivablesApi = {
  async getList(input: GetManagerReceivablesInput): Promise<ManagerReceivableListData> {
    lastOrganizationId = input.organizationId;
    const allowed = new Set(input.selectedScopeId === "ALL"
      ? input.assignedBranchIds : [input.selectedScopeId]);
    const data = await accountantReceivablesApi.getList();
    const receivables = data.receivables.map((item) => toManager(item, input.organizationId))
      .filter((item) => allowed.has(item.branchId))
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    return { summary: summarize(receivables), receivables, generatedAt: new Date().toISOString() };
  },
  async getById(receivableId: string): Promise<ManagerReceivable> {
    if (!lastOrganizationId) throw new Error("Hãy tải danh sách công nợ trước khi xem chi tiết.");
    return toManager(await accountantReceivablesApi.getById(receivableId), lastOrganizationId);
  },
  async resetMockData(): Promise<void> {
    throw new Error("Khôi phục dữ liệu mẫu đã bị vô hiệu hóa.");
  },
};
