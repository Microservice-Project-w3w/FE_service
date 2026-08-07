import {
    ArrowLeft,
    CalendarDays,
    FileText,
    MapPin,
    Package,
    StickyNote,
    Truck,
} from "lucide-react";
import {
    useEffect,
} from "react";
import {
    Navigate,
    useNavigate,
    useParams,
} from "react-router";

import {
    CustomerReturnRequestStatusBadge,
} from "../components/CustomerReturnRequestStatusBadge";

import {
    CUSTOMER_RETURN_REQUEST_MOCKS,
} from "../mocks/customerReturnRequest.mock";

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

export const CustomerReturnRequestDetailPage = () => {
    const navigate = useNavigate();

    const {
        returnRequestId,
    } = useParams<{
        returnRequestId: string;
    }>();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    }, [returnRequestId]);

    const request =
        CUSTOMER_RETURN_REQUEST_MOCKS.find(
            (item) =>
                item.id ===
                returnRequestId,
        );

    if (!request) {
        return (
            <Navigate
                to="/customer/return-requests"
                replace
            />
        );
    }

    const returnMethodLabel =
        request.returnMethod ===
        "BRANCH_RETURN"
            ? "Trả tại chi nhánh"
            : "Đơn vị đến nhận";

    return (
        <main className="space-y-5">
            <button
                type="button"
                onClick={() => {
                    navigate(
                        "/customer/return-requests",
                    );
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
                <ArrowLeft
                    size={17}
                    aria-hidden="true"
                />

                Quay lại danh sách
            </button>

            <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm font-bold text-blue-600">
                        {
                            request.requestCode
                        }
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-950">
                        Chi tiết yêu cầu trả
                    </h1>

                    <p className="mt-1.5 text-sm text-slate-500">
                        Theo dõi lịch trả và
                        tình trạng xử lý yêu
                        cầu.
                    </p>
                </div>

                <CustomerReturnRequestStatusBadge
                    status={
                        request.status
                    }
                />
            </header>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-5">
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Package
                                size={19}
                                className="text-blue-600"
                                aria-hidden="true"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Thiết bị
                            </h2>
                        </div>

                        <div className="mt-5 flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="size-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                <img
                                    src={
                                        request.equipmentImageUrl
                                    }
                                    alt={
                                        request.equipmentName
                                    }
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="min-w-0">
                                <h3 className="text-lg font-bold text-slate-950">
                                    {
                                        request.equipmentName
                                    }
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    {
                                        request.equipmentCode
                                    }
                                </p>

                                <p className="mt-1 text-sm text-slate-500">
                                    Số lượng:{" "}
                                    {
                                        request.quantity
                                    }
                                </p>

                                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                                    <MapPin
                                        size={
                                            14
                                        }
                                        aria-hidden="true"
                                    />

                                    {
                                        request.branch
                                    }
                                </p>
                            </div>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={19}
                                className="text-blue-600"
                                aria-hidden="true"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Lịch hoàn trả
                            </h2>
                        </div>

                        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="text-xs text-slate-500">
                                    Ngày gửi yêu
                                    cầu
                                </dt>

                                <dd className="mt-1.5 text-sm font-semibold text-slate-900">
                                    {formatDateTime(
                                        request.requestedAt,
                                    )}
                                </dd>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="text-xs text-slate-500">
                                    Dự kiến trả
                                </dt>

                                <dd className="mt-1.5 text-sm font-semibold text-slate-900">
                                    {formatDate(
                                        request.expectedReturnDate,
                                    )}{" "}
                                    {
                                        request.expectedReturnTime
                                    }
                                </dd>
                            </div>
                        </dl>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Truck
                                size={19}
                                className="text-blue-600"
                                aria-hidden="true"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Hình thức hoàn trả
                            </h2>
                        </div>

                        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-900">
                                {
                                    returnMethodLabel
                                }
                            </p>
                        </div>
                    </article>

                    {request.note && (
                        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2">
                                <StickyNote
                                    size={
                                        19
                                    }
                                    className="text-blue-600"
                                    aria-hidden="true"
                                />

                                <h2 className="text-base font-bold text-slate-950">
                                    Ghi chú
                                </h2>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-slate-600">
                                {
                                    request.note
                                }
                            </p>
                        </article>
                    )}

                    {request.cancellationReason && (
                        <article className="rounded-2xl border border-red-200 bg-red-50 p-5">
                            <h2 className="text-sm font-bold text-red-800">
                                Lý do hủy
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-red-700">
                                {
                                    request.cancellationReason
                                }
                            </p>
                        </article>
                    )}
                </div>

                <aside className="space-y-4">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <FileText
                                size={19}
                                className="text-blue-600"
                                aria-hidden="true"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Thông tin liên
                                quan
                            </h2>
                        </div>

                        <dl className="mt-5 space-y-4">
                            <div>
                                <dt className="text-xs text-slate-500">
                                    Hợp đồng
                                </dt>

                                <dd className="mt-1 text-sm font-bold text-blue-600">
                                    {
                                        request.contractCode
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-slate-500">
                                    Chi nhánh
                                </dt>

                                <dd className="mt-1 text-sm font-semibold text-slate-900">
                                    {
                                        request.branch
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-slate-500">
                                    Trạng thái
                                </dt>

                                <dd className="mt-2">
                                    <CustomerReturnRequestStatusBadge
                                        status={
                                            request.status
                                        }
                                    />
                                </dd>
                            </div>
                        </dl>
                    </section>

                    {request.completedAt && (
                        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                            <p className="text-sm font-bold text-emerald-800">
                                Đã hoàn thành
                            </p>

                            <p className="mt-1.5 text-sm text-emerald-700">
                                {formatDateTime(
                                    request.completedAt,
                                )}
                            </p>
                        </section>
                    )}
                </aside>
            </section>
        </main>
    );
};