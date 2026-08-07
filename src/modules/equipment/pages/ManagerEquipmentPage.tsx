import {
  AlertTriangle,
  Boxes,
  CalendarClock,
  PackageCheck,
  RefreshCw,
  ShieldAlert,
  Tags,
  Wrench,
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
  managerEquipmentApi,
} from "@/modules/equipment/api/manager-equipment.api";

import {
  ManagerEquipmentDetailDrawer,
} from "@/modules/equipment/components/ManagerEquipmentDetailDrawer";

import {
  ManagerEquipmentFilters,
} from "@/modules/equipment/components/ManagerEquipmentFilters";

import type {
  ManagerEquipmentConditionFilter,
  ManagerEquipmentMaintenanceFilter,
  ManagerEquipmentStatusFilter,
} from "@/modules/equipment/components/ManagerEquipmentFilters";

import {
  ManagerEquipmentSummaryCard,
} from "@/modules/equipment/components/ManagerEquipmentSummaryCard";

import {
  ManagerEquipmentTable,
} from "@/modules/equipment/components/ManagerEquipmentTable";

import type {
  ManagerEquipment,
  ManagerEquipmentListData,
} from "@/modules/equipment/types/manager-equipment.types";

const PAGE_SIZE = 5;

const MOCK_NOW =
  new Date(
    "2026-08-07T23:10:00+07:00",
  );

const MAINTENANCE_WARNING_LIMIT =
  new Date(
    "2026-08-14T23:10:00+07:00",
  );

const EMPTY_DATA:
  ManagerEquipmentListData = {
    summary: {
      totalQuantity: 0,
      availableQuantity: 0,
      rentedQuantity: 0,
      reservedQuantity: 0,
      maintenanceQuantity: 0,
      damagedQuantity: 0,
      maintenanceDueCount: 0,
    },

    equipment: [],

    generatedAt: "",
  };

export const ManagerEquipmentPage = () => {
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
    useState<ManagerEquipmentListData>(
      EMPTY_DATA,
    );

  const [
    selectedEquipment,
    setSelectedEquipment,
  ] =
    useState<ManagerEquipment | null>(
      null,
    );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<ManagerEquipmentStatusFilter>(
      "ALL",
    );

  const [
    conditionFilter,
    setConditionFilter,
  ] =
    useState<ManagerEquipmentConditionFilter>(
      "ALL",
    );

  const [
    maintenanceFilter,
    setMaintenanceFilter,
  ] =
    useState<ManagerEquipmentMaintenanceFilter>(
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

  const loadEquipment =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const context =
          await ensureAccessContext();

        const data =
          await managerEquipmentApi.getList(
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
          EMPTY_DATA,
        );

        setErrorMessage(
          error instanceof
            Error
            ? error.message
            : "Không thể tải dữ liệu thiết bị.",
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      ensureAccessContext,
      selectedScopeId,
    ]);

  useEffect(() => {
    void loadEquipment();
  }, [
    loadEquipment,
  ]);

  const filteredEquipment =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      return listData.equipment.filter(
        (item) => {
          const matchesSearch =
            !normalizedSearch ||
            item.equipmentCode
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            item.equipmentName
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            item.categoryName
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            item.warehouseName
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            item.status ===
              statusFilter;

          const matchesCondition =
            conditionFilter ===
              "ALL" ||
            item.condition ===
              conditionFilter;

          let matchesMaintenance =
            true;

          if (
            maintenanceFilter ===
            "DUE_SOON"
          ) {
            matchesMaintenance =
              Boolean(
                item.nextMaintenanceAt,
              ) &&
              new Date(
                item.nextMaintenanceAt!,
              ) <=
                MAINTENANCE_WARNING_LIMIT &&
              new Date(
                item.nextMaintenanceAt!,
              ) >=
                MOCK_NOW;
          }

          return (
            matchesSearch &&
            matchesStatus &&
            matchesCondition &&
            matchesMaintenance
          );
        },
      );
    }, [
      conditionFilter,
      listData.equipment,
      maintenanceFilter,
      searchTerm,
      statusFilter,
    ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredEquipment.length /
          PAGE_SIZE,
      ),
    );

  const paginatedEquipment =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        PAGE_SIZE;

      return filteredEquipment.slice(
        startIndex,
        startIndex +
          PAGE_SIZE,
      );
    }, [
      currentPage,
      filteredEquipment,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    conditionFilter,
    maintenanceFilter,
    searchTerm,
    selectedScopeId,
    statusFilter,
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

  const handleView =
    useCallback(
      async (
        item:
          ManagerEquipment,
      ) => {
        setSelectedEquipment(
          item,
        );

        setIsDetailLoading(
          true,
        );

        try {
          const detail =
            await managerEquipmentApi.getById(
              item.id,
            );

          setSelectedEquipment(
            detail,
          );
        } catch (error) {
          setErrorMessage(
            error instanceof
              Error
              ? error.message
              : "Không thể tải chi tiết thiết bị.",
          );
        } finally {
          setIsDetailLoading(
            false,
          );
        }
      },
      [],
    );

  const resetFilters =
    () => {
      setSearchTerm("");

      setStatusFilter(
        "ALL",
      );

      setConditionFilter(
        "ALL",
      );

      setMaintenanceFilter(
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
            Quản lý tài sản
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Thiết bị
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Theo dõi khả dụng,
            thiết bị đang thuê,
            giữ chỗ, bảo trì và
            tình trạng hư hỏng tại
            các chi nhánh được phân công.
          </p>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={() =>
            void loadEquipment()
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

          {
            errorMessage
          }
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        <ManagerEquipmentSummaryCard
          title="Tổng thiết bị"
          value={String(
            listData.summary
              .totalQuantity,
          )}
          description="Tổng số lượng quản lý"
          icon={Boxes}
        />

        <ManagerEquipmentSummaryCard
          title="Khả dụng"
          value={String(
            listData.summary
              .availableQuantity,
          )}
          description="Sẵn sàng cho thuê"
          icon={
            PackageCheck
          }
        />

        <ManagerEquipmentSummaryCard
          title="Đang thuê"
          value={String(
            listData.summary
              .rentedQuantity,
          )}
          description="Đang nằm trong đơn thuê"
          icon={Tags}
        />

        <ManagerEquipmentSummaryCard
          title="Giữ chỗ"
          value={String(
            listData.summary
              .reservedQuantity,
          )}
          description="Đã phân bổ cho lịch thuê"
          icon={
            CalendarClock
          }
        />

        <ManagerEquipmentSummaryCard
          title="Bảo trì"
          value={String(
            listData.summary
              .maintenanceQuantity,
          )}
          description="Đang được kiểm tra hoặc sửa"
          icon={Wrench}
        />

        <ManagerEquipmentSummaryCard
          title="Hư hỏng"
          value={String(
            listData.summary
              .damagedQuantity,
          )}
          description="Cần xử lý kỹ thuật"
          icon={
            ShieldAlert
          }
        />

        <ManagerEquipmentSummaryCard
          title="Sắp bảo trì"
          value={String(
            listData.summary
              .maintenanceDueCount,
          )}
          description="Đến hạn trong vòng 7 ngày"
          icon={
            AlertTriangle
          }
        />
      </section>

      <ManagerEquipmentFilters
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
        statusFilter={
          statusFilter
        }
        conditionFilter={
          conditionFilter
        }
        maintenanceFilter={
          maintenanceFilter
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
        onStatusChange={
          setStatusFilter
        }
        onConditionChange={
          setConditionFilter
        }
        onMaintenanceChange={
          setMaintenanceFilter
        }
        onReset={
          resetFilters
        }
      />

      <p className="text-sm font-medium text-slate-500">
        Hiển thị{" "}
        <span className="font-bold text-slate-800">
          {
            filteredEquipment.length
          }
        </span>{" "}
        nhóm thiết bị
      </p>

      <ManagerEquipmentTable
        equipment={
          paginatedEquipment
        }
        isLoading={
          isLoading
        }
        onView={
          handleView
        }
      />

      {!isLoading &&
        filteredEquipment.length >
          0 && (
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị{" "}
            <span className="font-bold text-slate-800">
              {
                paginatedEquipment.length
              }
            </span>{" "}
            trong{" "}
            <span className="font-bold text-slate-800">
              {
                filteredEquipment.length
              }
            </span>{" "}
            nhóm thiết bị
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              disabled={
                currentPage ===
                1
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
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-300"
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
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              Sau
            </button>
          </div>
        </section>
      )}

      <ManagerEquipmentDetailDrawer
        equipment={
          selectedEquipment
        }
        isLoading={
          isDetailLoading
        }
        onClose={() =>
          setSelectedEquipment(
            null,
          )
        }
      />
    </div>
  );
};
