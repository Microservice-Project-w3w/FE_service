import {
  adminReportMockData,
} from "@/modules/reports/mocks/admin-reports.mock";

import type {
  AdminReportData,
  ReportPeriod,
} from "@/modules/reports/types/admin-report.types";

const delay = async (
  milliseconds = 220,
): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(
      resolve,
      milliseconds,
    );
  });
};

const cloneReport = (
  report: AdminReportData,
): AdminReportData => {
  return structuredClone(report);
};

export const adminReportsApi = {
  async getOverview(
    period: ReportPeriod,
  ): Promise<AdminReportData> {
    await delay();

    const report =
      adminReportMockData[period];

    return {
      ...cloneReport(report),
      generatedAt:
        new Date().toISOString(),
    };
  },
};
