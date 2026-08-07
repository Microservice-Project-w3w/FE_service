import {
  Ban,
  CalendarDays,
  CalendarPlus,
  FileText,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  ManagerRentalPriorityBadge,
  ManagerRentalStatusBadge,
  RentalPaymentStatusBadge,
  RentalReservationStatusBadge,
} from "@/modules/rentals/components/ManagerRentalBadge";

import type {
  ManagerRental,
  ManagerRentalHistoryAction,
} from "@/modules/rentals/types/manager-rental.types";

interface ManagerRentalDetailDrawerProps {
  rental: ManagerRental | null;
  isOpen: boolean;
  isLoading?: boolean;

  onClose: () => void;

  onReserve: (
    rental: ManagerRental,
  ) => void;

  onExtend: (
    rental: ManagerRental,
  ) => void;

  onCancel: (
    rental: ManagerRental,
  ) => void;
}

const currencyFormatter =
  new Intl.NumberFormat(
    "vi-VN",
    {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    },
  );

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

const historyActionLabels: Record<
  ManagerRentalHistoryAction,
  string
> = {
  CREATED: "Tạo đơn thuê",
  RESERVED: "Giữ chỗ thiết bị",
  CONFIRMED: "Xác nhận đơn thuê",
  STARTED: "Bắt đầu cho thuê",
  EXTENDED: "Gia hạn đơn thuê",
  RETURN_REQUESTED:
    "Yêu cầu hoàn trả",
  COMPLETED: "Hoàn thành đơn thuê",
  CANCELLED: "Hủy đơn thuê",
};

const canReserve = (
  rental: ManagerRental,
) =>
  rental.reservationStatus ===
    "PENDING" &&
  (
    rental.status ===
      "PENDING_CONFIRMATION" ||
    rental.status === "RESERVED"
  );

const canExtend = (
  rental: ManagerRental,
) =>
  [
    "RESERVED",
    "CONFIRMED",
    "ACTIVE",
    "OVERDUE",
  ].includes(rental.status);

const canCancel = (
  rental: ManagerRental,
) =>
  [
    "PENDING_CONFIRMATION",
    "RESERVED",
    "CONFIRMED",
  ].includes(rental.status);

export const ManagerRentalDetailDrawer = ({
  rental,
  isOpen,
  isLoading = false,
  onClose,
  onReserve,
  onExtend,
  onCancel,
}: ManagerRentalDetailDrawerProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow =
      "hidden";

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    onClose,
  ]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Đóng chi tiết đơn thuê"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
      />

      <aside className="relative z-10 flex h-full w-full max-w-4xl flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Chi tiết đơn thuê
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {rental?.rentalCode ??
                "Đang tải..."}
            </h2>

            {rental && (
              <div className="mt-3 flex flex-wrap gap-2">
                <ManagerRentalStatusBadge
                  status={rental.status}
                />

                <ManagerRentalPriorityBadge
                  priority={
                    rental.priority
                  }
                />

                <RentalPaymentStatusBadge
                  status={
                    rental.paymentStatus
                  }
                />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading || !rental ? (
            <div className="space-y-4">
              {Array.from({
                length: 7,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <section className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900">
                  Khách hàng và sự kiện
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="flex gap-3">
                    <UserRound
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Khách hàng
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {
                          rental.customerName
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Điện thoại
                      </p>

                      <p className="mt-1 text-slate-700">
                        {
                          rental.customerPhone
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Mail
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Email
                      </p>

                      <p className="mt-1 break-all text-slate-700">
                        {
                          rental.customerEmail
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Địa điểm
                      </p>

                      <p className="mt-1 text-slate-700">
                        {
                          rental.eventLocation
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-blue-50 p-4">
                  <p className="font-semibold text-slate-800">
                    {rental.eventName}
                  </p>

                  <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
                    <CalendarDays
                      size={16}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />

                    <span>
                      {dateTimeFormatter.format(
                        new Date(
                          rental.rentalStartDate,
                        ),
                      )}
                      {" - "}
                      {dateTimeFormatter.format(
                        new Date(
                          rental.rentalEndDate,
                        ),
                      )}
                    </span>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900">
                  Hồ sơ liên quan
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Báo giá
                    </p>

                    <p className="mt-2 font-semibold text-blue-700">
                      {
                        rental.quotationCode
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Hợp đồng
                    </p>

                    <p className="mt-2 font-semibold text-blue-700">
                      {rental.contractCode ??
                        "Chưa có"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Chi nhánh
                    </p>

                    <p className="mt-2 font-semibold text-slate-700">
                      {rental.branchName}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900">
                  Giữ chỗ và hoàn trả
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Trạng thái giữ chỗ
                    </p>

                    <div className="mt-2">
                      <RentalReservationStatusBadge
                        status={
                          rental.reservationStatus
                        }
                      />
                    </div>

                    {rental.reservationExpiresAt && (
                      <p className="mt-3 text-xs text-slate-500">
                        Hết hạn:{" "}
                        {dateTimeFormatter.format(
                          new Date(
                            rental.reservationExpiresAt,
                          ),
                        )}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Dự kiến hoàn trả
                    </p>

                    <p className="mt-2 font-semibold text-slate-700">
                      {dateTimeFormatter.format(
                        new Date(
                          rental.expectedReturnDate,
                        ),
                      )}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Đã gia hạn{" "}
                      {rental.extensionCount} lần
                    </p>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200">
                <header className="border-b border-slate-200 px-5 py-4">
                  <h3 className="font-bold text-slate-900">
                    Thiết bị trong đơn
                  </h3>
                </header>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                          Thiết bị
                        </th>

                        <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                          Yêu cầu
                        </th>

                        <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                          Đã giữ
                        </th>

                        <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                          Đã giao
                        </th>

                        <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                          Đơn giá
                        </th>

                        <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {rental.equipmentItems.map(
                        (item) => (
                          <tr
                            key={item.id}
                            className="border-t border-slate-100"
                          >
                            <td className="px-5 py-4 font-medium text-slate-800">
                              {
                                item.equipmentName
                              }
                            </td>

                            <td className="px-3 py-4 text-right text-slate-600">
                              {
                                item.requestedQuantity
                              }
                            </td>

                            <td className="px-3 py-4 text-right text-slate-600">
                              {
                                item.allocatedQuantity
                              }
                            </td>

                            <td className="px-3 py-4 text-right text-slate-600">
                              {
                                item.deliveredQuantity
                              }
                            </td>

                            <td className="px-3 py-4 text-right text-slate-600">
                              {currencyFormatter.format(
                                item.unitPrice,
                              )}
                            </td>

                            <td className="px-5 py-4 text-right font-semibold text-slate-800">
                              {currencyFormatter.format(
                                item.subtotal,
                              )}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900">
                  Giá trị và thanh toán
                </h3>

                <div className="mt-4 grid gap-5 lg:grid-cols-2">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Tiền thiết bị
                      </span>

                      <span className="font-medium text-slate-800">
                        {currencyFormatter.format(
                          rental.equipmentSubtotal,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Giảm giá
                      </span>

                      <span className="font-medium text-slate-800">
                        -
                        {currencyFormatter.format(
                          rental.discountAmount,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Phí giao nhận
                      </span>

                      <span className="font-medium text-slate-800">
                        {currencyFormatter.format(
                          rental.deliveryFee,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Phí trả trễ
                      </span>

                      <span className="font-medium text-slate-800">
                        {currencyFormatter.format(
                          rental.lateFee,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Thuế
                      </span>

                      <span className="font-medium text-slate-800">
                        {currencyFormatter.format(
                          rental.taxAmount,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-t border-slate-200 pt-3">
                      <span className="font-semibold text-slate-700">
                        Tổng giá trị
                      </span>

                      <span className="text-lg font-bold text-blue-700">
                        {currencyFormatter.format(
                          rental.totalAmount,
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-xl bg-blue-50 p-4">
                      <p className="text-sm font-semibold text-blue-700">
                        Đã thanh toán
                      </p>

                      <p className="mt-1 text-xl font-bold text-blue-800">
                        {currencyFormatter.format(
                          rental.paidAmount,
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-600">
                        Còn phải thu
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-800">
                        {currencyFormatter.format(
                          rental.outstandingAmount,
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-600">
                        Tiền đặt cọc
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-800">
                        {currencyFormatter.format(
                          rental.depositAmount,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-2">
                  <FileText
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Thông tin lập đơn
                  </h3>
                </div>

                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-400">
                      Người lập
                    </dt>

                    <dd className="mt-1 font-medium text-slate-700">
                      {
                        rental.createdByName
                      }
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-400">
                      Ngày tạo
                    </dt>

                    <dd className="mt-1 font-medium text-slate-700">
                      {dateTimeFormatter.format(
                        new Date(
                          rental.createdAt,
                        ),
                      )}
                    </dd>
                  </div>
                </dl>

                {rental.note && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Ghi chú
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {rental.note}
                    </p>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900">
                  Lịch sử xử lý
                </h3>

                <div className="mt-4 space-y-4">
                  {rental.history.map(
                    (history) => (
                      <article
                        key={history.id}
                        className="border-l-2 border-blue-200 pl-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-slate-800">
                            {
                              historyActionLabels[
                                history.action
                              ]
                            }
                          </p>

                          <time className="text-xs text-slate-400">
                            {dateTimeFormatter.format(
                              new Date(
                                history.createdAt,
                              ),
                            )}
                          </time>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {history.actorName}
                        </p>

                        {history.note && (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {history.note}
                          </p>
                        )}
                      </article>
                    ),
                  )}
                </div>
              </section>
            </div>
          )}
        </div>

        {rental &&
          (
            canReserve(rental) ||
            canExtend(rental) ||
            canCancel(rental)
          ) && (
            <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
              {canCancel(rental) && (
                <button
                  type="button"
                  onClick={() =>
                    onCancel(rental)
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-rose-200 bg-white px-5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                >
                  <Ban size={17} />
                  Hủy đơn
                </button>
              )}

              {canExtend(rental) && (
                <button
                  type="button"
                  onClick={() =>
                    onExtend(rental)
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <CalendarPlus
                    size={17}
                  />
                  Gia hạn
                </button>
              )}

              {canReserve(rental) && (
                <button
                  type="button"
                  onClick={() =>
                    onReserve(rental)
                  }
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <PackageCheck
                    size={17}
                  />
                  Xác nhận giữ chỗ
                </button>
              )}
            </footer>
          )}
      </aside>
    </div>
  );
};
