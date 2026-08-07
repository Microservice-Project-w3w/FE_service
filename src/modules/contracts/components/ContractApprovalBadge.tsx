import type {
  ContractApprovalStatus,
  ContractPriority,
  PaymentMilestoneStatus,
} from "@/modules/contracts/types/manager-contract-approval.types";

interface ContractStatusBadgeProps {
  status: ContractApprovalStatus;
}

interface ContractPriorityBadgeProps {
  priority: ContractPriority;
}

interface PaymentStatusBadgeProps {
  status: PaymentMilestoneStatus;
}

const statusLabels: Record<
  ContractApprovalStatus,
  string
> = {
  PENDING_APPROVAL: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Đã từ chối",
  SIGNED: "Đã ký",
  EXPIRED: "Hết hiệu lực",
};

const statusStyles: Record<
  ContractApprovalStatus,
  string
> = {
  PENDING_APPROVAL:
    "border-blue-200 bg-blue-50 text-blue-700",
  APPROVED:
    "border-blue-300 bg-blue-100 text-blue-800",
  REJECTED:
    "border-slate-200 bg-slate-100 text-slate-700",
  SIGNED:
    "border-blue-300 bg-blue-600 text-white",
  EXPIRED:
    "border-slate-200 bg-white text-slate-500",
};

const priorityLabels: Record<
  ContractPriority,
  string
> = {
  URGENT: "Khẩn cấp",
  HIGH: "Ưu tiên cao",
  NORMAL: "Bình thường",
};

const priorityStyles: Record<
  ContractPriority,
  string
> = {
  URGENT:
    "border-blue-300 bg-blue-100 text-blue-800",
  HIGH:
    "border-blue-200 bg-blue-50 text-blue-700",
  NORMAL:
    "border-slate-200 bg-white text-slate-600",
};

const paymentStatusLabels: Record<
  PaymentMilestoneStatus,
  string
> = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  OVERDUE: "Quá hạn",
};

const paymentStatusStyles: Record<
  PaymentMilestoneStatus,
  string
> = {
  PENDING:
    "border-blue-200 bg-blue-50 text-blue-700",
  PAID:
    "border-blue-300 bg-blue-100 text-blue-800",
  OVERDUE:
    "border-rose-200 bg-rose-50 text-rose-700",
};

export const ContractStatusBadge = ({
  status,
}: ContractStatusBadgeProps) => {
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

export const ContractPriorityBadge = ({
  priority,
}: ContractPriorityBadgeProps) => {
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

export const PaymentStatusBadge = ({
  status,
}: PaymentStatusBadgeProps) => {
  return (
    <span
      className={[
        "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
        paymentStatusStyles[status],
      ].join(" ")}
    >
      {paymentStatusLabels[status]}
    </span>
  );
};
