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

const iconConfig: Record<
  EquipmentCategoryIcon,
  {
    Icon: LucideIcon;
    className: string;
  }
> = {
  AUDIO: {
    Icon: Volume2,
    className:
      "border-blue-100 bg-blue-50 text-blue-700",
  },

  LIGHTING: {
    Icon: Lightbulb,
    className:
      "border-amber-100 bg-amber-50 text-amber-700",
  },

  STAGE: {
    Icon: Box,
    className:
      "border-violet-100 bg-violet-50 text-violet-700",
  },

  POWER: {
    Icon: Zap,
    className:
      "border-orange-100 bg-orange-50 text-orange-700",
  },

  VISUAL: {
    Icon: Monitor,
    className:
      "border-cyan-100 bg-cyan-50 text-cyan-700",
  },

  OTHER: {
    Icon: Boxes,
    className:
      "border-slate-200 bg-slate-50 text-slate-600",
  },
};

export const EquipmentCategoryIconBadge = ({
  icon,
  size = "MD",
}: EquipmentCategoryIconBadgeProps) => {
  const config = iconConfig[icon];
  const Icon = config.Icon;

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center justify-center rounded-2xl border",
        config.className,
        size === "SM"
          ? "size-9"
          : "size-11",
      ].join(" ")}
    >
      <Icon
        size={size === "SM" ? 17 : 20}
      />
    </span>
  );
};
