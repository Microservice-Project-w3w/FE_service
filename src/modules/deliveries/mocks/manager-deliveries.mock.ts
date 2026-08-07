import type {
  ManagerDeliveryTask,
} from "@/modules/deliveries/types/manager-delivery.types";

export const MANAGER_DELIVERY_BRANCH_IDS = {
  HANOI: "branch-hanoi",

  HO_CHI_MINH: "branch-hcm",

  DA_NANG: "branch-danang",
} as const;

const ORGANIZATION_ID =
  "organization-rentai";

export const managerDeliveryMockData:
  ManagerDeliveryTask[] = [
  {
    id: "delivery-hn-0041",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_DELIVERY_BRANCH_IDS
        .HANOI,

    branchName:
      "Chi nhánh Hà Nội",

    taskCode: "GH-HN-0041",

    type: "DELIVERY",

    rentalId:
      "rental-hn-00082",

    rentalCode:
      "DT-HN-2026-0082",

    contractId: null,
    contractCode: null,

    customerId:
      "customer-hn-006",

    customerName:
      "Công ty TNHH Giáo dục Hướng Dương",

    customerPhone:
      "0988123456",

    customerEmail:
      "huongduongedu@gmail.com",

    eventName:
      "Ngày hội định hướng sinh viên",

    address:
      "Đại học Quốc gia Hà Nội",

    scheduledAt:
      "2026-08-10T14:00:00+07:00",

    startedAt: null,
    arrivedAt: null,
    completedAt: null,

    status: "SCHEDULED",

    priority: "NORMAL",

    assignedEmployeeId:
      "operations-hn-001",

    assignedEmployeeName:
      "Trần Văn Hải",

    assignedEmployeePhone:
      "0903111222",

    vehiclePlate:
      "29C-123.45",

    handoverStatus:
      "PENDING",

    handoverPersonName: null,

    equipmentItemCount: 1,

    totalEquipmentQuantity: 2,

    issueCount: 0,

    equipmentItems: [
      {
        id:
          "delivery-hn-0041-item-01",

        equipmentName:
          "Nhà bạt sự kiện 5x10m",

        quantity: 2,

        checkedQuantity: 0,

        condition: "GOOD",

        issueNote: null,
      },
    ],

    note:
      "Yêu cầu có mặt trước giờ sự kiện 2 giờ.",

    createdAt:
      "2026-08-06T11:30:00+07:00",

    updatedAt:
      "2026-08-06T11:30:00+07:00",

    history: [
      {
        id:
          "delivery-hn-0041-history-01",

        action: "CREATED",

        actorId:
          "sales-hn-001",

        actorName:
          "Nguyễn Hoàng Nam",

        note:
          "Tạo nhiệm vụ giao thiết bị.",

        createdAt:
          "2026-08-06T11:30:00+07:00",
      },

      {
        id:
          "delivery-hn-0041-history-02",

        action: "ASSIGNED",

        actorId:
          "manager-hn-001",

        actorName:
          "Lê Thu Trang",

        note:
          "Phân công Trần Văn Hải phụ trách.",

        createdAt:
          "2026-08-06T13:00:00+07:00",
      },
    ],
  },

  {
    id: "return-hn-0038",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_DELIVERY_BRANCH_IDS
        .HANOI,

    branchName:
      "Chi nhánh Hà Nội",

    taskCode: "NT-HN-0038",

    type: "RETURN",

    rentalId:
      "rental-hn-00079",

    rentalCode:
      "DT-HN-2026-0079",

    contractId:
      "contract-hn-0065",

    contractCode:
      "HD-HN-2026-0065",

    customerId:
      "customer-hn-004",

    customerName:
      "Công ty Cổ phần Truyền thông Ánh Dương",

    customerPhone:
      "0912345678",

    customerEmail:
      "anhduongmedia@gmail.com",

    eventName:
      "Lễ ra mắt sản phẩm mới",

    address:
      "Khách sạn Daewoo, Hà Nội",

    scheduledAt:
      "2026-08-07T09:00:00+07:00",

    startedAt:
      "2026-08-07T09:15:00+07:00",

    arrivedAt: null,

    completedAt: null,

    status: "DELAYED",

    priority: "URGENT",

    assignedEmployeeId:
      "operations-hn-002",

    assignedEmployeeName:
      "Nguyễn Đức Anh",

    assignedEmployeePhone:
      "0903222333",

    vehiclePlate:
      "29D-456.78",

    handoverStatus:
      "PENDING",

    handoverPersonName: null,

    equipmentItemCount: 1,

    totalEquipmentQuantity: 12,

    issueCount: 1,

    equipmentItems: [
      {
        id:
          "return-hn-0038-item-01",

        equipmentName:
          "Màn hình LED sân khấu P3",

        quantity: 12,

        checkedQuantity: 0,

        condition: "GOOD",

        issueNote:
          "Khách hàng chưa sẵn sàng bàn giao.",
      },
    ],

    note:
      "Đơn thuê đã quá hạn, cần ưu tiên thu hồi.",

    createdAt:
      "2026-08-04T18:30:00+07:00",

    updatedAt:
      "2026-08-07T10:10:00+07:00",

    history: [
      {
        id:
          "return-hn-0038-history-01",

        action: "CREATED",

        actorId:
          "operations-hn-001",

        actorName:
          "Trần Văn Hải",

        note:
          "Tạo nhiệm vụ nhận trả thiết bị.",

        createdAt:
          "2026-08-04T18:30:00+07:00",
      },

      {
        id:
          "return-hn-0038-history-02",

        action:
          "RETURN_STARTED",

        actorId:
          "operations-hn-002",

        actorName:
          "Nguyễn Đức Anh",

        note:
          "Đã xuất phát tới địa điểm nhận thiết bị.",

        createdAt:
          "2026-08-07T09:15:00+07:00",
      },

      {
        id:
          "return-hn-0038-history-03",

        action: "DELAYED",

        actorId:
          "operations-hn-002",

        actorName:
          "Nguyễn Đức Anh",

        note:
          "Khách hàng chưa hoàn tất tháo dỡ thiết bị.",

        createdAt:
          "2026-08-07T10:10:00+07:00",
      },
    ],
  },

  {
    id: "delivery-hcm-0034",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_DELIVERY_BRANCH_IDS
        .HO_CHI_MINH,

    branchName:
      "Chi nhánh TP. Hồ Chí Minh",

    taskCode: "GH-HCM-0034",

    type: "DELIVERY",

    rentalId:
      "rental-hcm-00045",

    rentalCode:
      "DT-HCM-2026-0045",

    contractId:
      "contract-hcm-0039",

    contractCode:
      "HD-HCM-2026-0039",

    customerId:
      "customer-hcm-001",

    customerName:
      "Công ty TNHH Tổ chức Sự kiện Sài Thành",

    customerPhone:
      "0909123456",

    customerEmail:
      "saithanhevent@gmail.com",

    eventName:
      "Đêm nhạc doanh nghiệp 2026",

    address:
      "Nhà thi đấu Phú Thọ, TP. Hồ Chí Minh",

    scheduledAt:
      "2026-08-09T15:30:00+07:00",

    startedAt: null,
    arrivedAt: null,
    completedAt: null,

    status: "PREPARING",

    priority: "HIGH",

    assignedEmployeeId:
      "operations-hcm-001",

    assignedEmployeeName:
      "Võ Minh Khang",

    assignedEmployeePhone:
      "0918111222",

    vehiclePlate:
      "51D-789.01",

    handoverStatus:
      "PENDING",

    handoverPersonName: null,

    equipmentItemCount: 2,

    totalEquipmentQuantity: 4,

    issueCount: 0,

    equipmentItems: [
      {
        id:
          "delivery-hcm-0034-item-01",

        equipmentName:
          "Hệ thống âm thanh Line Array",

        quantity: 3,

        checkedQuantity: 3,

        condition: "GOOD",

        issueNote: null,
      },

      {
        id:
          "delivery-hcm-0034-item-02",

        equipmentName:
          "Sân khấu lắp ghép 12x8m",

        quantity: 1,

        checkedQuantity: 1,

        condition: "GOOD",

        issueNote: null,
      },
    ],

    note:
      "Thiết bị đã được kiểm tra, đang chờ xuất kho.",

    createdAt:
      "2026-08-05T08:20:00+07:00",

    updatedAt:
      "2026-08-07T09:40:00+07:00",

    history: [
      {
        id:
          "delivery-hcm-0034-history-01",

        action: "CREATED",

        actorId:
          "sales-hcm-002",

        actorName:
          "Lê Thành Công",

        note:
          "Tạo nhiệm vụ giao thiết bị.",

        createdAt:
          "2026-08-05T08:20:00+07:00",
      },

      {
        id:
          "delivery-hcm-0034-history-02",

        action: "ASSIGNED",

        actorId:
          "manager-hcm-001",

        actorName:
          "Phan Thùy Linh",

        note:
          "Phân công Võ Minh Khang phụ trách.",

        createdAt:
          "2026-08-05T09:00:00+07:00",
      },

      {
        id:
          "delivery-hcm-0034-history-03",

        action: "PREPARING",

        actorId:
          "operations-hcm-001",

        actorName:
          "Võ Minh Khang",

        note:
          "Đang chuẩn bị thiết bị và phương tiện.",

        createdAt:
          "2026-08-07T09:40:00+07:00",
      },
    ],
  },

  {
    id: "return-hcm-0032",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_DELIVERY_BRANCH_IDS
        .HO_CHI_MINH,

    branchName:
      "Chi nhánh TP. Hồ Chí Minh",

    taskCode: "NT-HCM-0032",

    type: "RETURN",

    rentalId:
      "rental-hcm-00043",

    rentalCode:
      "DT-HCM-2026-0043",

    contractId:
      "contract-hcm-0036",

    contractCode:
      "HD-HCM-2026-0036",

    customerId:
      "customer-hcm-005",

    customerName:
      "Trường Đại học Kinh tế TP.HCM",

    customerPhone:
      "02838295299",

    customerEmail:
      "event@ueh.edu.vn",

    eventName:
      "Lễ tốt nghiệp khóa 48",

    address:
      "Cơ sở Nguyễn Văn Linh, TP.HCM",

    scheduledAt:
      "2026-08-07T17:30:00+07:00",

    startedAt:
      "2026-08-07T17:20:00+07:00",

    arrivedAt:
      "2026-08-07T17:55:00+07:00",

    completedAt: null,

    status: "ARRIVED",

    priority: "HIGH",

    assignedEmployeeId:
      "operations-hcm-001",

    assignedEmployeeName:
      "Võ Minh Khang",

    assignedEmployeePhone:
      "0918111222",

    vehiclePlate:
      "51D-789.01",

    handoverStatus:
      "PENDING",

    handoverPersonName:
      "Nguyễn Minh Quân",

    equipmentItemCount: 1,

    totalEquipmentQuantity: 400,

    issueCount: 0,

    equipmentItems: [
      {
        id:
          "return-hcm-0032-item-01",

        equipmentName:
          "Ghế sự kiện bọc nệm",

        quantity: 400,

        checkedQuantity: 0,

        condition: "GOOD",

        issueNote: null,
      },
    ],

    note:
      "Đội vận hành đang thực hiện kiểm đếm.",

    createdAt:
      "2026-08-07T09:00:00+07:00",

    updatedAt:
      "2026-08-07T17:55:00+07:00",

    history: [
      {
        id:
          "return-hcm-0032-history-01",

        action: "CREATED",

        actorId:
          "operations-hcm-001",

        actorName:
          "Võ Minh Khang",

        note:
          "Tạo nhiệm vụ nhận trả.",

        createdAt:
          "2026-08-07T09:00:00+07:00",
      },

      {
        id:
          "return-hcm-0032-history-02",

        action:
          "RETURN_STARTED",

        actorId:
          "operations-hcm-001",

        actorName:
          "Võ Minh Khang",

        note:
          "Xuất phát tới địa điểm nhận thiết bị.",

        createdAt:
          "2026-08-07T17:20:00+07:00",
      },

      {
        id:
          "return-hcm-0032-history-03",

        action: "ARRIVED",

        actorId:
          "operations-hcm-001",

        actorName:
          "Võ Minh Khang",

        note:
          "Đã tới địa điểm, bắt đầu kiểm đếm.",

        createdAt:
          "2026-08-07T17:55:00+07:00",
      },
    ],
  },

  {
    id: "delivery-dn-0018",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_DELIVERY_BRANCH_IDS
        .DA_NANG,

    branchName:
      "Chi nhánh Đà Nẵng",

    taskCode: "GH-DN-0018",

    type: "DELIVERY",

    rentalId:
      "rental-dn-00021",

    rentalCode:
      "DT-DN-2026-0021",

    contractId:
      "contract-dn-0016",

    contractCode:
      "HD-DN-2026-0016",

    customerId:
      "customer-dn-001",

    customerName:
      "Công ty TNHH Du lịch Biển Xanh",

    customerPhone:
      "0905123456",

    customerEmail:
      "bienxanhtravel@gmail.com",

    eventName:
      "Gala Dinner Biển Xanh 2026",

    address:
      "Bãi biển Mỹ Khê, Đà Nẵng",

    scheduledAt:
      "2026-08-07T14:00:00+07:00",

    startedAt: null,
    arrivedAt: null,
    completedAt: null,

    status: "READY",

    priority: "HIGH",

    assignedEmployeeId:
      "operations-dn-001",

    assignedEmployeeName:
      "Nguyễn Quốc Bảo",

    assignedEmployeePhone:
      "0905111222",

    vehiclePlate:
      "43C-234.56",

    handoverStatus:
      "PENDING",

    handoverPersonName: null,

    equipmentItemCount: 2,

    totalEquipmentQuantity: 11,

    issueCount: 0,

    equipmentItems: [
      {
        id:
          "delivery-dn-0018-item-01",

        equipmentName:
          "Nhà bạt không gian 10x20m",

        quantity: 1,

        checkedQuantity: 1,

        condition: "GOOD",

        issueNote: null,
      },

      {
        id:
          "delivery-dn-0018-item-02",

        equipmentName:
          "Bộ chiếu sáng ngoài trời",

        quantity: 10,

        checkedQuantity: 10,

        condition: "GOOD",

        issueNote: null,
      },
    ],

    note:
      "Đã kiểm tra thiết bị, theo dõi thời tiết trước khi xuất phát.",

    createdAt:
      "2026-08-06T15:00:00+07:00",

    updatedAt:
      "2026-08-07T10:30:00+07:00",

    history: [
      {
        id:
          "delivery-dn-0018-history-01",

        action: "CREATED",

        actorId:
          "sales-dn-001",

        actorName:
          "Hoàng Minh Phúc",

        note:
          "Tạo nhiệm vụ giao thiết bị.",

        createdAt:
          "2026-08-06T15:00:00+07:00",
      },

      {
        id:
          "delivery-dn-0018-history-02",

        action: "READY",

        actorId:
          "operations-dn-001",

        actorName:
          "Nguyễn Quốc Bảo",

        note:
          "Thiết bị đã sẵn sàng xuất kho.",

        createdAt:
          "2026-08-07T10:30:00+07:00",
      },
    ],
  },

  {
    id: "return-dn-0016",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_DELIVERY_BRANCH_IDS
        .DA_NANG,

    branchName:
      "Chi nhánh Đà Nẵng",

    taskCode: "NT-DN-0016",

    type: "RETURN",

    rentalId:
      "rental-dn-00019",

    rentalCode:
      "DT-DN-2026-0019",

    contractId:
      "contract-dn-0014",

    contractCode:
      "HD-DN-2026-0014",

    customerId:
      "customer-dn-004",

    customerName:
      "Công ty Cổ phần Xây dựng Miền Trung",

    customerPhone:
      "0915123456",

    customerEmail:
      "mientrungconstruction@gmail.com",

    eventName:
      "Lễ khởi công dự án ven biển",

    address:
      "Quận Ngũ Hành Sơn, Đà Nẵng",

    scheduledAt:
      "2026-07-28T19:00:00+07:00",

    startedAt:
      "2026-07-28T18:45:00+07:00",

    arrivedAt:
      "2026-07-28T19:10:00+07:00",

    completedAt:
      "2026-07-28T20:15:00+07:00",

    status: "COMPLETED",

    priority: "NORMAL",

    assignedEmployeeId:
      "operations-dn-001",

    assignedEmployeeName:
      "Nguyễn Quốc Bảo",

    assignedEmployeePhone:
      "0905111222",

    vehiclePlate:
      "43C-234.56",

    handoverStatus:
      "CONFIRMED",

    handoverPersonName:
      "Trần Quốc Dũng",

    equipmentItemCount: 1,

    totalEquipmentQuantity: 1,

    issueCount: 0,

    equipmentItems: [
      {
        id:
          "return-dn-0016-item-01",

        equipmentName:
          "Sân khấu lắp ghép 8x6m",

        quantity: 1,

        checkedQuantity: 1,

        condition: "GOOD",

        issueNote: null,
      },
    ],

    note:
      "Đã hoàn trả đầy đủ, không phát sinh hư hỏng.",

    createdAt:
      "2026-07-28T17:00:00+07:00",

    updatedAt:
      "2026-07-28T20:15:00+07:00",

    history: [
      {
        id:
          "return-dn-0016-history-01",

        action: "CREATED",

        actorId:
          "operations-dn-001",

        actorName:
          "Nguyễn Quốc Bảo",

        note:
          "Tạo nhiệm vụ nhận trả.",

        createdAt:
          "2026-07-28T17:00:00+07:00",
      },

      {
        id:
          "return-dn-0016-history-02",

        action:
          "RETURN_INSPECTED",

        actorId:
          "operations-dn-001",

        actorName:
          "Nguyễn Quốc Bảo",

        note:
          "Đã kiểm tra thiết bị, tình trạng tốt.",

        createdAt:
          "2026-07-28T20:05:00+07:00",
      },

      {
        id:
          "return-dn-0016-history-03",

        action: "COMPLETED",

        actorId:
          "operations-dn-001",

        actorName:
          "Nguyễn Quốc Bảo",

        note:
          "Hoàn thành nhiệm vụ nhận trả.",

        createdAt:
          "2026-07-28T20:15:00+07:00",
      },
    ],
  },
];

export const cloneManagerDeliveryMockData =
  (): ManagerDeliveryTask[] =>
    structuredClone(
      managerDeliveryMockData,
    );
