import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  RefreshCw,
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
  managerQuotationApprovalsApi,
} from "@/modules/quotations/api/manager-quotation-approvals.api";

import {
  ManagerQuotationDecisionDialog,
} from "@/modules/quotations/components/ManagerQuotationDecisionDialog";

import type {
  QuotationDecisionAction,
} from "@/modules/quotations/components/ManagerQuotationDecisionDialog";

import {
  ManagerQuotationDetailDrawer,
} from "@/modules/quotations/components/ManagerQuotationDetailDrawer";

import {
  ManagerQuotationFilters,
} from "@/modules/quotations/components/ManagerQuotationFilters";

import type {
  QuotationPriorityFilter,
  QuotationStatusFilter,
} from "@/modules/quotations/components/ManagerQuotationFilters";

import {
  ManagerQuotationSummaryCard,
} from "@/modules/quotations/components/ManagerQuotationSummaryCard";

import {
  ManagerQuotationTable,
} from "@/modules/quotations/components/ManagerQuotationTable";

import type {
  ManagerQuotation,
  ManagerQuotationListData,
} from "@/modules/quotations/types/manager-quotation-approval.types";

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

export const ManagerQuotationApprovalsPage =
  () => {
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
      useState<ManagerQuotationListData | null>(
        null,
      );

    const [
      selectedQuotation,
      setSelectedQuotation,
    ] =
      useState<ManagerQuotation | null>(
        null,
      );

    const [
      isDetailOpen,
      setIsDetailOpen,
    ] = useState(false);

    const [
      isDetailLoading,
      setIsDetailLoading,
    ] = useState(false);

    const [
      decisionAction,
      setDecisionAction,
    ] =
      useState<QuotationDecisionAction | null>(
        null,
      );

    const [
      decisionQuotation,
      setDecisionQuotation,
    ] =
      useState<ManagerQuotation | null>(
        null,
      );

    const [
      isLoading,
      setIsLoading,
    ] = useState(true);

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
      decisionError,
      setDecisionError,
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
      useState<QuotationStatusFilter>(
        "PENDING_APPROVAL",
      );

    const [
      priorityFilter,
      setPriorityFilter,
    ] =
      useState<QuotationPriorityFilter>(
        "ALL",
      );

    const [
      currentPage,
      setCurrentPage,
    ] = useState(1);

    const loadAccessContext =
      useCallback(async () => {
        if (
          accessContext ||
          !user?.id
        ) {
          return;
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

    const loadQuotations =
      useCallback(async () => {
        if (!accessContext) {
          return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
          const data =
            await managerQuotationApprovalsApi
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
              : "Không thể tải danh sách báo giá.",
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
        void loadQuotations();
      }
    }, [
      accessContext,
      loadQuotations,
    ]);

    useEffect(() => {
      setCurrentPage(1);
    }, [
      searchTerm,
      statusFilter,
      priorityFilter,
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

    const filteredQuotations =
      useMemo(() => {
        const normalizedSearch =
          searchTerm
            .trim()
            .toLowerCase();

        return (
          listData?.quotations.filter(
            (quotation) => {
              const matchesSearch =
                !normalizedSearch ||
                quotation.quotationCode
                  .toLowerCase()
                  .includes(
                    normalizedSearch,
                  ) ||
                quotation.customerName
                  .toLowerCase()
                  .includes(
                    normalizedSearch,
                  ) ||
                quotation.eventName
                  .toLowerCase()
                  .includes(
                    normalizedSearch,
                  );

              const matchesStatus =
                statusFilter === "ALL" ||
                quotation.status ===
                  statusFilter;

              const matchesPriority =
                priorityFilter ===
                  "ALL" ||
                quotation.priority ===
                  priorityFilter;

              return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority
              );
            },
          ) ?? []
        );
      }, [
        listData?.quotations,
        priorityFilter,
        searchTerm,
        statusFilter,
      ]);

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          filteredQuotations.length /
            PAGE_SIZE,
        ),
      );

    const safeCurrentPage =
      Math.min(
        currentPage,
        totalPages,
      );

    const paginatedQuotations =
      filteredQuotations.slice(
        (safeCurrentPage - 1) *
          PAGE_SIZE,
        safeCurrentPage *
          PAGE_SIZE,
      );

    const openDetail =
      async (
        quotation:
          ManagerQuotation,
      ) => {
        setSelectedQuotation(
          quotation,
        );

        setIsDetailOpen(true);
        setIsDetailLoading(true);

        try {
          const detail =
            await managerQuotationApprovalsApi
              .getById(
                quotation.id,
              );

          setSelectedQuotation(
            detail,
          );
        } catch (error) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Không thể tải chi tiết báo giá.",
          );
        } finally {
          setIsDetailLoading(false);
        }
      };

    const openDecision = (
      quotation:
        ManagerQuotation,
      action:
        QuotationDecisionAction,
    ) => {
      setDecisionQuotation(
        quotation,
      );

      setDecisionAction(action);
      setDecisionError(null);
    };

    const closeDecision = () => {
      if (isSubmitting) {
        return;
      }

      setDecisionQuotation(null);
      setDecisionAction(null);
      setDecisionError(null);
    };

    const handleDecision =
      async (value: string) => {
        if (
          !decisionQuotation ||
          !decisionAction ||
          !user
        ) {
          return;
        }

        setIsSubmitting(true);
        setDecisionError(null);

        try {
          const updatedQuotation =
            decisionAction ===
            "APPROVE"
              ? await managerQuotationApprovalsApi
                  .approve({
                    quotationId:
                      decisionQuotation.id,
                    reviewerId:
                      user.id,
                    reviewerName:
                      user.fullName,
                    note: value,
                  })
              : await managerQuotationApprovalsApi
                  .reject({
                    quotationId:
                      decisionQuotation.id,
                    reviewerId:
                      user.id,
                    reviewerName:
                      user.fullName,
                    reason: value,
                  });

          setSelectedQuotation(
            (current) =>
              current?.id ===
              updatedQuotation.id
                ? updatedQuotation
                : current,
          );

          setSuccessMessage(
            decisionAction ===
              "APPROVE"
              ? `Đã phê duyệt ${updatedQuotation.quotationCode}.`
              : `Đã từ chối ${updatedQuotation.quotationCode}.`,
          );

          setDecisionQuotation(null);
          setDecisionAction(null);
          setDecisionError(null);

          await loadQuotations();
        } catch (error) {
          setDecisionError(
            error instanceof Error
              ? error.message
              : "Không thể xử lý báo giá.",
          );
        } finally {
          setIsSubmitting(false);
        }
      };

    const resetFilters = () => {
      setSearchTerm("");

      setStatusFilter(
        "PENDING_APPROVAL",
      );

      setPriorityFilter("ALL");
      setSelectedScopeId("ALL");
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
                Không thể mở trang duyệt báo giá
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
              Quản lý kinh doanh
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Báo giá chờ duyệt
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Kiểm tra giá, thiết bị,
              đặt cọc và các khoản phí
              trước khi phê duyệt.
            </p>
          </div>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              void loadQuotations();
            }}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={
                isLoading
                  ? "animate-spin"
                  : ""
              }
            />

            Làm mới dữ liệu
          </button>
        </header>

        {successMessage && (
          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
            <CheckCircle2
              size={18}
            />

            {successMessage}
          </div>
        )}

        {errorMessage &&
          accessContext && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          )}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <ManagerQuotationSummaryCard
            title="Báo giá chờ duyệt"
            value={(
              summary?.pendingCount ??
              0
            ).toLocaleString(
              "vi-VN",
            )}
            description="Cần quản lý kiểm tra"
            icon={ClipboardCheck}
          />

          <ManagerQuotationSummaryCard
            title="Giá trị chờ duyệt"
            value={currencyFormatter.format(
              summary?.pendingValue ??
                0,
            )}
            description="Tổng giá trị báo giá đang chờ"
            icon={Banknote}
          />

          <ManagerQuotationSummaryCard
            title="Sắp hết hiệu lực"
            value={(
              summary?.expiringSoonCount ??
              0
            ).toLocaleString(
              "vi-VN",
            )}
            description="Hết hiệu lực trong 48 giờ"
            icon={Clock3}
          />

          <ManagerQuotationSummaryCard
            title="Đã xử lý"
            value={(
              summary?.processedCount ??
              0
            ).toLocaleString(
              "vi-VN",
            )}
            description="Đã duyệt hoặc từ chối"
            icon={CheckCircle2}
          />
        </section>

        {accessContext && (
          <ManagerQuotationFilters
            branches={
              accessContext.assignedBranches
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
            onReset={
              resetFilters
            }
          />
        )}

        <ManagerQuotationTable
          quotations={
            paginatedQuotations
          }
          isLoading={isLoading}
          onView={openDetail}
          onApprove={(
            quotation,
          ) =>
            openDecision(
              quotation,
              "APPROVE",
            )
          }
          onReject={(
            quotation,
          ) =>
            openDecision(
              quotation,
              "REJECT",
            )
          }
        />

        <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị{" "}
            <strong className="text-slate-700">
              {paginatedQuotations.length}
            </strong>{" "}
            trong{" "}
            <strong className="text-slate-700">
              {filteredQuotations.length}
            </strong>{" "}
            báo giá
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

        <ManagerQuotationDetailDrawer
          quotation={
            selectedQuotation
          }
          isOpen={isDetailOpen}
          isLoading={
            isDetailLoading
          }
          onClose={() =>
            setIsDetailOpen(false)
          }
          onApprove={(
            quotation,
          ) =>
            openDecision(
              quotation,
              "APPROVE",
            )
          }
          onReject={(
            quotation,
          ) =>
            openDecision(
              quotation,
              "REJECT",
            )
          }
        />

        <ManagerQuotationDecisionDialog
          quotation={
            decisionQuotation
          }
          action={decisionAction}
          isSubmitting={
            isSubmitting
          }
          errorMessage={
            decisionError
          }
          onClose={closeDecision}
          onSubmit={handleDecision}
        />
      </div>
    );
  };
