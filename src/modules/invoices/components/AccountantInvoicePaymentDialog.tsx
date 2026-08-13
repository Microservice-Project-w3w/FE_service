import { CircleDollarSign, LoaderCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  formatInvoiceCurrency,
} from "@/modules/invoices/components/accountantInvoiceFormatters";
import {
  toRecordPaymentInput,
  validateInvoicePayment,
  type InvoicePaymentFormErrors,
  type InvoicePaymentFormValues,
} from "@/modules/invoices/schemas/accountant-invoice.schema";
import type {
  AccountantInvoice,
  RecordInvoicePaymentInput,
} from "@/modules/invoices/types/accountant-invoice.types";

interface AccountantInvoicePaymentDialogProps {
  invoice: AccountantInvoice | null;
  recordedBy: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (input: RecordInvoicePaymentInput) => Promise<void>;
}

const initialValues = (): InvoicePaymentFormValues => ({
  amount: "",
  method: "",
  referenceCode: "",
  paidAt: new Date().toISOString().slice(0, 10),
  note: "",
});

const fieldClass =
  "mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export const AccountantInvoicePaymentDialog = ({
  invoice,
  recordedBy,
  isSubmitting,
  onClose,
  onSubmit,
}: AccountantInvoicePaymentDialogProps) => {
  const [values, setValues] = useState<InvoicePaymentFormValues>(initialValues);
  const [errors, setErrors] = useState<InvoicePaymentFormErrors>({});

  useEffect(() => {
    if (!invoice) return;
    setValues(initialValues());
    setErrors({});
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
  }, [invoice, isSubmitting, onClose]);

  if (!invoice) return null;

  const updateValue = <Key extends keyof InvoicePaymentFormValues>(
    key: Key,
    value: InvoicePaymentFormValues[Key],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateInvoicePayment(values, invoice.remainingAmount);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    await onSubmit(toRecordPaymentInput(invoice.id, recordedBy, values));
  };

  return createPortal(
    <div role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !isSubmitting && onClose()} className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <form onSubmit={(event) => void handleSubmit(event)} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/70 bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><CircleDollarSign size={22} /></span>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Ghi nhận thanh toán</h2>
              <p className="mt-1 text-xs text-slate-400">{invoice.invoiceCode} · {invoice.customerName}</p>
            </div>
          </div>
          <button type="button" aria-label="Đóng" disabled={isSubmitting} onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </header>

        <div className="space-y-5 p-6">
          <section className="grid gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:grid-cols-3">
            <div><p className="text-xs text-slate-500">Tổng hóa đơn</p><p className="mt-1 font-bold text-slate-900">{formatInvoiceCurrency(invoice.totalAmount)}</p></div>
            <div><p className="text-xs text-slate-500">Đã thanh toán</p><p className="mt-1 font-bold text-slate-900">{formatInvoiceCurrency(invoice.paidAmount)}</p></div>
            <div><p className="text-xs text-slate-500">Còn phải thu</p><p className="mt-1 font-bold text-blue-700">{formatInvoiceCurrency(invoice.remainingAmount)}</p></div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Số tiền <span className="text-rose-500">*</span>
              <input type="number" min="1" max={invoice.remainingAmount} step="1000" value={values.amount} onChange={(event) => updateValue("amount", event.target.value)} className={fieldClass} placeholder="Nhập số tiền" />
              {errors.amount && <span className="mt-1 block text-xs text-rose-600">{errors.amount}</span>}
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Phương thức <span className="text-rose-500">*</span>
              <select value={values.method} onChange={(event) => updateValue("method", event.target.value as InvoicePaymentFormValues["method"])} className={fieldClass}>
                <option value="">Chọn phương thức</option>
                <option value="BANK_TRANSFER">Chuyển khoản</option>
                <option value="CASH">Tiền mặt</option>
                <option value="CARD">Thẻ</option>
                <option value="OTHER">Khác</option>
              </select>
              {errors.method && <span className="mt-1 block text-xs text-rose-600">{errors.method}</span>}
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Mã tham chiếu
              <input value={values.referenceCode} onChange={(event) => updateValue("referenceCode", event.target.value)} className={fieldClass} placeholder="VD: VCB-20260813-001" />
              {errors.referenceCode && <span className="mt-1 block text-xs text-rose-600">{errors.referenceCode}</span>}
            </label>
            <label className="text-sm font-semibold text-slate-700">
              Ngày thanh toán <span className="text-rose-500">*</span>
              <input type="date" value={values.paidAt} onChange={(event) => updateValue("paidAt", event.target.value)} className={fieldClass} />
              {errors.paidAt && <span className="mt-1 block text-xs text-rose-600">{errors.paidAt}</span>}
            </label>
          </div>
          <label className="block text-sm font-semibold text-slate-700">
            Ghi chú
            <textarea rows={3} value={values.note} onChange={(event) => updateValue("note", event.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Thông tin bổ sung cho giao dịch" />
            {errors.note && <span className="mt-1 block text-xs text-rose-600">{errors.note}</span>}
          </label>
        </div>

        <footer className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button type="button" disabled={isSubmitting} onClick={onClose} className="h-10 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700">Hủy</button>
          <button type="submit" disabled={isSubmitting} className="inline-flex h-10 min-w-40 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
            {isSubmitting && <LoaderCircle size={17} className="animate-spin" />} Xác nhận ghi nhận
          </button>
        </footer>
      </form>
    </div>,
    document.body,
  );
};
