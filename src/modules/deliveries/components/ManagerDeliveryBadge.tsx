import type {
  ManagerDeliveryPriority,
  ManagerDeliveryStatus,
  ManagerDeliveryTaskType,
} from "@/modules/deliveries/types/manager-delivery.types";

const statusLabels: Record<
  ManagerDeliveryStatus,
  string
> = {
  SCHEDULED: "Đã lên lịch",
  PREPARING: "Đang chuẩn bị",
  READY: "Sẵn sàng",
  IN_TRANSIT: "Đang di chuyển",
  ARRIVED: "Đã đến nơi",
  COMPLETED: "Hoàn thành",
  DELAYED: "Bị trễ",
  CANCELLED: "Đã hủy",
};

const statusClasses: Record<
  ManagerDeliveryStatus,
  string
> = {
  SCHEDULED:
    "border-slate-200 bg-slate-50 text-slate-600",

  PREPARING:
    "border-blue-200 bg-blue-50 text-blue-700",

  READY:
    "border-blue-200 bg-blue-50 text-blue-700",

  IN_TRANSIT:
    "border-blue-200 bg-blue-50 text-blue-700",

  ARRIVED:
    "border-blue-200 bg-blue-50 text-blue-700",

  COMPLETED:
    "border-slate-200 bg-slate-50 text-slate-600",

  DELAYED:
    "border-rose-200 bg-rose-50 text-rose-700",

  CANCELLED:
    "border-slate-200 bg-slate-50 text-slate-500",
};

const priorityLabels: Record<
  ManagerDeliveryPriority,
  string
> = {
  URGENT: "Khẩn cấp",
  HIGH: "Ưu tiên cao",
  NORMAL: "Bình thường",
};

const priorityClasses: Record<
  ManagerDeliveryPriority,
  string
> = {
  URGENT:
    "border-rose-200 bg-rose-50 text-rose-700",

  HIGH:
    "border-blue-200 bg-blue-50 text-blue-700",

  NORMAL:
    "border-slate-200 bg-slate-50 text-slate-600",
};

const typeLabels: Record<
  ManagerDeliveryTaskType,
  string
> = {
  DELIVERY: "Giao thiết bị",
  RETURN: "Nhận trả",
};

interface ManagerDeliveryStatusBadgeProps {
  status: ManagerDeliveryStatus;
}

export const ManagerDeliveryStatusBadge = ({
  status,
}: ManagerDeliveryStatusBadgeProps) => (
  <span
    className={[
      "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
      statusClasses[status],
    ].join(" ")}
  >
    {statusLabels[status]}
  </span>
);

interface ManagerDeliveryPriorityBadgeProps {
  priority: ManagerDeliveryPriority;
}

export const ManagerDeliveryPriorityBadge = ({
  priority,
}: ManagerDeliveryPriorityBadgeProps) => (
  <span
    className={[
      "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
      priorityClasses[priority],
    ].join(" ")}
  >
    {priorityLabels[priority]}
  </span>
);

interface ManagerDeliveryTypeBadgeProps {
  type: ManagerDeliveryTaskType;
}

export const ManagerDeliveryTypeBadge = ({
  type,
}: ManagerDeliveryTypeBadgeProps) => (
  <span className="inline-flex whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
    {typeLabels[type]}
  </span>
);
