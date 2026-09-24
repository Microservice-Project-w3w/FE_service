import {
  Eye,
} from "lucide-react";

import {
  ManagerReceivablePriorityBadge,
  ManagerReceivableStatusBadge,
} from "@/modules/receivables/components/ManagerReceivableBadge";

import type {
  ManagerReceivable,
} from "@/modules/receivables/types/manager-receivable.types";

interface ManagerReceivableTableProps {
  receivables:
    ManagerReceivable[];

  isLoading: boolean;

  onView: (
    receivable:
      ManagerReceivable,
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

export const ManagerReceivableTable = ({
  receivables,
  isLoading,
  onView,
}: ManagerReceivableTableProps) => {
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
                key={
                  index
                }
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
        <table className="w-full min-w-[1520px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="w-[160px] min-w-[160px] px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Công nợ
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Khách hàng
              </th>

              <th className="w-[200px] min-w-[200px] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Đơn thuê
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tổng tiền
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Đã thu
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Còn phải thu
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hạn thanh toán
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
            {receivables.length ===
            0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="px-6 py-16 text-center"
                >
                  <p className="font-semibold text-slate-700">
                    Không tìm thấy công nợ
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Hãy thay đổi bộ lọc hoặc phạm vi chi nhánh.
                  </p>
                </td>
              </tr>
            ) : (
              receivables.map(
                (
                  receivable,
                ) => (
                  <tr
                    key={
                      receivable.id
                    }
                    className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/30"
                  >
                    <td className="w-[160px] min-w-[160px] px-5 py-4 align-top">
                      <button
                        type="button"
                        onClick={() =>
                          onView(
                            receivable,
                          )
                        }
                        className="whitespace-nowrap font-semibold text-blue-700 hover:text-blue-800"
                      >
                        {
                          receivable.receivableCode
                        }
                      </button>

                      <p className="mt-1 text-xs text-slate-400">
                        {
                          receivable.invoiceCode
                        }
                      </p>

                      <p className="mt-1 text-xs font-medium text-slate-400">
                        {
                          receivable.branchName
                        }
                      </p>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <p className="max-w-64 truncate font-semibold text-slate-700">
                        {
                          receivable.customerName
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {
                          receivable.customerPhone
                        }
                      </p>
                    </td>

                    <td className="w-[200px] min-w-[200px] px-4 py-4 align-top">
                      <p className="whitespace-nowrap font-semibold text-slate-700">
                        {
                          receivable.rentalCode
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {receivable.contractCode ??
                          "Chưa có hợp đồng"}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-right align-top font-semibold text-slate-700">
                      {currencyFormatter.format(
                        receivable.totalAmount,
                      )}
                    </td>

                    <td className="px-4 py-4 text-right align-top font-semibold text-slate-700">
                      {currencyFormatter.format(
                        receivable.paidAmount,
                      )}
                    </td>

                    <td className="px-4 py-4 text-right align-top">
                      <p
                        className={[
                          "font-bold",
                          receivable.status ===
                          "OVERDUE"
                            ? "text-rose-600"
                            : "text-slate-900",
                        ].join(
                          " ",
                        )}
                      >
                        {currencyFormatter.format(
                          receivable.outstandingAmount,
                        )}
                      </p>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <p
                        className={[
                          "text-sm font-semibold",
                          receivable.status ===
                          "OVERDUE"
                            ? "text-rose-600"
                            : "text-slate-700",
                        ].join(
                          " ",
                        )}
                      >
                        {dateFormatter.format(
                          new Date(
                            receivable.dueDate,
                          ),
                        )}
                      </p>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <ManagerReceivablePriorityBadge
                        priority={
                          receivable.priority
                        }
                      />
                    </td>

                    <td className="px-4 py-4 align-top">
                      <ManagerReceivableStatusBadge
                        status={
                          receivable.status
                        }
                      />
                    </td>

                    <td className="px-5 py-4 text-right align-top">
                      <button
                        type="button"
                        title="Xem chi tiết"
                        onClick={() =>
                          onView(
                            receivable,
                          )
                        }
                        className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye
                          size={17}
                        />
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
