import { RotateCcw, Search } from "lucide-react";
import type { AccountantReceivableDueFilter, AccountantReceivableStatus } from "@/modules/receivables/types/accountant-receivable.types";
export type AccountantReceivableStatusFilter = "ALL" | AccountantReceivableStatus;
interface Props {
  branches: Array<{ id: string; name: string }>; customers: Array<{ id: string; name: string }>;
  search: string; branchId: string; customerId: string; status: AccountantReceivableStatusFilter; due: AccountantReceivableDueFilter; disabled: boolean;
  onSearch: (value: string) => void; onBranch: (value: string) => void; onCustomer: (value: string) => void; onStatus: (value: AccountantReceivableStatusFilter) => void; onDue: (value: AccountantReceivableDueFilter) => void; onReset: () => void;
}
const control = "h-12 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100";
export const AccountantReceivableFilters = (p: Props) => <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="grid items-end gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-[minmax(260px,1.5fr)_repeat(4,minmax(160px,0.8fr))_auto]">
  <label className="relative md:col-span-2 xl:col-span-1"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={p.search} disabled={p.disabled} onChange={(e) => p.onSearch(e.target.value)} placeholder="Mã công nợ, hóa đơn, khách hàng..." className="h-12 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>
  <select value={p.branchId} disabled={p.disabled} onChange={(e) => p.onBranch(e.target.value)} className={control}><option value="ALL">Tất cả chi nhánh</option>{p.branches.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
  <select value={p.customerId} disabled={p.disabled} onChange={(e) => p.onCustomer(e.target.value)} className={control}><option value="ALL">Tất cả khách hàng</option>{p.customers.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
  <select value={p.status} disabled={p.disabled} onChange={(e) => p.onStatus(e.target.value as AccountantReceivableStatusFilter)} className={control}><option value="ALL">Tất cả trạng thái</option><option value="UNPAID">Chưa thanh toán</option><option value="PARTIALLY_PAID">Thanh toán một phần</option><option value="PAID">Đã thanh toán</option><option value="OVERDUE">Quá hạn</option></select>
  <select value={p.due} disabled={p.disabled} onChange={(e) => p.onDue(e.target.value as AccountantReceivableDueFilter)} className={control}><option value="ALL">Tất cả thời hạn</option><option value="CURRENT">Còn hạn</option><option value="DUE_SOON">Sắp đến hạn</option><option value="OVERDUE">Đã quá hạn</option></select>
  <button type="button" disabled={p.disabled} onClick={p.onReset} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-blue-50 disabled:opacity-50"><RotateCcw size={17} /> Đặt lại</button>
</div></section>;
