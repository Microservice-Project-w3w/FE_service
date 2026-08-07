import {
    MapPin,
} from "lucide-react";
import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    CustomerEquipmentFilters,
    type EquipmentPriceRange,
} from "../components/CustomerEquipmentFilters";
import {
    CustomerEquipmentGrid,
} from "../components/CustomerEquipmentGrid";
import {
    CUSTOMER_EQUIPMENT_MOCKS,
} from "../mocks/customerEquipment.mock";
import type {
    CustomerEquipmentStatus,
} from "../types/customerEquipment.types";

type EquipmentSortOption =
    | "NEWEST"
    | "NAME_ASC";

const ITEMS_PER_PAGE = 6;

const BRANCH_OPTIONS = [
    {
        value: "ALL",
        label: "Tất cả chi nhánh",
    },
    {
        value: "Chi nhánh Hà Nội",
        label: "Chi nhánh Hà Nội",
    },
    {
        value: "Chi nhánh Đà Nẵng",
        label: "Chi nhánh Đà Nẵng",
    },
    {
        value: "Chi nhánh TP.HCM",
        label: "Chi nhánh TP.HCM",
    },
] as const;

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

const matchesPriceRange = (
    price: number,
    priceRange: EquipmentPriceRange,
): boolean => {
    switch (priceRange) {
        case "UNDER_500000":
            return price < 500000;

        case "FROM_500000_TO_1000000":
            return (
                price >= 500000 &&
                price <= 1000000
            );

        case "OVER_1000000":
            return price > 1000000;

        case "ALL":
        default:
            return true;
    }
};

const EquipmentGridSkeleton = () => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({
                length: ITEMS_PER_PAGE,
            }).map((_, index) => (
                <article
                    key={index}
                    className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                    <div className="h-40 bg-slate-200" />

                    <div className="space-y-3 p-3">
                        <div className="h-6 w-20 rounded-full bg-slate-200" />

                        <div className="h-4 w-3/4 rounded bg-slate-200" />

                        <div className="h-3 w-2/5 rounded bg-slate-200" />

                        <div className="h-3 w-1/2 rounded bg-slate-200" />

                        <div className="h-5 w-2/5 rounded bg-slate-200" />

                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="h-9 rounded-lg bg-slate-200" />

                            <div className="h-9 rounded-lg bg-slate-200" />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
};

export const CustomerEquipmentPage = () => {
    const loadingTimerRef =
        useRef<number | null>(null);

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        category,
        setCategory,
    ] = useState("ALL");

    const [
        priceRange,
        setPriceRange,
    ] = useState<EquipmentPriceRange>("ALL");

    const [
        branch,
        setBranch,
    ] = useState("ALL");

    const [
        status,
        setStatus,
    ] = useState<
        CustomerEquipmentStatus | "ALL"
    >("ALL");

    const [
        sortOption,
        setSortOption,
    ] = useState<EquipmentSortOption>(
        "NEWEST",
    );

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    useEffect(() => {
        loadingTimerRef.current =
            window.setTimeout(() => {
                setIsLoading(false);
            }, 600);

        return () => {
            if (
                loadingTimerRef.current !== null
            ) {
                window.clearTimeout(
                    loadingTimerRef.current,
                );
            }
        };
    }, []);

    const filteredEquipments = useMemo(() => {
        const normalizedSearch =
            normalizeSearchValue(searchTerm);

        const result =
            CUSTOMER_EQUIPMENT_MOCKS.filter(
                (equipment) => {
                    const searchableText = [
                        equipment.name,
                        equipment.code,
                        equipment.category,
                        equipment.branch,
                    ]
                        .map(normalizeSearchValue)
                        .join(" ");

                    const matchesSearch =
                        normalizedSearch === "" ||
                        searchableText.includes(
                            normalizedSearch,
                        );

                    const matchesCategory =
                        category === "ALL" ||
                        equipment.category ===
                        category;

                    const matchesPrice =
                        matchesPriceRange(
                            equipment.pricePerDay,
                            priceRange,
                        );

                    const matchesBranch =
                        branch === "ALL" ||
                        equipment.branch === branch;

                    const matchesStatus =
                        status === "ALL" ||
                        equipment.status === status;

                    return (
                        matchesSearch &&
                        matchesCategory &&
                        matchesPrice &&
                        matchesBranch &&
                        matchesStatus
                    );
                },
            );

        return [...result].sort(
            (first, second) => {
                switch (sortOption) {
                    case "NAME_ASC":
                        return first.name.localeCompare(
                            second.name,
                            "vi",
                        );

                    case "NEWEST":
                    default:
                        return (
                            Number(second.id) -
                            Number(first.id)
                        );
                }
            },
        );
    }, [
        searchTerm,
        category,
        priceRange,
        branch,
        status,
        sortOption,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredEquipments.length /
            ITEMS_PER_PAGE,
        ),
    );

    const paginatedEquipments =
        useMemo(() => {
            const startIndex =
                (currentPage - 1) *
                ITEMS_PER_PAGE;

            const endIndex =
                startIndex +
                ITEMS_PER_PAGE;

            return filteredEquipments.slice(
                startIndex,
                endIndex,
            );
        }, [
            filteredEquipments,
            currentPage,
        ]);

    const selectedBranchLabel =
        BRANCH_OPTIONS.find(
            (option) =>
                option.value === branch,
        )?.label ?? "Tất cả chi nhánh";

    const availableInSelectedBranch =
        useMemo(() => {
            return CUSTOMER_EQUIPMENT_MOCKS.filter(
                (equipment) => {
                    const matchesSelectedBranch =
                        branch === "ALL" ||
                        equipment.branch === branch;

                    const canRent =
                        equipment.status !==
                        "UNAVAILABLE" &&
                        equipment.availableQuantity >
                        0;

                    return (
                        matchesSelectedBranch &&
                        canRent
                    );
                },
            ).length;
        }, [branch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        searchTerm,
        category,
        priceRange,
        branch,
        status,
        sortOption,
    ]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [
        currentPage,
        totalPages,
    ]);

    const handleBranchChange = (
        nextBranch: string,
    ): void => {
        if (nextBranch === branch) {
            return;
        }

        if (
            loadingTimerRef.current !== null
        ) {
            window.clearTimeout(
                loadingTimerRef.current,
            );
        }

        setIsLoading(true);
        setBranch(nextBranch);
        setCurrentPage(1);

        loadingTimerRef.current =
            window.setTimeout(() => {
                setIsLoading(false);
            }, 500);
    };

    const handleResetFilters = (): void => {
        setSearchTerm("");
        setCategory("ALL");
        setPriceRange("ALL");
        setStatus("ALL");
        handleBranchChange("ALL");
        setCurrentPage(1);
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

    return (
        <main className="space-y-6">
            <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-950">
                        Thiết bị cho thuê
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Khám phá và lựa chọn thiết bị
                        phù hợp với nhu cầu của bạn.
                    </p>
                </div>

                <label className="relative flex min-w-64 items-center gap-3 rounded-2xl bg-blue-50 px-4 py-3 transition focus-within:ring-4 focus-within:ring-blue-100 hover:bg-blue-100">
                    <MapPin
                        size={20}
                        aria-hidden="true"
                        className="shrink-0 text-blue-600"
                    />

                    <span className="min-w-0 flex-1">
                        <span className="block text-xs text-slate-500">
                            Chi nhánh hiện tại
                        </span>

                        <select
                            aria-label="Chọn chi nhánh hiện tại"
                            value={branch}
                            disabled={isLoading}
                            onChange={(event) => {
                                handleBranchChange(
                                    event.target.value,
                                );
                            }}
                            className="mt-0.5 w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-sm font-bold text-slate-900 outline-none disabled:cursor-wait disabled:opacity-60"
                        >
                            {BRANCH_OPTIONS.map(
                                (option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ),
                            )}
                        </select>

                        <span className="mt-1 block text-[11px] text-blue-700">
                            {isLoading
                                ? "Đang tải thiết bị..."
                                : `${availableInSelectedBranch} thiết bị có thể thuê`}
                        </span>
                    </span>
                </label>
            </header>

            <CustomerEquipmentFilters
                searchTerm={searchTerm}
                category={category}
                priceRange={priceRange}
                branch={branch}
                status={status}
                onSearchChange={setSearchTerm}
                onCategoryChange={setCategory}
                onPriceRangeChange={
                    setPriceRange
                }
                onBranchChange={
                    handleBranchChange
                }
                onStatusChange={setStatus}
                onReset={handleResetFilters}
            />

            <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-slate-700">
                        {isLoading
                            ? "Đang tải danh sách thiết bị..."
                            : `Tìm thấy ${filteredEquipments.length} thiết bị`}
                    </p>

                    {!isLoading &&
                        branch !== "ALL" && (
                            <p className="mt-1 text-xs text-slate-500">
                                Đang hiển thị tại:{" "}
                                <strong className="text-slate-700">
                                    {
                                        selectedBranchLabel
                                    }
                                </strong>
                            </p>
                        )}

                    {!isLoading &&
                        searchTerm.trim() && (
                            <p className="mt-1 text-xs text-slate-500">
                                Kết quả tìm kiếm cho:{" "}
                                <strong className="text-slate-700">
                                    “
                                    {
                                        searchTerm.trim()
                                    }
                                    ”
                                </strong>
                            </p>
                        )}
                </div>

                <select
                    aria-label="Sắp xếp thiết bị"
                    value={sortOption}
                    disabled={isLoading}
                    onChange={(event) => {
                        setSortOption(
                            event.target
                                .value as EquipmentSortOption,
                        );
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-wait disabled:opacity-60"
                >
                    <option value="NEWEST">
                        Mới nhất
                    </option>

                    <option value="NAME_ASC">
                        Tên A - Z
                    </option>
                </select>
            </section>

            {isLoading ? (
                <EquipmentGridSkeleton />
            ) : (
                <CustomerEquipmentGrid
                    equipments={
                        paginatedEquipments
                    }
                />
            )}

            {!isLoading &&
                filteredEquipments.length >
                ITEMS_PER_PAGE && (
                    <nav
                        aria-label="Phân trang thiết bị"
                        className="flex justify-center gap-2 pb-4"
                    >
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
                                            ? "flex size-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white"
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