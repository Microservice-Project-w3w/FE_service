import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  PackageSearch,
  RefreshCw,
  Truck,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAuthStore,
} from "@/modules/auth";

import {
  managerContextApi,
  useManagerScopeStore,
} from "@/modules/manager-context";

import {
  managerDeliveriesApi,
} from "@/modules/deliveries/api/manager-deliveries.api";

import {
  ManagerDeliveryDetailDrawer,
} from "@/modules/deliveries/components/ManagerDeliveryDetailDrawer";

import {
  ManagerDeliveryFilters,
} from "@/modules/deliveries/components/ManagerDeliveryFilters";

import type {
  ManagerDeliveryPriorityFilter,
  ManagerDeliveryStatusFilter,
  ManagerDeliveryTypeFilter,
} from "@/modules/deliveries/components/ManagerDeliveryFilters";

import {
  ManagerDeliverySummaryCard,
} from "@/modules/deliveries/components/ManagerDeliverySummaryCard";

import {
  ManagerDeliveryTable,
} from "@/modules/deliveries/components/ManagerDeliveryTable";

import type {
  ManagerDeliveryListData,
  ManagerDeliveryTask,
} from "@/modules/deliveries/types/manager-delivery.types";

const PAGE_SIZE = 5;

const EMPTY_LIST_DATA: ManagerDeliveryListData = {
  summary: {
    totalCount: 0,
    scheduledTodayCount: 0,
    inProgressCount: 0,
    delayedCount: 0,
    completedTodayCount: 0,
    issueCount: 0,
  },

  tasks: [],

  generatedAt: "",
};

export const ManagerDeliveriesPage = () => {
  const user =
    useAuthStore(
      (state) =>
        state.user,
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
    listData,
    setListData,
  ] =
    useState<ManagerDeliveryListData>(
      EMPTY_LIST_DATA,
    );

  const [
    selectedTask,
    setSelectedTask,
  ] =
    useState<ManagerDeliveryTask | null>(
      null,
    );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    typeFilter,
    setTypeFilter,
  ] =
    useState<ManagerDeliveryTypeFilter>(
      "ALL",
    );

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<ManagerDeliveryStatusFilter>(
      "ALL",
    );

  const [
    priorityFilter,
    setPriorityFilter,
  ] =
    useState<ManagerDeliveryPriorityFilter>(
      "ALL",
    );

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isDetailLoading,
    setIsDetailLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null,
  );

  const ensureAccessContext =
    useCallback(async () => {
      if (accessContext) {
        return accessContext;
      }

      if (!user) {
        throw new Error(
          "Không xác định được tài khoản quản lý.",
        );
      }

      const context =
        await managerContextApi.getMyAccessContext(
          {
            userId: user.id,
          },
        );

      setAccessContext(
        context,
      );

      return context;
    }, [
      accessContext,
      setAccessContext,
      user,
    ]);

  const loadTasks =
    useCallback(async () => {
      try {
        setIsLoading(true);

        setErrorMessage(null);

        const context =
          await ensureAccessContext();

        const data =
          await managerDeliveriesApi.getList(
            {
              organizationId:
                context.organizationId,

              assignedBranchIds:
                context.assignedBranches.map(
                  (branch) =>
                    branch.id,
                ),

              selectedScopeId,
            },
          );

        setListData(data);
      } catch (error) {
        setListData(
          EMPTY_LIST_DATA,
        );

        setErrorMessage(
          error instanceof
            Error
            ? error.message
            : "Không thể tải dữ liệu giao nhận.",
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      ensureAccessContext,
      selectedScopeId,
    ]);

  useEffect(() => {
    void loadTasks();
  }, [
    loadTasks,
  ]);

  const filteredTasks =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      return listData.tasks.filter(
        (task) => {
          const matchesSearch =
            !normalizedSearch ||
            task.taskCode
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            task.rentalCode
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            task.customerName
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            task.eventName
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            task.address
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          const matchesType =
            typeFilter ===
              "ALL" ||
            task.type ===
              typeFilter;

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            task.status ===
              statusFilter;

          const matchesPriority =
            priorityFilter ===
              "ALL" ||
            task.priority ===
              priorityFilter;

          return (
            matchesSearch &&
            matchesType &&
            matchesStatus &&
            matchesPriority
          );
        },
      );
    }, [
      listData.tasks,
      priorityFilter,
      searchTerm,
      statusFilter,
      typeFilter,
    ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredTasks.length /
          PAGE_SIZE,
      ),
    );

  const paginatedTasks =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        PAGE_SIZE;

      return filteredTasks.slice(
        startIndex,
        startIndex +
          PAGE_SIZE,
      );
    }, [
      currentPage,
      filteredTasks,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    typeFilter,
    statusFilter,
    priorityFilter,
    selectedScopeId,
  ]);

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages,
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const handleViewTask =
    useCallback(
      async (
        task: ManagerDeliveryTask,
      ) => {
        setSelectedTask(task);

        setIsDetailLoading(
          true,
        );

        try {
          const detail =
            await managerDeliveriesApi.getById(
              task.id,
            );

          setSelectedTask(
            detail,
          );
        } catch (error) {
          setErrorMessage(
            error instanceof
              Error
              ? error.message
              : "Không thể tải chi tiết nhiệm vụ.",
          );
        } finally {
          setIsDetailLoading(
            false,
          );
        }
      },
      [],
    );

  const handleResetFilters =
    () => {
      setSearchTerm("");

      setTypeFilter("ALL");

      setStatusFilter(
        "ALL",
      );

      setPriorityFilter(
        "ALL",
      );

      setSelectedScopeId(
        "ALL",
      );
    };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Quản lý vận hành
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Giao nhận thiết bị
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Theo dõi lịch giao,
            nhận trả, nhân viên
            phụ trách và các vấn
            đề phát sinh tại những
            chi nhánh được phân công.
          </p>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={() =>
            void loadTasks()
          }
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
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
      </section>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          <AlertTriangle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>
            {errorMessage}
          </span>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <ManagerDeliverySummaryCard
          title="Tổng nhiệm vụ"
          value={String(
            listData.summary
              .totalCount,
          )}
          description="Trong phạm vi chi nhánh đang xem"
          icon={
            ClipboardList
          }
        />

        <ManagerDeliverySummaryCard
          title="Lịch hôm nay"
          value={String(
            listData.summary
              .scheduledTodayCount,
          )}
          description="Nhiệm vụ cần thực hiện trong ngày"
          icon={
            CalendarClock
          }
        />

        <ManagerDeliverySummaryCard
          title="Đang thực hiện"
          value={String(
            listData.summary
              .inProgressCount,
          )}
          description="Đang chuẩn bị hoặc vận chuyển"
          icon={Truck}
        />

        <ManagerDeliverySummaryCard
          title="Bị trễ"
          value={String(
            listData.summary
              .delayedCount,
          )}
          description="Cần quản lý ưu tiên xử lý"
          icon={
            AlertTriangle
          }
        />

        <ManagerDeliverySummaryCard
          title="Hoàn thành hôm nay"
          value={String(
            listData.summary
              .completedTodayCount,
          )}
          description="Đã hoàn tất giao hoặc nhận trả"
          icon={
            CheckCircle2
          }
        />

        <ManagerDeliverySummaryCard
          title="Sự cố thiết bị"
          value={String(
            listData.summary
              .issueCount,
          )}
          description="Thiếu, hỏng hoặc vấn đề cần xử lý"
          icon={
            PackageSearch
          }
        />
      </section>

      <ManagerDeliveryFilters
        branches={
          accessContext
            ?.assignedBranches ??
          []
        }
        selectedScopeId={
          selectedScopeId
        }
        searchTerm={
          searchTerm
        }
        typeFilter={
          typeFilter
        }
        statusFilter={
          statusFilter
        }
        priorityFilter={
          priorityFilter
        }
        disabled={
          isLoading
        }
        onScopeChange={
          setSelectedScopeId
        }
        onSearchChange={
          setSearchTerm
        }
        onTypeChange={
          setTypeFilter
        }
        onStatusChange={
          setStatusFilter
        }
        onPriorityChange={
          setPriorityFilter
        }
        onReset={
          handleResetFilters
        }
      />

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">
          Hiển thị{" "}
          <span className="font-bold text-slate-800">
            {
              filteredTasks.length
            }
          </span>{" "}
          nhiệm vụ
        </p>

        {listData.generatedAt && (
          <p className="hidden text-xs text-slate-400 sm:block">
            Cập nhật lúc{" "}
            {new Intl.DateTimeFormat(
              "vi-VN",
              {
                hour:
                  "2-digit",
                minute:
                  "2-digit",
                day:
                  "2-digit",
                month:
                  "2-digit",
              },
            ).format(
              new Date(
                listData.generatedAt,
              ),
            )}
          </p>
        )}
      </div>

      <ManagerDeliveryTable
        tasks={
          paginatedTasks
        }
        isLoading={
          isLoading
        }
        onView={
          handleViewTask
        }
      />

      {!isLoading &&
        filteredTasks.length >
          0 && (
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị{" "}
            <span className="font-bold text-slate-800">
              {
                paginatedTasks.length
              }
            </span>{" "}
            trong{" "}
            <span className="font-bold text-slate-800">
              {
                filteredTasks.length
              }
            </span>{" "}
            nhiệm vụ giao nhận
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.max(
                      1,
                      page - 1,
                    ),
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:border-slate-200 disabled:hover:bg-white"
            >
              Trước
            </button>

            <span className="min-w-20 text-center text-sm font-semibold text-slate-600">
              Trang{" "}
              {currentPage}/
              {totalPages}
            </span>

            <button
              type="button"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1,
                    ),
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:border-slate-200 disabled:hover:bg-white"
            >
              Sau
            </button>
          </div>
        </section>
      )}

      <ManagerDeliveryDetailDrawer
        task={
          selectedTask
        }
        isLoading={
          isDetailLoading
        }
        onClose={() =>
          setSelectedTask(
            null,
          )
        }
      />
    </div>
  );
};
