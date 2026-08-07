import {
    ChevronLeft,
    ChevronRight,
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
    CustomerInvoiceFilters,
    type CustomerInvoiceDateFilter,
} from "../components/CustomerInvoiceFilters";
import {
    CustomerInvoiceList,
} from "../components/CustomerInvoiceList";
import {
    CustomerInvoiceSummary,
} from "../components/CustomerInvoiceSummary";
import {
    CUSTOMER_INVOICE_MOCKS,
} from "../mocks/customerInvoice.mock";
import type {
    CustomerInvoiceItem,
    CustomerInvoiceStatus,
} from "../types/customerInvoice.types";

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
    dateFilter: CustomerInvoiceDateFilter,
): boolean => {
    if (dateFilter === "ALL") {
        return true;
    }

    const createdDate = new Date(createdAt);

    if (Number.isNaN(createdDate.getTime())) {
        return false;
    }

    const currentDate = new Date();

    if (dateFilter === "THIS_YEAR") {
        return (
            createdDate.getFullYear() ===
            currentDate.getFullYear()
        );
    }

    const dayMap: Record<
        Exclude<
            CustomerInvoiceDateFilter,
            "ALL" | "THIS_YEAR"
        >,
        number
    > = {
        LAST_30_DAYS: 30,
        LAST_90_DAYS: 90,
    };

    const minimumDate = new Date();

    minimumDate.setHours(
        0,
        0,
        0,
        0,
    );

    minimumDate.setDate(
        minimumDate.getDate() -
        dayMap[dateFilter],
    );

    return createdDate >= minimumDate;
};

export const CustomerInvoicesPage = () => {
    const navigate = useNavigate();

    const [
        invoices,
    ] = useState<CustomerInvoiceItem[]>(
        CUSTOMER_INVOICE_MOCKS,
    );

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        status,
        setStatus,
    ] = useState<
        CustomerInvoiceStatus | "ALL"
    >("ALL");

    const [
        dateFilter,
        setDateFilter,
    ] = useState<CustomerInvoiceDateFilter>(
        "ALL",
    );

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const filteredInvoices = useMemo(() => {
        const normalizedSearch =
            normalizeSearchValue(searchTerm);

        return invoices.filter(
            (invoice) => {
                const searchableText = [
                    invoice.invoiceCode,
                    invoice.contractCode,
                    invoice.equipmentName,
                    invoice.equipmentCode,
                    invoice.branch,
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
                    invoice.status === status;

                const matchesDate =
                    matchesDateFilter(
                        invoice.createdAt,
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
        invoices,
        searchTerm,
        status,
        dateFilter,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredInvoices.length /
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

    const paginatedInvoices =
        useMemo(() => {
            const startIndex =
                (currentPage - 1) *
                ITEMS_PER_PAGE;

            return filteredInvoices.slice(
                startIndex,
                startIndex + ITEMS_PER_PAGE,
            );
        }, [
            filteredInvoices,
            currentPage,
        ]);

    const summary = useMemo(() => {
        return {
            totalAmount: invoices.reduce(
                (total, invoice) =>
                    total +
                    invoice.totalAmount,
                0,
            ),

            paidAmount: invoices.reduce(
                (total, invoice) =>
                    total +
                    invoice.paidAmount,
                0,
            ),

            remainingAmount:
                invoices.reduce(
                    (total, invoice) =>
                        total +
                        invoice.remainingAmount,
                    0,
                ),

            overdueCount: invoices.filter(
                (invoice) =>
                    invoice.status ===
                    "OVERDUE",
            ).length,
        };
    }, [invoices]);

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
            | CustomerInvoiceStatus
            | "ALL",
    ): void => {
        setStatus(nextStatus);
        setCurrentPage(1);
    };

    const handleDateFilterChange = (
        nextDateFilter:
        CustomerInvoiceDateFilter,
    ): void => {
        setDateFilter(nextDateFilter);
        setCurrentPage(1);
    };

    const handleViewDetail = (
        invoice: CustomerInvoiceItem,
    ): void => {
        navigate(
            `/customer/invoices/${invoice.id}`,
        );

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    };

    const handlePayment = (
        invoice: CustomerInvoiceItem,
    ): void => {
        console.log(
            "Thanh toán hóa đơn:",
            invoice,
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

    return (
        <main className="space-y-5">
            <header>
                <h1 className="text-3xl font-bold text-slate-950">
                    Hóa đơn
                </h1>

                <p className="mt-1.5 text-sm text-slate-500">
                    Theo dõi hóa đơn, thời hạn thanh toán và các khoản còn phải trả.
                </p>
            </header>

            <CustomerInvoiceSummary
                totalAmount={
                    summary.totalAmount
                }
                paidAmount={
                    summary.paidAmount
                }
                remainingAmount={
                    summary.remainingAmount
                }
                overdueCount={
                    summary.overdueCount
                }
            />

            <CustomerInvoiceFilters
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
                onReset={
                    handleResetFilters
                }
            />

            <section className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">
                    Tìm thấy{" "}
                    {
                        filteredInvoices.length
                    }{" "}
                    hóa đơn
                </p>
            </section>

            {paginatedInvoices.length > 0 ? (
                <CustomerInvoiceList
                    invoices={
                        paginatedInvoices
                    }
                    onViewDetail={
                        handleViewDetail
                    }
                    onPayment={
                        handlePayment
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
                        Không tìm thấy hóa đơn
                    </h2>

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

            {totalPages > 1 && (
                <nav
                    aria-label="Phân trang hóa đơn"
                    className="flex items-center justify-center gap-1.5 pb-5 pt-2"
                >
                    <button
                        type="button"
                        aria-label="Trang trước"
                        disabled={
                            currentPage === 1
                        }
                        onClick={() => {
                            handlePageChange(
                                currentPage - 1,
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
                            length: totalPages,
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
                                currentPage + 1,
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