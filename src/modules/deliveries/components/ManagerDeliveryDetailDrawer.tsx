import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  MapPin,
  Package,
  Phone,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import {
  useEffect,
} from "react";

import {
  ManagerDeliveryPriorityBadge,
  ManagerDeliveryStatusBadge,
  ManagerDeliveryTypeBadge,
} from "@/modules/deliveries/components/ManagerDeliveryBadge";

import type {
  ManagerDeliveryHistoryAction,
  ManagerDeliveryTask,
} from "@/modules/deliveries/types/manager-delivery.types";

interface ManagerDeliveryDetailDrawerProps {
  task: ManagerDeliveryTask | null;

  isLoading?: boolean;

  onClose: () => void;
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

const historyLabels: Record<
  ManagerDeliveryHistoryAction,
  string
> = {
  CREATED: "Tạo nhiệm vụ",
  ASSIGNED: "Phân công nhân viên",
  PREPARING: "Bắt đầu chuẩn bị",
  READY: "Sẵn sàng giao nhận",
  DEPARTED: "Đã xuất phát",
  ARRIVED: "Đã đến địa điểm",
  HANDOVER_CONFIRMED:
    "Xác nhận bàn giao",
  RETURN_STARTED:
    "Bắt đầu nhận trả",
  RETURN_INSPECTED:
    "Kiểm tra thiết bị trả",
  COMPLETED: "Hoàn thành",
  DELAYED: "Ghi nhận trễ",
  CANCELLED: "Hủy nhiệm vụ",
};

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

export const ManagerDeliveryDetailDrawer = ({
  task,
  isLoading = false,
  onClose,
}: ManagerDeliveryDetailDrawerProps) => {
  useEffect(() => {
    if (!task) {
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
    task,
    onClose,
  ]);

  if (!task) {
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
                <ManagerDeliveryTypeBadge
                  type={task.type}
                />

                <ManagerDeliveryStatusBadge
                  status={task.status}
                />

                <ManagerDeliveryPriorityBadge
                  priority={
                    task.priority
                  }
                />
              </div>

              <h2 className="mt-3 text-xl font-bold text-slate-900">
                {task.taskCode}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {
                  task.branchName
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
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl bg-slate-200/70"
                />
              ))}
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
                    Thông tin đơn thuê
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Đơn thuê
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {
                        task.rentalCode
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Hợp đồng
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {task.contractCode ??
                        "Chưa có hợp đồng"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Sự kiện
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {
                        task.eventName
                      }
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <UserRound
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Khách hàng và địa điểm
                  </h3>
                </div>

                <p className="font-semibold text-slate-900">
                  {
                    task.customerName
                  }
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {
                    task.customerEmail
                  }
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <Phone
                    size={16}
                    className="text-slate-400"
                  />

                  {
                    task.customerPhone
                  }
                </div>

                <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  {task.address}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarClock
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Tiến độ thực hiện
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Lịch thực hiện
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDateTime(
                        task.scheduledAt,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Bắt đầu
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDateTime(
                        task.startedAt,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Đến nơi
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDateTime(
                        task.arrivedAt,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Hoàn thành
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDateTime(
                        task.completedAt,
                      )}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Truck
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Nhân viên phụ trách
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Nhân viên
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {task.assignedEmployeeName ??
                        "Chưa phân công"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {task.assignedEmployeePhone ??
                        "Chưa có số điện thoại"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Phương tiện
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {task.vehiclePlate ??
                        "Chưa phân công"}
                    </p>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Package
                      size={18}
                      className="text-blue-600"
                    />

                    <h3 className="font-bold text-slate-900">
                      Thiết bị
                    </h3>
                  </div>

                  <p className="text-sm font-semibold text-slate-500">
                    {
                      task.totalEquipmentQuantity
                    }{" "}
                    thiết bị
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[620px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Thiết bị
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          SL
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Đã kiểm
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Tình trạng
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {task.equipmentItems.map(
                        (item) => (
                          <tr
                            key={
                              item.id
                            }
                            className="border-t border-slate-100"
                          >
                            <td className="px-5 py-4">
                              <p className="font-semibold text-slate-700">
                                {
                                  item.equipmentName
                                }
                              </p>

                              {item.issueNote && (
                                <p className="mt-1 text-xs font-medium text-rose-600">
                                  {
                                    item.issueNote
                                  }
                                </p>
                              )}
                            </td>

                            <td className="px-4 py-4 text-right font-semibold text-slate-700">
                              {
                                item.quantity
                              }
                            </td>

                            <td className="px-4 py-4 text-right font-semibold text-slate-700">
                              {
                                item.checkedQuantity
                              }
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={[
                                  "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                                  item.condition ===
                                  "GOOD"
                                    ? "border-slate-200 bg-slate-50 text-slate-600"
                                    : "border-rose-200 bg-rose-50 text-rose-700",
                                ].join(
                                  " ",
                                )}
                              >
                                {item.condition ===
                                "GOOD"
                                  ? "Tốt"
                                  : item.condition ===
                                      "DAMAGED"
                                    ? "Hư hỏng"
                                    : "Thiếu"}
                              </span>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Bàn giao
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Trạng thái
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {task.handoverStatus ===
                      "CONFIRMED"
                        ? "Đã xác nhận"
                        : "Chờ xác nhận"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Người bàn giao
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {task.handoverPersonName ??
                        "Chưa ghi nhận"}
                    </p>
                  </div>
                </div>

                {task.note && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Ghi chú
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {task.note}
                    </p>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="font-bold text-slate-900">
                  Lịch sử xử lý
                </h3>

                <div className="mt-5 space-y-5">
                  {[...task.history]
                    .sort(
                      (
                        first,
                        second,
                      ) =>
                        new Date(
                          second.createdAt,
                        ).getTime() -
                        new Date(
                          first.createdAt,
                        ).getTime(),
                    )
                    .map(
                      (
                        history,
                        index,
                      ) => (
                        <div
                          key={
                            history.id
                          }
                          className="relative flex gap-3"
                        >
                          {index <
                            task.history
                              .length -
                              1 && (
                            <span className="absolute left-[7px] top-5 h-[calc(100%+4px)] w-px bg-slate-200" />
                          )}

                          <span className="relative mt-1.5 size-4 shrink-0 rounded-full border-4 border-blue-100 bg-blue-600" />

                          <div className="min-w-0 flex-1 pb-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-semibold text-slate-700">
                                {
                                  historyLabels[
                                    history
                                      .action
                                  ]
                                }
                              </p>

                              <p className="text-xs text-slate-400">
                                {formatDateTime(
                                  history.createdAt,
                                )}
                              </p>
                            </div>

                            <p className="mt-1 text-xs font-medium text-slate-500">
                              {
                                history.actorName
                              }
                            </p>

                            {history.note && (
                              <p className="mt-2 text-sm leading-6 text-slate-500">
                                {
                                  history.note
                                }
                              </p>
                            )}
                          </div>
                        </div>
                      ),
                    )}
                </div>
              </section>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
};
