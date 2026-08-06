import type {
  QuotationApprovalStatus,
  QuotationPriority,
} from "@/modules/quotations/types/manager-quotation-approval.types";

interface QuotationStatusBadgeProps {
  status: QuotationApprovalStatus;
}

interface QuotationPriorityBadgeProps {
  priority: QuotationPriority;
}

const statusLabels: Record<
  QuotationApprovalStatus,
  string
> = {
  PENDING_APPROVAL: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Đã từ chối",
  EXPIRED: "Hết hiệu lực",
};

const statusStyles: Record<
  QuotationApprovalStatus,
  string
> = {
  PENDING_APPROVAL:
    "border-blue-200 bg-blue-50 text-blue-700",
  APPROVED:
    "border-blue-300 bg-blue-100 text-blue-800",
  REJECTED:
    "border-slate-200 bg-slate-100 text-slate-700",
  EXPIRED:
    "border-slate-200 bg-white text-slate-500",
};

const priorityLabels: Record<
  QuotationPriority,
  string
> = {
  URGENT: "Khẩn cấp",
  HIGH: "Ưu tiên cao",
  NORMAL: "Bình thường",
};

const priorityStyles: Record<
  QuotationPriority,
  string
> = {
  URGENT:
    "border-blue-300 bg-blue-100 text-blue-800",
  HIGH:
    "border-blue-200 bg-blue-50 text-blue-700",
  NORMAL:
    "border-slate-200 bg-white text-slate-600",
};

export const QuotationStatusBadge = ({
  status,
}: QuotationStatusBadgeProps) => {
  return (
    <span
      className={[
        "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
        statusStyles[status],
      ].join(" ")}
    >
      {statusLabels[status]}
    </span>
  );
};

export const QuotationPriorityBadge = ({
  priority,
}: QuotationPriorityBadgeProps) => {
  return (
    <span
      className={[
        "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
        priorityStyles[priority],
      ].join(" ")}
    >
      {priorityLabels[priority]}
    </span>
  );
};
