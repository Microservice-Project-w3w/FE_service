import type {
  AccountantPaymentMethod,
  RecordInvoicePaymentInput,
} from "@/modules/invoices/types/accountant-invoice.types";

export interface InvoicePaymentFormValues {
  amount: string;
  method: AccountantPaymentMethod | "";
  referenceCode: string;
  paidAt: string;
  note: string;
}

export type InvoicePaymentFormErrors = Partial<
  Record<keyof InvoicePaymentFormValues, string>
>;

export const validateInvoicePayment = (
  values: InvoicePaymentFormValues,
  remainingAmount: number,
): InvoicePaymentFormErrors => {
  const errors: InvoicePaymentFormErrors = {};
  const amount = Number(values.amount);

  if (!values.amount.trim() || !Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Số tiền phải lớn hơn 0.";
  } else if (amount > remainingAmount) {
    errors.amount = "Số tiền không được vượt quá số còn phải thu.";
  }

  if (!values.method) {
    errors.method = "Vui lòng chọn phương thức thanh toán.";
  }

  if (!values.paidAt || Number.isNaN(new Date(values.paidAt).getTime())) {
    errors.paidAt = "Vui lòng chọn ngày thanh toán hợp lệ.";
  }

  if (values.referenceCode.trim().length > 80) {
    errors.referenceCode = "Mã tham chiếu tối đa 80 ký tự.";
  }

  if (values.note.trim().length > 300) {
    errors.note = "Ghi chú tối đa 300 ký tự.";
  }

  return errors;
};

export const toRecordPaymentInput = (
  invoiceId: string,
  recordedBy: string,
  values: InvoicePaymentFormValues,
): RecordInvoicePaymentInput => ({
  invoiceId,
  amount: Number(values.amount),
  method: values.method as AccountantPaymentMethod,
  referenceCode: values.referenceCode.trim(),
  paidAt: new Date(`${values.paidAt}T12:00:00+07:00`).toISOString(),
  note: values.note.trim(),
  recordedBy,
});
