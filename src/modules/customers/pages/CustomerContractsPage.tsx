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
    CustomerContractAttention,
} from "../components/CustomerContractAttention";

import {
    CustomerContractExtensionModal,
} from "../components/CustomerContractExtensionModal";

import {
    CustomerContractFilters,
    type CustomerContractDateFilter,
} from "../components/CustomerContractFilters";

import {
    CustomerContractTable,
} from "../components/CustomerContractTable";

import {
    CUSTOMER_CONTRACT_MOCKS,
} from "../mocks/customerContract.mock";

import type {
    CustomerContractItem,
    CustomerContractStatus,
} from "../types/customerContract.types";

import type {
    CustomerContractExtensionFormData,
} from "../types/customerContractExtension.types";

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
    dateFilter: CustomerContractDateFilter,
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

    const daysMap: Record<
        Exclude<
            CustomerContractDateFilter,
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
        daysMap[dateFilter],
    );

    return createdDate >= minimumDate;
};

export const CustomerContractsPage = () => {
    const navigate = useNavigate();

    const [
        contracts,
    ] = useState<CustomerContractItem[]>(
        CUSTOMER_CONTRACT_MOCKS,
    );

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        status,
        setStatus,
    ] = useState<
        CustomerContractStatus | "ALL"
    >("ALL");

    const [
        dateFilter,
        setDateFilter,
    ] = useState<CustomerContractDateFilter>(
        "ALL",
    );

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const [
        extensionContract,
        setExtensionContract,
    ] = useState<CustomerContractItem | null>(
        null,
    );

    const filteredContracts = useMemo(() => {
        const normalizedSearch =
            normalizeSearchValue(searchTerm);

        return contracts.filter(
            (contract) => {
                const searchableText = [
                    contract.contractCode,
                    contract.quotationCode,
                    contract.requestCode,
                    contract.equipmentName,
                    contract.equipmentCode,
                    contract.branch,
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
                    contract.status === status;

                const matchesDate =
                    matchesDateFilter(
                        contract.createdAt,
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
        contracts,
        searchTerm,
        status,
        dateFilter,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredContracts.length /
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

    const paginatedContracts =
        useMemo(() => {
            const startIndex =
                (currentPage - 1) *
                ITEMS_PER_PAGE;

            return filteredContracts.slice(
                startIndex,
                startIndex +
                ITEMS_PER_PAGE,
            );
        }, [
            filteredContracts,
            currentPage,
        ]);

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
            | CustomerContractStatus
            | "ALL",
    ): void => {
        setStatus(nextStatus);
        setCurrentPage(1);
    };

    const handleDateFilterChange = (
        nextDateFilter:
        CustomerContractDateFilter,
    ): void => {
        setDateFilter(
            nextDateFilter,
        );

        setCurrentPage(1);
    };

    const handleViewDetail = (
        contract: CustomerContractItem,
    ): void => {
        navigate(
            `/customer/contracts/${contract.id}`,
        );

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    };

    const handleRequestExtension = (
        contract: CustomerContractItem,
    ): void => {
        setExtensionContract(
            contract,
        );
    };

    const handleCloseExtensionModal =
        (): void => {
            setExtensionContract(null);
        };

    const handleSubmitExtension = (
        data: CustomerContractExtensionFormData,
    ): void => {
        console.log(
            "Yêu cầu gia hạn:",
            data,
        );

        setExtensionContract(null);
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
        <>
            <main className="space-y-5">
                <header>
                    <h1 className="text-3xl font-bold text-slate-950">
                        Hợp đồng của tôi
                    </h1>

                    <p className="mt-1.5 text-sm text-slate-500">
                        Theo dõi thời hạn thuê,
                        tiến độ thanh toán và trạng
                        thái hợp đồng.
                    </p>
                </header>

                <CustomerContractAttention
                    contracts={
                        contracts
                    }
                    onViewDetail={
                        handleViewDetail
                    }
                />

                <CustomerContractFilters
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

                <section className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">
                        Tìm thấy{" "}
                        {
                            filteredContracts.length
                        }{" "}
                        hợp đồng
                    </p>
                </section>

                {paginatedContracts.length >
                0 ? (
                    <CustomerContractTable
                        contracts={
                            paginatedContracts
                        }
                        onViewDetail={
                            handleViewDetail
                        }
                        onRequestExtension={
                            handleRequestExtension
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
                            Không tìm thấy hợp đồng
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Hãy thử thay đổi từ khóa
                            hoặc bộ lọc hiện tại.
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
                        aria-label="Phân trang hợp đồng"
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

            <CustomerContractExtensionModal
                contract={
                    extensionContract
                }
                open={
                    extensionContract !==
                    null
                }
                onClose={
                    handleCloseExtensionModal
                }
                onSubmit={
                    handleSubmitExtension
                }
            />
        </>
    );
};