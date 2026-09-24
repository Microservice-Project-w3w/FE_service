import { ReceiptText, X } from "lucide-react";
import { useEffect } from "react";
import { AccountantPaymentBadge } from "@/modules/payments/components/AccountantPaymentBadge";
import { accountantPaymentMethodLabels, formatPaymentCurrency, formatPaymentDate } from "@/modules/payments/components/accountantPaymentFormatters";
import type { AccountantPayment } from "@/modules/payments/types/accountant-payment.types";

interface Props { payment: AccountantPayment | null; isLoading: boolean; onClose: () => void; onEdit: (payment: AccountantPayment) => void; }

export const AccountantPaymentDetailDrawer = ({ payment, isLoading, onClose, onEdit }: Props) => {
  useEffect(() => {
    if (!payment) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden"; window.addEventListener("keydown", handleKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleKeyDown); };
  }, [onClose, payment]);
  if (!payment) return null;
  const details = [
    ["Hóa đơn", payment.invoiceCode], ["Khách hàng", payment.customerName], ["Chi nhánh", payment.branchName],
    ["Ngày thanh toán", formatPaymentDate(payment.paidAt)], ["Phương thức", accountantPaymentMethodLabels[payment.method]],
    ["Mã tham chiếu", payment.referenceCode ?? "Không có"], ["Người ghi nhận", payment.recordedBy],
    ["Nguồn", payment.source === "MANUAL" ? "Ghi nhận thủ công" : "Cổng thanh toán"],
  ];
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-[2px]">
      <button type="button" aria-label="Đóng chi tiết" onClick={onClose} className="h-full flex-1 cursor-default" />
      <aside className="flex h-full w-full max-w-xl flex-col bg-slate-50 shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><ReceiptText size={22} /></span><div><p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Chi tiết thanh toán</p><h2 className="mt-1 text-lg font-bold text-slate-900">{payment.id}</h2></div></div>
          <button type="button" aria-label="Đóng" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={20} /></button>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? <div className="space-y-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-2xl bg-slate-200" />)}</div> : <div className="space-y-5">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-500">Số tiền giao dịch</p><AccountantPaymentBadge status={payment.status} /></div><p className="mt-4 text-3xl font-bold text-slate-900">{formatPaymentCurrency(payment.amount)}</p></section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-bold text-slate-900">Thông tin giao dịch</h3><dl className="mt-4 grid gap-4 sm:grid-cols-2">{details.map(([label, value]) => <div key={label}><dt className="text-xs text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-slate-700">{value}</dd></div>)}</dl></section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="font-bold text-slate-900">Ghi chú</h3><p className="mt-3 text-sm leading-6 text-slate-500">{payment.note ?? "Chưa có ghi chú."}</p></section>
          </div>}
        </div>
        <footer className="border-t border-slate-200 bg-white p-4"><button type="button" disabled={payment.status === "VOIDED"} onClick={() => onEdit(payment)} className="h-11 w-full rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300">Sửa tham chiếu / ghi chú</button></footer>
      </aside>
    </div>
  );
};
