import {
    CalendarDays,
    Eye,
    Package,
} from "lucide-react";

import type {
    CustomerReturnRequestItem,
} from "../types/customerReturnRequest.types";

import {
    CustomerReturnRequestStatusBadge,
} from "./CustomerReturnRequestStatusBadge";

interface CustomerReturnRequestTableProps {
    requests: CustomerReturnRequestItem[];

    onViewDetail: (
        request: CustomerReturnRequestItem,
    ) => void;
}

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
): {
    date: string;
    time: string;
} => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return {
            date: value,
            time: "",
        };
    }

    return {
        date: new Intl.DateTimeFormat(
            "vi-VN",
        ).format(date),

        time: new Intl.DateTimeFormat(
            "vi-VN",
            {
                hour: "2-digit",
                minute: "2-digit",
            },
        ).format(date),
    };
};

export const CustomerReturnRequestTable = ({
                                               requests,
                                               onViewDetail,
                                           }: CustomerReturnRequestTableProps) => {
    return (
        <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="hidden border-b border-slate-200 bg-slate-50/80 px-5 py-3 xl:grid xl:grid-cols-[145px_minmax(250px,1fr)_135px_135px_150px_110px] xl:items-center xl:gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Yêu cầu
                </p>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Thiết bị
                </p>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Ngày yêu cầu
                </p>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Dự kiến trả
                </p>

                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Trạng thái
                </p>

                <p className="text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Thao tác
                </p>
            </div>

            <div className="divide-y divide-slate-100">
                {requests.map((request) => {
                    const requested =
                        formatDateTime(
                            request.requestedAt,
                        );

                    return (
                        <article
                            key={request.id}
                            className={[
                                "grid w-full gap-4 px-5 py-4 transition",
                                "hover:bg-slate-50/70",
                                "md:grid-cols-2",
                                "xl:grid-cols-[145px_minmax(250px,1fr)_135px_135px_150px_110px]",
                                "xl:items-center xl:gap-3",
                            ].join(" ")}
                        >
                            {/* Yêu cầu + hợp đồng */}
                            <div className="min-w-0">
                                <p className="whitespace-nowrap text-sm font-bold text-blue-600">
                                    {
                                        request.requestCode
                                    }
                                </p>

                                <p className="mt-1.5 truncate text-xs text-slate-500">
                                    HĐ:{" "}
                                    <span className="font-medium text-slate-600">
                                        {
                                            request.contractCode
                                        }
                                    </span>
                                </p>
                            </div>

                            {/* Thiết bị */}
                            <div className="flex min-w-0 items-center gap-3">
                                {/* Thumbnail + fallback */}
                                <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                    <Package
                                        size={19}
                                        aria-hidden="true"
                                        className="absolute text-blue-500"
                                    />

                                    {request.equipmentImageUrl && (
                                        <img
                                            src={
                                                request.equipmentImageUrl
                                            }
                                            alt={
                                                request.equipmentName
                                            }
                                            loading="lazy"
                                            className="relative z-10 h-full w-full object-cover"
                                            onError={(
                                                event,
                                            ) => {
                                                event.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Nội dung thiết bị */}
                                <div className="min-w-0">
                                    <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-950">
                                        {
                                            request.equipmentName
                                        }
                                    </h3>

                                    <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                                        <span className="shrink-0 font-medium text-slate-600">
                                            {
                                                request.equipmentCode
                                            }
                                        </span>

                                        <span className="text-slate-300">
                                            •
                                        </span>

                                        <span className="truncate">
                                            {
                                                request.branch
                                            }
                                        </span>
                                    </div>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Số lượng:{" "}
                                        {
                                            request.quantity
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Ngày yêu cầu */}
                            <div className="min-w-0">
                                <p className="mb-1 text-xs font-medium text-slate-500 xl:hidden">
                                    Ngày yêu cầu
                                </p>

                                <div className="flex items-start gap-2">
                                    <CalendarDays
                                        size={14}
                                        aria-hidden="true"
                                        className="mt-0.5 shrink-0 text-slate-400"
                                    />

                                    <div className="min-w-0">
                                        <p className="whitespace-nowrap text-sm font-semibold text-slate-900">
                                            {
                                                requested.date
                                            }
                                        </p>

                                        {requested.time && (
                                            <p className="mt-1 text-xs text-slate-500">
                                                {
                                                    requested.time
                                                }
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Dự kiến trả */}
                            <div className="min-w-0">
                                <p className="mb-1 text-xs font-medium text-slate-500 xl:hidden">
                                    Dự kiến trả
                                </p>

                                <p className="whitespace-nowrap text-sm font-semibold text-slate-900">
                                    {formatDate(
                                        request.expectedReturnDate,
                                    )}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {
                                        request.expectedReturnTime
                                    }
                                </p>
                            </div>

                            {/* Trạng thái */}
                            <div className="min-w-0">
                                <p className="mb-1 text-xs font-medium text-slate-500 xl:hidden">
                                    Trạng thái
                                </p>

                                <CustomerReturnRequestStatusBadge
                                    status={
                                        request.status
                                    }
                                />
                            </div>

                            {/* Thao tác */}
                            <div className="flex min-w-0 items-center xl:justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onViewDetail(
                                            request,
                                        );
                                    }}
                                    className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <Eye
                                        size={14}
                                        aria-hidden="true"
                                    />

                                    Chi tiết
                                </button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </section>
    );
};