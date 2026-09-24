import {
    ChevronLeft,
    ChevronRight,
    Info,
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
    CustomerIncidentFilters,
    type CustomerIncidentDateFilter,
} from "../components/CustomerIncidentFilters";
import {
    CustomerIncidentList,
} from "../components/CustomerIncidentList";
import {
    CustomerIncidentSupportPanel,
} from "../components/CustomerIncidentSupportPanel";
import {
    CUSTOMER_INCIDENT_MOCKS,
} from "../mocks/customerIncident.mock";
import type {
    CustomerIncidentItem,
    CustomerIncidentPriority,
    CustomerIncidentStatus,
} from "../types/customerIncident.types";

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
    dateFilter: CustomerIncidentDateFilter,
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
            CustomerIncidentDateFilter,
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

export const CustomerIncidentsPage = () => {
    const navigate =
        useNavigate();

    const [
        incidents,
    ] =
        useState<CustomerIncidentItem[]>(
            CUSTOMER_INCIDENT_MOCKS,
        );

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        status,
        setStatus,
    ] = useState<
        CustomerIncidentStatus | "ALL"
    >("ALL");

    const [
        priority,
        setPriority,
    ] = useState<
        CustomerIncidentPriority | "ALL"
    >("ALL");

    const [
        dateFilter,
        setDateFilter,
    ] =
        useState<CustomerIncidentDateFilter>(
            "ALL",
        );

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const statistics =
        useMemo(() => {
            return {
                processing:
                incidents.filter(
                    (incident) =>
                        incident.status ===
                        "PROCESSING",
                ).length,

                waiting:
                incidents.filter(
                    (incident) =>
                        incident.status ===
                        "WAITING_RESPONSE",
                ).length,

                resolved:
                incidents.filter(
                    (incident) =>
                        incident.status ===
                        "RESOLVED",
                ).length,
            };
        }, [incidents]);

    const filteredIncidents =
        useMemo(() => {
            const normalizedSearch =
                normalizeSearchValue(
                    searchTerm,
                );

            return incidents.filter(
                (incident) => {
                    const searchableText = [
                        incident.incidentCode,
                        incident.contractCode,
                        incident.equipmentName,
                        incident.equipmentCode,
                        incident.branch,
                        incident.title,
                        incident.description,
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
                        incident.status ===
                        status;

                    const matchesPriority =
                        priority === "ALL" ||
                        incident.priority ===
                        priority;

                    const matchesDate =
                        matchesDateFilter(
                            incident.createdAt,
                            dateFilter,
                        );

                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesPriority &&
                        matchesDate
                    );
                },
            );
        }, [
            incidents,
            searchTerm,
            status,
            priority,
            dateFilter,
        ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredIncidents.length /
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

    const paginatedIncidents =
        useMemo(() => {
            const startIndex =
                (currentPage - 1) *
                ITEMS_PER_PAGE;

            return filteredIncidents.slice(
                startIndex,
                startIndex +
                ITEMS_PER_PAGE,
            );
        }, [
            filteredIncidents,
            currentPage,
        ]);

    const handleSearchChange = (
        value: string,
    ): void => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (
        nextStatus:
            | CustomerIncidentStatus
            | "ALL",
    ): void => {
        setStatus(nextStatus);
        setCurrentPage(1);
    };

    const handlePriorityChange = (
        nextPriority:
            | CustomerIncidentPriority
            | "ALL",
    ): void => {
        setPriority(nextPriority);
        setCurrentPage(1);
    };

    const handleDateFilterChange = (
        nextDateFilter:
        CustomerIncidentDateFilter,
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
            setPriority("ALL");
            setDateFilter("ALL");
            setCurrentPage(1);
        };

    const handleCreateIncident =
        (): void => {
            navigate(
                "/customer/incidents/create",
            );
        };

    const handleViewDetail = (
        incident:
        CustomerIncidentItem,
    ): void => {
        navigate(
            `/customer/incidents/${incident.id}`,
        );

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
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

    return (
        <main className="space-y-5">
            {/* Header */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-950">
                        Báo cáo sự cố
                    </h1>

                    <p className="mt-1.5 text-sm text-slate-500">
                        Gửi thông tin sự cố và theo dõi tiến độ xử lý thiết bị.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={
                        handleCreateIncident
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus
                        size={17}
                        aria-hidden="true"
                    />

                    Tạo báo cáo sự cố
                </button>
            </header>

            {/* Hint */}
            <section className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                <Info
                    size={18}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-sm leading-6 text-blue-800">
                    Mô tả rõ sự cố, đính kèm ảnh hoặc video và chọn đúng mức độ
                    để được hỗ trợ nhanh hơn.
                </p>
            </section>

            {/* Filter */}
            <CustomerIncidentFilters
                searchTerm={
                    searchTerm
                }
                status={
                    status
                }
                priority={
                    priority
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
                onPriorityChange={
                    handlePriorityChange
                }
                onDateFilterChange={
                    handleDateFilterChange
                }
                onReset={
                    handleResetFilters
                }
            />

            {/* Main content */}
            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_240px]">
                <div className="min-w-0 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-slate-950">
                            Danh sách sự cố
                        </h2>

                        <p className="text-xs text-slate-500">
                            {
                                filteredIncidents.length
                            }{" "}
                            báo cáo
                        </p>
                    </div>

                    {paginatedIncidents.length >
                    0 ? (
                        <CustomerIncidentList
                            incidents={
                                paginatedIncidents
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

                            <h3 className="mt-4 text-base font-bold text-slate-900">
                                Không tìm thấy báo cáo sự cố
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Hãy thử thay đổi từ khóa hoặc bộ lọc hiện tại.
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
                            aria-label="Phân trang báo cáo sự cố"
                            className="flex items-center justify-center gap-1.5 pt-2"
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
                                className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
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
                                className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                <ChevronRight
                                    size={17}
                                    aria-hidden="true"
                                />
                            </button>
                        </nav>
                    )}
                </div>

                <CustomerIncidentSupportPanel
                    processingCount={
                        statistics.processing
                    }
                    waitingCount={
                        statistics.waiting
                    }
                    resolvedCount={
                        statistics.resolved
                    }
                />
            </section>
        </main>
    );
};