import type {
    CustomerContractItem,
} from "../types/customerContract.types";

export const CUSTOMER_CONTRACT_MOCKS:
    CustomerContractItem[] = [
    {
        id: "1",

        contractCode: "HD-2026-0008",
        quotationId: "1",
        quotationCode: "QT-2026-0006",
        requestId: "1",
        requestCode: "RQ-2026-0006",

        equipmentId: "1",
        equipmentCode: "EQ-2505-001",
        equipmentName:
            "Máy xúc Komatsu PC200-8",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?auto=format&fit=crop&w=700&q=80",

        branch: "Chi nhánh Hà Nội",

        createdAt: "2026-08-05T10:30:00",
        startDate: "2026-08-10",
        endDate: "2026-08-20",
        rentalDays: 11,
        quantity: 1,

        totalAmount: 20000000,
        paidAmount: 10000000,
        remainingAmount: 10000000,
        paymentProgress: 50,

        status: "ACTIVE",

        signedAt: "2026-08-05T14:00:00",

        canRequestExtension: true,
    },
    {
        id: "2",

        contractCode: "HD-2026-0007",
        quotationId: "2",
        quotationCode: "QT-2026-0005",
        requestId: "2",
        requestCode: "RQ-2026-0005",

        equipmentId: "3",
        equipmentCode: "EQ-2505-003",
        equipmentName:
            "Máy phát điện Denyo 45kVA",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80",

        branch: "Chi nhánh Đà Nẵng",

        createdAt: "2026-08-03T09:15:00",
        startDate: "2026-08-06",
        endDate: "2026-08-08",
        rentalDays: 3,
        quantity: 1,

        totalAmount: 5290000,
        paidAmount: 5290000,
        remainingAmount: 0,
        paymentProgress: 100,

        status: "ACTIVE",

        signedAt: "2026-08-03T11:30:00",

        canRequestExtension: true,
    },
    {
        id: "3",

        contractCode: "HD-2026-0006",
        quotationId: "3",
        quotationCode: "QT-2026-0004",
        requestId: "3",
        requestCode: "RQ-2026-0004",

        equipmentId: "5",
        equipmentCode: "EQ-2505-005",
        equipmentName:
            "Xe nâng người Genie GS-3246",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=700&q=80",

        branch: "Chi nhánh Hà Nội",

        createdAt: "2026-07-28T15:20:00",
        startDate: "2026-08-15",
        endDate: "2026-08-18",
        rentalDays: 4,
        quantity: 1,

        totalAmount: 8750000,
        paidAmount: 8750000,
        remainingAmount: 0,
        paymentProgress: 100,

        status: "EXPIRING_SOON",

        signedAt: "2026-07-28T17:00:00",

        canRequestExtension: true,
    },
    {
        id: "4",

        contractCode: "HD-2026-0005",
        quotationId: "4",
        quotationCode: "QT-2026-0003",
        requestId: "4",
        requestCode: "RQ-2026-0003",

        equipmentId: "7",
        equipmentCode: "EQ-2505-007",
        equipmentName:
            "Dàn ánh sáng sân khấu",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=700&q=80",

        branch: "Chi nhánh TP.HCM",

        createdAt: "2026-07-20T13:40:00",
        startDate: "2026-08-01",
        endDate: "2026-08-03",
        rentalDays: 3,
        quantity: 1,

        totalAmount: 4560000,
        paidAmount: 4560000,
        remainingAmount: 0,
        paymentProgress: 100,

        status: "COMPLETED",

        signedAt: "2026-07-20T16:00:00",
        completedAt: "2026-08-03T18:30:00",

        canRequestExtension: false,
    },
    {
        id: "5",

        contractCode: "HD-2026-0004",
        quotationId: "5",
        quotationCode: "QT-2026-0002",
        requestId: "5",
        requestCode: "RQ-2026-0002",

        equipmentId: "8",
        equipmentCode: "EQ-2505-008",
        equipmentName:
            "Loa hội trường JBL PRX815",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=700&q=80",

        branch: "Chi nhánh Hà Nội",

        createdAt: "2026-07-15T08:50:00",
        startDate: "2026-08-05",
        endDate: "2026-08-06",
        rentalDays: 2,
        quantity: 2,

        totalAmount: 3200000,
        paidAmount: 960000,
        remainingAmount: 2240000,
        paymentProgress: 30,

        status: "CANCELLED",

        signedAt: "2026-07-15T10:20:00",
        cancelledAt: "2026-08-04T14:10:00",
        cancellationReason:
            "Khách hàng thay đổi kế hoạch tổ chức sự kiện.",

        canRequestExtension: false,
    },
    {
        id: "6",

        contractCode: "HD-2026-0003",
        quotationId: "6",
        quotationCode: "QT-2026-0001",
        requestId: "6",
        requestCode: "RQ-2026-0001",

        equipmentId: "2",
        equipmentCode: "EQ-2505-002",
        equipmentName:
            "Xe nâng Heli CPCD30",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80",

        branch: "Chi nhánh Hà Nội",

        createdAt: "2026-07-10T09:00:00",
        startDate: "2026-07-15",
        endDate: "2026-07-18",
        rentalDays: 4,
        quantity: 1,

        totalAmount: 7800000,
        paidAmount: 7800000,
        remainingAmount: 0,
        paymentProgress: 100,

        status: "COMPLETED",

        signedAt: "2026-07-10T11:00:00",
        completedAt: "2026-07-18T17:45:00",

        canRequestExtension: false,
    },
];