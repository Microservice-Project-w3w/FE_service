import {
  cloneManagerEquipmentMockData,
} from "@/modules/equipment/mocks/manager-equipment.mock";

import type {
  GetManagerEquipmentInput,
  ManagerEquipment,
  ManagerEquipmentListData,
  ManagerEquipmentSummary,
} from "@/modules/equipment/types/manager-equipment.types";

const MOCK_NOW =
  new Date(
    "2026-08-07T23:10:00+07:00",
  );

const MAINTENANCE_WARNING_DAYS = 7;

const MOCK_DELAY_MS = 250;

let equipment =
  cloneManagerEquipmentMockData();

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

const requireEquipment = (
  equipmentId: string,
) => {
  const item =
    equipment.find(
      (current) =>
        current.id ===
        equipmentId,
    );

  if (!item) {
    throw new Error(
      "Không tìm thấy thiết bị.",
    );
  }

  return item;
};

const getScopedEquipment = ({
  assignedBranchIds,
  selectedScopeId,
}: GetManagerEquipmentInput) => {
  const assignedBranchSet =
    new Set(
      assignedBranchIds,
    );

  return equipment.filter(
    (item) =>
      assignedBranchSet.has(
        item.branchId,
      ) &&
      (
        selectedScopeId ===
          "ALL" ||
        item.branchId ===
          selectedScopeId
      ),
  );
};

const getSummary = (
  items: ManagerEquipment[],
): ManagerEquipmentSummary => {
  const warningLimit =
    new Date(MOCK_NOW);

  warningLimit.setDate(
    warningLimit.getDate() +
      MAINTENANCE_WARNING_DAYS,
  );

  return {
    totalQuantity:
      items.reduce(
        (
          total,
          item,
        ) =>
          total +
          item.totalQuantity,
        0,
      ),

    availableQuantity:
      items.reduce(
        (
          total,
          item,
        ) =>
          total +
          item.availableQuantity,
        0,
      ),

    rentedQuantity:
      items.reduce(
        (
          total,
          item,
        ) =>
          total +
          item.rentedQuantity,
        0,
      ),

    reservedQuantity:
      items.reduce(
        (
          total,
          item,
        ) =>
          total +
          item.reservedQuantity,
        0,
      ),

    maintenanceQuantity:
      items.reduce(
        (
          total,
          item,
        ) =>
          total +
          item.maintenanceQuantity,
        0,
      ),

    damagedQuantity:
      items.reduce(
        (
          total,
          item,
        ) =>
          total +
          item.damagedQuantity,
        0,
      ),

    maintenanceDueCount:
      items.filter(
        (item) => {
          if (
            !item.nextMaintenanceAt
          ) {
            return false;
          }

          return (
            new Date(
              item.nextMaintenanceAt,
            ) <= warningLimit
          );
        },
      ).length,
  };
};

const getList = async (
  input: GetManagerEquipmentInput,
): Promise<ManagerEquipmentListData> => {
  await delay();

  const scopedEquipment =
    getScopedEquipment(
      input,
    ).sort(
      (
        first,
        second,
      ) =>
        first.equipmentCode.localeCompare(
          second.equipmentCode,
        ),
    );

  return {
    summary:
      getSummary(
        scopedEquipment,
      ),

    equipment:
      structuredClone(
        scopedEquipment,
      ),

    generatedAt:
      MOCK_NOW.toISOString(),
  };
};

const getById = async (
  equipmentId: string,
): Promise<ManagerEquipment> => {
  await delay();

  return structuredClone(
    requireEquipment(
      equipmentId,
    ),
  );
};

export const managerEquipmentApi = {
  getList,
  getById,
};
