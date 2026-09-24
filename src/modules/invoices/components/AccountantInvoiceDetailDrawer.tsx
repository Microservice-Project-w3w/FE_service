import { CircleDollarSign, FileText, X } from "lucide-react";
import { useEffect } from "react";

import { AccountantInvoiceBadge } from "@/modules/invoices/components/AccountantInvoiceBadge";
import {
  displayInvoiceValue,
  formatInvoiceCurrency,
  formatInvoiceDate,
  paymentMethodLabels,
} from "@/modules/invoices/components/accountantInvoiceFormatters";
import type {
  AccountantInvoice,
} from "@/modules/invoices/types/accountant-invoice.types";

interface AccountantInvoiceDetailDrawerProps {
  invoice: AccountantInvoice | null;
  isLoading: boolean;
  onClose: () => void;
  onRecordPayment: (invoice: AccountantInvoice) => void;
}

const canRecord = (invoice: AccountantInvoice) =>
  !["DRAFT", "PAID", "CANCELLED"].includes(invoice.status) && invoice.remainingAmount > 0;

export const AccountantInvoiceDetailDrawer = ({
  invoice,
  isLoading,
  onClose,
  onRecordPayment,
}: AccountantInvoiceDetailDrawerProps) => {
  useEffect(() => {
    if (!invoice) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [invoice, onClose]);

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-[2px]">
      <button type="button" aria-label="Đóng chi tiết" onClick={onClose} className="h-full flex-1 cursor-default" />
      <aside className="flex h-full w-full max-w-2xl flex-col bg-slate-50 shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><FileText size={22} /></span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Chi tiết hóa đơn</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{displayInvoiceValue(invoice.invoiceCode)}</h2>
            </div>
          </div>
          <button type="button" aria-label="Đóng" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={20} /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-4">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-2xl bg-slate-200" />)}</div>
          ) : (
            <div className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900">Thông tin hóa đơn</h3>
                  <AccountantInvoiceBadge status={invoice.status} />
                </div>
                <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                  <div><dt className="text-slate-400">Chi nhánh</dt><dd className="mt-1 font-semibold text-slate-700">{displayInvoiceValue(invoice.branchName)}</dd></div>
                  <div><dt className="text-slate-400">Đơn thuê</dt><dd className="mt-1 font-semibold text-blue-700">{displayInvoiceValue(invoice.rentalCode)}</dd></div>
                  <div><dt className="text-slate-400">Ngày phát hành</dt><dd className="mt-1 font-semibold text-slate-700">{formatInvoiceDate(invoice.issuedAt)}</dd></div>
                  <div><dt className="text-slate-400">Hạn thanh toán</dt><dd className={`mt-1 font-semibold ${invoice.status === "OVERDUE" ? "text-rose-600" : "text-slate-700"}`}>{formatInvoiceDate(invoice.dueDate)}</dd></div>
                </dl>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-slate-900">Khách hàng</h3>
                <p className="mt-4 font-semibold text-slate-800">{displayInvoiceValue(invoice.customerName)}</p>
                <p className="mt-1 text-sm text-slate-500">{displayInvoiceValue(invoice.customerPhone)} · {displayInvoiceValue(invoice.customerEmail)}</p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-slate-900">Chi tiết tiền</h3>
                <div className="mt-4 space-y-3 text-sm">
                  {invoice.lines.map((line) => (
                    <div key={line.id} className="flex justify-between gap-4"><span className="text-slate-500">{line.description}</span><strong className="whitespace-nowrap text-slate-700">{formatInvoiceCurrency(line.amount)}</strong></div>
                  ))}
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Tiền đặt cọc</span><strong className="text-slate-700">{invoice.supplementalAmountsAvailable === false ? "—" : formatInvoiceCurrency(invoice.depositAmount)}</strong></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-500">VAT</span><strong className="text-slate-700">{invoice.supplementalAmountsAvailable === false ? "—" : formatInvoiceCurrency(invoice.taxAmount)}</strong></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Giảm giá</span><strong className="text-slate-700">{invoice.supplementalAmountsAvailable === false ? "—" : `-${formatInvoiceCurrency(invoice.discountAmount)}`}</strong></div>
                  <div className="border-t border-slate-100 pt-3"><div className="flex justify-between gap-4"><span className="font-semibold text-slate-700">Tổng hóa đơn</span><strong className="text-slate-900">{formatInvoiceCurrency(invoice.totalAmount)}</strong></div></div>
                  <div className="flex justify-between gap-4"><span className="text-slate-500">Đã thanh toán</span><strong className="text-emerald-700">{formatInvoiceCurrency(invoice.paidAmount)}</strong></div>
                  <div className="flex justify-between gap-4"><span className="font-semibold text-slate-700">Còn phải thu</span><strong className={invoice.status === "OVERDUE" ? "text-rose-600" : "text-blue-700"}>{formatInvoiceCurrency(invoice.remainingAmount)}</strong></div>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <h3 className="border-b border-slate-100 px-5 py-4 font-bold text-slate-900">Lịch sử thanh toán</h3>
                {invoice.paymentsAvailable === false ? (
                  <p className="px-5 py-8 text-center text-sm text-slate-400">—</p>
                ) : invoice.payments.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-slate-400">Chưa có giao dịch thanh toán.</p>
                ) : invoice.payments.map((payment) => (
                  <div key={payment.id} className="border-b border-slate-100 px-5 py-4 last:border-b-0">
                    <div className="flex flex-wrap justify-between gap-2"><strong className={payment.status === "VOIDED" ? "text-slate-400 line-through" : "text-slate-800"}>{formatInvoiceCurrency(payment.amount)}</strong><span className="text-xs text-slate-400">{formatInvoiceDate(payment.paidAt)}</span></div>
                    <p className="mt-2 text-sm text-slate-500">{paymentMethodLabels[payment.method]} · {payment.referenceCode ?? "Không có mã tham chiếu"}</p>
                    <p className="mt-1 text-xs text-slate-400">{payment.note ?? "Không có ghi chú"} · {payment.recordedBy}</p>
                  </div>
                ))}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-slate-900">Ghi chú</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">{invoice.note ?? "Chưa có ghi chú."}</p>
              </section>
            </div>
          )}
        </div>

        <footer className="border-t border-slate-200 bg-white p-4">
          <button type="button" disabled={!canRecord(invoice)} onClick={() => onRecordPayment(invoice)} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
            <CircleDollarSign size={18} /> Ghi nhận thanh toán
          </button>
        </footer>
      </aside>
    </div>
  );
};
