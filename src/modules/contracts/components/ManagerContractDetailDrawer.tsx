import { createSafeDateFormatter } from "@/shared/utils/dateFormat";
import {
  CalendarDays,
  FileText,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  ContractPriorityBadge,
  ContractStatusBadge,
  PaymentStatusBadge,
} from "@/modules/contracts/components/ContractApprovalBadge";

import type {
  ContractApprovalAction,
  ManagerContract,
} from "@/modules/contracts/types/manager-contract-approval.types";

interface ManagerContractDetailDrawerProps {
  contract: ManagerContract | null;
  isOpen: boolean;
  isLoading?: boolean;

  onClose: () => void;

  onApprove: (
    contract: ManagerContract,
  ) => void;

  onReject: (
    contract: ManagerContract,
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

const actionLabels: Record<
  ContractApprovalAction,
  string
> = {
  SUBMITTED: "Gửi duyệt",
  APPROVED: "Phê duyệt",
  REJECTED: "Từ chối",
  SIGNED: "Ký hợp đồng",
};

export const ManagerContractDetailDrawer = ({
  contract,
  isOpen,
  isLoading = false,
  onClose,
  onApprove,
  onReject,
}: ManagerContractDetailDrawerProps) => {
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

    const previousOverflow =
      document.body.style.overflow;

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

  const isPending =
    contract?.status ===
    "PENDING_APPROVAL";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Đóng chi tiết hợp đồng"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"
      />

      <aside className="relative z-10 flex h-full w-full max-w-4xl flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              Chi tiết hợp đồng
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {contract?.contractCode ??
                "Đang tải..."}
            </h2>

            {contract && (
              <div className="mt-3 flex flex-wrap gap-2">
                <ContractStatusBadge
                  status={contract.status}
                />

                <ContractPriorityBadge
                  priority={
                    contract.priority
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
          {isLoading || !contract ? (
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
                          contract.customerName
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
                          contract.customerPhone
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
                          contract.customerEmail
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
                        Địa chỉ khách hàng
                      </p>

                      <p className="mt-1 text-slate-700">
                        {
                          contract.customerAddress
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-blue-50 p-4">
                  <p className="font-semibold text-slate-800">
                    {contract.eventName}
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {
                      contract.eventLocation
                    }
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <CalendarDays
                      size={16}
                      className="text-blue-600"
                    />

                    {dateFormatter.format(
                      new Date(
                        contract.rentalStartDate,
                      ),
                    )}
                    {" - "}
                    {dateFormatter.format(
                      new Date(
                        contract.rentalEndDate,
                      ),
                    )}
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
                        contract.quotationCode
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Yêu cầu thuê
                    </p>

                    <p className="mt-2 font-semibold text-blue-700">
                      {
                        contract.rentalRequestCode
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Mã số thuế
                    </p>

                    <p className="mt-2 font-semibold text-slate-700">
                      {contract.customerTaxCode ??
                        "Không có"}
                    </p>
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
                  <table className="w-full min-w-[680px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                          Thiết bị
                        </th>

                        <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                          Số lượng
                        </th>

                        <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                          Số ngày
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
                      {contract.equipmentItems.map(
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
                              {item.rentalDays}
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
                  Giá trị hợp đồng
                </h3>

                <div className="mt-4 grid gap-5 lg:grid-cols-2">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Tiền thiết bị
                      </span>

                      <span className="font-medium text-slate-800">
                        {currencyFormatter.format(
                          contract.equipmentSubtotal,
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
                          contract.discountAmount,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Phí giao nhận
                      </span>

                      <span className="font-medium text-slate-800">
                        {currencyFormatter.format(
                          contract.deliveryFee,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Thuế
                      </span>

                      <span className="font-medium text-slate-800">
                        {currencyFormatter.format(
                          contract.taxAmount,
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4 border-t border-slate-200 pt-3">
                      <span className="font-semibold text-slate-700">
                        Tổng giá trị
                      </span>

                      <span className="text-lg font-bold text-blue-700">
                        {currencyFormatter.format(
                          contract.totalContractValue,
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    <div className="rounded-xl bg-blue-50 p-4">
                      <p className="text-sm font-semibold text-blue-700">
                        Tiền đặt cọc
                      </p>

                      <p className="mt-1 text-xl font-bold text-blue-800">
                        {currencyFormatter.format(
                          contract.depositAmount,
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-600">
                        Số tiền còn lại
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-800">
                        {currencyFormatter.format(
                          contract.remainingAmount,
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-600">
                        Phí trả trễ mỗi ngày
                      </p>

                      <p className="mt-1 text-xl font-bold text-slate-800">
                        {currencyFormatter.format(
                          contract.lateFeePerDay,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200">
                <header className="border-b border-slate-200 px-5 py-4">
                  <h3 className="font-bold text-slate-900">
                    Lịch thanh toán
                  </h3>
                </header>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                          Đợt thanh toán
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                          Hạn thanh toán
                        </th>

                        <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                          Tỷ lệ
                        </th>

                        <th className="px-3 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                          Số tiền
                        </th>

                        <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {contract.paymentSchedule.map(
                        (payment) => (
                          <tr
                            key={payment.id}
                            className="border-t border-slate-100"
                          >
                            <td className="px-5 py-4 font-medium text-slate-800">
                              {payment.name}
                            </td>

                            <td className="px-3 py-4 text-slate-600">
                              {dateFormatter.format(
                                new Date(
                                  payment.dueDate,
                                ),
                              )}
                            </td>

                            <td className="px-3 py-4 text-right text-slate-600">
                              {
                                payment.percentage
                              }
                              %
                            </td>

                            <td className="px-3 py-4 text-right font-semibold text-slate-800">
                              {currencyFormatter.format(
                                payment.amount,
                              )}
                            </td>

                            <td className="px-5 py-4">
                              <PaymentStatusBadge
                                status={
                                  payment.status
                                }
                              />
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
                  Chính sách hợp đồng
                </h3>

                <div className="mt-4 space-y-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-700">
                      Chính sách hủy
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {
                        contract.cancellationPolicy
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-700">
                      Bồi thường mất hoặc hư hỏng
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {
                        contract.damageCompensationPolicy
                      }
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900">
                  Điều khoản
                </h3>

                <div className="mt-4 space-y-3">
                  {contract.clauses.map(
                    (clause) => (
                      <article
                        key={clause.id}
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold text-slate-800">
                            {clause.title}
                          </p>

                          <span
                            className={[
                              "rounded-full border px-2.5 py-1 text-xs font-semibold",
                              clause.required
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-slate-50 text-slate-600",
                            ].join(" ")}
                          >
                            {clause.required
                              ? "Bắt buộc"
                              : "Bổ sung"}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {clause.content}
                        </p>
                      </article>
                    ),
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-2">
                  <Paperclip
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Phụ lục hợp đồng
                  </h3>
                </div>

                {contract.appendices.length ===
                0 ? (
                  <p className="mt-4 text-sm text-slate-500">
                    Hợp đồng chưa có phụ lục.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {contract.appendices.map(
                      (appendix) => (
                        <article
                          key={appendix.id}
                          className="rounded-xl border border-slate-200 p-4"
                        >
                          <p className="font-semibold text-blue-700">
                            {appendix.code}
                          </p>

                          <p className="mt-1 font-medium text-slate-800">
                            {appendix.title}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {
                              appendix.description
                            }
                          </p>
                        </article>
                      ),
                    )}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center gap-2">
                  <FileText
                    size={18}
                    className="text-blue-600"
                  />

                  <h3 className="font-bold text-slate-900">
                    Thông tin lập hợp đồng
                  </h3>
                </div>

                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-400">
                      Chi nhánh
                    </dt>

                    <dd className="mt-1 font-medium text-slate-700">
                      {contract.branchName}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-400">
                      Người lập
                    </dt>

                    <dd className="mt-1 font-medium text-slate-700">
                      {
                        contract.createdByName
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
                          contract.createdAt,
                        ),
                      )}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-400">
                      Hạn phê duyệt
                    </dt>

                    <dd className="mt-1 font-medium text-slate-700">
                      {dateTimeFormatter.format(
                        new Date(
                          contract.approvalDeadline,
                        ),
                      )}
                    </dd>
                  </div>
                </dl>

                {contract.note && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Ghi chú
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {contract.note}
                    </p>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-bold text-slate-900">
                  Lịch sử xử lý
                </h3>

                <div className="mt-4 space-y-4">
                  {contract.approvalHistory.map(
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

        {contract && isPending && (
          <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                onReject(contract)
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Từ chối
            </button>

            <button
              type="button"
              onClick={() =>
                onApprove(contract)
              }
              className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Phê duyệt hợp đồng
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
};
