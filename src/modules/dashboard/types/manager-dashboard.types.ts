import type {
  ManagerScopeId,
} from "@/modules/manager-context/types/manager-context.types";

export type ManagerTaskPriority =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type ManagerTaskType =
  | "QUOTATION_APPROVAL"
  | "CONTRACT_APPROVAL"
  | "DELIVERY"
  | "RETURN"
  | "PAYMENT"
  | "MAINTENANCE";

export type ManagerRentalStatus =
  | "CONFIRMED"
  | "PREPARING"
  | "DELIVERING"
  | "ONGOING"
  | "OVERDUE"
  | "COMPLETED";

export type EquipmentAvailabilityStatus =
  | "AVAILABLE"
  | "RENTED"
  | "RESERVED"
  | "MAINTENANCE"
  | "DAMAGED";

export interface ManagerBranchSummary {
  id: string;
  organizationId: string;
  code: string;
  name: string;
  address: string;
  province: string;
  managerName: string;
  managerEmail: string;
}

export interface ManagerDashboardMetric {
  value: number;
  changePercent: number;
}

export interface ManagerDashboardSummary {
  activeRentals:
    ManagerDashboardMetric;
  availableEquipment:
    ManagerDashboardMetric;
  todayDeliveryTasks:
    ManagerDashboardMetric;
  monthlyRevenue:
    ManagerDashboardMetric;
  overdueRentals: number;
  maintenanceDue: number;
  pendingQuotationApprovals: number;
  pendingContractApprovals: number;
}

export interface ManagerDashboardTask {
  id: string;
  branchId?: string;
  branchName?: string;
  type: ManagerTaskType;
  title: string;
  description: string;
  dueAt: string;
  priority: ManagerTaskPriority;
  route: string;
}

export interface ManagerRecentRental {
  id: string;
  branchId?: string;
  branchName?: string;
  rentalCode: string;
  customerName: string;
  eventName: string;
  status: ManagerRentalStatus;
  totalAmount: number;
  startDate: string;
  endDate: string;
}

export interface EquipmentStatusReport {
  status:
    EquipmentAvailabilityStatus;
  label: string;
  count: number;
}

/**
 * Kiểu dữ liệu cũ dành cho Dashboard một chi nhánh.
 * Tạm giữ để giao diện hiện tại chưa bị lỗi trong lúc chuyển đổi.
 */
export interface ManagerDashboardData {
  branch: ManagerBranchSummary;
  summary:
    ManagerDashboardSummary;
  tasks: ManagerDashboardTask[];
  recentRentals:
    ManagerRecentRental[];
  equipmentStatus:
    EquipmentStatusReport[];
  generatedAt: string;
}

export type ManagerBranchDashboardSnapshot =
  Omit<
    ManagerDashboardData,
    "branch" | "generatedAt"
  >;

export interface ManagerDashboardScope {
  id: ManagerScopeId;
  label: string;
  code: string | null;
  description: string;
  branchCount: number;
  isAllBranches: boolean;
}

export interface ManagerBranchPerformance {
  id: string;
  code: string;
  name: string;
  province: string;
  employeeCount: number;
  activeRentalCount: number;
  availableEquipment: number;
  monthlyRevenue: number;
  overdueRentals: number;
  maintenanceDue: number;
}

export interface GetManagerDashboardInput {
  organizationId: string;
  assignedBranchIds: string[];
  selectedScopeId:
    ManagerScopeId;
  managerName: string;
}

export interface ManagerDashboardOverviewData {
  scope: ManagerDashboardScope;
  summary:
    ManagerDashboardSummary;
  tasks: ManagerDashboardTask[];
  recentRentals:
    ManagerRecentRental[];
  equipmentStatus:
    EquipmentStatusReport[];
  branchComparison:
    ManagerBranchPerformance[];
  generatedAt: string;
}
