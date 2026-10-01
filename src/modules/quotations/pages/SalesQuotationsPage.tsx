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
    FileText,
    Filter,
    Search,
    Send,
    SlidersHorizontal,
    TrendingUp,
    XCircle,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router";

import { useSalesRentalWorkflow } from "@/modules/rentals/hooks/useSalesRentalWorkflow";

type QuotationStatus =
    | "PENDING"
    | "SENT"
    | "ACCEPTED"
    | "REJECTED";

interface SalesQuotation {
    id: string;
    code: string;
    companyName: string;
    contactName: string;
    equipmentName: string;
    equipmentModel: string;
    createdDate: string;
    createdTime: string;
    ageDays: number;
    value: number;
    status: QuotationStatus;
}

interface RecentActivity {
    id: string;
    quotationId: string;
    quotationCode: string;
    title: string;
    description: string;
    time: string;
    type:
        | "SENT"
        | "ACCEPTED"
        | "CREATED"
        | "REJECTED";
}

const COMPANY_SEEDS = [
    {
        companyName: "Công ty TNHH ABC",
        contactName: "Nguyễn Văn An",
        equipmentName: "Máy phát điện 50kVA",
        equipmentModel: "Cummins C50D5",
        baseValue: 85000000,
    },
    {
        companyName: "Công ty CP Xây dựng Hòa Phát",
        contactName: "Phạm Thị Bích",
        equipmentName: "Xe nâng người 12m",
        equipmentModel: "Genie GS-3246",
        baseValue: 52000000,
    },
    {
        companyName: "Công ty TNHH Minh Tâm",
        contactName: "Lê Hoàng Nam",
        equipmentName: "Máy đào 0.9m³",
        equipmentModel: "Kobelco SK75",
        baseValue: 120000000,
    },
    {
        companyName: "Công ty CP Đầu tư Phú Quý",
        contactName: "Trần Quốc Hưng",
        equipmentName: "Máy nén khí 10HP",
        equipmentModel: "Airman PDS100S",
        baseValue: 28000000,
    },
    {
        companyName: "Công ty TNHH Dịch vụ An Phát",
        contactName: "Đỗ Thị Mai",
        equipmentName: "Tháp đèn LED 7m",
        equipmentModel: "Atlas Copco HiLight V5+",
        baseValue: 18500000,
    },
    {
        companyName: "Công ty TNHH Sự kiện Việt",
        contactName: "Hoàng Minh Khang",
        equipmentName: "Loa Array JBL VTX A8",
        equipmentModel: "JBL VTX A8",
        baseValue: 96000000,
    },
];

const STATUS_PATTERN: QuotationStatus[] = [
    "PENDING",
    "SENT",
    "ACCEPTED",
    "SENT",
    "PENDING",
    "REJECTED",
];

const QUOTATION_MOCKS: SalesQuotation[] =
    Array.from(
        {
            length: 24,
        },
        (_, index) => {
            const seed =
                COMPANY_SEEDS[
                index %
                COMPANY_SEEDS.length
                    ];

            const day =
                13 - (index % 12);

            const codeNumber =
                24 - index;

            return {
                id: `quotation-${String(
                    index + 1,
                ).padStart(3, "0")}`,
                code: `BG-2026-${String(
                    codeNumber,
                ).padStart(4, "0")}`,
                companyName:
                seed.companyName,
                contactName:
                seed.contactName,
                equipmentName:
                seed.equipmentName,
                equipmentModel:
                seed.equipmentModel,
                createdDate: `${String(
                    Math.max(day, 1),
                ).padStart(
                    2,
                    "0",
                )}/08/2026`,
                createdTime:
                    index % 2 === 0
                        ? "10:30"
                        : "15:45",
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
void QUOTATION_MOCKS;

const RECENT_ACTIVITIES: RecentActivity[] = [
    {
        id: "activity-001",
        quotationId: "quotation-001",
        quotationCode: "BG-2026-0024",
        title: "Đã gửi báo giá cho Công ty TNHH ABC",
        description: "Nguyễn Văn Minh",
        time: "10:30 hôm nay",
        type: "SENT",
    },
    {
        id: "activity-002",
        quotationId: "quotation-003",
        quotationCode: "BG-2026-0022",
        title: "Khách hàng đã chốt báo giá",
        description: "Trần Thị Mai",
        time: "09:20 hôm nay",
        type: "ACCEPTED",
    },
    {
        id: "activity-003",
        quotationId: "quotation-002",
        quotationCode: "BG-2026-0023",
        title: "Tạo mới báo giá",
        description: "Nguyễn Văn Minh",
        time: "Hôm qua",
        type: "CREATED",
    },
    {
        id: "activity-004",
        quotationId: "quotation-006",
        quotationCode: "BG-2026-0019",
        title: "Khách hàng từ chối báo giá",
        description: "Trần Thị Mai",
        time: "08/08/2026",
        type: "REJECTED",
    },
];

const STATUS_CONFIG: Record<
    QuotationStatus,
    {
        label: string;
        className: string;
    }
> = {
    PENDING: {
        label: "Chờ duyệt",
        className:
            "border-orange-100 bg-orange-50 text-orange-700",
    },
    SENT: {
        label: "Đã gửi",
        className:
            "border-blue-100 bg-blue-50 text-blue-700",
    },
    ACCEPTED: {
        label: "Đã chốt",
        className:
            "border-emerald-100 bg-emerald-50 text-emerald-700",
    },
    REJECTED: {
        label: "Từ chối",
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

export const SalesQuotationsPage =
    () => {
        const { quotations, isLoading, error } = useSalesRentalWorkflow();
        const backendQuotations = useMemo<SalesQuotation[]>(() => quotations.map((item) => ({
            id: String(item.id), code: item.quotationCode,
            companyName: `Khách hàng #${item.customerId}`,
            contactName: `Yêu cầu thuê #${item.rentalRequestId}`,
            equipmentName: "Chi tiết theo yêu cầu thuê",
            equipmentModel: `Chi nhánh #${item.branchId}`,
            createdDate: new Date(item.validUntil).toLocaleDateString("vi-VN"),
            createdTime: new Date(item.validUntil).toLocaleTimeString("vi-VN", {
                hour: "2-digit", minute: "2-digit",
            }),
            ageDays: 0, value: Number(item.totalAmount),
            status: item.status === "SENT" ? "SENT"
                : item.status === "ACCEPTED" || item.status === "CONVERTED" ? "ACCEPTED"
                    : item.status === "REJECTED" || item.status === "CANCELLED" || item.status === "EXPIRED" ? "REJECTED"
                        : "PENDING",
        })), [quotations]);
        const [
            searchTerm,
            setSearchTerm,
        ] = useState("");

        const [
            statusFilter,
            setStatusFilter,
        ] = useState<
            QuotationStatus | "ALL"
        >("ALL");

        const [
            dateRange,
            setDateRange,
        ] = useState<
            7 | 30 | 90
        >(30);

        const [
            chartRange,
            setChartRange,
        ] = useState<
            7 | 30
        >(7);

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
                const pending =
                    backendQuotations.filter(
                        (item) =>
                            item.status ===
                            "PENDING",
                    ).length;

                const sent =
                    backendQuotations.filter(
                        (item) =>
                            item.status ===
                            "SENT",
                    ).length;

                const accepted =
                    backendQuotations.filter(
                        (item) =>
                            item.status ===
                            "ACCEPTED",
                    ).length;

                const rejected =
                    backendQuotations.filter(
                        (item) =>
                            item.status ===
                            "REJECTED",
                    ).length;

                const total =
                    backendQuotations.length;

                return {
                    total,
                    pending,
                    sent,
                    accepted,
                    rejected,
                    closeRate:
                        total === 0
                            ? 0
                            : (accepted /
                                total) *
                            100,
                };
            }, [backendQuotations]);

        const filteredQuotations =
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

                return backendQuotations.filter(
                    (quotation) => {
                        const searchable =
                            normalizeSearch(
                                [
                                    quotation.code,
                                    quotation.companyName,
                                    quotation.contactName,
                                    quotation.equipmentName,
                                    quotation.equipmentModel,
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
                            quotation.status ===
                            statusFilter;

                        const matchesDate =
                            quotation.ageDays <
                            dateRange;

                        const matchesMin =
                            min === null ||
                            quotation.value >=
                            min;

                        const matchesMax =
                            max === null ||
                            quotation.value <=
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
                backendQuotations,
            ]);

        const totalPages =
            Math.max(
                1,
                Math.ceil(
                    filteredQuotations.length /
                    PAGE_SIZE,
                ),
            );

        const safePage =
            Math.min(
                currentPage,
                totalPages,
            );

        const visibleQuotations =
            filteredQuotations.slice(
                (safePage - 1) *
                PAGE_SIZE,
                safePage *
                PAGE_SIZE,
            );

        const chartPoints =
            chartRange === 7
                ? "10,78 55,96 100,58 145,82 190,38 235,62 300,33"
                : "10,86 55,74 100,82 145,49 190,57 235,31 300,44";

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
                {isLoading ? <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Đang tải báo giá từ backend...</p> : null}
                {error ? <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
                <header className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-white px-5 py-4">
                    <div className="absolute -right-20 -top-24 size-48 rounded-full bg-blue-100/40 blur-3xl" />

                    <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                                    Báo giá
                                </h1>

                                <TrendingUp
                                    size={19}
                                    className="text-blue-600"
                                    aria-hidden="true"
                                />
                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                                Tổng quan hiệu suất và quản lý báo giá của bạn.
                            </p>
                        </div>

                        <Link
                            to="/sales/quotations/create"
                            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-4 text-sm font-semibold !text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 hover:!text-white lg:self-auto"
                        >
                            <FileText
                                size={17}
                                aria-hidden="true"
                            />

                            Tạo báo giá mới
                        </Link>
                    </div>
                </header>

                <section className="grid gap-4 xl:grid-cols-[1.08fr_0.86fr_0.86fr]">
                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-950">
                            Hiệu suất báo giá
                        </h2>

                        <div className="mt-4 flex items-center gap-5">
                            <div
                                className="relative flex size-32 shrink-0 items-center justify-center rounded-full"
                                style={{
                                    background: `conic-gradient(#2563eb 0% ${summary.closeRate}%, #dbeafe ${summary.closeRate}% 100%)`,
                                }}
                            >
                                <div className="flex size-[90px] flex-col items-center justify-center rounded-full bg-white">
                                    <p className="text-xl font-bold text-slate-950">
                                        {summary.closeRate.toFixed(
                                            1,
                                        )}
                                        %
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                        Tỷ lệ chốt
                                    </p>
                                </div>
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-3xl font-bold tracking-tight text-slate-950">
                                    {
                                        summary.total
                                    }
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Tổng báo giá
                                </p>

                                <p className="mt-2 text-[11px] font-semibold text-emerald-600">
                                    ↑ 18% so với 30 ngày trước
                                </p>

                                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                                    <MiniMetric
                                        value={String(
                                            summary.sent,
                                        )}
                                        label="Đã gửi"
                                    />

                                    <MiniMetric
                                        value={String(
                                            summary.pending,
                                        )}
                                        label="Chờ duyệt"
                                    />

                                    <MiniMetric
                                        value={String(
                                            summary.accepted,
                                        )}
                                        label="Đã chốt"
                                    />
                                </div>
                            </div>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-950">
                            Tổng quan trạng thái
                        </h2>

                        <div className="mt-3 space-y-2">
                            <StatusOverviewRow
                                icon={Clock3}
                                iconClassName="bg-orange-50 text-orange-600"
                                label="Chờ duyệt"
                                value={String(
                                    summary.pending,
                                )}
                                percentage={`${(
                                    (summary.pending /
                                        summary.total) *
                                    100
                                ).toFixed(1)}%`}
                                percentageClassName="bg-orange-50 text-orange-700"
                            />

                            <StatusOverviewRow
                                icon={Send}
                                iconClassName="bg-emerald-50 text-emerald-600"
                                label="Đã gửi khách"
                                value={String(
                                    summary.sent,
                                )}
                                percentage={`${(
                                    (summary.sent /
                                        summary.total) *
                                    100
                                ).toFixed(1)}%`}
                                percentageClassName="bg-emerald-50 text-emerald-700"
                            />

                            <StatusOverviewRow
                                icon={CheckCircle2}
                                iconClassName="bg-violet-50 text-violet-600"
                                label="Đã chốt"
                                value={String(
                                    summary.accepted,
                                )}
                                percentage={`${summary.closeRate.toFixed(
                                    1,
                                )}%`}
                                percentageClassName="bg-violet-50 text-violet-700"
                            />

                            <StatusOverviewRow
                                icon={XCircle}
                                iconClassName="bg-rose-50 text-rose-600"
                                label="Từ chối"
                                value={String(
                                    summary.rejected,
                                )}
                                percentage={`${(
                                    (summary.rejected /
                                        summary.total) *
                                    100
                                ).toFixed(1)}%`}
                                percentageClassName="bg-rose-50 text-rose-700"
                            />
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-bold text-slate-950">
                                    {chartRange} ngày gần đây
                                </h2>

                                <p className="mt-2 text-2xl font-bold text-slate-950">
                                    {chartRange ===
                                    7
                                        ? 6
                                        : 18}
                                </p>

                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    Báo giá
                                </p>
                            </div>

                            <select
                                value={chartRange}
                                onChange={(event) => {
                                    setChartRange(
                                        Number(
                                            event.target
                                                .value,
                                        ) as
                                            | 7
                                            | 30,
                                    );
                                }}
                                className="h-8 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-semibold text-slate-600 outline-none"
                            >
                                <option value={7}>
                                    7 ngày
                                </option>

                                <option value={30}>
                                    30 ngày
                                </option>
                            </select>
                        </div>

                        <p className="mt-2 text-[11px] font-semibold text-emerald-600">
                            ↑ 20% so với kỳ trước
                        </p>

                        <div className="mt-3">
                            <svg
                                viewBox="0 0 320 105"
                                className="h-[95px] w-full"
                                aria-hidden="true"
                            >
                                <defs>
                                    <linearGradient
                                        id="quotationChartCompact"
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
                                    points={`${chartPoints} 300,103 10,103`}
                                    fill="url(#quotationChartCompact)"
                                />

                                <polyline
                                    points={chartPoints}
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>

                            <div className="flex justify-between text-[9px] text-slate-400">
                <span>
                  07/08
                </span>
                                <span>
                  09/08
                </span>
                                <span>
                  11/08
                </span>
                                <span>
                  13/08
                </span>
                            </div>
                        </div>
                    </article>
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
                                        placeholder="Tìm theo mã báo giá, khách hàng, thiết bị..."
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
                                                | QuotationStatus
                                                | "ALL",
                                        );
                                        resetPagination();
                                    }}
                                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 xl:w-[165px]"
                                >
                                    <option value="ALL">
                                        Tất cả trạng thái
                                    </option>

                                    <option value="PENDING">
                                        Chờ duyệt
                                    </option>

                                    <option value="SENT">
                                        Đã gửi
                                    </option>

                                    <option value="ACCEPTED">
                                        Đã chốt
                                    </option>

                                    <option value="REJECTED">
                                        Từ chối
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
                                            setStatusFilter(
                                                "ALL",
                                            );
                                            setDateRange(30);
                                            setSearchTerm("");
                                            setCurrentPage(1);
                                        }}
                                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        <SlidersHorizontal
                                            size={14}
                                        />
                                        Đặt lại
                                    </button>
                                </div>
                            )}
                        </section>

                        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <header className="border-b border-slate-100 px-4 py-3">
                                <h2 className="text-sm font-bold text-slate-950">
                                    Danh sách báo giá
                                </h2>

                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    Theo dõi tiến độ xử lý và trạng thái gửi khách.
                                </p>
                            </header>

                            <div className="overflow-x-auto">
                                <div className="min-w-[820px]">
                                    <div className="grid grid-cols-[120px_minmax(190px,1fr)_minmax(170px,1fr)_130px_110px_105px] gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-2.5 text-[11px] font-semibold text-slate-500">
                    <span>
                      Mã báo giá
                    </span>
                                        <span>
                      Khách hàng
                    </span>
                                        <span>
                      Thiết bị
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
                                        {visibleQuotations.map(
                                            (quotation) => {
                                                const status =
                                                    STATUS_CONFIG[
                                                        quotation.status
                                                        ];

                                                return (
                                                    <div
                                                        key={
                                                            quotation.id
                                                        }
                                                        className="grid grid-cols-[120px_minmax(190px,1fr)_minmax(170px,1fr)_130px_110px_105px] items-center gap-3 px-4 py-3 transition hover:bg-slate-50/70"
                                                    >
                                                        <div>
                                                            <Link
                                                                to={`/sales/quotations/${quotation.id}`}
                                                                className="text-[11px] font-bold text-blue-600 hover:underline"
                                                            >
                                                                {
                                                                    quotation.code
                                                                }
                                                            </Link>

                                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                                {
                                                                    quotation.createdDate
                                                                }{" "}
                                                                {
                                                                    quotation.createdTime
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
                                                                            quotation.companyName
                                                                        }
                                                                    </p>

                                                                    <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                                                        {
                                                                            quotation.contactName
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="min-w-0">
                                                            <p className="truncate text-xs font-semibold text-slate-800">
                                                                {
                                                                    quotation.equipmentName
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 truncate text-[10px] text-slate-400">
                                                                {
                                                                    quotation.equipmentModel
                                                                }
                                                            </p>
                                                        </div>

                                                        <p className="text-xs font-bold text-slate-900">
                                                            {formatCurrency(
                                                                quotation.value,
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
                                                                to={`/sales/quotations/${quotation.id}`}
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

                                        {visibleQuotations.length ===
                                            0 && (
                                                <div className="px-5 py-10 text-center">
                                                    <p className="text-sm font-semibold text-slate-700">
                                                        Không tìm thấy báo giá
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
                                    {filteredQuotations.length ===
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
                                        filteredQuotations.length,
                                    )}{" "}
                                    /{" "}
                                    {
                                        filteredQuotations.length
                                    }{" "}
                                    báo giá
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

                    <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Activity
                                    size={16}
                                    className="text-blue-600"
                                    aria-hidden="true"
                                />

                                <h2 className="text-sm font-bold text-slate-950">
                                    Hoạt động gần đây
                                </h2>
                            </div>

                        </header>

                        <div className="px-4 py-1">
                            {RECENT_ACTIVITIES.map(
                                (
                                    activity,
                                    index,
                                ) => (
                                    <ActivityItem
                                        key={
                                            activity.id
                                        }
                                        activity={
                                            activity
                                        }
                                        showLine={
                                            index <
                                            RECENT_ACTIVITIES.length -
                                            1
                                        }
                                    />
                                ),
                            )}
                        </div>

                    </aside>
                </section>
            </main>
        );
    };

interface MiniMetricProps {
    value: string;
    label: string;
}

const MiniMetric = ({
                        value,
                        label,
                    }: MiniMetricProps) => (
    <div>
        <p className="text-base font-bold text-slate-900">
            {value}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">
            {label}
        </p>
    </div>
);

interface StatusOverviewRowProps {
    icon: LucideIcon;
    iconClassName: string;
    label: string;
    value: string;
    percentage: string;
    percentageClassName: string;
}

const StatusOverviewRow = ({
                               icon: Icon,
                               iconClassName,
                               label,
                               value,
                               percentage,
                               percentageClassName,
                           }: StatusOverviewRowProps) => (
    <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 px-2.5 py-2">
    <span
        className={[
            "flex size-8 shrink-0 items-center justify-center rounded-xl",
            iconClassName,
        ].join(" ")}
    >
      <Icon
          size={15}
          aria-hidden="true"
      />
    </span>

        <span className="flex-1 text-xs font-medium text-slate-700">
      {label}
    </span>

        <span className="text-xs font-bold text-slate-900">
      {value}
    </span>

        <span
            className={[
                "rounded-full px-2 py-0.5 text-[10px] font-bold",
                percentageClassName,
            ].join(" ")}
        >
      {percentage}
    </span>
    </div>
);

const ActivityItem = ({
                          activity,
                          showLine,
                      }: {
    activity: RecentActivity;
    showLine: boolean;
}) => {
    const config = {
        SENT: {
            icon: Send,
            tone:
                "bg-emerald-50 text-emerald-600",
        },
        ACCEPTED: {
            icon: CheckCircle2,
            tone:
                "bg-violet-50 text-violet-600",
        },
        CREATED: {
            icon: FileText,
            tone:
                "bg-blue-50 text-blue-600",
        },
        REJECTED: {
            icon: XCircle,
            tone:
                "bg-rose-50 text-rose-600",
        },
    }[activity.type];

    const Icon =
        config.icon;

    return (
        <div className="relative flex gap-2.5 py-3">
            {showLine && (
                <span className="absolute left-[15px] top-10 h-[calc(100%-14px)] w-px bg-slate-200" />
            )}

            <span
                className={[
                    "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                    config.tone,
                ].join(" ")}
            >
        <Icon
            size={14}
            aria-hidden="true"
        />
      </span>

            <div className="min-w-0">
                <Link
                    to={`/sales/quotations/${activity.quotationId}`}
                    className="text-[10px] font-bold text-blue-600 hover:underline"
                >
                    {
                        activity.quotationCode
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
                        activity.description
                    }
                </p>
            </div>
        </div>
    );
};
