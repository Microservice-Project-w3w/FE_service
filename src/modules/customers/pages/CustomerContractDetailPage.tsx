import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    FilePlus2,
    FileText,
    Package,
    ReceiptText,
    Tag,
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
    CustomerContractStatusBadge,
} from "../components/CustomerContractStatusBadge";
import {
    CUSTOMER_CONTRACT_MOCKS,
} from "../mocks/customerContract.mock";

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

const getPaymentProgressClassName = (
    progress: number,
): string => {
    if (progress >= 100) {
        return "bg-emerald-500";
    }

    if (progress >= 50) {
        return "bg-blue-500";
    }

    return "bg-amber-500";
};

export const CustomerContractDetailPage = () => {
    const { contractId } = useParams<{
        contractId: string;
    }>();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    }, [contractId]);

    const contract =
        CUSTOMER_CONTRACT_MOCKS.find(
            (item) => item.id === contractId,
        );

    if (!contract) {
        return (
            <Navigate
                to="/customer/contracts"
                replace
            />
        );
    }

    const paymentProgressClassName =
        getPaymentProgressClassName(
            contract.paymentProgress,
        );

    const handleRequestExtension = (): void => {
        window.alert(
            `Tạo yêu cầu gia hạn cho hợp đồng ${contract.contractCode}`,
        );
    };

    return (
        <main className="space-y-5">
            <Link
                to="/customer/contracts"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
                <ArrowLeft
                    size={18}
                    aria-hidden="true"
                />

                Quay lại danh sách hợp đồng
            </Link>

            <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <p className="text-sm font-bold text-blue-600">
                        {contract.contractCode}
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-950">
                        Chi tiết hợp đồng
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Theo dõi thiết bị thuê, thời hạn,
                        thanh toán và trạng thái hợp đồng.
                    </p>
                </div>

                <CustomerContractStatusBadge
                    status={contract.status}
                />
            </header>

            <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
                <div className="space-y-5">
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="grid gap-5 md:grid-cols-[180px_1fr]">
                            <div className="overflow-hidden rounded-xl bg-slate-100">
                                <img
                                    src={
                                        contract.equipmentImageUrl
                                    }
                                    alt={
                                        contract.equipmentName
                                    }
                                    className="h-44 w-full object-cover"
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                                    Thiết bị trong hợp đồng
                                </p>

                                <h2 className="mt-2 text-xl font-bold text-slate-950">
                                    {
                                        contract.equipmentName
                                    }
                                </h2>

                                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                    <Tag
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {
                                            contract.equipmentCode
                                        }
                                    </span>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                    <Building2
                                        size={16}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        {contract.branch}
                                    </span>
                                </div>

                                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                    <FileText
                                        size={16}
                                        aria-hidden="true"
                                    />

                                    <span>
                                        Báo giá{" "}
                                        {
                                            contract.quotationCode
                                        }
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
                                            contract.requestCode
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-bold text-slate-950">
                            Thông tin thời gian thuê
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
                                        contract.startDate,
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
                                        contract.endDate,
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
                                        contract.rentalDays
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
                                        contract.quantity
                                    }
                                </dd>
                            </div>
                        </dl>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <CreditCard
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Tiến độ thanh toán
                            </h2>
                        </div>

                        <div className="mt-5">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm text-slate-500">
                                    Đã thanh toán
                                </p>

                                <p className="text-sm font-bold text-slate-900">
                                    {
                                        contract.paymentProgress
                                    }
                                    %
                                </p>
                            </div>

                            <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
                                <div
                                    className={[
                                        "h-full rounded-full transition-all",
                                        paymentProgressClassName,
                                    ].join(" ")}
                                    style={{
                                        width: `${Math.min(
                                            100,
                                            Math.max(
                                                0,
                                                contract.paymentProgress,
                                            ),
                                        )}%`,
                                    }}
                                />
                            </div>

                            <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <dt className="text-xs text-slate-500">
                                        Tổng hợp đồng
                                    </dt>

                                    <dd className="mt-2 text-lg font-bold text-blue-600">
                                        {formatCurrency(
                                            contract.totalAmount,
                                        )}{" "}
                                        đ
                                    </dd>
                                </div>

                                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                                    <dt className="text-xs text-emerald-700">
                                        Đã thanh toán
                                    </dt>

                                    <dd className="mt-2 text-lg font-bold text-emerald-700">
                                        {formatCurrency(
                                            contract.paidAmount,
                                        )}{" "}
                                        đ
                                    </dd>
                                </div>

                                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                                    <dt className="text-xs text-amber-700">
                                        Còn phải thanh toán
                                    </dt>

                                    <dd className="mt-2 text-lg font-bold text-amber-700">
                                        {formatCurrency(
                                            contract.remainingAmount,
                                        )}{" "}
                                        đ
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </article>

                    {contract.status ===
                        "CANCELLED" &&
                        contract.cancellationReason && (
                            <article className="rounded-2xl border border-red-200 bg-red-50 p-5">
                                <div className="flex items-center gap-2">
                                    <XCircle
                                        size={18}
                                        aria-hidden="true"
                                        className="text-red-600"
                                    />

                                    <h2 className="text-sm font-bold text-red-800">
                                        Hợp đồng đã bị hủy
                                    </h2>
                                </div>

                                <p className="mt-2 text-sm leading-6 text-red-700">
                                    {
                                        contract.cancellationReason
                                    }
                                </p>
                            </article>
                        )}

                    {contract.status ===
                        "COMPLETED" && (
                            <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={18}
                                        aria-hidden="true"
                                        className="text-emerald-600"
                                    />

                                    <h2 className="text-sm font-bold text-emerald-800">
                                        Hợp đồng đã hoàn thành
                                    </h2>
                                </div>

                                <p className="mt-2 text-sm leading-6 text-emerald-700">
                                    Thiết bị đã được trả và
                                    hợp đồng đã hoàn tất.
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
                                Tóm tắt hợp đồng
                            </h2>
                        </div>

                        <dl className="mt-5 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Mã hợp đồng
                                </dt>

                                <dd className="text-right text-sm font-semibold text-slate-900">
                                    {
                                        contract.contractCode
                                    }
                                </dd>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Ngày tạo
                                </dt>

                                <dd className="text-right text-sm font-semibold text-slate-900">
                                    {formatDateTime(
                                        contract.createdAt,
                                    )}
                                </dd>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Ngày ký
                                </dt>

                                <dd className="text-right text-sm font-semibold text-slate-900">
                                    {contract.signedAt
                                        ? formatDateTime(
                                            contract.signedAt,
                                        )
                                        : "Chưa ký"}
                                </dd>
                            </div>

                            <div className="flex items-start justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Chi nhánh
                                </dt>

                                <dd className="text-right text-sm font-semibold text-slate-900">
                                    {contract.branch}
                                </dd>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Tổng giá trị hợp đồng
                                </dt>

                                <dd className="mt-2 text-2xl font-bold text-blue-600">
                                    {formatCurrency(
                                        contract.totalAmount,
                                    )}{" "}
                                    đ
                                </dd>
                            </div>
                        </dl>
                    </section>

                    {contract.canRequestExtension && (
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="text-base font-bold text-slate-950">
                                Gia hạn hợp đồng
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Gửi yêu cầu gia hạn nếu
                                bạn muốn tiếp tục sử dụng
                                thiết bị sau ngày kết thúc.
                            </p>

                            <button
                                type="button"
                                onClick={
                                    handleRequestExtension
                                }
                                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                                <FilePlus2
                                    size={17}
                                    aria-hidden="true"
                                    className="text-white"
                                />

                                Yêu cầu gia hạn
                            </button>
                        </section>
                    )}

                    <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                        <p className="text-sm font-bold text-blue-950">
                            Lưu ý
                        </p>

                        <p className="mt-1 text-sm leading-6 text-blue-800">
                            Hãy kiểm tra thời hạn hợp đồng
                            và hoàn tất các khoản thanh
                            toán đúng hạn.
                        </p>
                    </section>
                </aside>
            </section>
        </main>
    );
};