import {
  ArrowRight,
} from "lucide-react";

import type {
  ManagerBranchPerformance,
} from "@/modules/dashboard/types/manager-dashboard.types";

import type {
  ManagerScopeId,
} from "@/modules/manager-context/types/manager-context.types";

interface ManagerBranchComparisonProps {
  rows: ManagerBranchPerformance[];
  selectedScopeId: ManagerScopeId;
  onSelectBranch: (
    branchId: string,
  ) => void;
}

const currencyFormatter =
  new Intl.NumberFormat(
    "vi-VN",
    {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    },
  );

export const ManagerBranchComparison = ({
  rows,
  selectedScopeId,
  onSelectBranch,
}: ManagerBranchComparisonProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">
          Tổng hợp các chi nhánh
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          So sánh hoạt động của các chi nhánh được phân công.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Chi nhánh
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nhân viên
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Đơn đang thuê
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Thiết bị khả dụng
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Doanh thu tháng
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cảnh báo
              </th>

              <th className="w-28 px-6 py-4" />
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const isSelected =
                selectedScopeId === row.id;

              const warningCount =
                row.overdueRentals +
                row.maintenanceDue;

              return (
                <tr
                  key={row.id}
                  className={[
                    "border-b border-slate-100 last:border-b-0",
                    isSelected
                      ? "bg-blue-50/70"
                      : "hover:bg-blue-50/40",
                  ].join(" ")}
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">
                      {row.name}
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {row.code} · {row.province}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-right text-sm text-slate-600">
                    {row.employeeCount}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-slate-700">
                    {row.activeRentalCount}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-slate-700">
                    {row.availableEquipment}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-slate-800">
                    {currencyFormatter.format(
                      row.monthlyRevenue,
                    )}
                  </td>

                  <td className="px-4 py-4 text-right">
                    <span
                      className={[
                        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                        warningCount > 0
                          ? "border-blue-100 bg-blue-50 text-blue-700"
                          : "border-slate-200 bg-white text-slate-500",
                      ].join(" ")}
                    >
                      {warningCount}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectBranch(
                          row.id,
                        );
                      }}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                      Xem
                      <ArrowRight size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
