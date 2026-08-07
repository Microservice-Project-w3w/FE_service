import {
  RotateCcw,
  Search,
} from "lucide-react";

import type {
  ManagerBranchAccess,
  ManagerScopeId,
} from "@/modules/manager-context";

import type {
  ManagerEquipmentCondition,
  ManagerEquipmentStatus,
} from "@/modules/equipment/types/manager-equipment.types";

export type ManagerEquipmentStatusFilter =
  | "ALL"
  | ManagerEquipmentStatus;

export type ManagerEquipmentConditionFilter =
  | "ALL"
  | ManagerEquipmentCondition;

export type ManagerEquipmentMaintenanceFilter =
  | "ALL"
  | "DUE_SOON";

interface ManagerEquipmentFiltersProps {
  branches:
    ManagerBranchAccess[];

  selectedScopeId:
    ManagerScopeId;

  searchTerm: string;

  statusFilter:
    ManagerEquipmentStatusFilter;

  conditionFilter:
    ManagerEquipmentConditionFilter;

  maintenanceFilter:
    ManagerEquipmentMaintenanceFilter;

  disabled?: boolean;

  onScopeChange: (
    value: ManagerScopeId,
  ) => void;

  onSearchChange: (
    value: string,
  ) => void;

  onStatusChange: (
    value:
      ManagerEquipmentStatusFilter,
  ) => void;

  onConditionChange: (
    value:
      ManagerEquipmentConditionFilter,
  ) => void;

  onMaintenanceChange: (
    value:
      ManagerEquipmentMaintenanceFilter,
  ) => void;

  onReset: () => void;
}

const selectClassName =
  "h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400";

export const ManagerEquipmentFilters = ({
  branches,
  selectedScopeId,
  searchTerm,
  statusFilter,
  conditionFilter,
  maintenanceFilter,
  disabled = false,
  onScopeChange,
  onSearchChange,
  onStatusChange,
  onConditionChange,
  onMaintenanceChange,
  onReset,
}: ManagerEquipmentFiltersProps) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="grid gap-4 xl:grid-cols-[minmax(260px,1.5fr)_repeat(4,minmax(160px,0.8fr))_auto]">
      <label className="relative block">
        <span className="sr-only">
          Tìm kiếm thiết bị
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
          placeholder="Tìm mã, tên thiết bị, danh mục..."
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
              .value as ManagerEquipmentStatusFilter,
          )
        }
        className={
          selectClassName
        }
      >
        <option value="ALL">
          Tất cả trạng thái
        </option>

        <option value="AVAILABLE">
          Khả dụng
        </option>

        <option value="RENTED">
          Đang cho thuê
        </option>

        <option value="RESERVED">
          Đã giữ chỗ
        </option>

        <option value="MAINTENANCE">
          Đang bảo trì
        </option>

        <option value="DAMAGED">
          Hư hỏng
        </option>
      </select>

      <select
        value={
          conditionFilter
        }
        disabled={disabled}
        onChange={(event) =>
          onConditionChange(
            event.target
              .value as ManagerEquipmentConditionFilter,
          )
        }
        className={
          selectClassName
        }
      >
        <option value="ALL">
          Tất cả tình trạng
        </option>

        <option value="GOOD">
          Tốt
        </option>

        <option value="NEEDS_INSPECTION">
          Cần kiểm tra
        </option>

        <option value="DAMAGED">
          Hư hỏng
        </option>
      </select>

      <select
        value={
          maintenanceFilter
        }
        disabled={disabled}
        onChange={(event) =>
          onMaintenanceChange(
            event.target
              .value as ManagerEquipmentMaintenanceFilter,
          )
        }
        className={
          selectClassName
        }
      >
        <option value="ALL">
          Tất cả bảo trì
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
        <RotateCcw size={17} />
        Đặt lại
      </button>
    </div>
  </section>
);
