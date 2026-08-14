import { AlertTriangle, Banknote, CircleDollarSign, Clock3, Landmark, RefreshCw, TriangleAlert } from "lucide-react";
import { useAuthStore } from "@/modules/auth";
import { AccountantRecordPaymentDialog } from "@/modules/payments";
import { AccountantReceivableDetailDrawer } from "@/modules/receivables/components/AccountantReceivableDetailDrawer";
import { AccountantReceivableFilters } from "@/modules/receivables/components/AccountantReceivableFilters";
import { AccountantReceivableNoteDialog } from "@/modules/receivables/components/AccountantReceivableNoteDialog";
import { AccountantReceivablePagination } from "@/modules/receivables/components/AccountantReceivablePagination";
import { AccountantReceivableSummaryCard } from "@/modules/receivables/components/AccountantReceivableSummaryCard";
import { AccountantReceivableTable } from "@/modules/receivables/components/AccountantReceivableTable";
import { formatReceivableCurrency } from "@/modules/receivables/components/accountantReceivableFormatters";
import { useAccountantReceivables } from "@/modules/receivables/hooks/useAccountantReceivables";

export const AccountantReceivablesPage = () => {
  const vm = useAccountantReceivables(); const user = useAuthStore((s) => s.user); const summary = vm.data.summary;
  const openPayment = (item: typeof vm.paymentTarget) => { vm.setSelected(null); vm.setPaymentTarget(item); };
  const openNote = (item: typeof vm.noteTarget) => { vm.setSelected(null); vm.setNoteTarget(item); };
  return <div className="space-y-6">
    <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-sm font-semibold text-blue-600">Quản lý tài chính</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Công nợ khách hàng</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Theo dõi số đã thu, xử lý khoản quá hạn, ghi nhận thanh toán và cập nhật ghi chú nghiệp vụ.</p></div><button type="button" disabled={vm.loading} onClick={() => void vm.load()} className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm hover:bg-blue-50 disabled:opacity-50"><RefreshCw size={17} className={vm.loading ? "animate-spin" : ""} /> Làm mới</button></section>
    {vm.error && <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"><AlertTriangle size={18} /> {vm.error}</div>}{vm.success && <button type="button" onClick={() => vm.setSuccess(null)} className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm font-medium text-emerald-700">{vm.success}<span className="float-right text-xs">Đóng</span></button>}
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5"><AccountantReceivableSummaryCard title="Tổng phải thu" value={formatReceivableCurrency(summary.totalAmount)} description="Tổng giá trị công nợ" icon={Landmark} /><AccountantReceivableSummaryCard title="Đã thu" value={formatReceivableCurrency(summary.paidAmount)} description="Thanh toán thành công" icon={Banknote} /><AccountantReceivableSummaryCard title="Còn phải thu" value={formatReceivableCurrency(summary.outstandingAmount)} description="Số dư hiện tại" icon={CircleDollarSign} /><AccountantReceivableSummaryCard title="Quá hạn" value={formatReceivableCurrency(summary.overdueAmount)} description="Cần ưu tiên xử lý" icon={TriangleAlert} tone="danger" /><AccountantReceivableSummaryCard title="Sắp đến hạn" value={formatReceivableCurrency(summary.dueSoonAmount)} description="Đến hạn trong 7 ngày" icon={Clock3} /></section>
    <AccountantReceivableFilters branches={vm.branches} customers={vm.customers} search={vm.search} branchId={vm.branchId} customerId={vm.customerId} status={vm.status} due={vm.due} disabled={vm.loading} onSearch={vm.setSearch} onBranch={vm.setBranchId} onCustomer={vm.setCustomerId} onStatus={vm.setStatus} onDue={vm.setDue} onReset={vm.reset} />
    <div className="flex min-h-6 items-center justify-between gap-4"><p className="text-sm font-medium text-slate-500">Tìm thấy <strong className="text-slate-800">{vm.filtered.length}</strong> khoản công nợ</p><Landmark size={18} className="text-slate-300" /></div>
    <AccountantReceivableTable receivables={vm.paginated} isLoading={vm.loading} onView={(item) => void vm.view(item)} onPayment={openPayment} onNote={openNote} />
    {!vm.loading && vm.filtered.length > 0 && <AccountantReceivablePagination page={vm.page} totalPages={vm.totalPages} pageItems={vm.paginated.length} totalItems={vm.filtered.length} onChange={vm.setPage} />}
    <AccountantReceivableDetailDrawer receivable={vm.selected} isLoading={vm.detailLoading} onClose={() => vm.setSelected(null)} onPayment={openPayment} onNote={openNote} />
    <AccountantRecordPaymentDialog open={Boolean(vm.paymentTarget)} invoices={vm.payableInvoices} initialInvoiceId={vm.paymentTarget?.invoiceId} recordedBy={user?.fullName ?? "Kế toán"} isSubmitting={vm.submitting} onClose={() => vm.setPaymentTarget(null)} onSubmit={vm.record} />
    <AccountantReceivableNoteDialog receivable={vm.noteTarget} isSubmitting={vm.submitting} onClose={() => vm.setNoteTarget(null)} onSubmit={vm.saveNote} />
  </div>;
};
