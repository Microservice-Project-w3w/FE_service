import {
    AlertTriangle,
    X,
    XCircle,
} from "lucide-react";
import {
    useEffect,
    useState,
} from "react";

import type {
    CustomerRentalRequestItem,
} from "../types/customerRentalRequest.types";

interface CustomerRentalRequestCancelModalProps {
    request: CustomerRentalRequestItem | null;
    open: boolean;
    onClose: () => void;
    onConfirm: (
        request: CustomerRentalRequestItem,
        reason: string,
    ) => void;
}

const formatCurrency = (
    value: number,
): string =>
    new Intl.NumberFormat("vi-VN").format(
        value,
    );

export const CustomerRentalRequestCancelModal = ({
                                                     request,
                                                     open,
                                                     onClose,
                                                     onConfirm,
                                                 }: CustomerRentalRequestCancelModalProps) => {
    const [
        reason,
        setReason,
    ] = useState("");

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setReason("");
        setIsSubmitting(false);
    }, [
        open,
        request?.id,
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
                !isSubmitting
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
        isSubmitting,
        onClose,
    ]);

    if (!open || !request) {
        return null;
    }

    const isValid =
        reason.trim().length >= 5;

    const handleConfirm =
        async (): Promise<void> => {
            if (
                !isValid ||
                isSubmitting
            ) {
                return;
            }

            setIsSubmitting(true);

            try {
                await new Promise<void>(
                    (resolve) => {
                        window.setTimeout(
                            resolve,
                            500,
                        );
                    },
                );

                onConfirm(
                    request,
                    reason.trim(),
                );
            } finally {
                setIsSubmitting(false);
            }
        };

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget &&
                    !isSubmitting
                ) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="cancel-rental-request-title"
                className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
                <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                    <div className="flex items-start gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <XCircle
                                size={20}
                                aria-hidden="true"
                            />
                        </span>

                        <div>
                            <h2
                                id="cancel-rental-request-title"
                                className="text-lg font-bold text-slate-950"
                            >
                                Hủy yêu cầu thuê
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Xác nhận hủy yêu cầu{" "}
                                <span className="font-semibold text-slate-700">
                                    {
                                        request.requestCode
                                    }
                                </span>
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label="Đóng"
                        disabled={isSubmitting}
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
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            Bạn có chắc muốn hủy yêu cầu này?
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-500">
                            Yêu cầu sẽ được chuyển sang trạng thái
                            đã hủy và không tiếp tục được xử lý.
                        </p>
                    </div>

                    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-bold text-blue-600">
                            {
                                request.requestCode
                            }
                        </p>

                        <h3 className="mt-1 text-sm font-bold text-slate-950">
                            {
                                request.equipmentName
                            }
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            {
                                request.equipmentCode
                            }{" "}
                            •{" "}
                            {
                                request.branch
                            }
                        </p>

                        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3">
                            <div>
                                <p className="text-xs text-slate-500">
                                    Số lượng
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {
                                        request.quantity
                                    }
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-slate-500">
                                    Chi phí dự kiến
                                </p>

                                <p className="mt-1 text-sm font-semibold text-blue-600">
                                    {formatCurrency(
                                        request.estimatedTotal,
                                    )}{" "}
                                    đ
                                </p>
                            </div>
                        </div>
                    </section>

                    <label className="block">
                        <span className="text-sm font-semibold text-slate-700">
                            Lý do hủy{" "}
                            <span className="text-red-500">
                                *
                            </span>
                        </span>

                        <textarea
                            value={reason}
                            maxLength={300}
                            rows={4}
                            disabled={isSubmitting}
                            onChange={(event) => {
                                setReason(
                                    event.target.value,
                                );
                            }}
                            placeholder="Ví dụ: Kế hoạch thay đổi, không còn nhu cầu thuê thiết bị..."
                            className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />

                        <div className="mt-1 flex items-center justify-between">
                            <span className="text-xs text-slate-400">
                                Tối thiểu 5 ký tự
                            </span>

                            <span className="text-xs text-slate-400">
                                {reason.length}/300
                            </span>
                        </div>
                    </label>

                    <div className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50 px-3.5 py-3">
                        <AlertTriangle
                            size={17}
                            aria-hidden="true"
                            className="mt-0.5 shrink-0 text-amber-600"
                        />

                        <p className="text-xs leading-5 text-amber-800">
                            Sau khi hủy, yêu cầu thuê này sẽ không thể
                            tiếp tục được xử lý. Nếu cần thuê lại, bạn
                            phải tạo một yêu cầu mới.
                        </p>
                    </div>
                </div>

                <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onClose}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Không hủy
                    </button>

                    <button
                        type="button"
                        disabled={
                            !isValid ||
                            isSubmitting
                        }
                        onClick={
                            handleConfirm
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <XCircle
                            size={16}
                            aria-hidden="true"
                        />

                        {isSubmitting
                            ? "Đang hủy..."
                            : "Xác nhận hủy"}
                    </button>
                </footer>
            </section>
        </div>
    );
};