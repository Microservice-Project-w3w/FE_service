import {
  Eye,
  KeyRound,
  LockKeyhole,
  Pencil,
  Trash2,
  UnlockKeyhole,
  Users,
} from "lucide-react";

import {
  USER_ROLE_LABELS,
} from "@/core/auth/roleLabels";

import {
  AccountStatusBadge,
} from "@/modules/accounts/components/AccountStatusBadge";

import type {
  Account,
} from "@/modules/accounts/types/account.types";

import type {
  UserRole,
} from "@/modules/auth/types/auth.types";

interface AccountTableProps {
  accounts: Account[];
  totalCount: number;
  serialOffset?: number;
  isLoading: boolean;
  onView: (account: Account) => void;
  onEdit: (account: Account) => void;
  onToggleLock: (
    account: Account,
  ) => void;
  onResetPassword: (
    account: Account,
  ) => void;
  onDelete: (
    account: Account,
  ) => void;
}

const roleStyles: Record<
  UserRole,
  {
    avatarClassName: string;
    badgeClassName: string;
  }
> = {
  ADMIN: {
    avatarClassName:
      "border-blue-100 bg-blue-50 text-blue-700",
    badgeClassName:
      "border-blue-100 bg-blue-50 text-blue-700",
  },

  MANAGER: {
    avatarClassName:
      "border-blue-100 bg-blue-50 text-blue-700",
    badgeClassName:
      "border-blue-100 bg-blue-50 text-blue-700",
  },

  SALES_STAFF: {
    avatarClassName:
      "border-blue-100 bg-blue-50 text-blue-700",
    badgeClassName:
      "border-blue-100 bg-blue-50 text-blue-700",
  },

  OPERATIONS_STAFF: {
    avatarClassName:
      "border-blue-100 bg-blue-50 text-blue-700",
    badgeClassName:
      "border-blue-100 bg-blue-50 text-blue-700",
  },

  ACCOUNTANT: {
    avatarClassName:
      "border-blue-100 bg-blue-50 text-blue-700",
    badgeClassName:
      "border-blue-100 bg-blue-50 text-blue-700",
  },

  CUSTOMER: {
    avatarClassName:
      "border-blue-100 bg-blue-50 text-blue-700",
    badgeClassName:
      "border-blue-100 bg-blue-50 text-blue-700",
  },
};

const dateFormatter =
  new Intl.DateTimeFormat(
    "vi-VN",
    {
      dateStyle: "short",
      timeStyle: "short",
    },
  );

const formatDateTime = (
  value: string | null,
): string => {
  if (!value) {
    return "Chưa đăng nhập";
  }

  return dateFormatter.format(
    new Date(value),
  );
};

const getInitials = (
  fullName: string,
): string => {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join("");
};

export const AccountTable = ({
  accounts,
  totalCount,
  serialOffset = 0,
  isLoading,
  onView,
  onEdit,
  onToggleLock,
  onResetPassword,
  onDelete,
}: AccountTableProps) => {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
        <div className="space-y-3 p-5">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl bg-gradient-to-r from-slate-100 via-blue-50 to-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="rounded-[24px] border border-blue-100 bg-gradient-to-br from-white to-blue-50 px-6 py-16 text-center shadow-sm">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-200">
          <Users size={28} />
        </span>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Không tìm thấy tài khoản
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Hãy thay đổi từ khóa hoặc bộ lọc để xem kết quả khác.
        </p>
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Danh sách tài khoản
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Theo dõi người dùng và quyền truy cập hệ thống
          </p>
        </div>

        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
          {totalCount} tài khoản
        </span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1320px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-left">
              <th className="w-20 px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                STT
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Tài khoản
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Liên hệ
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Vai trò
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Chi nhánh
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Trạng thái
              </th>

              <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Đăng nhập gần nhất
              </th>

              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {accounts.map((account, index) => {
              const roleStyle =
                roleStyles[account.role];

              const isProtectedAdmin =
                account.id ===
                "account-admin-001";

              const isLocked =
                account.status ===
                "LOCKED";

              return (
                <tr
                  key={account.id}
                  className="border-b border-slate-100 transition last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50/70 hover:to-indigo-50/30"
                >
                  <td className="px-6 py-5 align-top text-sm font-semibold text-slate-500">
                    {serialOffset + index + 1}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "flex size-11 shrink-0 items-center justify-center",
                          "rounded-xl border text-xs font-bold",
                          "shadow-sm",
                          roleStyle.avatarClassName,
                        ].join(" ")}
                      >
                        {getInitials(
                          account.fullName,
                        )}
                      </span>

                      <div className="min-w-0">
                        <p className="max-w-52 truncate text-sm font-bold text-slate-900">
                          {account.fullName}
                        </p>

                        <p className="mt-1 text-xs font-medium text-slate-400">
                          {account.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      {account.email}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {account.phone}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={[
                        "inline-flex rounded-full border px-3 py-1.5",
                        "whitespace-nowrap text-xs font-bold",
                        roleStyle.badgeClassName,
                      ].join(" ")}
                    >
                      {
                        USER_ROLE_LABELS[
                          account.role
                        ]
                      }
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <p className="max-w-40 text-sm font-medium leading-5 text-slate-600">
                      {account.branchName}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <AccountStatusBadge
                      status={
                        account.status
                      }
                    />
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-slate-600">
                    {formatDateTime(
                      account.lastLoginAt,
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        title="Xem chi tiết"
                        aria-label={`Xem ${account.fullName}`}
                        onClick={() =>
                          onView(account)
                        }
                        className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        type="button"
                        title="Chỉnh sửa"
                        aria-label={`Chỉnh sửa ${account.fullName}`}
                        onClick={() =>
                          onEdit(account)
                        }
                        className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        title={
                          isProtectedAdmin
                            ? "Không thể khóa quản trị viên chính"
                            : isLocked
                              ? "Mở khóa tài khoản"
                              : "Khóa tài khoản"
                        }
                        aria-label={
                          isLocked
                            ? `Mở khóa ${account.fullName}`
                            : `Khóa ${account.fullName}`
                        }
                        disabled={
                          isProtectedAdmin
                        }
                        onClick={() =>
                          onToggleLock(
                            account,
                          )
                        }
                        className={[
                          "flex size-9 items-center justify-center rounded-xl border transition",
                          "hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35",
                          "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
                        ].join(" ")}
                      >
                        {isLocked ? (
                          <UnlockKeyhole
                            size={16}
                          />
                        ) : (
                          <LockKeyhole
                            size={16}
                          />
                        )}
                      </button>

                      <button
                        type="button"
                        title="Đặt lại mật khẩu"
                        aria-label={`Đặt lại mật khẩu ${account.fullName}`}
                        onClick={() =>
                          onResetPassword(
                            account,
                          )
                        }
                        className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <KeyRound size={16} />
                      </button>

                      <button
                        type="button"
                        title={
                          isProtectedAdmin
                            ? "Không thể xóa quản trị viên chính"
                            : "Xóa tài khoản"
                        }
                        aria-label={`Xóa ${account.fullName}`}
                        disabled={
                          isProtectedAdmin
                        }
                        onClick={() =>
                          onDelete(account)
                        }
                        className="flex size-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </section>
  );
};
