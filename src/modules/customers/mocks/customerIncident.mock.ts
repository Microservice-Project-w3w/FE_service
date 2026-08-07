import type {
    CustomerIncidentItem,
} from "../types/customerIncident.types";

export const CUSTOMER_INCIDENT_MOCKS:
    CustomerIncidentItem[] = [
    {
        id: "incident-001",

        incidentCode: "SC-2026-0018",

        contractId: "contract-008",
        contractCode: "HD-2026-0008",

        equipmentId: "equipment-003",
        equipmentCode: "EQ-2505-003",
        equipmentName:
            "Máy phát điện Denyo 45kVA",

        equipmentImageUrl: "",

        branch: "Chi nhánh Hà Nội",

        title:
            "Máy phát điện không khởi động",

        description:
            "Máy phát điện không khởi động sau khi mất điện nguồn.",

        priority: "HIGH",

        status: "PROCESSING",

        attachmentCount: 3,

        reportedAt:
            "2026-08-07T09:15:00",

        createdAt:
            "2026-08-07T09:15:00",
    },

    {
        id: "incident-002",

        incidentCode: "SC-2026-0017",

        contractId: "contract-007",
        contractCode: "HD-2026-0007",

        equipmentId: "equipment-002",
        equipmentCode: "EQ-2505-002",
        equipmentName:
            "Xe nâng Heli CPCD30",

        equipmentImageUrl: "",

        branch: "Chi nhánh Hà Nội",

        title:
            "Xe nâng bị giật khi di chuyển",

        description:
            "Xe nâng di chuyển bị giật và có tiếng kêu lạ ở hộp số.",

        priority: "MEDIUM",

        status: "WAITING_RESPONSE",

        attachmentCount: 2,

        reportedAt:
            "2026-08-06T14:32:00",

        createdAt:
            "2026-08-06T14:32:00",
    },

    {
        id: "incident-003",

        incidentCode: "SC-2026-0016",

        contractId: "contract-006",
        contractCode: "HD-2026-0006",

        equipmentId: "equipment-004",
        equipmentCode: "EQ-2505-004",
        equipmentName:
            "Giàn giáo nêm Ringlock",

        equipmentImageUrl: "",

        branch: "Chi nhánh Hà Nội",

        title:
            "Thiếu chốt khóa",

        description:
            "Thiếu chốt khóa tại một số vị trí, đã được thay thế và kiểm tra.",

        priority: "LOW",

        status: "RESOLVED",

        attachmentCount: 1,

        reportedAt:
            "2026-08-05T11:05:00",

        resolvedAt:
            "2026-08-05T15:30:00",

        createdAt:
            "2026-08-05T11:05:00",
    },

    {
        id: "incident-004",

        incidentCode: "SC-2026-0015",

        contractId: "contract-005",
        contractCode: "HD-2026-0005",

        equipmentId: "equipment-001",
        equipmentCode: "EQ-2505-001",
        equipmentName:
            "Máy xúc Komatsu PC200-8",

        equipmentImageUrl: "",

        branch: "Chi nhánh Hà Nội",

        title:
            "Rò dầu thủy lực",

        description:
            "Phát hiện rò dầu thủy lực tại xi lanh tay gầu.",

        priority: "HIGH",

        status: "PROCESSING",

        attachmentCount: 4,

        reportedAt:
            "2026-08-04T16:48:00",

        createdAt:
            "2026-08-04T16:48:00",
    },

    {
        id: "incident-005",

        incidentCode: "SC-2026-0014",

        contractId: "contract-004",
        contractCode: "HD-2026-0004",

        equipmentId: "equipment-005",
        equipmentCode: "EQ-2505-005",
        equipmentName:
            "Xe nâng người Genie S-60",

        equipmentImageUrl: "",

        branch: "Chi nhánh Đà Nẵng",

        title:
            "Cảm biến cảnh báo không ổn định",

        description:
            "Cảm biến cảnh báo tải hiển thị không ổn định trong quá trình sử dụng.",

        priority: "MEDIUM",

        status: "RESOLVED",

        attachmentCount: 2,

        reportedAt:
            "2026-08-02T10:20:00",

        resolvedAt:
            "2026-08-03T09:00:00",

        createdAt:
            "2026-08-02T10:20:00",
    },
];