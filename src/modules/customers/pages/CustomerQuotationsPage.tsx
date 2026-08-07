import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    FileText,
    SearchX,
    X,
    XCircle,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    useNavigate,
} from "react-router";

import {
    CustomerQuotationCard,
} from "../components/CustomerQuotationCard";
import {
    CustomerQuotationFilters,
    type CustomerQuotationDateFilter,
} from "../components/CustomerQuotationFilters";
import {
    CUSTOMER_QUOTATION_MOCKS,
} from "../mocks/customerQuotation.mock";
import type {
    CustomerQuotationItem,
    CustomerQuotationStatus,
} from "../types/customerQuotation.types";

const ITEMS_PER_PAGE = 4;

type QuotationActionType =
    | "ACCEPT"
    | "REJECT";

interface QuotationActionState {
    type: QuotationActionType;
    quotation: CustomerQuotationItem;
}

const normalizeSearchValue = (
    value: string,
): string =>
    value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .trim()
        .toLowerCase();

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

const matchesDateFilter = (
    createdAt: string,
    dateFilter: CustomerQuotationDateFilter,
): boolean => {
    if (dateFilter === "ALL") {
        return true;
    }

    const createdDate =
        new Date(createdAt);

    if (
        Number.isNaN(
            createdDate.getTime(),
        )
    ) {
        return false;
    }

    const daysMap: Record<
        Exclude<
            CustomerQuotationDateFilter,
            "ALL"
        >,
        number
    > = {
        LAST_7_DAYS: 7,
        LAST_30_DAYS: 30,
        LAST_90_DAYS: 90,
    };

    const minimumDate =
        new Date();

    minimumDate.setHours(
        0,
        0,
        0,
        0,
    );

    minimumDate.setDate(
        minimumDate.getDate() -
        daysMap[dateFilter],
    );

    return (
        createdDate >=
        minimumDate
    );
};

export const CustomerQuotationsPage = () => {
    const navigate =
        useNavigate();

    const [
        quotations,
        setQuotations,
    ] =
        useState<CustomerQuotationItem[]>(
            CUSTOMER_QUOTATION_MOCKS,
        );

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        status,
        setStatus,
    ] = useState<
        CustomerQuotationStatus | "ALL"
    >("ALL");

    const [
        dateFilter,
        setDateFilter,
    ] =
        useState<CustomerQuotationDateFilter>(
            "ALL",
        );

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const [
        actionState,
        setActionState,
    ] =
        useState<QuotationActionState | null>(
            null,
        );

    const [
        rejectionReason,
        setRejectionReason,
    ] = useState("");

    const filteredQuotations =
        useMemo(() => {
            const normalizedSearch =
                normalizeSearchValue(
                    searchTerm,
                );

            return quotations.filter(
                (quotation) => {
                    const searchableText = [
                        quotation.quotationCode,
                        quotation.requestCode,
                        quotation.equipmentName,
                        quotation.equipmentCode,
                        quotation.branch,
                    ]
                        .map(
                            normalizeSearchValue,
                        )
                        .join(" ");

                    const matchesSearch =
                        normalizedSearch ===
                        "" ||
                        searchableText.includes(
                            normalizedSearch,
                        );

                    const matchesStatus =
                        status === "ALL" ||
                        quotation.status ===
                        status;

                    const matchesDate =
                        matchesDateFilter(
                            quotation.createdAt,
                            dateFilter,
                        );

                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesDate
                    );
                },
            );
        }, [
            quotations,
            searchTerm,
            status,
            dateFilter,
        ]);

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredQuotations.length /
                ITEMS_PER_PAGE,
            ),
        );

    useEffect(() => {
        if (
            currentPage >
            totalPages
        ) {
            setCurrentPage(
                totalPages,
            );
        }
    }, [
        currentPage,
        totalPages,
    ]);

    useEffect(() => {
        if (!actionState) {
            return;
        }

        const handleKeyDown = (
            event: KeyboardEvent,
        ): void => {
            if (
                event.key ===
                "Escape"
            ) {
                setActionState(
                    null,
                );

                setRejectionReason(
                    "",
                );
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
    }, [actionState]);

    const paginatedQuotations =
        useMemo(() => {
            const startIndex =
                (currentPage - 1) *
                ITEMS_PER_PAGE;

            return filteredQuotations.slice(
                startIndex,
                startIndex +
                ITEMS_PER_PAGE,
            );
        }, [
            filteredQuotations,
            currentPage,
        ]);

    const statistics =
        useMemo(() => {
            return {
                total:
                quotations.length,

                pending:
                quotations.filter(
                    (
                        quotation,
                    ) =>
                        quotation.status ===
                        "PENDING_RESPONSE",
                ).length,

                accepted:
                quotations.filter(
                    (
                        quotation,
                    ) =>
                        quotation.status ===
                        "ACCEPTED",
                ).length,

                closed:
                quotations.filter(
                    (
                        quotation,
                    ) =>
                        quotation.status ===
                        "REJECTED" ||
                        quotation.status ===
                        "EXPIRED" ||
                        quotation.status ===
                        "SUPERSEDED",
                ).length,
            };
        }, [quotations]);

    const handleResetFilters =
        (): void => {
            setSearchTerm("");
            setStatus("ALL");
            setDateFilter(
                "ALL",
            );
            setCurrentPage(1);
        };

    const handleSearchChange = (
        value: string,
    ): void => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (
        nextStatus:
            | CustomerQuotationStatus
            | "ALL",
    ): void => {
        setStatus(nextStatus);
        setCurrentPage(1);
    };

    const handleDateFilterChange = (
        nextDateFilter:
        CustomerQuotationDateFilter,
    ): void => {
        setDateFilter(
            nextDateFilter,
        );

        setCurrentPage(1);
    };

    const handleViewDetail = (
        quotation:
        CustomerQuotationItem,
    ): void => {
        navigate(
            `/customer/quotations/${quotation.id}`,
        );

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    };

    const handleAccept = (
        quotation:
        CustomerQuotationItem,
    ): void => {
        setActionState({
            type: "ACCEPT",
            quotation,
        });
    };

    const handleReject = (
        quotation:
        CustomerQuotationItem,
    ): void => {
        setRejectionReason(
            "",
        );

        setActionState({
            type: "REJECT",
            quotation,
        });
    };

    const handleCloseActionModal =
        (): void => {
            setActionState(
                null,
            );

            setRejectionReason(
                "",
            );
        };

    const handleConfirmAction =
        (): void => {
            if (!actionState) {
                return;
            }

            if (
                actionState.type ===
                "REJECT" &&
                rejectionReason.trim() ===
                ""
            ) {
                return;
            }

            setQuotations(
                (
                    currentQuotations,
                ) =>
                    currentQuotations.map(
                        (
                            currentQuotation,
                        ) =>
                            currentQuotation.id ===
                            actionState
                                .quotation.id
                                ? {
                                    ...currentQuotation,

                                    status:
                                        actionState.type ===
                                        "ACCEPT"
                                            ? "ACCEPTED"
                                            : "REJECTED",

                                    rejectionReason:
                                        actionState.type ===
                                        "REJECT"
                                            ? rejectionReason.trim()
                                            : undefined,
                                }
                                : currentQuotation,
                    ),
            );

            handleCloseActionModal();
        };

    const handlePageChange = (
        page: number,
    ): void => {
        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    };

    const statisticItems = [
        {
            label:
                "Tất cả báo giá",
            description:
                "Toàn bộ báo giá đã nhận",
            value:
            statistics.total,
            icon: FileText,
            className:
                "bg-blue-50 text-blue-700",
        },
        {
            label:
                "Chờ phản hồi",
            description:
                "Cần chấp nhận hoặc từ chối",
            value:
            statistics.pending,
            icon: Clock3,
            className:
                "bg-amber-50 text-amber-700",
        },
        {
            label:
                "Đã chấp nhận",
            description:
                "Đã đồng ý với báo giá",
            value:
            statistics.accepted,
            icon: CheckCircle2,
            className:
                "bg-emerald-50 text-emerald-700",
        },
        {
            label: "Đã đóng",
            description:
                "Đã từ chối hoặc hết hiệu lực",
            value:
            statistics.closed,
            icon: XCircle,
            className:
                "bg-slate-100 text-slate-600",
        },
    ];

    const isRejectAction =
        actionState?.type ===
        "REJECT";

    return (
        <>
            <main className="space-y-5">
                <header>
                    <h1 className="text-3xl font-bold text-slate-950">
                        Báo giá của tôi
                    </h1>

                    <p className="mt-1.5 text-sm text-slate-500">
                        Xem chi tiết,
                        chấp nhận hoặc từ
                        chối các báo giá
                        thuê thiết bị.
                    </p>
                </header>

                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {statisticItems.map(
                        (item) => {
                            const Icon =
                                item.icon;

                            return (
                                <article
                                    key={
                                        item.label
                                    }
                                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
                                >
                                    <span
                                        className={[
                                            "flex size-11 shrink-0 items-center justify-center rounded-xl",
                                            item.className,
                                        ].join(
                                            " ",
                                        )}
                                    >
                                        <Icon
                                            size={
                                                20
                                            }
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <div className="min-w-0">
                                        <div className="flex items-baseline gap-2">
                                            <p className="text-xl font-bold text-slate-950">
                                                {
                                                    item.value
                                                }
                                            </p>

                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                {
                                                    item.label
                                                }
                                            </p>
                                        </div>

                                        <p className="mt-0.5 truncate text-xs text-slate-500">
                                            {
                                                item.description
                                            }
                                        </p>
                                    </div>
                                </article>
                            );
                        },
                    )}
                </section>

                <CustomerQuotationFilters
                    searchTerm={
                        searchTerm
                    }
                    status={
                        status
                    }
                    dateFilter={
                        dateFilter
                    }
                    onSearchChange={
                        handleSearchChange
                    }
                    onStatusChange={
                        handleStatusChange
                    }
                    onDateFilterChange={
                        handleDateFilterChange
                    }
                    onReset={
                        handleResetFilters
                    }
                />

                <section>
                    <p className="text-sm font-semibold text-slate-700">
                        Tìm thấy{" "}
                        {
                            filteredQuotations.length
                        }{" "}
                        báo giá
                    </p>
                </section>

                {paginatedQuotations.length >
                0 ? (
                    <section className="space-y-3">
                        {paginatedQuotations.map(
                            (
                                quotation,
                            ) => (
                                <CustomerQuotationCard
                                    key={
                                        quotation.id
                                    }
                                    quotation={
                                        quotation
                                    }
                                    onViewDetail={
                                        handleViewDetail
                                    }
                                    onAccept={
                                        handleAccept
                                    }
                                    onReject={
                                        handleReject
                                    }
                                />
                            ),
                        )}
                    </section>
                ) : (
                    <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                        <SearchX
                            size={34}
                            aria-hidden="true"
                            className="mx-auto text-slate-400"
                        />

                        <h2 className="mt-4 text-base font-bold text-slate-900">
                            Không tìm thấy
                            báo giá
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Hãy thử thay đổi
                            từ khóa hoặc bộ
                            lọc hiện tại.
                        </p>

                        <button
                            type="button"
                            onClick={
                                handleResetFilters
                            }
                            className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                            Đặt lại bộ lọc
                        </button>
                    </section>
                )}

                {totalPages > 1 && (
                    <nav
                        aria-label="Phân trang báo giá"
                        className="flex items-center justify-center gap-1.5 pb-5 pt-2"
                    >
                        <button
                            type="button"
                            aria-label="Trang trước"
                            disabled={
                                currentPage ===
                                1
                            }
                            onClick={() => {
                                handlePageChange(
                                    currentPage -
                                    1,
                                );
                            }}
                            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronLeft
                                size={17}
                                aria-hidden="true"
                            />
                        </button>

                        {Array.from(
                            {
                                length:
                                totalPages,
                            },
                            (_, index) =>
                                index + 1,
                        ).map(
                            (page) => {
                                const isActive =
                                    page ===
                                    currentPage;

                                return (
                                    <button
                                        key={
                                            page
                                        }
                                        type="button"
                                        aria-label={`Đi đến trang ${page}`}
                                        aria-current={
                                            isActive
                                                ? "page"
                                                : undefined
                                        }
                                        onClick={() => {
                                            handlePageChange(
                                                page,
                                            );
                                        }}
                                        className={
                                            isActive
                                                ? "flex size-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm"
                                                : "flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                        }
                                    >
                                        {
                                            page
                                        }
                                    </button>
                                );
                            },
                        )}

                        <button
                            type="button"
                            aria-label="Trang sau"
                            disabled={
                                currentPage ===
                                totalPages
                            }
                            onClick={() => {
                                handlePageChange(
                                    currentPage +
                                    1,
                                );
                            }}
                            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            <ChevronRight
                                size={17}
                                aria-hidden="true"
                            />
                        </button>
                    </nav>
                )}
            </main>

            {actionState && (
                <div
                    role="presentation"
                    onMouseDown={(
                        event,
                    ) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            handleCloseActionModal();
                        }
                    }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="quotation-action-title"
                        className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                    >
                        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                            <div className="flex items-start gap-3">
                                <span
                                    className={
                                        isRejectAction
                                            ? "flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"
                                            : "flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
                                    }
                                >
                                    {isRejectAction ? (
                                        <XCircle
                                            size={
                                                21
                                            }
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <CheckCircle2
                                            size={
                                                21
                                            }
                                            aria-hidden="true"
                                        />
                                    )}
                                </span>

                                <div>
                                    <h2
                                        id="quotation-action-title"
                                        className="text-lg font-bold text-slate-950"
                                    >
                                        {isRejectAction
                                            ? "Từ chối báo giá"
                                            : "Chấp nhận báo giá"}
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {isRejectAction
                                            ? "Vui lòng nhập lý do để chi nhánh biết và hỗ trợ bạn tốt hơn."
                                            : "Kiểm tra lại thông tin trước khi xác nhận báo giá."}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                aria-label="Đóng hộp thoại"
                                onClick={
                                    handleCloseActionModal
                                }
                                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X
                                    size={
                                        19
                                    }
                                    aria-hidden="true"
                                />
                            </button>
                        </header>

                        <div className="space-y-4 px-5 py-5">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-blue-600">
                                            {
                                                actionState
                                                    .quotation
                                                    .quotationCode
                                            }
                                        </p>

                                        <h3 className="mt-1 truncate text-base font-bold text-slate-950">
                                            {
                                                actionState
                                                    .quotation
                                                    .equipmentName
                                            }
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Yêu cầu:{" "}
                                            {
                                                actionState
                                                    .quotation
                                                    .requestCode
                                            }
                                        </p>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <p className="text-xs text-slate-500">
                                            Tổng báo giá
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-blue-600">
                                            {formatCurrency(
                                                actionState
                                                    .quotation
                                                    .totalAmount,
                                            )}{" "}
                                            đ
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Thời gian
                                            thuê
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {formatDate(
                                                actionState
                                                    .quotation
                                                    .startDate,
                                            )}
                                            {" - "}
                                            {formatDate(
                                                actionState
                                                    .quotation
                                                    .endDate,
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Hiệu lực
                                            đến
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-900">
                                            {formatDate(
                                                actionState
                                                    .quotation
                                                    .validUntil,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {isRejectAction && (
                                <label className="block">
                                    <span className="text-sm font-semibold text-slate-800">
                                        Lý do
                                        từ chối{" "}
                                        <span className="text-red-500">
                                            *
                                        </span>
                                    </span>

                                    <textarea
                                        value={
                                            rejectionReason
                                        }
                                        onChange={(
                                            event,
                                        ) => {
                                            setRejectionReason(
                                                event
                                                    .target
                                                    .value,
                                            );
                                        }}
                                        rows={
                                            4
                                        }
                                        maxLength={
                                            300
                                        }
                                        placeholder="Ví dụ: Chi phí chưa phù hợp, cần thay đổi thời gian thuê..."
                                        className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                                    />

                                    <span className="mt-1 block text-right text-xs text-slate-400">
                                        {
                                            rejectionReason.length
                                        }
                                        /300
                                    </span>
                                </label>
                            )}

                            {!isRejectAction && (
                                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                                    <p className="text-sm leading-6 text-emerald-800">
                                        Sau khi xác
                                        nhận, báo giá
                                        sẽ chuyển sang
                                        trạng thái{" "}
                                        <strong>
                                            Đã chấp
                                            nhận
                                        </strong>
                                        .
                                    </p>
                                </div>
                            )}
                        </div>

                        <footer className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={
                                    handleCloseActionModal
                                }
                                className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Quay lại
                            </button>

                            <button
                                type="button"
                                disabled={
                                    isRejectAction &&
                                    rejectionReason.trim() ===
                                    ""
                                }
                                onClick={
                                    handleConfirmAction
                                }
                                className={
                                    isRejectAction
                                        ? "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        : "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                                }
                            >
                                {isRejectAction ? (
                                    <XCircle
                                        size={
                                            16
                                        }
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <CheckCircle2
                                        size={
                                            16
                                        }
                                        aria-hidden="true"
                                    />
                                )}

                                {isRejectAction
                                    ? "Xác nhận "
                                    : "Xác nhận "}
                            </button>
                        </footer>
                    </section>
                </div>
            )}
        </>
    );
};