import {
    CheckCircle2,
    CreditCard,
    Landmark,
    QrCode,
    X,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type {
    CustomerInvoiceItem,
} from "../types/customerInvoice.types";

type InvoicePaymentMethod =
    | "Chuyển khoản ngân hàng"
    | "Thanh toán QR"
    | "Thanh toán tại chi nhánh";

interface CustomerInvoicePaymentModalProps {
    invoice: CustomerInvoiceItem | null;
    open: boolean;
    onClose: () => void;
    onSubmit: (
        paymentMethod: InvoicePaymentMethod,
    ) => void;
}

const PAYMENT_METHODS = [
    {
        value: "Chuyển khoản ngân hàng",
        label: "Chuyển khoản ngân hàng",
        description:
            "Thanh toán qua tài khoản ngân hàng của doanh nghiệp.",
        icon: Landmark,
    },
    {
        value: "Thanh toán QR",
        label: "Thanh toán QR",
        description:
            "Quét mã QR để thanh toán nhanh trên ứng dụng ngân hàng.",
        icon: QrCode,
    },
    {
        value: "Thanh toán tại chi nhánh",
        label: "Thanh toán tại chi nhánh",
        description:
            "Thanh toán trực tiếp tại chi nhánh quản lý hợp đồng.",
        icon: CreditCard,
    },
] as const;

const formatCurrency = (
    value: number,
): string =>
    new Intl.NumberFormat("vi-VN").format(
        value,
    );

export const CustomerInvoicePaymentModal = ({
                                                invoice,
                                                open,
                                                onClose,
                                                onSubmit,
                                            }: CustomerInvoicePaymentModalProps) => {
    const [
        paymentMethod,
        setPaymentMethod,
    ] = useState<InvoicePaymentMethod>(
        "Chuyển khoản ngân hàng",
    );

    const [
        isProcessing,
        setIsProcessing,
    ] = useState(false);

    const [
        isCompleted,
        setIsCompleted,
    ] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setPaymentMethod(
            "Chuyển khoản ngân hàng",
        );
        setIsProcessing(false);
        setIsCompleted(false);
    }, [
        open,
        invoice?.id,
    ]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (
            event: KeyboardEvent,
        ): void => {
            if (
                event.key === "Escape" &&
                !isProcessing
            ) {
                onClose();
            }
        };

        document.body.style.overflow =
            "hidden";

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.body.style.overflow =
                "";

            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [
        open,
        isProcessing,
        onClose,
    ]);

    const amountToPay = useMemo(() => {
        if (!invoice) {
            return 0;
        }

        return Math.max(
            0,
            invoice.remainingAmount,
        );
    }, [invoice]);

    if (!open || !invoice) {
        return null;
    }

    const handleConfirmPayment =
        async (): Promise<void> => {
            if (
                isProcessing ||
                isCompleted ||
                amountToPay <= 0
            ) {
                return;
            }

            setIsProcessing(true);

            try {
                await new Promise<void>(
                    (resolve) => {
                        window.setTimeout(
                            resolve,
                            700,
                        );
                    },
                );

                onSubmit(paymentMethod);
                setIsCompleted(true);
            } finally {
                setIsProcessing(false);
            }
        };

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget &&
                    !isProcessing
                ) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="invoice-payment-title"
                className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
                {isCompleted ? (
                    <div className="px-6 py-8 text-center">
                        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                            <CheckCircle2
                                size={30}
                                aria-hidden="true"
                            />
                        </span>

                        <h2
                            id="invoice-payment-title"
                            className="mt-5 text-xl font-bold text-slate-950"
                        >
                            Thanh toán thành công
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Hóa đơn{" "}
                            <span className="font-semibold text-slate-700">
                                {
                                    invoice.invoiceCode
                                }
                            </span>{" "}
                            đã được ghi nhận thanh toán.
                        </p>

                        <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                            <p className="text-xs font-medium text-emerald-700">
                                Số tiền đã thanh toán
                            </p>

                            <p className="mt-1 text-2xl font-bold text-emerald-700">
                                {formatCurrency(
                                    amountToPay,
                                )}{" "}
                                đ
                            </p>

                            <p className="mt-2 text-xs text-emerald-700">
                                {
                                    paymentMethod
                                }
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Hoàn tất
                        </button>
                    </div>
                ) : (
                    <>
                        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                            <div>
                                <h2
                                    id="invoice-payment-title"
                                    className="text-xl font-bold text-slate-950"
                                >
                                    Thanh toán hóa đơn
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Xác nhận thanh toán cho{" "}
                                    <span className="font-semibold text-slate-700">
                                        {
                                            invoice.invoiceCode
                                        }
                                    </span>
                                </p>
                            </div>

                            <button
                                type="button"
                                aria-label="Đóng"
                                disabled={
                                    isProcessing
                                }
                                onClick={onClose}
                                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <X
                                    size={19}
                                    aria-hidden="true"
                                />
                            </button>
                        </header>

                        <div className="space-y-5 px-5 py-5">
                            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-blue-600">
                                            {
                                                invoice.invoiceCode
                                            }
                                        </p>

                                        <h3 className="mt-1 text-sm font-bold text-slate-950">
                                            {
                                                invoice.equipmentName
                                            }
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Hợp đồng:{" "}
                                            {
                                                invoice.contractCode
                                            }
                                        </p>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <p className="text-xs text-slate-500">
                                            Cần thanh toán
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-blue-600">
                                            {formatCurrency(
                                                amountToPay,
                                            )}{" "}
                                            đ
                                        </p>
                                    </div>
                                </div>

                                <dl className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-3">
                                    <div>
                                        <dt className="text-xs text-slate-500">
                                            Tổng hóa đơn
                                        </dt>

                                        <dd className="mt-1 text-sm font-semibold text-slate-900">
                                            {formatCurrency(
                                                invoice.totalAmount,
                                            )}{" "}
                                            đ
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-xs text-slate-500">
                                            Đã thanh toán
                                        </dt>

                                        <dd className="mt-1 text-sm font-semibold text-emerald-700">
                                            {formatCurrency(
                                                invoice.paidAmount,
                                            )}{" "}
                                            đ
                                        </dd>
                                    </div>

                                    <div>
                                        <dt className="text-xs text-slate-500">
                                            Còn phải trả
                                        </dt>

                                        <dd className="mt-1 text-sm font-semibold text-amber-700">
                                            {formatCurrency(
                                                amountToPay,
                                            )}{" "}
                                            đ
                                        </dd>
                                    </div>
                                </dl>
                            </section>

                            <section>
                                <h3 className="text-sm font-bold text-slate-900">
                                    Phương thức thanh toán
                                </h3>

                                <div className="mt-3 space-y-2">
                                    {PAYMENT_METHODS.map(
                                        (method) => {
                                            const Icon =
                                                method.icon;

                                            const isSelected =
                                                paymentMethod ===
                                                method.value;

                                            return (
                                                <button
                                                    key={
                                                        method.value
                                                    }
                                                    type="button"
                                                    disabled={
                                                        isProcessing
                                                    }
                                                    onClick={() => {
                                                        setPaymentMethod(
                                                            method.value,
                                                        );
                                                    }}
                                                    className={[
                                                        "flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition",
                                                        isSelected
                                                            ? "border-blue-300 bg-blue-50 ring-2 ring-blue-100"
                                                            : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50",
                                                        isProcessing
                                                            ? "cursor-not-allowed opacity-60"
                                                            : "",
                                                    ].join(
                                                        " ",
                                                    )}
                                                >
                                                    <span
                                                        className={[
                                                            "flex size-9 shrink-0 items-center justify-center rounded-xl",
                                                            isSelected
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-slate-100 text-slate-500",
                                                        ].join(
                                                            " ",
                                                        )}
                                                    >
                                                        <Icon
                                                            size={
                                                                17
                                                            }
                                                            aria-hidden="true"
                                                        />
                                                    </span>

                                                    <span className="min-w-0">
                                                        <span className="block text-sm font-semibold text-slate-900">
                                                            {
                                                                method.label
                                                            }
                                                        </span>

                                                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                                                            {
                                                                method.description
                                                            }
                                                        </span>
                                                    </span>
                                                </button>
                                            );
                                        },
                                    )}
                                </div>
                            </section>

                            <div className="rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3">
                                <p className="text-xs leading-5 text-blue-800">
                                    Đây là luồng thanh toán mô phỏng ở frontend.
                                    Khi kết nối backend, thao tác xác nhận sẽ gọi
                                    API thanh toán và nhận trạng thái thực tế từ
                                    hệ thống.
                                </p>
                            </div>
                        </div>

                        <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                disabled={
                                    isProcessing
                                }
                                onClick={onClose}
                                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Hủy bỏ
                            </button>

                            <button
                                type="button"
                                disabled={
                                    isProcessing ||
                                    amountToPay <= 0
                                }
                                onClick={
                                    handleConfirmPayment
                                }
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <CreditCard
                                    size={16}
                                    aria-hidden="true"
                                />

                                {isProcessing
                                    ? "Đang xử lý..."
                                    : "Xác nhận thanh toán"}
                            </button>
                        </footer>
                    </>
                )}
            </section>
        </div>
    );
};