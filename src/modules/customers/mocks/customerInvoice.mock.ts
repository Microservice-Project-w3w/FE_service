import type {
    CustomerInvoiceItem,
} from "../types/customerInvoice.types";

export const CUSTOMER_INVOICE_MOCKS:
    CustomerInvoiceItem[] = [
    {
        id: "inv-001",
        invoiceCode: "INV-2026-0024",

        contractId: "contract-008",
        contractCode: "HD-2026-0008",

        equipmentName:
            "Máy phát điện Denyo 45kVA",
        equipmentCode: "EQ-2505-003",

        branch: "Chi nhánh Hà Nội",

        issuedAt: "2026-08-07",
        dueDate: "2026-08-14",

        subtotal: 16818182,
        taxAmount: 1681818,
        discountAmount: 0,
        totalAmount: 18500000,

        paidAmount: 18500000,
        remainingAmount: 0,

        status: "PAID",

        paymentMethod:
            "Chuyển khoản ngân hàng",

        paidAt:
            "2026-08-07T14:30:00",

        createdAt:
            "2026-08-07T08:00:00",
    },

    {
        id: "inv-002",
        invoiceCode: "INV-2026-0023",

        contractId: "contract-007",
        contractCode: "HD-2026-0007",

        equipmentName:
            "Xe nâng Heli CPCD30",
        equipmentCode: "EQ-2505-002",

        branch: "Chi nhánh Hà Nội",

        issuedAt: "2026-08-05",
        dueDate: "2026-08-12",

        subtotal: 11636364,
        taxAmount: 1163636,
        discountAmount: 0,
        totalAmount: 12800000,

        paidAmount: 0,
        remainingAmount: 12800000,

        status: "PENDING",

        createdAt:
            "2026-08-05T09:00:00",
    },

    {
        id: "inv-003",
        invoiceCode: "INV-2026-0022",

        contractId: "contract-006",
        contractCode: "HD-2026-0006",

        equipmentName:
            "Giàn giáo nêm Ringlock",
        equipmentCode: "EQ-2505-004",

        branch: "Chi nhánh Hà Nội",

        issuedAt: "2026-08-01",
        dueDate: "2026-08-05",

        subtotal: 13636364,
        taxAmount: 1363636,
        discountAmount: 0,
        totalAmount: 15000000,

        paidAmount: 0,
        remainingAmount: 15000000,

        status: "OVERDUE",

        overdueDays: 2,

        createdAt:
            "2026-08-01T08:30:00",
    },

    {
        id: "inv-004",
        invoiceCode: "INV-2026-0021",

        contractId: "contract-005",
        contractCode: "HD-2026-0005",

        equipmentName:
            "Máy xúc Komatsu PC200-8",
        equipmentCode: "EQ-2505-001",

        branch: "Chi nhánh Hà Nội",

        issuedAt: "2026-07-25",
        dueDate: "2026-08-01",

        subtotal: 23272727,
        taxAmount: 2327273,
        discountAmount: 0,
        totalAmount: 25600000,

        paidAmount: 25600000,
        remainingAmount: 0,

        status: "PAID",

        paymentMethod:
            "Chuyển khoản ngân hàng",

        paidAt:
            "2026-07-28T10:15:00",

        createdAt:
            "2026-07-25T09:00:00",
    },

    {
        id: "inv-005",
        invoiceCode: "INV-2026-0020",

        contractId: "contract-004",
        contractCode: "HD-2026-0004",

        equipmentName:
            "Xe nâng người Genie S-60",
        equipmentCode: "EQ-2505-005",

        branch: "Chi nhánh Đà Nẵng",

        issuedAt: "2026-07-20",
        dueDate: "2026-07-27",

        subtotal: 20818182,
        taxAmount: 2081818,
        discountAmount: 0,
        totalAmount: 22900000,

        paidAmount: 0,
        remainingAmount: 22900000,

        status: "PENDING",

        createdAt:
            "2026-07-20T09:30:00",
    },

    {
        id: "inv-006",
        invoiceCode: "INV-2026-0019",

        contractId: "contract-003",
        contractCode: "HD-2026-0003",

        equipmentName:
            "Máy lu Hamm HD75",
        equipmentCode: "EQ-2505-006",

        branch: "Chi nhánh Hà Nội",

        issuedAt: "2026-07-15",
        dueDate: "2026-07-22",

        subtotal: 15354545,
        taxAmount: 1535455,
        discountAmount: 0,
        totalAmount: 16890000,

        paidAmount: 0,
        remainingAmount: 16890000,

        status: "OVERDUE",

        overdueDays: 16,

        createdAt:
            "2026-07-15T08:15:00",
    },
];