import type {
  AccountantPaymentMethod,
  RecordInvoicePaymentInput,
} from "@/modules/invoices";

export interface AccountantPaymentFormValues {
  invoiceId: string;
  amount: string;
  method: AccountantPaymentMethod | "";
  referenceCode: string;
  paidAt: string;
  note: string;
}

export type AccountantPaymentFormErrors = Partial<Record<keyof AccountantPaymentFormValues, string>>;

export const validateAccountantPayment = (
  values: AccountantPaymentFormValues,
  remainingAmount: number,
): AccountantPaymentFormErrors => {
  const errors: AccountantPaymentFormErrors = {};
  const amount = Number(values.amount);
  if (!values.invoiceId) errors.invoiceId = "Vui lòng chọn hóa đơn.";
  if (!values.amount || !Number.isFinite(amount) || amount <= 0) errors.amount = "Số tiền phải lớn hơn 0.";
  else if (amount > remainingAmount) errors.amount = "Số tiền vượt quá số còn phải thu.";
  if (!values.method) errors.method = "Vui lòng chọn phương thức.";
  if (!values.paidAt || Number.isNaN(new Date(values.paidAt).getTime())) errors.paidAt = "Ngày thanh toán không hợp lệ.";
  if (values.referenceCode.trim().length > 80) errors.referenceCode = "Mã tham chiếu tối đa 80 ký tự.";
  if (values.note.trim().length > 300) errors.note = "Ghi chú tối đa 300 ký tự.";
  return errors;
};

export const toAccountantPaymentInput = (
  values: AccountantPaymentFormValues,
  recordedBy: string,
): RecordInvoicePaymentInput => ({
  invoiceId: values.invoiceId,
  amount: Number(values.amount),
  method: values.method as AccountantPaymentMethod,
  referenceCode: values.referenceCode.trim(),
  paidAt: new Date(`${values.paidAt}T12:00:00+07:00`).toISOString(),
  note: values.note.trim(),
  recordedBy,
});
