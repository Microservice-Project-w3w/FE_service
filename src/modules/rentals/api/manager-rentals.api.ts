import {
  cloneManagerRentalMockData,
} from "@/modules/rentals/mocks/manager-rentals.mock";

import type {
  CancelManagerRentalInput,
  ConfirmRentalReservationInput,
  ExtendManagerRentalInput,
  GetManagerRentalsInput,
  ManagerRental,
  ManagerRentalListData,
  ManagerRentalSummary,
} from "@/modules/rentals/types/manager-rental.types";

const MOCK_NOW =
  new Date(
    "2026-08-07T08:11:00+07:00",
  );

const MOCK_DELAY_MS = 250;

let rentals =
  cloneManagerRentalMockData();

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

const cloneRental = (
  rental: ManagerRental,
): ManagerRental =>
  structuredClone(rental);

const findRentalIndex = (
  rentalId: string,
) =>
  rentals.findIndex(
    (rental) =>
      rental.id === rentalId,
  );

const requireRental = (
  rentalId: string,
): ManagerRental => {
  const rental =
    rentals.find(
      (item) =>
        item.id === rentalId,
    );

  if (!rental) {
    throw new Error(
      "Không tìm thấy đơn thuê.",
    );
  }

  return rental;
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

const getSummary = (
  scopedRentals: ManagerRental[],
): ManagerRentalSummary => {
  const activeStatuses =
    new Set([
      "RESERVED",
      "CONFIRMED",
      "ACTIVE",
      "OVERDUE",
      "RETURNING",
    ]);

  return {
    totalCount:
      scopedRentals.length,

    activeCount:
      scopedRentals.filter(
        (rental) =>
          activeStatuses.has(
            rental.status,
          ),
      ).length,

    overdueCount:
      scopedRentals.filter(
        (rental) =>
          rental.status ===
          "OVERDUE",
      ).length,

    dueTodayCount:
      scopedRentals.filter(
        (rental) =>
          isSameLocalDate(
            new Date(
              rental.expectedReturnDate,
            ),
            MOCK_NOW,
          ) &&
          rental.status !==
            "COMPLETED" &&
          rental.status !==
            "CANCELLED",
      ).length,

    outstandingAmount:
      scopedRentals
        .filter(
          (rental) =>
            rental.status !==
            "CANCELLED",
        )
        .reduce(
          (
            total,
            rental,
          ) =>
            total +
            rental.outstandingAmount,
          0,
        ),
  };
};

const getScopedRentals = ({
  assignedBranchIds,
  selectedScopeId,
}: GetManagerRentalsInput) => {
  const assignedBranchSet =
    new Set(
      assignedBranchIds,
    );

  return rentals.filter(
    (rental) => {
      const belongsToAssignedBranch =
        assignedBranchSet.has(
          rental.branchId,
        );

      const matchesSelectedScope =
        selectedScopeId === "ALL" ||
        rental.branchId ===
          selectedScopeId;

      return (
        belongsToAssignedBranch &&
        matchesSelectedScope
      );
    },
  );
};

const getList = async (
  input: GetManagerRentalsInput,
): Promise<ManagerRentalListData> => {
  await delay();

  const scopedRentals =
    getScopedRentals(input)
      .sort(
        (first, second) =>
          new Date(
            second.createdAt,
          ).getTime() -
          new Date(
            first.createdAt,
          ).getTime(),
      );

  return {
    summary:
      getSummary(scopedRentals),

    rentals:
      structuredClone(
        scopedRentals,
      ),

    generatedAt:
      MOCK_NOW.toISOString(),
  };
};

const getById = async (
  rentalId: string,
): Promise<ManagerRental> => {
  await delay();

  return cloneRental(
    requireRental(rentalId),
  );
};

const confirmReservation =
  async ({
    rentalId,
    actorId,
    actorName,
    note,
  }: ConfirmRentalReservationInput): Promise<ManagerRental> => {
    await delay();

    const rental =
      requireRental(rentalId);

    if (
      rental.status !==
        "PENDING_CONFIRMATION" &&
      rental.status !==
        "RESERVED"
    ) {
      throw new Error(
        "Chỉ có thể giữ chỗ cho đơn đang chờ xác nhận hoặc đã tạo giữ chỗ.",
      );
    }

    if (
      rental.reservationStatus ===
      "HELD"
    ) {
      throw new Error(
        "Thiết bị của đơn thuê đã được giữ chỗ.",
      );
    }

    const updatedRental: ManagerRental =
      {
        ...rental,

        status: "RESERVED",

        reservationStatus:
          "HELD",

        equipmentItems:
          rental.equipmentItems.map(
            (item) => ({
              ...item,

              allocatedQuantity:
                item.requestedQuantity,
            }),
          ),

        history: [
          ...rental.history,
          {
            id:
              `history-${rental.id}-${Date.now()}`,

            action: "RESERVED",

            actorId,
            actorName,

            note:
              note?.trim() ||
              "Đã giữ đủ số lượng thiết bị cho đơn thuê.",

            createdAt:
              new Date().toISOString(),
          },
        ],
      };

    const rentalIndex =
      findRentalIndex(rentalId);

    rentals[rentalIndex] =
      updatedRental;

    return cloneRental(
      updatedRental,
    );
  };

const extend = async ({
  rentalId,
  actorId,
  actorName,
  newEndDate,
  note,
}: ExtendManagerRentalInput): Promise<ManagerRental> => {
  await delay();

  const rental =
    requireRental(rentalId);

  const allowedStatuses =
    new Set([
      "RESERVED",
      "CONFIRMED",
      "ACTIVE",
      "OVERDUE",
    ]);

  if (
    !allowedStatuses.has(
      rental.status,
    )
  ) {
    throw new Error(
      "Trạng thái hiện tại không cho phép gia hạn đơn thuê.",
    );
  }

  const currentEndDate =
    new Date(
      rental.rentalEndDate,
    );

  const nextEndDate =
    new Date(newEndDate);

  if (
    Number.isNaN(
      nextEndDate.getTime(),
    )
  ) {
    throw new Error(
      "Ngày kết thúc mới không hợp lệ.",
    );
  }

  if (
    nextEndDate.getTime() <=
    currentEndDate.getTime()
  ) {
    throw new Error(
      "Ngày kết thúc mới phải sau ngày kết thúc hiện tại.",
    );
  }

  const currentExpectedReturn =
    new Date(
      rental.expectedReturnDate,
    );

  const returnDelay =
    Math.max(
      0,
      currentExpectedReturn.getTime() -
        currentEndDate.getTime(),
    );

  const nextExpectedReturn =
    new Date(
      nextEndDate.getTime() +
        returnDelay,
    );

  const updatedRental: ManagerRental =
    {
      ...rental,

      rentalEndDate:
        nextEndDate.toISOString(),

      expectedReturnDate:
        nextExpectedReturn.toISOString(),

      status:
        rental.status === "OVERDUE"
          ? "ACTIVE"
          : rental.status,

      lateFee:
        rental.status === "OVERDUE"
          ? 0
          : rental.lateFee,

      extensionCount:
        rental.extensionCount + 1,

      history: [
        ...rental.history,
        {
          id:
            `history-${rental.id}-${Date.now()}`,

          action: "EXTENDED",

          actorId,
          actorName,

          note:
            note?.trim() ||
            `Gia hạn đơn thuê đến ${nextEndDate.toLocaleString(
              "vi-VN",
            )}.`,

          createdAt:
            new Date().toISOString(),
        },
      ],
    };

  const rentalIndex =
    findRentalIndex(rentalId);

  rentals[rentalIndex] =
    updatedRental;

  return cloneRental(
    updatedRental,
  );
};

const cancel = async ({
  rentalId,
  actorId,
  actorName,
  reason,
}: CancelManagerRentalInput): Promise<ManagerRental> => {
  await delay();

  const normalizedReason =
    reason.trim();

  if (!normalizedReason) {
    throw new Error(
      "Bắt buộc nhập lý do hủy đơn thuê.",
    );
  }

  const rental =
    requireRental(rentalId);

  const cancellableStatuses =
    new Set([
      "PENDING_CONFIRMATION",
      "RESERVED",
      "CONFIRMED",
    ]);

  if (
    !cancellableStatuses.has(
      rental.status,
    )
  ) {
    throw new Error(
      "Chỉ có thể hủy đơn chưa bắt đầu cho thuê.",
    );
  }

  const updatedRental: ManagerRental =
    {
      ...rental,

      status: "CANCELLED",

      reservationStatus:
        rental.reservationStatus ===
        "NOT_REQUIRED"
          ? "NOT_REQUIRED"
          : "RELEASED",

      reservationExpiresAt:
        null,

      outstandingAmount: 0,

      equipmentItems:
        rental.equipmentItems.map(
          (item) => ({
            ...item,
            allocatedQuantity: 0,
            deliveredQuantity: 0,
          }),
        ),

      note: normalizedReason,

      history: [
        ...rental.history,
        {
          id:
            `history-${rental.id}-${Date.now()}`,

          action: "CANCELLED",

          actorId,
          actorName,

          note: normalizedReason,

          createdAt:
            new Date().toISOString(),
        },
      ],
    };

  const rentalIndex =
    findRentalIndex(rentalId);

  rentals[rentalIndex] =
    updatedRental;

  return cloneRental(
    updatedRental,
  );
};

const resetMockData = async () => {
  await delay();

  rentals =
    cloneManagerRentalMockData();
};

export const managerRentalsApi = {
  getList,
  getById,
  confirmReservation,
  extend,
  cancel,
  resetMockData,
};
