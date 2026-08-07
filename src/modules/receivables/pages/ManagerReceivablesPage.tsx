import {
  AlertTriangle,
  Banknote,
  CircleDollarSign,
  Clock3,
  ReceiptText,
  RefreshCw,
  WalletCards,
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
  managerReceivablesApi,
} from "@/modules/receivables/api/manager-receivables.api";

import {
  ManagerReceivableDetailDrawer,
} from "@/modules/receivables/components/ManagerReceivableDetailDrawer";

import {
  ManagerReceivableFilters,
} from "@/modules/receivables/components/ManagerReceivableFilters";

import type {
  ManagerReceivableDueFilter,
  ManagerReceivablePriorityFilter,
  ManagerReceivableStatusFilter,
} from "@/modules/receivables/components/ManagerReceivableFilters";

import {
  ManagerReceivableSummaryCard,
} from "@/modules/receivables/components/ManagerReceivableSummaryCard";

import {
  ManagerReceivableTable,
} from "@/modules/receivables/components/ManagerReceivableTable";

import type {
  ManagerReceivable,
  ManagerReceivableListData,
} from "@/modules/receivables/types/manager-receivable.types";

const PAGE_SIZE = 5;

const MOCK_NOW =
  new Date(
    "2026-08-07T22:32:00+07:00",
  );

const DUE_SOON_LIMIT =
  new Date(
    "2026-08-10T22:32:00+07:00",
  );

const EMPTY_LIST_DATA:
  ManagerReceivableListData = {
    summary: {
      totalBilledAmount: 0,
      paidAmount: 0,
      outstandingAmount: 0,
      overdueAmount: 0,
      dueSoonAmount: 0,
      overdueCount: 0,
    },

    receivables: [],

    generatedAt: "",
  };

const currencyFormatter =
  new Intl.NumberFormat(
    "vi-VN",
    {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    },
  );

export const ManagerReceivablesPage = () => {
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
    useState<ManagerReceivableListData>(
      EMPTY_LIST_DATA,
    );

  const [
    selectedReceivable,
    setSelectedReceivable,
  ] =
    useState<ManagerReceivable | null>(
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
    useState<ManagerReceivableStatusFilter>(
      "ALL",
    );

  const [
    priorityFilter,
    setPriorityFilter,
  ] =
    useState<ManagerReceivablePriorityFilter>(
      "ALL",
    );

  const [
    dueFilter,
    setDueFilter,
  ] =
    useState<ManagerReceivableDueFilter>(
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

  const loadReceivables =
    useCallback(async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const context =
          await ensureAccessContext();

        const data =
          await managerReceivablesApi.getList(
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
            : "Không thể tải dữ liệu công nợ.",
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      ensureAccessContext,
      selectedScopeId,
    ]);

  useEffect(() => {
    void loadReceivables();
  }, [
    loadReceivables,
  ]);

  const filteredReceivables =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      return listData.receivables.filter(
        (receivable) => {
          const matchesSearch =
            !normalizedSearch ||
            receivable.receivableCode
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            receivable.invoiceCode
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            receivable.rentalCode
              .toLowerCase()
              .includes(
                normalizedSearch,
              ) ||
            receivable.customerName
              .toLowerCase()
              .includes(
                normalizedSearch,
              );

          const matchesStatus =
            statusFilter ===
              "ALL" ||
            receivable.status ===
              statusFilter;

          const matchesPriority =
            priorityFilter ===
              "ALL" ||
            receivable.priority ===
              priorityFilter;

          let matchesDue = true;

          if (
            dueFilter ===
            "OVERDUE"
          ) {
            matchesDue =
              receivable.status ===
              "OVERDUE";
          }

          if (
            dueFilter ===
            "DUE_SOON"
          ) {
            const dueDate =
              new Date(
                receivable.dueDate,
              );

            matchesDue =
              receivable.status !==
                "PAID" &&
              receivable.status !==
                "OVERDUE" &&
              dueDate > MOCK_NOW &&
              dueDate <=
                DUE_SOON_LIMIT;
          }

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority &&
            matchesDue
          );
        },
      );
    }, [
      dueFilter,
      listData.receivables,
      priorityFilter,
      searchTerm,
      statusFilter,
    ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredReceivables.length /
          PAGE_SIZE,
      ),
    );

  const paginatedReceivables =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        PAGE_SIZE;

      return filteredReceivables.slice(
        startIndex,
        startIndex +
          PAGE_SIZE,
      );
    }, [
      currentPage,
      filteredReceivables,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    dueFilter,
    priorityFilter,
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
        receivable:
          ManagerReceivable,
      ) => {
        setSelectedReceivable(
          receivable,
        );

        setIsDetailLoading(
          true,
        );

        try {
          const detail =
            await managerReceivablesApi.getById(
              receivable.id,
            );

          setSelectedReceivable(
            detail,
          );
        } catch (error) {
          setErrorMessage(
            error instanceof
              Error
              ? error.message
              : "Không thể tải chi tiết công nợ.",
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

      setStatusFilter(
        "ALL",
      );

      setPriorityFilter(
        "ALL",
      );

      setDueFilter("ALL");

      setSelectedScopeId(
        "ALL",
      );
    };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Quản lý tài chính
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Công nợ khách hàng
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Theo dõi số tiền đã
            thu, còn phải thu,
            khoản sắp đến hạn và
            công nợ quá hạn tại
            những chi nhánh được
            phân công.
          </p>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={() =>
            void loadReceivables()
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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <ManagerReceivableSummaryCard
          title="Tổng giá trị"
          value={currencyFormatter.format(
            listData.summary
              .totalBilledAmount,
          )}
          description="Tổng giá trị các khoản phải thu"
          icon={
            ReceiptText
          }
        />

        <ManagerReceivableSummaryCard
          title="Đã thu"
          value={currencyFormatter.format(
            listData.summary
              .paidAmount,
          )}
          description="Số tiền khách hàng đã thanh toán"
          icon={Banknote}
        />

        <ManagerReceivableSummaryCard
          title="Còn phải thu"
          value={currencyFormatter.format(
            listData.summary
              .outstandingAmount,
          )}
          description="Số dư công nợ hiện tại"
          icon={
            CircleDollarSign
          }
        />

        <ManagerReceivableSummaryCard
          title="Quá hạn"
          value={currencyFormatter.format(
            listData.summary
              .overdueAmount,
          )}
          description={`${listData.summary.overdueCount} khoản cần ưu tiên xử lý`}
          icon={
            AlertTriangle
          }
        />

        <ManagerReceivableSummaryCard
          title="Sắp đến hạn"
          value={currencyFormatter.format(
            listData.summary
              .dueSoonAmount,
          )}
          description="Đến hạn trong vòng 3 ngày"
          icon={Clock3}
        />
      </section>

      <ManagerReceivableFilters
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
        priorityFilter={
          priorityFilter
        }
        dueFilter={
          dueFilter
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
        onPriorityChange={
          setPriorityFilter
        }
        onDueChange={
          setDueFilter
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
              filteredReceivables.length
            }
          </span>{" "}
          khoản công nợ
        </p>

        <WalletCards
          size={18}
          className="text-slate-300"
        />
      </div>

      <ManagerReceivableTable
        receivables={
          paginatedReceivables
        }
        isLoading={
          isLoading
        }
        onView={
          handleView
        }
      />

      {!isLoading &&
        filteredReceivables.length >
          0 && (
        <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị{" "}
            <span className="font-bold text-slate-800">
              {
                paginatedReceivables.length
              }
            </span>{" "}
            trong{" "}
            <span className="font-bold text-slate-800">
              {
                filteredReceivables.length
              }
            </span>{" "}
            khoản công nợ
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

      <ManagerReceivableDetailDrawer
        receivable={
          selectedReceivable
        }
        isLoading={
          isDetailLoading
        }
        onClose={() =>
          setSelectedReceivable(
            null,
          )
        }
      />
    </div>
  );
};
