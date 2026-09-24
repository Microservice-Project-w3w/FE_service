import { ApiError } from "@/core/api";
import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";

export interface RevenueReportDto {
  organizationId: number; branchId: number | null; fromDate: string; toDate: string;
  totalInvoiced: number; totalPaid: number; totalRefunded: number; netRevenue: number;
  invoiceCount: number; paymentCount: number;
}
export interface PaymentReportDto {
  totalAmount: number; confirmedAmount: number; pendingAmount: number;
  cancelledAmount: number; refundedAmount: number;
}
export interface DebtReportDto {
  totalDebt: number; overdueDebt: number; customerCount: number; debtCount: number; overdueDebtCount: number;
}
export interface DepositReportDto {
  totalCollected: number; totalHeld: number; totalDeducted: number; totalRefunded: number; depositCount: number;
}
export interface AccountantBillingReports {
  revenue: RevenueReportDto; payments: PaymentReportDto; debts: DebtReportDto; deposits: DepositReportDto;
}

const query = (organizationId: number, branchId?: number, dates?: { fromDate: string; toDate: string }) => {
  const params = new URLSearchParams({ organizationId: String(organizationId) });
  if (branchId != null) params.set("branchId", String(branchId));
  if (dates) { params.set("fromDate", dates.fromDate); params.set("toDate", dates.toDate); }
  return params.toString();
};

const get = async (organizationId: number, branchId?: number): Promise<AccountantBillingReports> => {
  if (!Number.isFinite(organizationId)) throw new ApiError("Organization scope is unavailable", { code: "REPORT_SCOPE_UNAVAILABLE" });
  const now = new Date();
  const toDate = now.toISOString().slice(0, 10);
  const fromDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 10);
  const datedQuery = query(organizationId, branchId, { fromDate, toDate });
  const scopeQuery = query(organizationId, branchId);
  const [revenue, payments, debts, deposits] = await Promise.all([
    authenticatedRequest<RevenueReportDto>("GET", `/api/v1/billing/reports/revenue?${datedQuery}`),
    authenticatedRequest<PaymentReportDto>("GET", `/api/v1/billing/reports/payments?${datedQuery}`),
    authenticatedRequest<DebtReportDto>("GET", `/api/v1/billing/reports/debts?${scopeQuery}`),
    authenticatedRequest<DepositReportDto>("GET", `/api/v1/billing/reports/deposits?${scopeQuery}`),
  ]);
  return { revenue, payments, debts, deposits };
};

export const accountantBillingReportsApi = { get };
