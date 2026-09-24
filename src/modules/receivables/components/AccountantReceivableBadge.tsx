import type { AccountantReceivableStatus } from "@/modules/receivables/types/accountant-receivable.types";
const labels: Record<AccountantReceivableStatus, string> = { UNPAID: "Chưa thanh toán", PARTIALLY_PAID: "Thanh toán một phần", PAID: "Đã thanh toán", OVERDUE: "Quá hạn" };
const classes: Record<AccountantReceivableStatus, string> = {
  UNPAID: "border-amber-200 bg-amber-50 text-amber-700", PARTIALLY_PAID: "border-blue-200 bg-blue-50 text-blue-700",
  PAID: "border-emerald-200 bg-emerald-50 text-emerald-700", OVERDUE: "border-rose-200 bg-rose-50 text-rose-700",
};
export const AccountantReceivableBadge = ({ status }: { status: AccountantReceivableStatus }) => <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${classes[status]}`}>{labels[status]}</span>;
