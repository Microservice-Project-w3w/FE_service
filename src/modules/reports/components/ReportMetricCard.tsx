import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import type {
  ReportMetric,
} from "@/modules/reports/types/admin-report.types";

interface ReportMetricCardProps {
  title: string;
  value: string;
  description: string;
  metric: ReportMetric;
  icon: LucideIcon;
  inverseTrend?: boolean;
}

export const ReportMetricCard = ({
  title,
  value,
  description,
  metric,
  icon: Icon,
  inverseTrend = false,
}: ReportMetricCardProps) => {
  const isStable =
    metric.trend === "STABLE";

  const isPositive =
    metric.trend === "UP";

  const isGood = inverseTrend
    ? metric.trend === "DOWN"
    : isPositive;

  const TrendIcon = isStable
    ? ArrowRight
    : metric.trend === "UP"
      ? ArrowUpRight
      : ArrowDownRight;

  const trendClassName = isStable
    ? "bg-slate-50 text-slate-600"
    : isGood
      ? "bg-emerald-50 text-emerald-700"
      : "bg-rose-50 text-rose-700";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={21} />
        </div>

        <span
          className={[
            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            trendClassName,
          ].join(" ")}
        >
          <TrendIcon size={14} />

          {Math.abs(
            metric.changePercent,
          ).toLocaleString("vi-VN", {
            maximumFractionDigits: 1,
          })}
          %
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>
    </article>
  );
};
