import { createSafeDateFormatter } from "@/shared/utils/dateFormat";
import {
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  QuotationPriorityBadge,
  QuotationStatusBadge,
} from "@/modules/quotations/components/QuotationApprovalBadge";

import type {
  ManagerQuotation,
  RentalPriceUnit,
} from "@/modules/quotations/types/manager-quotation-approval.types";

interface ManagerQuotationDetailDrawerProps {
  quotation:
    ManagerQuotation | null;
  isOpen: boolean;
  isLoading?: boolean;

  onClose: () => void;
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
  createSafeDateFormatter(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

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

const priceUnitLabels: Record<
  RentalPriceUnit,
  string
> = {
  HOUR: "giờ",
  DAY: "ngày",
  WEEK: "tuần",
  MONTH: "tháng",
};

const actionLabels = {
  SUBMITTED: "Gửi duyệt",
  APPROVED: "Phê duyệt",
  REJECTED: "Từ chối",
} as const;

export const ManagerQuotationDetailDrawer = ({
  quotation,
  isOpen,
  isLoading = false,
  onClose,
  onApprove,
  onReject,
}: ManagerQuotationDetailDrawerProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const isPending =
    quotation?.status ===
    "PENDING_APPROVAL";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Đóng chi tiết báo giá"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
      />

      <aside className="relative z-10 flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Chi tiết báo giá
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {quotation?.quotationCode ??
                "Đang tải..."}
            </h2>

            {quotation && (
              <div className="mt-3 flex flex-wrap gap-2">
                <QuotationStatusBadge
                  status={
                    quotation.status
                  }
                />

                <QuotationPriorityBadge
                  priority={
                    quotation.priority
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
          {isLoading || !quotation ? (
            <div className="space-y-4">
              {Array.from({
                length: 6,
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
                          quotation.customerName
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
                          quotation.customerPhone
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
                          quotation.customerEmail
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
                          quotation.eventLocation
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-blue-50 p-4">
                  <p className="font-semibold text-slate-800">
                    {
                      quotation.eventName
                    }
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays
                      size={16}
                      className="text-blue-600"
                    />

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
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200">
                <header className="border-b border-slate-200 px-5 py-4">
                  <h3 className="font-bold text-slate-900">
                    Danh sách thiết bị
                  </h3>
                </header>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                          Thiết bị
                        </th>
                        <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                          SL
                        </th>
                        <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                          Thời lượng
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
                      {quotation.lineItems.map(
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
                              {item.quantity}
                            </td>

                            <td className="px-3 py-4 text-right text-slate-600">
                              {
                                item.rentalDuration
                              }{" "}
                              {
                                priceUnitLabels[
                                  item.priceUnit
                                ]
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
                  Tổng hợp tài chính
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Tiền thiết bị
                    </span>
                    <span className="font-medium text-slate-800">
                      {currencyFormatter.format(
                        quotation.subtotal,
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
                        quotation.discountAmount,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Phí giao nhận
                    </span>
                    <span className="font-medium text-slate-800">
                      {currencyFormatter.format(
                        quotation.deliveryFee,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">
                      Thuế
                    </span>
                    <span className="font-medium text-slate-800">
                      {currencyFormatter.format(
                        quotation.taxAmount,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-slate-200 pt-3">
                    <span className="font-semibold text-slate-700">
                      Tổng thanh toán
                    </span>
                    <span className="text-lg font-bold text-blue-700">
                      {currencyFormatter.format(
                        quotation.totalAmount,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 rounded-xl bg-blue-50 px-4 py-3">
                    <span className="font-semibold text-blue-700">
                      Tiền đặt cọc
                    </span>
                    <span className="font-bold text-blue-800">
                      {currencyFormatter.format(
                        quotation.depositAmount,
                      )}
                    </span>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900">
                  Thông tin lập báo giá
                </h3>

                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-400">
                      Chi nhánh
                    </dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {
                        quotation.branchName
                      }
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-400">
                      Người lập
                    </dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {
                        quotation.createdByName
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
                          quotation.createdAt,
                        ),
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-400">
                      Hết hiệu lực
                    </dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {dateTimeFormatter.format(
                        new Date(
                          quotation.expiresAt,
                        ),
                      )}
                    </dd>
                  </div>
                </dl>

                {quotation.note && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Ghi chú
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {quotation.note}
                    </p>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900">
                  Lịch sử xử lý
                </h3>

                <div className="mt-4 space-y-4">
                  {quotation.approvalHistory.map(
                    (history) => (
                      <article
                        key={history.id}
                        className="border-l-2 border-blue-200 pl-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-slate-800">
                            {
                              actionLabels[
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
                          {
                            history.actorName
                          }
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

        {quotation && isPending && (
          <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                onReject(quotation)
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Từ chối
            </button>

            <button
              type="button"
              onClick={() =>
                onApprove(quotation)
              }
              className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Phê duyệt báo giá
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
};
