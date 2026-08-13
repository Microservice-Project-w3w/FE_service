import type {
  AccountantDepositStatus,
  AccountantPaymentStatus,
} from "@/modules/payments/types/accountant-payment.types";

const paymentLabels: Record<AccountantPaymentStatus, string> = {
  SUCCESS: "Thành công", PENDING: "Đang xử lý", FAILED: "Thất bại", VOIDED: "Đã hủy",
};
const paymentClasses: Record<AccountantPaymentStatus, string> = {
  SUCCESS: "border-emerald-200 bg-emerald-50 text-emerald-700",
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  FAILED: "border-rose-200 bg-rose-50 text-rose-700",
  VOIDED: "border-slate-200 bg-slate-100 text-slate-500",
};

export const AccountantPaymentBadge = ({ status }: { status: AccountantPaymentStatus }) => (
  <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${paymentClasses[status]}`}>{paymentLabels[status]}</span>
);

const depositLabels: Record<AccountantDepositStatus, string> = {
  PENDING: "Chờ thu", HELD: "Đang giữ", PARTIALLY_REFUNDED: "Đã hoàn một phần", REFUNDED: "Đã hoàn",
};
const depositClasses: Record<AccountantDepositStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  HELD: "border-blue-200 bg-blue-50 text-blue-700",
  PARTIALLY_REFUNDED: "border-violet-200 bg-violet-50 text-violet-700",
  REFUNDED: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export const AccountantDepositBadge = ({ status }: { status: AccountantDepositStatus }) => (
  <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${depositClasses[status]}`}>{depositLabels[status]}</span>
);
