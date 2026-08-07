export type CustomerReturnRequestStatus =
    | "PROCESSING"
    | "DUE_SOON"
    | "COMPLETED"
    | "CANCELLED";

export type CustomerReturnMethod =
    | "BRANCH_RETURN"
    | "PICKUP";

export interface CustomerReturnRequestItem {
    id: string;

    requestCode: string;

    contractId: string;
    contractCode: string;

    equipmentId: string;
    equipmentCode: string;
    equipmentName: string;
    equipmentImageUrl: string;

    branch: string;

    quantity: number;

    requestedAt: string;

    expectedReturnDate: string;
    expectedReturnTime: string;

    returnMethod: CustomerReturnMethod;

    status: CustomerReturnRequestStatus;

    note?: string;

    cancellationReason?: string;

    completedAt?: string;

    createdAt: string;
}