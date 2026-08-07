import type {
    CustomerReturnRequestItem,
} from "../types/customerReturnRequest.types";

export const CUSTOMER_RETURN_REQUEST_MOCKS:
    CustomerReturnRequestItem[] = [
    {
        id: "return-001",

        requestCode: "RT-2026-0018",

        contractId: "contract-008",
        contractCode: "HD-2026-0008",

        equipmentId: "equipment-003",
        equipmentCode: "EQ-2505-003",
        equipmentName:
            "Máy phát điện Denyo 45kVA",

        equipmentImageUrl:
            "https://images.unsplash.com/photo-1581092160607-ee22621dd758",

        branch: "Chi nhánh Hà Nội",

        quantity: 1,

        requestedAt:
            "2026-08-07T10:30:00",

        expectedReturnDate:
            "2026-08-14",

        expectedReturnTime:
            "09:00",

        returnMethod:
            "BRANCH_RETURN",

        status:
            "PROCESSING",

        note:
            "Thiết bị hoạt động bình thường.",

        createdAt:
            "2026-08-07T10:30:00",
    },

    {
        id: "return-002",

        requestCode: "RT-2026-0017",

        contractId: "contract-007",
        contractCode: "HD-2026-0007",

        equipmentId: "equipment-002",
        equipmentCode: "EQ-2505-002",
        equipmentName:
            "Xe nâng Heli CPCD30",

        equipmentImageUrl:
            "https://images.unsplash.com/photo-1586528116493-da8b895d4c05",

        branch: "Chi nhánh Hà Nội",

        quantity: 1,

        requestedAt:
            "2026-08-06T15:20:00",

        expectedReturnDate:
            "2026-08-12",

        expectedReturnTime:
            "14:00",

        returnMethod:
            "PICKUP",

        status:
            "DUE_SOON",

        note:
            "Khách hàng yêu cầu đơn vị đến nhận thiết bị.",

        createdAt:
            "2026-08-06T15:20:00",
    },

    {
        id: "return-003",

        requestCode: "RT-2026-0016",

        contractId: "contract-006",
        contractCode: "HD-2026-0006",

        equipmentId: "equipment-004",
        equipmentCode: "EQ-2505-004",
        equipmentName:
            "Giàn giáo nêm Ringlock",

        equipmentImageUrl:
            "https://images.unsplash.com/photo-1504307651254-35680f356dfd",

        branch: "Chi nhánh Hà Nội",

        quantity: 50,

        requestedAt:
            "2026-08-05T09:15:00",

        expectedReturnDate:
            "2026-08-05",

        expectedReturnTime:
            "17:00",

        returnMethod:
            "BRANCH_RETURN",

        status:
            "CANCELLED",

        cancellationReason:
            "Khách hàng tiếp tục sử dụng thiết bị.",

        createdAt:
            "2026-08-05T09:15:00",
    },

    {
        id: "return-004",

        requestCode: "RT-2026-0015",

        contractId: "contract-005",
        contractCode: "HD-2026-0005",

        equipmentId: "equipment-001",
        equipmentCode: "EQ-2505-001",
        equipmentName:
            "Máy xúc Komatsu PC200-8",

        equipmentImageUrl:
            "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea",

        branch: "Chi nhánh Hà Nội",

        quantity: 1,

        requestedAt:
            "2026-08-04T11:45:00",

        expectedReturnDate:
            "2026-08-10",

        expectedReturnTime:
            "08:00",

        returnMethod:
            "PICKUP",

        status:
            "PROCESSING",

        note:
            "Thiết bị đang chờ xác nhận lịch nhận.",

        createdAt:
            "2026-08-04T11:45:00",
    },

    {
        id: "return-005",

        requestCode: "RT-2026-0014",

        contractId: "contract-004",
        contractCode: "HD-2026-0004",

        equipmentId: "equipment-005",
        equipmentCode: "EQ-2505-005",
        equipmentName:
            "Xe nâng người Genie S-60",

        equipmentImageUrl:
            "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8",

        branch: "Chi nhánh Đà Nẵng",

        quantity: 1,

        requestedAt:
            "2026-08-03T16:00:00",

        expectedReturnDate:
            "2026-08-08",

        expectedReturnTime:
            "13:30",

        returnMethod:
            "BRANCH_RETURN",

        status:
            "COMPLETED",

        note:
            "Thiết bị đã được hoàn trả đầy đủ.",

        completedAt:
            "2026-08-08T13:10:00",

        createdAt:
            "2026-08-03T16:00:00",
    },

    {
        id: "return-006",

        requestCode: "RT-2026-0013",

        contractId: "contract-003",
        contractCode: "HD-2026-0003",

        equipmentId: "equipment-006",
        equipmentCode: "EQ-2505-006",
        equipmentName:
            "Máy lu Hamm HD75",

        equipmentImageUrl:
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e",

        branch: "Chi nhánh TP.HCM",

        quantity: 1,

        requestedAt:
            "2026-07-28T09:00:00",

        expectedReturnDate:
            "2026-08-02",

        expectedReturnTime:
            "09:30",

        returnMethod:
            "PICKUP",

        status:
            "COMPLETED",

        note:
            "Thiết bị đã được tiếp nhận và kiểm tra.",

        completedAt:
            "2026-08-02T09:25:00",

        createdAt:
            "2026-07-28T09:00:00",
    },
];