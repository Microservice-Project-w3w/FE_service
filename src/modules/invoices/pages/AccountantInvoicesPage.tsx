import {
  AlertTriangle,
  Banknote,
  CircleDollarSign,
  Download,
  FileCheck2,
  FileClock,
  Files,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";

import { AccountantInvoiceActionDialog } from "@/modules/invoices/components/AccountantInvoiceActionDialog";
import { AccountantInvoiceDetailDrawer } from "@/modules/invoices/components/AccountantInvoiceDetailDrawer";
import { AccountantInvoiceFilters } from "@/modules/invoices/components/AccountantInvoiceFilters";
import { AccountantInvoicePagination } from "@/modules/invoices/components/AccountantInvoicePagination";
import { AccountantInvoicePaymentDialog } from "@/modules/invoices/components/AccountantInvoicePaymentDialog";
import { AccountantInvoiceSummaryCard } from "@/modules/invoices/components/AccountantInvoiceSummaryCard";
import { AccountantInvoiceTable } from "@/modules/invoices/components/AccountantInvoiceTable";
import { formatInvoiceCurrency } from "@/modules/invoices/components/accountantInvoiceFormatters";
import { useAccountantInvoices } from "@/modules/invoices/hooks/useAccountantInvoices";

export const AccountantInvoicesPage = () => {
  const viewModel = useAccountantInvoices();
  const summary = viewModel.data.summary;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">Quản lý tài chính</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Hóa đơn</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Phát hành hóa đơn, theo dõi hạn thanh toán và ghi nhận các khoản thu theo đúng số dư.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={viewModel.isLoading || viewModel.filteredInvoices.length === 0} onClick={viewModel.exportInvoices} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50">
            <Download size={17} /> Xuất danh sách
          </button>
          <button type="button" disabled={viewModel.isLoading} onClick={() => void viewModel.loadInvoices()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-50">
            <RefreshCw size={17} className={viewModel.isLoading ? "animate-spin" : ""} /> Làm mới
          </button>
        </div>
      </section>

      {viewModel.errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" /> {viewModel.errorMessage}
        </div>
      )}
      {viewModel.successMessage && (
        <button type="button" onClick={() => viewModel.setSuccessMessage(null)} className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left text-sm font-medium text-emerald-700">
          {viewModel.successMessage} <span className="float-right text-xs">Đóng</span>
        </button>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <AccountantInvoiceSummaryCard title="Tổng hóa đơn" value={String(summary.totalInvoices)} description="Tất cả hóa đơn trong hệ thống" icon={Files} />
        <AccountantInvoiceSummaryCard title="Chưa thanh toán" value={String(summary.unpaidCount)} description="Bao gồm hóa đơn nháp" icon={FileClock} />
        <AccountantInvoiceSummaryCard title="Thanh toán một phần" value={String(summary.partiallyPaidCount)} description="Vẫn còn số dư cần thu" icon={Banknote} />
        <AccountantInvoiceSummaryCard title="Đã thanh toán" value={String(summary.paidCount)} description="Đã thu đủ giá trị hóa đơn" icon={FileCheck2} />
        <AccountantInvoiceSummaryCard title="Quá hạn" value={String(summary.overdueCount)} description="Cần ưu tiên xử lý" icon={TriangleAlert} tone="danger" />
        <AccountantInvoiceSummaryCard title="Tổng còn phải thu" value={formatInvoiceCurrency(summary.outstandingAmount)} description="Không gồm hóa đơn đã hủy" icon={CircleDollarSign} />
      </section>

      <AccountantInvoiceFilters
        branches={viewModel.branches}
        searchTerm={viewModel.searchTerm}
        branchId={viewModel.branchId}
        status={viewModel.status}
        fromDate={viewModel.fromDate}
        toDate={viewModel.toDate}
        disabled={viewModel.isLoading}
        onSearchChange={viewModel.setSearchTerm}
        onBranchChange={viewModel.setBranchId}
        onStatusChange={viewModel.setStatus}
        onFromDateChange={viewModel.setFromDate}
        onToDateChange={viewModel.setToDate}
        onReset={viewModel.resetFilters}
      />

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">Tìm thấy <span className="font-bold text-slate-800">{viewModel.filteredInvoices.length}</span> hóa đơn</p>
        <FileCheck2 size={18} className="text-slate-300" />
      </div>

      <AccountantInvoiceTable
        invoices={viewModel.paginatedInvoices}
        isLoading={viewModel.isLoading}
        onView={(invoice) => void viewModel.viewInvoice(invoice)}
        onRecordPayment={(invoice) => { viewModel.setSelectedInvoice(null); viewModel.setPaymentInvoice(invoice); }}
        onIssue={(invoice) => viewModel.setActionTarget({ invoice, action: "ISSUE" })}
        onCancel={(invoice) => viewModel.setActionTarget({ invoice, action: "CANCEL" })}
      />

      {!viewModel.isLoading && viewModel.filteredInvoices.length > 0 && (
        <AccountantInvoicePagination currentPage={viewModel.currentPage} totalPages={viewModel.totalPages} pageItems={viewModel.paginatedInvoices.length} totalItems={viewModel.filteredInvoices.length} onPageChange={viewModel.setCurrentPage} />
      )}

      <AccountantInvoiceDetailDrawer invoice={viewModel.selectedInvoice} isLoading={viewModel.isDetailLoading} onClose={() => viewModel.setSelectedInvoice(null)} onRecordPayment={(invoice) => { viewModel.setSelectedInvoice(null); viewModel.setPaymentInvoice(invoice); }} />
      <AccountantInvoicePaymentDialog invoice={viewModel.paymentInvoice} recordedBy={viewModel.user?.fullName ?? "Kế toán"} isSubmitting={viewModel.isSubmitting} onClose={() => viewModel.setPaymentInvoice(null)} onSubmit={viewModel.recordPayment} />
      <AccountantInvoiceActionDialog open={Boolean(viewModel.actionTarget)} action={viewModel.actionTarget?.action ?? "ISSUE"} invoiceCode={viewModel.actionTarget?.invoice.invoiceCode ?? ""} isSubmitting={viewModel.isSubmitting} onClose={() => viewModel.setActionTarget(null)} onConfirm={() => void viewModel.confirmAction()} />
    </div>
  );
};
