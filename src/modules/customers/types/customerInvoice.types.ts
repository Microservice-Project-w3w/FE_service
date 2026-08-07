export type CustomerInvoiceStatus =
    | "PAID"
    | "PENDING"
    | "OVERDUE"
    | "CANCELLED";

export interface CustomerInvoiceItem {
    id: string;
    invoiceCode: string;

    contractId: string;
    contractCode: string;

    equipmentName: string;
    equipmentCode: string;

    branch: string;

    issuedAt: string;
    dueDate: string;

    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;

    paidAmount: number;
    remainingAmount: number;

    status: CustomerInvoiceStatus;

    paymentMethod?: string;
    paidAt?: string;

    overdueDays?: number;

    note?: string;

    createdAt: string;
}