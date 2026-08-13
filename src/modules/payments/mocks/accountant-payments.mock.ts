import type {
  AccountantPayment,
} from "@/modules/payments/types/accountant-payment.types";

export const accountantExternalPaymentMocks: AccountantPayment[] = [
  {
    id: "payment-gateway-001",
    invoiceId: "inv-hcm-0047",
    invoiceCode: "INV-HCM-0047",
    customerName: "Công ty CP Công nghệ Nova",
    branchId: "branch-hcm",
    branchName: "Chi nhánh TP. Hồ Chí Minh",
    amount: 20_000_000,
    method: "BANK_TRANSFER",
    referenceCode: "VCB-20260813-047",
    paidAt: "2026-08-13T09:10:00+07:00",
    recordedBy: "Cổng ngân hàng",
    status: "PENDING",
    source: "BANK_GATEWAY",
    note: "Đang chờ xác nhận từ ngân hàng.",
  },
  {
    id: "payment-gateway-002",
    invoiceId: "inv-hn-0079",
    invoiceCode: "INV-HN-0079",
    customerName: "Công ty CP Truyền thông Ánh Dương",
    branchId: "branch-hanoi",
    branchName: "Chi nhánh Hà Nội",
    amount: 5_000_000,
    method: "CARD",
    referenceCode: "POS-HN-20260812-079",
    paidAt: "2026-08-12T15:45:00+07:00",
    recordedBy: "Cổng thanh toán",
    status: "FAILED",
    source: "BANK_GATEWAY",
    note: "Ngân hàng từ chối giao dịch.",
  },
];

export const cloneAccountantExternalPayments = (): AccountantPayment[] =>
  structuredClone(accountantExternalPaymentMocks);

export const initialDepositRefunds: Record<string, number> = {
  "inv-dn-0019": 1_000_000,
};
