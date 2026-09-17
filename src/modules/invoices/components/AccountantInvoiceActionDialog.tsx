import { AlertTriangle, LoaderCircle, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface AccountantInvoiceActionDialogProps {
  open: boolean;
  action: "ISSUE" | "CANCEL";
  invoiceCode: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (cancelReason: string) => void;
}

export const AccountantInvoiceActionDialog = ({
  open,
  action,
  invoiceCode,
  isSubmitting,
  onClose,
  onConfirm,
}: AccountantInvoiceActionDialogProps) => {
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSubmitting, onClose, open]);

  useEffect(() => {
    if (open) setCancelReason("");
  }, [open]);

  if (!open) return null;
  const isCancel = action === "CANCEL";

  return createPortal(
    <div role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !isSubmitting && onClose()} className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <section role="alertdialog" aria-modal="true" className="w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className={`flex size-11 items-center justify-center rounded-2xl ${isCancel ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"}`}>
              {isCancel ? <AlertTriangle size={22} /> : <Send size={21} />}
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{isCancel ? "Hủy hóa đơn" : "Phát hành hóa đơn"}</h2>
              <p className="mt-1 text-xs text-slate-400">{invoiceCode}</p>
            </div>
          </div>
          <button type="button" aria-label="Đóng" disabled={isSubmitting} onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </header>
        <div className="space-y-4 px-6 py-5 text-sm leading-6 text-slate-600">
          <p>{isCancel
            ? "Hóa đơn sẽ chuyển sang trạng thái Đã hủy và không thể ghi nhận thanh toán. Bạn có chắc muốn tiếp tục?"
            : "Hóa đơn sẽ được phát hành. Bạn có chắc thông tin đã chính xác?"}</p>
          {isCancel && (
            <label className="block text-xs font-semibold text-slate-600">
              Lý do hủy
              <textarea
                rows={3}
                value={cancelReason}
                disabled={isSubmitting}
                onChange={(event) => setCancelReason(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Nhập lý do hủy hóa đơn"
              />
            </label>
          )}
        </div>
        <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <button type="button" disabled={isSubmitting} onClick={onClose} className="h-10 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700">Quay lại</button>
          <button type="button" disabled={isSubmitting || (isCancel && !cancelReason.trim())} onClick={() => onConfirm(cancelReason)} className={`inline-flex h-10 min-w-28 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${isCancel ? "bg-rose-600 hover:bg-rose-700" : "bg-blue-600 hover:bg-blue-700"}`}>
            {isSubmitting && <LoaderCircle size={17} className="animate-spin" />}
            {isCancel ? "Xác nhận hủy" : "Phát hành"}
          </button>
        </footer>
      </section>
    </div>,
    document.body,
  );
};
