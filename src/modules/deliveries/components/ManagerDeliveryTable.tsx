import {
  Eye,
  MapPin,
  Truck,
  Undo2,
} from "lucide-react";

import {
  ManagerDeliveryPriorityBadge,
  ManagerDeliveryStatusBadge,
  ManagerDeliveryTypeBadge,
} from "@/modules/deliveries/components/ManagerDeliveryBadge";

import type {
  ManagerDeliveryTask,
} from "@/modules/deliveries/types/manager-delivery.types";

interface ManagerDeliveryTableProps {
  tasks: ManagerDeliveryTask[];

  isLoading: boolean;

  onView: (
    task: ManagerDeliveryTask,
  ) => void;
}

const dateTimeFormatter =
  new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

export const ManagerDeliveryTable = ({
  tasks,
  isLoading,
  onView,
}: ManagerDeliveryTableProps) => {
  if (isLoading) {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-3 p-5">
          {Array.from({
            length: 5,
          }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1340px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="min-w-[180px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nhiệm vụ
              </th>

              <th className="min-w-[200px] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Đơn thuê
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Khách hàng / Địa điểm
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Lịch thực hiện
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Nhân viên
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Thiết bị
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ưu tiên
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trạng thái
              </th>

              <th className="w-20 px-5 py-4" />
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-16 text-center"
                >
                  <p className="font-semibold text-slate-700">
                    Không tìm thấy nhiệm vụ giao nhận
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Hãy thay đổi bộ lọc hoặc phạm vi chi nhánh.
                  </p>
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/30"
                >
                  <td className="min-w-[180px] px-5 py-4 align-top">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        {task.type ===
                        "DELIVERY" ? (
                          <Truck
                            size={17}
                          />
                        ) : (
                          <Undo2
                            size={17}
                          />
                        )}
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() =>
                            onView(task)
                          }
                          className="whitespace-nowrap font-semibold text-blue-700 hover:text-blue-800"
                        >
                          {task.taskCode}
                        </button>

                        <div className="mt-2">
                          <ManagerDeliveryTypeBadge
                            type={task.type}
                          />
                        </div>

                        <p className="mt-2 text-xs font-medium text-slate-400">
                          {
                            task.branchName
                          }
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="min-w-[200px] px-4 py-4 align-top">
                    <p className="whitespace-nowrap font-semibold text-slate-700">
                      {
                        task.rentalCode
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {task.contractCode ??
                        "Chưa có hợp đồng"}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <p className="max-w-64 truncate text-sm font-semibold text-slate-700">
                      {
                        task.customerName
                      }
                    </p>

                    <div className="mt-2 flex max-w-72 items-start gap-1.5 text-xs text-slate-500">
                      <MapPin
                        size={14}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <span className="line-clamp-2">
                        {task.address}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <p className="text-sm font-medium text-slate-700">
                      {dateTimeFormatter.format(
                        new Date(
                          task.scheduledAt,
                        ),
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {task.type ===
                      "DELIVERY"
                        ? "Lịch giao"
                        : "Lịch nhận trả"}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <p className="text-sm font-semibold text-slate-700">
                      {task.assignedEmployeeName ??
                        "Chưa phân công"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {task.vehiclePlate ??
                        "Chưa có phương tiện"}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-right align-top">
                    <p className="text-sm font-bold text-slate-800">
                      {
                        task.totalEquipmentQuantity
                      }
                    </p>

                    {task.issueCount >
                      0 && (
                      <p className="mt-1 text-xs font-semibold text-rose-600">
                        {
                          task.issueCount
                        }{" "}
                        sự cố
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-4 align-top">
                    <ManagerDeliveryPriorityBadge
                      priority={
                        task.priority
                      }
                    />
                  </td>

                  <td className="px-4 py-4 align-top">
                    <ManagerDeliveryStatusBadge
                      status={
                        task.status
                      }
                    />
                  </td>

                  <td className="px-5 py-4 text-right align-top">
                    <button
                      type="button"
                      title="Xem chi tiết"
                      onClick={() =>
                        onView(task)
                      }
                      className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
