import {
  Building2,
  CalendarDays,
  Mail,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect } from "react";

import {
  USER_ROLE_LABELS,
} from "@/core/auth/roleLabels";

import {
  AccountStatusBadge,
} from "@/modules/accounts/components/AccountStatusBadge";

import type {
  Account,
} from "@/modules/accounts/types/account.types";

interface AccountDetailDrawerProps {
  account: Account | null;
  open: boolean;
  onClose: () => void;
}

const dateFormatter =
  new Intl.DateTimeFormat(
    "vi-VN",
    {
      dateStyle: "long",
      timeStyle: "short",
    },
  );

const formatDate = (
  value: string | null,
): string => {
  if (!value) {
    return "Chưa có dữ liệu";
  }

  return dateFormatter.format(
    new Date(value),
  );
};

export const AccountDetailDrawer = ({
  account,
  open,
  onClose,
}: AccountDetailDrawerProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, onClose]);

  if (!open || !account) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Đóng thông tin tài khoản"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-detail-title"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
              Thông tin tài khoản
            </p>

            <h2
              id="account-detail-title"
              className="mt-1 text-xl font-bold text-slate-950"
            >
              {account.fullName}
            </h2>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {
                    USER_ROLE_LABELS[
                      account.role
                    ]
                  }
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Mã: {account.id}
                </p>
              </div>

              <AccountStatusBadge
                status={account.status}
              />
            </div>
          </div>

          <dl className="mt-6 space-y-3">
            <div className="flex gap-3 rounded-xl border border-slate-100 p-4">
              <Mail
                size={19}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <dt className="text-xs font-medium text-slate-400">
                  Email
                </dt>

                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {account.email}
                </dd>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-slate-100 p-4">
              <Phone
                size={19}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <dt className="text-xs font-medium text-slate-400">
                  Số điện thoại
                </dt>

                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {account.phone}
                </dd>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-slate-100 p-4">
              <Building2
                size={19}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <dt className="text-xs font-medium text-slate-400">
                  Chi nhánh
                </dt>

                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {account.branchName}
                </dd>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-slate-100 p-4">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <dt className="text-xs font-medium text-slate-400">
                  Vai trò
                </dt>

                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {
                    USER_ROLE_LABELS[
                      account.role
                    ]
                  }
                </dd>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-slate-100 p-4">
              <CalendarDays
                size={19}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <dt className="text-xs font-medium text-slate-400">
                  Đăng nhập gần nhất
                </dt>

                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDate(
                    account.lastLoginAt,
                  )}
                </dd>
              </div>
            </div>

            <div className="flex gap-3 rounded-xl border border-slate-100 p-4">
              <CalendarDays
                size={19}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <dt className="text-xs font-medium text-slate-400">
                  Ngày tạo
                </dt>

                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDate(
                    account.createdAt,
                  )}
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <footer className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Đóng
          </button>
        </footer>
      </aside>
    </div>
  );
};
