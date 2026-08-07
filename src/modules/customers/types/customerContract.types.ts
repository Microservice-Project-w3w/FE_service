export type CustomerContractStatus =
    | "ACTIVE"
    | "EXPIRING_SOON"
    | "COMPLETED"
    | "CANCELLED";

export interface CustomerContractItem {
    id: string;

    contractCode: string;
    quotationId: string;
    quotationCode: string;
    requestId: string;
    requestCode: string;

    equipmentId: string;
    equipmentCode: string;
    equipmentName: string;
    equipmentImageUrl: string;

    branch: string;

    createdAt: string;
    startDate: string;
    endDate: string;
    rentalDays: number;
    quantity: number;

    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    paymentProgress: number;

    status: CustomerContractStatus;

    signedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
    cancellationReason?: string;

    canRequestExtension: boolean;
}