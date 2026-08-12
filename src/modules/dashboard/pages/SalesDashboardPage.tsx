import type {
    LucideIcon,
} from "lucide-react";

import {
    ArrowUpRight,
    Building2,
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    ClipboardCheck,
    Clock3,
    FileText,
    Handshake,
    Mail,
    PackageCheck,
    Phone,
    Target,
    TrendingUp,
    Users,
} from "lucide-react";

/* =========================================================
 * TYPES
 * ========================================================= */

type StatTone =
    | "BLUE"
    | "GREEN"
    | "PURPLE"
    | "ORANGE"
    | "ROSE"
    | "CYAN";

type TaskPriority =
    | "HIGH"
    | "MEDIUM"
    | "LOW";

type LeadStatus =
    | "NEW"
    | "INTERESTED"
    | "NEGOTIATING";

type ActivityType =
    | "RENTAL_REQUEST"
    | "QUOTATION"
    | "RENTAL_ORDER"
    | "CONTRACT";

interface DashboardStat {
    id: string;
    label: string;
    value: string;
    change: number;
    comparison: string;
    icon: LucideIcon;
    tone: StatTone;
}

interface RevenuePoint {
    date: string;
    revenue: number;
}

interface SalesTask {
    id: string;
    title: string;
    description: string;
    time: string;
    priority: TaskPriority;
    icon: LucideIcon;
}

interface RecentActivity {
    id: string;
    type: ActivityType;
    label: string;
    code: string;
    customerName: string;
    timeAgo: string;
}

interface PotentialCustomer {
    id: string;
    companyName: string;
    contactName: string;
    phone: string;
    potentialValue: number;
    status: LeadStatus;
}

/* =========================================================
 * MOCK DATA
 * ========================================================= */

const DASHBOARD_STATS: DashboardStat[] = [
    {
        id: "rental-request",
        label: "Yêu cầu thuê",
        value: "19",
        change: 8,
        comparison: "so với hôm qua",
        icon: PackageCheck,
        tone: "BLUE",
    },
    {
        id: "quotation",
        label: "Báo giá",
        value: "28",
        change: 12,
        comparison: "so với hôm qua",
        icon: FileText,
        tone: "PURPLE",
    },
    {
        id: "rental-order",
        label: "Đơn thuê",
        value: "15",
        change: 14,
        comparison: "so với hôm qua",
        icon: ClipboardCheck,
        tone: "GREEN",
    },
    {
        id: "contract",
        label: "Hợp đồng",
        value: "8",
        change: 10,
        comparison: "so với hôm qua",
        icon: Handshake,
        tone: "CYAN",
    },
    {
        id: "revenue",
        label: "Doanh số tháng",
        value: "256.8M",
        change: 18,
        comparison: "so với tháng trước",
        icon: CircleDollarSign,
        tone: "ORANGE",
    },
    {
        id: "conversion",
        label: "Tỷ lệ chốt đơn",
        value: "35.2%",
        change: 5,
        comparison: "so với tháng trước",
        icon: Target,
        tone: "ROSE",
    },
];

const REVENUE_DATA: RevenuePoint[] = [
    {
        date: "02/08",
        revenue: 12000000,
    },
    {
        date: "03/08",
        revenue: 21000000,
    },
    {
        date: "04/08",
        revenue: 29000000,
    },
    {
        date: "05/08",
        revenue: 30000000,
    },
    {
        date: "06/08",
        revenue: 47000000,
    },
    {
        date: "07/08",
        revenue: 56000000,
    },
    {
        date: "08/08",
        revenue: 64200000,
    },
];

const TASKS: SalesTask[] = [
    {
        id: "task-1",
        title: "Gọi lại khách hàng Công ty ABC",
        description: "Về báo giá #BG-2505-001",
        time: "09:30",
        priority: "HIGH",
        icon: Phone,
    },
    {
        id: "task-2",
        title: "Gặp khách hàng Công ty XYZ",
        description: "Demo thiết bị sự kiện",
        time: "10:30",
        priority: "MEDIUM",
        icon: Users,
    },
    {
        id: "task-3",
        title: "Gửi báo giá cho Công ty DEF",
        description: "Theo yêu cầu qua email",
        time: "14:00",
        priority: "MEDIUM",
        icon: Mail,
    },
    {
        id: "task-4",
        title: "Theo dõi đơn thuê #DT-2505-015",
        description: "Kiểm tra trạng thái thiết bị",
        time: "15:30",
        priority: "LOW",
        icon: ClipboardCheck,
    },
    {
        id: "task-5",
        title: "Báo cáo doanh số tuần",
        description: "Tổng hợp và gửi quản lý",
        time: "17:00",
        priority: "LOW",
        icon: TrendingUp,
    },
];

const RECENT_ACTIVITIES: RecentActivity[] = [
    {
        id: "activity-1",
        type: "QUOTATION",
        label: "Báo giá",
        code: "BG-2505-028",
        customerName:
            "Công ty TNHH Sự kiện Việt",
        timeAgo: "5 phút trước",
    },
    {
        id: "activity-2",
        type: "RENTAL_REQUEST",
        label: "Yêu cầu thuê",
        code: "RQ-2505-032",
        customerName: "Công ty ABC",
        timeAgo: "15 phút trước",
    },
    {
        id: "activity-3",
        type: "RENTAL_ORDER",
        label: "Đơn thuê",
        code: "DT-2505-015",
        customerName: "Công ty XYZ",
        timeAgo: "30 phút trước",
    },
    {
        id: "activity-4",
        type: "CONTRACT",
        label: "Hợp đồng",
        code: "HD-2505-008",
        customerName: "Công ty DEF",
        timeAgo: "1 giờ trước",
    },
    {
        id: "activity-5",
        type: "QUOTATION",
        label: "Báo giá",
        code: "BG-2505-027",
        customerName: "Công ty GHI",
        timeAgo: "2 giờ trước",
    },
];

const POTENTIAL_CUSTOMERS:
    PotentialCustomer[] = [
    {
        id: "customer-1",
        companyName: "Công ty ABC",
        contactName: "Nguyễn Văn A",
        phone: "0901 234 567",
        potentialValue: 120000000,
        status: "INTERESTED",
    },
    {
        id: "customer-2",
        companyName: "Công ty XYZ",
        contactName: "Trần Thị B",
        phone: "0902 345 678",
        potentialValue: 85500000,
        status: "NEGOTIATING",
    },
    {
        id: "customer-3",
        companyName: "Công ty DEF",
        contactName: "Lê Văn C",
        phone: "0903 456 789",
        potentialValue: 60000000,
        status: "NEW",
    },
    {
        id: "customer-4",
        companyName: "Công ty GHI",
        contactName: "Phạm Thị D",
        phone: "0904 567 890",
        potentialValue: 45000000,
        status: "NEW",
    },
];

/* =========================================================
 * UI CONFIG
 * ========================================================= */

const STAT_TONE_CLASSES: Record<
    StatTone,
    {
        wrapper: string;
        icon: string;
        sparkline: string;
    }
> = {
    BLUE: {
        wrapper:
            "bg-blue-50 text-blue-600",
        icon: "text-blue-600",
        sparkline: "stroke-blue-500",
    },

    GREEN: {
        wrapper:
            "bg-emerald-50 text-emerald-600",
        icon: "text-emerald-600",
        sparkline:
            "stroke-emerald-500",
    },

    PURPLE: {
        wrapper:
            "bg-violet-50 text-violet-600",
        icon: "text-violet-600",
        sparkline:
            "stroke-violet-500",
    },

    ORANGE: {
        wrapper:
            "bg-orange-50 text-orange-600",
        icon: "text-orange-600",
        sparkline:
            "stroke-orange-500",
    },

    ROSE: {
        wrapper:
            "bg-rose-50 text-rose-600",
        icon: "text-rose-600",
        sparkline: "stroke-rose-500",
    },

    CYAN: {
        wrapper:
            "bg-cyan-50 text-cyan-600",
        icon: "text-cyan-600",
        sparkline: "stroke-cyan-500",
    },
};

const PRIORITY_CONFIG: Record<
    TaskPriority,
    {
        label: string;
        className: string;
    }
> = {
    HIGH: {
        label: "Cao",
        className:
            "bg-red-50 text-red-600 border-red-100",
    },

    MEDIUM: {
        label: "Trung bình",
        className:
            "bg-orange-50 text-orange-600 border-orange-100",
    },

    LOW: {
        label: "Thấp",
        className:
            "bg-blue-50 text-blue-600 border-blue-100",
    },
};

const LEAD_STATUS_CONFIG: Record<
    LeadStatus,
    {
        label: string;
        className: string;
    }
> = {
    NEW: {
        label: "Mới",
        className:
            "bg-emerald-50 text-emerald-700",
    },

    INTERESTED: {
        label: "Quan tâm",
        className:
            "bg-blue-50 text-blue-700",
    },

    NEGOTIATING: {
        label: "Đàm phán",
        className:
            "bg-orange-50 text-orange-700",
    },
};

const ACTIVITY_TYPE_CONFIG: Record<
    ActivityType,
    string
> = {
    RENTAL_REQUEST:
        "bg-blue-50 text-blue-700",

    QUOTATION:
        "bg-violet-50 text-violet-700",

    RENTAL_ORDER:
        "bg-emerald-50 text-emerald-700",

    CONTRACT:
        "bg-cyan-50 text-cyan-700",
};

/* =========================================================
 * HELPERS
 * ========================================================= */

const formatCurrency = (
    value: number,
): string =>
    `${new Intl.NumberFormat(
        "vi-VN",
    ).format(value)} đ`;

const CHART_WIDTH = 700;
const CHART_HEIGHT = 220;
const CHART_PADDING_X = 18;
const CHART_PADDING_Y = 20;
const CHART_MAX_VALUE = 80000000;

const getChartPoints = (): string =>
    REVENUE_DATA.map(
        (item, index) => {
            const availableWidth =
                CHART_WIDTH -
                CHART_PADDING_X * 2;

            const availableHeight =
                CHART_HEIGHT -
                CHART_PADDING_Y * 2;

            const x =
                CHART_PADDING_X +
                (availableWidth /
                    (REVENUE_DATA.length -
                        1)) *
                index;

            const y =
                CHART_HEIGHT -
                CHART_PADDING_Y -
                (item.revenue /
                    CHART_MAX_VALUE) *
                availableHeight;

            return `${x},${y}`;
        },
    ).join(" ");

const CHART_POINTS = getChartPoints();

const getPointPosition = (
    index: number,
    revenue: number,
): {
    x: number;
    y: number;
} => {
    const availableWidth =
        CHART_WIDTH -
        CHART_PADDING_X * 2;

    const availableHeight =
        CHART_HEIGHT -
        CHART_PADDING_Y * 2;

    return {
        x:
            CHART_PADDING_X +
            (availableWidth /
                (REVENUE_DATA.length - 1)) *
            index,

        y:
            CHART_HEIGHT -
            CHART_PADDING_Y -
            (revenue / CHART_MAX_VALUE) *
            availableHeight,
    };
};

/* =========================================================
 * PAGE
 * ========================================================= */

export const SalesDashboardPage = () => {
    return (
        <main className="space-y-5">
            {/* PAGE HEADER */}
            <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                            Tổng quan
                        </h1>

                        <TrendingUp
                            size={22}
                            aria-hidden="true"
                            className="text-blue-600"
                        />
                    </div>

                    <p className="mt-1.5 text-sm text-slate-500">
                        Xin chào Trần Thị Kinh
                        Doanh! Đây là tổng quan
                        công việc của bạn hôm nay.
                    </p>
                </div>

                <button
                    type="button"
                    className="inline-flex h-11 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 lg:self-auto"
                >
                    <CalendarDays
                        size={17}
                        aria-hidden="true"
                        className="text-slate-500"
                    />

                    Hôm nay: 12/08/2026
                </button>
            </header>

            {/* KPI */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                {DASHBOARD_STATS.map(
                    (item) => {
                        const Icon =
                            item.icon;

                        const tone =
                            STAT_TONE_CLASSES[
                                item.tone
                                ];

                        return (
                            <article
                                key={item.id}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        className={[
                                            "flex size-11 shrink-0 items-center justify-center rounded-xl",
                                            tone.wrapper,
                                        ].join(" ")}
                                    >
                                        <Icon
                                            size={21}
                                            aria-hidden="true"
                                            className={
                                                tone.icon
                                            }
                                        />
                                    </span>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-600">
                                            {
                                                item.label
                                            }
                                        </p>

                                        <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-950">
                                            {
                                                item.value
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-1.5 text-xs">
                                    <span className="inline-flex items-center gap-0.5 font-bold text-emerald-600">
                                        <ArrowUpRight
                                            size={
                                                14
                                            }
                                            aria-hidden="true"
                                        />

                                        {
                                            item.change
                                        }
                                        %
                                    </span>

                                    <span className="truncate text-slate-400">
                                        {
                                            item.comparison
                                        }
                                    </span>
                                </div>

                                <svg
                                    viewBox="0 0 120 24"
                                    preserveAspectRatio="none"
                                    className="mt-3 h-7 w-full"
                                    aria-hidden="true"
                                >
                                    <polyline
                                        points="0,20 10,18 20,19 30,15 40,17 50,12 60,14 70,10 80,13 90,8 100,10 110,5 120,2"
                                        fill="none"
                                        strokeWidth="1.7"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={
                                            tone.sparkline
                                        }
                                    />
                                </svg>
                            </article>
                        );
                    },
                )}
            </section>

            {/* MAIN GRID */}
            <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
                {/* REVENUE */}
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                            <h2 className="text-base font-bold text-slate-950">
                                Doanh số 7 ngày qua
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Hiệu suất bán hàng
                                trong tuần gần nhất
                            </p>
                        </div>

                        <button
                            type="button"
                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            7 ngày qua
                        </button>
                    </header>

                    <div className="px-5 pb-4 pt-5">
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-[28px]">
                                {[
                                    "80M",
                                    "60M",
                                    "40M",
                                    "20M",
                                    "0",
                                ].map(
                                    (label) => (
                                        <div
                                            key={
                                                label
                                            }
                                            className="flex items-center gap-3"
                                        >
                                            <span className="w-8 text-right text-[11px] text-slate-400">
                                                {
                                                    label
                                                }
                                            </span>

                                            <span className="h-px flex-1 bg-slate-100" />
                                        </div>
                                    ),
                                )}
                            </div>

                            <div className="ml-11">
                                <svg
                                    viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                                    className="h-[250px] w-full overflow-visible"
                                    preserveAspectRatio="none"
                                    role="img"
                                    aria-label="Biểu đồ doanh số 7 ngày"
                                >
                                    <defs>
                                        <linearGradient
                                            id="sales-revenue-area"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#2563eb"
                                                stopOpacity="0.16"
                                            />

                                            <stop
                                                offset="100%"
                                                stopColor="#2563eb"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                    </defs>

                                    <polygon
                                        points={`${CHART_POINTS} ${
                                            getPointPosition(
                                                REVENUE_DATA.length -
                                                1,
                                                REVENUE_DATA[
                                                REVENUE_DATA.length -
                                                1
                                                    ]
                                                    .revenue,
                                            ).x
                                        },${CHART_HEIGHT} ${
                                            getPointPosition(
                                                0,
                                                REVENUE_DATA[0]
                                                    .revenue,
                                            ).x
                                        },${CHART_HEIGHT}`}
                                        fill="url(#sales-revenue-area)"
                                    />

                                    <polyline
                                        points={
                                            CHART_POINTS
                                        }
                                        fill="none"
                                        stroke="#2563eb"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        vectorEffect="non-scaling-stroke"
                                    />

                                    {REVENUE_DATA.map(
                                        (
                                            item,
                                            index,
                                        ) => {
                                            const {
                                                x,
                                                y,
                                            } =
                                                getPointPosition(
                                                    index,
                                                    item.revenue,
                                                );

                                            return (
                                                <circle
                                                    key={
                                                        item.date
                                                    }
                                                    cx={
                                                        x
                                                    }
                                                    cy={
                                                        y
                                                    }
                                                    r="5"
                                                    fill="#2563eb"
                                                    stroke="#ffffff"
                                                    strokeWidth="2.5"
                                                    vectorEffect="non-scaling-stroke"
                                                />
                                            );
                                        },
                                    )}
                                </svg>

                                <div className="grid grid-cols-7 gap-1">
                                    {REVENUE_DATA.map(
                                        (item) => (
                                            <span
                                                key={
                                                    item.date
                                                }
                                                className="text-center text-[11px] font-medium text-slate-400"
                                            >
                                                {
                                                    item.date
                                                }
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-5 grid divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                            <div className="px-4 py-3">
                                <p className="text-xs text-slate-400">
                                    Tổng doanh số
                                </p>

                                <p className="mt-1 text-base font-bold text-slate-950">
                                    256.8M đ
                                </p>
                            </div>

                            <div className="px-4 py-3">
                                <p className="text-xs text-slate-400">
                                    Trung bình mỗi
                                    ngày
                                </p>

                                <p className="mt-1 text-base font-bold text-emerald-600">
                                    36.7M đ
                                </p>
                            </div>

                            <div className="px-4 py-3">
                                <p className="text-xs text-slate-400">
                                    Ngày cao nhất
                                </p>

                                <p className="mt-1 text-base font-bold text-slate-950">
                                    64.2M đ{" "}
                                    <span className="text-xs font-medium text-slate-400">
                                        (08/08)
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </article>

                {/* TASKS */}
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div>
                            <h2 className="text-base font-bold text-slate-950">
                                Công việc cần làm
                            </h2>

                            <p className="mt-1 text-xs text-slate-400">
                                Các việc cần ưu tiên
                                trong hôm nay
                            </p>
                        </div>

                        <button
                            type="button"
                            className="text-xs font-bold text-blue-600 transition hover:text-blue-700"
                        >
                            Xem tất cả
                        </button>
                    </header>

                    <div>
                        {TASKS.map(
                            (task) => {
                                const Icon =
                                    task.icon;

                                const priority =
                                    PRIORITY_CONFIG[
                                        task
                                            .priority
                                        ];

                                return (
                                    <div
                                        key={
                                            task.id
                                        }
                                        className="group flex items-center gap-3 border-b border-slate-100 px-5 py-3.5 last:border-b-0 hover:bg-slate-50/70"
                                    >
                                        <button
                                            type="button"
                                            aria-label="Đánh dấu hoàn thành"
                                            className="flex size-5 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white transition hover:border-blue-400"
                                        />

                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                            <Icon
                                                size={
                                                    17
                                                }
                                                aria-hidden="true"
                                            />
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold text-slate-800">
                                                {
                                                    task.title
                                                }
                                            </p>

                                            <p className="mt-0.5 truncate text-xs text-slate-400">
                                                {
                                                    task.description
                                                }
                                            </p>
                                        </div>

                                        <div className="hidden shrink-0 items-center gap-3 sm:flex">
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                                                <Clock3
                                                    size={
                                                        13
                                                    }
                                                    aria-hidden="true"
                                                />

                                                {
                                                    task.time
                                                }
                                            </span>

                                            <span
                                                className={[
                                                    "min-w-[72px] rounded-full border px-2.5 py-1 text-center text-[11px] font-bold",
                                                    priority.className,
                                                ].join(
                                                    " ",
                                                )}
                                            >
                                                {
                                                    priority.label
                                                }
                                            </span>
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>

                    <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-center">
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                            Xem tất cả công việc

                            <ArrowUpRight
                                size={14}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </article>
            </section>

            {/* BOTTOM GRID */}
            <section className="grid gap-5 xl:grid-cols-2">
                {/* RECENT ACTIVITY */}
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2
                                size={18}
                                aria-hidden="true"
                                className="text-slate-500"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Hoạt động gần đây
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                            Xem tất cả
                        </button>
                    </header>

                    <div className="overflow-x-auto">
                        <div className="min-w-[600px]">
                            <div className="grid grid-cols-[110px_120px_minmax(180px,1fr)_110px] gap-3 bg-slate-50 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                <span>Loại</span>
                                <span>Mã</span>
                                <span>
                                    Khách hàng
                                </span>
                                <span className="text-right">
                                    Thời gian
                                </span>
                            </div>

                            {RECENT_ACTIVITIES.map(
                                (
                                    activity,
                                ) => (
                                    <div
                                        key={
                                            activity.id
                                        }
                                        className="grid grid-cols-[110px_120px_minmax(180px,1fr)_110px] items-center gap-3 border-t border-slate-100 px-5 py-3 text-sm"
                                    >
                                        <div>
                                            <span
                                                className={[
                                                    "inline-flex rounded-lg px-2 py-1 text-[11px] font-bold",
                                                    ACTIVITY_TYPE_CONFIG[
                                                        activity
                                                            .type
                                                        ],
                                                ].join(
                                                    " ",
                                                )}
                                            >
                                                {
                                                    activity.label
                                                }
                                            </span>
                                        </div>

                                        <span className="font-semibold text-slate-700">
                                            {
                                                activity.code
                                            }
                                        </span>

                                        <span className="truncate text-slate-600">
                                            {
                                                activity.customerName
                                            }
                                        </span>

                                        <span className="text-right text-xs text-slate-400">
                                            {
                                                activity.timeAgo
                                            }
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-center">
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                            Xem tất cả hoạt động

                            <ArrowUpRight
                                size={14}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </article>

                {/* POTENTIAL CUSTOMERS */}
                <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <Building2
                                size={18}
                                aria-hidden="true"
                                className="text-slate-500"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Khách hàng tiềm
                                năng
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                            Xem tất cả
                        </button>
                    </header>

                    <div>
                        {POTENTIAL_CUSTOMERS.map(
                            (
                                customer,
                                index,
                            ) => {
                                const status =
                                    LEAD_STATUS_CONFIG[
                                        customer
                                            .status
                                        ];

                                const initials =
                                    customer.companyName
                                        .replace(
                                            "Công ty ",
                                            "",
                                        )
                                        .replace(
                                            "TNHH ",
                                            "",
                                        )
                                        .slice(
                                            0,
                                            3,
                                        )
                                        .toUpperCase();

                                return (
                                    <div
                                        key={
                                            customer.id
                                        }
                                        className="grid gap-3 border-b border-slate-100 px-5 py-3.5 last:border-b-0 sm:grid-cols-[minmax(170px,1fr)_130px_130px_90px] sm:items-center"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span
                                                className={[
                                                    "flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white",
                                                    index %
                                                    4 ===
                                                    0
                                                        ? "bg-blue-600"
                                                        : index %
                                                        4 ===
                                                        1
                                                            ? "bg-emerald-600"
                                                            : index %
                                                            4 ===
                                                            2
                                                                ? "bg-violet-600"
                                                                : "bg-orange-600",
                                                ].join(
                                                    " ",
                                                )}
                                            >
                                                {
                                                    initials
                                                }
                                            </span>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-bold text-slate-800">
                                                    {
                                                        customer.companyName
                                                    }
                                                </p>

                                                <p className="mt-0.5 truncate text-xs text-slate-400">
                                                    {
                                                        customer.contactName
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <span className="text-xs text-slate-500">
                                            {
                                                customer.phone
                                            }
                                        </span>

                                        <span className="text-sm font-bold text-slate-800">
                                            {formatCurrency(
                                                customer.potentialValue,
                                            )}
                                        </span>

                                        <span
                                            className={[
                                                "justify-self-start rounded-full px-2.5 py-1 text-[11px] font-bold sm:justify-self-end",
                                                status.className,
                                            ].join(
                                                " ",
                                            )}
                                        >
                                            {
                                                status.label
                                            }
                                        </span>
                                    </div>
                                );
                            },
                        )}
                    </div>

                    <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-center">
                        <button
                            type="button"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                        >
                            Xem tất cả khách hàng

                            <ArrowUpRight
                                size={14}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </article>
            </section>
        </main>
    );
};