import { RotateCcw, Search } from "lucide-react";

import type {
  AccountantInvoiceStatus,
} from "@/modules/invoices/types/accountant-invoice.types";

export type AccountantInvoiceStatusFilter = "ALL" | AccountantInvoiceStatus;

interface AccountantInvoiceFiltersProps {
  branches: Array<{ id: string; name: string }>;
  searchTerm: string;
  branchId: string;
  status: AccountantInvoiceStatusFilter;
  fromDate: string;
  toDate: string;
  disabled: boolean;
  onSearchChange: (value: string) => void;
  onBranchChange: (value: string) => void;
  onStatusChange: (value: AccountantInvoiceStatusFilter) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onReset: () => void;
}

const controlClass =
  "h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-400";

export const AccountantInvoiceFilters = ({
  branches,
  searchTerm,
  branchId,
  status,
  fromDate,
  toDate,
  disabled,
  onSearchChange,
  onBranchChange,
  onStatusChange,
  onFromDateChange,
  onToDateChange,
  onReset,
}: AccountantInvoiceFiltersProps) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="grid items-end gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[minmax(260px,1.5fr)_repeat(4,minmax(150px,0.8fr))_auto]">
      <label className="relative block md:col-span-2 xl:col-span-1">
        <span className="sr-only">Tìm kiếm hóa đơn</span>
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="search"
          value={searchTerm}
          disabled={disabled}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Mã hóa đơn, khách hàng, đơn thuê..."
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
        />
      </label>

      <select value={branchId} disabled={disabled} onChange={(event) => onBranchChange(event.target.value)} className={controlClass}>
        <option value="ALL">Tất cả chi nhánh</option>
        {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
      </select>

      <select value={status} disabled={disabled} onChange={(event) => onStatusChange(event.target.value as AccountantInvoiceStatusFilter)} className={controlClass}>
        <option value="ALL">Tất cả trạng thái</option>
        <option value="DRAFT">Bản nháp</option>
        <option value="ISSUED">Đã phát hành</option>
        <option value="UNPAID">Chưa thanh toán</option>
        <option value="PARTIALLY_PAID">Thanh toán một phần</option>
        <option value="PAID">Đã thanh toán</option>
        <option value="OVERDUE">Quá hạn</option>
        <option value="CANCELLED">Đã hủy</option>
      </select>

      <label className="grid gap-1 text-xs font-semibold text-slate-500">
        Từ ngày
        <input type="date" value={fromDate} disabled={disabled} onChange={(event) => onFromDateChange(event.target.value)} className={controlClass} />
      </label>
      <label className="grid gap-1 text-xs font-semibold text-slate-500">
        Đến ngày
        <input type="date" value={toDate} disabled={disabled} onChange={(event) => onToDateChange(event.target.value)} className={controlClass} />
      </label>

      <button type="button" disabled={disabled} onClick={onReset} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50">
        <RotateCcw size={17} /> Đặt lại
      </button>
    </div>
  </section>
);
