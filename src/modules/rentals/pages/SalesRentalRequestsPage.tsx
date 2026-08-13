import type {
    LucideIcon,
} from "lucide-react";

import {
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    Clock3,
    Eye,
    Filter,
    PackagePlus,
    RefreshCw,
    Search,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router";

type RentalRequestStatus =
    | "NEW"
    | "PROCESSING"
    | "QUOTED"
    | "COMPLETED"
    | "CANCELLED";

type RentalRequestPriority =
    | "HIGH"
    | "MEDIUM"
    | "LOW";

interface SalesRentalRequestItem {
    id: string;
    requestCode: string;
    customerName: string;
    contactName: string;
    contactPhone: string;
    equipmentCount: number;
    equipmentTypes: number;
    requestedDate: string;
    requestedTime: string;
    status: RentalRequestStatus;
    priority: RentalRequestPriority;
}

interface EquipmentRankingItem {
    id: string;
    name: string;
    requestCount: number;
}

const RENTAL_REQUEST_MOCKS:
    SalesRentalRequestItem[] = [
    {
        id: "request-001",
        requestCode: "REQ-2026-028",
        customerName: "Công ty ABC",
        contactName: "Nguyễn Văn A",
        contactPhone: "0901 234 567",
        equipmentCount: 12,
        equipmentTypes: 3,
        requestedDate: "12/08/2026",
        requestedTime: "10:30",
        status: "NEW",
        priority: "HIGH",
    },
    {
        id: "request-002",
        requestCode: "REQ-2026-027",
        customerName: "Công ty XYZ",
        contactName: "Trần Thị B",
        contactPhone: "0902 345 678",
        equipmentCount: 25,
        equipmentTypes: 5,
        requestedDate: "12/08/2026",
        requestedTime: "09:15",
        status: "PROCESSING",
        priority: "HIGH",
    },
    {
        id: "request-003",
        requestCode: "REQ-2026-026",
        customerName: "Công ty DEF",
        contactName: "Lê Văn C",
        contactPhone: "0903 456 789",
        equipmentCount: 8,
        equipmentTypes: 2,
        requestedDate: "11/08/2026",
        requestedTime: "16:45",
        status: "PROCESSING",
        priority: "MEDIUM",
    },
    {
        id: "request-004",
        requestCode: "REQ-2026-025",
        customerName: "Công ty GHI",
        contactName: "Phạm Thị D",
        contactPhone: "0904 567 890",
        equipmentCount: 15,
        equipmentTypes: 3,
        requestedDate: "11/08/2026",
        requestedTime: "14:20",
        status: "QUOTED",
        priority: "MEDIUM",
    },
    {
        id: "request-005",
        requestCode: "REQ-2026-024",
        customerName: "Cty Sự kiện Việt",
        contactName: "Hoàng Minh Khang",
        contactPhone: "0905 112 233",
        equipmentCount: 40,
        equipmentTypes: 6,
        requestedDate: "10/08/2026",
        requestedTime: "11:10",
        status: "COMPLETED",
        priority: "LOW",
    },
    {
        id: "request-006",
        requestCode: "REQ-2026-023",
        customerName: "Công ty Minh Phát",
        contactName: "Nguyễn Thanh Tùng",
        contactPhone: "0906 223 344",
        equipmentCount: 10,
        equipmentTypes: 2,
        requestedDate: "09/08/2026",
        requestedTime: "15:30",
        status: "CANCELLED",
        priority: "LOW",
    },
];

const EQUIPMENT_RANKINGS:
    EquipmentRankingItem[] = [
    {
        id: "equipment-001",
        name: "Loa Array JBL VTX A8",
        requestCount: 18,
    },
    {
        id: "equipment-002",
        name: "Đèn Beam 450W",
        requestCount: 16,
    },
    {
        id: "equipment-003",
        name: "Màn hình LED P3",
        requestCount: 12,
    },
    {
        id: "equipment-004",
        name: "Micro Shure Axient",
        requestCount: 10,
    },
    {
        id: "equipment-005",
        name: "Máy phát điện 100kVA",
        requestCount: 8,
    },
];

const STATUS_CONFIG: Record<
    RentalRequestStatus,
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
    QUOTED: {
        label: "Báo giá",
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

const PRIORITY_CONFIG: Record<
    RentalRequestPriority,
    {
        label: string;
        dot: string;
    }
> = {
    HIGH: {
        label: "Cao",
        dot: "bg-rose-500",
    },
    MEDIUM: {
        label: "Trung bình",
        dot: "bg-orange-500",
    },
    LOW: {
        label: "Thấp",
        dot: "bg-emerald-500",
    },
};

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

interface KpiCardProps {
    title: string;
    value: number;
    description: string;
    icon: LucideIcon;
    iconClassName: string;
    lineColor: string;
    points: string;
}

const KpiCard = ({
                     title,
                     value,
                     description,
                     icon: Icon,
                     iconClassName,
                     lineColor,
                     points,
                 }: KpiCardProps) => {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-5">
                <div className="flex min-w-0 items-start gap-4">
                    <span
                        className={[
                            "flex size-12 shrink-0 items-center justify-center rounded-2xl",
                            iconClassName,
                        ].join(" ")}
                    >
                        <Icon
                            size={23}
                            aria-hidden="true"
                        />
                    </span>

                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            {title}
                        </p>

                        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                            {value}
                        </p>

                        <p className="mt-2 text-xs font-semibold text-emerald-600">
                            {description}
                        </p>
                    </div>
                </div>

                <svg
                    viewBox="0 0 120 40"
                    className="hidden h-12 w-28 shrink-0 sm:block"
                    aria-hidden="true"
                >
                    <polyline
                        points={points}
                        fill="none"
                        stroke={lineColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </article>
    );
};

interface LegendItemProps {
    color: string;
    label: string;
    value: string;
}

const LegendItem = ({
                        color,
                        label,
                        value,
                    }: LegendItemProps) => {
    return (
        <div className="flex items-center gap-3">
            <span
                className={[
                    "size-2.5 shrink-0 rounded-sm",
                    color,
                ].join(" ")}
            />

            <span className="flex-1 text-xs font-medium text-slate-600">
                {label}
            </span>

            <span className="text-xs font-semibold text-slate-500">
                {value}
            </span>
        </div>
    );
};

export const SalesRentalRequestsPage =
    () => {
        const [
            searchTerm,
            setSearchTerm,
        ] = useState("");

        const [
            statusFilter,
            setStatusFilter,
        ] = useState<
            RentalRequestStatus | "ALL"
        >("ALL");

        const filteredRequests =
            useMemo(() => {
                const keyword =
                    normalizeSearch(
                        searchTerm,
                    );

                return RENTAL_REQUEST_MOCKS.filter(
                    (request) => {
                        const searchable =
                            normalizeSearch(
                                [
                                    request.requestCode,
                                    request.customerName,
                                    request.contactName,
                                    request.contactPhone,
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
                            request.status ===
                            statusFilter;

                        return (
                            matchesSearch &&
                            matchesStatus
                        );
                    },
                );
            }, [
                searchTerm,
                statusFilter,
            ]);

        const resetFilters =
            (): void => {
                setSearchTerm("");
                setStatusFilter("ALL");
            };

        return (
            <main className="space-y-5">
                {/* HEADER */}
                <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                            Yêu cầu thuê
                        </h1>

                        <p className="mt-1.5 text-sm text-slate-500">
                            Tạo và quản lý các yêu
                            cầu thuê thiết bị một
                            cách hiệu quả.
                        </p>
                    </div>

                    <Link
                        to="/sales/rental-requests/create"
                        className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 lg:self-auto"
                    >
                        <PackagePlus
                            size={18}
                            aria-hidden="true"
                        />

                        Tạo yêu cầu thuê mới
                    </Link>
                </header>

                {/* KPI */}
                <section className="grid gap-4 lg:grid-cols-3">
                    <KpiCard
                        title="Yêu cầu mới"
                        value={8}
                        description="+2 so với tuần trước"
                        icon={PackagePlus}
                        iconClassName="bg-blue-50 text-blue-600"
                        lineColor="#2563eb"
                        points="0,31 10,30 20,34 30,23 40,32 50,22 60,28 70,20 80,9 90,29 100,15 110,27 120,18"
                    />

                    <KpiCard
                        title="Đang xử lý"
                        value={12}
                        description="+3 so với tuần trước"
                        icon={Clock3}
                        iconClassName="bg-orange-50 text-orange-600"
                        lineColor="#f97316"
                        points="0,29 10,27 20,32 30,26 40,30 50,20 60,23 70,13 80,18 90,12 100,23 110,28 120,8"
                    />

                    <KpiCard
                        title="Hoàn thành"
                        value={6}
                        description="+1 so với tuần trước"
                        icon={CheckCircle2}
                        iconClassName="bg-violet-50 text-violet-600"
                        lineColor="#8b5cf6"
                        points="0,32 10,27 20,20 30,25 40,24 50,16 60,27 70,25 80,13 90,9 100,27 110,16 120,28"
                    />
                </section>

                {/* FILTER */}
                <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex flex-col gap-3 xl:flex-row">
                        <label className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                aria-hidden="true"
                            />

                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(event) => {
                                    setSearchTerm(
                                        event.target.value,
                                    );
                                }}
                                placeholder="Tìm theo mã yêu cầu, khách hàng, người liên hệ..."
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </label>

                        <select
                            value={statusFilter}
                            onChange={(event) => {
                                setStatusFilter(
                                    event.target
                                        .value as
                                        | RentalRequestStatus
                                        | "ALL",
                                );
                            }}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 xl:w-[210px]"
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

                            <option value="QUOTED">
                                Báo giá
                            </option>

                            <option value="COMPLETED">
                                Hoàn thành
                            </option>

                            <option value="CANCELLED">
                                Đã hủy
                            </option>
                        </select>

                        <button
                            type="button"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            <CalendarDays
                                size={17}
                                aria-hidden="true"
                            />

                            01/08/2026 - 12/08/2026
                        </button>

                        <button
                            type="button"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            <Filter
                                size={17}
                                aria-hidden="true"
                            />

                            Bộ lọc
                        </button>

                        <button
                            type="button"
                            onClick={resetFilters}
                            aria-label="Đặt lại bộ lọc"
                            title="Đặt lại bộ lọc"
                            className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                            <RefreshCw
                                size={17}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </section>

                {/* MAIN CONTENT */}
                <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
                    {/* REQUEST TABLE */}
                    <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <header className="border-b border-slate-100 px-5 py-4">
                            <h2 className="text-base font-bold text-slate-950">
                                Danh sách yêu cầu thuê
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Tìm thấy{" "}
                                {
                                    filteredRequests.length
                                }{" "}
                                yêu cầu gần đây
                            </p>
                        </header>

                        <div className="overflow-x-auto">
                            <div className="min-w-[850px]">
                                <div className="grid grid-cols-[120px_minmax(180px,1fr)_125px_125px_110px_105px_65px] gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-3 text-xs font-semibold text-slate-500">
                                    <span>Mã yêu cầu</span>
                                    <span>Khách hàng</span>
                                    <span>Thiết bị</span>
                                    <span>Ngày yêu cầu</span>
                                    <span>Trạng thái</span>
                                    <span>Ưu tiên</span>
                                    <span className="text-right">
                                        Thao tác
                                    </span>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {filteredRequests.map(
                                        (request) => {
                                            const status =
                                                STATUS_CONFIG[
                                                    request.status
                                                    ];

                                            const priority =
                                                PRIORITY_CONFIG[
                                                    request.priority
                                                    ];

                                            return (
                                                <div
                                                    key={request.id}
                                                    className="grid grid-cols-[120px_minmax(180px,1fr)_125px_125px_110px_105px_65px] items-center gap-3 px-5 py-4 transition hover:bg-slate-50/70"
                                                >
                                                    <Link
                                                        to={`/sales/rental-requests/${request.id}`}
                                                        className="text-xs font-bold text-blue-600 transition hover:text-blue-700 hover:underline"
                                                    >
                                                        {
                                                            request.requestCode
                                                        }
                                                    </Link>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-bold text-slate-900">
                                                            {
                                                                request.customerName
                                                            }
                                                        </p>

                                                        <p className="mt-1 truncate text-xs text-slate-500">
                                                            {
                                                                request.contactName
                                                            }
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-slate-400">
                                                            {
                                                                request.contactPhone
                                                            }
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {
                                                                request.equipmentCount
                                                            }{" "}
                                                            thiết bị
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {
                                                                request.equipmentTypes
                                                            }{" "}
                                                            loại
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-medium text-slate-700">
                                                            {
                                                                request.requestedDate
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            {
                                                                request.requestedTime
                                                            }
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <span
                                                            className={[
                                                                "inline-flex whitespace-nowrap rounded-lg border px-2.5 py-1 text-[11px] font-bold",
                                                                status.className,
                                                            ].join(" ")}
                                                        >
                                                            {
                                                                status.label
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className={[
                                                                "size-2 shrink-0 rounded-full",
                                                                priority.dot,
                                                            ].join(" ")}
                                                        />

                                                        <span className="whitespace-nowrap text-xs font-medium text-slate-600">
                                                            {
                                                                priority.label
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="flex justify-end">
                                                        <Link
                                                            to={`/sales/rental-requests/${request.id}`}
                                                            aria-label={`Xem chi tiết ${request.requestCode}`}
                                                            title="Xem chi tiết"
                                                            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                                        >
                                                            <Eye
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        </Link>
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}

                                    {filteredRequests.length ===
                                        0 && (
                                            <div className="px-6 py-16 text-center">
                                                <Search
                                                    size={34}
                                                    className="mx-auto text-slate-300"
                                                />

                                                <p className="mt-3 text-sm font-bold text-slate-700">
                                                    Không tìm thấy
                                                    yêu cầu thuê
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Hãy thử thay
                                                    đổi từ khóa
                                                    hoặc bộ lọc.
                                                </p>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>

                        <footer className="border-t border-slate-100 bg-slate-50/40 px-5 py-3 text-center">
                            <Link
                                to="/sales/rental-requests/all"
                                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                                Xem tất cả yêu cầu

                                <ChevronRight
                                    size={15}
                                    aria-hidden="true"
                                />
                            </Link>
                        </footer>
                    </article>

                    {/* RIGHT COLUMN */}
                    <div className="min-w-0 space-y-5">
                        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="text-base font-bold text-slate-950">
                                Phân bố trạng thái
                            </h2>

                            <div className="mt-5 flex flex-col items-center gap-6 2xl:flex-row">
                                <div
                                    className="relative flex size-40 shrink-0 items-center justify-center rounded-full"
                                    style={{
                                        background:
                                            "conic-gradient(#2563eb 0% 25%, #f97316 25% 62.5%, #7c3aed 62.5% 75%, #10b981 75% 93.75%, #f43f5e 93.75% 100%)",
                                    }}
                                >
                                    <div className="flex size-28 flex-col items-center justify-center rounded-full bg-white">
                                        <p className="text-3xl font-bold text-slate-950">
                                            32
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Tổng yêu cầu
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full space-y-3">
                                    <LegendItem
                                        color="bg-blue-600"
                                        label="Mới"
                                        value="8 (25%)"
                                    />

                                    <LegendItem
                                        color="bg-orange-500"
                                        label="Đang xử lý"
                                        value="12 (37.5%)"
                                    />

                                    <LegendItem
                                        color="bg-violet-600"
                                        label="Báo giá"
                                        value="4 (12.5%)"
                                    />

                                    <LegendItem
                                        color="bg-emerald-500"
                                        label="Hoàn thành"
                                        value="6 (18.8%)"
                                    />

                                    <LegendItem
                                        color="bg-rose-500"
                                        label="Đã hủy"
                                        value="2 (6.2%)"
                                    />
                                </div>
                            </div>
                        </article>

                        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <header className="border-b border-slate-100 px-5 py-4">
                                <h2 className="text-base font-bold text-slate-950">
                                    Thiết bị được yêu cầu
                                    nhiều nhất
                                </h2>
                            </header>

                            <div className="divide-y divide-slate-100 px-5">
                                {EQUIPMENT_RANKINGS.map(
                                    (
                                        equipment,
                                        index,
                                    ) => (
                                        <div
                                            key={
                                                equipment.id
                                            }
                                            className="flex items-center gap-3 py-3.5"
                                        >
                                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                                                {index + 1}
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    {
                                                        equipment.name
                                                    }
                                                </p>
                                            </div>

                                            <span className="shrink-0 text-xs font-medium text-slate-500">
                                                {
                                                    equipment.requestCount
                                                }{" "}
                                                yêu cầu
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>

                            <footer className="border-t border-slate-100 bg-slate-50/40 px-5 py-3 text-center">
                                <Link
                                    to="/sales/rental-requests/equipment"
                                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
                                >
                                    Xem tất cả thiết bị

                                    <ChevronRight
                                        size={15}
                                        aria-hidden="true"
                                    />
                                </Link>
                            </footer>
                        </article>
                    </div>
                </section>
            </main>
        );
    };