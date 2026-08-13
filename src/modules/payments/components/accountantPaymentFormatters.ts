import type { AccountantPaymentMethod } from "@/modules/invoices";

export const formatPaymentCurrency = (value: number): string =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

export const formatPaymentDate = (value: string): string =>
  new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

export const accountantPaymentMethodLabels: Record<AccountantPaymentMethod, string> = {
  CASH: "Tiền mặt",
  BANK_TRANSFER: "Chuyển khoản",
  CARD: "Thẻ",
  OTHER: "Khác",
};
