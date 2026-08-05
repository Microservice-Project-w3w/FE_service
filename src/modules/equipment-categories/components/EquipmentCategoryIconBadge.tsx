import {
  Box,
  Boxes,
  Lightbulb,
  Monitor,
  Volume2,
  Zap,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import type {
  EquipmentCategoryIcon,
} from "@/modules/equipment-categories/types/equipment-category.types";

interface EquipmentCategoryIconBadgeProps {
  icon: EquipmentCategoryIcon;
  size?: "SM" | "MD";
}

const iconMap: Record<
  EquipmentCategoryIcon,
  LucideIcon
> = {
  AUDIO: Volume2,
  LIGHTING: Lightbulb,
  STAGE: Box,
  POWER: Zap,
  VISUAL: Monitor,
  OTHER: Boxes,
};

export const EquipmentCategoryIconBadge = ({
  icon,
  size = "MD",
}: EquipmentCategoryIconBadgeProps) => {
  const Icon = iconMap[icon];

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-600",
        size === "SM"
          ? "size-9"
          : "size-11",
      ].join(" ")}
    >
      <Icon
        size={
          size === "SM"
            ? 17
            : 20
        }
        strokeWidth={1.8}
      />
    </span>
  );
};
