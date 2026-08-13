import { ShieldCheck, X } from "lucide-react";
import { useEffect } from "react";
import { AccountantDepositBadge } from "@/modules/payments/components/AccountantPaymentBadge";
import { formatPaymentCurrency, formatPaymentDate } from "@/modules/payments/components/accountantPaymentFormatters";
import type { AccountantDeposit } from "@/modules/payments/types/accountant-payment.types";

interface Props { deposit: AccountantDeposit | null; onClose: () => void; onRefund: (deposit: AccountantDeposit) => void; }
export const AccountantDepositDetailDrawer = ({ deposit, onClose, onRefund }: Props) => {
  useEffect(() => {
    if (!deposit) return; const previous = document.body.style.overflow;
    const keydown = (event: KeyboardEvent) => event.key === "Escape" && onClose(); document.body.style.overflow = "hidden"; window.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", keydown); };
  }, [deposit, onClose]);
  if (!deposit) return null;
  const refundable = deposit.heldAmount - deposit.refundedAmount;
  return <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-[2px]"><button type="button" aria-label="Đóng" onClick={onClose} className="h-full flex-1" /><aside className="flex h-full w-full max-w-lg flex-col bg-slate-50 shadow-2xl">
    <header className="flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><ShieldCheck size={22} /></span><div><p className="text-xs font-semibold uppercase text-blue-600">Chi tiết tiền cọc</p><h2 className="mt-1 font-bold text-slate-900">{deposit.id}</h2></div></div><button type="button" onClick={onClose} className="p-2 text-slate-400"><X size={20} /></button></header>
    <div className="flex-1 overflow-y-auto p-6"><div className="space-y-5"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">Số cọc còn giữ</p><AccountantDepositBadge status={deposit.status} /></div><p className="mt-4 text-3xl font-bold text-blue-700">{formatPaymentCurrency(refundable)}</p></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><dl className="grid gap-4 sm:grid-cols-2">{[["Hóa đơn", deposit.invoiceCode], ["Đơn thuê", deposit.rentalCode], ["Khách hàng", deposit.customerName], ["Chi nhánh", deposit.branchName], ["Giá trị cọc", formatPaymentCurrency(deposit.depositAmount)], ["Đã hoàn", formatPaymentCurrency(deposit.refundedAmount)], ["Cập nhật", formatPaymentDate(deposit.updatedAt)]].map(([label, value]) => <div key={label}><dt className="text-xs text-slate-400">{label}</dt><dd className="mt-1 text-sm font-semibold text-slate-700">{value}</dd></div>)}</dl></section></div></div>
    <footer className="border-t border-slate-200 bg-white p-4"><button type="button" disabled={refundable <= 0} onClick={() => onRefund(deposit)} className="h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white disabled:bg-slate-300">Hoàn toàn bộ số cọc còn giữ</button></footer>
  </aside></div>;
};
