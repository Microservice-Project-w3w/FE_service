export type RentalDeliveryMethod =
    | "PICKUP_AT_BRANCH"
    | "DELIVERY_TO_ADDRESS";

export type CustomerRentalRequestStatus =
    | "PENDING"
    | "PROCESSING"
    | "QUOTED"
    | "APPROVED"
    | "DELIVERING"
    | "COMPLETED"
    | "REJECTED"
    | "CANCELLED";

export interface CustomerRentalRequestFormValues {
    startDate: string;
    endDate: string;
    quantity: number;
    deliveryMethod: RentalDeliveryMethod;
    deliveryAddress: string;
    contactName: string;
    contactPhone: string;
    note: string;
}

export interface CustomerRentalRequestSummaryData {
    rentalDays: number;
    quantity: number;
    subtotal: number;
}

export interface CustomerRentalRequestItem {
    id: string;
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
    rentalUnit: string;

    deliveryMethod: RentalDeliveryMethod;
    deliveryAddress?: string;

    estimatedTotal: number;

    status: CustomerRentalRequestStatus;
    rejectionReason?: string;
}