import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    Package,
    ReceiptText,
    Tag,
    Truck,
    XCircle,
} from "lucide-react";
import {
    useEffect,
} from "react";
import {
    Link,
    Navigate,
    useParams,
} from "react-router";

import {
    CustomerQuotationStatusBadge,
} from "../components/CustomerQuotationStatusBadge";
import {
    CUSTOMER_QUOTATION_MOCKS,
} from "../mocks/customerQuotation.mock";

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

export const CustomerQuotationDetailPage = () => {
    const { quotationId } = useParams<{
        quotationId: string;
    }>();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    }, [quotationId]);

    const quotation =
        CUSTOMER_QUOTATION_MOCKS.find(
            (item) => item.id === quotationId,
        );

    if (!quotation) {
        return (
            <Navigate
                to="/customer/quotations"
                replace
            />
        );
    }

    const canRespond =
        quotation.status ===
        "PENDING_RESPONSE";

    const handleAccept = (): void => {
        window.alert(
            `Chấp nhận báo giá ${quotation.quotationCode}`,
        );
    };

    const handleReject = (): void => {
        window.alert(
            `Từ chối báo giá ${quotation.quotationCode}`,
        );
    };

    return (
        <main className="space-y-5">
            <Link
                to="/customer/quotations"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
                <ArrowLeft
                    size={18}
                    aria-hidden="true"
                />

                Quay lại danh sách báo giá
            </Link>

            <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-sm font-bold text-blue-600">
                        {quotation.quotationCode}
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-950">
                        Chi tiết báo giá
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Kiểm tra thông tin thuê thiết
                        bị và các khoản chi phí trước
                        khi phản hồi.
                    </p>
                </div>

                <CustomerQuotationStatusBadge
                    status={quotation.status}
                />
            </header>

            <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
                <div className="space-y-5">
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="grid gap-5 md:grid-cols-[180px_1fr]">
                            <div className="overflow-hidden rounded-xl bg-slate-100">
                                <img
                                    src={
                                        quotation.equipmentImageUrl
                                    }
                                    alt={
                                        quotation.equipmentName
                                    }
                                    className="h-44 w-full object-cover md:h-full md:min-h-44"
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                                    Thiết bị báo giá
                                </p>

                                <h2 className="mt-2 text-xl font-bold text-slate-950">
                                    {
                                        quotation.equipmentName
                                    }
                                </h2>

                                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                    <Tag
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {
                                            quotation.equipmentCode
                                        }
                                    </span>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                    <Building2
                                        size={16}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {quotation.branch}
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                    <FileText
                                        size={16}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        Yêu cầu{" "}
                                        {
                                            quotation.requestCode
                                        }
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
                                        quotation.startDate,
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
                                        quotation.endDate,
                                    )}
                                </dd>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                    <Clock3
                                        size={16}
                                        aria-hidden="true"
                                    />

                                    Tổng thời gian
                                </dt>

                                <dd className="mt-2 text-sm font-semibold text-slate-900">
                                    {
                                        quotation.rentalDays
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
                                        quotation.quantity
                                    }
                                </dd>
                            </div>
                        </dl>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-bold text-slate-950">
                            Chi tiết chi phí
                        </h2>

                        <dl className="mt-4 divide-y divide-slate-100">
                            <div className="flex items-center justify-between gap-4 py-3">
                                <dt className="text-sm text-slate-500">
                                    Tiền thuê thiết bị
                                </dt>

                                <dd className="text-sm font-semibold text-slate-900">
                                    {formatCurrency(
                                        quotation.rentalAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-4 py-3">
                                <dt className="flex items-center gap-2 text-sm text-slate-500">
                                    <Truck
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    Phí giao nhận
                                </dt>

                                <dd className="text-sm font-semibold text-slate-900">
                                    {formatCurrency(
                                        quotation.deliveryFee,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-4 py-3">
                                <dt className="text-sm text-slate-500">
                                    Tiền đặt cọc
                                </dt>

                                <dd className="text-sm font-semibold text-slate-900">
                                    {formatCurrency(
                                        quotation.depositAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-4 py-3">
                                <dt className="text-sm text-slate-500">
                                    Thuế VAT
                                </dt>

                                <dd className="text-sm font-semibold text-slate-900">
                                    {formatCurrency(
                                        quotation.vatAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-4 pt-4">
                                <dt className="text-sm font-bold text-slate-900">
                                    Tổng báo giá
                                </dt>

                                <dd className="text-xl font-bold text-blue-600">
                                    {formatCurrency(
                                        quotation.totalAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>
                        </dl>
                    </article>

                    {quotation.note && (
                        <article className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                            <h2 className="text-sm font-bold text-blue-950">
                                Ghi chú từ chi nhánh
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-blue-800">
                                {quotation.note}
                            </p>
                        </article>
                    )}

                    {quotation.status ===
                        "REJECTED" &&
                        quotation.rejectionReason && (
                            <article className="rounded-2xl border border-red-200 bg-red-50 p-5">
                                <h2 className="text-sm font-bold text-red-800">
                                    Lý do từ chối
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-red-700">
                                    {
                                        quotation.rejectionReason
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
                                Tóm tắt báo giá
                            </h2>
                        </div>

                        <dl className="mt-5 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Mã báo giá
                                </dt>

                                <dd className="text-right text-sm font-semibold text-slate-900">
                                    {
                                        quotation.quotationCode
                                    }
                                </dd>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Ngày tạo
                                </dt>

                                <dd className="text-right text-sm font-semibold text-slate-900">
                                    {formatDateTime(
                                        quotation.createdAt,
                                    )}
                                </dd>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Hiệu lực đến
                                </dt>

                                <dd className="text-right text-sm font-semibold text-slate-900">
                                    {formatDate(
                                        quotation.validUntil,
                                    )}
                                </dd>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Tổng thanh toán dự kiến
                                </dt>

                                <dd className="mt-2 text-2xl font-bold text-blue-600">
                                    {formatCurrency(
                                        quotation.totalAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>
                        </dl>
                    </section>

                    {canRespond && (
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="text-base font-bold text-slate-950">
                                Phản hồi báo giá
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Vui lòng kiểm tra kỹ các
                                khoản chi phí trước khi
                                xác nhận.
                            </p>

                            <div className="mt-4 grid gap-2">
                                <button
                                    type="button"
                                    onClick={
                                        handleAccept
                                    }
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    <CheckCircle2
                                        size={17}
                                        aria-hidden="true"
                                        className="text-white"
                                    />

                                    Chấp nhận báo giá
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleReject
                                    }
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                >
                                    <XCircle
                                        size={17}
                                        aria-hidden="true"
                                    />

                                    Từ chối báo giá
                                </button>
                            </div>
                        </section>
                    )}

                    <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm font-bold text-amber-900">
                            Lưu ý
                        </p>

                        <p className="mt-1 text-sm leading-6 text-amber-800">
                            Sau khi chấp nhận báo giá,
                            hệ thống có thể chuyển sang
                            bước tạo hợp đồng thuê.
                        </p>
                    </section>
                </aside>
            </section>
        </main>
    );
};