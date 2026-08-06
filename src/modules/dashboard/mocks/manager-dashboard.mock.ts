import type {
  ManagerBranchDashboardSnapshot,
} from "@/modules/dashboard/types/manager-dashboard.types";

export const managerDashboardMockByBranchId:
  Record<
    string,
    ManagerBranchDashboardSnapshot
  > = {
    "branch-hanoi": {
      summary: {
        activeRentals: {
          value: 8,
          changePercent: 14.3,
        },
        availableEquipment: {
          value: 126,
          changePercent: 6.8,
        },
        todayDeliveryTasks: {
          value: 6,
          changePercent: 20,
        },
        monthlyRevenue: {
          value: 156800000,
          changePercent: 12.5,
        },
        overdueRentals: 3,
        maintenanceDue: 7,
        pendingQuotationApprovals: 5,
        pendingContractApprovals: 3,
      },

      tasks: [
        {
          id: "hn-task-quotation",
          branchId: "branch-hanoi",
          branchName:
            "Chi nhánh Hà Nội",
          type:
            "QUOTATION_APPROVAL",
          title:
            "Duyệt báo giá BG-HN-0086",
          description:
            "Báo giá của Công ty Sự kiện Ánh Dương trị giá 48.500.000 ₫.",
          dueAt:
            "2026-08-06T08:30:00.000Z",
          priority: "HIGH",
          route:
            "/manager/quotation-approvals",
        },
        {
          id: "hn-task-contract",
          branchId: "branch-hanoi",
          branchName:
            "Chi nhánh Hà Nội",
          type:
            "CONTRACT_APPROVAL",
          title:
            "Duyệt hợp đồng HD-HN-0064",
          description:
            "Hợp đồng thuê hệ thống âm thanh cho sự kiện ngày 10/08.",
          dueAt:
            "2026-08-06T09:30:00.000Z",
          priority: "HIGH",
          route:
            "/manager/contract-approvals",
        },
        {
          id: "hn-task-delivery",
          branchId: "branch-hanoi",
          branchName:
            "Chi nhánh Hà Nội",
          type: "DELIVERY",
          title:
            "Theo dõi lịch giao GH-HN-0041",
          description:
            "Giao thiết bị tới Trung tâm Hội nghị Quốc gia lúc 14:00.",
          dueAt:
            "2026-08-06T07:00:00.000Z",
          priority: "MEDIUM",
          route:
            "/manager/deliveries",
        },
      ],

      recentRentals: [
        {
          id: "hn-rental-001",
          branchId: "branch-hanoi",
          branchName:
            "Chi nhánh Hà Nội",
          rentalCode:
            "DT-HN-0088",
          customerName:
            "Công ty Sự kiện Minh Anh",
          eventName:
            "Hội nghị khách hàng 2026",
          status: "ONGOING",
          totalAmount: 42500000,
          startDate: "2026-08-05",
          endDate: "2026-08-07",
        },
        {
          id: "hn-rental-002",
          branchId: "branch-hanoi",
          branchName:
            "Chi nhánh Hà Nội",
          rentalCode:
            "DT-HN-0072",
          customerName:
            "Công ty Sự kiện Việt",
          eventName:
            "Lễ kỷ niệm thành lập",
          status: "OVERDUE",
          totalAmount: 58400000,
          startDate: "2026-08-02",
          endDate: "2026-08-05",
        },
      ],

      equipmentStatus: [
        {
          status: "AVAILABLE",
          label: "Khả dụng",
          count: 126,
        },
        {
          status: "RENTED",
          label: "Đang cho thuê",
          count: 48,
        },
        {
          status: "RESERVED",
          label: "Đã giữ chỗ",
          count: 19,
        },
        {
          status: "MAINTENANCE",
          label: "Đang bảo trì",
          count: 7,
        },
        {
          status: "DAMAGED",
          label:
            "Hỏng hoặc chờ xử lý",
          count: 3,
        },
      ],
    },

    "branch-hcm": {
      summary: {
        activeRentals: {
          value: 5,
          changePercent: 9.2,
        },
        availableEquipment: {
          value: 98,
          changePercent: 4.7,
        },
        todayDeliveryTasks: {
          value: 4,
          changePercent: 11.5,
        },
        monthlyRevenue: {
          value: 142400000,
          changePercent: 10.8,
        },
        overdueRentals: 2,
        maintenanceDue: 5,
        pendingQuotationApprovals: 4,
        pendingContractApprovals: 2,
      },

      tasks: [
        {
          id: "hcm-task-quotation",
          branchId: "branch-hcm",
          branchName:
            "Chi nhánh TP. Hồ Chí Minh",
          type:
            "QUOTATION_APPROVAL",
          title:
            "Duyệt báo giá BG-HCM-0048",
          description:
            "Báo giá thuê sân khấu và ánh sáng trị giá 36.200.000 ₫.",
          dueAt:
            "2026-08-06T09:00:00.000Z",
          priority: "HIGH",
          route:
            "/manager/quotation-approvals",
        },
        {
          id: "hcm-task-delivery",
          branchId: "branch-hcm",
          branchName:
            "Chi nhánh TP. Hồ Chí Minh",
          type: "DELIVERY",
          title:
            "Theo dõi lịch giao GH-HCM-0034",
          description:
            "Giao thiết bị đến Trung tâm Hội nghị Tân Bình lúc 15:30.",
          dueAt:
            "2026-08-06T08:30:00.000Z",
          priority: "MEDIUM",
          route:
            "/manager/deliveries",
        },
      ],

      recentRentals: [
        {
          id: "hcm-rental-001",
          branchId: "branch-hcm",
          branchName:
            "Chi nhánh TP. Hồ Chí Minh",
          rentalCode:
            "DT-HCM-0052",
          customerName:
            "Công ty Truyền thông Phương Nam",
          eventName:
            "Triển lãm thương mại",
          status: "ONGOING",
          totalAmount: 39600000,
          startDate: "2026-08-05",
          endDate: "2026-08-08",
        },
        {
          id: "hcm-rental-002",
          branchId: "branch-hcm",
          branchName:
            "Chi nhánh TP. Hồ Chí Minh",
          rentalCode:
            "DT-HCM-0043",
          customerName:
            "Công ty Sự kiện Đông Nam",
          eventName:
            "Lễ khai trương",
          status: "OVERDUE",
          totalAmount: 33100000,
          startDate: "2026-08-03",
          endDate: "2026-08-05",
        },
      ],

      equipmentStatus: [
        {
          status: "AVAILABLE",
          label: "Khả dụng",
          count: 98,
        },
        {
          status: "RENTED",
          label: "Đang cho thuê",
          count: 36,
        },
        {
          status: "RESERVED",
          label: "Đã giữ chỗ",
          count: 14,
        },
        {
          status: "MAINTENANCE",
          label: "Đang bảo trì",
          count: 5,
        },
        {
          status: "DAMAGED",
          label:
            "Hỏng hoặc chờ xử lý",
          count: 2,
        },
      ],
    },

    "branch-danang": {
      summary: {
        activeRentals: {
          value: 2,
          changePercent: 5.4,
        },
        availableEquipment: {
          value: 54,
          changePercent: 3.1,
        },
        todayDeliveryTasks: {
          value: 2,
          changePercent: 6.5,
        },
        monthlyRevenue: {
          value: 86500000,
          changePercent: 8.6,
        },
        overdueRentals: 1,
        maintenanceDue: 3,
        pendingQuotationApprovals: 2,
        pendingContractApprovals: 1,
      },

      tasks: [
        {
          id: "dn-task-contract",
          branchId: "branch-danang",
          branchName:
            "Chi nhánh Đà Nẵng",
          type:
            "CONTRACT_APPROVAL",
          title:
            "Duyệt hợp đồng HD-DN-0019",
          description:
            "Hợp đồng thuê màn hình LED cho chương trình du lịch.",
          dueAt:
            "2026-08-06T10:00:00.000Z",
          priority: "HIGH",
          route:
            "/manager/contract-approvals",
        },
        {
          id: "dn-task-maintenance",
          branchId: "branch-danang",
          branchName:
            "Chi nhánh Đà Nẵng",
          type: "MAINTENANCE",
          title:
            "Thiết bị đến hạn bảo trì",
          description:
            "Có 3 thiết bị cần kiểm tra kỹ thuật trong tuần.",
          dueAt:
            "2026-08-08T02:00:00.000Z",
          priority: "LOW",
          route:
            "/manager/equipment",
        },
      ],

      recentRentals: [
        {
          id: "dn-rental-001",
          branchId: "branch-danang",
          branchName:
            "Chi nhánh Đà Nẵng",
          rentalCode:
            "DT-DN-0024",
          customerName:
            "Công ty Du lịch Miền Trung",
          eventName:
            "Hội nghị đối tác",
          status: "ONGOING",
          totalAmount: 26700000,
          startDate: "2026-08-05",
          endDate: "2026-08-07",
        },
        {
          id: "dn-rental-002",
          branchId: "branch-danang",
          branchName:
            "Chi nhánh Đà Nẵng",
          rentalCode:
            "DT-DN-0023",
          customerName:
            "Khách sạn Biển Xanh",
          eventName:
            "Gala dinner",
          status: "CONFIRMED",
          totalAmount: 21800000,
          startDate: "2026-08-08",
          endDate: "2026-08-08",
        },
      ],

      equipmentStatus: [
        {
          status: "AVAILABLE",
          label: "Khả dụng",
          count: 54,
        },
        {
          status: "RENTED",
          label: "Đang cho thuê",
          count: 18,
        },
        {
          status: "RESERVED",
          label: "Đã giữ chỗ",
          count: 8,
        },
        {
          status: "MAINTENANCE",
          label: "Đang bảo trì",
          count: 3,
        },
        {
          status: "DAMAGED",
          label:
            "Hỏng hoặc chờ xử lý",
          count: 1,
        },
      ],
    },
  };
