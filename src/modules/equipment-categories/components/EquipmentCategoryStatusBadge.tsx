import type {
  EquipmentCategoryStatus,
} from "@/modules/equipment-categories/types/equipment-category.types";

interface EquipmentCategoryStatusBadgeProps {
  status: EquipmentCategoryStatus;
}

const statusConfig: Record<
  EquipmentCategoryStatus,
  {
    label: string;
    dotClassName: string;
  }
> = {
  ACTIVE: {
    label: "Đang hoạt động",
    dotClassName: "bg-emerald-500",
  },

  INACTIVE: {
    label: "Ngừng hoạt động",
    dotClassName: "bg-slate-400",
  },
};

export const EquipmentCategoryStatusBadge = ({
  status,
}: EquipmentCategoryStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
      <span
        className={[
          "size-2 shrink-0 rounded-full",
          config.dotClassName,
        ].join(" ")}
      />

      {config.label}
    </span>
  );
};
