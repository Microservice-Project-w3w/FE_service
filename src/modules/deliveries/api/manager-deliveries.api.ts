import {
  cloneManagerDeliveryMockData,
} from "@/modules/deliveries/mocks/manager-deliveries.mock";

import type {
  GetManagerDeliveriesInput,
  ManagerDeliveryListData,
  ManagerDeliverySummary,
  ManagerDeliveryTask,
} from "@/modules/deliveries/types/manager-delivery.types";

const MOCK_NOW =
  new Date(
    "2026-08-07T22:08:00+07:00",
  );

const MOCK_DELAY_MS = 250;

let deliveryTasks =
  cloneManagerDeliveryMockData();

const delay = async () => {
  await new Promise<void>(
    (resolve) => {
      window.setTimeout(
        resolve,
        MOCK_DELAY_MS,
      );
    },
  );
};

const cloneTask = (
  task: ManagerDeliveryTask,
): ManagerDeliveryTask =>
  structuredClone(task);

const requireTask = (
  taskId: string,
): ManagerDeliveryTask => {
  const task =
    deliveryTasks.find(
      (item) =>
        item.id === taskId,
    );

  if (!task) {
    throw new Error(
      "Không tìm thấy nhiệm vụ giao nhận.",
    );
  }

  return task;
};

const isSameLocalDate = (
  first: Date,
  second: Date,
) =>
  first.getFullYear() ===
    second.getFullYear() &&
  first.getMonth() ===
    second.getMonth() &&
  first.getDate() ===
    second.getDate();

const getScopedTasks = ({
  assignedBranchIds,
  selectedScopeId,
}: GetManagerDeliveriesInput) => {
  const assignedBranchSet =
    new Set(
      assignedBranchIds,
    );

  return deliveryTasks.filter(
    (task) => {
      const belongsToAssignedBranch =
        assignedBranchSet.has(
          task.branchId,
        );

      const matchesSelectedScope =
        selectedScopeId === "ALL" ||
        task.branchId ===
          selectedScopeId;

      return (
        belongsToAssignedBranch &&
        matchesSelectedScope
      );
    },
  );
};

const getSummary = (
  tasks: ManagerDeliveryTask[],
): ManagerDeliverySummary => {
  const inProgressStatuses =
    new Set([
      "PREPARING",
      "READY",
      "IN_TRANSIT",
      "ARRIVED",
    ]);

  return {
    totalCount:
      tasks.length,

    scheduledTodayCount:
      tasks.filter(
        (task) =>
          isSameLocalDate(
            new Date(
              task.scheduledAt,
            ),
            MOCK_NOW,
          ) &&
          task.status !==
            "COMPLETED" &&
          task.status !==
            "CANCELLED",
      ).length,

    inProgressCount:
      tasks.filter(
        (task) =>
          inProgressStatuses.has(
            task.status,
          ),
      ).length,

    delayedCount:
      tasks.filter(
        (task) =>
          task.status ===
          "DELAYED",
      ).length,

    completedTodayCount:
      tasks.filter(
        (task) =>
          task.status ===
            "COMPLETED" &&
          task.completedAt !==
            null &&
          isSameLocalDate(
            new Date(
              task.completedAt,
            ),
            MOCK_NOW,
          ),
      ).length,

    issueCount:
      tasks.reduce(
        (
          total,
          task,
        ) =>
          total +
          task.issueCount,
        0,
      ),
  };
};

const getList = async (
  input: GetManagerDeliveriesInput,
): Promise<ManagerDeliveryListData> => {
  await delay();

  const tasks =
    getScopedTasks(input)
      .sort(
        (
          first,
          second,
        ) =>
          new Date(
            first.scheduledAt,
          ).getTime() -
          new Date(
            second.scheduledAt,
          ).getTime(),
      );

  return {
    summary:
      getSummary(tasks),

    tasks:
      structuredClone(tasks),

    generatedAt:
      MOCK_NOW.toISOString(),
  };
};

const getById = async (
  taskId: string,
): Promise<ManagerDeliveryTask> => {
  await delay();

  return cloneTask(
    requireTask(taskId),
  );
};

const resetMockData =
  async () => {
    await delay();

    deliveryTasks =
      cloneManagerDeliveryMockData();
  };

export const managerDeliveriesApi = {
  getList,
  getById,
  resetMockData,
};
