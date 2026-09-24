import { AlertTriangle, LoaderCircle, X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { formatPaymentCurrency } from "@/modules/payments/components/accountantPaymentFormatters";
import type { AccountantPayment } from "@/modules/payments/types/accountant-payment.types";

interface Props { payment: AccountantPayment | null; isSubmitting: boolean; onClose: () => void; onConfirm: () => void; }

export const AccountantPaymentVoidDialog = ({ payment, isSubmitting, onClose, onConfirm }: Props) => {
  useEffect(() => {
    if (!payment) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => event.key === "Escape" && !isSubmitting && onClose();
    document.body.style.overflow = "hidden"; window.addEventListener("keydown", handleKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleKeyDown); };
  }, [isSubmitting, onClose, payment]);
  if (!payment) return null;
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <section role="alertdialog" aria-modal="true" className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5"><div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><AlertTriangle size={22} /></span><div><h2 className="font-bold text-slate-900">Hủy ghi nhận thanh toán</h2><p className="mt-1 text-xs text-slate-400">{payment.id}</p></div></div><button type="button" onClick={onClose} className="p-2 text-slate-400"><X size={18} /></button></header>
        <div className="space-y-3 px-6 py-5 text-sm leading-6 text-slate-600"><p>Giao dịch <strong>{formatPaymentCurrency(payment.amount)}</strong> sẽ chuyển sang Đã hủy.</p><p className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-rose-700">Số đã thu, còn phải thu và trạng thái hóa đơn sẽ được hoàn nguyên tương ứng.</p></div>
        <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4"><button type="button" disabled={isSubmitting} onClick={onClose} className="h-10 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700">Quay lại</button><button type="button" disabled={isSubmitting} onClick={onConfirm} className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white">{isSubmitting && <LoaderCircle size={17} className="animate-spin" />} Xác nhận hủy</button></footer>
      </section>
    </div>, document.body,
  );
};
