import { RotateCcw, Search } from "lucide-react";
import type { AccountantPaymentMethod } from "@/modules/invoices";
import type { AccountantPaymentStatus } from "@/modules/payments/types/accountant-payment.types";

export type AccountantPaymentStatusFilter = "ALL" | AccountantPaymentStatus;
export type AccountantPaymentMethodFilter = "ALL" | AccountantPaymentMethod;

interface Props {
  branches: Array<{ id: string; name: string }>;
  searchTerm: string; branchId: string; method: AccountantPaymentMethodFilter; status: AccountantPaymentStatusFilter;
  fromDate: string; toDate: string; disabled: boolean;
  onSearchChange: (value: string) => void; onBranchChange: (value: string) => void;
  onMethodChange: (value: AccountantPaymentMethodFilter) => void; onStatusChange: (value: AccountantPaymentStatusFilter) => void;
  onFromDateChange: (value: string) => void; onToDateChange: (value: string) => void; onReset: () => void;
}

const controlClass = "h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100";

export const AccountantPaymentFilters = (props: Props) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="grid items-end gap-4 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-[minmax(250px,1.4fr)_repeat(5,minmax(145px,0.75fr))_auto]">
      <label className="relative block md:col-span-2 2xl:col-span-1">
        <span className="sr-only">Tìm kiếm thanh toán</span><Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="search" value={props.searchTerm} disabled={props.disabled} onChange={(event) => props.onSearchChange(event.target.value)} placeholder="Mã thanh toán, hóa đơn, khách hàng..." className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
      </label>
      <select value={props.branchId} disabled={props.disabled} onChange={(event) => props.onBranchChange(event.target.value)} className={controlClass}>
        <option value="ALL">Tất cả chi nhánh</option>{props.branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
      </select>
      <select value={props.method} disabled={props.disabled} onChange={(event) => props.onMethodChange(event.target.value as AccountantPaymentMethodFilter)} className={controlClass}>
        <option value="ALL">Tất cả phương thức</option><option value="BANK_TRANSFER">Chuyển khoản</option><option value="CASH">Tiền mặt</option><option value="CARD">Thẻ</option><option value="OTHER">Khác</option>
      </select>
      <select value={props.status} disabled={props.disabled} onChange={(event) => props.onStatusChange(event.target.value as AccountantPaymentStatusFilter)} className={controlClass}>
        <option value="ALL">Tất cả trạng thái</option><option value="SUCCESS">Thành công</option><option value="PENDING">Đang xử lý</option><option value="FAILED">Thất bại</option><option value="VOIDED">Đã hủy</option>
      </select>
      <label className="grid gap-1 text-xs font-semibold text-slate-500">Từ ngày<input type="date" value={props.fromDate} disabled={props.disabled} onChange={(event) => props.onFromDateChange(event.target.value)} className={controlClass} /></label>
      <label className="grid gap-1 text-xs font-semibold text-slate-500">Đến ngày<input type="date" value={props.toDate} disabled={props.disabled} onChange={(event) => props.onToDateChange(event.target.value)} className={controlClass} /></label>
      <button type="button" disabled={props.disabled} onClick={props.onReset} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50"><RotateCcw size={17} /> Đặt lại</button>
    </div>
  </section>
);
