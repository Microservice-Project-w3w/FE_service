import type {
  EquipmentAvailabilityStatus,
  EquipmentStatusReport,
} from "@/modules/dashboard/types/manager-dashboard.types";

interface ManagerEquipmentStatusProps {
  items: EquipmentStatusReport[];
}

const statusStyles: Record<
  EquipmentAvailabilityStatus,
  {
    dot: string;
    bar: string;
  }
> = {
  AVAILABLE: {
    dot: "bg-blue-600",
    bar: "bg-blue-600",
  },
  RENTED: {
    dot: "bg-blue-500",
    bar: "bg-blue-500",
  },
  RESERVED: {
    dot: "bg-blue-400",
    bar: "bg-blue-400",
  },
  MAINTENANCE: {
    dot: "bg-blue-300",
    bar: "bg-blue-300",
  },
  DAMAGED: {
    dot: "bg-blue-700",
    bar: "bg-blue-700",
  },
};

export const ManagerEquipmentStatus = ({
  items,
}: ManagerEquipmentStatusProps) => {
  const total = items.reduce(
    (sum, item) =>
      sum + item.count,
    0,
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="border-b border-slate-200 pb-5">
        <h2 className="text-lg font-bold text-slate-900">
          Tình trạng thiết bị
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Phân bố thiết bị tại chi nhánh đang quản lý.
        </p>
      </header>

      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          Tổng thiết bị
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
                <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span
                    className={[
                      "size-2.5 rounded-full",
                      style.dot,
                    ].join(" ")}
                  />

                  {item.label}
                </span>

                <span className="text-sm font-semibold text-slate-800">
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
