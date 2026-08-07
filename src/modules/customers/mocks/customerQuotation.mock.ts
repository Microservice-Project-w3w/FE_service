import type {
    CustomerQuotationItem,
} from "../types/customerQuotation.types";

export const CUSTOMER_QUOTATION_MOCKS:
    CustomerQuotationItem[] = [
    {
        id: "1",

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

        createdAt: "2026-08-06T09:30:00",
        validUntil: "2026-08-09",

        startDate: "2026-08-10",
        endDate: "2026-08-20",
        rentalDays: 11,
        quantity: 1,

        rentalAmount: 16500000,
        deliveryFee: 500000,
        depositAmount: 3000000,
        vatAmount: 0,
        totalAmount: 20000000,

        status: "PENDING_RESPONSE",

        note:
            "Giá thuê đã bao gồm chi phí vận hành cơ bản. Khách hàng chịu trách nhiệm về nhiên liệu trong thời gian thuê.",
    },
    {
        id: "2",

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

        createdAt: "2026-08-05T14:20:00",
        validUntil: "2026-08-08",

        startDate: "2026-08-06",
        endDate: "2026-08-08",
        rentalDays: 3,
        quantity: 1,

        rentalAmount: 3600000,
        deliveryFee: 300000,
        depositAmount: 1000000,
        vatAmount: 390000,
        totalAmount: 5290000,

        status: "ACCEPTED",

        note:
            "Thiết bị được bàn giao kèm dây nguồn và hướng dẫn vận hành.",
    },
    {
        id: "3",

        quotationCode: "QT-2026-0004",
        requestId: "3",
        requestCode: "RQ-2026-0004",

        equipmentId: "2",
        equipmentCode: "EQ-2505-002",
        equipmentName:
            "Xe nâng Heli CPCD30",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=700&q=80",

        branch: "Chi nhánh Hà Nội",

        createdAt: "2026-08-04T08:45:00",
        validUntil: "2026-08-07",

        startDate: "2026-08-05",
        endDate: "2026-08-12",
        rentalDays: 8,
        quantity: 2,

        rentalAmount: 12800000,
        deliveryFee: 800000,
        depositAmount: 4000000,
        vatAmount: 1360000,
        totalAmount: 18960000,

        status: "PENDING_RESPONSE",

        note:
            "Giá áp dụng cho hai xe nâng và đã bao gồm phí kiểm tra kỹ thuật trước khi giao.",
    },
    {
        id: "4",

        quotationCode: "QT-2026-0003",
        requestId: "4",
        requestCode: "RQ-2026-0003",

        equipmentId: "4",
        equipmentCode: "EQ-2505-004",
        equipmentName:
            "Giàn giáo nêm Ringlock",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=700&q=80",

        branch: "Chi nhánh Hà Nội",

        createdAt: "2026-08-02T16:15:00",
        validUntil: "2026-08-05",

        startDate: "2026-08-03",
        endDate: "2026-08-10",
        rentalDays: 8,
        quantity: 50,

        rentalAmount: 4000000,
        deliveryFee: 500000,
        depositAmount: 1500000,
        vatAmount: 450000,
        totalAmount: 6450000,

        status: "ACCEPTED",

        note:
            "Số lượng báo giá gồm 50 bộ giàn giáo và phụ kiện tiêu chuẩn.",
    },
    {
        id: "5",

        quotationCode: "QT-2026-0002",
        requestId: "5",
        requestCode: "RQ-2026-0002",

        equipmentId: "6",
        equipmentCode: "EQ-2505-006",
        equipmentName:
            "Máy lu Hamm HD75",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80",

        branch: "Chi nhánh Hà Nội",

        createdAt: "2026-07-31T10:10:00",
        validUntil: "2026-08-03",

        startDate: "2026-08-01",
        endDate: "2026-08-02",
        rentalDays: 2,
        quantity: 1,

        rentalAmount: 2700000,
        deliveryFee: 400000,
        depositAmount: 2000000,
        vatAmount: 310000,
        totalAmount: 5410000,

        status: "REJECTED",

        rejectionReason:
            "Khách hàng thay đổi kế hoạch và không tiếp tục thuê thiết bị.",
    },
    {
        id: "6",

        quotationCode: "QT-2026-0001",
        requestId: "6",
        requestCode: "RQ-2026-0001",

        equipmentId: "5",
        equipmentCode: "EQ-2505-005",
        equipmentName:
            "Xe nâng người Genie S-60",
        equipmentImageUrl:
            "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=700&q=80",

        branch: "Chi nhánh TP.HCM",

        createdAt: "2026-07-28T08:40:00",
        validUntil: "2026-07-31",

        startDate: "2026-07-30",
        endDate: "2026-08-01",
        rentalDays: 3,
        quantity: 1,

        rentalAmount: 3300000,
        deliveryFee: 300000,
        depositAmount: 1500000,
        vatAmount: 360000,
        totalAmount: 5460000,

        status: "EXPIRED",

        note:
            "Báo giá đã hết thời hạn phản hồi.",
    },
];