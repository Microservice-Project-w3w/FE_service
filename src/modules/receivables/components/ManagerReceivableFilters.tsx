import {
  RotateCcw,
  Search,
} from "lucide-react";

import type {
  ManagerBranchAccess,
  ManagerScopeId,
} from "@/modules/manager-context";

import type {
  ManagerReceivablePriority,
  ManagerReceivableStatus,
} from "@/modules/receivables/types/manager-receivable.types";

export type ManagerReceivableStatusFilter =
  | "ALL"
  | ManagerReceivableStatus;

export type ManagerReceivablePriorityFilter =
  | "ALL"
  | ManagerReceivablePriority;

export type ManagerReceivableDueFilter =
  | "ALL"
  | "OVERDUE"
  | "DUE_SOON";

interface ManagerReceivableFiltersProps {
  branches:
    ManagerBranchAccess[];

  selectedScopeId:
    ManagerScopeId;

  searchTerm: string;

  statusFilter:
    ManagerReceivableStatusFilter;

  priorityFilter:
    ManagerReceivablePriorityFilter;

  dueFilter:
    ManagerReceivableDueFilter;

  disabled?: boolean;

  onScopeChange: (
    value: ManagerScopeId,
  ) => void;

  onSearchChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value:
      ManagerReceivableStatusFilter,
  ) => void;

  onPriorityChange: (
    value:
      ManagerReceivablePriorityFilter,
  ) => void;

  onDueChange: (
    value:
      ManagerReceivableDueFilter,
  ) => void;

  onReset: () => void;
}

const selectClassName =
  "h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400";

export const ManagerReceivableFilters = ({
  branches,
  selectedScopeId,
  searchTerm,
  statusFilter,
  priorityFilter,
  dueFilter,
  disabled = false,
  onScopeChange,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onDueChange,
  onReset,
}: ManagerReceivableFiltersProps) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="grid gap-4 xl:grid-cols-[minmax(260px,1.5fr)_repeat(4,minmax(160px,0.8fr))_auto]">
      <label className="relative block">
        <span className="sr-only">
          Tìm kiếm công nợ
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
          placeholder="Tìm mã công nợ, đơn thuê, khách hàng..."
          className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
        />
      </label>

      <select
        value={
          selectedScopeId
        }
        disabled={disabled}
        onChange={(event) =>
          onScopeChange(
            event.target
              .value as ManagerScopeId,
          )
        }
        className={
          selectClassName
        }
      >
        <option value="ALL">
          Tất cả chi nhánh
        </option>

        {branches.map(
          (branch) => (
            <option
              key={
                branch.id
              }
              value={
                branch.id
              }
            >
              {
                branch.name
              }
            </option>
          ),
        )}
      </select>

      <select
        value={
          statusFilter
        }
        disabled={disabled}
        onChange={(event) =>
          onStatusChange(
            event.target
              .value as ManagerReceivableStatusFilter,
          )
        }
        className={
          selectClassName
        }
      >
        <option value="ALL">
          Tất cả trạng thái
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
          Quá hạn
        </option>
      </select>

      <select
        value={
          priorityFilter
        }
        disabled={disabled}
        onChange={(event) =>
          onPriorityChange(
            event.target
              .value as ManagerReceivablePriorityFilter,
          )
        }
        className={
          selectClassName
        }
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
        value={dueFilter}
        disabled={disabled}
        onChange={(event) =>
          onDueChange(
            event.target
              .value as ManagerReceivableDueFilter,
          )
        }
        className={
          selectClassName
        }
      >
        <option value="ALL">
          Tất cả thời hạn
        </option>

        <option value="OVERDUE">
          Đã quá hạn
        </option>

        <option value="DUE_SOON">
          Sắp đến hạn
        </option>
      </select>

      <button
        type="button"
        disabled={disabled}
        onClick={onReset}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"
      >
        <RotateCcw
          size={17}
        />
        Đặt lại
      </button>
    </div>
  </section>
);
