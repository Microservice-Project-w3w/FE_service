import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

interface ManagerMetricCardProps {
  title: string;
  value: string;
  description: string;
  changePercent: number;
  icon: LucideIcon;
}

export const ManagerMetricCard = ({
  title,
  value,
  description,
  changePercent,
  icon: Icon,
}: ManagerMetricCardProps) => {
  const isPositive =
    changePercent >= 0;

  const TrendIcon = isPositive
    ? ArrowUpRight
    : ArrowDownRight;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={21} />
        </div>

        <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          <TrendIcon size={14} />

          {Math.abs(
            changePercent,
          ).toLocaleString(
            "vi-VN",
            {
              maximumFractionDigits: 1,
            },
          )}
          %
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </article>
  );
};
