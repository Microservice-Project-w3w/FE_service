import type {
  AdminReportData,
  ReportPeriodOption,
} from "@/modules/reports/types/admin-report.types";

export const reportPeriodOptions:
  ReportPeriodOption[] = [
    {
      value: "THIS_MONTH",
      label: "Tháng này",
    },
    {
      value: "LAST_MONTH",
      label: "Tháng trước",
    },
    {
      value: "THIS_QUARTER",
      label: "Quý này",
    },
    {
      value: "THIS_YEAR",
      label: "Năm nay",
    },
  ];

export const adminReportMockData: Record<
  AdminReportData["period"],
  AdminReportData
> = {
  THIS_MONTH: {
    period: "THIS_MONTH",
    generatedAt:
      "2026-08-06T03:00:00.000Z",

    summary: {
      totalRevenue: {
        value: 428500000,
        changePercent: 12.8,
        trend: "UP",
      },
      totalRentals: {
        value: 186,
        changePercent: 8.4,
        trend: "UP",
      },
      utilizationRate: {
        value: 74.6,
        changePercent: 3.2,
        trend: "UP",
      },
      overdueRentals: {
        value: 7,
        changePercent: 2.1,
        trend: "DOWN",
      },
    },

    revenueTrend: [
      {
        label: "Tuần 1",
        revenue: 82500000,
        rentalCount: 38,
      },
      {
        label: "Tuần 2",
        revenue: 96800000,
        rentalCount: 43,
      },
      {
        label: "Tuần 3",
        revenue: 113200000,
        rentalCount: 51,
      },
      {
        label: "Tuần 4",
        revenue: 136000000,
        rentalCount: 54,
      },
    ],

    rentalStatus: [
      {
        status: "DRAFT",
        label: "Bản nháp",
        count: 14,
      },
      {
        status: "CONFIRMED",
        label: "Đã xác nhận",
        count: 31,
      },
      {
        status: "ONGOING",
        label: "Đang thuê",
        count: 42,
      },
      {
        status: "COMPLETED",
        label: "Hoàn thành",
        count: 92,
      },
      {
        status: "OVERDUE",
        label: "Quá hạn",
        count: 7,
      },
    ],

    topBranches: [
      {
        id: "branch-001",
        code: "CN-HN",
        name: "Chi nhánh Hà Nội",
        revenue: 156800000,
        rentalCount: 68,
        utilizationRate: 82.4,
      },
      {
        id: "branch-002",
        code: "CN-HCM",
        name: "Chi nhánh Hồ Chí Minh",
        revenue: 142400000,
        rentalCount: 61,
        utilizationRate: 78.1,
      },
      {
        id: "branch-003",
        code: "CN-DN",
        name: "Chi nhánh Đà Nẵng",
        revenue: 86500000,
        rentalCount: 37,
        utilizationRate: 68.7,
      },
      {
        id: "branch-004",
        code: "CN-HP",
        name: "Chi nhánh Hải Phòng",
        revenue: 42800000,
        rentalCount: 20,
        utilizationRate: 59.3,
      },
    ],

    topCategories: [
      {
        id: "category-001",
        code: "CAT-AUDIO",
        name: "Thiết bị âm thanh",
        revenue: 132600000,
        equipmentCount: 84,
        utilizationRate: 86.2,
      },
      {
        id: "category-002",
        code: "CAT-LIGHT",
        name: "Thiết bị ánh sáng",
        revenue: 108400000,
        equipmentCount: 72,
        utilizationRate: 79.4,
      },
      {
        id: "category-003",
        code: "CAT-LED",
        name: "Màn hình và trình chiếu",
        revenue: 96500000,
        equipmentCount: 46,
        utilizationRate: 75.8,
      },
      {
        id: "category-004",
        code: "CAT-STAGE",
        name: "Sân khấu và khung giàn",
        revenue: 61200000,
        equipmentCount: 38,
        utilizationRate: 66.1,
      },
      {
        id: "category-005",
        code: "CAT-OTHER",
        name: "Thiết bị phụ trợ",
        revenue: 29800000,
        equipmentCount: 63,
        utilizationRate: 51.7,
      },
    ],
  },

  LAST_MONTH: {
    period: "LAST_MONTH",
    generatedAt:
      "2026-08-06T03:00:00.000Z",

    summary: {
      totalRevenue: {
        value: 379900000,
        changePercent: 5.6,
        trend: "UP",
      },
      totalRentals: {
        value: 171,
        changePercent: 4.2,
        trend: "UP",
      },
      utilizationRate: {
        value: 71.4,
        changePercent: 1.8,
        trend: "UP",
      },
      overdueRentals: {
        value: 9,
        changePercent: 1.4,
        trend: "UP",
      },
    },

    revenueTrend: [
      {
        label: "Tuần 1",
        revenue: 74600000,
        rentalCount: 35,
      },
      {
        label: "Tuần 2",
        revenue: 86300000,
        rentalCount: 39,
      },
      {
        label: "Tuần 3",
        revenue: 101500000,
        rentalCount: 46,
      },
      {
        label: "Tuần 4",
        revenue: 117500000,
        rentalCount: 51,
      },
    ],

    rentalStatus: [
      {
        status: "DRAFT",
        label: "Bản nháp",
        count: 12,
      },
      {
        status: "CONFIRMED",
        label: "Đã xác nhận",
        count: 28,
      },
      {
        status: "ONGOING",
        label: "Đang thuê",
        count: 39,
      },
      {
        status: "COMPLETED",
        label: "Hoàn thành",
        count: 83,
      },
      {
        status: "OVERDUE",
        label: "Quá hạn",
        count: 9,
      },
    ],

    topBranches: [
      {
        id: "branch-001",
        code: "CN-HN",
        name: "Chi nhánh Hà Nội",
        revenue: 138700000,
        rentalCount: 62,
        utilizationRate: 78.5,
      },
      {
        id: "branch-002",
        code: "CN-HCM",
        name: "Chi nhánh Hồ Chí Minh",
        revenue: 126400000,
        rentalCount: 56,
        utilizationRate: 74.9,
      },
      {
        id: "branch-003",
        code: "CN-DN",
        name: "Chi nhánh Đà Nẵng",
        revenue: 75200000,
        rentalCount: 34,
        utilizationRate: 64.6,
      },
      {
        id: "branch-004",
        code: "CN-HP",
        name: "Chi nhánh Hải Phòng",
        revenue: 39600000,
        rentalCount: 19,
        utilizationRate: 56.8,
      },
    ],

    topCategories: [
      {
        id: "category-001",
        code: "CAT-AUDIO",
        name: "Thiết bị âm thanh",
        revenue: 118400000,
        equipmentCount: 84,
        utilizationRate: 82.1,
      },
      {
        id: "category-002",
        code: "CAT-LIGHT",
        name: "Thiết bị ánh sáng",
        revenue: 94700000,
        equipmentCount: 72,
        utilizationRate: 75.8,
      },
      {
        id: "category-003",
        code: "CAT-LED",
        name: "Màn hình và trình chiếu",
        revenue: 84600000,
        equipmentCount: 46,
        utilizationRate: 71.2,
      },
      {
        id: "category-004",
        code: "CAT-STAGE",
        name: "Sân khấu và khung giàn",
        revenue: 54300000,
        equipmentCount: 38,
        utilizationRate: 61.9,
      },
      {
        id: "category-005",
        code: "CAT-OTHER",
        name: "Thiết bị phụ trợ",
        revenue: 27900000,
        equipmentCount: 63,
        utilizationRate: 48.3,
      },
    ],
  },

  THIS_QUARTER: {
    period: "THIS_QUARTER",
    generatedAt:
      "2026-08-06T03:00:00.000Z",

    summary: {
      totalRevenue: {
        value: 1165200000,
        changePercent: 15.2,
        trend: "UP",
      },
      totalRentals: {
        value: 524,
        changePercent: 11.6,
        trend: "UP",
      },
      utilizationRate: {
        value: 72.8,
        changePercent: 4.5,
        trend: "UP",
      },
      overdueRentals: {
        value: 24,
        changePercent: 3.8,
        trend: "DOWN",
      },
    },

    revenueTrend: [
      {
        label: "Tháng 6",
        revenue: 356800000,
        rentalCount: 158,
      },
      {
        label: "Tháng 7",
        revenue: 379900000,
        rentalCount: 171,
      },
      {
        label: "Tháng 8",
        revenue: 428500000,
        rentalCount: 195,
      },
    ],

    rentalStatus: [
      {
        status: "DRAFT",
        label: "Bản nháp",
        count: 38,
      },
      {
        status: "CONFIRMED",
        label: "Đã xác nhận",
        count: 85,
      },
      {
        status: "ONGOING",
        label: "Đang thuê",
        count: 119,
      },
      {
        status: "COMPLETED",
        label: "Hoàn thành",
        count: 258,
      },
      {
        status: "OVERDUE",
        label: "Quá hạn",
        count: 24,
      },
    ],

    topBranches: [
      {
        id: "branch-001",
        code: "CN-HN",
        name: "Chi nhánh Hà Nội",
        revenue: 421500000,
        rentalCount: 191,
        utilizationRate: 80.6,
      },
      {
        id: "branch-002",
        code: "CN-HCM",
        name: "Chi nhánh Hồ Chí Minh",
        revenue: 385700000,
        rentalCount: 174,
        utilizationRate: 76.9,
      },
      {
        id: "branch-003",
        code: "CN-DN",
        name: "Chi nhánh Đà Nẵng",
        revenue: 238400000,
        rentalCount: 103,
        utilizationRate: 67.5,
      },
      {
        id: "branch-004",
        code: "CN-HP",
        name: "Chi nhánh Hải Phòng",
        revenue: 119600000,
        rentalCount: 56,
        utilizationRate: 58.7,
      },
    ],

    topCategories: [
      {
        id: "category-001",
        code: "CAT-AUDIO",
        name: "Thiết bị âm thanh",
        revenue: 357800000,
        equipmentCount: 84,
        utilizationRate: 84.1,
      },
      {
        id: "category-002",
        code: "CAT-LIGHT",
        name: "Thiết bị ánh sáng",
        revenue: 291400000,
        equipmentCount: 72,
        utilizationRate: 77.9,
      },
      {
        id: "category-003",
        code: "CAT-LED",
        name: "Màn hình và trình chiếu",
        revenue: 258600000,
        equipmentCount: 46,
        utilizationRate: 73.6,
      },
      {
        id: "category-004",
        code: "CAT-STAGE",
        name: "Sân khấu và khung giàn",
        revenue: 170500000,
        equipmentCount: 38,
        utilizationRate: 64.8,
      },
      {
        id: "category-005",
        code: "CAT-OTHER",
        name: "Thiết bị phụ trợ",
        revenue: 86900000,
        equipmentCount: 63,
        utilizationRate: 50.2,
      },
    ],
  },

  THIS_YEAR: {
    period: "THIS_YEAR",
    generatedAt:
      "2026-08-06T03:00:00.000Z",

    summary: {
      totalRevenue: {
        value: 3846800000,
        changePercent: 21.4,
        trend: "UP",
      },
      totalRentals: {
        value: 1768,
        changePercent: 17.9,
        trend: "UP",
      },
      utilizationRate: {
        value: 70.3,
        changePercent: 6.7,
        trend: "UP",
      },
      overdueRentals: {
        value: 83,
        changePercent: 4.1,
        trend: "DOWN",
      },
    },

    revenueTrend: [
      {
        label: "T1",
        revenue: 278500000,
        rentalCount: 126,
      },
      {
        label: "T2",
        revenue: 295700000,
        rentalCount: 134,
      },
      {
        label: "T3",
        revenue: 318400000,
        rentalCount: 146,
      },
      {
        label: "T4",
        revenue: 336900000,
        rentalCount: 153,
      },
      {
        label: "T5",
        revenue: 351200000,
        rentalCount: 161,
      },
      {
        label: "T6",
        revenue: 356800000,
        rentalCount: 158,
      },
      {
        label: "T7",
        revenue: 379900000,
        rentalCount: 171,
      },
      {
        label: "T8",
        revenue: 428500000,
        rentalCount: 195,
      },
      {
        label: "T9",
        revenue: 391600000,
        rentalCount: 178,
      },
      {
        label: "T10",
        revenue: 365400000,
        rentalCount: 169,
      },
      {
        label: "T11",
        revenue: 344700000,
        rentalCount: 158,
      },
      {
        label: "T12",
        revenue: 299300000,
        rentalCount: 119,
      },
    ],

    rentalStatus: [
      {
        status: "DRAFT",
        label: "Bản nháp",
        count: 126,
      },
      {
        status: "CONFIRMED",
        label: "Đã xác nhận",
        count: 286,
      },
      {
        status: "ONGOING",
        label: "Đang thuê",
        count: 401,
      },
      {
        status: "COMPLETED",
        label: "Hoàn thành",
        count: 872,
      },
      {
        status: "OVERDUE",
        label: "Quá hạn",
        count: 83,
      },
    ],

    topBranches: [
      {
        id: "branch-001",
        code: "CN-HN",
        name: "Chi nhánh Hà Nội",
        revenue: 1384200000,
        rentalCount: 631,
        utilizationRate: 78.9,
      },
      {
        id: "branch-002",
        code: "CN-HCM",
        name: "Chi nhánh Hồ Chí Minh",
        revenue: 1268600000,
        rentalCount: 584,
        utilizationRate: 75.4,
      },
      {
        id: "branch-003",
        code: "CN-DN",
        name: "Chi nhánh Đà Nẵng",
        revenue: 794300000,
        rentalCount: 359,
        utilizationRate: 66.2,
      },
      {
        id: "branch-004",
        code: "CN-HP",
        name: "Chi nhánh Hải Phòng",
        revenue: 399700000,
        rentalCount: 194,
        utilizationRate: 57.1,
      },
    ],

    topCategories: [
      {
        id: "category-001",
        code: "CAT-AUDIO",
        name: "Thiết bị âm thanh",
        revenue: 1186400000,
        equipmentCount: 84,
        utilizationRate: 82.7,
      },
      {
        id: "category-002",
        code: "CAT-LIGHT",
        name: "Thiết bị ánh sáng",
        revenue: 968300000,
        equipmentCount: 72,
        utilizationRate: 76.1,
      },
      {
        id: "category-003",
        code: "CAT-LED",
        name: "Màn hình và trình chiếu",
        revenue: 856700000,
        equipmentCount: 46,
        utilizationRate: 71.9,
      },
      {
        id: "category-004",
        code: "CAT-STAGE",
        name: "Sân khấu và khung giàn",
        revenue: 562800000,
        equipmentCount: 38,
        utilizationRate: 62.5,
      },
      {
        id: "category-005",
        code: "CAT-OTHER",
        name: "Thiết bị phụ trợ",
        revenue: 272600000,
        equipmentCount: 63,
        utilizationRate: 48.6,
      },
    ],
  },
};
