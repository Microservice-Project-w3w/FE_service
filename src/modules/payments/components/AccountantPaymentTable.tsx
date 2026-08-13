import { Ban, Eye, Pencil } from "lucide-react";
import { AccountantPaymentBadge } from "@/modules/payments/components/AccountantPaymentBadge";
import { accountantPaymentMethodLabels, formatPaymentCurrency, formatPaymentDate } from "@/modules/payments/components/accountantPaymentFormatters";
import type { AccountantPayment } from "@/modules/payments/types/accountant-payment.types";

interface Props {
  payments: AccountantPayment[]; isLoading: boolean;
  onView: (payment: AccountantPayment) => void; onEdit: (payment: AccountantPayment) => void; onVoid: (payment: AccountantPayment) => void;
}

export const AccountantPaymentTable = ({ payments, isLoading, onView, onEdit, onVoid }: Props) => {
  if (isLoading) return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="space-y-3">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}</div></section>;
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1580px] border-collapse">
          <thead><tr className="border-b border-slate-200 bg-slate-50/80">
            {["Mã thanh toán", "Hóa đơn", "Khách hàng", "Ngày thanh toán", "Phương thức", "Số tiền", "Mã tham chiếu", "Người ghi nhận", "Trạng thái", "Thao tác"].map((heading) => <th key={heading} className={`px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 ${heading === "Số tiền" ? "text-right" : "text-left"}`}>{heading}</th>)}
          </tr></thead>
          <tbody>
            {payments.length === 0 ? <tr><td colSpan={10} className="px-6 py-16 text-center"><p className="font-semibold text-slate-700">Không tìm thấy thanh toán</p><p className="mt-2 text-sm text-slate-400">Hãy thay đổi bộ lọc hoặc ghi nhận khoản thu mới.</p></td></tr> : payments.map((payment) => (
              <tr key={payment.id} className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/30">
                <td className="whitespace-nowrap px-4 py-4 align-top"><button type="button" onClick={() => onView(payment)} className="font-semibold text-blue-700 hover:text-blue-800">{payment.id}</button><p className="mt-1 text-xs text-slate-400">{payment.source === "MANUAL" ? "Ghi nhận thủ công" : "Cổng thanh toán"}</p></td>
                <td className="whitespace-nowrap px-4 py-4 align-top font-semibold text-slate-700">{payment.invoiceCode}</td>
                <td className="px-4 py-4 align-top"><p className="max-w-60 truncate font-semibold text-slate-700">{payment.customerName}</p><p className="mt-1 text-xs text-slate-400">{payment.branchName}</p></td>
                <td className="whitespace-nowrap px-4 py-4 align-top text-sm text-slate-600">{formatPaymentDate(payment.paidAt)}</td>
                <td className="whitespace-nowrap px-4 py-4 align-top text-sm font-semibold text-slate-700">{accountantPaymentMethodLabels[payment.method]}</td>
                <td className="whitespace-nowrap px-4 py-4 text-right align-top font-bold text-slate-900">{formatPaymentCurrency(payment.amount)}</td>
                <td className="whitespace-nowrap px-4 py-4 align-top text-sm text-slate-600">{payment.referenceCode ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-4 align-top text-sm text-slate-600">{payment.recordedBy}</td>
                <td className="px-4 py-4 align-top"><AccountantPaymentBadge status={payment.status} /></td>
                <td className="px-4 py-4 align-top"><div className="flex gap-1">
                  <button type="button" title="Xem chi tiết" onClick={() => onView(payment)} className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-700"><Eye size={17} /></button>
                  <button type="button" title="Sửa tham chiếu và ghi chú" disabled={payment.status === "VOIDED"} onClick={() => onEdit(payment)} className="inline-flex size-9 items-center justify-center rounded-lg text-blue-600 hover:bg-blue-50 disabled:opacity-30"><Pencil size={17} /></button>
                  <button type="button" title="Hủy ghi nhận" disabled={payment.status !== "SUCCESS" || payment.source !== "MANUAL"} onClick={() => onVoid(payment)} className="inline-flex size-9 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 disabled:opacity-30"><Ban size={17} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
