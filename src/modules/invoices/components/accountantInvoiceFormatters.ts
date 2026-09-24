import type { AccountantPaymentMethod } from "@/modules/invoices/types/accountant-invoice.types";

export const formatInvoiceCurrency = (value: number | null): string =>
  value === null ? "—" : new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export const formatInvoiceDate = (value: string | null): string =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(value))
    : "—";

export const displayInvoiceValue = (value: string | null): string => value || "—";

export const paymentMethodLabels: Record<AccountantPaymentMethod, string> = {
  CASH: "Tiền mặt",
  BANK_TRANSFER: "Chuyển khoản",
  CARD: "Thẻ",
  OTHER: "Khác",
};
