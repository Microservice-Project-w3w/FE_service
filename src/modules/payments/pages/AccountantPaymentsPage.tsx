import { AlertTriangle, Banknote, CircleCheckBig, CircleDollarSign, Clock3, Plus, RefreshCw, TriangleAlert } from "lucide-react";
import { AccountantPaymentDetailDrawer } from "@/modules/payments/components/AccountantPaymentDetailDrawer";
import { AccountantPaymentEditDialog } from "@/modules/payments/components/AccountantPaymentEditDialog";
import { AccountantPaymentFilters } from "@/modules/payments/components/AccountantPaymentFilters";
import { AccountantPaymentPagination } from "@/modules/payments/components/AccountantPaymentPagination";
import { AccountantPaymentSummaryCard } from "@/modules/payments/components/AccountantPaymentSummaryCard";
import { AccountantPaymentTable } from "@/modules/payments/components/AccountantPaymentTable";
import { AccountantPaymentVoidDialog } from "@/modules/payments/components/AccountantPaymentVoidDialog";
import { AccountantRecordPaymentDialog } from "@/modules/payments/components/AccountantRecordPaymentDialog";
import { formatPaymentCurrency } from "@/modules/payments/components/accountantPaymentFormatters";
import { useAccountantPayments } from "@/modules/payments/hooks/useAccountantPayments";

export const AccountantPaymentsPage = () => {
  const vm = useAccountantPayments(); const summary = vm.data.summary;
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div><p className="text-sm font-semibold text-blue-600">Quản lý tài chính</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Thanh toán</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">Ghi nhận khoản thu, kiểm tra mã tham chiếu và theo dõi trạng thái giao dịch theo hóa đơn.</p></div>
        <div className="flex flex-wrap gap-3"><button type="button" disabled={vm.isLoading} onClick={() => void vm.loadPayments()} className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm hover:bg-blue-50 disabled:opacity-50"><RefreshCw size={17} className={vm.isLoading ? "animate-spin" : ""} /> Làm mới</button><button type="button" disabled={vm.isLoading || vm.data.payableInvoices.length === 0} onClick={() => vm.setRecordDialogOpen(true)} className="inline-flex h-12 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-300"><Plus size={18} /> Ghi nhận khoản thu</button></div>
      </section>
      {vm.errorMessage && <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"><AlertTriangle size={18} /> {vm.errorMessage}</div>}
      {vm.successMessage && <button type="button" onClick={() => vm.setSuccessMessage(null)} className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm font-medium text-emerald-700">{vm.successMessage}<span className="float-right text-xs">Đóng</span></button>}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        <AccountantPaymentSummaryCard title="Tổng tiền đã thu" value={formatPaymentCurrency(summary.collectedAmount)} description="Tổng giao dịch thành công" icon={CircleDollarSign} />
        <AccountantPaymentSummaryCard title="Thu hôm nay" value={formatPaymentCurrency(summary.collectedToday)} description="Giao dịch trong ngày" icon={Banknote} />
        <AccountantPaymentSummaryCard title="Thành công" value={String(summary.successCount)} description="Đã cập nhật vào hóa đơn" icon={CircleCheckBig} />
        <AccountantPaymentSummaryCard title="Đang xử lý" value={String(summary.pendingCount)} description="Chờ ngân hàng xác nhận" icon={Clock3} />
        <AccountantPaymentSummaryCard title="Thất bại / đã hủy" value={String(summary.failedOrVoidedCount)} description="Cần kiểm tra nếu phát sinh" icon={TriangleAlert} tone="danger" />
      </section>
      <AccountantPaymentFilters branches={vm.branches} searchTerm={vm.searchTerm} branchId={vm.branchId} method={vm.method} status={vm.status} fromDate={vm.fromDate} toDate={vm.toDate} disabled={vm.isLoading} onSearchChange={vm.setSearchTerm} onBranchChange={vm.setBranchId} onMethodChange={vm.setMethod} onStatusChange={vm.setStatus} onFromDateChange={vm.setFromDate} onToDateChange={vm.setToDate} onReset={vm.resetFilters} />
      <div className="flex min-h-6 items-center justify-between gap-4"><p className="text-sm font-medium text-slate-500">Tìm thấy <span className="font-bold text-slate-800">{vm.filteredPayments.length}</span> giao dịch</p><CircleDollarSign size={18} className="text-slate-300" /></div>
      <AccountantPaymentTable payments={vm.paginatedPayments} isLoading={vm.isLoading} onView={(payment) => void vm.viewPayment(payment)} onEdit={(payment) => { vm.setSelectedPayment(null); vm.setEditPayment(payment); }} onVoid={vm.setVoidPayment} />
      {!vm.isLoading && vm.filteredPayments.length > 0 && <AccountantPaymentPagination currentPage={vm.currentPage} totalPages={vm.totalPages} pageItems={vm.paginatedPayments.length} totalItems={vm.filteredPayments.length} onPageChange={vm.setCurrentPage} />}
      <AccountantPaymentDetailDrawer payment={vm.selectedPayment} isLoading={vm.isDetailLoading} onClose={() => vm.setSelectedPayment(null)} onEdit={(payment) => { vm.setSelectedPayment(null); vm.setEditPayment(payment); }} />
      <AccountantRecordPaymentDialog open={vm.recordDialogOpen} invoices={vm.data.payableInvoices} recordedBy={vm.user?.fullName ?? "Kế toán"} isSubmitting={vm.isSubmitting} onClose={() => vm.setRecordDialogOpen(false)} onSubmit={vm.record} />
      <AccountantPaymentEditDialog payment={vm.editPayment} isSubmitting={vm.isSubmitting} onClose={() => vm.setEditPayment(null)} onSubmit={vm.update} />
      <AccountantPaymentVoidDialog payment={vm.voidPayment} isSubmitting={vm.isSubmitting} onClose={() => vm.setVoidPayment(null)} onConfirm={() => void vm.confirmVoid()} />
    </div>
  );
};
