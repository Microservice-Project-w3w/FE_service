import { LoaderCircle, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { AccountantPayment, UpdateAccountantPaymentInput } from "@/modules/payments/types/accountant-payment.types";

interface Props { payment: AccountantPayment | null; isSubmitting: boolean; onClose: () => void; onSubmit: (input: UpdateAccountantPaymentInput) => Promise<void>; }

export const AccountantPaymentEditDialog = ({ payment, isSubmitting, onClose, onSubmit }: Props) => {
  const [referenceCode, setReferenceCode] = useState(""); const [note, setNote] = useState(""); const [error, setError] = useState("");
  useEffect(() => {
    if (!payment) return;
    setReferenceCode(payment.referenceCode ?? ""); setNote(payment.note ?? ""); setError("");
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => event.key === "Escape" && !isSubmitting && onClose();
    document.body.style.overflow = "hidden"; window.addEventListener("keydown", handleKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleKeyDown); };
  }, [isSubmitting, onClose, payment]);
  if (!payment) return null;
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (referenceCode.trim().length > 80 || note.trim().length > 300) { setError("Mã tham chiếu tối đa 80 và ghi chú tối đa 300 ký tự."); return; }
    await onSubmit({ paymentId: payment.id, referenceCode, note });
  };
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <form onSubmit={(event) => void handleSubmit(event)} className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Pencil size={19} /></span><div><h2 className="font-bold text-slate-900">Cập nhật giao dịch</h2><p className="mt-1 text-xs text-slate-400">{payment.id}</p></div></div><button type="button" onClick={onClose} className="p-2 text-slate-400"><X size={18} /></button></header>
        <div className="space-y-4 p-6"><label className="block text-sm font-semibold text-slate-700">Mã tham chiếu<input value={referenceCode} onChange={(event) => setReferenceCode(event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label><label className="block text-sm font-semibold text-slate-700">Ghi chú<textarea rows={4} value={note} onChange={(event) => setNote(event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></label>{error && <p className="text-sm text-rose-600">{error}</p>}</div>
        <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4"><button type="button" disabled={isSubmitting} onClick={onClose} className="h-10 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700">Hủy</button><button type="submit" disabled={isSubmitting} className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white">{isSubmitting && <LoaderCircle size={17} className="animate-spin" />} Lưu thay đổi</button></footer>
      </form>
    </div>, document.body,
  );
};
