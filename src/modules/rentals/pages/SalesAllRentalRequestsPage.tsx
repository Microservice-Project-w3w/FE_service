import {
    ChevronLeft,
    ChevronRight,
    Eye,
    Filter,
    PackagePlus,
    Search,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import {
    Link,
} from "react-router";

import { useSalesRentalRequests } from "@/modules/rentals/hooks/useSalesRentalRequests";

type Status =
    | "NEW"
    | "PROCESSING"
    | "QUOTED"
    | "COMPLETED"
    | "CANCELLED";

type Priority =
    | "HIGH"
    | "MEDIUM"
    | "LOW";

interface RentalRequest {
    id: string;
    code: string;
    company: string;
    contact: string;
    equipment: number;
    types: number;
    date: string;
    time: string;
    status: Status;
    priority: Priority;
}

export const _DATA: RentalRequest[] = [
    {
        id: "request-001",
        code: "REQ-2026-028",
        company: "Công ty ABC",
        contact: "Nguyễn Văn A",
        equipment: 12,
        types: 3,
        date: "12/08/2026",
        time: "10:30",
        status: "NEW",
        priority: "HIGH",
    },
    {
        id: "request-002",
        code: "REQ-2026-027",
        company: "Công ty XYZ",
        contact: "Trần Thị B",
        equipment: 25,
        types: 5,
        date: "12/08/2026",
        time: "09:15",
        status: "PROCESSING",
        priority: "HIGH",
    },
    {
        id: "request-003",
        code: "REQ-2026-026",
        company: "Công ty DEF",
        contact: "Lê Văn C",
        equipment: 8,
        types: 2,
        date: "11/08/2026",
        time: "16:45",
        status: "PROCESSING",
        priority: "MEDIUM",
    },
    {
        id: "request-004",
        code: "REQ-2026-025",
        company: "Công ty GHI",
        contact: "Phạm Thị D",
        equipment: 15,
        types: 3,
        date: "11/08/2026",
        time: "14:20",
        status: "QUOTED",
        priority: "MEDIUM",
    },
    {
        id: "request-005",
        code: "REQ-2026-024",
        company:
            "Cty Sự kiện Việt",
        contact:
            "Hoàng Minh Khang",
        equipment: 40,
        types: 6,
        date: "10/08/2026",
        time: "11:10",
        status: "COMPLETED",
        priority: "LOW",
    },
    {
        id: "request-006",
        code: "REQ-2026-023",
        company:
            "Công ty Minh Phát",
        contact:
            "Nguyễn Thanh Tùng",
        equipment: 10,
        types: 2,
        date: "09/08/2026",
        time: "15:30",
        status: "CANCELLED",
        priority: "LOW",
    },
];

const STATUS = {
    NEW: {
        label: "Mới",
        className:
            "bg-blue-50 text-blue-700",
    },
    PROCESSING: {
        label: "Đang xử lý",
        className:
            "bg-orange-50 text-orange-700",
    },
    QUOTED: {
        label: "Báo giá",
        className:
            "bg-violet-50 text-violet-700",
    },
    COMPLETED: {
        label: "Hoàn thành",
        className:
            "bg-emerald-50 text-emerald-700",
    },
    CANCELLED: {
        label: "Đã hủy",
        className:
            "bg-rose-50 text-rose-700",
    },
};

const PRIORITY = {
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

export const SalesAllRentalRequestsPage =
    () => {
        const { requests, error, isLoading } = useSalesRentalRequests();
        const [
            search,
            setSearch,
        ] = useState("");

        const [
            status,
            setStatus,
        ] = useState<
            Status | "ALL"
        >("ALL");

        const filtered =
            useMemo(() => {
                const keyword =
                    search
                        .toLowerCase()
                        .trim();

                const backendRequests: RentalRequest[] = requests.map((item) => ({
                    id: String(item.id),
                    code: item.requestCode,
                    company: `Khách hàng #${item.customerId}`,
                    contact: item.deliveryAddress ?? "Chưa có địa chỉ giao",
                    equipment: item.items.reduce((sum, equipment) => sum + equipment.quantity, 0),
                    types: item.items.length,
                    date: new Date(item.createdAt).toLocaleDateString("vi-VN"),
                    time: new Date(item.createdAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    status: item.status === "QUOTED"
                        ? "QUOTED"
                        : item.status === "CANCELLED" || item.status === "REJECTED"
                            ? "CANCELLED"
                            : item.status === "PROCESSING"
                                ? "PROCESSING"
                                : "NEW",
                    priority: "MEDIUM",
                }));

                return backendRequests.filter(
                    (item) => {
                        const matchSearch =
                            !keyword ||
                            [
                                item.code,
                                item.company,
                                item.contact,
                            ]
                                .join(" ")
                                .toLowerCase()
                                .includes(keyword);

                        const matchStatus =
                            status === "ALL" ||
                            item.status ===
                            status;

                        return (
                            matchSearch &&
                            matchStatus
                        );
                    },
                );
            }, [
                search,
                status,
                requests,
            ]);

        return (
            <main className="space-y-5">
                {isLoading ? (
                    <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                        Đang tải yêu cầu thuê từ backend...
                    </p>
                ) : null}
                {error ? (
                    <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                        {error}
                    </p>
                ) : null}
                <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="text-sm text-slate-500">
                            <Link
                                to="/sales/rental-requests"
                                className="hover:text-blue-600"
                            >
                                Yêu cầu thuê
                            </Link>

                            <span className="mx-2">
                /
              </span>

                            Tất cả yêu cầu
                        </div>

                        <h1 className="mt-2 text-3xl font-bold text-slate-950">
                            Tất cả yêu cầu thuê
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Theo dõi toàn bộ yêu
                            cầu thuê của khách hàng.
                        </p>
                    </div>

                    <Link
                        to="/sales/rental-requests/create"
                        className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <PackagePlus
                            size={18}
                        />

                        Tạo yêu cầu mới
                    </Link>
                </header>

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        <label className="relative flex-1">
                            <Search
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                value={search}
                                onChange={(
                                    event,
                                ) => {
                                    setSearch(
                                        event.target.value,
                                    );
                                }}
                                placeholder="Tìm theo mã yêu cầu, khách hàng, người liên hệ..."
                                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                        </label>

                        <button
                            type="button"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700"
                        >
                            <Filter
                                size={17}
                            />

                            Bộ lọc
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {[
                            [
                                "ALL",
                                "Tất cả",
                                32,
                            ],
                            [
                                "NEW",
                                "Mới",
                                8,
                            ],
                            [
                                "PROCESSING",
                                "Đang xử lý",
                                12,
                            ],
                            [
                                "QUOTED",
                                "Báo giá",
                                4,
                            ],
                            [
                                "COMPLETED",
                                "Hoàn thành",
                                6,
                            ],
                            [
                                "CANCELLED",
                                "Đã hủy",
                                2,
                            ],
                        ].map(
                            ([
                                 value,
                                 label,
                                 count,
                             ]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => {
                                        setStatus(
                                            value as
                                                | Status
                                                | "ALL",
                                        );
                                    }}
                                    className={
                                        status ===
                                        value
                                            ? "rounded-full bg-blue-600 px-3.5 py-2 text-xs font-bold text-white"
                                            : "rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                                    }
                                >
                                    {label} (
                                    {count})
                                </button>
                            ),
                        )}
                    </div>
                </section>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="hidden grid-cols-[130px_minmax(200px,1fr)_140px_140px_120px_110px_70px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold text-slate-500 xl:grid">
            <span>
              Mã yêu cầu
            </span>

                        <span>
              Khách hàng
            </span>

                        <span>
              Thiết bị
            </span>

                        <span>
              Ngày yêu cầu
            </span>

                        <span>
              Trạng thái
            </span>

                        <span>
              Ưu tiên
            </span>

                        <span className="text-right">
              Thao tác
            </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {filtered.map(
                            (item) => {
                                const statusInfo =
                                    STATUS[
                                        item.status
                                        ];

                                const priority =
                                    PRIORITY[
                                        item.priority
                                        ];

                                return (
                                    <article
                                        key={
                                            item.id
                                        }
                                        className="grid gap-4 px-5 py-4 transition hover:bg-slate-50 xl:grid-cols-[130px_minmax(200px,1fr)_140px_140px_120px_110px_70px] xl:items-center"
                                    >
                                        <Link
                                            to={`/sales/rental-requests/${item.id}`}
                                            className="text-xs font-bold text-blue-600"
                                        >
                                            {
                                                item.code
                                            }
                                        </Link>

                                        <div>
                                            <p className="text-sm font-bold text-slate-900">
                                                {
                                                    item.company
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {
                                                    item.contact
                                                }
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                {
                                                    item.equipment
                                                }{" "}
                                                thiết bị
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {
                                                    item.types
                                                }{" "}
                                                loại
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-slate-700">
                                                {
                                                    item.date
                                                }
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {
                                                    item.time
                                                }
                                            </p>
                                        </div>

                                        <span
                                            className={[
                                                "w-fit rounded-lg px-2.5 py-1 text-xs font-bold",
                                                statusInfo.className,
                                            ].join(" ")}
                                        >
                      {
                          statusInfo.label
                      }
                    </span>

                                        <div className="flex items-center gap-2">
                      <span
                          className={[
                              "size-2 rounded-full",
                              priority.dot,
                          ].join(" ")}
                      />

                                            <span className="text-xs text-slate-600">
                        {
                            priority.label
                        }
                      </span>
                                        </div>

                                        <div className="flex justify-end">
                                            <Link
                                                to={`/sales/rental-requests/${item.id}`}
                                                className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                                            >
                                                <Eye
                                                    size={
                                                        16
                                                    }
                                                />
                                            </Link>
                                        </div>
                                    </article>
                                );
                            },
                        )}
                    </div>

                    <footer className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-500">
                            Hiển thị 1 -{" "}
                            {filtered.length}{" "}
                            của 32 kết quả
                        </p>

                        <div className="flex items-center gap-1.5">
                            <button className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400">
                                <ChevronLeft
                                    size={16}
                                />
                            </button>

                            <button className="flex size-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                                1
                            </button>

                            <button className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600">
                                2
                            </button>

                            <button className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-sm text-slate-600">
                                3
                            </button>

                            <button className="flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400">
                                <ChevronRight
                                    size={16}
                                />
                            </button>
                        </div>
                    </footer>
                </section>
            </main>
        );
    };
