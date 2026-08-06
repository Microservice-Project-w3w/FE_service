import {
  BarChart3,
  CircleDollarSign,
  ClockAlert,
  Download,
  PackageCheck,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  adminReportsApi,
} from "@/modules/reports/api/admin-reports.api";

import {
  RentalStatusBreakdown,
} from "@/modules/reports/components/RentalStatusBreakdown";

import {
  ReportMetricCard,
} from "@/modules/reports/components/ReportMetricCard";

import {
  ReportPerformanceTable,
} from "@/modules/reports/components/ReportPerformanceTable";

import {
  RevenueTrendChart,
} from "@/modules/reports/components/RevenueTrendChart";

import {
  reportPeriodOptions,
} from "@/modules/reports/mocks/admin-reports.mock";

import type {
  AdminReportData,
  ReportPeriod,
} from "@/modules/reports/types/admin-report.types";

const currencyFormatter =
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });

const numberFormatter =
  new Intl.NumberFormat("vi-VN");

const dateTimeFormatter =
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const escapeCsvValue = (
  value: string | number,
): string => {
  const normalized = String(
    value,
  ).replace(/"/g, '""');

  return `"${normalized}"`;
};

export const AdminReportsPage = () => {
  const [
    period,
    setPeriod,
  ] = useState<ReportPeriod>(
    "THIS_MONTH",
  );

  const [
    report,
    setReport,
  ] =
    useState<AdminReportData | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null,
  );

  const loadReport = useCallback(
    async (
      selectedPeriod: ReportPeriod,
    ) => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data =
          await adminReportsApi.getOverview(
            selectedPeriod,
          );

        setReport(data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu báo cáo.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadReport(period);
  }, [
    loadReport,
    period,
  ]);

  const handleExportCsv = () => {
    if (!report) {
      return;
    }

    const rows: Array<
      Array<string | number>
    > = [
      [
        "BÁO CÁO TỔNG THỂ",
      ],
      [],
      [
        "Chỉ số",
        "Giá trị",
        "Thay đổi (%)",
      ],
      [
        "Tổng doanh thu",
        report.summary
          .totalRevenue.value,
        report.summary
          .totalRevenue
          .changePercent,
      ],
      [
        "Tổng đơn thuê",
        report.summary
          .totalRentals.value,
        report.summary
          .totalRentals
          .changePercent,
      ],
      [
        "Tỷ lệ sử dụng thiết bị",
        report.summary
          .utilizationRate.value,
        report.summary
          .utilizationRate
          .changePercent,
      ],
      [
        "Đơn thuê quá hạn",
        report.summary
          .overdueRentals.value,
        report.summary
          .overdueRentals
          .changePercent,
      ],
      [],
      [
        "HIỆU SUẤT CHI NHÁNH",
      ],
      [
        "Mã",
        "Chi nhánh",
        "Doanh thu",
        "Số đơn thuê",
        "Tỷ lệ sử dụng (%)",
      ],
      ...report.topBranches.map(
        (branch) => [
          branch.code,
          branch.name,
          branch.revenue,
          branch.rentalCount,
          branch.utilizationRate,
        ],
      ),
      [],
      [
        "HIỆU SUẤT DANH MỤC",
      ],
      [
        "Mã",
        "Danh mục",
        "Doanh thu",
        "Số thiết bị",
        "Tỷ lệ sử dụng (%)",
      ],
      ...report.topCategories.map(
        (category) => [
          category.code,
          category.name,
          category.revenue,
          category.equipmentCount,
          category.utilizationRate,
        ],
      ),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map(escapeCsvValue)
          .join(","),
      )
      .join("\n");

    const blob = new Blob(
      [
        "\uFEFF",
        csvContent,
      ],
      {
        type: "text/csv;charset=utf-8",
      },
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;
    anchor.download = `bao-cao-tong-the-${report.period.toLowerCase()}-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(
      anchor,
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  if (
    isLoading &&
    !report
  ) {
    return (
      <div className="space-y-6">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="h-44 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>

        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm font-semibold text-rose-700">
        {errorMessage ??
          "Không có dữ liệu báo cáo."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Quản trị hệ thống
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Báo cáo tổng thể
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Theo dõi doanh thu, hoạt động cho thuê
            và hiệu suất sử dụng thiết bị trên toàn
            hệ thống.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="block w-full text-sm font-semibold text-slate-700 sm:w-48">
            <span className="block">
              Kỳ báo cáo
            </span>

            <select
              value={period}
              onChange={(event) =>
                setPeriod(
                  event.target
                    .value as ReportPeriod,
                )
              }
              className="mt-2 block h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {reportPeriodOptions.map(
                (option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ),
              )}
            </select>
          </label>

          <div className="flex items-end gap-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => {
                void loadReport(
                  period,
                );
              }}
              className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={
                  isLoading
                    ? "animate-spin"
                    : ""
                }
              />

              Làm mới
            </button>

            <button
              type="button"
              onClick={
                handleExportCsv
              }
              className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Download size={17} />
              Xuất CSV
            </button>
          </div>
        </div>
      </header>

      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <ReportMetricCard
          title="Tổng doanh thu"
          value={currencyFormatter.format(
            report.summary
              .totalRevenue.value,
          )}
          description="Tổng doanh thu trong kỳ"
          metric={
            report.summary
              .totalRevenue
          }
          icon={CircleDollarSign}
        />

        <ReportMetricCard
          title="Tổng đơn thuê"
          value={numberFormatter.format(
            report.summary
              .totalRentals.value,
          )}
          description="Đơn thuê được ghi nhận"
          metric={
            report.summary
              .totalRentals
          }
          icon={ShoppingCart}
        />

        <ReportMetricCard
          title="Tỷ lệ sử dụng"
          value={`${report.summary.utilizationRate.value.toLocaleString(
            "vi-VN",
            {
              maximumFractionDigits: 1,
            },
          )}%`}
          description="Hiệu suất sử dụng thiết bị"
          metric={
            report.summary
              .utilizationRate
          }
          icon={PackageCheck}
        />

        <ReportMetricCard
          title="Đơn thuê quá hạn"
          value={numberFormatter.format(
            report.summary
              .overdueRentals.value,
          )}
          description="Đơn chưa hoàn trả đúng hạn"
          metric={
            report.summary
              .overdueRentals
          }
          icon={ClockAlert}
          inverseTrend
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(340px,0.75fr)]">
        <RevenueTrendChart
          points={
            report.revenueTrend
          }
        />

        <RentalStatusBreakdown
          items={
            report.rentalStatus
          }
        />
      </div>

      <ReportPerformanceTable
        title="Hiệu suất chi nhánh"
        description="Xếp hạng chi nhánh theo doanh thu và tỷ lệ sử dụng thiết bị."
        entityLabel="Chi nhánh"
        quantityLabel="Đơn thuê"
        rows={report.topBranches.map(
          (branch) => ({
            id: branch.id,
            code: branch.code,
            name: branch.name,
            revenue:
              branch.revenue,
            quantity:
              branch.rentalCount,
            utilizationRate:
              branch.utilizationRate,
          }),
        )}
      />

      <ReportPerformanceTable
        title="Hiệu suất danh mục thiết bị"
        description="Các danh mục tạo doanh thu và có hiệu suất sử dụng cao nhất."
        entityLabel="Danh mục"
        quantityLabel="Thiết bị"
        rows={report.topCategories.map(
          (category) => ({
            id: category.id,
            code: category.code,
            name: category.name,
            revenue:
              category.revenue,
            quantity:
              category.equipmentCount,
            utilizationRate:
              category.utilizationRate,
          }),
        )}
      />

      <footer className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2">
          <BarChart3
            size={17}
            className="text-blue-600"
          />

          Dữ liệu báo cáo hiện tại là dữ liệu
          mock phía frontend.
        </span>

        <span>
          Cập nhật lúc{" "}
          <strong className="font-semibold text-slate-700">
            {dateTimeFormatter.format(
              new Date(
                report.generatedAt,
              ),
            )}
          </strong>
        </span>
      </footer>
    </div>
  );
};
