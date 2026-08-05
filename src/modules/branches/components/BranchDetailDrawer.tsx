import {
  Building2,
  ClipboardList,
  Pencil,
  UserRoundCog,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  BranchStatusBadge,
} from "@/modules/branches/components/BranchStatusBadge";

import type {
  Branch,
} from "@/modules/branches/types/branch.types";

interface BranchDetailDrawerProps {
  branch: Branch | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (branch: Branch) => void;
  onAssignManager: (
    branch: Branch,
  ) => void;
}

const dateFormatter =
  new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

const formatDate = (
  value: string,
): string => {
  return dateFormatter.format(
    new Date(value),
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({
  label,
  value,
}: DetailItemProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-800">
        {value}
      </p>
    </div>
  );
};

export const BranchDetailDrawer = ({
  branch,
  isOpen,
  onClose,
  onEdit,
  onAssignManager,
}: BranchDetailDrawerProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    onClose,
  ]);

  if (!isOpen || !branch) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Đóng chi tiết"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Building2 size={23} />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {branch.branchCode}
                </p>

                <h2 className="mt-1 truncate text-xl font-bold text-slate-900">
                  {branch.name}
                </h2>
              </div>
            </div>

            <button
              type="button"
              aria-label="Đóng"
              onClick={onClose}
              className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-4">
            <BranchStatusBadge
              status={branch.status}
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <section>
            <h3 className="text-sm font-bold text-slate-900">
              Thông tin liên hệ
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Số điện thoại"
                value={branch.phone}
              />

              <DetailItem
                label="Email"
                value={branch.email}
              />

              <div className="sm:col-span-2">
                <DetailItem
                  label="Địa chỉ"
                  value={`${branch.address}, ${branch.province}`}
                />
              </div>
            </div>
          </section>

          <section className="mt-7">
            <h3 className="text-sm font-bold text-slate-900">
              Quản lý và vận hành
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Quản lý chi nhánh"
                value={
                  branch.managerName ??
                  "Chưa gán quản lý"
                }
              />

              <DetailItem
                label="Email quản lý"
                value={
                  branch.managerEmail ??
                  "Chưa có thông tin"
                }
              />

              <DetailItem
                label="Số nhân viên"
                value={`${branch.employeeCount} nhân viên`}
              />

              <DetailItem
                label="Đơn thuê đang xử lý"
                value={`${branch.activeRentalCount} đơn thuê`}
              />
            </div>
          </section>

          <section className="mt-7">
            <h3 className="text-sm font-bold text-slate-900">
              Thông tin hoạt động
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Ngày khai trương"
                value={formatDate(
                  branch.openedAt,
                )}
              />

              <DetailItem
                label="Cập nhật gần nhất"
                value={formatDate(
                  branch.updatedAt,
                )}
              />

              <div className="sm:col-span-2">
                <DetailItem
                  label="Mô tả"
                  value={
                    branch.description ||
                    "Chưa có mô tả."
                  }
                />
              </div>
            </div>
          </section>

          <section className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              <ClipboardList
                size={20}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>
                <p className="font-semibold text-blue-900">
                  Dữ liệu nghiệp vụ
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  Chi nhánh đang có{" "}
                  {branch.employeeCount} nhân viên
                  và {branch.activeRentalCount} đơn
                  thuê đang xử lý.
                </p>
              </div>
            </div>
          </section>
        </div>

        <footer className="border-t border-slate-200 bg-white px-6 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                onAssignManager(branch)
              }
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              <UserRoundCog size={18} />
              Gán quản lý
            </button>

            <button
              type="button"
              onClick={() =>
                onEdit(branch)
              }
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Pencil size={18} />
              Chỉnh sửa
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
};
