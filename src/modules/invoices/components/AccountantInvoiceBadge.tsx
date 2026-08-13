import type {
  AccountantInvoiceStatus,
} from "@/modules/invoices/types/accountant-invoice.types";

const labels: Record<AccountantInvoiceStatus, string> = {
  DRAFT: "Bản nháp",
  UNPAID: "Chưa thanh toán",
  PARTIALLY_PAID: "Thanh toán một phần",
  PAID: "Đã thanh toán",
  OVERDUE: "Quá hạn",
  CANCELLED: "Đã hủy",
};

const classes: Record<AccountantInvoiceStatus, string> = {
  DRAFT: "border-slate-200 bg-slate-50 text-slate-600",
  UNPAID: "border-amber-200 bg-amber-50 text-amber-700",
  PARTIALLY_PAID: "border-blue-200 bg-blue-50 text-blue-700",
  PAID: "border-emerald-200 bg-emerald-50 text-emerald-700",
  OVERDUE: "border-rose-200 bg-rose-50 text-rose-700",
  CANCELLED: "border-slate-200 bg-slate-100 text-slate-500",
};

export const AccountantInvoiceBadge = ({
  status,
}: {
  status: AccountantInvoiceStatus;
}) => (
  <span
    className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${classes[status]}`}
  >
    {labels[status]}
  </span>
);
