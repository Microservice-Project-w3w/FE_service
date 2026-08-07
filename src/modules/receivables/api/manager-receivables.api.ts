import {
  cloneManagerReceivableMockData,
} from "@/modules/receivables/mocks/manager-receivables.mock";

import type {
  GetManagerReceivablesInput,
  ManagerReceivable,
  ManagerReceivableListData,
  ManagerReceivableSummary,
} from "@/modules/receivables/types/manager-receivable.types";

const MOCK_NOW =
  new Date(
    "2026-08-07T22:32:00+07:00",
  );

const DUE_SOON_DAYS = 3;

const MOCK_DELAY_MS = 250;

let receivables =
  cloneManagerReceivableMockData();

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

const cloneReceivable = (
  receivable: ManagerReceivable,
): ManagerReceivable =>
  structuredClone(receivable);

const requireReceivable = (
  receivableId: string,
) => {
  const receivable =
    receivables.find(
      (item) =>
        item.id ===
        receivableId,
    );

  if (!receivable) {
    throw new Error(
      "Không tìm thấy công nợ.",
    );
  }

  return receivable;
};

const getScopedReceivables = ({
  assignedBranchIds,
  selectedScopeId,
}: GetManagerReceivablesInput) => {
  const assignedBranchSet =
    new Set(
      assignedBranchIds,
    );

  return receivables.filter(
    (receivable) => {
      const belongsToAssignedBranch =
        assignedBranchSet.has(
          receivable.branchId,
        );

      const matchesSelectedScope =
        selectedScopeId === "ALL" ||
        receivable.branchId ===
          selectedScopeId;

      return (
        belongsToAssignedBranch &&
        matchesSelectedScope
      );
    },
  );
};

const getSummary = (
  items: ManagerReceivable[],
): ManagerReceivableSummary => {
  const dueSoonLimit =
    new Date(MOCK_NOW);

  dueSoonLimit.setDate(
    dueSoonLimit.getDate() +
      DUE_SOON_DAYS,
  );

  return {
    totalBilledAmount:
      items.reduce(
        (
          total,
          item,
        ) =>
          total +
          item.totalAmount,
        0,
      ),

    paidAmount:
      items.reduce(
        (
          total,
          item,
        ) =>
          total +
          item.paidAmount,
        0,
      ),

    outstandingAmount:
      items.reduce(
        (
          total,
          item,
        ) =>
          total +
          item.outstandingAmount,
        0,
      ),

    overdueAmount:
      items
        .filter(
          (item) =>
            item.status ===
            "OVERDUE",
        )
        .reduce(
          (
            total,
            item,
          ) =>
            total +
            item.outstandingAmount,
          0,
        ),

    dueSoonAmount:
      items
        .filter(
          (item) => {
            if (
              item.status ===
                "PAID" ||
              item.status ===
                "OVERDUE"
            ) {
              return false;
            }

            const dueDate =
              new Date(
                item.dueDate,
              );

            return (
              dueDate >
                MOCK_NOW &&
              dueDate <=
                dueSoonLimit
            );
          },
        )
        .reduce(
          (
            total,
            item,
          ) =>
            total +
            item.outstandingAmount,
          0,
        ),

    overdueCount:
      items.filter(
        (item) =>
          item.status ===
          "OVERDUE",
      ).length,
  };
};

const getList = async (
  input: GetManagerReceivablesInput,
): Promise<ManagerReceivableListData> => {
  await delay();

  const scopedReceivables =
    getScopedReceivables(
      input,
    ).sort(
      (
        first,
        second,
      ) =>
        new Date(
          first.dueDate,
        ).getTime() -
        new Date(
          second.dueDate,
        ).getTime(),
    );

  return {
    summary:
      getSummary(
        scopedReceivables,
      ),

    receivables:
      structuredClone(
        scopedReceivables,
      ),

    generatedAt:
      MOCK_NOW.toISOString(),
  };
};

const getById = async (
  receivableId: string,
): Promise<ManagerReceivable> => {
  await delay();

  return cloneReceivable(
    requireReceivable(
      receivableId,
    ),
  );
};

const resetMockData =
  async () => {
    await delay();

    receivables =
      cloneManagerReceivableMockData();
  };

export const managerReceivablesApi = {
  getList,
  getById,
  resetMockData,
};
