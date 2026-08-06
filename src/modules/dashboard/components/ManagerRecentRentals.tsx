import {
  ArrowRight,
} from "lucide-react";

import {
  useNavigate,
} from "react-router";

import type {
  ManagerRecentRental,
  ManagerRentalStatus,
} from "@/modules/dashboard/types/manager-dashboard.types";

interface ManagerRecentRentalsProps {
  rentals: ManagerRecentRental[];
}

const statusLabels: Record<
  ManagerRentalStatus,
  string
> = {
  CONFIRMED: "Đã xác nhận ",
  PREPARING: "Đang chuẩn bị",
  DELIVERING: "Đang giao",
  ONGOING: "Đang thuê",
  OVERDUE: "Quá hạn",
  COMPLETED: "Hoàn thành",
};

const statusStyles: Record<
  ManagerRentalStatus,
  string
> = {
  CONFIRMED:
    "border-blue-200 bg-blue-50 text-blue-700",
  PREPARING:
    "border-blue-100 bg-blue-50 text-blue-700",
  DELIVERING:
    "border-blue-100 bg-blue-50 text-blue-700",
  ONGOING:
    "border-blue-200 bg-blue-50 text-blue-700",
  OVERDUE:
    "border-blue-200 bg-rose-50 text-blue-700",
  COMPLETED:
    "border-blue-100 bg-blue-50 text-blue-700",
};

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

export const ManagerRecentRentals = ({
  rentals,
}: ManagerRecentRentalsProps) => {
  const navigate = useNavigate();

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Đơn thuê gần đây
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Các đơn thuê mới nhất tại chi nhánh.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/manager/rentals",
            )
          }
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
        >
          Xem tất cả
          <ArrowRight size={16} />
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mã đơn
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Chi nhánh
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Khách hàng
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sự kiện
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Thời gian thuê
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Giá trị
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trạng thái
              </th>
            </tr>
          </thead>

          <tbody>
            {rentals.map(
              (rental) => (
                <tr
                  key={rental.id}
                  className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/40"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                    {rental.rentalCode}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-500">
                    {rental.branchName ?? "—"}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-700">
                    {rental.customerName}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {rental.eventName}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-500">
                    {dateFormatter.format(
                      new Date(
                        rental.startDate,
                      ),
                    )}
                    {" - "}
                    {dateFormatter.format(
                      new Date(
                        rental.endDate,
                      ),
                    )}
                  </td>

                  <td className="px-4 py-4 text-right text-sm font-semibold text-slate-800">
                    {currencyFormatter.format(
                      rental.totalAmount,
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={[
                        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
                        statusStyles[
                          rental.status
                        ],
                      ].join(" ")}
                    >
                      {
                        statusLabels[
                          rental.status
                        ]
                      }
                    </span>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
