import {
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Eye,
    MoreVertical,
    PackageCheck,
    Plus,
    RefreshCw,
    Search,
    Truck,
    X,
    type LucideIcon,
} from "lucide-react";

import {
    useMemo,
    useState,
    type ReactNode,
} from "react";
type DeliveryStatus =
    | "WAITING_PICKUP"
    | "DELIVERING"
    | "COMPLETED"
    | "DELAYED";

interface DeliveryRow {
    id: string;
    code: string;
    customer: string;
    address: string;
    time: string;
    staff: string;
    status: DeliveryStatus;
    equipmentCount: number;
}

interface RecentActivity {
    id: string;
    icon: LucideIcon;
    title: string;
    meta: string;
    tone: "GREEN" | "BLUE" | "ORANGE";
}

const DELIVERY_STATUS_CONFIG: Record<
    DeliveryStatus,
    {
        label: string;
        className: string;
    }
> = {
    WAITING_PICKUP: {
        label: "Chờ lấy hàng",
        className:
            "bg-blue-50 text-blue-700",
    },
    DELIVERING: {
        label: "Đang giao",
        className:
            "bg-emerald-50 text-emerald-700",
    },
    COMPLETED: {
        label: "Hoàn thành",
        className:
            "bg-emerald-50 text-emerald-700",
    },
    DELAYED: {
        label: "Trễ lịch",
        className:
            "bg-rose-50 text-rose-700",
    },
};

const DELIVERY_DATA: DeliveryRow[] =
    Array.from(
        {
            length: 12,
        },
        (_, index) => {
            const customers = [
                "Công ty ABC",
                "Công ty XYZ",
                "Công ty DEF",
                "Công ty GHI",
                "Công ty JKL",
            ];

            const addresses = [
                "Trung tâm Hội nghị Quốc Gia",
                "Số 17 Phạm Hùng, Hà Nội",
                "Khu CNC Hòa Lạc, Thạch Thất",
                "Vincom Center, Bà Triệu",
                "KĐT Times City, Hai Bà Trưng",
            ];

            const times = [
                "09:30",
                "10:30",
                "11:00",
                "13:30",
                "14:30",
            ];

            const staffs = [
                "Nguyễn Văn Hùng",
                "Trần Minh Đức",
                "Phạm Quốc Tuấn",
            ];

            const statuses:
                DeliveryStatus[] = [
                "WAITING_PICKUP",
                "DELIVERING",
                "DELIVERING",
                "COMPLETED",
                "DELAYED",
            ];

            return {
                id:
                    `delivery-${index + 1}`,
                code:
                    `DG-2026-${String(
                        21 - index,
                    ).padStart(
                        3,
                        "0",
                    )}`,
                customer:
                    customers[
                    index %
                    customers.length
                        ],
                address:
                    addresses[
                    index %
                    addresses.length
                        ],
                time:
                    times[
                    index %
                    times.length
                        ],
                staff:
                    staffs[
                    index %
                    staffs.length
                        ],
                status:
                    statuses[
                    index %
                    statuses.length
                        ],
                equipmentCount:
                    2 +
                    (index % 6),
            };
        },
    );

const RECENT_ACTIVITIES: RecentActivity[] =
    [
        {
            id: "activity-1",
            icon: CheckCircle2,
            title:
                "Đã hoàn thành giao lệnh DG-2026-018 cho Công ty GHI",
            meta:
                "11:45 • Nguyễn Văn Hùng",
            tone: "GREEN",
        },
        {
            id: "activity-2",
            icon: Truck,
            title:
                "Bắt đầu giao lệnh DG-2026-020 cho Công ty XYZ",
            meta:
                "10:32 • Trần Minh Đức",
            tone: "BLUE",
        },
        {
            id: "activity-3",
            icon: PackageCheck,
            title:
                "Tạo mới lệnh giao DG-2026-021 cho Công ty ABC",
            meta:
                "08:15 • Lê Văn Vận Hành",
            tone: "ORANGE",
        },
    ];


const CUSTOMER_OPTIONS = [
    {
        id: "customer-abc",
        name: "Công ty ABC",
        address:
            "Trung tâm Hội nghị Quốc Gia",
        contact:
            "Nguyễn Văn An",
    },
    {
        id: "customer-xyz",
        name: "Công ty XYZ",
        address:
            "Số 17 Phạm Hùng, Hà Nội",
        contact:
            "Trần Minh Quân",
    },
    {
        id: "customer-def",
        name: "Công ty DEF",
        address:
            "Khu CNC Hòa Lạc, Thạch Thất",
        contact:
            "Lê Thu Hà",
    },
    {
        id: "customer-ghi",
        name: "Công ty GHI",
        address:
            "Vincom Center, Bà Triệu",
        contact:
            "Phạm Đức Long",
    },
    {
        id: "customer-jkl",
        name: "Công ty JKL",
        address:
            "KĐT Times City, Hai Bà Trưng",
        contact:
            "Nguyễn Hoàng Nam",
    },
    {
        id: "customer-studio",
        name: "Nguyễn Minh Studio",
        address:
            "25 Nguyễn Trãi, Thanh Xuân, Hà Nội",
        contact:
            "Nguyễn Minh",
    },
    {
        id: "customer-dream",
        name: "Dream Media",
        address:
            "88 Láng Hạ, Đống Đa, Hà Nội",
        contact:
            "Vũ Thanh Tùng",
    },
    {
        id: "customer-event-viet",
        name:
            "Công ty TNHH Sự kiện Việt",
        address:
            "12 Trần Duy Hưng, Cầu Giấy, Hà Nội",
        contact:
            "Đỗ Minh Anh",
    },
];

const PAGE_SIZE = 5;

export const OperationsDeliveriesPage =
    () => {
        const [
            search,
            setSearch,
        ] = useState("");

        const [
            status,
            setStatus,
        ] = useState<
            DeliveryStatus | "ALL"
        >("ALL");

        const [
            staff,
            setStaff,
        ] = useState("ALL");

        const [
            dateFilter,
            setDateFilter,
        ] = useState("TODAY");

        const [
            page,
            setPage,
        ] = useState(1);

        const [
            modal,
            setModal,
        ] = useState<
            | "CREATE"
            | "DETAIL"
            | "SCHEDULE"
            | "ACTIVITY"
            | "ACTIONS"
            | null
        >(null);

        const [
            selected,
            setSelected,
        ] =
            useState<DeliveryRow | null>(
                null,
            );

        const filtered =
            useMemo(() => {
                const keyword =
                    search
                        .trim()
                        .toLowerCase();

                return DELIVERY_DATA.filter(
                    (item) => {
                        const matchesSearch =
                            keyword ===
                            "" ||
                            `${item.code} ${item.customer} ${item.address}`
                                .toLowerCase()
                                .includes(
                                    keyword,
                                );

                        const matchesStatus =
                            status ===
                            "ALL" ||
                            item.status ===
                            status;

                        const matchesStaff =
                            staff ===
                            "ALL" ||
                            item.staff ===
                            staff;

                        return (
                            matchesSearch &&
                            matchesStatus &&
                            matchesStaff
                        );
                    },
                );
            }, [
                search,
                status,
                staff,
                dateFilter,
            ]);

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    filtered.length /
                    PAGE_SIZE,
                ),
            );

        const safePage =
            Math.min(
                page,
                totalPages,
            );

        const visibleRows =
            filtered.slice(
                (safePage - 1) *
                PAGE_SIZE,
                safePage *
                PAGE_SIZE,
            );

        const resetFilters =
            (): void => {
                setSearch("");
                setStatus("ALL");
                setStaff("ALL");
                setDateFilter(
                    "TODAY",
                );
                setPage(1);
            };

        const openDetail = (
            item: DeliveryRow,
        ): void => {
            setSelected(item);
            setModal(
                "DETAIL",
            );
        };

        const openActions = (
            item: DeliveryRow,
        ): void => {
            setSelected(item);
            setModal(
                "ACTIONS",
            );
        };

        return (
            <main className="space-y-4">
                {/* HEADER */}
                <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-[26px] font-bold tracking-tight text-slate-950">
                            Giao thiết bị
                        </h1>

                        <p className="mt-1 text-xs text-slate-500">
                            Theo dõi lịch giao,
                            tài xế, điều phối và
                            trạng thái bàn giao
                            thiết bị.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setModal(
                                "CREATE",
                            );
                        }}
                        className="inline-flex h-10 items-center gap-2 self-start rounded-xl bg-blue-600 px-4 text-sm font-semibold !text-white shadow-sm transition hover:bg-blue-700 hover:!text-white lg:self-auto"
                    >
                        <Plus
                            size={
                                16
                            }
                        />

                        Tạo lệnh giao mới
                    </button>
                </header>

                {/* KPI */}
                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <KpiCard
                        icon={
                            CalendarDays
                        }
                        label="Lịch giao hôm nay"
                        value="12"
                        tone="BLUE"
                        sparkline="0,22 10,20 20,17 30,22 40,9 50,19 60,11 70,20 80,17 90,14 100,18 110,16 120,13"
                    />

                    <KpiCard
                        icon={
                            Truck
                        }
                        label="Đang giao"
                        value="5"
                        tone="GREEN"
                        sparkline="0,20 12,17 24,18 36,14 48,20 60,18 72,12 84,17 96,16 108,7 120,19"
                    />

                    <KpiCard
                        icon={
                            Clock3
                        }
                        label="Chờ xuất kho"
                        value="4"
                        tone="ORANGE"
                        sparkline="0,18 12,13 24,20 36,8 48,12 60,21 72,11 84,15 96,13 108,17 120,12"
                    />

                    <KpiCard
                        icon={
                            CheckCircle2
                        }
                        label="Hoàn thành"
                        value="23"
                        tone="GREEN"
                        sparkline="0,20 12,17 24,18 36,14 48,9 60,16 72,12 84,7 96,17 108,13 120,14"
                    />
                </section>

                {/* MAIN CONTENT */}
                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="min-w-0 space-y-3">
                        {/* FILTER BAR */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                            <div className="flex flex-col gap-2 xl:flex-row">
                                <label className="relative min-w-0 flex-1">
                                    <Search
                                        size={
                                            15
                                        }
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        value={
                                            search
                                        }
                                        onChange={(
                                            event,
                                        ) => {
                                            setSearch(
                                                event
                                                    .target
                                                    .value,
                                            );

                                            setPage(
                                                1,
                                            );
                                        }}
                                        placeholder="Tìm theo mã lệnh, khách hàng, địa điểm..."
                                        className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none transition focus:border-blue-500"
                                    />
                                </label>

                                <select
                                    value={
                                        status
                                    }
                                    onChange={(
                                        event,
                                    ) => {
                                        setStatus(
                                            event
                                                .target
                                                .value as
                                                DeliveryStatus |
                                                "ALL",
                                        );

                                        setPage(
                                            1,
                                        );
                                    }}
                                    className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700"
                                >
                                    <option value="ALL">
                                        Trạng thái
                                    </option>
                                    <option value="WAITING_PICKUP">
                                        Chờ lấy hàng
                                    </option>
                                    <option value="DELIVERING">
                                        Đang giao
                                    </option>
                                    <option value="COMPLETED">
                                        Hoàn thành
                                    </option>
                                    <option value="DELAYED">
                                        Trễ lịch
                                    </option>
                                </select>

                                <select
                                    value={
                                        staff
                                    }
                                    onChange={(
                                        event,
                                    ) => {
                                        setStaff(
                                            event
                                                .target
                                                .value,
                                        );

                                        setPage(
                                            1,
                                        );
                                    }}
                                    className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700"
                                >
                                    <option value="ALL">
                                        Nhân viên giao
                                    </option>
                                    <option value="Nguyễn Văn Hùng">
                                        Nguyễn Văn Hùng
                                    </option>
                                    <option value="Trần Minh Đức">
                                        Trần Minh Đức
                                    </option>
                                    <option value="Phạm Quốc Tuấn">
                                        Phạm Quốc Tuấn
                                    </option>
                                </select>

                                <select
                                    value={
                                        dateFilter
                                    }
                                    onChange={(
                                        event,
                                    ) => {
                                        setDateFilter(
                                            event
                                                .target
                                                .value,
                                        );
                                        setPage(
                                            1,
                                        );
                                    }}
                                    className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700"
                                >
                                    <option value="TODAY">
                                        Hôm nay
                                    </option>
                                    <option value="WEEK">
                                        Tuần này
                                    </option>
                                    <option value="MONTH">
                                        Tháng này
                                    </option>
                                </select>

                                <button
                                    type="button"
                                    onClick={
                                        resetFilters
                                    }
                                    className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    <RefreshCw
                                        size={
                                            13
                                        }
                                    />

                                    Làm mới
                                </button>
                            </div>
                        </section>

                        {/* TABLE CARD */}
                        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-100 px-4 py-3">
                                <h2 className="text-sm font-bold text-slate-900">
                                    Danh sách lệnh giao
                                </h2>
                            </div>

                            <div className="overflow-x-auto">
                                <div className="min-w-[820px]">
                                    <div className="grid grid-cols-[110px_1fr_1.3fr_70px_120px_100px_100px] gap-3 bg-slate-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                        <span>
                                            Mã lệnh
                                        </span>
                                        <span>
                                            Khách hàng
                                        </span>
                                        <span>
                                            Điểm giao
                                        </span>
                                        <span>
                                            Thời gian
                                        </span>
                                        <span>
                                            Nhân viên giao
                                        </span>
                                        <span>
                                            Trạng thái
                                        </span>
                                        <span className="text-right">
                                            Thao tác
                                        </span>
                                    </div>

                                    {visibleRows.map(
                                        (
                                            item,
                                        ) => (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="grid grid-cols-[110px_1fr_1.3fr_70px_120px_100px_100px] items-center gap-3 border-t border-slate-100 px-4 py-3 text-[11px] transition hover:bg-slate-50/70"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        openDetail(
                                                            item,
                                                        );
                                                    }}
                                                    className="truncate text-left font-bold text-blue-600 hover:underline"
                                                >
                                                    {
                                                        item.code
                                                    }
                                                </button>

                                                <span className="truncate font-semibold text-slate-800">
                                                    {
                                                        item.customer
                                                    }
                                                </span>

                                                <span className="truncate text-slate-600">
                                                    {
                                                        item.address
                                                    }
                                                </span>

                                                <span className="font-semibold text-slate-700">
                                                    {
                                                        item.time
                                                    }
                                                </span>

                                                <div className="flex min-w-0 items-center gap-2">
                                                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-600">
                                                        {
                                                            item.staff
                                                                .split(
                                                                    " ",
                                                                )
                                                                .slice(
                                                                    -2,
                                                                )
                                                                .map(
                                                                    (
                                                                        word,
                                                                    ) =>
                                                                        word[0],
                                                                )
                                                                .join(
                                                                    "",
                                                                )
                                                        }
                                                    </span>

                                                    <span className="truncate text-slate-700">
                                                        {
                                                            item.staff
                                                        }
                                                    </span>
                                                </div>

                                                <span
                                                    className={[
                                                        "w-fit whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-bold",
                                                        DELIVERY_STATUS_CONFIG[
                                                            item
                                                                .status
                                                            ]
                                                            .className,
                                                    ].join(
                                                        " ",
                                                    )}
                                                >
                                                    {
                                                        DELIVERY_STATUS_CONFIG[
                                                            item
                                                                .status
                                                            ]
                                                            .label
                                                    }
                                                </span>

                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            openDetail(
                                                                item,
                                                            );
                                                        }}
                                                        className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[10px] font-semibold text-blue-600 transition hover:bg-blue-50"
                                                    >
                                                        <Eye
                                                            size={
                                                                12
                                                            }
                                                        />

                                                        Chi tiết
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            openActions(
                                                                item,
                                                            );
                                                        }}
                                                        className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
                                                        aria-label={`Thêm thao tác cho ${item.code}`}
                                                    >
                                                        <MoreVertical
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>

                            <footer className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-[10px] text-slate-500">
                                    Hiển thị{" "}
                                    {(safePage -
                                            1) *
                                        PAGE_SIZE +
                                        1}{" "}
                                    đến{" "}
                                    {Math.min(
                                        safePage *
                                        PAGE_SIZE,
                                        filtered.length,
                                    )}{" "}
                                    trong tổng số{" "}
                                    {
                                        filtered.length
                                    }{" "}
                                    kết quả
                                </p>

                                <div className="flex gap-1">
                                    <button
                                        type="button"
                                        disabled={
                                            safePage ===
                                            1
                                        }
                                        onClick={() => {
                                            setPage(
                                                safePage -
                                                1,
                                            );
                                        }}
                                        className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-40"
                                    >
                                        <ChevronLeft
                                            size={
                                                13
                                            }
                                        />
                                    </button>

                                    {Array.from(
                                        {
                                            length:
                                            totalPages,
                                        },
                                        (
                                            _,
                                            index,
                                        ) =>
                                            index +
                                            1,
                                    ).map(
                                        (
                                            pageNumber,
                                        ) => (
                                            <button
                                                key={
                                                    pageNumber
                                                }
                                                type="button"
                                                onClick={() => {
                                                    setPage(
                                                        pageNumber,
                                                    );
                                                }}
                                                className={
                                                    pageNumber ===
                                                    safePage
                                                        ? "flex size-8 items-center justify-center rounded-lg bg-blue-600 text-[11px] font-bold !text-white"
                                                        : "flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600"
                                                }
                                            >
                                                {
                                                    pageNumber
                                                }
                                            </button>
                                        ),
                                    )}

                                    <button
                                        type="button"
                                        disabled={
                                            safePage ===
                                            totalPages
                                        }
                                        onClick={() => {
                                            setPage(
                                                safePage +
                                                1,
                                            );
                                        }}
                                        className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-40"
                                    >
                                        <ChevronRight
                                            size={
                                                13
                                            }
                                        />
                                    </button>
                                </div>
                            </footer>
                        </article>
                    </div>

                    {/* RIGHT COLUMN */}
                    <aside className="space-y-3">
                        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-900">
                                Lịch giao hôm nay
                            </h2>

                            <div className="mt-4 space-y-3">
                                {DELIVERY_DATA.slice(
                                    0,
                                    4,
                                ).map(
                                    (
                                        item,
                                        index,
                                    ) => (
                                        <button
                                            key={
                                                item.id
                                            }
                                            type="button"
                                            onClick={() => {
                                                openDetail(
                                                    item,
                                                );
                                            }}
                                            className="grid w-full grid-cols-[42px_16px_1fr_auto] items-start gap-2 text-left"
                                        >
                                            <span className="pt-0.5 text-[10px] font-semibold text-slate-600">
                                                {
                                                    item.time
                                                }
                                            </span>

                                            <span className="relative flex justify-center pt-1">
                                                <span className="size-2 rounded-full border-2 border-blue-500 bg-white" />

                                                {index <
                                                3 ? (
                                                    <span className="absolute top-3 h-9 w-px bg-blue-100" />
                                                ) : null}
                                            </span>

                                            <div className="min-w-0">
                                                <p className="truncate text-[11px] font-bold text-slate-800">
                                                    {
                                                        item.customer
                                                    }
                                                </p>

                                                <p className="mt-0.5 truncate text-[9px] text-slate-400">
                                                    {
                                                        item.address
                                                    }
                                                </p>
                                            </div>

                                            <span
                                                className={[
                                                    "rounded-full px-2 py-1 text-[8px] font-bold",
                                                    DELIVERY_STATUS_CONFIG[
                                                        item
                                                            .status
                                                        ]
                                                        .className,
                                                ].join(
                                                    " ",
                                                )}
                                            >
                                                {
                                                    DELIVERY_STATUS_CONFIG[
                                                        item
                                                            .status
                                                        ]
                                                        .label
                                                }
                                            </span>
                                        </button>
                                    ),
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setModal(
                                        "SCHEDULE",
                                    );
                                }}
                                className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700"
                            >
                                Xem tất cả lịch giao

                                <ChevronRight
                                    size={
                                        12
                                    }
                                />
                            </button>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-900">
                                Hiệu suất đội giao
                            </h2>

                            <div className="mt-3 grid grid-cols-3 gap-2">
                                <Performance
                                    label="Đúng giờ"
                                    value="92%"
                                    helper="+6%"
                                    positive
                                />

                                <Performance
                                    label="Bàn giao thành công"
                                    value="18"
                                    helper="+3"
                                    positive
                                />

                                <Performance
                                    label="Sự cố"
                                    value="1"
                                    helper="-1"
                                />
                            </div>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-900">
                                Hoạt động gần đây
                            </h2>

                            <div className="mt-3 space-y-3">
                                {RECENT_ACTIVITIES.map(
                                    (
                                        item,
                                    ) => (
                                        <ActivityLine
                                            key={
                                                item.id
                                            }
                                            item={
                                                item
                                            }
                                        />
                                    ),
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setModal(
                                        "ACTIVITY",
                                    );
                                }}
                                className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700"
                            >
                                Xem tất cả hoạt động

                                <ChevronRight
                                    size={
                                        12
                                    }
                                />
                            </button>
                        </article>
                    </aside>
                </section>

                {/* MODALS */}
                {modal && (
                    <Modal
                        title={
                            modal ===
                            "CREATE"
                                ? "Tạo lệnh giao mới"
                                : modal ===
                                "DETAIL"
                                    ? "Chi tiết lệnh giao"
                                    : modal ===
                                    "SCHEDULE"
                                        ? "Tất cả lịch giao"
                                        : modal ===
                                        "ACTIVITY"
                                            ? "Tất cả hoạt động"
                                            : "Thao tác lệnh giao"
                        }
                        size={
                            modal ===
                            "ACTIVITY"
                                ? "LARGE"
                                : "DEFAULT"
                        }
                        onClose={() => {
                            setModal(
                                null,
                            );
                        }}
                    >
                        {modal ===
                        "CREATE" ? (
                            <CreateDeliveryForm
                                onDone={() => {
                                    setModal(
                                        null,
                                    );
                                }}
                            />
                        ) : modal ===
                        "DETAIL" &&
                        selected ? (
                            <DeliveryDetail
                                item={
                                    selected
                                }
                            />
                        ) : modal ===
                        "SCHEDULE" ? (
                            <ScheduleList
                                onSelect={(
                                    item,
                                ) => {
                                    setSelected(
                                        item,
                                    );
                                    setModal(
                                        "DETAIL",
                                    );
                                }}
                            />
                        ) : modal ===
                        "ACTIVITY" ? (
                            <ActivityList />
                        ) : selected ? (
                            <ActionMenu
                                item={
                                    selected
                                }
                                onDetail={() => {
                                    setModal(
                                        "DETAIL",
                                    );
                                }}
                            />
                        ) : null}
                    </Modal>
                )}
            </main>
        );
    };

const KpiCard = ({
                     icon: Icon,
                     label,
                     value,
                     tone,
                     sparkline,
                 }: {
    icon: LucideIcon;
    label: string;
    value: string;
    tone:
        | "BLUE"
        | "GREEN"
        | "ORANGE";
    sparkline: string;
}) => {
    const config = {
        BLUE: {
            icon:
                "bg-blue-50 text-blue-600",
            line:
                "stroke-blue-500",
        },
        GREEN: {
            icon:
                "bg-emerald-50 text-emerald-600",
            line:
                "stroke-emerald-500",
        },
        ORANGE: {
            icon:
                "bg-orange-50 text-orange-600",
            line:
                "stroke-orange-500",
        },
    }[tone];

    return (
        <article className="flex min-h-[92px] items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span
                className={[
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    config.icon,
                ].join(" ")}
            >
                <Icon
                    size={
                        18
                    }
                />
            </span>

            <div className="ml-3 min-w-0">
                <p className="truncate text-[11px] font-medium text-slate-500">
                    {label}
                </p>

                <p className="mt-1 text-[22px] font-bold leading-none text-slate-950">
                    {value}
                </p>
            </div>

            <svg
                viewBox="0 0 120 30"
                preserveAspectRatio="none"
                className="ml-auto h-8 w-20 shrink-0"
                aria-hidden="true"
            >
                <polyline
                    points={
                        sparkline
                    }
                    fill="none"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={
                        config.line
                    }
                />
            </svg>
        </article>
    );
};

const Performance = ({
                         label,
                         value,
                         helper,
                         positive = false,
                     }: {
    label: string;
    value: string;
    helper: string;
    positive?: boolean;
}) => (
    <div className="rounded-xl border border-slate-100 p-2.5">
        <p className="min-h-6 text-[8px] leading-3 text-slate-400">
            {label}
        </p>

        <div className="mt-1 flex items-end gap-1">
            <p className="text-lg font-bold leading-none text-slate-950">
                {value}
            </p>

            <span
                className={
                    positive
                        ? "text-[8px] font-bold text-emerald-600"
                        : "text-[8px] font-bold text-rose-600"
                }
            >
                {helper}
            </span>
        </div>
    </div>
);

const ActivityLine = ({
                          item,
                      }: {
    item: RecentActivity;
}) => {
    const Icon =
        item.icon;

    const toneClass = {
        GREEN:
            "bg-emerald-50 text-emerald-600",
        BLUE:
            "bg-blue-50 text-blue-600",
        ORANGE:
            "bg-orange-50 text-orange-600",
    }[item.tone];

    return (
        <div className="flex items-start gap-2">
            <span
                className={[
                    "flex size-7 shrink-0 items-center justify-center rounded-full",
                    toneClass,
                ].join(" ")}
            >
                <Icon
                    size={
                        13
                    }
                />
            </span>

            <div className="min-w-0">
                <p className="text-[10px] font-semibold leading-4 text-slate-800">
                    {
                        item.title
                    }
                </p>

                <p className="mt-0.5 text-[9px] text-slate-400">
                    {
                        item.meta
                    }
                </p>
            </div>
        </div>
    );
};

const Modal = ({
                   title,
                   onClose,
                   children,
                   size = "DEFAULT",
               }: {
    title: string;
    onClose: () => void;
    children: ReactNode;
    size?: "DEFAULT" | "LARGE";
}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
        <div
            className={[
                "w-full rounded-2xl bg-white p-5 shadow-xl",
                size === "LARGE"
                    ? "max-w-3xl"
                    : "max-w-lg",
            ].join(" ")}
        >
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-base font-bold text-slate-950">
                        {title}
                    </h2>

                    {size === "LARGE" ? (
                        <p className="mt-1 text-xs text-slate-400">
                            Theo dõi toàn bộ lịch sử thao tác và thay đổi trạng thái giao thiết bị.
                        </p>
                    ) : null}
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg transition hover:bg-slate-100"
                >
                    <X size={16} />
                </button>
            </div>

            {children}
        </div>
    </div>
);

const CreateDeliveryForm = ({
                                onDone,
                            }: {
    onDone: () => void;
}) => {
    const [
        customerId,
        setCustomerId,
    ] = useState(
        CUSTOMER_OPTIONS[0].id,
    );

    const [
        address,
        setAddress,
    ] = useState(
        CUSTOMER_OPTIONS[0].address,
    );

    const [
        staffName,
        setStaffName,
    ] = useState(
        "Nguyễn Văn Hùng",
    );

    const [
        equipmentCount,
        setEquipmentCount,
    ] = useState("4");

    const selectedCustomer =
        CUSTOMER_OPTIONS.find(
            (item) =>
                item.id ===
                customerId,
        ) ??
        CUSTOMER_OPTIONS[0];

    const handleCustomerChange = (
        value: string,
    ): void => {
        setCustomerId(
            value,
        );

        const customer =
            CUSTOMER_OPTIONS.find(
                (item) =>
                    item.id ===
                    value,
            );

        if (customer) {
            setAddress(
                customer.address,
            );
        }
    };

    return (
        <form
            onSubmit={(
                event,
            ) => {
                event.preventDefault();

                window.alert(
                    `Đã tạo lệnh giao cho ${selectedCustomer.name}.\nNhân viên giao: ${staffName}`,
                );

                onDone();
            }}
            className="space-y-4"
        >
            <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Khách hàng
                </label>

                <select
                    value={
                        customerId
                    }
                    onChange={(
                        event,
                    ) => {
                        handleCustomerChange(
                            event
                                .target
                                .value,
                        );
                    }}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500"
                >
                    {CUSTOMER_OPTIONS.map(
                        (
                            customer,
                        ) => (
                            <option
                                key={
                                    customer.id
                                }
                                value={
                                    customer.id
                                }
                            >
                                {
                                    customer.name
                                }{" "}
                                — Người liên hệ:{" "}
                                {
                                    customer.contact
                                }
                            </option>
                        ),
                    )}
                </select>

                <p className="mt-1 text-[11px] text-slate-400">
                    Người liên hệ:{" "}
                    {
                        selectedCustomer.contact
                    }
                </p>
            </div>

            <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Địa chỉ giao
                </label>

                <input
                    required
                    value={
                        address
                    }
                    onChange={(
                        event,
                    ) => {
                        setAddress(
                            event
                                .target
                                .value,
                        );
                    }}
                    placeholder="Nhập địa chỉ giao"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500"
                />

                <p className="mt-1 text-[11px] text-slate-400">
                    Tự động điền theo khách hàng, có thể chỉnh sửa nếu địa điểm giao khác.
                </p>
            </div>

            <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Nhân viên giao
                </label>

                <select
                    value={
                        staffName
                    }
                    onChange={(
                        event,
                    ) => {
                        setStaffName(
                            event
                                .target
                                .value,
                        );
                    }}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500"
                >
                    <option value="Nguyễn Văn Hùng">
                        Nguyễn Văn Hùng — Nhân viên giao
                    </option>

                    <option value="Trần Minh Đức">
                        Trần Minh Đức — Nhân viên giao
                    </option>

                    <option value="Phạm Quốc Tuấn">
                        Phạm Quốc Tuấn — Nhân viên giao
                    </option>
                </select>

                <p className="mt-1 text-[11px] text-slate-400">
                    Chọn nhân viên chịu trách nhiệm giao và bàn giao thiết bị.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Ngày giờ giao
                    </label>

                    <input
                        type="datetime-local"
                        required
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Số thiết bị
                    </label>

                    <input
                        type="number"
                        min="1"
                        required
                        value={
                            equipmentCount
                        }
                        onChange={(
                            event,
                        ) => {
                            setEquipmentCount(
                                event
                                    .target
                                    .value,
                            );
                        }}
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    Ghi chú
                </label>

                <textarea
                    rows={
                        3
                    }
                    placeholder="Ví dụ: liên hệ khách trước 30 phút, giao tại sảnh B..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-blue-500"
                />
            </div>

            <button
                type="submit"
                className="h-10 w-full rounded-xl bg-blue-600 text-sm font-bold !text-white transition hover:bg-blue-700"
            >
                Tạo lệnh giao
            </button>
        </form>
    );
};

const DeliveryDetail = ({
                            item,
                        }: {
    item: DeliveryRow;
}) => (
    <div className="space-y-3">
        <Info
            label="Mã lệnh"
            value={
                item.code
            }
        />

        <Info
            label="Khách hàng"
            value={
                item.customer
            }
        />

        <Info
            label="Điểm giao"
            value={
                item.address
            }
        />

        <Info
            label="Thời gian"
            value={
                item.time
            }
        />

        <Info
            label="Nhân viên"
            value={
                item.staff
            }
        />

        <Info
            label="Số thiết bị"
            value={`${item.equipmentCount} thiết bị`}
        />

        <Info
            label="Trạng thái"
            value={
                DELIVERY_STATUS_CONFIG[
                    item
                        .status
                    ].label
            }
        />

        <div className="grid grid-cols-2 gap-2 pt-2">
            <button
                type="button"
                onClick={() => {
                    window.alert(
                        "Đã bắt đầu giao.",
                    );
                }}
                className="h-9 rounded-xl bg-blue-600 text-xs font-bold !text-white"
            >
                Bắt đầu giao
            </button>

            <button
                type="button"
                onClick={() => {
                    window.alert(
                        "Đã xác nhận giao thành công.",
                    );
                }}
                className="h-9 rounded-xl bg-emerald-600 text-xs font-bold !text-white"
            >
                Hoàn thành
            </button>
        </div>
    </div>
);

const ScheduleList = ({
                          onSelect,
                      }: {
    onSelect: (
        item: DeliveryRow,
    ) => void;
}) => (
    <div className="max-h-[440px] space-y-2 overflow-y-auto pr-1">
        {DELIVERY_DATA.map(
            (
                item,
            ) => (
                <button
                    key={
                        item.id
                    }
                    type="button"
                    onClick={() => {
                        onSelect(
                            item,
                        );
                    }}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:bg-slate-50"
                >
                    <span className="w-12 text-xs font-bold text-slate-700">
                        {
                            item.time
                        }
                    </span>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-900">
                            {
                                item.customer
                            }
                        </p>

                        <p className="mt-0.5 truncate text-[10px] text-slate-400">
                            {
                                item.address
                            }
                        </p>
                    </div>

                    <span
                        className={[
                            "rounded-full px-2 py-1 text-[9px] font-bold",
                            DELIVERY_STATUS_CONFIG[
                                item
                                    .status
                                ]
                                .className,
                        ].join(
                            " ",
                        )}
                    >
                        {
                            DELIVERY_STATUS_CONFIG[
                                item
                                    .status
                                ]
                                .label
                        }
                    </span>
                </button>
            ),
        )}
    </div>
);

const ActivityList = () => {
    const activities = [
        ...RECENT_ACTIVITIES,
        {
            id: "activity-4",
            icon: CheckCircle2,
            title: "Xác nhận xuất kho DG-2026-019",
            meta: "07:55 • Kho Hà Nội",
            tone: "GREEN" as const,
        },
        {
            id: "activity-5",
            icon: Truck,
            title: "Điều phối Nguyễn Văn Hùng cho DG-2026-017",
            meta: "07:40 • Lê Văn Vận Hành",
            tone: "BLUE" as const,
        },
        {
            id: "activity-6",
            icon: PackageCheck,
            title: "Chuẩn bị đủ 6 thiết bị cho DG-2026-016",
            meta: "07:20 • Kho Hà Nội",
            tone: "ORANGE" as const,
        },
        {
            id: "activity-7",
            icon: CheckCircle2,
            title: "Hoàn thành checklist DG-2026-015",
            meta: "06:55 • Trần Minh Đức",
            tone: "GREEN" as const,
        },
        {
            id: "activity-8",
            icon: Truck,
            title: "Cập nhật thời gian giao DG-2026-014",
            meta: "06:40 • Lê Văn Vận Hành",
            tone: "BLUE" as const,
        },
    ];

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-[44px_minmax(0,1fr)_170px] gap-3 bg-slate-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                <span />
                <span>Hoạt động</span>
                <span>Thời gian / Người thực hiện</span>
            </div>

            <div className="max-h-[520px] overflow-y-auto">
                {activities.map((item) => {
                    const Icon = item.icon;

                    const toneClass = {
                        GREEN: "bg-emerald-50 text-emerald-600",
                        BLUE: "bg-blue-50 text-blue-600",
                        ORANGE: "bg-orange-50 text-orange-600",
                    }[item.tone];

                    const [time, actor] = item.meta.split(" • ");

                    return (
                        <div
                            key={item.id}
                            className="grid grid-cols-[44px_minmax(0,1fr)_170px] items-center gap-3 border-t border-slate-100 px-4 py-3 transition first:border-t-0 hover:bg-slate-50/70"
                        >
                            <span
                                className={[
                                    "flex size-8 items-center justify-center rounded-xl",
                                    toneClass,
                                ].join(" ")}
                            >
                                <Icon size={14} />
                            </span>

                            <p className="text-sm font-semibold text-slate-900">
                                {item.title}
                            </p>

                            <div>
                                <p className="text-xs font-semibold text-slate-700">
                                    {time}
                                </p>

                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    {actor}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const ActionMenu = ({
                        item,
                        onDetail,
                    }: {
    item: DeliveryRow;
    onDetail: () => void;
}) => (
    <div className="space-y-2">
        <button
            type="button"
            onClick={
                onDetail
            }
            className="flex h-10 w-full items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
            <Eye
                size={
                    15
                }
            />

            Xem chi tiết
        </button>

        <button
            type="button"
            onClick={() => {
                window.alert(
                    `Bắt đầu giao ${item.code}`,
                );
            }}
            className="flex h-10 w-full items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
            <Truck
                size={
                    15
                }
            />

            Bắt đầu giao
        </button>

        <button
            type="button"
            onClick={() => {
                window.alert(
                    `Đánh dấu ${item.code} hoàn thành`,
                );
            }}
            className="flex h-10 w-full items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
            <CheckCircle2
                size={
                    15
                }
            />

            Xác nhận hoàn thành
        </button>
    </div>
);

const Info = ({
                  label,
                  value,
              }: {
    label: string;
    value: string;
}) => (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2 text-sm">
        <span className="text-slate-500">
            {label}
        </span>

        <span className="text-right font-semibold text-slate-800">
            {value}
        </span>
    </div>
);
