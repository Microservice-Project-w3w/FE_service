import { createSafeDateFormatter } from "@/shared/utils/dateFormat";
import {
  Boxes,
  CalendarClock,
  ClipboardList,
  PackageCheck,
  Warehouse,
  Wrench,
  X,
} from "lucide-react";
import {
  useEffect,
} from "react";

import {
  ManagerEquipmentConditionBadge,
  ManagerEquipmentStatusBadge,
  ManagerMaintenanceStatusBadge,
} from "@/modules/equipment/components/ManagerEquipmentBadge";

import type {
  ManagerEquipment,
} from "@/modules/equipment/types/manager-equipment.types";

interface ManagerEquipmentDetailDrawerProps {
  equipment:
    ManagerEquipment | null;

  isLoading?: boolean;

  onClose: () => void;
}

const dateTimeFormatter =
  createSafeDateFormatter(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

const formatDateTime = (
  value: string | null,
) => {
  if (!value) {
    return "Chưa ghi nhận";
  }

  return dateTimeFormatter.format(
    new Date(value),
  );
};

export const ManagerEquipmentDetailDrawer = ({
  equipment,
  isLoading = false,
  onClose,
}: ManagerEquipmentDetailDrawerProps) => {
  useEffect(() => {
    if (!equipment) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    equipment,
    onClose,
  ]);

  if (!equipment) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/30 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Đóng chi tiết"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />

      <aside className="relative z-10 flex h-full w-full max-w-3xl flex-col bg-slate-50 shadow-2xl">
        <header className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <ManagerEquipmentStatusBadge
                  status={
                    equipment.status
                  }
                />

                <ManagerEquipmentConditionBadge
                  condition={
                    equipment.condition
                  }
                />
              </div>

              <h2 className="mt-3 text-xl font-bold text-slate-900">
                {
                  equipment.equipmentCode
                }
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {
                  equipment.equipmentName
                }
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {
                  equipment.branchName
                }
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <X size={19} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({
                length: 5,
              }).map(
                (
                  _,
                  index,
                ) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-2xl bg-slate-200/70"
                  />
                ),
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <ClipboardList
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Thông tin thiết bị
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Danh mục
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {
                        equipment.categoryName
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Cập nhật gần nhất
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {formatDateTime(
                        equipment.updatedAt,
                      )}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Warehouse
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Kho và chi nhánh
                  </h3>
                </div>

                <p className="font-semibold text-slate-900">
                  {
                    equipment.warehouseName
                  }
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {
                    equipment.branchName
                  }
                </p>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <Boxes
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Phân bổ số lượng
                  </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    [
                      "Tổng số",
                      equipment.totalQuantity,
                    ],
                    [
                      "Khả dụng",
                      equipment.availableQuantity,
                    ],
                    [
                      "Đang thuê",
                      equipment.rentedQuantity,
                    ],
                    [
                      "Giữ chỗ",
                      equipment.reservedQuantity,
                    ],
                    [
                      "Bảo trì",
                      equipment.maintenanceQuantity,
                    ],
                    [
                      "Hư hỏng",
                      equipment.damagedQuantity,
                    ],
                  ].map(
                    ([
                      label,
                      value,
                    ]) => (
                      <div
                        key={
                          String(
                            label,
                          )
                        }
                        className="rounded-xl bg-slate-50 p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {label}
                        </p>

                        <p
                          className={[
                            "mt-2 text-xl font-bold",
                            label ===
                              "Hư hỏng" &&
                            Number(
                              value,
                            ) > 0
                              ? "text-rose-600"
                              : label ===
                                  "Khả dụng"
                                ? "text-blue-700"
                                : "text-slate-900",
                          ].join(
                            " ",
                          )}
                        >
                          {value}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <PackageCheck
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Đơn thuê đang liên quan
                  </h3>
                </div>

                {equipment.currentRentalCodes.length ===
                0 ? (
                  <p className="text-sm text-slate-500">
                    Không có đơn thuê đang liên quan.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {equipment.currentRentalCodes.map(
                      (
                        rentalCode,
                      ) => (
                        <span
                          key={
                            rentalCode
                          }
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700"
                        >
                          {
                            rentalCode
                          }
                        </span>
                      ),
                    )}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarClock
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Lịch bảo trì
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Bảo trì gần nhất
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {formatDateTime(
                        equipment.lastMaintenanceAt,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Bảo trì tiếp theo
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {formatDateTime(
                        equipment.nextMaintenanceAt,
                      )}
                    </p>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                  <Wrench
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Lịch sử bảo trì
                  </h3>
                </div>

                {equipment.maintenanceHistory.length ===
                0 ? (
                  <div className="px-6 py-10 text-center text-sm text-slate-500">
                    Chưa có lịch sử bảo trì.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {[...equipment.maintenanceHistory]
                      .sort(
                        (
                          first,
                          second,
                        ) =>
                          new Date(
                            second.scheduledAt,
                          ).getTime() -
                          new Date(
                            first.scheduledAt,
                          ).getTime(),
                      )
                      .map(
                        (
                          record,
                        ) => (
                          <div
                            key={
                              record.id
                            }
                            className="px-5 py-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <ManagerMaintenanceStatusBadge
                                  status={
                                    record.status
                                  }
                                />

                                <p className="mt-3 font-semibold text-slate-700">
                                  {
                                    record.description
                                  }
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                  Kỹ thuật viên:{" "}
                                  {record.technicianName ??
                                    "Chưa phân công"}
                                </p>
                              </div>

                              <p className="text-xs font-medium text-slate-400">
                                {formatDateTime(
                                  record.scheduledAt,
                                )}
                              </p>
                            </div>

                            {record.note && (
                              <p className="mt-3 text-sm leading-6 text-slate-500">
                                {
                                  record.note
                                }
                              </p>
                            )}
                          </div>
                        ),
                      )}
                  </div>
                )}
              </section>

              {equipment.note && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Ghi chú
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {
                      equipment.note
                    }
                  </p>
                </section>
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
