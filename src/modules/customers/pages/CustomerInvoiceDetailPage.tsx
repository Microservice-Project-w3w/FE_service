import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    CreditCard,
    FileText,
    ReceiptText,
    Tag,
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
    CustomerInvoiceStatusBadge,
} from "../components/CustomerInvoiceStatusBadge";
import {
    CUSTOMER_INVOICE_MOCKS,
} from "../mocks/customerInvoice.mock";

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

export const CustomerInvoiceDetailPage = () => {
    const { invoiceId } = useParams<{
        invoiceId: string;
    }>();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    }, [invoiceId]);

    const invoice =
        CUSTOMER_INVOICE_MOCKS.find(
            (item) =>
                item.id === invoiceId,
        );

    if (!invoice) {
        return (
            <Navigate
                to="/customer/invoices"
                replace
            />
        );
    }

    const isPaid =
        invoice.status === "PAID";

    const isOverdue =
        invoice.status === "OVERDUE";

    return (
        <main className="space-y-5">
            <Link
                to="/customer/invoices"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
                <ArrowLeft
                    size={18}
                    aria-hidden="true"
                />

                Quay lại danh sách hóa đơn
            </Link>

            <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-sm font-bold text-blue-600">
                        {invoice.invoiceCode}
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-950">
                        Chi tiết hóa đơn
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Kiểm tra thông tin hóa đơn,
                        số tiền và trạng thái thanh toán.
                    </p>
                </div>

                <CustomerInvoiceStatusBadge
                    status={invoice.status}
                />
            </header>

            <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
                <div className="space-y-5">
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <ReceiptText
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Thông tin hóa đơn
                            </h2>
                        </div>

                        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="text-xs text-slate-500">
                                    Mã hóa đơn
                                </dt>

                                <dd className="mt-2 text-sm font-bold text-slate-950">
                                    {invoice.invoiceCode}
                                </dd>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="text-xs text-slate-500">
                                    Hợp đồng
                                </dt>

                                <dd className="mt-2 text-sm font-bold text-blue-600">
                                    {invoice.contractCode}
                                </dd>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="flex items-center gap-2 text-xs text-slate-500">
                                    <CalendarDays
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    Ngày phát hành
                                </dt>

                                <dd className="mt-2 text-sm font-semibold text-slate-900">
                                    {formatDate(
                                        invoice.issuedAt,
                                    )}
                                </dd>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="flex items-center gap-2 text-xs text-slate-500">
                                    <CalendarDays
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    Hạn thanh toán
                                </dt>

                                <dd
                                    className={[
                                        "mt-2 text-sm font-semibold",
                                        isOverdue
                                            ? "text-red-600"
                                            : "text-slate-900",
                                    ].join(" ")}
                                >
                                    {formatDate(
                                        invoice.dueDate,
                                    )}
                                </dd>

                                {isOverdue &&
                                    invoice.overdueDays && (
                                        <p className="mt-1 text-xs font-semibold text-red-600">
                                            Quá hạn{" "}
                                            {
                                                invoice.overdueDays
                                            }{" "}
                                            ngày
                                        </p>
                                    )}
                            </div>
                        </dl>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Tag
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Thiết bị và chi nhánh
                            </h2>
                        </div>

                        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs text-slate-500">
                                Thiết bị
                            </p>

                            <h3 className="mt-2 text-lg font-bold text-slate-950">
                                {invoice.equipmentName}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Mã thiết bị:{" "}
                                {
                                    invoice.equipmentCode
                                }
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                {invoice.branch}
                            </p>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <CreditCard
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Chi tiết thanh toán
                            </h2>
                        </div>

                        <dl className="mt-5 space-y-3">
                            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                                <dt className="text-sm text-slate-500">
                                    Tạm tính
                                </dt>

                                <dd className="text-sm font-semibold text-slate-900">
                                    {formatCurrency(
                                        invoice.subtotal,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                                <dt className="text-sm text-slate-500">
                                    Thuế
                                </dt>

                                <dd className="text-sm font-semibold text-slate-900">
                                    {formatCurrency(
                                        invoice.taxAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                                <dt className="text-sm text-slate-500">
                                    Giảm giá
                                </dt>

                                <dd className="text-sm font-semibold text-emerald-700">
                                    -{" "}
                                    {formatCurrency(
                                        invoice.discountAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-4 pt-1">
                                <dt className="text-sm font-bold text-slate-900">
                                    Tổng thanh toán
                                </dt>

                                <dd className="text-xl font-bold text-blue-600">
                                    {formatCurrency(
                                        invoice.totalAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>
                        </dl>
                    </article>

                    {isPaid && (
                        <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                            <div className="flex items-start gap-3">
                                <CheckCircle2
                                    size={20}
                                    aria-hidden="true"
                                    className="mt-0.5 text-emerald-600"
                                />

                                <div>
                                    <h2 className="text-sm font-bold text-emerald-800">
                                        Hóa đơn đã được thanh toán
                                    </h2>

                                    {invoice.paidAt && (
                                        <p className="mt-2 text-sm text-emerald-700">
                                            Thanh toán lúc{" "}
                                            {formatDateTime(
                                                invoice.paidAt,
                                            )}
                                        </p>
                                    )}

                                    {invoice.paymentMethod && (
                                        <p className="mt-1 text-sm text-emerald-700">
                                            Phương thức:{" "}
                                            {
                                                invoice.paymentMethod
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>
                        </article>
                    )}
                </div>

                <aside className="space-y-4">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <FileText
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Tóm tắt hóa đơn
                            </h2>
                        </div>

                        <dl className="mt-5 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Tổng hóa đơn
                                </dt>

                                <dd className="text-sm font-bold text-slate-950">
                                    {formatCurrency(
                                        invoice.totalAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Đã thanh toán
                                </dt>

                                <dd className="text-sm font-bold text-emerald-700">
                                    {formatCurrency(
                                        invoice.paidAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Còn phải trả
                                </dt>

                                <dd
                                    className={[
                                        "text-sm font-bold",
                                        invoice.remainingAmount >
                                        0
                                            ? "text-amber-700"
                                            : "text-slate-900",
                                    ].join(" ")}
                                >
                                    {formatCurrency(
                                        invoice.remainingAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>
                        </dl>

                        {!isPaid &&
                            invoice.status !==
                            "CANCELLED" && (
                                <button
                                    type="button"
                                    className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Thanh toán hóa đơn
                                </button>
                            )}
                    </section>

                    {invoice.note && (
                        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-sm font-bold text-blue-950">
                                Ghi chú
                            </p>

                            <p className="mt-2 text-sm leading-6 text-blue-800">
                                {invoice.note}
                            </p>
                        </section>
                    )}
                </aside>
            </section>
        </main>
    );
};