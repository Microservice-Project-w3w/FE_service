import type {
  RevenueTrendPoint,
} from "@/modules/reports/types/admin-report.types";

interface RevenueTrendChartProps {
  points: RevenueTrendPoint[];
}

const chartWidth = 760;
const chartHeight = 280;
const paddingLeft = 66;
const paddingRight = 24;
const paddingTop = 24;
const paddingBottom = 54;

const compactCurrencyFormatter =
  new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

const currencyFormatter =
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

export const RevenueTrendChart = ({
  points,
}: RevenueTrendChartProps) => {
  const plotWidth =
    chartWidth -
    paddingLeft -
    paddingRight;

  const plotHeight =
    chartHeight -
    paddingTop -
    paddingBottom;

  const maxRevenue = Math.max(
    ...points.map(
      (point) => point.revenue,
    ),
    1,
  );

  const xStep =
    points.length > 1
      ? plotWidth /
        (points.length - 1)
      : 0;

  const coordinates = points.map(
    (point, index) => {
      const x =
        paddingLeft +
        index * xStep;

      const y =
        paddingTop +
        plotHeight -
        (point.revenue /
          maxRevenue) *
          plotHeight;

      return {
        ...point,
        x,
        y,
      };
    },
  );

  const linePath =
    coordinates.length === 0
      ? ""
      : coordinates
          .map(
            (point, index) =>
              `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
          )
          .join(" ");

  const areaPath =
    coordinates.length === 0
      ? ""
      : [
          linePath,
          `L ${
            coordinates[
              coordinates.length - 1
            ].x
          } ${
            paddingTop +
            plotHeight
          }`,
          `L ${coordinates[0].x} ${
            paddingTop +
            plotHeight
          }`,
          "Z",
        ].join(" ");

  const gridValues =
    Array.from(
      {
        length: 5,
      },
      (_, index) =>
        maxRevenue -
        (maxRevenue / 4) *
          index,
    );

  const totalRevenue =
    points.reduce(
      (total, point) =>
        total + point.revenue,
      0,
    );

  const totalRentals =
    points.reduce(
      (total, point) =>
        total + point.rentalCount,
      0,
    );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Doanh thu theo thời gian
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Theo dõi doanh thu và số đơn
            thuê trong kỳ đã chọn.
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Tổng doanh thu
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            {currencyFormatter.format(
              totalRevenue,
            )}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {totalRentals.toLocaleString(
              "vi-VN",
            )}{" "}
            đơn thuê
          </p>
        </div>
      </header>

      <div className="mt-5 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          role="img"
          aria-label="Biểu đồ doanh thu theo thời gian"
          className="min-w-[680px] w-full"
        >
          <defs>
            <linearGradient
              id="report-revenue-gradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#2563eb"
                stopOpacity="0.22"
              />

              <stop
                offset="100%"
                stopColor="#2563eb"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {gridValues.map(
            (value, index) => {
              const y =
                paddingTop +
                (plotHeight / 4) *
                  index;

              return (
                <g key={value}>
                  <line
                    x1={paddingLeft}
                    x2={
                      chartWidth -
                      paddingRight
                    }
                    y1={y}
                    y2={y}
                    stroke="#e2e8f0"
                    strokeDasharray="4 5"
                  />

                  <text
                    x={
                      paddingLeft -
                      12
                    }
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-400 text-[11px]"
                  >
                    {compactCurrencyFormatter.format(
                      value,
                    )}
                  </text>
                </g>
              );
            },
          )}

          {areaPath && (
            <path
              d={areaPath}
              fill="url(#report-revenue-gradient)"
            />
          )}

          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {coordinates.map(
            (point) => (
              <g key={point.label}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="#ffffff"
                  stroke="#2563eb"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />

                <text
                  x={point.x}
                  y={
                    chartHeight -
                    20
                  }
                  textAnchor="middle"
                  className="fill-slate-500 text-[11px] font-medium"
                >
                  {point.label}
                </text>
              </g>
            ),
          )}
        </svg>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="size-2.5 rounded-full bg-blue-600" />
        Doanh thu
      </div>
    </section>
  );
};
