export type ReportPeriod =
  | "THIS_MONTH"
  | "LAST_MONTH"
  | "THIS_QUARTER"
  | "THIS_YEAR";

export type ReportTrend =
  | "UP"
  | "DOWN"
  | "STABLE";

export type RentalReportStatus =
  | "DRAFT"
  | "CONFIRMED"
  | "ONGOING"
  | "COMPLETED"
  | "OVERDUE";

export interface ReportPeriodOption {
  value: ReportPeriod;
  label: string;
}

export interface ReportMetric {
  value: number;
  changePercent: number;
  trend: ReportTrend;
}

export interface AdminReportSummary {
  totalRevenue: ReportMetric;
  totalRentals: ReportMetric;
  utilizationRate: ReportMetric;
  overdueRentals: ReportMetric;
}

export interface RevenueTrendPoint {
  label: string;
  revenue: number;
  rentalCount: number;
}

export interface RentalStatusReportItem {
  status: RentalReportStatus;
  label: string;
  count: number;
}

export interface BranchPerformanceReport {
  id: string;
  code: string;
  name: string;
  revenue: number;
  rentalCount: number;
  utilizationRate: number;
}

export interface CategoryPerformanceReport {
  id: string;
  code: string;
  name: string;
  revenue: number;
  equipmentCount: number;
  utilizationRate: number;
}

export interface AdminReportData {
  period: ReportPeriod;
  generatedAt: string;
  summary: AdminReportSummary;
  revenueTrend: RevenueTrendPoint[];
  rentalStatus: RentalStatusReportItem[];
  topBranches: BranchPerformanceReport[];
  topCategories: CategoryPerformanceReport[];
}
