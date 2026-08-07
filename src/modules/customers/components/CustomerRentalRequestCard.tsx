import {
    CalendarDays,
    Eye,
    FileText,
    MapPin,
    Package,
    Truck,
    XCircle,
} from "lucide-react";

import type {
    CustomerRentalRequestItem,
} from "../types/customerRentalRequest.types";

import {
    CustomerRentalRequestStatusBadge,
} from "./CustomerRentalRequestStatusBadge";

interface CustomerRentalRequestCardProps {
    request: CustomerRentalRequestItem;
    onViewDetail: (
        request: CustomerRentalRequestItem,
    ) => void;
    onCancelRequest?: (
        request: CustomerRentalRequestItem,
    ) => void;
    onViewQuotation?: (
        request: CustomerRentalRequestItem,
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

const formatDateTime = (
    value: string,
): string => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(
        "vi-VN",
        {
            dateStyle: "short",
            timeStyle: "short",
        },
    ).format(date);
};

const getDeliveryMethodLabel = (
    request: CustomerRentalRequestItem,
): string => {
    if (
        request.deliveryMethod ===
        "PICKUP_AT_BRANCH"
    ) {
        return "Nhận tại chi nhánh";
    }

    return "Giao tận nơi";
};

export const CustomerRentalRequestCard = ({
                                              request,
                                              onViewDetail,
                                              onCancelRequest,
                                              onViewQuotation,
                                          }: CustomerRentalRequestCardProps) => {
    const canCancel =
        request.status === "PENDING" ||
        request.status === "PROCESSING";

    const canViewQuotation =
        request.status === "QUOTED";

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="grid gap-4 md:grid-cols-[140px_1fr]">
                <div className="overflow-hidden rounded-xl bg-slate-100">
                    <img
                        src={
                            request.equipmentImageUrl
                        }
                        alt={
                            request.equipmentName
                        }
                        className="h-40 w-full object-cover md:h-full md:min-h-40"
                    />
                </div>

                <div className="min-w-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-blue-600">
                                {
                                    request.requestCode
                                }
                            </p>

                            <h2 className="mt-1 truncate text-base font-bold text-slate-950">
                                {
                                    request.equipmentName
                                }
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                {
                                    request.equipmentCode
                                }
                            </p>
                        </div>

                        <div className="shrink-0">
                            <CustomerRentalRequestStatusBadge
                                status={
                                    request.status
                                }
                            />
                        </div>
                    </div>

                    <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <div>
                            <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                <CalendarDays
                                    size={14}
                                    aria-hidden="true"
                                />

                                Ngày gửi
                            </dt>

                            <dd className="mt-1 text-sm font-semibold text-slate-900">
                                {formatDateTime(
                                    request.createdAt,
                                )}
                            </dd>
                        </div>

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
                                    request.startDate,
                                )}
                                {" - "}
                                {formatDate(
                                    request.endDate,
                                )}
                            </dd>

                            <dd className="mt-0.5 text-xs text-slate-500">
                                {
                                    request.rentalDays
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
                                    request.quantity
                                }
                            </dd>
                        </div>

                        <div>
                            <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                {request.deliveryMethod ===
                                "PICKUP_AT_BRANCH" ? (
                                    <MapPin
                                        size={14}
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <Truck
                                        size={14}
                                        aria-hidden="true"
                                    />
                                )}

                                Hình thức nhận
                            </dt>

                            <dd className="mt-1 text-sm font-semibold text-slate-900">
                                {getDeliveryMethodLabel(
                                    request,
                                )}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                Chi phí dự kiến
                            </p>

                            <p className="mt-1 text-xl font-bold text-blue-600">
                                {formatCurrency(
                                    request.estimatedTotal,
                                )}{" "}
                                đ
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    onViewDetail(
                                        request,
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

                            {canViewQuotation &&
                                onViewQuotation && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onViewQuotation(
                                                request,
                                            );
                                        }}
                                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                                    >
                                        <FileText
                                            size={15}
                                            aria-hidden="true"
                                        />

                                        Xem báo giá
                                    </button>
                                )}

                            {canCancel &&
                                onCancelRequest && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onCancelRequest(
                                                request,
                                            );
                                        }}
                                        className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    >
                                        <XCircle
                                            size={15}
                                            aria-hidden="true"
                                        />

                                        Hủy yêu cầu
                                    </button>
                                )}
                        </div>
                    </div>

                    {request.status ===
                        "REJECTED" &&
                        request.rejectionReason && (
                            <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3">
                                <p className="text-xs font-bold text-red-700">
                                    Lý do từ chối
                                </p>

                                <p className="mt-1 text-sm text-red-700">
                                    {
                                        request.rejectionReason
                                    }
                                </p>
                            </div>
                        )}
                </div>
            </div>
        </article>
    );
};