import {
  LockKeyhole,
  Plus,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  accountsApi,
} from "@/modules/accounts/api/accounts.api";

import {
  AccountActionConfirmDialog,
} from "@/modules/accounts/components/AccountActionConfirmDialog";

import {
  AccountDetailDrawer,
} from "@/modules/accounts/components/AccountDetailDrawer";

import {
  AccountFilters,
} from "@/modules/accounts/components/AccountFilters";

import {
  AccountFormModal,
  type AccountFormValues,
} from "@/modules/accounts/components/AccountFormModal";

import {
  DataPagination,
} from "@/shared/components/data-display/DataPagination";

import {
  AccountSortControls,
  type AccountSortField,
  type SortDirection,
} from "@/modules/accounts/components/AccountSortControls";

import {
  AccountTable,
} from "@/modules/accounts/components/AccountTable";

import {
  ResetPasswordDialog,
} from "@/modules/accounts/components/ResetPasswordDialog";

import {
  TemporaryPasswordDialog,
} from "@/modules/accounts/components/TemporaryPasswordDialog";

import type {
  Account,
  AccountFilters as AccountFiltersValue,
} from "@/modules/accounts/types/account.types";

type PendingAccountActionType =
  | "LOCK"
  | "UNLOCK"
  | "DELETE";

interface PendingAccountAction {
  type: PendingAccountActionType;
  account: Account;
}

interface PasswordResult {
  accountName: string;
  password: string;
}

const initialFilters: AccountFiltersValue = {
  search: "",
  role: "ALL",
  status: "ALL",
  branchName: "ALL",
};

const branches = [
  "Chi nhánh Hà Nội",
  "Chi nhánh Đà Nẵng",
  "Chi nhánh TP. Hồ Chí Minh",
];

export const AccountsPage = () => {
  const [filters, setFilters] =
    useState(initialFilters);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [pageSize, setPageSize] =
    useState(5);

  const [
    sortField,
    setSortField,
  ] = useState<AccountSortField>(
    "CREATED_AT",
  );

  const [
    sortDirection,
    setSortDirection,
  ] = useState<SortDirection>(
    "DESC",
  );

  const [accounts, setAccounts] =
    useState<Account[]>([]);

  const [
    selectedAccount,
    setSelectedAccount,
  ] = useState<Account | null>(null);

  const [
    editingAccount,
    setEditingAccount,
  ] = useState<Account | null>(null);

  const [formOpen, setFormOpen] =
    useState(false);

  const [isSaving, setIsSaving] =
    useState(false);

  const [
    pendingAction,
    setPendingAction,
  ] =
    useState<PendingAccountAction | null>(
      null,
    );

  const [
    isActionLoading,
    setIsActionLoading,
  ] = useState(false);

  const [
    resetPasswordAccount,
    setResetPasswordAccount,
  ] = useState<Account | null>(null);

  const [
    passwordResult,
    setPasswordResult,
  ] = useState<PasswordResult | null>(
    null,
  );

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string | null>(null);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const loadAccounts =
    useCallback(async (): Promise<void> => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const result =
          await accountsApi.getAll(
            filters,
          );

        setAccounts(result.items);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách tài khoản.",
        );
      } finally {
        setIsLoading(false);
      }
    }, [filters]);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId =
      window.setTimeout(() => {
        setSuccessMessage(null);
      }, 3500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [successMessage]);

  const sortedAccounts =
    useMemo(() => {
      const sortedItems = [
        ...accounts,
      ];

      sortedItems.sort(
        (left, right) => {
          let comparison = 0;

          if (
            sortField ===
            "FULL_NAME"
          ) {
            comparison =
              left.fullName.localeCompare(
                right.fullName,
                "vi",
                {
                  sensitivity: "base",
                },
              );
          }

          if (
            sortField === "ROLE"
          ) {
            comparison =
              left.role.localeCompare(
                right.role,
              );
          }

          if (
            sortField === "BRANCH"
          ) {
            comparison =
              left.branchName.localeCompare(
                right.branchName,
                "vi",
                {
                  sensitivity: "base",
                },
              );
          }

          if (
            sortField === "STATUS"
          ) {
            comparison =
              left.status.localeCompare(
                right.status,
              );
          }

          if (
            sortField ===
            "CREATED_AT"
          ) {
            comparison =
              new Date(
                left.createdAt,
              ).getTime() -
              new Date(
                right.createdAt,
              ).getTime();
          }

          if (
            sortField ===
            "LAST_LOGIN_AT"
          ) {
            const leftTime =
              left.lastLoginAt
                ? new Date(
                    left.lastLoginAt,
                  ).getTime()
                : 0;

            const rightTime =
              right.lastLoginAt
                ? new Date(
                    right.lastLoginAt,
                  ).getTime()
                : 0;

            comparison =
              leftTime - rightTime;
          }

          return sortDirection ===
            "ASC"
            ? comparison
            : -comparison;
        },
      );

      return sortedItems;
    }, [
      accounts,
      sortDirection,
      sortField,
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      accounts.length /
        pageSize,
    ),
  );

  const paginatedAccounts =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        pageSize;

      return sortedAccounts.slice(
        startIndex,
        startIndex + pageSize,
      );
    }, [
      sortedAccounts,
      currentPage,
      pageSize,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.search,
    filters.role,
    filters.status,
    filters.branchName,
    sortField,
    sortDirection,
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

  const statistics = useMemo(() => {
    return {
      total: accounts.length,

      active: accounts.filter(
        (account) =>
          account.status === "ACTIVE",
      ).length,

      locked: accounts.filter(
        (account) =>
          account.status === "LOCKED",
      ).length,

      pending: accounts.filter(
        (account) =>
          account.status === "PENDING",
      ).length,
    };
  }, [accounts]);

  const confirmDialogConfig =
    useMemo(() => {
      if (!pendingAction) {
        return null;
      }

      const { type, account } =
        pendingAction;

      if (type === "LOCK") {
        return {
          title: "Khóa tài khoản",
          description:
            `Bạn có chắc muốn khóa tài khoản “${account.fullName}”? ` +
            "Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa.",
          confirmLabel: "Khóa tài khoản",
          tone: "WARNING" as const,
        };
      }

      if (type === "UNLOCK") {
        return {
          title: "Mở khóa tài khoản",
          description:
            `Bạn có chắc muốn mở khóa tài khoản “${account.fullName}”? ` +
            "Người dùng sẽ có thể đăng nhập lại.",
          confirmLabel: "Mở khóa",
          tone: "WARNING" as const,
        };
      }

      return {
        title: "Xóa tài khoản",
        description:
          `Bạn có chắc muốn xóa tài khoản “${account.fullName}”? ` +
          "Thao tác này không thể hoàn tác trong phiên dữ liệu hiện tại.",
        confirmLabel: "Xóa tài khoản",
        tone: "DANGER" as const,
      };
    }, [pendingAction]);

  const handleOpenCreate =
    (): void => {
      setEditingAccount(null);
      setFormOpen(true);
    };

  const handleOpenEdit = (
    account: Account,
  ): void => {
    setEditingAccount(account);
    setFormOpen(true);
  };

  const handleCloseForm =
    (): void => {
      if (isSaving) {
        return;
      }

      setFormOpen(false);
      setEditingAccount(null);
    };

  const handleSaveAccount = async (
    values: AccountFormValues,
  ): Promise<void> => {
    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (editingAccount) {
        await accountsApi.update(
          editingAccount.id,
          {
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            role: values.role,
            branchName:
              values.branchName,
            status: values.status,
          },
        );

        setSuccessMessage(
          "Cập nhật tài khoản thành công.",
        );
      } else {
        await accountsApi.create({
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          role: values.role,
          branchName:
            values.branchName,
          status: values.status,
          temporaryPassword:
            values.temporaryPassword,
        });

        setSuccessMessage(
          "Tạo tài khoản mới thành công.",
        );
      }

      setFormOpen(false);
      setEditingAccount(null);

      await loadAccounts();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể lưu tài khoản.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmAction =
    async (): Promise<void> => {
      if (!pendingAction) {
        return;
      }

      setIsActionLoading(true);
      setErrorMessage(null);

      const { type, account } =
        pendingAction;

      try {
        if (
          type === "LOCK" ||
          type === "UNLOCK"
        ) {
          await accountsApi.toggleLock(
            account.id,
          );

          setSuccessMessage(
            type === "LOCK"
              ? "Đã khóa tài khoản thành công."
              : "Đã mở khóa tài khoản thành công.",
          );
        }

        if (type === "DELETE") {
          await accountsApi.remove(
            account.id,
          );

          if (
            selectedAccount?.id ===
            account.id
          ) {
            setSelectedAccount(null);
          }

          setSuccessMessage(
            "Đã xóa tài khoản thành công.",
          );
        }

        setPendingAction(null);

        await loadAccounts();
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể thực hiện thao tác.",
        );
      } finally {
        setIsActionLoading(false);
      }
    };

  return (
    <div>
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8">
        
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>


            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Quản lý tài khoản
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Quản lý tài khoản đăng nhập, vai trò, chi nhánh
              và trạng thái hoạt động trên toàn hệ thống.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
          >
            <Plus size={19} />
            Thêm tài khoản
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Tổng tài khoản",
            description: "Tất cả người dùng",
            value: statistics.total,
            icon: Users,
            iconClassName:
              "bg-blue-50 text-blue-600",
          },
          {
            label: "Đang hoạt động",
            description: "Có thể đăng nhập",
            value: statistics.active,
            icon: UserCheck,
            iconClassName:
              "bg-blue-50 text-blue-600",
          },
          {
            label: "Đã khóa",
            description: "Tạm ngừng truy cập",
            value: statistics.locked,
            icon: LockKeyhole,
            iconClassName:
              "bg-blue-50 text-blue-600",
          },
          {
            label: "Chờ kích hoạt",
            description: "Chưa hoàn tất xác nhận",
            value: statistics.pending,
            icon: ShieldCheck,
            iconClassName:
              "bg-blue-50 text-blue-600",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span
                  className={[
                    "flex size-11 items-center justify-center rounded-xl",
                    item.iconClassName,
                  ].join(" ")}
                >
                  <Icon size={21} />
                </span>

                <strong className="text-3xl font-bold text-slate-950">
                  {item.value}
                </strong>
              </div>

              <div className="mt-5">
                <p className="text-sm font-bold text-slate-800">
                  {item.label}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      <div className="mt-5">
        <AccountFilters
          value={filters}
          branches={branches}
          onChange={setFilters}
        />
      </div>

      <div className="mt-4">
        <AccountSortControls
          field={sortField}
          direction={
            sortDirection
          }
          onFieldChange={
            setSortField
          }
          onDirectionChange={
            setSortDirection
          }
        />
      </div>

      {successMessage && (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 shadow-sm">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm">
          {errorMessage}
        </div>
      )}

      <div className="mt-5">
        <AccountTable
          accounts={
            paginatedAccounts
          }
          totalCount={
            accounts.length
          }
          serialOffset={
            (currentPage - 1) *
            pageSize
          }
          isLoading={isLoading}
          onView={setSelectedAccount}
          onEdit={handleOpenEdit}
          onToggleLock={(account) => {
            setPendingAction({
              type:
                account.status ===
                "LOCKED"
                  ? "UNLOCK"
                  : "LOCK",
              account,
            });
          }}
          onResetPassword={(account) => {
            setResetPasswordAccount(
              account,
            );
          }}
          onDelete={(account) => {
            setPendingAction({
              type: "DELETE",
              account,
            });
          }}
        />
      </div>

      {!isLoading && (
        <DataPagination
          currentPage={
            currentPage
          }
          pageSize={pageSize}
          totalItems={
            accounts.length
          }
          itemLabel="tài khoản"
          onPageChange={
            setCurrentPage
          }
          onPageSizeChange={(
            nextPageSize,
          ) => {
            setPageSize(
              nextPageSize,
            );

            setCurrentPage(1);
          }}
        />
      )}

      <AccountDetailDrawer
        account={selectedAccount}
        open={
          selectedAccount !== null
        }
        onClose={() => {
          setSelectedAccount(null);
        }}
      />

      <AccountFormModal
        open={formOpen}
        account={editingAccount}
        branches={branches}
        isSubmitting={isSaving}
        onClose={handleCloseForm}
        onSubmit={handleSaveAccount}
      />

      <AccountActionConfirmDialog
        open={pendingAction !== null}
        title={
          confirmDialogConfig?.title ??
          ""
        }
        description={
          confirmDialogConfig
            ?.description ?? ""
        }
        confirmLabel={
          confirmDialogConfig
            ?.confirmLabel ?? "Xác nhận"
        }
        tone={
          confirmDialogConfig?.tone ??
          "WARNING"
        }
        isLoading={isActionLoading}
        onCancel={() => {
          if (!isActionLoading) {
            setPendingAction(null);
          }
        }}
        onConfirm={
          handleConfirmAction
        }
      />

      <ResetPasswordDialog
        open={
          resetPasswordAccount !== null
        }
        accountName={
          resetPasswordAccount
            ?.fullName ?? ""
        }
        isLoading={isActionLoading}
        onClose={() => {
          if (!isActionLoading) {
            setResetPasswordAccount(null);
          }
        }}
        onConfirm={async (
          password,
        ) => {
          if (!resetPasswordAccount) {
            return;
          }

          setIsActionLoading(true);
          setErrorMessage(null);

          try {
            const result =
              await accountsApi.resetPassword(
                resetPasswordAccount.id,
                password,
              );

            setPasswordResult({
              accountName:
                resetPasswordAccount.fullName,
              password:
                result.temporaryPassword,
            });

            setResetPasswordAccount(null);
          } catch (error) {
            setErrorMessage(
              error instanceof Error
                ? error.message
                : "Không thể đặt lại mật khẩu.",
            );
          } finally {
            setIsActionLoading(false);
          }
        }}
      />

      <TemporaryPasswordDialog
        open={passwordResult !== null}
        accountName={
          passwordResult?.accountName ??
          ""
        }
        password={
          passwordResult?.password ?? ""
        }
        onClose={() => {
          setPasswordResult(null);
        }}
      />
    </div>
  );
};
