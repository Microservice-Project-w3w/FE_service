import {
    CheckCircle2,
    ClipboardList,
    Clock3,
    FileText,
    Plus,
    SearchX,
    XCircle,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    Link,
    useNavigate,
} from "react-router";

import {
    CustomerRentalRequestCard,
} from "../components/CustomerRentalRequestCard";
import {
    CustomerRentalRequestFilters,
    type CustomerRentalRequestDateFilter,
} from "../components/CustomerRentalRequestFilters";
import {
    CUSTOMER_RENTAL_REQUEST_MOCKS,
} from "../mocks/customerRentalRequest.mock";
import type {
    CustomerRentalRequestItem,
    CustomerRentalRequestStatus,
} from "../types/customerRentalRequest.types";

const ITEMS_PER_PAGE = 4;

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
    dateFilter: CustomerRentalRequestDateFilter,
): boolean => {
    if (dateFilter === "ALL") {
        return true;
    }

    const createdDate = new Date(createdAt);

    if (Number.isNaN(createdDate.getTime())) {
        return false;
    }

    const dateRangeMap: Record<
        Exclude<
            CustomerRentalRequestDateFilter,
            "ALL"
        >,
        number
    > = {
        LAST_7_DAYS: 7,
        LAST_30_DAYS: 30,
        LAST_90_DAYS: 90,
    };

    const minimumDate = new Date();

    minimumDate.setHours(0, 0, 0, 0);
    minimumDate.setDate(
        minimumDate.getDate() -
        dateRangeMap[dateFilter],
    );

    return createdDate >= minimumDate;
};

export const CustomerRentalRequestsPage = () => {
    const navigate = useNavigate();

    const [
        requests,
        setRequests,
    ] = useState<CustomerRentalRequestItem[]>(
        CUSTOMER_RENTAL_REQUEST_MOCKS,
    );

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        status,
        setStatus,
    ] = useState<
        CustomerRentalRequestStatus | "ALL"
    >("ALL");

    const [
        dateFilter,
        setDateFilter,
    ] = useState<CustomerRentalRequestDateFilter>(
        "ALL",
    );

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const filteredRequests = useMemo(() => {
        const normalizedSearch =
            normalizeSearchValue(searchTerm);

        return requests.filter((request) => {
            const searchableText = [
                request.requestCode,
                request.equipmentName,
                request.equipmentCode,
                request.branch,
            ]
                .map(normalizeSearchValue)
                .join(" ");

            const matchesSearch =
                normalizedSearch === "" ||
                searchableText.includes(
                    normalizedSearch,
                );

            const matchesStatus =
                status === "ALL" ||
                request.status === status;

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
        });
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
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
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
                startIndex + ITEMS_PER_PAGE,
            );
        }, [
            filteredRequests,
            currentPage,
        ]);

    const statistics = useMemo(() => {
        return {
            total: requests.length,

            pending: requests.filter(
                (request) =>
                    request.status === "PENDING",
            ).length,

            processing: requests.filter(
                (request) =>
                    request.status ===
                    "PROCESSING",
            ).length,

            quoted: requests.filter(
                (request) =>
                    request.status === "QUOTED",
            ).length,

            accepted: requests.filter(
                (request) =>
                    request.status ===
                    "APPROVED" ||
                    request.status ===
                    "DELIVERING" ||
                    request.status ===
                    "COMPLETED",
            ).length,

            closed: requests.filter(
                (request) =>
                    request.status ===
                    "REJECTED" ||
                    request.status ===
                    "CANCELLED",
            ).length,
        };
    }, [requests]);

    const handleResetFilters = (): void => {
        setSearchTerm("");
        setStatus("ALL");
        setDateFilter("ALL");
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
            | CustomerRentalRequestStatus
            | "ALL",
    ): void => {
        setStatus(nextStatus);
        setCurrentPage(1);
    };

    const handleDateFilterChange = (
        nextDateFilter:
        CustomerRentalRequestDateFilter,
    ): void => {
        setDateFilter(nextDateFilter);
        setCurrentPage(1);
    };

    const handleViewDetail = (
        request: CustomerRentalRequestItem,
    ): void => {
        navigate(
            `/customer/rental-requests/${request.id}`,
        );
    };

    const handleViewQuotation = (
        request: CustomerRentalRequestItem,
    ): void => {
        window.alert(
            `Xem báo giá của yêu cầu ${request.requestCode}`,
        );
    };

    const handleCancelRequest = (
        request: CustomerRentalRequestItem,
    ): void => {
        const confirmed = window.confirm(
            `Bạn có chắc muốn hủy yêu cầu ${request.requestCode} không?`,
        );

        if (!confirmed) {
            return;
        }

        setRequests((currentRequests) =>
            currentRequests.map(
                (currentRequest) =>
                    currentRequest.id ===
                    request.id
                        ? {
                            ...currentRequest,
                            status: "CANCELLED",
                        }
                        : currentRequest,
            ),
        );
    };

    const handlePageChange = (
        page: number,
    ): void => {
        setCurrentPage(page);

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    };

    const firstVisibleItem =
        filteredRequests.length === 0
            ? 0
            : (currentPage - 1) *
            ITEMS_PER_PAGE +
            1;

    const lastVisibleItem = Math.min(
        currentPage * ITEMS_PER_PAGE,
        filteredRequests.length,
    );

    const statisticItems = [
        {
            label: "Tất cả yêu cầu",
            description:
                "Toàn bộ yêu cầu đã tạo",
            value: statistics.total,
            icon: ClipboardList,
            className:
                "bg-blue-50 text-blue-700",
        },
        {
            label: "Chờ tiếp nhận",
            description:
                "Đang chờ nhân viên tiếp nhận",
            value: statistics.pending,
            icon: Clock3,
            className:
                "bg-amber-50 text-amber-700",
        },
        {
            label: "Đang xử lý",
            description:
                "Yêu cầu đang được xử lý",
            value: statistics.processing,
            icon: Clock3,
            className:
                "bg-sky-50 text-sky-700",
        },
        {
            label: "Đã gửi báo giá",
            description:
                "Đã có báo giá từ chi nhánh",
            value: statistics.quoted,
            icon: FileText,
            className:
                "bg-violet-50 text-violet-700",
        },
        {
            label: "Đã chấp nhận",
            description:
                "Đã duyệt hoặc đang thực hiện",
            value: statistics.accepted,
            icon: CheckCircle2,
            className:
                "bg-emerald-50 text-emerald-700",
        },
        {
            label: "Đã đóng",
            description:
                "Đã từ chối hoặc đã hủy",
            value: statistics.closed,
            icon: XCircle,
            className:
                "bg-slate-100 text-slate-600",
        },
    ];

    return (
        <main className="space-y-5">
            <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-950">
                        Yêu cầu thuê của tôi
                    </h1>

                    <p className="mt-1.5 text-sm text-slate-500">
                        Theo dõi trạng thái và quản lý
                        các yêu cầu thuê thiết bị.
                    </p>
                </div>

                <Link
                    to="/customer/equipment"
                    className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 lg:self-auto"
                >
                    <Plus
                        size={18}
                        aria-hidden="true"
                        className="text-white"
                    />

                    <span className="text-white">
                        Tạo yêu cầu mới
                    </span>
                </Link>
            </header>

            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {statisticItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <article
                            key={item.label}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm"
                        >
                            <span
                                className={[
                                    "flex size-11 shrink-0 items-center justify-center rounded-xl",
                                    item.className,
                                ].join(" ")}
                            >
                                <Icon
                                    size={20}
                                    aria-hidden="true"
                                />
                            </span>

                            <div className="min-w-0">
                                <div className="flex items-baseline gap-2">
                                    <p className="text-xl font-bold text-slate-950">
                                        {item.value}
                                    </p>

                                    <p className="truncate text-sm font-semibold text-slate-800">
                                        {item.label}
                                    </p>
                                </div>

                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                    {item.description}
                                </p>
                            </div>
                        </article>
                    );
                })}
            </section>

            <CustomerRentalRequestFilters
                searchTerm={searchTerm}
                status={status}
                dateFilter={dateFilter}
                onSearchChange={
                    handleSearchChange
                }
                onStatusChange={
                    handleStatusChange
                }
                onDateFilterChange={
                    handleDateFilterChange
                }
                onReset={handleResetFilters}
            />

            <section className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-slate-700">
                    Tìm thấy{" "}
                    {filteredRequests.length} yêu cầu
                </p>

                {filteredRequests.length > 0 && (
                    <p className="text-xs text-slate-500">
                        Hiển thị{" "}
                        {firstVisibleItem}–
                        {lastVisibleItem} trong{" "}
                        {filteredRequests.length} yêu cầu
                    </p>
                )}
            </section>

            {paginatedRequests.length > 0 ? (
                <section className="space-y-3">
                    {paginatedRequests.map(
                        (request) => (
                            <CustomerRentalRequestCard
                                key={request.id}
                                request={request}
                                onViewDetail={
                                    handleViewDetail
                                }
                                onViewQuotation={
                                    handleViewQuotation
                                }
                                onCancelRequest={
                                    handleCancelRequest
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
                        Không tìm thấy yêu cầu
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Hãy thử thay đổi từ khóa hoặc
                        bộ lọc hiện tại.
                    </p>

                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                    >
                        Đặt lại bộ lọc
                    </button>
                </section>
            )}

            {totalPages > 1 && (
                <nav
                    aria-label="Phân trang yêu cầu thuê"
                    className="flex items-center justify-center gap-2 pb-4 pt-1"
                >
                    {Array.from(
                        {
                            length: totalPages,
                        },
                        (_, index) =>
                            index + 1,
                    ).map((page) => {
                        const isActive =
                            page === currentPage;

                        return (
                            <button
                                key={page}
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
                                        ? "flex size-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm"
                                        : "flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                }
                            >
                                {page}
                            </button>
                        );
                    })}
                </nav>
            )}
        </main>
    );
};