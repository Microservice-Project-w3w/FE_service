interface PerformanceRow {
  id: string;
  code: string;
  name: string;
  revenue: number;
  quantity: number;
  utilizationRate: number;
}

interface ReportPerformanceTableProps {
  title: string;
  description: string;
  entityLabel: string;
  quantityLabel: string;
  rows: PerformanceRow[];
}

const currencyFormatter =
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

export const ReportPerformanceTable = ({
  title,
  description,
  entityLabel,
  quantityLabel,
  rows,
}: ReportPerformanceTableProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="w-20 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hạng
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                {entityLabel}
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Doanh thu
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                {quantityLabel}
              </th>

              <th className="w-56 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tỷ lệ sử dụng
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map(
              (row, index) => (
                <tr
                  key={row.id}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                >
                  <td className="px-6 py-4">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
                      {index + 1}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-800">
                      {row.name}
                    </p>

                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {row.code}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-slate-800">
                    {currencyFormatter.format(
                      row.revenue,
                    )}
                  </td>

                  <td className="px-4 py-4 text-right text-sm text-slate-600">
                    {row.quantity.toLocaleString(
                      "vi-VN",
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{
                            width: `${Math.min(
                              row.utilizationRate,
                              100,
                            )}%`,
                          }}
                        />
                      </div>

                      <span className="w-14 text-right text-sm font-semibold text-slate-700">
                        {row.utilizationRate.toLocaleString(
                          "vi-VN",
                          {
                            maximumFractionDigits: 1,
                          },
                        )}
                        %
                      </span>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
