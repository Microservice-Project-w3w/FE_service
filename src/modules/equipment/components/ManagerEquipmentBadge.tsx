import type {
  ManagerEquipmentCondition,
  ManagerEquipmentStatus,
  ManagerMaintenanceStatus,
} from "@/modules/equipment/types/manager-equipment.types";

const statusLabels: Record<
  ManagerEquipmentStatus,
  string
> = {
  AVAILABLE: "Khả dụng",
  RENTED: "Đang cho thuê",
  RESERVED: "Đã giữ chỗ",
  MAINTENANCE: "Đang bảo trì",
  DAMAGED: "Hư hỏng",
};

const statusClasses: Record<
  ManagerEquipmentStatus,
  string
> = {
  AVAILABLE:
    "border-blue-200 bg-blue-50 text-blue-700",

  RENTED:
    "border-slate-200 bg-slate-50 text-slate-600",

  RESERVED:
    "border-blue-200 bg-blue-50 text-blue-700",

  MAINTENANCE:
    "border-slate-200 bg-slate-50 text-slate-600",

  DAMAGED:
    "border-rose-200 bg-rose-50 text-rose-700",
};

const conditionLabels: Record<
  ManagerEquipmentCondition,
  string
> = {
  GOOD: "Tốt",

  NEEDS_INSPECTION:
    "Cần kiểm tra",

  DAMAGED: "Hư hỏng",
};

const conditionClasses: Record<
  ManagerEquipmentCondition,
  string
> = {
  GOOD:
    "border-slate-200 bg-slate-50 text-slate-600",

  NEEDS_INSPECTION:
    "border-blue-200 bg-blue-50 text-blue-700",

  DAMAGED:
    "border-rose-200 bg-rose-50 text-rose-700",
};

const maintenanceLabels: Record<
  ManagerMaintenanceStatus,
  string
> = {
  COMPLETED: "Hoàn thành",
  SCHEDULED: "Đã lên lịch",
  OVERDUE: "Quá hạn",
};

const maintenanceClasses: Record<
  ManagerMaintenanceStatus,
  string
> = {
  COMPLETED:
    "border-slate-200 bg-slate-50 text-slate-600",

  SCHEDULED:
    "border-blue-200 bg-blue-50 text-blue-700",

  OVERDUE:
    "border-rose-200 bg-rose-50 text-rose-700",
};

export const ManagerEquipmentStatusBadge = ({
  status,
}: {
  status: ManagerEquipmentStatus;
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

export const ManagerEquipmentConditionBadge = ({
  condition,
}: {
  condition:
    ManagerEquipmentCondition;
}) => (
  <span
    className={[
      "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
      conditionClasses[
        condition
      ],
    ].join(" ")}
  >
    {
      conditionLabels[
        condition
      ]
    }
  </span>
);

export const ManagerMaintenanceStatusBadge = ({
  status,
}: {
  status:
    ManagerMaintenanceStatus;
}) => (
  <span
    className={[
      "inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
      maintenanceClasses[
        status
      ],
    ].join(" ")}
  >
    {
      maintenanceLabels[
        status
      ]
    }
  </span>
);
