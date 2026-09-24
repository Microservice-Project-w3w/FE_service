import {
    CalendarDays,
    Eye,
} from "lucide-react";

import type {
    CustomerInvoiceItem,
} from "../types/customerInvoice.types";

import {
    CustomerInvoiceStatusBadge,
} from "./CustomerInvoiceStatusBadge";

interface CustomerInvoiceListProps {
    invoices: CustomerInvoiceItem[];

    onViewDetail: (
        invoice: CustomerInvoiceItem,
    ) => void;

    onPayment?: (
        invoice: CustomerInvoiceItem,
    ) => void;
}

const formatCurrency = (
    value: number,
): string =>
    new Intl.NumberFormat("vi-VN").format(
        value,
    );

const formatDate = (
    value: string,
): string => {
    const date = new Date(
        `${value}T00:00:00`,
    );

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(
        "vi-VN",
    ).format(date);
};

export const CustomerInvoiceList = ({
                                        invoices,
                                        onViewDetail,
                                        onPayment,
                                    }: CustomerInvoiceListProps) => {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100">
                {invoices.map((invoice) => {
                    const isOverdue =
                        invoice.status ===
                        "OVERDUE";

                    const canPay =
                        invoice.status ===
                        "PENDING" ||
                        invoice.status ===
                        "OVERDUE";

                    return (
                        <article
                            key={invoice.id}
                            className={[
                                "relative grid gap-4 px-5 py-4.5 transition hover:bg-slate-50/70",
                                "md:grid-cols-2",
                                "xl:grid-cols-[180px_minmax(230px,1.4fr)_210px_190px_150px]",
                                "xl:items-center",
                                isOverdue
                                    ? "bg-red-50/20"
                                    : "",
                            ].join(" ")}
                        >
                            {isOverdue && (
                                <span
                                    aria-hidden="true"
                                    className="absolute inset-y-0 left-0 w-0.5 bg-red-400"
                                />
                            )}

                            {/* Mã hóa đơn */}
                            <div className="min-w-0">
                                <p className="whitespace-nowrap text-sm font-bold text-blue-600">
                                    {
                                        invoice.invoiceCode
                                    }
                                </p>

                                <p className="mt-1.5 text-xs text-slate-500">
                                    Hợp đồng:{" "}
                                    <span className="font-medium text-slate-600">
                                        {
                                            invoice.contractCode
                                        }
                                    </span>
                                </p>
                            </div>

                            {/* Thiết bị */}
                            <div className="min-w-0">
                                <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-950">
                                    {
                                        invoice.equipmentName
                                    }
                                </h3>

                                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                                    <span>
                                        {
                                            invoice.equipmentCode
                                        }
                                    </span>

                                    <span className="text-slate-300">
                                        •
                                    </span>

                                    <span className="truncate">
                                        {
                                            invoice.branch
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Ngày */}
                            <div className="min-w-0">
                                <div className="flex items-start gap-2">
                                    <CalendarDays
                                        size={15}
                                        aria-hidden="true"
                                        className="mt-0.5 shrink-0 text-slate-400"
                                    />

                                    <div className="min-w-0">
                                        <div>
                                            <p className="text-[11px] font-medium text-slate-500">
                                                Ngày phát hành
                                            </p>

                                            <p className="mt-0.5 text-sm font-semibold text-slate-900">
                                                {formatDate(
                                                    invoice.issuedAt,
                                                )}
                                            </p>
                                        </div>

                                        <div className="mt-2">
                                            <p className="text-[11px] font-medium text-slate-500">
                                                Hạn thanh toán
                                            </p>

                                            <p
                                                className={[
                                                    "mt-0.5 text-sm font-semibold",
                                                    isOverdue
                                                        ? "text-red-600"
                                                        : "text-slate-900",
                                                ].join(
                                                    " ",
                                                )}
                                            >
                                                {formatDate(
                                                    invoice.dueDate,
                                                )}
                                            </p>

                                            {isOverdue &&
                                                invoice.overdueDays !==
                                                undefined &&
                                                invoice.overdueDays >
                                                0 && (
                                                    <p className="mt-1 text-xs font-semibold text-red-600">
                                                        Quá hạn{" "}
                                                        {
                                                            invoice.overdueDays
                                                        }{" "}
                                                        ngày
                                                    </p>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tiền + trạng thái */}
                            <div className="min-w-0">
                                <p className="text-[11px] font-medium text-slate-500">
                                    Tổng thanh toán
                                </p>

                                <p className="mt-1 whitespace-nowrap text-lg font-bold text-slate-950">
                                    {formatCurrency(
                                        invoice.totalAmount,
                                    )}{" "}
                                    đ
                                </p>

                                <div className="mt-2">
                                    <CustomerInvoiceStatusBadge
                                        status={
                                            invoice.status
                                        }
                                    />
                                </div>

                                {canPay &&
                                    onPayment && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onPayment(
                                                    invoice,
                                                );
                                            }}
                                            className={
                                                isOverdue
                                                    ? "mt-2 inline-flex items-center text-xs font-semibold text-red-600 transition hover:text-red-700 hover:underline"
                                                    : "mt-2 inline-flex items-center text-xs font-semibold text-blue-600 transition hover:text-blue-700 hover:underline"
                                            }
                                        >
                                            {isOverdue
                                                ? "Thanh toán ngay"
                                                : "Thanh toán"}
                                        </button>
                                    )}
                            </div>

                            {/* Xem hóa đơn */}
                            <div className="flex items-center justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onViewDetail(
                                            invoice,
                                        );
                                    }}
                                    className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <Eye
                                        size={14}
                                        aria-hidden="true"
                                    />

                                    Xem hóa đơn
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};