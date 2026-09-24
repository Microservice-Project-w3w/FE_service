import {
  Eye,
} from "lucide-react";

import {
  ManagerEquipmentConditionBadge,
  ManagerEquipmentStatusBadge,
} from "@/modules/equipment/components/ManagerEquipmentBadge";

import type {
  ManagerEquipment,
} from "@/modules/equipment/types/manager-equipment.types";

interface ManagerEquipmentTableProps {
  equipment:
    ManagerEquipment[];

  isLoading: boolean;

  onView: (
    equipment:
      ManagerEquipment,
  ) => void;
}

const dateFormatter =
  new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

export const ManagerEquipmentTable = ({
  equipment,
  isLoading,
  onView,
}: ManagerEquipmentTableProps) => {
  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-3 p-5">
          {Array.from({
            length: 5,
          }).map(
            (
              _,
              index,
            ) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-xl bg-slate-100"
              />
            ),
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1500px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="min-w-[240px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Thiết bị
              </th>

              <th className="min-w-[150px] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Danh mục
              </th>

              <th className="min-w-[220px] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Kho / Chi nhánh
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tổng
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Khả dụng
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Đang thuê
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Giữ chỗ
              </th>

              <th className="min-w-[160px] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Bảo trì tiếp theo
              </th>

              <th className="min-w-[140px] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tình trạng
              </th>

              <th className="min-w-[150px] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trạng thái
              </th>

              <th className="w-20 px-5 py-4" />
            </tr>
          </thead>

          <tbody>
            {equipment.length ===
            0 ? (
              <tr>
                <td
                  colSpan={11}
                  className="px-6 py-16 text-center"
                >
                  <p className="font-semibold text-slate-700">
                    Không tìm thấy thiết bị
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Hãy thay đổi bộ lọc hoặc phạm vi chi nhánh.
                  </p>
                </td>
              </tr>
            ) : (
              equipment.map(
                (item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/30"
                  >
                    <td className="px-5 py-4 align-top">
                      <button
                        type="button"
                        onClick={() =>
                          onView(
                            item,
                          )
                        }
                        className="whitespace-nowrap font-semibold text-blue-700 hover:text-blue-800"
                      >
                        {
                          item.equipmentCode
                        }
                      </button>

                      <p className="mt-1 max-w-[260px] truncate text-sm font-semibold text-slate-700">
                        {
                          item.equipmentName
                        }
                      </p>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <p className="whitespace-nowrap text-sm font-semibold text-slate-700">
                        {
                          item.categoryName
                        }
                      </p>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <p className="whitespace-nowrap text-sm font-semibold text-slate-700">
                        {
                          item.warehouseName
                        }
                      </p>

                      <p className="mt-1 whitespace-nowrap text-xs text-slate-400">
                        {
                          item.branchName
                        }
                      </p>
                    </td>

                    <td className="px-4 py-4 text-right align-top font-bold text-slate-800">
                      {
                        item.totalQuantity
                      }
                    </td>

                    <td className="px-4 py-4 text-right align-top font-bold text-blue-700">
                      {
                        item.availableQuantity
                      }
                    </td>

                    <td className="px-4 py-4 text-right align-top font-semibold text-slate-700">
                      {
                        item.rentedQuantity
                      }
                    </td>

                    <td className="px-4 py-4 text-right align-top font-semibold text-slate-700">
                      {
                        item.reservedQuantity
                      }
                    </td>

                    <td className="px-4 py-4 align-top">
                      <p className="whitespace-nowrap text-sm font-semibold text-slate-700">
                        {item.nextMaintenanceAt
                          ? dateFormatter.format(
                              new Date(
                                item.nextMaintenanceAt,
                              ),
                            )
                          : "Chưa có lịch"}
                      </p>

                      {item.maintenanceQuantity >
                        0 && (
                        <p className="mt-1 whitespace-nowrap text-xs text-slate-400">
                          {
                            item.maintenanceQuantity
                          }{" "}
                          đang bảo trì
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <ManagerEquipmentConditionBadge
                        condition={
                          item.condition
                        }
                      />

                      {item.damagedQuantity >
                        0 && (
                        <p className="mt-2 whitespace-nowrap text-xs font-semibold text-rose-600">
                          {
                            item.damagedQuantity
                          }{" "}
                          hư hỏng
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4 align-top">
                      <ManagerEquipmentStatusBadge
                        status={
                          item.status
                        }
                      />
                    </td>

                    <td className="px-5 py-4 text-right align-top">
                      <button
                        type="button"
                        title="Xem chi tiết"
                        onClick={() =>
                          onView(
                            item,
                          )
                        }
                        className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
