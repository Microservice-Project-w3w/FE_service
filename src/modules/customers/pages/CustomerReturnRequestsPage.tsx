import {
    ChevronLeft,
    ChevronRight,
    Plus,
    SearchX,
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
    CustomerReturnRequestFilters,
    type CustomerReturnRequestDateFilter,
} from "../components/CustomerReturnRequestFilters";

import {
    CustomerReturnRequestSummary,
} from "../components/CustomerReturnRequestSummary";

import {
    CustomerReturnRequestTable,
} from "../components/CustomerReturnRequestTable";

import {
    CUSTOMER_RETURN_REQUEST_MOCKS,
} from "../mocks/customerReturnRequest.mock";

import type {
    CustomerReturnRequestItem,
    CustomerReturnRequestStatus,
} from "../types/customerReturnRequest.types";

const ITEMS_PER_PAGE = 5;

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

const matchesDateFilter = (
    createdAt: string,
    dateFilter: CustomerReturnRequestDateFilter,
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
            CustomerReturnRequestDateFilter,
            "ALL"
        >,
        number
    > = {
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

export const CustomerReturnRequestsPage = () => {
    const navigate =
        useNavigate();

    const [
        requests,
    ] =
        useState<CustomerReturnRequestItem[]>(
            CUSTOMER_RETURN_REQUEST_MOCKS,
        );

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        status,
        setStatus,
    ] = useState<
        CustomerReturnRequestStatus | "ALL"
    >("ALL");

    const [
        dateFilter,
        setDateFilter,
    ] =
        useState<CustomerReturnRequestDateFilter>(
            "ALL",
        );

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const filteredRequests =
        useMemo(() => {
            const normalizedSearch =
                normalizeSearchValue(
                    searchTerm,
                );

            return requests.filter(
                (request) => {
                    const searchableText = [
                        request.requestCode,
                        request.contractCode,
                        request.equipmentName,
                        request.equipmentCode,
                        request.branch,
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
                        request.status ===
                        status;

                    const matchesDate =
                        matchesDateFilter(
                            request.createdAt,
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
            requests,
            searchTerm,
            status,
            dateFilter,
        ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredRequests.length /
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

    const paginatedRequests =
        useMemo(() => {
            const startIndex =
                (currentPage - 1) *
                ITEMS_PER_PAGE;

            return filteredRequests.slice(
                startIndex,
                startIndex +
                ITEMS_PER_PAGE,
            );
        }, [
            filteredRequests,
            currentPage,
        ]);

    const statistics =
        useMemo(() => {
            return {
                processing:
                requests.filter(
                    (request) =>
                        request.status ===
                        "PROCESSING",
                ).length,

                dueSoon:
                requests.filter(
                    (request) =>
                        request.status ===
                        "DUE_SOON",
                ).length,

                completed:
                requests.filter(
                    (request) =>
                        request.status ===
                        "COMPLETED",
                ).length,

                cancelled:
                requests.filter(
                    (request) =>
                        request.status ===
                        "CANCELLED",
                ).length,
            };
        }, [requests]);

    const handleSearchChange = (
        value: string,
    ): void => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (
        nextStatus:
            | CustomerReturnRequestStatus
            | "ALL",
    ): void => {
        setStatus(nextStatus);
        setCurrentPage(1);
    };

    const handleDateFilterChange = (
        nextDateFilter:
        CustomerReturnRequestDateFilter,
    ): void => {
        setDateFilter(
            nextDateFilter,
        );

        setCurrentPage(1);
    };

    const handleResetFilters =
        (): void => {
            setSearchTerm("");
            setStatus("ALL");
            setDateFilter("ALL");
            setCurrentPage(1);
        };

    const handleViewDetail = (
        request:
        CustomerReturnRequestItem,
    ): void => {
        navigate(
            `/customer/return-requests/${request.id}`,
        );

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    };

    const handleCreateRequest =
        (): void => {
            navigate(
                "/customer/return-requests/create",
            );
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

    const statusTabs: Array<{
        label: string;
        value:
            | CustomerReturnRequestStatus
            | "ALL";
        count: number;
    }> = [
        {
            label: "Tất cả",
            value: "ALL",
            count:
            requests.length,
        },
        {
            label: "Đang xử lý",
            value: "PROCESSING",
            count:
            statistics.processing,
        },
        {
            label:
                "Sắp đến ngày trả",
            value: "DUE_SOON",
            count:
            statistics.dueSoon,
        },
        {
            label: "Hoàn thành",
            value: "COMPLETED",
            count:
            statistics.completed,
        },
        {
            label: "Đã hủy",
            value: "CANCELLED",
            count:
            statistics.cancelled,
        },
    ];

    return (
        <main className="space-y-5">
            {/* Header */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-950">
                        Yêu cầu trả
                    </h1>

                    <p className="mt-1.5 text-sm text-slate-500">
                        Theo dõi và quản lý
                        quá trình hoàn trả
                        thiết bị.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={
                        handleCreateRequest
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus
                        size={17}
                        aria-hidden="true"
                    />

                    Tạo yêu cầu trả
                </button>
            </header>

            {/* Workflow summary */}
            <CustomerReturnRequestSummary
                processingCount={
                    statistics.processing
                }
                dueSoonCount={
                    statistics.dueSoon
                }
                completedCount={
                    statistics.completed
                }
            />

            {/* Filter */}
            <CustomerReturnRequestFilters
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

            {/* Tabs */}
            <section className="border-b border-slate-200">
                <div className="flex gap-1 overflow-x-auto">
                    {statusTabs.map(
                        (tab) => {
                            const isActive =
                                status ===
                                tab.value;

                            return (
                                <button
                                    key={
                                        tab.value
                                    }
                                    type="button"
                                    onClick={() => {
                                        handleStatusChange(
                                            tab.value,
                                        );
                                    }}
                                    className={[
                                        "relative shrink-0 px-4 py-3 text-sm font-semibold transition",
                                        isActive
                                            ? "text-blue-600"
                                            : "text-slate-500 hover:text-slate-800",
                                    ].join(
                                        " ",
                                    )}
                                >
                                    {
                                        tab.label
                                    }{" "}
                                    <span
                                        className={
                                            isActive
                                                ? "text-blue-500"
                                                : "text-slate-400"
                                        }
                                    >
                                        (
                                        {
                                            tab.count
                                        }
                                        )
                                    </span>

                                    {isActive && (
                                        <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-blue-600" />
                                    )}
                                </button>
                            );
                        },
                    )}
                </div>
            </section>

            {/* Result count */}
            <section>
                <p className="text-sm font-semibold text-slate-700">
                    Tìm thấy{" "}
                    {
                        filteredRequests.length
                    }{" "}
                    yêu cầu trả
                </p>
            </section>

            {/* Table */}
            {paginatedRequests.length >
            0 ? (
                <CustomerReturnRequestTable
                    requests={
                        paginatedRequests
                    }
                    onViewDetail={
                        handleViewDetail
                    }
                />
            ) : (
                <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                    <SearchX
                        size={34}
                        aria-hidden="true"
                        className="mx-auto text-slate-400"
                    />

                    <h2 className="mt-4 text-base font-bold text-slate-900">
                        Không tìm thấy
                        yêu cầu trả
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Hãy thử thay đổi
                        từ khóa hoặc bộ lọc
                        hiện tại.
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

            {/* Pagination */}
            {totalPages > 1 && (
                <nav
                    aria-label="Phân trang yêu cầu trả"
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
                    ).map((page) => {
                        const isActive =
                            page ===
                            currentPage;

                        return (
                            <button
                                key={page}
                                type="button"
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
                                        : "flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                                }
                            >
                                {page}
                            </button>
                        );
                    })}

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
    );
};