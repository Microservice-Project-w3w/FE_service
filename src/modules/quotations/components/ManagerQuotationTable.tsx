import {
  Check,
  Eye,
  X,
} from "lucide-react";

import {
  QuotationPriorityBadge,
  QuotationStatusBadge,
} from "@/modules/quotations/components/QuotationApprovalBadge";

import type {
  ManagerQuotation,
} from "@/modules/quotations/types/manager-quotation-approval.types";

interface ManagerQuotationTableProps {
  quotations: ManagerQuotation[];
  isLoading?: boolean;

  onView: (
    quotation: ManagerQuotation,
  ) => void;

  onApprove: (
    quotation: ManagerQuotation,
  ) => void;

  onReject: (
    quotation: ManagerQuotation,
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

export const ManagerQuotationTable = ({
  quotations,
  isLoading = false,
  onView,
  onApprove,
  onReject,
}: ManagerQuotationTableProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-col gap-2 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Danh sách báo giá
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Kiểm tra thông tin trước khi phê duyệt hoặc từ chối.
          </p>
        </div>

        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {quotations.length} kết quả
        </span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mã báo giá
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Chi nhánh
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Khách hàng / Sự kiện
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Thời gian thuê
              </th>

              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Tổng giá trị
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ưu tiên
              </th>

              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trạng thái
              </th>

              <th className="w-44 px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({
                length: 4,
              }).map((_, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100"
                >
                  <td
                    colSpan={8}
                    className="px-6 py-4"
                  >
                    <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : quotations.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-16 text-center"
                >
                  <p className="font-semibold text-slate-700">
                    Không tìm thấy báo giá phù hợp
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Hãy thay đổi bộ lọc hoặc phạm vi chi nhánh.
                  </p>
                </td>
              </tr>
            ) : (
              quotations.map(
                (quotation) => {
                  const isPending =
                    quotation.status ===
                    "PENDING_APPROVAL";

                  return (
                    <tr
                      key={quotation.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/30"
                    >
                      <td className="px-6 py-4 align-top">
                        <button
                          type="button"
                          onClick={() =>
                            onView(
                              quotation,
                            )
                          }
                          className="font-semibold text-blue-700 transition hover:text-blue-800"
                        >
                          {
                            quotation.quotationCode
                          }
                        </button>

                        <p className="mt-1 text-xs text-slate-400">
                          Tạo bởi{" "}
                          {
                            quotation.createdByName
                          }
                        </p>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-600">
                        {
                          quotation.branchName
                        }
                      </td>

                      <td className="px-4 py-4 align-top">
                        <p className="font-medium text-slate-800">
                          {
                            quotation.customerName
                          }
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {
                            quotation.eventName
                          }
                        </p>
                      </td>

                      <td className="px-4 py-4 align-top text-sm text-slate-600">
                        {dateFormatter.format(
                          new Date(
                            quotation.rentalStartDate,
                          ),
                        )}
                        {" - "}
                        {dateFormatter.format(
                          new Date(
                            quotation.rentalEndDate,
                          ),
                        )}
                      </td>

                      <td className="px-4 py-4 text-right align-top font-semibold text-slate-900">
                        {currencyFormatter.format(
                          quotation.totalAmount,
                        )}
                      </td>

                      <td className="px-4 py-4 align-top">
                        <QuotationPriorityBadge
                          priority={
                            quotation.priority
                          }
                        />
                      </td>

                      <td className="px-4 py-4 align-top">
                        <QuotationStatusBadge
                          status={
                            quotation.status
                          }
                        />
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="Xem chi tiết"
                            onClick={() =>
                              onView(
                                quotation,
                              )
                            }
                            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                          >
                            <Eye size={17} />
                          </button>

                          {isPending && (
                            <>
                              <button
                                type="button"
                                title="Duyệt báo giá"
                                onClick={() =>
                                  onApprove(
                                    quotation,
                                  )
                                }
                                className="flex size-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
                              >
                                <Check
                                  size={17}
                                />
                              </button>

                              <button
                                type="button"
                                title="Từ chối báo giá"
                                onClick={() =>
                                  onReject(
                                    quotation,
                                  )
                                }
                                className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                              >
                                <X size={17} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                },
              )
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
