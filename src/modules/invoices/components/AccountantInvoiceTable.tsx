import { Ban, CircleDollarSign, Eye, Send } from "lucide-react";

import { AccountantInvoiceBadge } from "@/modules/invoices/components/AccountantInvoiceBadge";
import {
  displayInvoiceValue,
  formatInvoiceCurrency,
  formatInvoiceDate,
} from "@/modules/invoices/components/accountantInvoiceFormatters";
import type {
  AccountantInvoice,
} from "@/modules/invoices/types/accountant-invoice.types";

interface AccountantInvoiceTableProps {
  invoices: AccountantInvoice[];
  isLoading: boolean;
  onView: (invoice: AccountantInvoice) => void;
  onRecordPayment: (invoice: AccountantInvoice) => void;
  onIssue: (invoice: AccountantInvoice) => void;
  onCancel: (invoice: AccountantInvoice) => void;
}

const canRecordPayment = (invoice: AccountantInvoice) =>
  !["DRAFT", "PAID", "CANCELLED"].includes(invoice.status) && invoice.remainingAmount > 0;

const canCancel = (invoice: AccountantInvoice) =>
  !["PAID", "CANCELLED"].includes(invoice.status);

export const AccountantInvoiceTable = ({
  invoices,
  isLoading,
  onView,
  onRecordPayment,
  onIssue,
  onCancel,
}: AccountantInvoiceTableProps) => {
  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-3 p-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1660px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {["Mã hóa đơn", "Khách hàng", "Đơn thuê", "Ngày phát hành", "Hạn thanh toán", "Tổng tiền", "Đã thanh toán", "Còn lại", "Trạng thái", "Thao tác"].map((heading) => (
                <th
                  key={heading}
                  className={`px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                    ["Tổng tiền", "Đã thanh toán", "Còn lại"].includes(heading) ? "text-right" : "text-left"
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-16 text-center">
                  <p className="font-semibold text-slate-700">Không tìm thấy hóa đơn</p>
                  <p className="mt-2 text-sm text-slate-400">Hãy thay đổi từ khóa hoặc bộ lọc hiện tại.</p>
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/30">
                  <td className="whitespace-nowrap px-4 py-4 align-top">
                    <button type="button" onClick={() => onView(invoice)} className="font-semibold text-blue-700 hover:text-blue-800">
                      {displayInvoiceValue(invoice.invoiceCode)}
                    </button>
                    <p className="mt-1 text-xs text-slate-400">{displayInvoiceValue(invoice.branchName)}</p>
                  </td>
                  <td className="px-4 py-4 align-top">
                    <p className="max-w-60 truncate font-semibold text-slate-700">{displayInvoiceValue(invoice.customerName)}</p>
                    <p className="mt-1 text-xs text-slate-400">{displayInvoiceValue(invoice.customerPhone)}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 align-top font-semibold text-slate-700">{displayInvoiceValue(invoice.rentalCode)}</td>
                  <td className="whitespace-nowrap px-4 py-4 align-top text-sm text-slate-600">{formatInvoiceDate(invoice.issuedAt)}</td>
                  <td className={`whitespace-nowrap px-4 py-4 align-top text-sm font-semibold ${invoice.status === "OVERDUE" ? "text-rose-600" : "text-slate-700"}`}>
                    {formatInvoiceDate(invoice.dueDate)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-right align-top font-semibold text-slate-700">{formatInvoiceCurrency(invoice.totalAmount)}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-right align-top font-semibold text-slate-700">{formatInvoiceCurrency(invoice.paidAmount)}</td>
                  <td className={`whitespace-nowrap px-4 py-4 text-right align-top font-bold ${invoice.status === "OVERDUE" ? "text-rose-600" : "text-slate-900"}`}>
                    {formatInvoiceCurrency(invoice.remainingAmount)}
                  </td>
                  <td className="px-4 py-4 align-top"><AccountantInvoiceBadge status={invoice.status} /></td>
                  <td className="px-4 py-4 align-top">
                    <div className="flex items-center gap-1">
                      <button type="button" title="Xem chi tiết" onClick={() => onView(invoice)} className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"><Eye size={17} /></button>
                      {invoice.status === "DRAFT" && (
                        <button type="button" title="Phát hành" onClick={() => onIssue(invoice)} className="inline-flex size-9 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50"><Send size={17} /></button>
                      )}
                      <button type="button" title="Ghi nhận thanh toán" disabled={!canRecordPayment(invoice)} onClick={() => onRecordPayment(invoice)} className="inline-flex size-9 items-center justify-center rounded-lg text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-30"><CircleDollarSign size={17} /></button>
                      <button type="button" title="Hủy hóa đơn" disabled={!canCancel(invoice)} onClick={() => onCancel(invoice)} className="inline-flex size-9 items-center justify-center rounded-lg text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-30"><Ban size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
