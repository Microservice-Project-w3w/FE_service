import type {
  ManagerRental,
} from "@/modules/rentals/types/manager-rental.types";

export const MANAGER_RENTAL_BRANCH_IDS = {
  HANOI: "branch-hanoi",
  HO_CHI_MINH: "branch-hcm",
  DA_NANG: "branch-danang",
} as const;

const ORGANIZATION_ID =
  "organization-rentai";

export const managerRentalMockData: ManagerRental[] = [
  {
    id: "rental-hn-00081",
    organizationId: ORGANIZATION_ID,
    branchId:
      MANAGER_RENTAL_BRANCH_IDS.HANOI,
    branchName: "Chi nhánh Hà Nội",

    rentalCode: "DT-HN-2026-0081",
    quotationId: "quotation-hn-0068",
    quotationCode: "BG-HN-2026-0068",
    contractId: "contract-hn-0068",
    contractCode: "HD-HN-2026-0068",

    customerId: "customer-hn-001",
    customerName:
      "Công ty TNHH Sự kiện Minh Anh",
    customerPhone: "0901234567",
    customerEmail:
      "minhanhevent@gmail.com",

    eventName:
      "Hội nghị khách hàng mùa thu",
    eventLocation:
      "Trung tâm Hội nghị Quốc gia, Hà Nội",

    rentalStartDate:
      "2026-08-05T08:00:00+07:00",
    rentalEndDate:
      "2026-08-08T18:00:00+07:00",
    expectedReturnDate:
      "2026-08-08T20:00:00+07:00",
    actualReturnDate: null,

    status: "ACTIVE",
    priority: "HIGH",

    reservationStatus: "HELD",
    reservationExpiresAt: null,

    paymentStatus:
      "PARTIALLY_PAID",

    equipmentSubtotal: 28_000_000,
    discountAmount: 1_500_000,
    deliveryFee: 1_200_000,
    lateFee: 0,
    taxAmount: 2_770_000,
    totalAmount: 30_470_000,

    depositAmount: 9_000_000,
    paidAmount: 18_000_000,
    outstandingAmount: 12_470_000,

    deliveryRequired: true,
    extensionCount: 0,

    createdById: "sales-hn-001",
    createdByName: "Nguyễn Hoàng Nam",
    createdAt:
      "2026-07-29T09:15:00+07:00",
    note:
      "Khách hàng yêu cầu giao thiết bị trước 2 giờ.",

    equipmentItems: [
      {
        id: "rental-item-hn-081-01",
        equipmentTypeId:
          "equipment-sound-system",
        equipmentName:
          "Bộ âm thanh hội trường",
        requestedQuantity: 2,
        allocatedQuantity: 2,
        deliveredQuantity: 2,
        unitPrice: 3_500_000,
        rentalDays: 4,
        subtotal: 28_000_000,
      },
    ],

    history: [
      {
        id: "history-hn-081-01",
        action: "CREATED",
        actorId: "sales-hn-001",
        actorName: "Nguyễn Hoàng Nam",
        note: "Tạo đơn từ báo giá đã duyệt.",
        createdAt:
          "2026-07-29T09:15:00+07:00",
      },
      {
        id: "history-hn-081-02",
        action: "RESERVED",
        actorId: "operations-hn-001",
        actorName: "Trần Văn Hải",
        note: "Đã giữ đủ số lượng thiết bị.",
        createdAt:
          "2026-07-29T10:30:00+07:00",
      },
      {
        id: "history-hn-081-03",
        action: "CONFIRMED",
        actorId: "manager-hn-001",
        actorName: "Lê Thu Trang",
        note: "Xác nhận đơn thuê.",
        createdAt:
          "2026-07-30T08:20:00+07:00",
      },
      {
        id: "history-hn-081-04",
        action: "STARTED",
        actorId: "operations-hn-001",
        actorName: "Trần Văn Hải",
        note: "Đã giao thiết bị cho khách hàng.",
        createdAt:
          "2026-08-05T08:00:00+07:00",
      },
    ],
  },

  {
    id: "rental-hn-00079",
    organizationId: ORGANIZATION_ID,
    branchId:
      MANAGER_RENTAL_BRANCH_IDS.HANOI,
    branchName: "Chi nhánh Hà Nội",

    rentalCode: "DT-HN-2026-0079",
    quotationId: "quotation-hn-0065",
    quotationCode: "BG-HN-2026-0065",
    contractId: "contract-hn-0065",
    contractCode: "HD-HN-2026-0065",

    customerId: "customer-hn-004",
    customerName:
      "Công ty Cổ phần Truyền thông Ánh Dương",
    customerPhone: "0912345678",
    customerEmail:
      "anhduongmedia@gmail.com",

    eventName:
      "Lễ ra mắt sản phẩm mới",
    eventLocation:
      "Khách sạn Daewoo, Hà Nội",

    rentalStartDate:
      "2026-08-01T07:00:00+07:00",
    rentalEndDate:
      "2026-08-04T18:00:00+07:00",
    expectedReturnDate:
      "2026-08-04T21:00:00+07:00",
    actualReturnDate: null,

    status: "OVERDUE",
    priority: "URGENT",

    reservationStatus: "HELD",
    reservationExpiresAt: null,

    paymentStatus: "OVERDUE",

    equipmentSubtotal: 18_000_000,
    discountAmount: 0,
    deliveryFee: 900_000,
    lateFee: 1_800_000,
    taxAmount: 2_070_000,
    totalAmount: 22_770_000,

    depositAmount: 7_000_000,
    paidAmount: 10_000_000,
    outstandingAmount: 12_770_000,

    deliveryRequired: true,
    extensionCount: 1,

    createdById: "sales-hn-002",
    createdByName: "Phạm Minh Tú",
    createdAt:
      "2026-07-25T14:30:00+07:00",
    note:
      "Khách hàng chưa xác nhận thời gian hoàn trả.",

    equipmentItems: [
      {
        id: "rental-item-hn-079-01",
        equipmentTypeId:
          "equipment-led-screen",
        equipmentName:
          "Màn hình LED sân khấu P3",
        requestedQuantity: 12,
        allocatedQuantity: 12,
        deliveredQuantity: 12,
        unitPrice: 500_000,
        rentalDays: 3,
        subtotal: 18_000_000,
      },
    ],

    history: [
      {
        id: "history-hn-079-01",
        action: "CREATED",
        actorId: "sales-hn-002",
        actorName: "Phạm Minh Tú",
        note: "Tạo đơn thuê.",
        createdAt:
          "2026-07-25T14:30:00+07:00",
      },
      {
        id: "history-hn-079-02",
        action: "CONFIRMED",
        actorId: "manager-hn-001",
        actorName: "Lê Thu Trang",
        note: "Đã xác nhận đơn thuê.",
        createdAt:
          "2026-07-26T09:00:00+07:00",
      },
      {
        id: "history-hn-079-03",
        action: "STARTED",
        actorId: "operations-hn-002",
        actorName: "Nguyễn Đức Anh",
        note: "Đã bàn giao đủ thiết bị.",
        createdAt:
          "2026-08-01T07:00:00+07:00",
      },
      {
        id: "history-hn-079-04",
        action: "EXTENDED",
        actorId: "manager-hn-001",
        actorName: "Lê Thu Trang",
        note:
          "Gia hạn thêm một ngày theo yêu cầu khách hàng.",
        createdAt:
          "2026-08-03T16:10:00+07:00",
      },
    ],
  },

  {
    id: "rental-hn-00082",
    organizationId: ORGANIZATION_ID,
    branchId:
      MANAGER_RENTAL_BRANCH_IDS.HANOI,
    branchName: "Chi nhánh Hà Nội",

    rentalCode: "DT-HN-2026-0082",
    quotationId: "quotation-hn-0070",
    quotationCode: "BG-HN-2026-0070",
    contractId: null,
    contractCode: null,

    customerId: "customer-hn-006",
    customerName:
      "Công ty TNHH Giáo dục Hướng Dương",
    customerPhone: "0988123456",
    customerEmail:
      "huongduongedu@gmail.com",

    eventName:
      "Ngày hội định hướng sinh viên",
    eventLocation:
      "Đại học Quốc gia Hà Nội",

    rentalStartDate:
      "2026-08-10T06:00:00+07:00",
    rentalEndDate:
      "2026-08-11T20:00:00+07:00",
    expectedReturnDate:
      "2026-08-11T22:00:00+07:00",
    actualReturnDate: null,

    status: "RESERVED",
    priority: "NORMAL",

    reservationStatus: "HELD",
    reservationExpiresAt:
      "2026-08-08T17:00:00+07:00",

    paymentStatus:
      "PARTIALLY_PAID",

    equipmentSubtotal: 14_000_000,
    discountAmount: 700_000,
    deliveryFee: 600_000,
    lateFee: 0,
    taxAmount: 1_390_000,
    totalAmount: 15_290_000,

    depositAmount: 5_000_000,
    paidAmount: 5_000_000,
    outstandingAmount: 10_290_000,

    deliveryRequired: true,
    extensionCount: 0,

    createdById: "sales-hn-001",
    createdByName: "Nguyễn Hoàng Nam",
    createdAt:
      "2026-08-06T10:20:00+07:00",
    note:
      "Đang chờ hoàn tất hợp đồng.",

    equipmentItems: [
      {
        id: "rental-item-hn-082-01",
        equipmentTypeId:
          "equipment-tent",
        equipmentName:
          "Nhà bạt sự kiện 5x10m",
        requestedQuantity: 2,
        allocatedQuantity: 2,
        deliveredQuantity: 0,
        unitPrice: 3_500_000,
        rentalDays: 2,
        subtotal: 14_000_000,
      },
    ],

    history: [
      {
        id: "history-hn-082-01",
        action: "CREATED",
        actorId: "sales-hn-001",
        actorName: "Nguyễn Hoàng Nam",
        note: "Tạo đơn từ báo giá.",
        createdAt:
          "2026-08-06T10:20:00+07:00",
      },
      {
        id: "history-hn-082-02",
        action: "RESERVED",
        actorId: "operations-hn-001",
        actorName: "Trần Văn Hải",
        note:
          "Đã giữ chỗ thiết bị đến ngày 08/08/2026.",
        createdAt:
          "2026-08-06T11:15:00+07:00",
      },
    ],
  },

  {
    id: "rental-hcm-00047",
    organizationId: ORGANIZATION_ID,
    branchId:
      MANAGER_RENTAL_BRANCH_IDS
        .HO_CHI_MINH,
    branchName:
      "Chi nhánh TP. Hồ Chí Minh",

    rentalCode: "DT-HCM-2026-0047",
    quotationId: "quotation-hcm-0048",
    quotationCode: "BG-HCM-2026-0048",
    contractId: null,
    contractCode: null,

    customerId: "customer-hcm-003",
    customerName:
      "Công ty Cổ phần Công nghệ Nova",
    customerPhone: "0938123456",
    customerEmail:
      "novatech@gmail.com",

    eventName:
      "Triển lãm công nghệ tương lai",
    eventLocation:
      "SECC, Quận 7, TP. Hồ Chí Minh",

    rentalStartDate:
      "2026-08-15T07:00:00+07:00",
    rentalEndDate:
      "2026-08-17T21:00:00+07:00",
    expectedReturnDate:
      "2026-08-18T00:00:00+07:00",
    actualReturnDate: null,

    status: "PENDING_CONFIRMATION",
    priority: "HIGH",

    reservationStatus: "PENDING",
    reservationExpiresAt:
      "2026-08-09T17:30:00+07:00",

    paymentStatus: "UNPAID",

    equipmentSubtotal: 37_500_000,
    discountAmount: 2_000_000,
    deliveryFee: 1_500_000,
    lateFee: 0,
    taxAmount: 3_700_000,
    totalAmount: 40_700_000,

    depositAmount: 12_000_000,
    paidAmount: 0,
    outstandingAmount: 40_700_000,

    deliveryRequired: true,
    extensionCount: 0,

    createdById: "sales-hcm-001",
    createdByName: "Trần Ngọc Mai",
    createdAt:
      "2026-08-06T15:45:00+07:00",
    note:
      "Đơn có giá trị cao, cần quản lý xác nhận.",

    equipmentItems: [
      {
        id: "rental-item-hcm-047-01",
        equipmentTypeId:
          "equipment-led-screen",
        equipmentName:
          "Màn hình LED P2.5",
        requestedQuantity: 15,
        allocatedQuantity: 0,
        deliveredQuantity: 0,
        unitPrice: 700_000,
        rentalDays: 3,
        subtotal: 31_500_000,
      },
      {
        id: "rental-item-hcm-047-02",
        equipmentTypeId:
          "equipment-lighting",
        equipmentName:
          "Bộ đèn sân khấu Beam 350",
        requestedQuantity: 10,
        allocatedQuantity: 0,
        deliveredQuantity: 0,
        unitPrice: 200_000,
        rentalDays: 3,
        subtotal: 6_000_000,
      },
    ],

    history: [
      {
        id: "history-hcm-047-01",
        action: "CREATED",
        actorId: "sales-hcm-001",
        actorName: "Trần Ngọc Mai",
        note:
          "Tạo đơn thuê từ báo giá BG-HCM-2026-0048.",
        createdAt:
          "2026-08-06T15:45:00+07:00",
      },
    ],
  },

  {
    id: "rental-hcm-00045",
    organizationId: ORGANIZATION_ID,
    branchId:
      MANAGER_RENTAL_BRANCH_IDS
        .HO_CHI_MINH,
    branchName:
      "Chi nhánh TP. Hồ Chí Minh",

    rentalCode: "DT-HCM-2026-0045",
    quotationId: "quotation-hcm-0039",
    quotationCode: "BG-HCM-2026-0039",
    contractId: "contract-hcm-0039",
    contractCode: "HD-HCM-2026-0039",

    customerId: "customer-hcm-001",
    customerName:
      "Công ty TNHH Tổ chức Sự kiện Sài Thành",
    customerPhone: "0909123456",
    customerEmail:
      "saithanhevent@gmail.com",

    eventName:
      "Đêm nhạc doanh nghiệp 2026",
    eventLocation:
      "Nhà thi đấu Phú Thọ, TP. Hồ Chí Minh",

    rentalStartDate:
      "2026-08-09T10:00:00+07:00",
    rentalEndDate:
      "2026-08-10T23:00:00+07:00",
    expectedReturnDate:
      "2026-08-11T02:00:00+07:00",
    actualReturnDate: null,

    status: "CONFIRMED",
    priority: "URGENT",

    reservationStatus: "HELD",
    reservationExpiresAt: null,

    paymentStatus:
      "PARTIALLY_PAID",

    equipmentSubtotal: 58_500_000,
    discountAmount: 3_000_000,
    deliveryFee: 2_000_000,
    lateFee: 0,
    taxAmount: 5_750_000,
    totalAmount: 63_250_000,

    depositAmount: 20_000_000,
    paidAmount: 30_000_000,
    outstandingAmount: 33_250_000,

    deliveryRequired: true,
    extensionCount: 0,

    createdById: "sales-hcm-002",
    createdByName: "Lê Thành Công",
    createdAt:
      "2026-08-01T08:40:00+07:00",
    note:
      "Ưu tiên chuẩn bị thiết bị trước ngày 08/08.",

    equipmentItems: [
      {
        id: "rental-item-hcm-045-01",
        equipmentTypeId:
          "equipment-sound-system",
        equipmentName:
          "Hệ thống âm thanh Line Array",
        requestedQuantity: 3,
        allocatedQuantity: 3,
        deliveredQuantity: 0,
        unitPrice: 6_500_000,
        rentalDays: 2,
        subtotal: 39_000_000,
      },
      {
        id: "rental-item-hcm-045-02",
        equipmentTypeId:
          "equipment-stage",
        equipmentName:
          "Sân khấu lắp ghép 12x8m",
        requestedQuantity: 1,
        allocatedQuantity: 1,
        deliveredQuantity: 0,
        unitPrice: 9_750_000,
        rentalDays: 2,
        subtotal: 19_500_000,
      },
    ],

    history: [
      {
        id: "history-hcm-045-01",
        action: "CREATED",
        actorId: "sales-hcm-002",
        actorName: "Lê Thành Công",
        note: "Tạo đơn thuê.",
        createdAt:
          "2026-08-01T08:40:00+07:00",
      },
      {
        id: "history-hcm-045-02",
        action: "RESERVED",
        actorId: "operations-hcm-001",
        actorName: "Võ Minh Khang",
        note: "Đã giữ đủ thiết bị.",
        createdAt:
          "2026-08-01T10:00:00+07:00",
      },
      {
        id: "history-hcm-045-03",
        action: "CONFIRMED",
        actorId: "manager-hcm-001",
        actorName: "Phan Thùy Linh",
        note: "Đã xác nhận triển khai đơn thuê.",
        createdAt:
          "2026-08-02T09:10:00+07:00",
      },
    ],
  },

  {
    id: "rental-hcm-00043",
    organizationId: ORGANIZATION_ID,
    branchId:
      MANAGER_RENTAL_BRANCH_IDS
        .HO_CHI_MINH,
    branchName:
      "Chi nhánh TP. Hồ Chí Minh",

    rentalCode: "DT-HCM-2026-0043",
    quotationId: "quotation-hcm-0036",
    quotationCode: "BG-HCM-2026-0036",
    contractId: "contract-hcm-0036",
    contractCode: "HD-HCM-2026-0036",

    customerId: "customer-hcm-005",
    customerName:
      "Trường Đại học Kinh tế TP.HCM",
    customerPhone: "02838295299",
    customerEmail:
      "event@ueh.edu.vn",

    eventName:
      "Lễ tốt nghiệp khóa 48",
    eventLocation:
      "Cơ sở Nguyễn Văn Linh, TP.HCM",

    rentalStartDate:
      "2026-08-06T06:00:00+07:00",
    rentalEndDate:
      "2026-08-07T17:00:00+07:00",
    expectedReturnDate:
      "2026-08-07T20:00:00+07:00",
    actualReturnDate: null,

    status: "RETURNING",
    priority: "HIGH",

    reservationStatus: "HELD",
    reservationExpiresAt: null,

    paymentStatus: "PAID",

    equipmentSubtotal: 16_000_000,
    discountAmount: 1_000_000,
    deliveryFee: 800_000,
    lateFee: 0,
    taxAmount: 1_580_000,
    totalAmount: 17_380_000,

    depositAmount: 5_000_000,
    paidAmount: 17_380_000,
    outstandingAmount: 0,

    deliveryRequired: true,
    extensionCount: 0,

    createdById: "sales-hcm-001",
    createdByName: "Trần Ngọc Mai",
    createdAt:
      "2026-07-30T11:25:00+07:00",
    note:
      "Đội vận hành đang thu hồi thiết bị.",

    equipmentItems: [
      {
        id: "rental-item-hcm-043-01",
        equipmentTypeId:
          "equipment-chair",
        equipmentName:
          "Ghế sự kiện bọc nệm",
        requestedQuantity: 400,
        allocatedQuantity: 400,
        deliveredQuantity: 400,
        unitPrice: 20_000,
        rentalDays: 2,
        subtotal: 16_000_000,
      },
    ],

    history: [
      {
        id: "history-hcm-043-01",
        action: "CREATED",
        actorId: "sales-hcm-001",
        actorName: "Trần Ngọc Mai",
        note: "Tạo đơn thuê.",
        createdAt:
          "2026-07-30T11:25:00+07:00",
      },
      {
        id: "history-hcm-043-02",
        action: "CONFIRMED",
        actorId: "manager-hcm-001",
        actorName: "Phan Thùy Linh",
        note: "Xác nhận đơn thuê.",
        createdAt:
          "2026-07-31T08:30:00+07:00",
      },
      {
        id: "history-hcm-043-03",
        action: "STARTED",
        actorId: "operations-hcm-001",
        actorName: "Võ Minh Khang",
        note: "Đã bàn giao thiết bị.",
        createdAt:
          "2026-08-06T06:00:00+07:00",
      },
      {
        id: "history-hcm-043-04",
        action: "RETURN_REQUESTED",
        actorId: "operations-hcm-001",
        actorName: "Võ Minh Khang",
        note:
          "Bắt đầu kiểm đếm và thu hồi thiết bị.",
        createdAt:
          "2026-08-07T17:15:00+07:00",
      },
    ],
  },

  {
    id: "rental-dn-00021",
    organizationId: ORGANIZATION_ID,
    branchId:
      MANAGER_RENTAL_BRANCH_IDS.DA_NANG,
    branchName: "Chi nhánh Đà Nẵng",

    rentalCode: "DT-DN-2026-0021",
    quotationId: "quotation-dn-0016",
    quotationCode: "BG-DN-2026-0016",
    contractId: "contract-dn-0016",
    contractCode: "HD-DN-2026-0016",

    customerId: "customer-dn-001",
    customerName:
      "Công ty TNHH Du lịch Biển Xanh",
    customerPhone: "0905123456",
    customerEmail:
      "bienxanhtravel@gmail.com",

    eventName:
      "Gala Dinner Biển Xanh 2026",
    eventLocation:
      "Bãi biển Mỹ Khê, Đà Nẵng",

    rentalStartDate:
      "2026-08-07T15:00:00+07:00",
    rentalEndDate:
      "2026-08-08T23:00:00+07:00",
    expectedReturnDate:
      "2026-08-09T02:00:00+07:00",
    actualReturnDate: null,

    status: "ACTIVE",
    priority: "NORMAL",

    reservationStatus: "HELD",
    reservationExpiresAt: null,

    paymentStatus:
      "PARTIALLY_PAID",

    equipmentSubtotal: 25_000_000,
    discountAmount: 1_500_000,
    deliveryFee: 1_000_000,
    lateFee: 0,
    taxAmount: 2_450_000,
    totalAmount: 26_950_000,

    depositAmount: 8_000_000,
    paidAmount: 15_000_000,
    outstandingAmount: 11_950_000,

    deliveryRequired: true,
    extensionCount: 0,

    createdById: "sales-dn-001",
    createdByName: "Hoàng Minh Phúc",
    createdAt:
      "2026-08-02T13:15:00+07:00",
    note:
      "Theo dõi thời tiết trước giờ lắp đặt.",

    equipmentItems: [
      {
        id: "rental-item-dn-021-01",
        equipmentTypeId:
          "equipment-tent",
        equipmentName:
          "Nhà bạt không gian 10x20m",
        requestedQuantity: 1,
        allocatedQuantity: 1,
        deliveredQuantity: 1,
        unitPrice: 7_500_000,
        rentalDays: 2,
        subtotal: 15_000_000,
      },
      {
        id: "rental-item-dn-021-02",
        equipmentTypeId:
          "equipment-lighting",
        equipmentName:
          "Bộ chiếu sáng ngoài trời",
        requestedQuantity: 10,
        allocatedQuantity: 10,
        deliveredQuantity: 10,
        unitPrice: 500_000,
        rentalDays: 2,
        subtotal: 10_000_000,
      },
    ],

    history: [
      {
        id: "history-dn-021-01",
        action: "CREATED",
        actorId: "sales-dn-001",
        actorName: "Hoàng Minh Phúc",
        note: "Tạo đơn thuê.",
        createdAt:
          "2026-08-02T13:15:00+07:00",
      },
      {
        id: "history-dn-021-02",
        action: "RESERVED",
        actorId: "operations-dn-001",
        actorName: "Nguyễn Quốc Bảo",
        note: "Đã giữ đủ thiết bị.",
        createdAt:
          "2026-08-02T14:20:00+07:00",
      },
      {
        id: "history-dn-021-03",
        action: "STARTED",
        actorId: "operations-dn-001",
        actorName: "Nguyễn Quốc Bảo",
        note: "Đã bàn giao tại địa điểm tổ chức.",
        createdAt:
          "2026-08-07T15:00:00+07:00",
      },
    ],
  },

  {
    id: "rental-dn-00019",
    organizationId: ORGANIZATION_ID,
    branchId:
      MANAGER_RENTAL_BRANCH_IDS.DA_NANG,
    branchName: "Chi nhánh Đà Nẵng",

    rentalCode: "DT-DN-2026-0019",
    quotationId: "quotation-dn-0014",
    quotationCode: "BG-DN-2026-0014",
    contractId: "contract-dn-0014",
    contractCode: "HD-DN-2026-0014",

    customerId: "customer-dn-004",
    customerName:
      "Công ty Cổ phần Xây dựng Miền Trung",
    customerPhone: "0915123456",
    customerEmail:
      "mientrungconstruction@gmail.com",

    eventName:
      "Lễ khởi công dự án ven biển",
    eventLocation:
      "Quận Ngũ Hành Sơn, Đà Nẵng",

    rentalStartDate:
      "2026-07-28T05:00:00+07:00",
    rentalEndDate:
      "2026-07-28T18:00:00+07:00",
    expectedReturnDate:
      "2026-07-28T21:00:00+07:00",
    actualReturnDate:
      "2026-07-28T20:10:00+07:00",

    status: "COMPLETED",
    priority: "NORMAL",

    reservationStatus: "RELEASED",
    reservationExpiresAt: null,

    paymentStatus: "PAID",

    equipmentSubtotal: 11_000_000,
    discountAmount: 500_000,
    deliveryFee: 500_000,
    lateFee: 0,
    taxAmount: 1_100_000,
    totalAmount: 12_100_000,

    depositAmount: 4_000_000,
    paidAmount: 12_100_000,
    outstandingAmount: 0,

    deliveryRequired: true,
    extensionCount: 0,

    createdById: "sales-dn-001",
    createdByName: "Hoàng Minh Phúc",
    createdAt:
      "2026-07-20T09:00:00+07:00",
    note:
      "Đơn đã hoàn thành và hoàn trả tiền cọc.",

    equipmentItems: [
      {
        id: "rental-item-dn-019-01",
        equipmentTypeId:
          "equipment-stage",
        equipmentName:
          "Sân khấu lắp ghép 8x6m",
        requestedQuantity: 1,
        allocatedQuantity: 1,
        deliveredQuantity: 1,
        unitPrice: 11_000_000,
        rentalDays: 1,
        subtotal: 11_000_000,
      },
    ],

    history: [
      {
        id: "history-dn-019-01",
        action: "CREATED",
        actorId: "sales-dn-001",
        actorName: "Hoàng Minh Phúc",
        note: "Tạo đơn thuê.",
        createdAt:
          "2026-07-20T09:00:00+07:00",
      },
      {
        id: "history-dn-019-02",
        action: "STARTED",
        actorId: "operations-dn-001",
        actorName: "Nguyễn Quốc Bảo",
        note: "Đã giao thiết bị.",
        createdAt:
          "2026-07-28T05:00:00+07:00",
      },
      {
        id: "history-dn-019-03",
        action: "COMPLETED",
        actorId: "operations-dn-001",
        actorName: "Nguyễn Quốc Bảo",
        note:
          "Đã nhận lại đủ thiết bị, không phát sinh hư hỏng.",
        createdAt:
          "2026-07-28T20:15:00+07:00",
      },
    ],
  },

  {
    id: "rental-dn-00018",
    organizationId: ORGANIZATION_ID,
    branchId:
      MANAGER_RENTAL_BRANCH_IDS.DA_NANG,
    branchName: "Chi nhánh Đà Nẵng",

    rentalCode: "DT-DN-2026-0018",
    quotationId: "quotation-dn-0013",
    quotationCode: "BG-DN-2026-0013",
    contractId: null,
    contractCode: null,

    customerId: "customer-dn-006",
    customerName: "Nguyễn Thị Hồng",
    customerPhone: "0975123456",
    customerEmail:
      "nguyenthihong@gmail.com",

    eventName:
      "Tiệc cưới ngoài trời",
    eventLocation:
      "Bán đảo Sơn Trà, Đà Nẵng",

    rentalStartDate:
      "2026-08-03T14:00:00+07:00",
    rentalEndDate:
      "2026-08-03T23:00:00+07:00",
    expectedReturnDate:
      "2026-08-04T01:00:00+07:00",
    actualReturnDate: null,

    status: "CANCELLED",
    priority: "NORMAL",

    reservationStatus: "RELEASED",
    reservationExpiresAt: null,

    paymentStatus: "UNPAID",

    equipmentSubtotal: 8_000_000,
    discountAmount: 0,
    deliveryFee: 500_000,
    lateFee: 0,
    taxAmount: 850_000,
    totalAmount: 9_350_000,

    depositAmount: 3_000_000,
    paidAmount: 0,
    outstandingAmount: 0,

    deliveryRequired: true,
    extensionCount: 0,

    createdById: "sales-dn-001",
    createdByName: "Hoàng Minh Phúc",
    createdAt:
      "2026-07-27T16:30:00+07:00",
    note:
      "Khách hàng hủy do thay đổi địa điểm tổ chức.",

    equipmentItems: [
      {
        id: "rental-item-dn-018-01",
        equipmentTypeId:
          "equipment-decoration",
        equipmentName:
          "Bộ trang trí tiệc cưới ngoài trời",
        requestedQuantity: 1,
        allocatedQuantity: 0,
        deliveredQuantity: 0,
        unitPrice: 8_000_000,
        rentalDays: 1,
        subtotal: 8_000_000,
      },
    ],

    history: [
      {
        id: "history-dn-018-01",
        action: "CREATED",
        actorId: "sales-dn-001",
        actorName: "Hoàng Minh Phúc",
        note: "Tạo đơn thuê.",
        createdAt:
          "2026-07-27T16:30:00+07:00",
      },
      {
        id: "history-dn-018-02",
        action: "CANCELLED",
        actorId: "manager-dn-001",
        actorName: "Đặng Thu Hà",
        note:
          "Khách hàng yêu cầu hủy do thay đổi kế hoạch.",
        createdAt:
          "2026-07-29T10:45:00+07:00",
      },
    ],
  },
];

export const cloneManagerRentalMockData =
  (): ManagerRental[] =>
    structuredClone(
      managerRentalMockData,
    );
