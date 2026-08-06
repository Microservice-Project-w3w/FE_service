export type RentalDeliveryMethod =
    | "PICKUP_AT_BRANCH"
    | "DELIVERY_TO_ADDRESS";

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