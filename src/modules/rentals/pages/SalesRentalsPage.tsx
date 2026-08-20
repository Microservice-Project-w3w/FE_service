import type {
    LucideIcon,
} from "lucide-react";

import {
    Activity,
    Building2,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Eye,
    Filter,
    PackageCheck,
    RefreshCw,
    Search,
    SlidersHorizontal,
    Truck,
    XCircle,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router";

type RentalStatus =
    | "NEW"
    | "PROCESSING"
    | "DELIVERING"
    | "COMPLETED"
    | "CANCELLED";

interface SalesRental {
    id: string;
    code: string;
    customerName: string;
    contactName: string;
    phone: string;
    equipmentName: string;
    equipmentModel: string;
    startDate: string;
    endDate: string;
    createdDate: string;
    createdTime: string;
    ageDays: number;
    value: number;
    status: RentalStatus;
}

interface RentalActivity {
    id: string;
    rentalId: string;
    rentalCode: string;
    title: string;
    actor: string;
    time: string;
    type:
        | "NEW"
        | "PROCESSING"
        | "DELIVERING"
        | "COMPLETED"
        | "CANCELLED";
}

const COMPANY_SEEDS = [
    {
        customerName: "Công ty TNHH ABC",
        contactName: "Nguyễn Văn An",
        phone: "0901 234 567",
        equipmentName: "Máy phát điện 50kVA",
        equipmentModel: "Cummins C50D5",
        baseValue: 85000000,
    },
    {
        customerName: "Công ty XYZ",
        contactName: "Trần Thị B",
        phone: "0902 345 678",
        equipmentName: "Xe nâng người 12m",
        equipmentModel: "Genie GS-3246",
        baseValue: 52000000,
    },
    {
        customerName: "Công ty DEF",
        contactName: "Lê Văn C",
        phone: "0903 456 789",
        equipmentName: "Máy đào 0.9m³",
        equipmentModel: "Kobelco SK75",
        baseValue: 120000000,
    },
    {
        customerName: "Công ty GHI",
        contactName: "Phạm Thị D",
        phone: "0904 567 890",
        equipmentName: "Máy nén khí 10HP",
        equipmentModel: "Airman PDS100S",
        baseValue: 28000000,
    },
    {
        customerName: "Công ty JKL",
        contactName: "Đỗ Thị E",
        phone: "0905 678 901",
        equipmentName: "Tháp đèn LED 7m",
        equipmentModel: "Atlas Copco HiLight V5+",
        baseValue: 18500000,
    },
    {
        customerName: "Công ty TNHH Sự kiện Việt",
        contactName: "Hoàng Minh Khang",
        phone: "0906 112 233",
        equipmentName: "Loa Array JBL VTX A8",
        equipmentModel: "JBL VTX A8",
        baseValue: 96000000,
    },
];

const STATUS_PATTERN: RentalStatus[] = [
    "NEW",
    "PROCESSING",
    "DELIVERING",
    "COMPLETED",
    "PROCESSING",
    "COMPLETED",
    "NEW",
    "CANCELLED",
];

const RENTAL_MOCKS: SalesRental[] =
    Array.from(
        {
            length: 28,
        },
        (_, index) => {
            const seed =
                COMPANY_SEEDS[
                index %
                COMPANY_SEEDS.length
                    ];

            const startDay =
                14 - (index % 10);

            const endDay =
                Math.min(
                    28,
                    startDay +
                    5 +
                    (index % 3),
                );

            const codeNumber =
                28 - index;

            return {
                id: `rental-${String(
                    index + 1,
                ).padStart(3, "0")}`,
                code: `RENT-2026-${String(
                    codeNumber,
                ).padStart(3, "0")}`,
                customerName:
                seed.customerName,
                contactName:
                seed.contactName,
                phone:
                seed.phone,
                equipmentName:
                seed.equipmentName,
                equipmentModel:
                seed.equipmentModel,
                startDate: `${String(
                    Math.max(
                        startDay,
                        1,
                    ),
                ).padStart(
                    2,
                    "0",
                )}/08/2026`,
                endDate: `${String(
                    Math.max(
                        endDay,
                        1,
                    ),
                ).padStart(
                    2,
                    "0",
                )}/08/2026`,
                createdDate: `${String(
                    Math.max(
                        13 -
                        (index % 12),
                        1,
                    ),
                ).padStart(
                    2,
                    "0",
                )}/08/2026`,
                createdTime:
                    index % 2 === 0
                        ? "10:30"
                        : "09:15",
                ageDays: index,
                value:
                    seed.baseValue +
                    (index % 4) *
                    3500000,
                status:
                    STATUS_PATTERN[
                    index %
                    STATUS_PATTERN.length
                        ],
            };
        },
    );

const RECENT_ACTIVITIES: RentalActivity[] = [
    {
        id: "activity-001",
        rentalId: "rental-001",
        rentalCode: "RENT-2026-028",
        title: "Tạo đơn thuê mới cho Công ty TNHH ABC",
        actor: "Nguyễn Văn Minh",
        time: "10:30 hôm nay",
        type: "NEW",
    },
    {
        id: "activity-002",
        rentalId: "rental-002",
        rentalCode: "RENT-2026-027",
        title: "Đơn thuê đang được xử lý",
        actor: "Nguyễn Văn Minh",
        time: "09:15 hôm nay",
        type: "PROCESSING",
    },
    {
        id: "activity-003",
        rentalId: "rental-003",
        rentalCode: "RENT-2026-026",
        title: "Thiết bị đang được giao tới khách hàng",
        actor: "Trần Thị Mai",
        time: "Hôm qua",
        type: "DELIVERING",
    },
    {
        id: "activity-004",
        rentalId: "rental-004",
        rentalCode: "RENT-2026-025",
        title: "Đơn thuê đã hoàn thành",
        actor: "Trần Thị Mai",
        time: "12/08/2026",
        type: "COMPLETED",
    },
];

const STATUS_CONFIG: Record<
    RentalStatus,
    {
        label: string;
        className: string;
    }
> = {
    NEW: {
        label: "Mới",
        className:
            "border-blue-100 bg-blue-50 text-blue-700",
    },
    PROCESSING: {
        label: "Đang xử lý",
        className:
            "border-orange-100 bg-orange-50 text-orange-700",
    },
    DELIVERING: {
        label: "Đang giao",
        className:
            "border-violet-100 bg-violet-50 text-violet-700",
    },
    COMPLETED: {
        label: "Hoàn thành",
        className:
            "border-emerald-100 bg-emerald-50 text-emerald-700",
    },
    CANCELLED: {
        label: "Đã hủy",
        className:
            "border-rose-100 bg-rose-50 text-rose-700",
    },
};

const PAGE_SIZE = 5;

const formatCurrency = (
    value: number,
): string =>
    `${new Intl.NumberFormat(
        "vi-VN",
    ).format(value)} đ`;

const normalizeSearch = (
    value: string,
): string =>
    value
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            "",
        )
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .toLowerCase()
        .trim();

export const SalesRentalsPage =
    () => {
        const [
            searchTerm,
            setSearchTerm,
        ] = useState("");

        const [
            statusFilter,
            setStatusFilter,
        ] = useState<
            RentalStatus | "ALL"
        >("ALL");

        const [
            dateRange,
            setDateRange,
        ] = useState<
            7 | 30 | 90
        >(30);

        const [
            showAdvancedFilter,
            setShowAdvancedFilter,
        ] = useState(false);

        const [
            minValue,
            setMinValue,
        ] = useState("");

        const [
            maxValue,
            setMaxValue,
        ] = useState("");

        const [
            currentPage,
            setCurrentPage,
        ] = useState(1);

        const summary =
            useMemo(() => {
                const total =
                    RENTAL_MOCKS.length;

                const count = (
                    status:
                    RentalStatus,
                ) =>
                    RENTAL_MOCKS.filter(
                        (item) =>
                            item.status ===
                            status,
                    ).length;

                return {
                    total,
                    newCount:
                        count("NEW"),
                    processing:
                        count(
                            "PROCESSING",
                        ),
                    delivering:
                        count(
                            "DELIVERING",
                        ),
                    completed:
                        count(
                            "COMPLETED",
                        ),
                    cancelled:
                        count(
                            "CANCELLED",
                        ),
                };
            }, []);

        const filteredRentals =
            useMemo(() => {
                const keyword =
                    normalizeSearch(
                        searchTerm,
                    );

                const min =
                    minValue === ""
                        ? null
                        : Number(
                            minValue,
                        );

                const max =
                    maxValue === ""
                        ? null
                        : Number(
                            maxValue,
                        );

                return RENTAL_MOCKS.filter(
                    (rental) => {
                        const searchable =
                            normalizeSearch(
                                [
                                    rental.code,
                                    rental.customerName,
                                    rental.contactName,
                                    rental.phone,
                                    rental.equipmentName,
                                    rental.equipmentModel,
                                ].join(" "),
                            );

                        const matchesSearch =
                            keyword === "" ||
                            searchable.includes(
                                keyword,
                            );

                        const matchesStatus =
                            statusFilter ===
                            "ALL" ||
                            rental.status ===
                            statusFilter;

                        const matchesDate =
                            rental.ageDays <
                            dateRange;

                        const matchesMin =
                            min === null ||
                            rental.value >=
                            min;

                        const matchesMax =
                            max === null ||
                            rental.value <=
                            max;

                        return (
                            matchesSearch &&
                            matchesStatus &&
                            matchesDate &&
                            matchesMin &&
                            matchesMax
                        );
                    },
                );
            }, [
                searchTerm,
                statusFilter,
                dateRange,
                minValue,
                maxValue,
            ]);

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    filteredRentals.length /
                    PAGE_SIZE,
                ),
            );

        const safePage =
            Math.min(
                currentPage,
                totalPages,
            );

        const visibleRentals =
            filteredRentals.slice(
                (safePage - 1) *
                PAGE_SIZE,
                safePage *
                PAGE_SIZE,
            );

        const totalValue =
            filteredRentals.reduce(
                (
                    total,
                    rental,
                ) =>
                    total +
                    rental.value,
                0,
            );

        const changePage = (
            page: number,
        ): void => {
            setCurrentPage(
                Math.min(
                    totalPages,
                    Math.max(
                        1,
                        page,
                    ),
                ),
            );
        };

        const resetPagination =
            (): void => {
                setCurrentPage(1);
            };

        return (
            <main className="space-y-4">
                <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                            Đơn thuê
                        </h1>

                        <p className="mt-1 text-xs text-slate-500">
                            Tạo và theo dõi trạng thái đơn thuê thiết bị.
                        </p>
                    </div>

                    <Link
                        to="/sales/rentals/create"
                        className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-4 text-sm font-semibold !text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 hover:!text-white lg:self-auto"
                    >
                        <PackageCheck
                            size={17}
                            aria-hidden="true"
                        />

                        Tạo đơn thuê mới
                    </Link>
                </header>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        icon={
                            PackageCheck
                        }
                        iconClassName="bg-blue-50 text-blue-600"
                        title="Tổng đơn thuê"
                        value={String(
                            summary.total,
                        )}
                        growth="+18% so với 30 ngày trước"
                        sparkline="8,26 18,22 26,28 36,18 44,25 55,15 64,24 75,13"
                    />

                    <StatCard
                        icon={Clock3}
                        iconClassName="bg-orange-50 text-orange-600"
                        title="Đang xử lý"
                        value={String(
                            summary.processing,
                        )}
                        growth="+12% so với 30 ngày trước"
                        sparkline="8,26 18,20 26,25 36,17 44,22 55,13 64,21 75,10"
                    />

                    <StatCard
                        icon={Truck}
                        iconClassName="bg-violet-50 text-violet-600"
                        title="Đang giao"
                        value={String(
                            summary.delivering,
                        )}
                        growth="+20% so với 30 ngày trước"
                        sparkline="8,23 18,14 26,24 36,18 44,28 55,15 64,24 75,16"
                    />

                    <StatCard
                        icon={
                            CheckCircle2
                        }
                        iconClassName="bg-emerald-50 text-emerald-600"
                        title="Hoàn thành"
                        value={String(
                            summary.completed,
                        )}
                        growth="+10% so với 30 ngày trước"
                        sparkline="8,27 18,15 26,23 36,11 44,22 55,14 64,20 75,8"
                    />
                </section>

                <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
                    <div className="min-w-0 space-y-3">
                        <section className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
                            <div className="flex flex-col gap-2.5 xl:flex-row">
                                <label className="relative flex-1">
                                    <Search
                                        size={16}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        aria-hidden="true"
                                    />

                                    <input
                                        value={
                                            searchTerm
                                        }
                                        onChange={(event) => {
                                            setSearchTerm(
                                                event.target
                                                    .value,
                                            );
                                            resetPagination();
                                        }}
                                        placeholder="Tìm theo mã đơn, khách hàng, người liên hệ..."
                                        className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                    />
                                </label>

                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(event) => {
                                        setStatusFilter(
                                            event.target
                                                .value as
                                                | RentalStatus
                                                | "ALL",
                                        );
                                        resetPagination();
                                    }}
                                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 xl:w-[165px]"
                                >
                                    <option value="ALL">
                                        Trạng thái: Tất cả
                                    </option>

                                    <option value="NEW">
                                        Mới
                                    </option>

                                    <option value="PROCESSING">
                                        Đang xử lý
                                    </option>

                                    <option value="DELIVERING">
                                        Đang giao
                                    </option>

                                    <option value="COMPLETED">
                                        Hoàn thành
                                    </option>

                                    <option value="CANCELLED">
                                        Đã hủy
                                    </option>
                                </select>

                                <label className="relative">
                                    <CalendarDays
                                        size={15}
                                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <select
                                        value={
                                            dateRange
                                        }
                                        onChange={(event) => {
                                            setDateRange(
                                                Number(
                                                    event.target
                                                        .value,
                                                ) as
                                                    | 7
                                                    | 30
                                                    | 90,
                                            );
                                            resetPagination();
                                        }}
                                        className="h-10 rounded-xl border border-slate-200 bg-white pl-8 pr-7 text-xs font-medium text-slate-700 outline-none xl:w-[145px]"
                                    >
                                        <option value={7}>
                                            7 ngày
                                        </option>

                                        <option value={30}>
                                            30 ngày
                                        </option>

                                        <option value={90}>
                                            90 ngày
                                        </option>
                                    </select>
                                </label>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAdvancedFilter(
                                            (current) =>
                                                !current,
                                        );
                                    }}
                                    className={[
                                        "inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition",
                                        showAdvancedFilter
                                            ? "border-blue-200 bg-blue-50 text-blue-700"
                                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    <Filter
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    Bộ lọc
                                </button>

                                <button
                                    type="button"
                                    aria-label="Đặt lại bộ lọc"
                                    title="Đặt lại"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setStatusFilter(
                                            "ALL",
                                        );
                                        setDateRange(30);
                                        setMinValue("");
                                        setMaxValue("");
                                        setCurrentPage(1);
                                    }}
                                    className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-blue-600"
                                >
                                    <RefreshCw
                                        size={15}
                                    />
                                </button>
                            </div>

                            {showAdvancedFilter && (
                                <div className="mt-2.5 flex flex-col gap-2.5 border-t border-slate-100 pt-2.5 sm:flex-row sm:items-end">
                                    <div className="flex-1">
                                        <label className="mb-1 block text-[11px] font-semibold text-slate-500">
                                            Giá trị tối thiểu
                                        </label>

                                        <input
                                            type="number"
                                            min={0}
                                            value={
                                                minValue
                                            }
                                            onChange={(event) => {
                                                setMinValue(
                                                    event.target
                                                        .value,
                                                );
                                                resetPagination();
                                            }}
                                            placeholder="0"
                                            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label className="mb-1 block text-[11px] font-semibold text-slate-500">
                                            Giá trị tối đa
                                        </label>

                                        <input
                                            type="number"
                                            min={0}
                                            value={
                                                maxValue
                                            }
                                            onChange={(event) => {
                                                setMaxValue(
                                                    event.target
                                                        .value,
                                                );
                                                resetPagination();
                                            }}
                                            placeholder="Không giới hạn"
                                            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMinValue("");
                                            setMaxValue("");
                                        }}
                                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        <SlidersHorizontal
                                            size={14}
                                        />
                                        Xóa lọc giá
                                    </button>
                                </div>
                            )}
                        </section>

                        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <header className="border-b border-slate-100 px-4 py-3">
                                <h2 className="text-sm font-bold text-slate-950">
                                    Danh sách đơn thuê
                                </h2>

                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    Theo dõi chi tiết các đơn thuê thiết bị.
                                </p>
                            </header>

                            <div className="overflow-x-auto">
                                <div className="min-w-[900px]">
                                    <div className="grid grid-cols-[120px_minmax(185px,1fr)_minmax(170px,1fr)_105px_105px_125px_110px_100px] gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 text-[11px] font-semibold text-slate-500">
                    <span>
                      Mã đơn
                    </span>
                                        <span>
                      Khách hàng
                    </span>
                                        <span>
                      Thiết bị thuê
                    </span>
                                        <span>
                      Ngày bắt đầu
                    </span>
                                        <span>
                      Ngày kết thúc
                    </span>
                                        <span>
                      Giá trị
                    </span>
                                        <span>
                      Trạng thái
                    </span>
                                        <span className="text-right">
                      Thao tác
                    </span>
                                    </div>

                                    <div className="divide-y divide-slate-100">
                                        {visibleRentals.map(
                                            (rental) => {
                                                const status =
                                                    STATUS_CONFIG[
                                                        rental.status
                                                        ];

                                                return (
                                                    <div
                                                        key={
                                                            rental.id
                                                        }
                                                        className="grid grid-cols-[120px_minmax(185px,1fr)_minmax(170px,1fr)_105px_105px_125px_110px_100px] items-center gap-3 px-4 py-3 transition hover:bg-slate-50/70"
                                                    >
                                                        <div>
                                                            <Link
                                                                to={`/sales/rentals/${rental.id}`}
                                                                className="text-[11px] font-bold text-blue-600 hover:underline"
                                                            >
                                                                {
                                                                    rental.code
                                                                }
                                                            </Link>

                                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                                {
                                                                    rental.createdDate
                                                                }{" "}
                                                                {
                                                                    rental.createdTime
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="min-w-0">
                                                            <div className="flex items-start gap-2">
                                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                  <Building2
                                      size={13}
                                      aria-hidden="true"
                                  />
                                </span>

                                                                <div className="min-w-0">
                                                                    <p className="truncate text-xs font-bold text-slate-900">
                                                                        {
                                                                            rental.customerName
                                                                        }
                                                                    </p>

                                                                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                                                        {
                                                                            rental.contactName
                                                                        }
                                                                    </p>

                                                                    <p className="truncate text-[10px] text-slate-400">
                                                                        {
                                                                            rental.phone
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-semibold text-slate-800">
                                                                {
                                                                    rental.equipmentName
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                                                {
                                                                    rental.equipmentModel
                                                                }
                                                            </p>
                                                        </div>

                                                        <p className="text-xs font-semibold text-slate-700">
                                                            {
                                                                rental.startDate
                                                            }
                                                        </p>

                                                        <p className="text-xs font-semibold text-slate-700">
                                                            {
                                                                rental.endDate
                                                            }
                                                        </p>

                                                        <p className="text-xs font-bold text-slate-900">
                                                            {formatCurrency(
                                                                rental.value,
                                                            )}
                                                        </p>

                                                        <span
                                                            className={[
                                                                "w-fit rounded-full border px-2 py-1 text-[10px] font-bold",
                                                                status.className,
                                                            ].join(" ")}
                                                        >
                              {
                                  status.label
                              }
                            </span>

                                                        <div className="flex justify-end">
                                                            <Link
                                                                to={`/sales/rentals/${rental.id}`}
                                                                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-white px-2.5 text-[11px] font-bold text-blue-600 transition hover:bg-blue-50"
                                                            >
                                                                <Eye
                                                                    size={14}
                                                                    aria-hidden="true"
                                                                />
                                                                Chi tiết
                                                            </Link>
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}

                                        {visibleRentals.length ===
                                            0 && (
                                                <div className="px-5 py-10 text-center">
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        Không tìm thấy đơn thuê
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>

                            <footer className="flex flex-col gap-2.5 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-[11px] text-slate-500">
                                    Hiển thị{" "}
                                    {filteredRentals.length ===
                                    0
                                        ? 0
                                        : (safePage -
                                            1) *
                                        PAGE_SIZE +
                                        1}
                                    {" - "}
                                    {Math.min(
                                        safePage *
                                        PAGE_SIZE,
                                        filteredRentals.length,
                                    )}{" "}
                                    /{" "}
                                    {
                                        filteredRentals.length
                                    }{" "}
                                    đơn thuê
                                </p>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        aria-label="Trang trước"
                                        disabled={
                                            safePage === 1
                                        }
                                        onClick={() => {
                                            changePage(
                                                safePage -
                                                1,
                                            );
                                        }}
                                        className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronLeft
                                            size={15}
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
                                        (page) => (
                                            <button
                                                key={page}
                                                type="button"
                                                onClick={() => {
                                                    changePage(
                                                        page,
                                                    );
                                                }}
                                                className={[
                                                    "flex size-8 items-center justify-center rounded-lg text-xs font-semibold transition",
                                                    page ===
                                                    safePage
                                                        ? "bg-blue-600 text-white"
                                                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                                                ].join(
                                                    " ",
                                                )}
                                            >
                                                {
                                                    page
                                                }
                                            </button>
                                        ),
                                    )}

                                    <button
                                        type="button"
                                        aria-label="Trang sau"
                                        disabled={
                                            safePage ===
                                            totalPages
                                        }
                                        onClick={() => {
                                            changePage(
                                                safePage +
                                                1,
                                            );
                                        }}
                                        className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <ChevronRight
                                            size={15}
                                        />
                                    </button>
                                </div>
                            </footer>
                        </article>
                    </div>

                    <aside className="space-y-3">
                        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-950">
                                Phân bố trạng thái
                            </h2>

                            <div className="mt-4 flex items-center gap-4">
                                <div
                                    className="flex size-28 shrink-0 items-center justify-center rounded-full"
                                    style={{
                                        background:
                                            "conic-gradient(#2563eb 0% 28.6%, #f97316 28.6% 50%, #8b5cf6 50% 71.4%, #10b981 71.4% 92.9%, #f43f5e 92.9% 100%)",
                                    }}
                                >
                                    <div className="flex size-20 flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-xl font-bold text-slate-950">
                      {
                          summary.total
                      }
                    </span>
                                        <span className="text-[9px] text-slate-400">
                      Tổng đơn thuê
                    </span>
                                    </div>
                                </div>

                                <div className="min-w-0 flex-1 space-y-2">
                                    <StatusLegend
                                        label="Mới"
                                        value={
                                            summary.newCount
                                        }
                                        dotClassName="bg-blue-600"
                                    />
                                    <StatusLegend
                                        label="Đang xử lý"
                                        value={
                                            summary.processing
                                        }
                                        dotClassName="bg-orange-500"
                                    />
                                    <StatusLegend
                                        label="Đang giao"
                                        value={
                                            summary.delivering
                                        }
                                        dotClassName="bg-violet-500"
                                    />
                                    <StatusLegend
                                        label="Hoàn thành"
                                        value={
                                            summary.completed
                                        }
                                        dotClassName="bg-emerald-500"
                                    />
                                    <StatusLegend
                                        label="Đã hủy"
                                        value={
                                            summary.cancelled
                                        }
                                        dotClassName="bg-rose-500"
                                    />
                                </div>
                            </div>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-slate-950">
                                    Giá trị đơn thuê
                                </h2>

                                <span className="rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-500">
                  30 ngày
                </span>
                            </div>

                            <p className="mt-4 text-[10px] text-slate-400">
                                Tổng giá trị
                            </p>

                            <p className="mt-1 text-lg font-bold text-slate-950">
                                {formatCurrency(
                                    totalValue,
                                )}
                            </p>

                            <p className="mt-1 text-[10px] font-semibold text-emerald-600">
                                ↑ 22% so với 30 ngày trước
                            </p>

                            <svg
                                viewBox="0 0 280 70"
                                className="mt-3 h-[70px] w-full"
                                aria-hidden="true"
                            >
                                <polyline
                                    points="5,52 25,44 45,51 65,39 85,47 105,36 125,43 145,34 165,42 185,29 205,38 225,20 245,35 275,21"
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </article>

                        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <Activity
                                        size={16}
                                        className="text-blue-600"
                                    />

                                    <h2 className="text-sm font-bold text-slate-950">
                                        Hoạt động gần đây
                                    </h2>
                                </div>

                                <Link
                                    to="/sales/rentals/activities"
                                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                                >
                                    Xem tất cả
                                </Link>
                            </header>

                            <div className="px-4 py-1">
                                {RECENT_ACTIVITIES.slice(
                                    0,
                                    3,
                                ).map(
                                    (activity) => (
                                        <RecentActivityItem
                                            key={
                                                activity.id
                                            }
                                            activity={
                                                activity
                                            }
                                        />
                                    ),
                                )}
                            </div>

                            <div className="border-t border-slate-100 p-3">
                                <Link
                                    to="/sales/rentals/activities"
                                    className="flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-blue-50 text-[11px] font-bold text-blue-600 transition hover:bg-blue-100"
                                >
                                    <Clock3
                                        size={15}
                                    />

                                    Xem lịch sử hoạt động
                                </Link>
                            </div>
                        </article>
                    </aside>
                </section>
            </main>
        );
    };

const StatCard = ({
                      icon: Icon,
                      iconClassName,
                      title,
                      value,
                      growth,
                      sparkline,
                  }: {
    icon: LucideIcon;
    iconClassName: string;
    title: string;
    value: string;
    growth: string;
    sparkline: string;
}) => (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
      <span
          className={[
              "flex size-10 shrink-0 items-center justify-center rounded-2xl",
              iconClassName,
          ].join(" ")}
      >
        <Icon
            size={18}
        />
      </span>

            <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-500">
                    {title}
                </p>

                <div className="mt-1 flex items-end justify-between gap-2">
          <span className="text-2xl font-bold text-slate-950">
            {value}
          </span>

                    <svg
                        viewBox="0 0 84 34"
                        className="h-8 w-20"
                        aria-hidden="true"
                    >
                        <polyline
                            points={sparkline}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-blue-600"
                        />
                    </svg>
                </div>

                <p className="mt-1 text-[10px] font-semibold text-emerald-600">
                    {growth}
                </p>
            </div>
        </div>
    </article>
);

const StatusLegend = ({
                          label,
                          value,
                          dotClassName,
                      }: {
    label: string;
    value: number;
    dotClassName: string;
}) => (
    <div className="flex items-center gap-2 text-[10px]">
    <span
        className={[
            "size-2 rounded-full",
            dotClassName,
        ].join(" ")}
    />

        <span className="flex-1 truncate text-slate-600">
      {label}
    </span>

        <span className="font-semibold text-slate-900">
      {value}
    </span>
    </div>
);

const RecentActivityItem = ({
                                activity,
                            }: {
    activity: RentalActivity;
}) => {
    const config = {
        NEW: {
            icon: PackageCheck,
            tone:
                "bg-blue-50 text-blue-600",
        },
        PROCESSING: {
            icon: Clock3,
            tone:
                "bg-orange-50 text-orange-600",
        },
        DELIVERING: {
            icon: Truck,
            tone:
                "bg-violet-50 text-violet-600",
        },
        COMPLETED: {
            icon: CheckCircle2,
            tone:
                "bg-emerald-50 text-emerald-600",
        },
        CANCELLED: {
            icon: XCircle,
            tone:
                "bg-rose-50 text-rose-600",
        },
    }[activity.type];

    const Icon =
        config.icon;

    return (
        <div className="flex gap-2.5 py-3">
      <span
          className={[
              "flex size-8 shrink-0 items-center justify-center rounded-full",
              config.tone,
          ].join(" ")}
      >
        <Icon
            size={14}
        />
      </span>

            <div className="min-w-0">
                <Link
                    to={`/sales/rentals/${activity.rentalId}`}
                    className="text-[10px] font-bold text-blue-600 hover:underline"
                >
                    {
                        activity.rentalCode
                    }
                </Link>

                <p className="mt-0.5 text-xs font-semibold leading-5 text-slate-800">
                    {
                        activity.title
                    }
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                    {
                        activity.time
                    }{" "}
                    •{" "}
                    {
                        activity.actor
                    }
                </p>
            </div>
        </div>
    );
};