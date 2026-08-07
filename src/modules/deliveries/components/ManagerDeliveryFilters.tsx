import {
  RotateCcw,
  Search,
} from "lucide-react";

import type {
  ManagerBranchAccess,
  ManagerScopeId,
} from "@/modules/manager-context";

import type {
  ManagerDeliveryPriority,
  ManagerDeliveryStatus,
  ManagerDeliveryTaskType,
} from "@/modules/deliveries/types/manager-delivery.types";

export type ManagerDeliveryTypeFilter =
  | "ALL"
  | ManagerDeliveryTaskType;

export type ManagerDeliveryStatusFilter =
  | "ALL"
  | ManagerDeliveryStatus;

export type ManagerDeliveryPriorityFilter =
  | "ALL"
  | ManagerDeliveryPriority;

interface ManagerDeliveryFiltersProps {
  branches: ManagerBranchAccess[];

  selectedScopeId: ManagerScopeId;

  searchTerm: string;

  typeFilter:
    ManagerDeliveryTypeFilter;

  statusFilter:
    ManagerDeliveryStatusFilter;

  priorityFilter:
    ManagerDeliveryPriorityFilter;

  disabled?: boolean;

  onScopeChange: (
    value: ManagerScopeId,
  ) => void;

  onSearchChange: (
    value: string,
  ) => void;

  onTypeChange: (
    value: ManagerDeliveryTypeFilter,
  ) => void;

  onStatusChange: (
    value: ManagerDeliveryStatusFilter,
  ) => void;

  onPriorityChange: (
    value: ManagerDeliveryPriorityFilter,
  ) => void;

  onReset: () => void;
}

const selectClassName =
  "h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400";

export const ManagerDeliveryFilters = ({
  branches,
  selectedScopeId,
  searchTerm,
  typeFilter,
  statusFilter,
  priorityFilter,
  disabled = false,
  onScopeChange,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onPriorityChange,
  onReset,
}: ManagerDeliveryFiltersProps) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="grid gap-4 xl:grid-cols-[minmax(260px,1.5fr)_repeat(4,minmax(160px,0.8fr))_auto]">
      <label className="relative block">
        <span className="sr-only">
          Tìm kiếm nhiệm vụ giao nhận
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
          placeholder="Tìm mã giao nhận, đơn thuê, khách hàng..."
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
        value={typeFilter}
        disabled={disabled}
        onChange={(event) =>
          onTypeChange(
            event.target
              .value as ManagerDeliveryTypeFilter,
          )
        }
        className={selectClassName}
      >
        <option value="ALL">
          Tất cả loại
        </option>

        <option value="DELIVERY">
          Giao thiết bị
        </option>

        <option value="RETURN">
          Nhận trả
        </option>
      </select>

      <select
        value={statusFilter}
        disabled={disabled}
        onChange={(event) =>
          onStatusChange(
            event.target
              .value as ManagerDeliveryStatusFilter,
          )
        }
        className={selectClassName}
      >
        <option value="ALL">
          Tất cả trạng thái
        </option>

        <option value="SCHEDULED">
          Đã lên lịch
        </option>

        <option value="PREPARING">
          Đang chuẩn bị
        </option>

        <option value="READY">
          Sẵn sàng
        </option>

        <option value="IN_TRANSIT">
          Đang di chuyển
        </option>

        <option value="ARRIVED">
          Đã đến nơi
        </option>

        <option value="DELAYED">
          Bị trễ
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
              .value as ManagerDeliveryPriorityFilter,
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
