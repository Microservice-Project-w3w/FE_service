import {
  RotateCcw,
  Search,
} from "lucide-react";

import type {
  ManagerBranchAccess,
  ManagerScopeId,
} from "@/modules/manager-context";

import type {
  ManagerRentalPriority,
  ManagerRentalStatus,
  RentalPaymentStatus,
} from "@/modules/rentals/types/manager-rental.types";

export type ManagerRentalStatusFilter =
  | "ALL"
  | ManagerRentalStatus;

export type ManagerRentalPriorityFilter =
  | "ALL"
  | ManagerRentalPriority;

export type RentalPaymentStatusFilter =
  | "ALL"
  | RentalPaymentStatus;

interface ManagerRentalFiltersProps {
  branches: ManagerBranchAccess[];
  selectedScopeId: ManagerScopeId;
  searchTerm: string;
  statusFilter:
    ManagerRentalStatusFilter;
  priorityFilter:
    ManagerRentalPriorityFilter;
  paymentFilter:
    RentalPaymentStatusFilter;
  disabled?: boolean;

  onScopeChange: (
    value: ManagerScopeId,
  ) => void;

  onSearchChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value: ManagerRentalStatusFilter,
  ) => void;

  onPriorityChange: (
    value: ManagerRentalPriorityFilter,
  ) => void;

  onPaymentChange: (
    value: RentalPaymentStatusFilter,
  ) => void;

  onReset: () => void;
}

const selectClassName =
  "h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400";

export const ManagerRentalFilters = ({
  branches,
  selectedScopeId,
  searchTerm,
  statusFilter,
  priorityFilter,
  paymentFilter,
  disabled = false,
  onScopeChange,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onPaymentChange,
  onReset,
}: ManagerRentalFiltersProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-[minmax(240px,1.4fr)_repeat(4,minmax(150px,0.8fr))_auto]">
        <label className="relative block">
          <span className="sr-only">
            Tìm kiếm đơn thuê
          </span>

          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={searchTerm}
            disabled={disabled}
            onChange={(event) =>
              onSearchChange(
                event.target.value,
              )
            }
            placeholder="Tìm mã đơn, khách hàng, sự kiện..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />
        </label>

        <select
          value={selectedScopeId}
          disabled={disabled}
          onChange={(event) =>
            onScopeChange(
              event.target
                .value as ManagerScopeId,
            )
          }
          className={selectClassName}
        >
          <option value="ALL">
            Tất cả chi nhánh
          </option>

          {branches.map((branch) => (
            <option
              key={branch.id}
              value={branch.id}
            >
              {branch.name}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          disabled={disabled}
          onChange={(event) =>
            onStatusChange(
              event.target
                .value as ManagerRentalStatusFilter,
            )
          }
          className={selectClassName}
        >
          <option value="ALL">
            Tất cả trạng thái
          </option>
          <option value="PENDING_CONFIRMATION">
            Chờ xác nhận
          </option>
          <option value="RESERVED">
            Đã giữ chỗ
          </option>
          <option value="CONFIRMED">
            Đã xác nhận
          </option>
          <option value="ACTIVE">
            Đang thuê
          </option>
          <option value="OVERDUE">
            Quá hạn
          </option>
          <option value="RETURNING">
            Đang hoàn trả
          </option>
          <option value="COMPLETED">
            Hoàn thành
          </option>
          <option value="CANCELLED">
            Đã hủy
          </option>
        </select>

        <select
          value={priorityFilter}
          disabled={disabled}
          onChange={(event) =>
            onPriorityChange(
              event.target
                .value as ManagerRentalPriorityFilter,
            )
          }
          className={selectClassName}
        >
          <option value="ALL">
            Tất cả ưu tiên
          </option>
          <option value="URGENT">
            Khẩn cấp
          </option>
          <option value="HIGH">
            Ưu tiên cao
          </option>
          <option value="NORMAL">
            Bình thường
          </option>
        </select>

        <select
          value={paymentFilter}
          disabled={disabled}
          onChange={(event) =>
            onPaymentChange(
              event.target
                .value as RentalPaymentStatusFilter,
            )
          }
          className={selectClassName}
        >
          <option value="ALL">
            Tất cả thanh toán
          </option>
          <option value="UNPAID">
            Chưa thanh toán
          </option>
          <option value="PARTIALLY_PAID">
            Thanh toán một phần
          </option>
          <option value="PAID">
            Đã thanh toán
          </option>
          <option value="OVERDUE">
            Quá hạn thanh toán
          </option>
        </select>

        <button
          type="button"
          disabled={disabled}
          onClick={onReset}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
        >
          <RotateCcw size={17} />
          Đặt lại
        </button>
      </div>
    </section>
  );
};
