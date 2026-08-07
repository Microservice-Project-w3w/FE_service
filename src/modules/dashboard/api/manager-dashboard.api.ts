import {
  initialBranches,
} from "@/modules/branches/mocks/branches.mock";

import {
  managerDashboardMockByBranchId,
} from "@/modules/dashboard/mocks/manager-dashboard.mock";

import type {
  EquipmentAvailabilityStatus,
  EquipmentStatusReport,
  GetManagerDashboardInput,
  ManagerBranchDashboardSnapshot,
  ManagerDashboardMetric,
  ManagerDashboardOverviewData,
} from "@/modules/dashboard/types/manager-dashboard.types";

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

const equipmentStatuses:
  EquipmentAvailabilityStatus[] = [
    "AVAILABLE",
    "RENTED",
    "RESERVED",
    "MAINTENANCE",
    "DAMAGED",
  ];

const equipmentLabels: Record<
  EquipmentAvailabilityStatus,
  string
> = {
  AVAILABLE: "Khả dụng",
  RENTED: "Đang cho thuê",
  RESERVED: "Đã giữ chỗ",
  MAINTENANCE: "Đang bảo trì",
  DAMAGED:
    "Hỏng hoặc chờ xử lý",
};

const getSnapshot = (
  branchId: string,
): ManagerBranchDashboardSnapshot => {
  const snapshot =
    managerDashboardMockByBranchId[
      branchId
    ];

  if (!snapshot) {
    throw new Error(
      `Chi nhánh ${branchId} chưa có dữ liệu Dashboard.`,
    );
  }

  return snapshot;
};

const aggregateMetric = (
  snapshots:
    ManagerBranchDashboardSnapshot[],
  selector: (
    snapshot:
      ManagerBranchDashboardSnapshot,
  ) => ManagerDashboardMetric,
): ManagerDashboardMetric => {
  const metrics =
    snapshots.map(selector);

  return {
    value: metrics.reduce(
      (sum, metric) =>
        sum + metric.value,
      0,
    ),

    changePercent:
      metrics.length === 0
        ? 0
        : metrics.reduce(
            (sum, metric) =>
              sum +
              metric.changePercent,
            0,
          ) / metrics.length,
  };
};

export const managerDashboardApi = {
  async getOverview(
    input: GetManagerDashboardInput,
  ): Promise<
    ManagerDashboardOverviewData
  > {
    await delay();

    const assignedBranches =
      initialBranches.filter(
        (branch) =>
          input.assignedBranchIds
            .includes(branch.id) &&
          branch.organizationId ===
            input.organizationId &&
          branch.status === "ACTIVE",
      );

    if (
      assignedBranches.length === 0
    ) {
      throw new Error(
        "Không tìm thấy chi nhánh trong phạm vi quản lý.",
      );
    }

    const selectedBranches =
      input.selectedScopeId ===
      "ALL"
        ? assignedBranches
        : assignedBranches.filter(
            (branch) =>
              branch.id ===
              input.selectedScopeId,
          );

    if (
      selectedBranches.length === 0
    ) {
      throw new Error(
        "Chi nhánh đã chọn không thuộc phạm vi quản lý.",
      );
    }

    const selectedSnapshots =
      selectedBranches.map(
        (branch) =>
          getSnapshot(branch.id),
      );

    const equipmentStatus:
      EquipmentStatusReport[] =
      equipmentStatuses.map(
        (status) => ({
          status,
          label:
            equipmentLabels[status],
          count:
            selectedSnapshots.reduce(
              (total, snapshot) =>
                total +
                (
                  snapshot.equipmentStatus
                    .find(
                      (item) =>
                        item.status ===
                        status,
                    )?.count ?? 0
                ),
              0,
            ),
        }),
      );

    const priorityOrder = {
      HIGH: 0,
      MEDIUM: 1,
      LOW: 2,
    } as const;

    const tasks =
      selectedSnapshots
        .flatMap(
          (snapshot) =>
            snapshot.tasks,
        )
        .sort(
          (first, second) =>
            priorityOrder[
              first.priority
            ] -
              priorityOrder[
                second.priority
              ] ||
            new Date(
              first.dueAt,
            ).getTime() -
              new Date(
                second.dueAt,
              ).getTime(),
        );

    const recentRentals =
      selectedSnapshots
        .flatMap(
          (snapshot) =>
            snapshot.recentRentals,
        )
        .sort(
          (first, second) =>
            new Date(
              second.startDate,
            ).getTime() -
            new Date(
              first.startDate,
            ).getTime(),
        );

    const selectedBranch =
      selectedBranches[0];

    return {
      scope:
        input.selectedScopeId ===
        "ALL"
          ? {
              id: "ALL",
              label:
                "Tất cả chi nhánh được phân công",
              code: null,
              description:
                `Tổng hợp ${selectedBranches.length} chi nhánh đang hoạt động`,
              branchCount:
                selectedBranches.length,
              isAllBranches: true,
            }
          : {
              id:
                selectedBranch.id,
              label:
                selectedBranch.name,
              code:
                selectedBranch.branchCode,
              description:
                `${selectedBranch.address}, ${selectedBranch.province}`,
              branchCount: 1,
              isAllBranches: false,
            },

      summary: {
        activeRentals:
          aggregateMetric(
            selectedSnapshots,
            (snapshot) =>
              snapshot.summary
                .activeRentals,
          ),

        availableEquipment:
          aggregateMetric(
            selectedSnapshots,
            (snapshot) =>
              snapshot.summary
                .availableEquipment,
          ),

        todayDeliveryTasks:
          aggregateMetric(
            selectedSnapshots,
            (snapshot) =>
              snapshot.summary
                .todayDeliveryTasks,
          ),

        monthlyRevenue:
          aggregateMetric(
            selectedSnapshots,
            (snapshot) =>
              snapshot.summary
                .monthlyRevenue,
          ),

        overdueRentals:
          selectedSnapshots.reduce(
            (sum, snapshot) =>
              sum +
              snapshot.summary
                .overdueRentals,
            0,
          ),

        maintenanceDue:
          selectedSnapshots.reduce(
            (sum, snapshot) =>
              sum +
              snapshot.summary
                .maintenanceDue,
            0,
          ),

        pendingQuotationApprovals:
          selectedSnapshots.reduce(
            (sum, snapshot) =>
              sum +
              snapshot.summary
                .pendingQuotationApprovals,
            0,
          ),

        pendingContractApprovals:
          selectedSnapshots.reduce(
            (sum, snapshot) =>
              sum +
              snapshot.summary
                .pendingContractApprovals,
            0,
          ),
      },

      tasks,
      recentRentals,
      equipmentStatus,

      branchComparison:
        assignedBranches
          .map((branch) => {
            const snapshot =
              getSnapshot(branch.id);

            return {
              id: branch.id,
              code:
                branch.branchCode,
              name: branch.name,
              province:
                branch.province,
              employeeCount:
                branch.employeeCount,
              activeRentalCount:
                snapshot.summary
                  .activeRentals
                  .value,
              availableEquipment:
                snapshot.summary
                  .availableEquipment
                  .value,
              monthlyRevenue:
                snapshot.summary
                  .monthlyRevenue
                  .value,
              overdueRentals:
                snapshot.summary
                  .overdueRentals,
              maintenanceDue:
                snapshot.summary
                  .maintenanceDue,
            };
          })
          .sort(
            (first, second) =>
              second.monthlyRevenue -
              first.monthlyRevenue,
          ),

      generatedAt:
        new Date().toISOString(),
    };
  },
};
