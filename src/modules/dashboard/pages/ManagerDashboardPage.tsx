import {
  AlertTriangle,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  PackageCheck,
  RefreshCw,
  Truck,
  Wrench,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import {
  useAuthStore,
} from "@/modules/auth/store/auth.store";

import {
  managerDashboardApi,
} from "@/modules/dashboard/api/manager-dashboard.api";

import {
  ManagerBranchComparison,
} from "@/modules/dashboard/components/ManagerBranchComparison";

import {
  ManagerBranchSelector,
} from "@/modules/dashboard/components/ManagerBranchSelector";

import {
  ManagerEquipmentStatus,
} from "@/modules/dashboard/components/ManagerEquipmentStatus";

import {
  ManagerMetricCard,
} from "@/modules/dashboard/components/ManagerMetricCard";

import {
  ManagerRecentRentals,
} from "@/modules/dashboard/components/ManagerRecentRentals";

import {
  ManagerTaskList,
} from "@/modules/dashboard/components/ManagerTaskList";

import type {
  ManagerDashboardOverviewData,
} from "@/modules/dashboard/types/manager-dashboard.types";

import {
  managerContextApi,
  useManagerScopeStore,
} from "@/modules/manager-context";

const currencyFormatter =
  new Intl.NumberFormat(
    "vi-VN",
    {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    },
  );

const dateTimeFormatter =
  new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

const quickActions = [
  {
    label: "Duyệt báo giá",
    description:
      "Kiểm tra báo giá đang chờ xử lý",
    route:
      "/manager/quotation-approvals",
    icon: ClipboardCheck,
  },
  {
    label: "Duyệt hợp đồng",
    description:
      "Kiểm tra hợp đồng đang chờ duyệt",
    route:
      "/manager/contract-approvals",
    icon: ClipboardCheck,
  },
  {
    label: "Theo dõi giao nhận",
    description:
      "Kiểm tra tiến độ giao và thu hồi",
    route:
      "/manager/deliveries",
    icon: Truck,
  },
  {
    label: "Quản lý thiết bị",
    description:
      "Xem tồn kho và tình trạng thiết bị",
    route:
      "/manager/equipment",
    icon: PackageCheck,
  },
];

export const ManagerDashboardPage = () => {
  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user,
  );

  const accessContext =
    useManagerScopeStore(
      (state) =>
        state.accessContext,
    );

  const selectedScopeId =
    useManagerScopeStore(
      (state) =>
        state.selectedScopeId,
    );

  const setAccessContext =
    useManagerScopeStore(
      (state) =>
        state.setAccessContext,
    );

  const setSelectedScopeId =
    useManagerScopeStore(
      (state) =>
        state.setSelectedScopeId,
    );

  const [
    dashboard,
    setDashboard,
  ] =
    useState<ManagerDashboardOverviewData | null>(
      null,
    );

  const [
    isContextLoading,
    setIsContextLoading,
  ] = useState(true);

  const [
    isDashboardLoading,
    setIsDashboardLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null,
  );

  const loadAccessContext =
    useCallback(async () => {
      if (!user?.id) {
        setErrorMessage(
          "Không tìm thấy thông tin tài khoản quản lý.",
        );

        setIsContextLoading(false);
        return;
      }

      setIsContextLoading(true);
      setErrorMessage(null);

      try {
        const context =
          await managerContextApi
            .getMyAccessContext({
              userId: user.id,
            });

        setAccessContext(context);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải phạm vi quản lý.",
        );
      } finally {
        setIsContextLoading(false);
      }
    }, [
      setAccessContext,
      user?.id,
    ]);

  const loadDashboard =
    useCallback(async () => {
      if (!accessContext) {
        return;
      }

      setIsDashboardLoading(true);
      setErrorMessage(null);

      try {
        const data =
          await managerDashboardApi
            .getOverview({
              organizationId:
                accessContext.organizationId,

              assignedBranchIds:
                accessContext
                  .assignedBranches
                  .map(
                    (branch) =>
                      branch.id,
                  ),

              selectedScopeId,

              managerName:
                user?.fullName ??
                "Quản lý",
            });

        setDashboard(data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải Dashboard quản lý.",
        );
      } finally {
        setIsDashboardLoading(false);
      }
    }, [
      accessContext,
      selectedScopeId,
      user?.fullName,
    ]);

  useEffect(() => {
    void loadAccessContext();
  }, [loadAccessContext]);

  useEffect(() => {
    if (accessContext) {
      void loadDashboard();
    }
  }, [
    accessContext,
    loadDashboard,
  ]);

  const isLoading =
    isContextLoading ||
    isDashboardLoading;

  if (
    isLoading &&
    !dashboard
  ) {
    return (
      <div className="space-y-6">
        <div className="h-32 animate-pulse rounded-2xl bg-slate-100" />

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

        <div className="h-80 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (
    !accessContext ||
    !dashboard
  ) {
    return (
      <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <AlertTriangle size={21} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-rose-800">
              Không thể mở Dashboard quản lý
            </h1>

            <p className="mt-2 text-sm text-rose-700">
              {errorMessage ??
                "Tài khoản chưa được phân công chi nhánh."}
            </p>

            <button
              type="button"
              onClick={() => {
                void loadAccessContext();
              }}
              className="mt-4 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  const summary =
    dashboard.summary;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Quản lý vận hành
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Dashboard quản lý
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Xin chào{" "}
            <strong className="font-semibold text-slate-700">
              {user?.fullName}
            </strong>
            , theo dõi hoạt động của các chi
            nhánh được phân công.
          </p>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => {
            void loadDashboard();
          }}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              isDashboardLoading
                ? "animate-spin"
                : ""
            }
          />

          Làm mới dữ liệu
        </button>
      </header>

      <section className="rounded-2xl border border-blue-100 bg-blue-50/70 px-6 py-5">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                {dashboard.scope.label}
              </h2>

              {dashboard.scope.code && (
                <span className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {dashboard.scope.code}
                </span>
              )}

              {dashboard.scope.isAllBranches && (
                <span className="rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {dashboard.scope.branchCount} chi nhánh
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-slate-600">
              {dashboard.scope.description}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Cập nhật lúc{" "}
              {dateTimeFormatter.format(
                new Date(
                  dashboard.generatedAt,
                ),
              )}
            </p>
          </div>

          <ManagerBranchSelector
            branches={
              accessContext.assignedBranches
            }
            selectedScopeId={
              selectedScopeId
            }
            disabled={isLoading}
            onChange={
              setSelectedScopeId
            }
          />
        </div>
      </section>

      {errorMessage && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          {errorMessage}
        </div>
      )}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <ManagerMetricCard
          title="Đơn thuê đang hoạt động"
          value={summary.activeRentals.value.toLocaleString(
            "vi-VN",
          )}
          description="Đơn thuê trong phạm vi đang xem"
          changePercent={
            summary.activeRentals
              .changePercent
          }
          icon={Truck}
        />

        <ManagerMetricCard
          title="Thiết bị khả dụng"
          value={summary.availableEquipment.value.toLocaleString(
            "vi-VN",
          )}
          description="Thiết bị sẵn sàng cho thuê"
          changePercent={
            summary.availableEquipment
              .changePercent
          }
          icon={PackageCheck}
        />

        <ManagerMetricCard
          title="Giao nhận hôm nay"
          value={summary.todayDeliveryTasks.value.toLocaleString(
            "vi-VN",
          )}
          description="Công việc giao và nhận thiết bị"
          changePercent={
            summary.todayDeliveryTasks
              .changePercent
          }
          icon={CalendarDays}
        />

        <ManagerMetricCard
          title="Doanh thu tháng"
          value={currencyFormatter.format(
            summary.monthlyRevenue
              .value,
          )}
          description="Doanh thu trong phạm vi đang xem"
          changePercent={
            summary.monthlyRevenue
              .changePercent
          }
          icon={CircleDollarSign}
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/manager/rentals",
            )
          }
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40"
        >
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Đơn thuê quá hạn
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {summary.overdueRentals}
            </p>
          </div>

          <ChevronRight className="text-blue-500" />
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/manager/equipment",
            )
          }
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40"
        >
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Thiết bị sắp bảo trì
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {summary.maintenanceDue}
            </p>
          </div>

          <Wrench className="text-blue-500" />
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/manager/quotation-approvals",
            )
          }
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40"
        >
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Báo giá chờ duyệt
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {
                summary.pendingQuotationApprovals
              }
            </p>
          </div>

          <ClipboardCheck className="text-blue-500" />
        </button>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/manager/contract-approvals",
            )
          }
          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/40"
        >
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Hợp đồng chờ duyệt
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {
                summary.pendingContractApprovals
              }
            </p>
          </div>

          <ClipboardCheck className="text-blue-500" />
        </button>
      </section>

      <ManagerBranchComparison
        rows={
          dashboard.branchComparison
        }
        selectedScopeId={
          selectedScopeId
        }
        onSelectBranch={
          setSelectedScopeId
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.75fr)]">
        <ManagerTaskList
          tasks={dashboard.tasks}
        />

        <ManagerEquipmentStatus
          items={
            dashboard.equipmentStatus
          }
        />
      </div>

      <ManagerRecentRentals
        rentals={
          dashboard.recentRentals
        }
      />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <header>
          <h2 className="text-lg font-bold text-slate-900">
            Truy cập nhanh
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Mở nhanh các nghiệp vụ quản lý
            thường dùng.
          </p>
        </header>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(
            (action) => {
              const Icon =
                action.icon;

              return (
                <button
                  key={action.route}
                  type="button"
                  onClick={() =>
                    navigate(
                      action.route,
                    )
                  }
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-200 hover:bg-blue-50/40"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={19} />
                  </div>

                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      {action.label}
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      {
                        action.description
                      }
                    </span>
                  </span>
                </button>
              );
            },
          )}
        </div>
      </section>
    </div>
  );
};
