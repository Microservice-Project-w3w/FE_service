import {
  AlertTriangle,
  Banknote,
  CalendarClock,
  ClipboardList,
  PackageCheck,
  RefreshCw,
  RotateCcw,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useAuthStore,
} from "@/modules/auth/store/auth.store";

import {
  managerContextApi,
  useManagerScopeStore,
} from "@/modules/manager-context";

import {
  managerRentalsApi,
} from "@/modules/rentals/api/manager-rentals.api";

import {
  ManagerRentalActionDialog,
} from "@/modules/rentals/components/ManagerRentalActionDialog";

import type {
  ManagerRentalAction,
  ManagerRentalActionFormValue,
} from "@/modules/rentals/components/ManagerRentalActionDialog";

import {
  ManagerRentalDetailDrawer,
} from "@/modules/rentals/components/ManagerRentalDetailDrawer";

import {
  ManagerRentalFilters,
} from "@/modules/rentals/components/ManagerRentalFilters";

import type {
  ManagerRentalPriorityFilter,
  ManagerRentalStatusFilter,
  RentalPaymentStatusFilter,
} from "@/modules/rentals/components/ManagerRentalFilters";

import {
  ManagerRentalSummaryCard,
} from "@/modules/rentals/components/ManagerRentalSummaryCard";

import {
  ManagerRentalTable,
} from "@/modules/rentals/components/ManagerRentalTable";

import type {
  ManagerRental,
  ManagerRentalListData,
} from "@/modules/rentals/types/manager-rental.types";

const PAGE_SIZE = 5;

const currencyFormatter =
  new Intl.NumberFormat(
    "vi-VN",
    {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    },
  );

export const ManagerRentalsPage = () => {
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
    listData,
    setListData,
  ] =
    useState<ManagerRentalListData | null>(
      null,
    );

  const [
    selectedRental,
    setSelectedRental,
  ] =
    useState<ManagerRental | null>(
      null,
    );

  const [
    actionRental,
    setActionRental,
  ] =
    useState<ManagerRental | null>(
      null,
    );

  const [
    selectedAction,
    setSelectedAction,
  ] =
    useState<ManagerRentalAction | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isDetailOpen,
    setIsDetailOpen,
  ] = useState(false);

  const [
    isDetailLoading,
    setIsDetailLoading,
  ] = useState(false);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null,
  );

  const [
    actionError,
    setActionError,
  ] = useState<string | null>(
    null,
  );

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string | null>(
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
    useState<ManagerRentalStatusFilter>(
      "ALL",
    );

  const [
    priorityFilter,
    setPriorityFilter,
  ] =
    useState<ManagerRentalPriorityFilter>(
      "ALL",
    );

  const [
    paymentFilter,
    setPaymentFilter,
  ] =
    useState<RentalPaymentStatusFilter>(
      "ALL",
    );

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const loadAccessContext =
    useCallback(async () => {
      if (accessContext) {
        return;
      }

      if (!user?.id) {
        throw new Error(
          "Không tìm thấy thông tin tài khoản quản lý.",
        );
      }

      const context =
        await managerContextApi
          .getMyAccessContext({
            userId: user.id,
          });

      setAccessContext(context);
    }, [
      accessContext,
      setAccessContext,
      user?.id,
    ]);

  const loadRentals =
    useCallback(async () => {
      if (!accessContext) {
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data =
          await managerRentalsApi
            .getList({
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
            });

        setListData(data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách đơn thuê.",
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      accessContext,
      selectedScopeId,
    ]);

  useEffect(() => {
    const initialize =
      async () => {
        try {
          await loadAccessContext();
        } catch (error) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Không thể tải phạm vi quản lý.",
          );

          setIsLoading(false);
        }
      };

    void initialize();
  }, [loadAccessContext]);

  useEffect(() => {
    if (accessContext) {
      void loadRentals();
    }
  }, [
    accessContext,
    loadRentals,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    statusFilter,
    priorityFilter,
    paymentFilter,
    selectedScopeId,
  ]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId =
      window.setTimeout(() => {
        setSuccessMessage(null);
      }, 3500);

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, [successMessage]);

  const filteredRentals =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      return (
        listData?.rentals.filter(
          (rental) => {
            const matchesSearch =
              !normalizedSearch ||
              rental.rentalCode
                .toLowerCase()
                .includes(
                  normalizedSearch,
                ) ||
              rental.quotationCode
                .toLowerCase()
                .includes(
                  normalizedSearch,
                ) ||
              rental.contractCode
                ?.toLowerCase()
                .includes(
                  normalizedSearch,
                ) ||
              rental.customerName
                .toLowerCase()
                .includes(
                  normalizedSearch,
                ) ||
              rental.eventName
                .toLowerCase()
                .includes(
                  normalizedSearch,
                );

            const matchesStatus =
              statusFilter === "ALL" ||
              rental.status ===
                statusFilter;

            const matchesPriority =
              priorityFilter ===
                "ALL" ||
              rental.priority ===
                priorityFilter;

            const matchesPayment =
              paymentFilter === "ALL" ||
              rental.paymentStatus ===
                paymentFilter;

            return (
              matchesSearch &&
              matchesStatus &&
              matchesPriority &&
              matchesPayment
            );
          },
        ) ?? []
      );
    }, [
      listData?.rentals,
      paymentFilter,
      priorityFilter,
      searchTerm,
      statusFilter,
    ]);

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredRentals.length /
          PAGE_SIZE,
      ),
    );

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages,
    );

  const paginatedRentals =
    filteredRentals.slice(
      (safeCurrentPage - 1) *
        PAGE_SIZE,
      safeCurrentPage *
        PAGE_SIZE,
    );

  const openDetail =
    async (
      rental: ManagerRental,
    ) => {
      setSelectedRental(rental);
      setIsDetailOpen(true);
      setIsDetailLoading(true);
      setErrorMessage(null);

      try {
        const detail =
          await managerRentalsApi
            .getById(rental.id);

        setSelectedRental(detail);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải chi tiết đơn thuê.",
        );
      } finally {
        setIsDetailLoading(false);
      }
    };

  const openAction = (
    rental: ManagerRental,
    action: ManagerRentalAction,
  ) => {
    setActionRental(rental);
    setSelectedAction(action);
    setActionError(null);
  };

  const closeAction = () => {
    if (isSubmitting) {
      return;
    }

    setActionRental(null);
    setSelectedAction(null);
    setActionError(null);
  };

  const handleActionSubmit =
    async (
      value: ManagerRentalActionFormValue,
    ) => {
      if (
        !actionRental ||
        !selectedAction ||
        !user
      ) {
        return;
      }

      setIsSubmitting(true);
      setActionError(null);

      try {
        let updatedRental:
          ManagerRental;

        if (
          selectedAction ===
          "RESERVE"
        ) {
          updatedRental =
            await managerRentalsApi
              .confirmReservation({
                rentalId:
                  actionRental.id,

                actorId: user.id,

                actorName:
                  user.fullName,

                note: value.note,
              });
        } else if (
          selectedAction ===
          "EXTEND"
        ) {
          updatedRental =
            await managerRentalsApi
              .extend({
                rentalId:
                  actionRental.id,

                actorId: user.id,

                actorName:
                  user.fullName,

                newEndDate:
                  value.newEndDate,

                note: value.note,
              });
        } else {
          updatedRental =
            await managerRentalsApi
              .cancel({
                rentalId:
                  actionRental.id,

                actorId: user.id,

                actorName:
                  user.fullName,

                reason: value.note,
              });
        }

        setSelectedRental(
          (current) =>
            current?.id ===
            updatedRental.id
              ? updatedRental
              : current,
        );

        const successLabels:
          Record<
            ManagerRentalAction,
            string
          > = {
          RESERVE:
            "Đã xác nhận giữ chỗ cho",

          EXTEND:
            "Đã gia hạn",

          CANCEL:
            "Đã hủy",
        };

        setSuccessMessage(
          `${successLabels[selectedAction]} ${updatedRental.rentalCode}.`,
        );

        setActionRental(null);
        setSelectedAction(null);
        setActionError(null);

        await loadRentals();
      } catch (error) {
        setActionError(
          error instanceof Error
            ? error.message
            : "Không thể xử lý đơn thuê.",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setPaymentFilter("ALL");
    setSelectedScopeId("ALL");
  };

  const resetMockData =
    async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        await managerRentalsApi
          .resetMockData();

        setSuccessMessage(
          "Đã khôi phục dữ liệu đơn thuê ban đầu.",
        );

        setIsDetailOpen(false);
        setSelectedRental(null);

        await loadRentals();
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể khôi phục dữ liệu.",
        );
      } finally {
        setIsLoading(false);
      }
    };

  if (
    !accessContext &&
    !isLoading &&
    errorMessage
  ) {
    return (
      <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <AlertTriangle
              size={21}
            />
          </div>

          <div>
            <h1 className="text-lg font-bold text-rose-800">
              Không thể mở trang đơn thuê
            </h1>

            <p className="mt-2 text-sm text-rose-700">
              {errorMessage}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const summary =
    listData?.summary;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Quản lý hoạt động thuê
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Đơn thuê
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Theo dõi giữ chỗ, thời gian
            thuê, thanh toán, gia hạn,
            hoàn trả và hủy đơn.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              void resetMockData();
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
          >
            <RotateCcw size={17} />
            Khôi phục dữ liệu
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              void loadRentals();
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
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
        </div>
      </header>

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          <PackageCheck size={18} />
          {successMessage}
        </div>
      )}

      {errorMessage &&
        accessContext && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </div>
        )}

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <ManagerRentalSummaryCard
          title="Tổng đơn thuê"
          value={(
            summary?.totalCount ??
            0
          ).toLocaleString(
            "vi-VN",
          )}
          description="Trong phạm vi đang chọn"
          icon={ClipboardList}
        />

        <ManagerRentalSummaryCard
          title="Đang xử lý"
          value={(
            summary?.activeCount ??
            0
          ).toLocaleString(
            "vi-VN",
          )}
          description="Giữ chỗ, xác nhận và đang thuê"
          icon={PackageCheck}
        />

        <ManagerRentalSummaryCard
          title="Đơn quá hạn"
          value={(
            summary?.overdueCount ??
            0
          ).toLocaleString(
            "vi-VN",
          )}
          description="Cần liên hệ hoàn trả"
          icon={AlertTriangle}
        />

        <ManagerRentalSummaryCard
          title="Trả trong hôm nay"
          value={(
            summary?.dueTodayCount ??
            0
          ).toLocaleString(
            "vi-VN",
          )}
          description="Theo thời gian dự kiến"
          icon={CalendarClock}
        />

        <ManagerRentalSummaryCard
          title="Còn phải thu"
          value={currencyFormatter.format(
            summary
              ?.outstandingAmount ??
              0,
          )}
          description="Không tính đơn đã hủy"
          icon={Banknote}
        />
      </section>

      {accessContext && (
        <ManagerRentalFilters
          branches={
            accessContext.assignedBranches
          }
          selectedScopeId={
            selectedScopeId
          }
          searchTerm={searchTerm}
          statusFilter={
            statusFilter
          }
          priorityFilter={
            priorityFilter
          }
          paymentFilter={
            paymentFilter
          }
          disabled={isLoading}
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
          onPaymentChange={
            setPaymentFilter
          }
          onReset={resetFilters}
        />
      )}

      <ManagerRentalTable
        rentals={paginatedRentals}
        isLoading={isLoading}
        onView={openDetail}
        onReserve={(rental) =>
          openAction(
            rental,
            "RESERVE",
          )
        }
        onExtend={(rental) =>
          openAction(
            rental,
            "EXTEND",
          )
        }
        onCancel={(rental) =>
          openAction(
            rental,
            "CANCEL",
          )
        }
      />

      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Hiển thị{" "}
          <strong className="text-slate-700">
            {paginatedRentals.length}
          </strong>{" "}
          trong{" "}
          <strong className="text-slate-700">
            {filteredRentals.length}
          </strong>{" "}
          đơn thuê
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={
              safeCurrentPage <= 1
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
            className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Trước
          </button>

          <span className="min-w-24 text-center text-sm font-semibold text-slate-600">
            Trang {safeCurrentPage}/
            {totalPages}
          </span>

          <button
            type="button"
            disabled={
              safeCurrentPage >=
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
            className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      </section>

      <ManagerRentalDetailDrawer
        rental={selectedRental}
        isOpen={isDetailOpen}
        isLoading={
          isDetailLoading
        }
        onClose={() =>
          setIsDetailOpen(false)
        }
        onReserve={(rental) =>
          openAction(
            rental,
            "RESERVE",
          )
        }
        onExtend={(rental) =>
          openAction(
            rental,
            "EXTEND",
          )
        }
        onCancel={(rental) =>
          openAction(
            rental,
            "CANCEL",
          )
        }
      />

      <ManagerRentalActionDialog
        rental={actionRental}
        action={selectedAction}
        isSubmitting={
          isSubmitting
        }
        errorMessage={actionError}
        onClose={closeAction}
        onSubmit={
          handleActionSubmit
        }
      />
    </div>
  );
};
