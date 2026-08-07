import {
    ArrowRight,
    CalendarDays,
    Send,
    X,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useState,
} from "react";

import type {
    CustomerContractItem,
} from "../types/customerContract.types";

import type {
    CustomerContractExtensionFormData,
} from "../types/customerContractExtension.types";

interface CustomerContractExtensionModalProps {
    contract: CustomerContractItem | null;
    open: boolean;
    onClose: () => void;
    onSubmit: (
        data: CustomerContractExtensionFormData,
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

const getExtensionDays = (
    currentEndDate: string,
    requestedEndDate: string,
): number => {
    const currentDate = new Date(
        `${currentEndDate}T00:00:00`,
    );

    const requestedDate = new Date(
        `${requestedEndDate}T00:00:00`,
    );

    if (
        Number.isNaN(
            currentDate.getTime(),
        ) ||
        Number.isNaN(
            requestedDate.getTime(),
        )
    ) {
        return 0;
    }

    const difference =
        requestedDate.getTime() -
        currentDate.getTime();

    return Math.max(
        0,
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24),
        ),
    );
};

export const CustomerContractExtensionModal = ({
                                                   contract,
                                                   open,
                                                   onClose,
                                                   onSubmit,
                                               }: CustomerContractExtensionModalProps) => {
    const [
        requestedEndDate,
        setRequestedEndDate,
    ] = useState("");

    const [
        reason,
        setReason,
    ] = useState("");

    const [
        note,
        setNote,
    ] = useState("");

    useEffect(() => {
        if (!open || !contract) {
            return;
        }

        setRequestedEndDate("");
        setReason("");
        setNote("");
    }, [
        open,
        contract,
    ]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (
            event: KeyboardEvent,
        ): void => {
            if (event.key === "Escape") {
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
        onClose,
    ]);

    const extensionDays = useMemo(() => {
        if (!contract) {
            return 0;
        }

        return getExtensionDays(
            contract.endDate,
            requestedEndDate,
        );
    }, [
        contract,
        requestedEndDate,
    ]);

    if (!open || !contract) {
        return null;
    }

    const isValid =
        requestedEndDate !== "" &&
        extensionDays > 0 &&
        reason.trim() !== "";

    const handleSubmit = (): void => {
        if (!isValid) {
            return;
        }

        onSubmit({
            contractId:
            contract.id,

            currentEndDate:
            contract.endDate,

            requestedEndDate,

            reason:
                reason.trim(),

            note:
                note.trim() === ""
                    ? undefined
                    : note.trim(),
        });
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="contract-extension-title"
                className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            >
                <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                    <div>
                        <h2
                            id="contract-extension-title"
                            className="text-xl font-bold text-slate-950"
                        >
                            Yêu cầu gia hạn hợp đồng
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Tạo yêu cầu gia hạn cho hợp đồng{" "}
                            <span className="font-semibold text-slate-700">
                                {
                                    contract.contractCode
                                }
                            </span>
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="Đóng"
                        onClick={onClose}
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X
                            size={19}
                            aria-hidden="true"
                        />
                    </button>
                </header>

                <div className="space-y-5 px-5 py-5">
                    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="grid gap-4 md:grid-cols-[90px_1fr_1fr]">
                            <div className="overflow-hidden rounded-xl bg-slate-100">
                                <img
                                    src={
                                        contract.equipmentImageUrl
                                    }
                                    alt={
                                        contract.equipmentName
                                    }
                                    className="h-20 w-full object-cover"
                                />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs font-bold text-blue-600">
                                    {
                                        contract.contractCode
                                    }
                                </p>

                                <h3 className="mt-1 text-sm font-bold text-slate-950">
                                    {
                                        contract.equipmentName
                                    }
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Số lượng:{" "}
                                    {
                                        contract.quantity
                                    }
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    {
                                        contract.branch
                                    }
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-slate-500">
                                        Tổng tiền hợp đồng
                                    </p>

                                    <p className="mt-1 text-sm font-bold text-slate-900">
                                        {formatCurrency(
                                            contract.totalAmount,
                                        )}{" "}
                                        đ
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">
                                        Ngày kết thúc hiện tại
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                        {formatDate(
                                            contract.endDate,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                1
                            </span>

                            <h3 className="text-sm font-bold text-slate-900">
                                Chọn thời gian gia hạn
                            </h3>
                        </div>

                        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr_120px]">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                <p className="text-xs text-slate-500">
                                    Ngày kết thúc hiện tại
                                </p>

                                <p className="mt-2 text-sm font-bold text-red-600">
                                    {formatDate(
                                        contract.endDate,
                                    )}
                                </p>
                            </div>

                            <div className="hidden items-center md:flex">
                                <ArrowRight
                                    size={18}
                                    aria-hidden="true"
                                    className="text-slate-400"
                                />
                            </div>

                            <label className="block">
                                <span className="text-xs font-semibold text-slate-700">
                                    Ngày kết thúc mới{" "}
                                    <span className="text-red-500">
                                        *
                                    </span>
                                </span>

                                <div className="relative mt-1.5">
                                    <CalendarDays
                                        size={16}
                                        aria-hidden="true"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="date"
                                        min={
                                            contract.endDate
                                        }
                                        value={
                                            requestedEndDate
                                        }
                                        onChange={(event) => {
                                            setRequestedEndDate(
                                                event.target.value,
                                            );
                                        }}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                </div>
                            </label>

                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-center">
                                <p className="text-xs text-blue-700">
                                    Số ngày gia hạn
                                </p>

                                <p className="mt-2 text-lg font-bold text-blue-700">
                                    {extensionDays} ngày
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2.5">
                            <p className="text-xs leading-5 text-blue-800">
                                Yêu cầu gia hạn sẽ được gửi đến nhân viên để xem xét trước khi có hiệu lực.
                            </p>
                        </div>
                    </section>

                    <section>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                2
                            </span>

                            <h3 className="text-sm font-bold text-slate-900">
                                Lý do gia hạn{" "}
                                <span className="text-red-500">
                                    *
                                </span>
                            </h3>
                        </div>

                        <textarea
                            value={reason}
                            onChange={(event) => {
                                setReason(
                                    event.target.value,
                                );
                            }}
                            maxLength={500}
                            rows={4}
                            placeholder="Ví dụ: Cần thêm thời gian hoàn thành sự kiện..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />

                        <p className="mt-1 text-right text-xs text-slate-400">
                            {reason.length}/500
                        </p>
                    </section>

                    <section>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="flex size-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                3
                            </span>

                            <h3 className="text-sm font-bold text-slate-900">
                                Ghi chú thêm
                            </h3>
                        </div>

                        <textarea
                            value={note}
                            onChange={(event) => {
                                setNote(
                                    event.target.value,
                                );
                            }}
                            maxLength={500}
                            rows={3}
                            placeholder="Nhập ghi chú thêm nếu có..."
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />

                        <p className="mt-1 text-right text-xs text-slate-400">
                            {note.length}/500
                        </p>
                    </section>
                </div>

                <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Hủy bỏ
                    </button>

                    <button
                        type="button"
                        disabled={!isValid}
                        onClick={
                            handleSubmit
                        }
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Send
                            size={16}
                            aria-hidden="true"
                            className="text-white"
                        />

                        Gửi yêu cầu gia hạn
                    </button>
                </footer>
            </section>
        </div>
    );
};