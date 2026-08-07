import {
  Ban,
  CalendarPlus,
  Eye,
  PackageCheck,
} from "lucide-react";

import {
  ManagerRentalPriorityBadge,
  ManagerRentalStatusBadge,
  RentalPaymentStatusBadge,
} from "@/modules/rentals/components/ManagerRentalBadge";

import type {
  ManagerRental,
} from "@/modules/rentals/types/manager-rental.types";

interface ManagerRentalTableProps {
  rentals: ManagerRental[];
  isLoading: boolean;

  onView: (
    rental: ManagerRental,
  ) => void;

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

const dateFormatter =
  new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

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

export const ManagerRentalTable = ({
  rentals,
  isLoading,
  onView,
  onReserve,
  onExtend,
  onCancel,
}: ManagerRentalTableProps) => {
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
        <table className="w-full min-w-[1320px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Đơn thuê
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Khách hàng
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Thời gian thuê
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Giá trị
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Thanh toán
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ưu tiên
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trạng thái
              </th>

              <th className="w-60 px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {rentals.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-16 text-center"
                >
                  <p className="font-semibold text-slate-700">
                    Không tìm thấy đơn thuê
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Hãy thay đổi bộ lọc hoặc phạm vi chi nhánh.
                  </p>
                </td>
              </tr>
            ) : (
              rentals.map((rental) => (
                <tr
                  key={rental.id}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/30"
                >
                  <td className="px-5 py-4 align-top">
                    <button
                      type="button"
                      onClick={() =>
                        onView(rental)
                      }
                      className="font-semibold text-blue-700 hover:text-blue-800"
                    >
                      {rental.rentalCode}
                    </button>

                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {rental.branchName}
                    </p>

                    <p className="mt-1 max-w-56 truncate text-xs text-slate-500">
                      {rental.eventName}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <p className="max-w-56 truncate text-sm font-semibold text-slate-700">
                      {rental.customerName}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {rental.customerPhone}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-top text-sm text-slate-600">
                    <p>
                      {dateFormatter.format(
                        new Date(
                          rental.rentalStartDate,
                        ),
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      đến{" "}
                      {dateFormatter.format(
                        new Date(
                          rental.rentalEndDate,
                        ),
                      )}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-right align-top">
                    <p className="text-sm font-bold text-slate-800">
                      {currencyFormatter.format(
                        rental.totalAmount,
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Còn{" "}
                      {currencyFormatter.format(
                        rental.outstandingAmount,
                      )}
                    </p>
                  </td>

                  <td className="px-4 py-4 align-top">
                    <RentalPaymentStatusBadge
                      status={
                        rental.paymentStatus
                      }
                    />
                  </td>

                  <td className="px-4 py-4 align-top">
                    <ManagerRentalPriorityBadge
                      priority={
                        rental.priority
                      }
                    />
                  </td>

                  <td className="px-4 py-4 align-top">
                    <ManagerRentalStatusBadge
                      status={rental.status}
                    />
                  </td>

                  <td className="px-5 py-4 align-top">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="Xem chi tiết"
                        onClick={() =>
                          onView(rental)
                        }
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye size={17} />
                      </button>

                      {canReserve(rental) && (
                        <button
                          type="button"
                          title="Xác nhận giữ chỗ"
                          onClick={() =>
                            onReserve(rental)
                          }
                          className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                        >
                          <PackageCheck
                            size={17}
                          />
                        </button>
                      )}

                      {canExtend(rental) && (
                        <button
                          type="button"
                          title="Gia hạn đơn thuê"
                          onClick={() =>
                            onExtend(rental)
                          }
                          className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                        >
                          <CalendarPlus
                            size={17}
                          />
                        </button>
                      )}

                      {canCancel(rental) && (
                        <button
                          type="button"
                          title="Hủy đơn thuê"
                          onClick={() =>
                            onCancel(rental)
                          }
                          className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-700"
                        >
                          <Ban size={17} />
                        </button>
                      )}
                    </div>
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
