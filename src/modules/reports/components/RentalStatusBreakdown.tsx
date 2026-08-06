import type {
  RentalReportStatus,
  RentalStatusReportItem,
} from "@/modules/reports/types/admin-report.types";

interface RentalStatusBreakdownProps {
  items: RentalStatusReportItem[];
}

interface StatusStyle {
  bar: string;
  badge: string;
}

const statusStyles: Record<
  RentalReportStatus,
  StatusStyle
> = {
  DRAFT: {
    bar: "bg-slate-400",
    badge:
      "border-slate-200 bg-slate-50 text-slate-600",
  },
  CONFIRMED: {
    bar: "bg-blue-500",
    badge:
      "border-blue-200 bg-blue-50 text-blue-700",
  },
  ONGOING: {
    bar: "bg-amber-500",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700",
  },
  COMPLETED: {
    bar: "bg-emerald-500",
    badge:
      "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  OVERDUE: {
    bar: "bg-rose-500",
    badge:
      "border-rose-200 bg-rose-50 text-rose-700",
  },
};

export const RentalStatusBreakdown = ({
  items,
}: RentalStatusBreakdownProps) => {
  const total = items.reduce(
    (sum, item) =>
      sum + item.count,
    0,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="border-b border-slate-200 pb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Trạng thái đơn thuê
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Phân bố đơn thuê trong kỳ báo cáo.
        </p>
      </header>

      <div className="mt-5 rounded-xl bg-blue-50 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          Tổng đơn thuê
        </p>

        <p className="mt-1 text-3xl font-bold text-slate-900">
          {total.toLocaleString(
            "vi-VN",
          )}
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {items.map((item) => {
          const percentage =
            total === 0
              ? 0
              : (item.count /
                  total) *
                100;

          const style =
            statusStyles[
              item.status
            ];

          return (
            <div key={item.status}>
              <div className="flex items-center justify-between gap-3">
                <span
                  className={[
                    "rounded-full border px-2.5 py-1 text-xs font-semibold",
                    style.badge,
                  ].join(" ")}
                >
                  {item.label}
                </span>

                <span className="text-sm font-semibold text-slate-700">
                  {item.count.toLocaleString(
                    "vi-VN",
                  )}
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={[
                    "h-full rounded-full",
                    style.bar,
                  ].join(" ")}
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

              <p className="mt-1 text-right text-xs text-slate-400">
                {percentage.toLocaleString(
                  "vi-VN",
                  {
                    maximumFractionDigits: 1,
                  },
                )}
                %
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
