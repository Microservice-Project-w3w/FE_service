import {
    ArrowLeft,
    Building2,
    CalendarDays,
    Clock3,
    MapPin,
    Package,
    ReceiptText,
    Tag,
    Truck,
} from "lucide-react";
import {
    Link,
    Navigate,
    useParams,
} from "react-router";

import {
    CustomerRentalRequestStatusBadge,
} from "../components/CustomerRentalRequestStatusBadge";
import {
    CUSTOMER_RENTAL_REQUEST_MOCKS,
} from "../mocks/customerRentalRequest.mock";

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

export const CustomerRentalRequestDetailPage = () => {
    const { requestId } = useParams<{
        requestId: string;
    }>();

    const request =
        CUSTOMER_RENTAL_REQUEST_MOCKS.find(
            (item) => item.id === requestId,
        );

    if (!request) {
        return (
            <Navigate
                to="/customer/rental-requests"
                replace
            />
        );
    }

    const deliveryMethodLabel =
        request.deliveryMethod ===
        "PICKUP_AT_BRANCH"
            ? "Nhận tại chi nhánh"
            : "Giao tận nơi";

    return (
        <main className="space-y-5">
            <Link
                to="/customer/rental-requests"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
                <ArrowLeft
                    size={18}
                    aria-hidden="true"
                />

                Quay lại danh sách yêu cầu
            </Link>

            <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-sm font-bold text-blue-600">
                        {request.requestCode}
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-950">
                        Chi tiết yêu cầu thuê
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Theo dõi thông tin thiết bị,
                        thời gian thuê và trạng thái xử lý.
                    </p>
                </div>

                <CustomerRentalRequestStatusBadge
                    status={request.status}
                />
            </header>

            <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
                <div className="space-y-5">
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="grid gap-5 md:grid-cols-[180px_1fr]">
                            <div className="overflow-hidden rounded-xl bg-slate-100">
                                <img
                                    src={
                                        request.equipmentImageUrl
                                    }
                                    alt={
                                        request.equipmentName
                                    }
                                    className="h-44 w-full object-cover md:h-full md:min-h-44"
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                                    Thiết bị thuê
                                </p>

                                <h2 className="mt-2 text-xl font-bold text-slate-950">
                                    {
                                        request.equipmentName
                                    }
                                </h2>

                                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                    <Tag
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {
                                            request.equipmentCode
                                        }
                                    </span>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                    <Building2
                                        size={16}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {request.branch}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-bold text-slate-950">
                            Thông tin thuê thiết bị
                        </h2>

                        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                    <CalendarDays
                                        size={16}
                                        aria-hidden="true"
                                    />

                                    Ngày bắt đầu
                                </dt>

                                <dd className="mt-2 text-sm font-semibold text-slate-900">
                                    {formatDate(
                                        request.startDate,
                                    )}
                                </dd>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                    <CalendarDays
                                        size={16}
                                        aria-hidden="true"
                                    />

                                    Ngày kết thúc
                                </dt>

                                <dd className="mt-2 text-sm font-semibold text-slate-900">
                                    {formatDate(
                                        request.endDate,
                                    )}
                                </dd>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                    <Clock3
                                        size={16}
                                        aria-hidden="true"
                                    />

                                    Tổng thời gian thuê
                                </dt>

                                <dd className="mt-2 text-sm font-semibold text-slate-900">
                                    {
                                        request.rentalDays
                                    }{" "}
                                    ngày
                                </dd>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                    <Package
                                        size={16}
                                        aria-hidden="true"
                                    />

                                    Số lượng
                                </dt>

                                <dd className="mt-2 text-sm font-semibold text-slate-900">
                                    {
                                        request.quantity
                                    }
                                </dd>
                            </div>
                        </dl>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-bold text-slate-950">
                            Hình thức nhận thiết bị
                        </h2>

                        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <div className="flex gap-3">
                                {request.deliveryMethod ===
                                "PICKUP_AT_BRANCH" ? (
                                    <MapPin
                                        size={20}
                                        aria-hidden="true"
                                        className="mt-0.5 shrink-0 text-blue-600"
                                    />
                                ) : (
                                    <Truck
                                        size={20}
                                        aria-hidden="true"
                                        className="mt-0.5 shrink-0 text-blue-600"
                                    />
                                )}

                                <div>
                                    <p className="text-sm font-bold text-blue-950">
                                        {
                                            deliveryMethodLabel
                                        }
                                    </p>

                                    {request.deliveryMethod ===
                                        "DELIVERY_TO_ADDRESS" &&
                                        request.deliveryAddress && (
                                            <p className="mt-1 text-sm leading-6 text-blue-800">
                                                {
                                                    request.deliveryAddress
                                                }
                                            </p>
                                        )}

                                    {request.deliveryMethod ===
                                        "PICKUP_AT_BRANCH" && (
                                            <p className="mt-1 text-sm leading-6 text-blue-800">
                                                Nhận trực tiếp tại{" "}
                                                {request.branch}.
                                            </p>
                                        )}
                                </div>
                            </div>
                        </div>
                    </article>

                    {request.status ===
                        "REJECTED" &&
                        request.rejectionReason && (
                            <article className="rounded-2xl border border-red-200 bg-red-50 p-5">
                                <h2 className="text-sm font-bold text-red-800">
                                    Lý do từ chối
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-red-700">
                                    {
                                        request.rejectionReason
                                    }
                                </p>
                            </article>
                        )}
                </div>

                <aside className="space-y-4">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <ReceiptText
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Tóm tắt yêu cầu
                            </h2>
                        </div>

                        <dl className="mt-5 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Mã yêu cầu
                                </dt>

                                <dd className="text-right text-sm font-semibold text-slate-900">
                                    {
                                        request.requestCode
                                    }
                                </dd>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Ngày gửi
                                </dt>

                                <dd className="text-right text-sm font-semibold text-slate-900">
                                    {formatDateTime(
                                        request.createdAt,
                                    )}
                                </dd>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Đơn vị thuê
                                </dt>

                                <dd className="text-right text-sm font-semibold text-slate-900">
                                    {
                                        request.rentalUnit
                                    }
                                </dd>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Chi phí dự kiến
                                </dt>

                                <dd className="mt-2 text-2xl font-bold text-blue-600">
                                    {formatCurrency(
                                        request.estimatedTotal,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm font-bold text-amber-900">
                            Lưu ý
                        </p>

                        <p className="mt-1 text-sm leading-6 text-amber-800">
                            Đây là chi phí dự kiến.
                            Báo giá chính thức có thể
                            bao gồm phí giao nhận, tiền
                            đặt cọc hoặc các khoản phí
                            phát sinh khác.
                        </p>
                    </section>
                </aside>
            </section>
        </main>
    );
};