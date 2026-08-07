export type CustomerQuotationStatus =
    | "PENDING_RESPONSE"
    | "ACCEPTED"
    | "REJECTED"
    | "EXPIRED"
    | "SUPERSEDED";

export interface CustomerQuotationPriceItem {
    label: string;
    amount: number;
}

export interface CustomerQuotationItem {
    id: string;

    quotationCode: string;
    requestId: string;
    requestCode: string;

    equipmentId: string;
    equipmentCode: string;
    equipmentName: string;
    equipmentImageUrl: string;

    branch: string;

    createdAt: string;
    validUntil: string;

    startDate: string;
    endDate: string;
    rentalDays: number;
    quantity: number;

    rentalAmount: number;
    deliveryFee: number;
    depositAmount: number;
    vatAmount: number;
    totalAmount: number;

    status: CustomerQuotationStatus;

    note?: string;
    rejectionReason?: string;
}