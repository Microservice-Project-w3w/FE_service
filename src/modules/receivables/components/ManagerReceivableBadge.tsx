import type {
  ManagerReceivablePriority,
  ManagerReceivableStatus,
} from "@/modules/receivables/types/manager-receivable.types";

const statusLabels: Record<
  ManagerReceivableStatus,
  string
> = {
  UNPAID:
    "Chưa thanh toán",

  PARTIALLY_PAID:
    "Thanh toán một phần",

  PAID:
    "Đã thanh toán",

  OVERDUE:
    "Quá hạn",
};

const statusClasses: Record<
  ManagerReceivableStatus,
  string
> = {
  UNPAID:
    "border-slate-200 bg-slate-50 text-slate-600",

  PARTIALLY_PAID:
    "border-blue-200 bg-blue-50 text-blue-700",

  PAID:
    "border-blue-200 bg-blue-50 text-blue-700",

  OVERDUE:
    "border-rose-200 bg-rose-50 text-rose-700",
};

const priorityLabels: Record<
  ManagerReceivablePriority,
  string
> = {
  URGENT: "Khẩn cấp",
  HIGH: "Ưu tiên cao",
  NORMAL: "Bình thường",
};

const priorityClasses: Record<
  ManagerReceivablePriority,
  string
> = {
  URGENT:
    "border-rose-200 bg-rose-50 text-rose-700",

  HIGH:
    "border-blue-200 bg-blue-50 text-blue-700",

  NORMAL:
    "border-slate-200 bg-slate-50 text-slate-600",
};

export const ManagerReceivableStatusBadge = ({
  status,
}: {
  status:
    ManagerReceivableStatus;
}) => (
  <span
    className={[
      "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
      statusClasses[status],
    ].join(" ")}
  >
    {statusLabels[status]}
  </span>
);

export const ManagerReceivablePriorityBadge = ({
  priority,
}: {
  priority:
    ManagerReceivablePriority;
}) => (
  <span
    className={[
      "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
      priorityClasses[
        priority
      ],
    ].join(" ")}
  >
    {
      priorityLabels[
        priority
      ]
    }
  </span>
);
