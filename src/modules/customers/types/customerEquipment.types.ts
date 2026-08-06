export type CustomerEquipmentStatus =
    | "AVAILABLE"
    | "LOW_STOCK"
    | "UNAVAILABLE";

export type CustomerEquipmentAvailabilityReason =
    | "IN_STOCK"
    | "LOW_QUANTITY"
    | "RENTED_OUT"
    | "MAINTENANCE"
    | "REPAIR"
    | "INACTIVE";

export interface EquipmentSpecification {
    label: string;
    value: string;
}

export interface CustomerEquipment {
    id: string;
    code: string;
    name: string;
    category: string;
    branch: string;
    pricePerDay: number;
    imageUrl: string;
    status: CustomerEquipmentStatus;

    availableQuantity: number;
    availabilityReason:
        CustomerEquipmentAvailabilityReason;

    description: string;
    features: string[];
    specifications: EquipmentSpecification[];
    galleryImages: string[];
    pickupAddress: string;
    rentalUnit: string;
    usageGuide: string[];
    rentalPolicy: string[];
}