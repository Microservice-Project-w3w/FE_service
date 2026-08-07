import {
  Banknote,
  CalendarClock,
  ClipboardList,
  CreditCard,
  Mail,
  Phone,
  ReceiptText,
  UserRound,
  X,
} from "lucide-react";
import {
  useEffect,
} from "react";

import {
  ManagerReceivablePriorityBadge,
  ManagerReceivableStatusBadge,
} from "@/modules/receivables/components/ManagerReceivableBadge";

import type {
  ManagerPaymentMethod,
  ManagerReceivable,
} from "@/modules/receivables/types/manager-receivable.types";

interface ManagerReceivableDetailDrawerProps {
  receivable:
    ManagerReceivable | null;

  isLoading?: boolean;

  onClose: () => void;
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

const paymentMethodLabels:
  Record<
    ManagerPaymentMethod,
    string
  > = {
    BANK_TRANSFER:
      "Chuyển khoản",
    CASH: "Tiền mặt",
    CARD: "Thẻ",
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

export const ManagerReceivableDetailDrawer = ({
  receivable,
  isLoading = false,
  onClose,
}: ManagerReceivableDetailDrawerProps) => {
  useEffect(() => {
    if (!receivable) {
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
    onClose,
    receivable,
  ]);

  if (!receivable) {
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
                <ManagerReceivableStatusBadge
                  status={
                    receivable.status
                  }
                />

                <ManagerReceivablePriorityBadge
                  priority={
                    receivable.priority
                  }
                />
              </div>

              <h2 className="mt-3 text-xl font-bold text-slate-900">
                {
                  receivable.receivableCode
                }
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {
                  receivable.branchName
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
                    Hồ sơ liên quan
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Hóa đơn
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {
                        receivable.invoiceCode
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Đơn thuê
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {
                        receivable.rentalCode
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Hợp đồng
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {receivable.contractCode ??
                        "Chưa có hợp đồng"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Hạn thanh toán
                    </p>

                    <p
                      className={[
                        "mt-1 font-semibold",
                        receivable.status ===
                        "OVERDUE"
                          ? "text-rose-600"
                          : "text-slate-800",
                      ].join(" ")}
                    >
                      {formatDateTime(
                        receivable.dueDate,
                      )}
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
                    Khách hàng
                  </h3>
                </div>

                <p className="font-semibold text-slate-900">
                  {
                    receivable.customerName
                  }
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <Phone
                    size={16}
                    className="text-slate-400"
                  />

                  {
                    receivable.customerPhone
                  }
                </div>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <Mail
                    size={16}
                    className="text-slate-400"
                  />

                  {
                    receivable.customerEmail
                  }
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <Banknote
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Tổng quan công nợ
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Tổng tiền
                    </p>

                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {currencyFormatter.format(
                        receivable.totalAmount,
                      )}
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                      Đã thu
                    </p>

                    <p className="mt-2 text-lg font-bold text-blue-700">
                      {currencyFormatter.format(
                        receivable.paidAmount,
                      )}
                    </p>
                  </div>

                  <div
                    className={[
                      "rounded-xl p-4",
                      receivable.status ===
                      "OVERDUE"
                        ? "bg-rose-50"
                        : "bg-slate-50",
                    ].join(" ")}
                  >
                    <p
                      className={[
                        "text-xs font-semibold uppercase tracking-wide",
                        receivable.status ===
                        "OVERDUE"
                          ? "text-rose-500"
                          : "text-slate-400",
                      ].join(" ")}
                    >
                      Còn phải thu
                    </p>

                    <p
                      className={[
                        "mt-2 text-lg font-bold",
                        receivable.status ===
                        "OVERDUE"
                          ? "text-rose-700"
                          : "text-slate-900",
                      ].join(" ")}
                    >
                      {currencyFormatter.format(
                        receivable.outstandingAmount,
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <CalendarClock
                    size={17}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Thanh toán gần nhất
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {formatDateTime(
                        receivable.lastPaymentAt,
                      )}
                    </p>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
                  <ReceiptText
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Lịch sử thanh toán
                  </h3>
                </div>

                {receivable.transactions.length ===
                0 ? (
                  <div className="px-6 py-10 text-center">
                    <CreditCard
                      size={28}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 font-semibold text-slate-600">
                      Chưa có giao dịch thanh toán
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {[...receivable.transactions]
                      .sort(
                        (
                          first,
                          second,
                        ) =>
                          new Date(
                            second.paidAt,
                          ).getTime() -
                          new Date(
                            first.paidAt,
                          ).getTime(),
                      )
                      .map(
                        (
                          transaction,
                        ) => (
                          <div
                            key={
                              transaction.id
                            }
                            className="px-5 py-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="font-bold text-blue-700">
                                  {currencyFormatter.format(
                                    transaction.amount,
                                  )}
                                </p>

                                <p className="mt-1 text-sm font-medium text-slate-600">
                                  {
                                    paymentMethodLabels[
                                      transaction.method
                                    ]
                                  }
                                </p>

                                {transaction.referenceCode && (
                                  <p className="mt-1 text-xs text-slate-400">
                                    Mã tham chiếu:{" "}
                                    {
                                      transaction.referenceCode
                                    }
                                  </p>
                                )}
                              </div>

                              <p className="text-xs font-medium text-slate-400">
                                {formatDateTime(
                                  transaction.paidAt,
                                )}
                              </p>
                            </div>

                            {transaction.note && (
                              <p className="mt-3 text-sm leading-6 text-slate-500">
                                {
                                  transaction.note
                                }
                              </p>
                            )}
                          </div>
                        ),
                      )}
                  </div>
                )}
              </section>

              {receivable.note && (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Ghi chú
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {
                      receivable.note
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
