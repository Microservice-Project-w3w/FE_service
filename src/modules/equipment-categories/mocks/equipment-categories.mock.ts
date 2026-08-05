import type {
  EquipmentCategory,
} from "@/modules/equipment-categories/types/equipment-category.types";

export const initialEquipmentCategories:
  EquipmentCategory[] = [
    {
      id: "category-audio",
      organizationId: "org-rentai",
      categoryCode: "CAT-AUDIO",
      name: "Thiết bị âm thanh",
      icon: "AUDIO",
      parentId: null,
      parentName: null,
      description:
        "Hệ thống loa, mixer, micro và phụ kiện âm thanh.",
      equipmentTypeCount: 3,
      equipmentCount: 48,
      status: "ACTIVE",
      createdAt:
        "2023-01-05T08:00:00.000Z",
      updatedAt:
        "2026-08-01T09:30:00.000Z",
    },
    {
      id: "category-speakers",
      organizationId: "org-rentai",
      categoryCode: "CAT-SPEAKER",
      name: "Loa và hệ thống phát",
      icon: "AUDIO",
      parentId: "category-audio",
      parentName: "Thiết bị âm thanh",
      description:
        "Loa toàn dải, loa sub và hệ thống loa line array.",
      equipmentTypeCount: 2,
      equipmentCount: 24,
      status: "ACTIVE",
      createdAt:
        "2023-01-06T08:00:00.000Z",
      updatedAt:
        "2026-07-28T10:20:00.000Z",
    },
    {
      id: "category-mixers",
      organizationId: "org-rentai",
      categoryCode: "CAT-MIXER",
      name: "Mixer và xử lý tín hiệu",
      icon: "AUDIO",
      parentId: "category-audio",
      parentName: "Thiết bị âm thanh",
      description:
        "Bàn mixer, bộ xử lý tín hiệu và thiết bị điều phối âm thanh.",
      equipmentTypeCount: 1,
      equipmentCount: 12,
      status: "ACTIVE",
      createdAt:
        "2023-01-07T08:00:00.000Z",
      updatedAt:
        "2026-07-25T11:15:00.000Z",
    },
    {
      id: "category-lighting",
      organizationId: "org-rentai",
      categoryCode: "CAT-LIGHT",
      name: "Thiết bị ánh sáng",
      icon: "LIGHTING",
      parentId: null,
      parentName: null,
      description:
        "Đèn sân khấu, bàn điều khiển và phụ kiện chiếu sáng.",
      equipmentTypeCount: 3,
      equipmentCount: 36,
      status: "ACTIVE",
      createdAt:
        "2023-02-10T08:00:00.000Z",
      updatedAt:
        "2026-07-20T14:00:00.000Z",
    },
    {
      id: "category-stage",
      organizationId: "org-rentai",
      categoryCode: "CAT-STAGE",
      name: "Sân khấu và kết cấu",
      icon: "STAGE",
      parentId: null,
      parentName: null,
      description:
        "Sân khấu lắp ghép, khung truss và kết cấu sự kiện.",
      equipmentTypeCount: 2,
      equipmentCount: 18,
      status: "ACTIVE",
      createdAt:
        "2023-03-15T08:00:00.000Z",
      updatedAt:
        "2026-07-18T09:45:00.000Z",
    },
    {
      id: "category-power",
      organizationId: "org-rentai",
      categoryCode: "CAT-POWER",
      name: "Nguồn điện và máy phát",
      icon: "POWER",
      parentId: null,
      parentName: null,
      description:
        "Máy phát điện, bộ chia nguồn và dây dẫn công suất lớn.",
      equipmentTypeCount: 1,
      equipmentCount: 12,
      status: "ACTIVE",
      createdAt:
        "2023-04-20T08:00:00.000Z",
      updatedAt:
        "2026-07-15T16:10:00.000Z",
    },
    {
      id: "category-visual",
      organizationId: "org-rentai",
      categoryCode: "CAT-VISUAL",
      name: "Thiết bị trình chiếu",
      icon: "VISUAL",
      parentId: null,
      parentName: null,
      description:
        "Màn hình LED, máy chiếu và thiết bị xử lý hình ảnh.",
      equipmentTypeCount: 2,
      equipmentCount: 15,
      status: "ACTIVE",
      createdAt:
        "2024-01-12T08:00:00.000Z",
      updatedAt:
        "2026-07-10T13:25:00.000Z",
    },
    {
      id: "category-demo",
      organizationId: "org-rentai",
      categoryCode: "CAT-DEMO",
      name: "Danh mục thử nghiệm",
      icon: "OTHER",
      parentId: "category-visual",
      parentName: "Thiết bị trình chiếu",
      description:
        "Danh mục mẫu đang ngừng hoạt động và chưa có thiết bị.",
      equipmentTypeCount: 0,
      equipmentCount: 0,
      status: "INACTIVE",
      createdAt:
        "2025-05-01T08:00:00.000Z",
      updatedAt:
        "2026-06-10T08:30:00.000Z",
    },
  ];
