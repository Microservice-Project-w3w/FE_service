import {
    Activity,
    ArrowLeft,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    FileText,
    Search,
    Send,
    XCircle,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router";

type ActivityType =
    | "SENT"
    | "ACCEPTED"
    | "CREATED"
    | "REJECTED";

interface ActivityRecord {
    id: string;
    quotationId: string;
    quotationCode: string;
    title: string;
    actor: string;
    time: string;
    type: ActivityType;
}

const ACTIVITIES: ActivityRecord[] =
    Array.from(
        {
            length: 18,
        },
        (_, index) => {
            const typePattern: ActivityType[] = [
                "SENT",
                "ACCEPTED",
                "CREATED",
                "REJECTED",
            ];

            const type =
                typePattern[
                index %
                typePattern.length
                    ];

            const titleMap: Record<
                ActivityType,
                string
            > = {
                SENT:
                    "Đã gửi báo giá cho khách hàng",
                ACCEPTED:
                    "Khách hàng đã chốt báo giá",
                CREATED:
                    "Tạo mới báo giá",
                REJECTED:
                    "Khách hàng từ chối báo giá",
            };

            return {
                id: `activity-${String(
                    index + 1,
                ).padStart(3, "0")}`,
                quotationId: `quotation-${String(
                    (index % 24) + 1,
                ).padStart(3, "0")}`,
                quotationCode: `BG-2026-${String(
                    24 -
                    (index % 24),
                ).padStart(4, "0")}`,
                title:
                    titleMap[type],
                actor:
                    index % 2 === 0
                        ? "Nguyễn Văn Minh"
                        : "Trần Thị Mai",
                time:
                    index < 2
                        ? index === 0
                            ? "10:30 hôm nay"
                            : "09:20 hôm nay"
                        : `${String(
                            13 -
                            (index % 10),
                        ).padStart(
                            2,
                            "0",
                        )}/08/2026`,
                type,
            };
        },
    );

const PAGE_SIZE = 6;

export const SalesQuotationActivitiesPage =
    () => {
        const [
            searchTerm,
            setSearchTerm,
        ] = useState("");

        const [
            typeFilter,
            setTypeFilter,
        ] = useState<
            ActivityType | "ALL"
        >("ALL");

        const [
            currentPage,
            setCurrentPage,
        ] = useState(1);

        const filtered =
            useMemo(() => {
                const keyword =
                    searchTerm
                        .trim()
                        .toLowerCase();

                return ACTIVITIES.filter(
                    (item) => {
                        const matchesSearch =
                            keyword === "" ||
                            `${item.quotationCode} ${item.title} ${item.actor}`
                                .toLowerCase()
                                .includes(keyword);

                        const matchesType =
                            typeFilter ===
                            "ALL" ||
                            item.type ===
                            typeFilter;

                        return (
                            matchesSearch &&
                            matchesType
                        );
                    },
                );
            }, [
                searchTerm,
                typeFilter,
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
                currentPage,
                totalPages,
            );

        const visible =
            filtered.slice(
                (safePage - 1) *
                PAGE_SIZE,
                safePage *
                PAGE_SIZE,
            );

        return (
            <main className="space-y-4">
                <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                            <Link
                                to="/sales/quotations"
                                className="hover:text-blue-600"
                            >
                                Báo giá
                            </Link>

                            <span>/</span>

                            <span className="font-semibold text-slate-700">
                Lịch sử hoạt động
              </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Activity
                                size={19}
                                className="text-blue-600"
                            />
                            <h1 className="text-2xl font-bold text-slate-950">
                                Lịch sử hoạt động báo giá
                            </h1>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                            Theo dõi toàn bộ thao tác tạo, gửi, chốt và từ chối báo giá.
                        </p>
                    </div>

                    <Link
                        to="/sales/quotations"
                        className="inline-flex h-9 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 lg:self-auto"
                    >
                        <ArrowLeft
                            size={15}
                        />
                        Quay lại
                    </Link>
                </header>

                <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex flex-col gap-2.5 sm:flex-row">
                        <label className="relative flex-1">
                            <Search
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                                    setCurrentPage(1);
                                }}
                                placeholder="Tìm mã báo giá, nội dung, người thực hiện..."
                                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-blue-500"
                            />
                        </label>

                        <select
                            value={
                                typeFilter
                            }
                            onChange={(event) => {
                                setTypeFilter(
                                    event.target
                                        .value as
                                        | ActivityType
                                        | "ALL",
                                );
                                setCurrentPage(1);
                            }}
                            className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-700 sm:w-[190px]"
                        >
                            <option value="ALL">
                                Tất cả hoạt động
                            </option>
                            <option value="CREATED">
                                Tạo báo giá
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
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="divide-y divide-slate-100">
                        {visible.map(
                            (activity) => (
                                <ActivityRow
                                    key={
                                        activity.id
                                    }
                                    activity={
                                        activity
                                    }
                                />
                            ),
                        )}

                        {visible.length ===
                            0 && (
                                <div className="px-5 py-12 text-center">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Không tìm thấy hoạt động
                                    </p>
                                </div>
                            )}
                    </div>

                    <footer className="flex flex-col gap-2.5 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-[11px] text-slate-500">
                            {
                                filtered.length
                            }{" "}
                            hoạt động
                        </p>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={
                                    safePage === 1
                                }
                                onClick={() => {
                                    setCurrentPage(
                                        Math.max(
                                            1,
                                            safePage - 1,
                                        ),
                                    );
                                }}
                                className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40"
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
                                            setCurrentPage(
                                                page,
                                            );
                                        }}
                                        className={[
                                            "flex size-8 items-center justify-center rounded-lg text-xs font-semibold",
                                            page ===
                                            safePage
                                                ? "bg-blue-600 text-white"
                                                : "border border-slate-200 text-slate-600",
                                        ].join(" ")}
                                    >
                                        {
                                            page
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
                                    setCurrentPage(
                                        Math.min(
                                            totalPages,
                                            safePage + 1,
                                        ),
                                    );
                                }}
                                className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40"
                            >
                                <ChevronRight
                                    size={15}
                                />
                            </button>
                        </div>
                    </footer>
                </section>
            </main>
        );
    };

const ActivityRow = ({
                         activity,
                     }: {
    activity: ActivityRecord;
}) => {
    const config = {
        SENT: {
            icon: Send,
            tone:
                "bg-emerald-50 text-emerald-600",
            label:
                "Đã gửi",
        },
        ACCEPTED: {
            icon: CheckCircle2,
            tone:
                "bg-violet-50 text-violet-600",
            label:
                "Đã chốt",
        },
        CREATED: {
            icon: FileText,
            tone:
                "bg-blue-50 text-blue-600",
            label:
                "Tạo mới",
        },
        REJECTED: {
            icon: XCircle,
            tone:
                "bg-rose-50 text-rose-600",
            label:
                "Từ chối",
        },
    }[
        activity.type
        ];

    const Icon =
        config.icon;

    return (
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
      <span
          className={[
              "flex size-9 shrink-0 items-center justify-center rounded-full",
              config.tone,
          ].join(" ")}
      >
        <Icon
            size={16}
        />
      </span>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        to={`/sales/quotations/${activity.quotationId}`}
                        className="text-xs font-bold text-blue-600 hover:underline"
                    >
                        {
                            activity.quotationCode
                        }
                    </Link>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
            {
                config.label
            }
          </span>
                </div>

                <p className="mt-1 text-xs font-semibold text-slate-800">
                    {
                        activity.title
                    }
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                    {
                        activity.actor
                    }
                </p>
            </div>

            <span className="shrink-0 text-[11px] font-medium text-slate-400">
        {
            activity.time
        }
      </span>
        </div>
    );
};