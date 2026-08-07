import {
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    Eye,
    FileText,
    Package,
    XCircle,
} from "lucide-react";

import type {
    CustomerQuotationItem,
} from "../types/customerQuotation.types";

import {
    CustomerQuotationStatusBadge,
} from "./CustomerQuotationStatusBadge";

interface CustomerQuotationCardProps {
    quotation: CustomerQuotationItem;
    onViewDetail: (
        quotation: CustomerQuotationItem,
    ) => void;
    onAccept?: (
        quotation: CustomerQuotationItem,
    ) => void;
    onReject?: (
        quotation: CustomerQuotationItem,
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

const getRemainingDays = (
    validUntil: string,
): number | null => {
    const expirationDate = new Date(
        `${validUntil}T23:59:59`,
    );

    if (
        Number.isNaN(
            expirationDate.getTime(),
        )
    ) {
        return null;
    }

    const currentDate = new Date();

    currentDate.setHours(0, 0, 0, 0);

    const difference =
        expirationDate.getTime() -
        currentDate.getTime();

    return Math.ceil(
        difference /
        (1000 * 60 * 60 * 24),
    );
};

export const CustomerQuotationCard = ({
                                          quotation,
                                          onViewDetail,
                                          onAccept,
                                          onReject,
                                      }: CustomerQuotationCardProps) => {
    const canRespond =
        quotation.status ===
        "PENDING_RESPONSE";

    const remainingDays =
        getRemainingDays(
            quotation.validUntil,
        );

    const isExpiringSoon =
        canRespond &&
        remainingDays !== null &&
        remainingDays >= 0 &&
        remainingDays <= 2;

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="grid items-start gap-4 md:grid-cols-[140px_minmax(0,1fr)]">
                <div className="overflow-hidden rounded-xl bg-slate-100">
                    <img
                        src={
                            quotation.equipmentImageUrl
                        }
                        alt={
                            quotation.equipmentName
                        }
                        className="h-44 w-full object-cover"
                    />
                </div>

                <div className="min-w-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-blue-600">
                                {
                                    quotation.quotationCode
                                }
                            </p>

                            <h2 className="mt-1 line-clamp-1 text-base font-bold text-slate-950">
                                {
                                    quotation.equipmentName
                                }
                            </h2>

                            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                                <span>
                                    Yêu cầu:{" "}
                                    {
                                        quotation.requestCode
                                    }
                                </span>

                                <span>
                                    {
                                        quotation.branch
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="shrink-0">
                            <CustomerQuotationStatusBadge
                                status={
                                    quotation.status
                                }
                            />
                        </div>
                    </div>

                    <dl className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div>
                            <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <CalendarDays
                                    size={14}
                                    aria-hidden="true"
                                />

                                Thời gian thuê
                            </dt>

                            <dd className="mt-1 text-sm font-semibold text-slate-900">
                                {formatDate(
                                    quotation.startDate,
                                )}
                                {" - "}
                                {formatDate(
                                    quotation.endDate,
                                )}
                            </dd>

                            <dd className="mt-0.5 text-xs text-slate-500">
                                {
                                    quotation.rentalDays
                                }{" "}
                                ngày
                            </dd>
                        </div>

                        <div>
                            <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <Package
                                    size={14}
                                    aria-hidden="true"
                                />

                                Số lượng
                            </dt>

                            <dd className="mt-1 text-sm font-semibold text-slate-900">
                                {
                                    quotation.quantity
                                }
                            </dd>
                        </div>

                        <div>
                            <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <CalendarDays
                                    size={14}
                                    aria-hidden="true"
                                />

                                Hiệu lực đến
                            </dt>

                            <dd className="mt-1 text-sm font-semibold text-slate-900">
                                {formatDate(
                                    quotation.validUntil,
                                )}
                            </dd>

                            {isExpiringSoon && (
                                <dd className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                                    <AlertTriangle
                                        size={13}
                                        aria-hidden="true"
                                    />

                                    {remainingDays === 0
                                        ? "Hết hạn hôm nay"
                                        : `Còn ${remainingDays} ngày`}
                                </dd>
                            )}
                        </div>

                        <div>
                            <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <FileText
                                    size={14}
                                    aria-hidden="true"
                                />

                                Tổng báo giá
                            </dt>

                            <dd className="mt-1 text-lg font-bold text-blue-600">
                                {formatCurrency(
                                    quotation.totalAmount,
                                )}{" "}
                                đ
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                        <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-2 xl:grid-cols-4">
                            <div>
                                <dt className="text-[11px] text-slate-500">
                                    Tiền thuê
                                </dt>

                                <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                                    {formatCurrency(
                                        quotation.rentalAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>

                            <div>
                                <dt className="text-[11px] text-slate-500">
                                    Phí giao nhận
                                </dt>

                                <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                                    {formatCurrency(
                                        quotation.deliveryFee,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>

                            <div>
                                <dt className="text-[11px] text-slate-500">
                                    Tiền đặt cọc
                                </dt>

                                <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                                    {formatCurrency(
                                        quotation.depositAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>

                            <div>
                                <dt className="text-[11px] text-slate-500">
                                    VAT
                                </dt>

                                <dd className="mt-0.5 text-sm font-semibold text-slate-900">
                                    {formatCurrency(
                                        quotation.vatAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-3">
                        <button
                            type="button"
                            onClick={() => {
                                onViewDetail(
                                    quotation,
                                );
                            }}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                            <Eye
                                size={15}
                                aria-hidden="true"
                            />

                            Xem chi tiết
                        </button>

                        {canRespond &&
                            onReject && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onReject(
                                            quotation,
                                        );
                                    }}
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                    <XCircle
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    Từ chối
                                </button>
                            )}

                        {canRespond &&
                            onAccept && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onAccept(
                                            quotation,
                                        );
                                    }}
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                                >
                                    <CheckCircle2
                                        size={15}
                                        aria-hidden="true"
                                        className="text-white"
                                    />

                                    <span className="text-white">
                                        Chấp nhận báo giá
                                    </span>
                                </button>
                            )}
                    </div>

                    {quotation.status ===
                        "REJECTED" &&
                        quotation.rejectionReason && (
                            <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3">
                                <p className="text-xs font-bold text-red-700">
                                    Lý do từ chối
                                </p>

                                <p className="mt-1 text-sm leading-6 text-red-700">
                                    {
                                        quotation.rejectionReason
                                    }
                                </p>
                            </div>
                        )}
                </div>
            </div>
        </article>
    );
};