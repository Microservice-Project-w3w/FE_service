import type {
    CustomerRentalRequestItem,
} from "../types/customerRentalRequest.types";

export const CUSTOMER_RENTAL_REQUEST_MOCKS:
    CustomerRentalRequestItem[] = [
    {
        id: "1",
        requestCode: "RQ-2026-0006",

        equipmentId: "1",
        equipmentCode: "EQ-2505-001",
        equipmentName:
            "Máy xúc Komatsu PC200-8",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?auto=format&fit=crop&w=500&q=80",

        branch: "Chi nhánh Hà Nội",

        createdAt: "2026-08-05T10:30:00",
        startDate: "2026-08-10",
        endDate: "2026-08-20",
        rentalDays: 11,

        quantity: 1,
        rentalUnit: "Theo ngày",

        deliveryMethod:
            "DELIVERY_TO_ADDRESS",
        deliveryAddress:
            "123 Phạm Văn Đồng, Cầu Giấy, Hà Nội",

        estimatedTotal: 16500000,

        status: "PENDING",
    },
    {
        id: "2",
        requestCode: "RQ-2026-0005",

        equipmentId: "3",
        equipmentCode: "EQ-2505-003",
        equipmentName:
            "Máy phát điện Denyo 45kVA",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80",

        branch: "Chi nhánh Đà Nẵng",

        createdAt: "2026-08-04T14:20:00",
        startDate: "2026-08-06",
        endDate: "2026-08-08",
        rentalDays: 3,

        quantity: 1,
        rentalUnit: "Theo ngày",

        deliveryMethod:
            "PICKUP_AT_BRANCH",

        estimatedTotal: 3600000,

        status: "PROCESSING",
    },
    {
        id: "3",
        requestCode: "RQ-2026-0004",

        equipmentId: "2",
        equipmentCode: "EQ-2505-002",
        equipmentName:
            "Xe nâng Heli CPCD30",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=500&q=80",

        branch: "Chi nhánh Hà Nội",

        createdAt: "2026-08-03T09:15:00",
        startDate: "2026-08-05",
        endDate: "2026-08-12",
        rentalDays: 8,

        quantity: 2,
        rentalUnit: "Theo ngày",

        deliveryMethod:
            "DELIVERY_TO_ADDRESS",
        deliveryAddress:
            "Khu công nghiệp Quang Minh, Mê Linh, Hà Nội",

        estimatedTotal: 12800000,

        status: "QUOTED",
    },
    {
        id: "4",
        requestCode: "RQ-2026-0003",

        equipmentId: "4",
        equipmentCode: "EQ-2505-004",
        equipmentName:
            "Giàn giáo nêm Ringlock",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500&q=80",

        branch: "Chi nhánh Hà Nội",

        createdAt: "2026-08-01T16:45:00",
        startDate: "2026-08-03",
        endDate: "2026-08-10",
        rentalDays: 8,

        quantity: 50,
        rentalUnit: "Theo bộ/ngày",

        deliveryMethod:
            "PICKUP_AT_BRANCH",

        estimatedTotal: 4000000,

        status: "APPROVED",
    },
    {
        id: "5",
        requestCode: "RQ-2026-0002",

        equipmentId: "6",
        equipmentCode: "EQ-2505-006",
        equipmentName:
            "Máy lu Hamm HD75",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=80",

        branch: "Chi nhánh Hà Nội",

        createdAt: "2026-07-30T11:05:00",
        startDate: "2026-08-01",
        endDate: "2026-08-02",
        rentalDays: 2,

        quantity: 1,
        rentalUnit: "Theo ngày",

        deliveryMethod:
            "DELIVERY_TO_ADDRESS",
        deliveryAddress:
            "Khu đô thị Ciputra, Tây Hồ, Hà Nội",

        estimatedTotal: 2700000,

        status: "REJECTED",
        rejectionReason:
            "Thiết bị đang trong thời gian bảo trì.",
    },
    {
        id: "6",
        requestCode: "RQ-2026-0001",

        equipmentId: "5",
        equipmentCode: "EQ-2505-005",
        equipmentName:
            "Xe nâng người Genie S-60",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=500&q=80",

        branch: "Chi nhánh TP.HCM",

        createdAt: "2026-07-28T08:40:00",
        startDate: "2026-07-30",
        endDate: "2026-08-01",
        rentalDays: 3,

        quantity: 1,
        rentalUnit: "Theo ngày",

        deliveryMethod:
            "PICKUP_AT_BRANCH",

        estimatedTotal: 3300000,

        status: "CANCELLED",
    },
];