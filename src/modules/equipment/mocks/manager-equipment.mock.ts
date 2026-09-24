import type {
  ManagerEquipment,
} from "@/modules/equipment/types/manager-equipment.types";

export const MANAGER_EQUIPMENT_BRANCH_IDS = {
  HANOI: "branch-hanoi",
  HO_CHI_MINH: "branch-hcm",
  DA_NANG: "branch-danang",
} as const;

const ORGANIZATION_ID =
  "organization-rentai";

export const managerEquipmentMockData:
  ManagerEquipment[] = [
  {
    id: "equipment-hn-audio-001",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_EQUIPMENT_BRANCH_IDS.HANOI,

    branchName:
      "Chi nhánh Hà Nội",

    equipmentCode:
      "TB-HN-AUD-001",

    equipmentName:
      "Loa Line Array JBL VTX A12",

    categoryId:
      "category-audio",

    categoryName:
      "Âm thanh",

    warehouseId:
      "warehouse-hn-main",

    warehouseName:
      "Kho thiết bị Hà Nội",

    status: "RENTED",

    condition: "GOOD",

    totalQuantity: 24,

    availableQuantity: 8,

    rentedQuantity: 10,

    reservedQuantity: 4,

    maintenanceQuantity: 2,

    damagedQuantity: 0,

    currentRentalCodes: [
      "DT-HN-2026-0081",
      "DT-HN-2026-0079",
    ],

    lastMaintenanceAt:
      "2026-07-11T09:00:00+07:00",

    nextMaintenanceAt:
      "2026-08-11T09:00:00+07:00",

    note:
      "2 thiết bị đang kiểm tra định kỳ.",

    updatedAt:
      "2026-08-07T18:20:00+07:00",

    maintenanceHistory: [
      {
        id:
          "maintenance-hn-audio-001",

        status:
          "COMPLETED",

        performedAt:
          "2026-07-11T11:30:00+07:00",

        scheduledAt:
          "2026-07-11T09:00:00+07:00",

        technicianName:
          "Nguyễn Thành Nam",

        description:
          "Bảo dưỡng hệ thống loa định kỳ.",

        note:
          "Hoạt động ổn định sau bảo dưỡng.",
      },

      {
        id:
          "maintenance-hn-audio-002",

        status:
          "SCHEDULED",

        performedAt: null,

        scheduledAt:
          "2026-08-11T09:00:00+07:00",

        technicianName:
          "Nguyễn Thành Nam",

        description:
          "Kiểm tra driver và hệ thống kết nối.",

        note: null,
      },
    ],
  },

  {
    id: "equipment-hn-led-002",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_EQUIPMENT_BRANCH_IDS.HANOI,

    branchName:
      "Chi nhánh Hà Nội",

    equipmentCode:
      "TB-HN-LED-002",

    equipmentName:
      "Màn hình LED sân khấu P3",

    categoryId:
      "category-led",

    categoryName:
      "Màn hình LED",

    warehouseId:
      "warehouse-hn-main",

    warehouseName:
      "Kho thiết bị Hà Nội",

    status: "DAMAGED",

    condition: "DAMAGED",

    totalQuantity: 16,

    availableQuantity: 6,

    rentedQuantity: 4,

    reservedQuantity: 2,

    maintenanceQuantity: 2,

    damagedQuantity: 2,

    currentRentalCodes: [
      "DT-HN-2026-0079",
    ],

    lastMaintenanceAt:
      "2026-07-20T08:00:00+07:00",

    nextMaintenanceAt:
      "2026-08-08T08:30:00+07:00",

    note:
      "2 module LED lỗi nguồn, cần ưu tiên xử lý.",

    updatedAt:
      "2026-08-07T19:10:00+07:00",

    maintenanceHistory: [
      {
        id:
          "maintenance-hn-led-001",

        status:
          "COMPLETED",

        performedAt:
          "2026-07-20T10:45:00+07:00",

        scheduledAt:
          "2026-07-20T08:00:00+07:00",

        technicianName:
          "Phạm Quốc Long",

        description:
          "Kiểm tra module LED và bộ nguồn.",

        note:
          "Đã thay một bộ nguồn.",
      },

      {
        id:
          "maintenance-hn-led-002",

        status:
          "SCHEDULED",

        performedAt: null,

        scheduledAt:
          "2026-08-08T08:30:00+07:00",

        technicianName:
          "Phạm Quốc Long",

        description:
          "Xử lý 2 module LED báo lỗi.",

        note:
          "Cần kiểm tra trước khi đưa lại vào kho khả dụng.",
      },
    ],
  },

  {
    id: "equipment-hcm-light-001",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_EQUIPMENT_BRANCH_IDS.HO_CHI_MINH,

    branchName:
      "Chi nhánh TP. Hồ Chí Minh",

    equipmentCode:
      "TB-HCM-LGT-001",

    equipmentName:
      "Đèn Moving Head Beam 350",

    categoryId:
      "category-light",

    categoryName:
      "Ánh sáng",

    warehouseId:
      "warehouse-hcm-main",

    warehouseName:
      "Kho thiết bị TP.HCM",

    status: "AVAILABLE",

    condition: "GOOD",

    totalQuantity: 30,

    availableQuantity: 18,

    rentedQuantity: 6,

    reservedQuantity: 4,

    maintenanceQuantity: 2,

    damagedQuantity: 0,

    currentRentalCodes: [
      "DT-HCM-2026-0045",
    ],

    lastMaintenanceAt:
      "2026-07-25T09:00:00+07:00",

    nextMaintenanceAt:
      "2026-08-25T09:00:00+07:00",

    note:
      "Số lượng khả dụng ổn định.",

    updatedAt:
      "2026-08-07T17:30:00+07:00",

    maintenanceHistory: [
      {
        id:
          "maintenance-hcm-light-001",

        status:
          "COMPLETED",

        performedAt:
          "2026-07-25T11:00:00+07:00",

        scheduledAt:
          "2026-07-25T09:00:00+07:00",

        technicianName:
          "Võ Hoàng Minh",

        description:
          "Vệ sinh quang học và kiểm tra motor.",

        note:
          "Không phát hiện bất thường.",
      },
    ],
  },

  {
    id: "equipment-hcm-stage-002",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_EQUIPMENT_BRANCH_IDS.HO_CHI_MINH,

    branchName:
      "Chi nhánh TP. Hồ Chí Minh",

    equipmentCode:
      "TB-HCM-STG-002",

    equipmentName:
      "Sàn sân khấu lắp ghép 1x2m",

    categoryId:
      "category-stage",

    categoryName:
      "Sân khấu",

    warehouseId:
      "warehouse-hcm-main",

    warehouseName:
      "Kho thiết bị TP.HCM",

    status: "RESERVED",

    condition: "GOOD",

    totalQuantity: 40,

    availableQuantity: 10,

    rentedQuantity: 12,

    reservedQuantity: 16,

    maintenanceQuantity: 2,

    damagedQuantity: 0,

    currentRentalCodes: [
      "DT-HCM-2026-0045",
      "DT-HCM-2026-0047",
    ],

    lastMaintenanceAt:
      "2026-07-18T09:30:00+07:00",

    nextMaintenanceAt:
      "2026-08-18T09:30:00+07:00",

    note:
      "16 tấm đã được giữ chỗ cho các lịch giao sắp tới.",

    updatedAt:
      "2026-08-07T20:00:00+07:00",

    maintenanceHistory: [
      {
        id:
          "maintenance-hcm-stage-001",

        status:
          "COMPLETED",

        performedAt:
          "2026-07-18T11:00:00+07:00",

        scheduledAt:
          "2026-07-18T09:30:00+07:00",

        technicianName:
          "Trần Hải Đăng",

        description:
          "Kiểm tra khung và khóa liên kết sân khấu.",

        note:
          "Đạt yêu cầu sử dụng.",
      },
    ],
  },

  {
    id: "equipment-dn-tent-001",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_EQUIPMENT_BRANCH_IDS.DA_NANG,

    branchName:
      "Chi nhánh Đà Nẵng",

    equipmentCode:
      "TB-DN-TNT-001",

    equipmentName:
      "Nhà bạt không gian 10x20m",

    categoryId:
      "category-tent",

    categoryName:
      "Nhà bạt",

    warehouseId:
      "warehouse-dn-main",

    warehouseName:
      "Kho thiết bị Đà Nẵng",

    status: "MAINTENANCE",

    condition:
      "NEEDS_INSPECTION",

    totalQuantity: 12,

    availableQuantity: 4,

    rentedQuantity: 4,

    reservedQuantity: 2,

    maintenanceQuantity: 2,

    damagedQuantity: 0,

    currentRentalCodes: [
      "DT-DN-2026-0021",
    ],

    lastMaintenanceAt:
      "2026-07-05T08:00:00+07:00",

    nextMaintenanceAt:
      "2026-08-07T08:00:00+07:00",

    note:
      "Có lịch kiểm tra bảo trì trong ngày.",

    updatedAt:
      "2026-08-07T16:20:00+07:00",

    maintenanceHistory: [
      {
        id:
          "maintenance-dn-tent-001",

        status:
          "OVERDUE",

        performedAt: null,

        scheduledAt:
          "2026-08-07T08:00:00+07:00",

        technicianName:
          "Lê Đức Huy",

        description:
          "Kiểm tra khung, bạt và hệ thống liên kết.",

        note:
          "Chưa hoàn tất kiểm tra theo lịch.",
      },
    ],
  },

  {
    id: "equipment-dn-chair-002",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_EQUIPMENT_BRANCH_IDS.DA_NANG,

    branchName:
      "Chi nhánh Đà Nẵng",

    equipmentCode:
      "TB-DN-CHA-002",

    equipmentName:
      "Ghế sự kiện bọc nệm",

    categoryId:
      "category-chair",

    categoryName:
      "Bàn ghế",

    warehouseId:
      "warehouse-dn-main",

    warehouseName:
      "Kho thiết bị Đà Nẵng",

    status: "AVAILABLE",

    condition: "GOOD",

    totalQuantity: 500,

    availableQuantity: 320,

    rentedQuantity: 120,

    reservedQuantity: 50,

    maintenanceQuantity: 5,

    damagedQuantity: 5,

    currentRentalCodes: [
      "DT-DN-2026-0019",
    ],

    lastMaintenanceAt:
      "2026-07-30T08:30:00+07:00",

    nextMaintenanceAt:
      "2026-08-30T08:30:00+07:00",

    note:
      "5 ghế hỏng nhẹ đang chờ sửa.",

    updatedAt:
      "2026-08-07T18:45:00+07:00",

    maintenanceHistory: [
      {
        id:
          "maintenance-dn-chair-001",

        status:
          "COMPLETED",

        performedAt:
          "2026-07-30T10:00:00+07:00",

        scheduledAt:
          "2026-07-30T08:30:00+07:00",

        technicianName:
          "Lê Đức Huy",

        description:
          "Kiểm tra khung ghế và bọc nệm.",

        note:
          "Phát hiện 5 ghế cần sửa nhẹ.",
      },
    ],
  },
];

export const cloneManagerEquipmentMockData =
  (): ManagerEquipment[] =>
    structuredClone(
      managerEquipmentMockData,
    );
