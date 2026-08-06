import type {
  ManagerQuotation,
} from "@/modules/quotations/types/manager-quotation-approval.types";

export const initialManagerQuotations:
  ManagerQuotation[] = [
    {
      id: "quotation-hn-001",
      organizationId: "org-rentai",
      branchId: "branch-hanoi",
      branchName:
        "Chi nhánh Hà Nội",
      quotationCode:
        "BG-HN-2026-0086",

      customerId: "customer-101",
      customerName:
        "Công ty Sự kiện Ánh Dương",
      customerPhone:
        "0901234567",
      customerEmail:
        "contact@anhduongevent.vn",

      eventName:
        "Hội nghị khách hàng 2026",
      eventLocation:
        "Trung tâm Hội nghị Quốc gia",
      rentalStartDate:
        "2026-08-10",
      rentalEndDate:
        "2026-08-11",
      expiresAt:
        "2026-08-07T17:00:00.000Z",

      status:
        "PENDING_APPROVAL",
      priority: "URGENT",

      subtotal: 43000000,
      discountAmount: 2000000,
      deliveryFee: 2500000,
      taxAmount: 5000000,

      depositType: "PERCENTAGE",
      depositValue: 30,
      depositAmount: 14550000,

      totalAmount: 48500000,

      createdById: "sales-001",
      createdByName:
        "Trần Thị Kinh Doanh",
      createdAt:
        "2026-08-06T02:15:00.000Z",
      note:
        "Khách hàng yêu cầu hoàn tất báo giá trong ngày.",

      lineItems: [
        {
          id: "quotation-item-hn-001",
          equipmentTypeId:
            "equipment-sound-system",
          equipmentName:
            "Hệ thống âm thanh hội trường",
          quantity: 1,
          priceUnit: "DAY",
          rentalDuration: 2,
          unitPrice: 12500000,
          subtotal: 25000000,
        },
        {
          id: "quotation-item-hn-002",
          equipmentTypeId:
            "equipment-led-screen",
          equipmentName:
            "Màn hình LED P3",
          quantity: 12,
          priceUnit: "DAY",
          rentalDuration: 2,
          unitPrice: 750000,
          subtotal: 18000000,
        },
      ],

      approvalHistory: [
        {
          id: "history-hn-001",
          action: "SUBMITTED",
          actorId: "sales-001",
          actorName:
            "Trần Thị Kinh Doanh",
          note:
            "Gửi quản lý duyệt báo giá.",
          createdAt:
            "2026-08-06T02:15:00.000Z",
        },
      ],
    },

    {
      id: "quotation-hn-002",
      organizationId: "org-rentai",
      branchId: "branch-hanoi",
      branchName:
        "Chi nhánh Hà Nội",
      quotationCode:
        "BG-HN-2026-0084",

      customerId: "customer-102",
      customerName:
        "Công ty Truyền thông Sao Việt",
      customerPhone:
        "0912233445",
      customerEmail:
        "booking@saovietmedia.vn",

      eventName:
        "Lễ ra mắt sản phẩm mới",
      eventLocation:
        "Khách sạn Grand Plaza Hà Nội",
      rentalStartDate:
        "2026-08-12",
      rentalEndDate:
        "2026-08-12",
      expiresAt:
        "2026-08-09T17:00:00.000Z",

      status:
        "PENDING_APPROVAL",
      priority: "HIGH",

      subtotal: 31200000,
      discountAmount: 1200000,
      deliveryFee: 1800000,
      taxAmount: 3180000,

      depositType: "FIXED",
      depositValue: 10000000,
      depositAmount: 10000000,

      totalAmount: 34980000,

      createdById: "sales-001",
      createdByName:
        "Trần Thị Kinh Doanh",
      createdAt:
        "2026-08-05T08:30:00.000Z",
      note: null,

      lineItems: [
        {
          id: "quotation-item-hn-003",
          equipmentTypeId:
            "equipment-lighting",
          equipmentName:
            "Bộ ánh sáng sân khấu",
          quantity: 1,
          priceUnit: "DAY",
          rentalDuration: 1,
          unitPrice: 16800000,
          subtotal: 16800000,
        },
        {
          id: "quotation-item-hn-004",
          equipmentTypeId:
            "equipment-stage",
          equipmentName:
            "Sân khấu lắp ghép",
          quantity: 24,
          priceUnit: "DAY",
          rentalDuration: 1,
          unitPrice: 600000,
          subtotal: 14400000,
        },
      ],

      approvalHistory: [
        {
          id: "history-hn-002",
          action: "SUBMITTED",
          actorId: "sales-001",
          actorName:
            "Trần Thị Kinh Doanh",
          note: null,
          createdAt:
            "2026-08-05T08:30:00.000Z",
        },
      ],
    },

    {
      id: "quotation-hn-003",
      organizationId: "org-rentai",
      branchId: "branch-hanoi",
      branchName:
        "Chi nhánh Hà Nội",
      quotationCode:
        "BG-HN-2026-0081",

      customerId: "customer-103",
      customerName:
        "Trung tâm Hội nghị Hà Nội",
      customerPhone:
        "02437654321",
      customerEmail:
        "event@hanoicenter.vn",

      eventName:
        "Hội thảo chuyển đổi số",
      eventLocation:
        "Cung Trí thức Hà Nội",
      rentalStartDate:
        "2026-08-09",
      rentalEndDate:
        "2026-08-09",
      expiresAt:
        "2026-08-06T10:00:00.000Z",

      status: "APPROVED",
      priority: "NORMAL",

      subtotal: 22000000,
      discountAmount: 1000000,
      deliveryFee: 1200000,
      taxAmount: 2220000,

      depositType: "PERCENTAGE",
      depositValue: 20,
      depositAmount: 4884000,

      totalAmount: 24420000,

      createdById: "sales-001",
      createdByName:
        "Trần Thị Kinh Doanh",
      createdAt:
        "2026-08-04T03:30:00.000Z",
      note: null,

      lineItems: [
        {
          id: "quotation-item-hn-005",
          equipmentTypeId:
            "equipment-projector",
          equipmentName:
            "Máy chiếu hội nghị",
          quantity: 4,
          priceUnit: "DAY",
          rentalDuration: 1,
          unitPrice: 2500000,
          subtotal: 10000000,
        },
        {
          id: "quotation-item-hn-006",
          equipmentTypeId:
            "equipment-conference-mic",
          equipmentName:
            "Micro hội nghị không dây",
          quantity: 12,
          priceUnit: "DAY",
          rentalDuration: 1,
          unitPrice: 1000000,
          subtotal: 12000000,
        },
      ],

      approvalHistory: [
        {
          id: "history-hn-003",
          action: "SUBMITTED",
          actorId: "sales-001",
          actorName:
            "Trần Thị Kinh Doanh",
          note: null,
          createdAt:
            "2026-08-04T03:30:00.000Z",
        },
        {
          id: "history-hn-004",
          action: "APPROVED",
          actorId: "manager-001",
          actorName:
            "Nguyễn Văn Quản Lý",
          note:
            "Đã kiểm tra giá và số lượng thiết bị.",
          createdAt:
            "2026-08-06T01:30:00.000Z",
        },
      ],
    },

    {
      id: "quotation-hcm-001",
      organizationId: "org-rentai",
      branchId: "branch-hcm",
      branchName:
        "Chi nhánh TP. Hồ Chí Minh",
      quotationCode:
        "BG-HCM-2026-0048",

      customerId: "customer-201",
      customerName:
        "Công ty Truyền thông Phương Nam",
      customerPhone:
        "0938123456",
      customerEmail:
        "booking@phuongnam.vn",

      eventName:
        "Triển lãm thương mại",
      eventLocation:
        "SECC TP. Hồ Chí Minh",
      rentalStartDate:
        "2026-08-15",
      rentalEndDate:
        "2026-08-17",
      expiresAt:
        "2026-08-08T17:00:00.000Z",

      status:
        "PENDING_APPROVAL",
      priority: "HIGH",

      subtotal: 58000000,
      discountAmount: 3000000,
      deliveryFee: 3500000,
      taxAmount: 5850000,

      depositType: "PERCENTAGE",
      depositValue: 30,
      depositAmount: 19305000,

      totalAmount: 64350000,

      createdById: "sales-hcm-001",
      createdByName:
        "Nguyễn Thị Thanh",
      createdAt:
        "2026-08-05T07:45:00.000Z",
      note:
        "Sự kiện kéo dài ba ngày.",

      lineItems: [
        {
          id: "quotation-item-hcm-001",
          equipmentTypeId:
            "equipment-booth",
          equipmentName:
            "Gian hàng triển lãm tiêu chuẩn",
          quantity: 10,
          priceUnit: "DAY",
          rentalDuration: 3,
          unitPrice: 1200000,
          subtotal: 36000000,
        },
        {
          id: "quotation-item-hcm-002",
          equipmentTypeId:
            "equipment-led-screen",
          equipmentName:
            "Màn hình LED P3",
          quantity: 10,
          priceUnit: "DAY",
          rentalDuration: 3,
          unitPrice: 733333,
          subtotal: 22000000,
        },
      ],

      approvalHistory: [
        {
          id: "history-hcm-001",
          action: "SUBMITTED",
          actorId:
            "sales-hcm-001",
          actorName:
            "Nguyễn Thị Thanh",
          note:
            "Gửi quản lý duyệt.",
          createdAt:
            "2026-08-05T07:45:00.000Z",
        },
      ],
    },

    {
      id: "quotation-hcm-002",
      organizationId: "org-rentai",
      branchId: "branch-hcm",
      branchName:
        "Chi nhánh TP. Hồ Chí Minh",
      quotationCode:
        "BG-HCM-2026-0045",

      customerId: "customer-202",
      customerName:
        "Khách sạn Sài Gòn Central",
      customerPhone:
        "02838223344",
      customerEmail:
        "events@saigoncentral.vn",

      eventName:
        "Tiệc tri ân khách hàng",
      eventLocation:
        "Khách sạn Sài Gòn Central",
      rentalStartDate:
        "2026-08-11",
      rentalEndDate:
        "2026-08-11",
      expiresAt:
        "2026-08-07T10:00:00.000Z",

      status: "REJECTED",
      priority: "NORMAL",

      subtotal: 27500000,
      discountAmount: 0,
      deliveryFee: 1500000,
      taxAmount: 2900000,

      depositType: "FIXED",
      depositValue: 8000000,
      depositAmount: 8000000,

      totalAmount: 31900000,

      createdById: "sales-hcm-001",
      createdByName:
        "Nguyễn Thị Thanh",
      createdAt:
        "2026-08-04T06:10:00.000Z",
      note: null,

      lineItems: [
        {
          id: "quotation-item-hcm-003",
          equipmentTypeId:
            "equipment-sound-system",
          equipmentName:
            "Hệ thống âm thanh tiệc",
          quantity: 1,
          priceUnit: "DAY",
          rentalDuration: 1,
          unitPrice: 19500000,
          subtotal: 19500000,
        },
        {
          id: "quotation-item-hcm-004",
          equipmentTypeId:
            "equipment-lighting",
          equipmentName:
            "Bộ ánh sáng trang trí",
          quantity: 1,
          priceUnit: "DAY",
          rentalDuration: 1,
          unitPrice: 8000000,
          subtotal: 8000000,
        },
      ],

      approvalHistory: [
        {
          id: "history-hcm-002",
          action: "SUBMITTED",
          actorId:
            "sales-hcm-001",
          actorName:
            "Nguyễn Thị Thanh",
          note: null,
          createdAt:
            "2026-08-04T06:10:00.000Z",
        },
        {
          id: "history-hcm-003",
          action: "REJECTED",
          actorId: "manager-001",
          actorName:
            "Nguyễn Văn Quản Lý",
          note:
            "Đơn giá ánh sáng cao hơn bảng giá đang áp dụng.",
          createdAt:
            "2026-08-06T02:20:00.000Z",
        },
      ],
    },

    {
      id: "quotation-dn-001",
      organizationId: "org-rentai",
      branchId: "branch-danang",
      branchName:
        "Chi nhánh Đà Nẵng",
      quotationCode:
        "BG-DN-2026-0019",

      customerId: "customer-301",
      customerName:
        "Công ty Du lịch Miền Trung",
      customerPhone:
        "0905123456",
      customerEmail:
        "event@mientravel.vn",

      eventName:
        "Hội nghị đối tác du lịch",
      eventLocation:
        "Furama Resort Đà Nẵng",
      rentalStartDate:
        "2026-08-13",
      rentalEndDate:
        "2026-08-14",
      expiresAt:
        "2026-08-09T17:00:00.000Z",

      status:
        "PENDING_APPROVAL",
      priority: "NORMAL",

      subtotal: 26000000,
      discountAmount: 1000000,
      deliveryFee: 1200000,
      taxAmount: 2620000,

      depositType: "PERCENTAGE",
      depositValue: 25,
      depositAmount: 7205000,

      totalAmount: 28820000,

      createdById: "sales-dn-001",
      createdByName:
        "Lê Thị Minh Trang",
      createdAt:
        "2026-08-05T09:20:00.000Z",
      note: null,

      lineItems: [
        {
          id: "quotation-item-dn-001",
          equipmentTypeId:
            "equipment-led-screen",
          equipmentName:
            "Màn hình LED ngoài trời",
          quantity: 8,
          priceUnit: "DAY",
          rentalDuration: 2,
          unitPrice: 1000000,
          subtotal: 16000000,
        },
        {
          id: "quotation-item-dn-002",
          equipmentTypeId:
            "equipment-sound-system",
          equipmentName:
            "Hệ thống âm thanh sự kiện",
          quantity: 1,
          priceUnit: "DAY",
          rentalDuration: 2,
          unitPrice: 5000000,
          subtotal: 10000000,
        },
      ],

      approvalHistory: [
        {
          id: "history-dn-001",
          action: "SUBMITTED",
          actorId:
            "sales-dn-001",
          actorName:
            "Lê Thị Minh Trang",
          note: null,
          createdAt:
            "2026-08-05T09:20:00.000Z",
        },
      ],
    },
  ];
