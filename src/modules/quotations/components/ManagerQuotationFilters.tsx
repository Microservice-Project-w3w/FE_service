import {
  RotateCcw,
  Search,
} from "lucide-react";

import type {
  ManagerBranchAccess,
  ManagerScopeId,
} from "@/modules/manager-context";

import type {
  QuotationApprovalStatus,
  QuotationPriority,
} from "@/modules/quotations/types/manager-quotation-approval.types";

export type QuotationStatusFilter =
  | "ALL"
  | QuotationApprovalStatus;

export type QuotationPriorityFilter =
  | "ALL"
  | QuotationPriority;

interface ManagerQuotationFiltersProps {
  branches: ManagerBranchAccess[];
  selectedScopeId: ManagerScopeId;
  searchTerm: string;
  statusFilter: QuotationStatusFilter;
  priorityFilter:
    QuotationPriorityFilter;
  disabled?: boolean;

  onScopeChange: (
    scopeId: ManagerScopeId,
  ) => void;

  onSearchChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value: QuotationStatusFilter,
  ) => void;

  onPriorityChange: (
    value: QuotationPriorityFilter,
  ) => void;

  onReset: () => void;
}

export const ManagerQuotationFilters = ({
  branches,
  selectedScopeId,
  searchTerm,
  statusFilter,
  priorityFilter,
  disabled = false,
  onScopeChange,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onReset,
}: ManagerQuotationFiltersProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-[minmax(260px,1fr)_240px_190px_180px_auto]">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Tìm kiếm
          </span>

          <div className="relative mt-2">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
              placeholder="Mã báo giá, khách hàng, sự kiện..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Chi nhánh
          </span>

          <select
            value={selectedScopeId}
            disabled={disabled}
            onChange={(event) =>
              onScopeChange(
                event.target.value,
              )
            }
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
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
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Trạng thái
          </span>

          <select
            value={statusFilter}
            disabled={disabled}
            onChange={(event) =>
              onStatusChange(
                event.target
                  .value as QuotationStatusFilter,
              )
            }
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          >
            <option value="ALL">
              Tất cả trạng thái
            </option>
            <option value="PENDING_APPROVAL">
              Chờ duyệt
            </option>
            <option value="APPROVED">
              Đã duyệt
            </option>
            <option value="REJECTED">
              Đã từ chối
            </option>
            <option value="EXPIRED">
              Hết hiệu lực
            </option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">
            Độ ưu tiên
          </span>

          <select
            value={priorityFilter}
            disabled={disabled}
            onChange={(event) =>
              onPriorityChange(
                event.target
                  .value as QuotationPriorityFilter,
              )
            }
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          >
            <option value="ALL">
              Tất cả mức độ
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
        </label>

        <div className="flex items-end">
          <button
            type="button"
            disabled={disabled}
            onClick={onReset}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 xl:w-auto"
          >
            <RotateCcw size={17} />
            Đặt lại
          </button>
        </div>
      </div>
    </section>
  );
};
