import {
    AlertTriangle,
    Box,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardCheck,
    Eye,
    MoreVertical,
    PackageCheck,
    Plus,
    RefreshCw,
    Search,
    ShieldCheck,
    Sparkles,
    UserRound,
    Wrench,
    X,
    type LucideIcon,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

type ReturnStatus =
    | "INSPECTING"
    | "PROCESSING"
    | "CLEANING"
    | "COMPLETED"
    | "DAMAGED";

type DamageLevel =
    | "LIGHT"
    | "MEDIUM"
    | "SEVERE";

interface ReturnRow {
    id: string;
    code: string;
    customer: string;
    equipment: string;
    serial: string;
    warehouse: string;
    status: ReturnStatus;
    createdAt: string;
    receiver: string;
}

interface ReturnFormPayload {
    customer: string;
    equipment: string;
    serial: string;
    warehouse: string;
    condition: string;
    receiver: string;
    note: string;
    quick: boolean;
}

interface ReturnSuccessData extends ReturnFormPayload {
    code: string;
    createdAt: string;
}

interface DamageItem {
    id: string;
    name: string;
    serial: string;
    level: DamageLevel;
    warehouse: string;
}

interface ActivityItem {
    id: string;
    icon: LucideIcon;
    title: string;
    meta: string;
    tone: "GREEN" | "BLUE" | "ORANGE" | "ROSE";
}

const STATUS: Record<
    ReturnStatus,
    { label: string; className: string }
> = {
    INSPECTING: {
        label: "Đang kiểm tra",
        className: "bg-blue-50 text-blue-700",
    },
    PROCESSING: {
        label: "Chờ xử lý",
        className: "bg-amber-50 text-amber-700",
    },
    CLEANING: {
        label: "Đang vệ sinh",
        className: "bg-violet-50 text-violet-700",
    },
    COMPLETED: {
        label: "Đã hoàn tất",
        className: "bg-emerald-50 text-emerald-700",
    },
    DAMAGED: {
        label: "Hư hỏng",
        className: "bg-rose-50 text-rose-700",
    },
};

const DAMAGE: Record<
    DamageLevel,
    { label: string; className: string }
> = {
    LIGHT: {
        label: "Nhẹ",
        className: "bg-emerald-50 text-emerald-700",
    },
    MEDIUM: {
        label: "Trung bình",
        className: "bg-amber-50 text-amber-700",
    },
    SEVERE: {
        label: "Nặng",
        className: "bg-rose-50 text-rose-700",
    },
};

const STEPS = [
    {
        icon: UserRound,
        title: "1. Tiếp nhận",
        description: "Nhận thiết bị khách trả về",
    },
    {
        icon: ClipboardCheck,
        title: "2. Kiểm tra",
        description: "Kiểm tra tình trạng và phụ kiện",
    },
    {
        icon: ShieldCheck,
        title: "3. Đánh giá",
        description: "Đánh giá hư hỏng nếu có",
    },
    {
        icon: Wrench,
        title: "4. Xử lý",
        description: "Vệ sinh, sửa chữa hoặc bảo trì",
    },
    {
        icon: CheckCircle2,
        title: "5. Hoàn tất",
        description: "Cập nhật kho và đóng phiếu",
    },
];

const ROWS: ReturnRow[] = [
    ["0247","Công ty ABC","Máy ảnh Sony A7S III","A7S3-1023","Hà Nội","INSPECTING","15/08/2026 08:45","Lê Văn Vận Hành"],
    ["0246","Công ty XYZ","Ống kính Sony 24-70mm GM II","GM2470-055","Đà Nẵng","PROCESSING","15/08/2026 08:20","Trần Minh Đức"],
    ["0245","Công ty DEF","Đèn LED Nanlite FS-300B","FS300B-221","TP.HCM","CLEANING","14/08/2026 17:30","Phạm Quốc Tuấn"],
    ["0244","Công ty GHI","Chân máy Manfrotto 055","MT055-334","Hà Nội","COMPLETED","14/08/2026 16:10","Lê Văn Vận Hành"],
    ["0243","Công ty JKL","Gimbal DJI RS 3","RS3-882","Đà Nẵng","COMPLETED","14/08/2026 15:05","Trần Minh Đức"],
    ["0242","Công ty MNO","Micro Rode Wireless GO II","RDEWGO2-112","TP.HCM","COMPLETED","14/08/2026 14:20","Phạm Quốc Tuấn"],
    ["0241","Công ty PQR","Flycam DJI Mini 3 Pro","MINI3P-665","Hà Nội","DAMAGED","14/08/2026 11:30","Lê Văn Vận Hành"],
    ["0240","Nguyễn Minh Studio","Đèn LED Aputure 300x","APT300X-009","Hà Nội","PROCESSING","13/08/2026 17:10","Trần Minh Đức"],
    ["0239","Dream Media","Ống kính Canon 70-200mm f/2.8","CAN70200-044","TP.HCM","DAMAGED","13/08/2026 15:40","Phạm Quốc Tuấn"],
    ["0238","Công ty TNHH Sự kiện Việt","Máy chiếu Epson EB-L630U","EPL630U-301","Đà Nẵng","INSPECTING","13/08/2026 14:15","Trần Minh Đức"],
    ["0237","Công ty Truyền thông Nova","Loa JBL EON715","EON715-019","Hà Nội","COMPLETED","12/08/2026 16:40","Lê Văn Vận Hành"],
    ["0236","Event House","Mixer Yamaha MG12XU","MG12XU-122","TP.HCM","CLEANING","12/08/2026 14:30","Phạm Quốc Tuấn"],
    ["0235","Công ty Sao Việt","Máy ảnh Canon EOS R6 Mark II","R6M2-088","Đà Nẵng","COMPLETED","11/08/2026 17:20","Trần Minh Đức"],
    ["0234","Blue Ocean Media","Đèn Godox SL200III","SL200-105","Hà Nội","PROCESSING","11/08/2026 10:05","Lê Văn Vận Hành"],
].map((r, i) => ({
    id: `return-${i + 1}`,
    code: `RT-2026-${r[0]}`,
    customer: r[1],
    equipment: r[2],
    serial: r[3],
    warehouse: r[4],
    status: r[5] as ReturnStatus,
    createdAt: r[6],
    receiver: r[7],
}));

const DAMAGES: DamageItem[] = [
    {
        id: "d1",
        name: "Máy ảnh Sony A7S III",
        serial: "A7S3-1011",
        level: "SEVERE",
        warehouse: "Hà Nội",
    },
    {
        id: "d2",
        name: "Ống kính Canon 70-200mm f/2.8",
        serial: "CAN70200-044",
        level: "MEDIUM",
        warehouse: "TP.HCM",
    },
    {
        id: "d3",
        name: "Đèn LED Aputure 300x",
        serial: "APT300X-009",
        level: "LIGHT",
        warehouse: "Hà Nội",
    },
];

const ACTIVITIES: ActivityItem[] = [
    {
        id: "a1",
        icon: PackageCheck,
        title: "RT-2026-0247 được tạo mới",
        meta: "08:45 • Lê Văn Vận Hành",
        tone: "GREEN",
    },
    {
        id: "a2",
        icon: Box,
        title: "Tiếp nhận thiết bị từ Công ty ABC",
        meta: "08:45 • Lê Văn Vận Hành",
        tone: "BLUE",
    },
    {
        id: "a3",
        icon: ClipboardCheck,
        title: "Bắt đầu kiểm tra RT-2026-0246",
        meta: "08:35 • Trần Minh Đức",
        tone: "ORANGE",
    },
    {
        id: "a4",
        icon: Sparkles,
        title: "Chuyển RT-2026-0245 sang vệ sinh",
        meta: "08:10 • Phạm Quốc Tuấn",
        tone: "BLUE",
    },
    {
        id: "a5",
        icon: CheckCircle2,
        title: "Hoàn tất RT-2026-0244 và cập nhật kho",
        meta: "07:55 • Lê Văn Vận Hành",
        tone: "GREEN",
    },
    {
        id: "a6",
        icon: AlertTriangle,
        title: "Phát hiện hư hỏng tại RT-2026-0241",
        meta: "07:40 • Lê Văn Vận Hành",
        tone: "ROSE",
    },
];

const CUSTOMERS = [
    "Công ty ABC",
    "Công ty XYZ",
    "Công ty DEF",
    "Công ty GHI",
    "Công ty JKL",
    "Nguyễn Minh Studio",
    "Dream Media",
    "Công ty TNHH Sự kiện Việt",
];

const EQUIPMENT = [
    "Máy ảnh Sony A7S III",
    "Ống kính Sony 24-70mm GM II",
    "Đèn LED Nanlite FS-300B",
    "Chân máy Manfrotto 055",
    "Gimbal DJI RS 3",
    "Micro Rode Wireless GO II",
    "Flycam DJI Mini 3 Pro",
];

const PAGE_SIZE = 7;

export const OperationsReturnsPage = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] =
        useState<ReturnStatus | "ALL">("ALL");
    const [warehouse, setWarehouse] =
        useState("ALL");
    const [dateFilter, setDateFilter] =
        useState("7_DAYS");
    const [page, setPage] = useState(1);
    const [rows, setRows] =
        useState<ReturnRow[]>(ROWS);
    const [selected, setSelected] =
        useState<ReturnRow | null>(null);
    const [successData, setSuccessData] =
        useState<ReturnSuccessData | null>(null);
    const [actionSuccess, setActionSuccess] =
        useState<{
            title: string;
            description: string;
        } | null>(null);
    const [modal, setModal] = useState<
        | "QUICK"
        | "CREATE"
        | "DETAIL"
        | "DAMAGE"
        | "ACTIVITY"
        | "ACTIONS"
        | null
    >(null);

    const filtered = useMemo(() => {
        const keyword = search
            .trim()
            .toLowerCase();

        return rows.filter((item) => {
            const searchable =
                `${item.code} ${item.customer} ${item.equipment} ${item.serial}`
                    .toLowerCase();

            return (
                (keyword === "" ||
                    searchable.includes(keyword)) &&
                (status === "ALL" ||
                    item.status === status) &&
                (warehouse === "ALL" ||
                    item.warehouse === warehouse)
            );
        });
    }, [search, status, warehouse, dateFilter, rows]);

    const totalPages = Math.max(
        1,
        Math.ceil(filtered.length / PAGE_SIZE),
    );

    const safePage = Math.min(
        page,
        totalPages,
    );

    const visibleRows = filtered.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE,
    );

    const resetFilters = () => {
        setSearch("");
        setStatus("ALL");
        setWarehouse("ALL");
        setDateFilter("7_DAYS");
        setPage(1);
    };

    const openDetail = (
        item: ReturnRow,
    ) => {
        setSelected(item);
        setModal("DETAIL");
    };

    const updateReturnStatus = (
        item: ReturnRow,
        nextStatus: ReturnStatus,
        title: string,
        description: string,
    ) => {
        const updatedItem: ReturnRow = {
            ...item,
            status: nextStatus,
        };

        setRows((current) =>
            current.map((row) =>
                row.id === item.id
                    ? updatedItem
                    : row,
            ),
        );
        setSelected(updatedItem);
        setModal(null);
        setActionSuccess({
            title,
            description,
        });
    };

    const handleStartInspection = (
        item: ReturnRow,
    ) => {
        updateReturnStatus(
            item,
            "INSPECTING",
            "Bắt đầu kiểm tra thành công",
            `Phiếu ${item.code} đã được chuyển sang bước kiểm tra thiết bị.`,
        );
    };

    const handleProcessReturn = (
        item: ReturnRow,
    ) => {
        updateReturnStatus(
            item,
            "PROCESSING",
            "Chuyển xử lý thành công",
            `Phiếu ${item.code} đã được chuyển sang bước xử lý.`,
        );
    };

    const handleCompleteReturn = (
        item: ReturnRow,
    ) => {
        updateReturnStatus(
            item,
            "COMPLETED",
            "Hoàn tất phiếu thành công",
            `Phiếu ${item.code} đã được hoàn tất và cập nhật trạng thái.`,
        );
    };

    const handleReturnCreated = (
        payload: ReturnFormPayload,
    ) => {
        const maxNumber = rows.reduce(
            (max, item) => {
                const current = Number(
                    item.code.split("-").at(-1),
                );

                return Number.isFinite(current)
                    ? Math.max(max, current)
                    : max;
            },
            0,
        );

        const code = `RT-2026-${String(
            maxNumber + 1,
        ).padStart(4, "0")}`;

        const createdAt =
            new Intl.DateTimeFormat(
                "vi-VN",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                },
            )
                .format(new Date())
                .replace(",", "");

        const receiver =
            payload.receiver.split(" — ")[0] ||
            "Lê Văn Vận Hành";

        const newRow: ReturnRow = {
            id: `return-${Date.now()}`,
            code,
            customer: payload.customer,
            equipment: payload.equipment,
            serial:
                payload.serial ||
                "Chưa cập nhật",
            warehouse:
                payload.warehouse ||
                "Hà Nội",
            status:
                payload.condition ===
                "Có dấu hiệu hư hỏng"
                    ? "DAMAGED"
                    : "INSPECTING",
            createdAt,
            receiver,
        };

        setRows((current) => [
            newRow,
            ...current,
        ]);
        setSelected(newRow);
        setPage(1);
        setModal(null);
        setSuccessData({
            ...payload,
            code,
            createdAt,
        });
    };

    return (
        <main className="space-y-4">
            <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-[26px] font-bold tracking-tight text-slate-950">
                        Nhận trả thiết bị
                    </h1>
                    <p className="mt-1 text-xs text-slate-500">
                        Tiếp nhận thiết bị trả về và đánh giá tình trạng.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            setModal("QUICK")
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                        <Plus size={15} />
                        Nhận trả nhanh
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setModal("CREATE")
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold !text-white hover:bg-blue-700"
                    >
                        <ClipboardCheck size={15} />
                        Tạo phiếu trả thiết bị
                    </button>
                </div>
            </header>

            <section className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-5">
                    {STEPS.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.title}
                                className="relative text-center"
                            >
                                {index <
                                STEPS.length - 1 ? (
                                    <span className="absolute left-[62%] right-[-38%] top-5 hidden border-t border-dashed border-blue-200 md:block" />
                                ) : null}

                                <span className="relative mx-auto flex size-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Icon size={17} />
                </span>

                                <p className="mt-3 text-xs font-bold text-slate-800">
                                    {step.title}
                                </p>

                                <p className="mx-auto mt-1 max-w-[145px] text-[10px] leading-4 text-slate-400">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,1fr)_290px]">
                <article className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex shrink-0 flex-col gap-2 border-b border-slate-100 p-3 xl:flex-row">
                        <label className="relative min-w-0 flex-1">
                            <Search
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Tìm mã phiếu, khách hàng, thiết bị..."
                                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-blue-500"
                            />
                        </label>

                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(
                                    e.target.value as
                                        | ReturnStatus
                                        | "ALL",
                                );
                                setPage(1);
                            }}
                            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
                        >
                            <option value="ALL">
                                Trạng thái: Tất cả
                            </option>
                            <option value="INSPECTING">
                                Đang kiểm tra
                            </option>
                            <option value="PROCESSING">
                                Chờ xử lý
                            </option>
                            <option value="CLEANING">
                                Đang vệ sinh
                            </option>
                            <option value="COMPLETED">
                                Đã hoàn tất
                            </option>
                            <option value="DAMAGED">
                                Hư hỏng
                            </option>
                        </select>

                        <select
                            value={warehouse}
                            onChange={(e) => {
                                setWarehouse(
                                    e.target.value,
                                );
                                setPage(1);
                            }}
                            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
                        >
                            <option value="ALL">
                                Kho: Tất cả
                            </option>
                            <option value="Hà Nội">
                                Hà Nội
                            </option>
                            <option value="Đà Nẵng">
                                Đà Nẵng
                            </option>
                            <option value="TP.HCM">
                                TP.HCM
                            </option>
                        </select>

                        <select
                            value={dateFilter}
                            onChange={(e) =>
                                setDateFilter(
                                    e.target.value,
                                )
                            }
                            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700"
                        >
                            <option value="7_DAYS">
                                Ngày tạo: 7 ngày qua
                            </option>
                            <option value="TODAY">
                                Hôm nay
                            </option>
                            <option value="30_DAYS">
                                30 ngày qua
                            </option>
                        </select>

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                            <RefreshCw size={13} />
                            Đặt lại
                        </button>
                    </div>

                    <div className="min-h-0 flex-1 overflow-x-auto">
                        <div className="flex h-full min-w-[850px] flex-col">
                            <div className="grid shrink-0 grid-cols-[110px_1fr_1.4fr_90px_105px_110px_95px] gap-3 bg-slate-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                                <span>Mã phiếu</span>
                                <span>Khách hàng</span>
                                <span>Thiết bị</span>
                                <span>Kho nhận</span>
                                <span>Trạng thái</span>
                                <span>Ngày tạo</span>
                                <span className="text-right">
                  Thao tác
                </span>
                            </div>

                            {visibleRows.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid min-h-[54px] flex-1 grid-cols-[110px_1fr_1.4fr_90px_105px_110px_95px] items-center gap-3 border-t border-slate-100 px-4 py-3 text-[11px] transition hover:bg-slate-50/70"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            openDetail(item)
                                        }
                                        className="text-left font-bold text-blue-600 hover:underline"
                                    >
                                        {item.code}
                                    </button>

                                    <span className="truncate font-semibold text-slate-800">
                    {item.customer}
                  </span>

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-slate-800">
                                            {item.equipment}
                                        </p>
                                        <p className="mt-0.5 truncate text-[9px] text-slate-400">
                                            SN: {item.serial}
                                        </p>
                                    </div>

                                    <span className="text-slate-600">
                    {item.warehouse}
                  </span>

                                    <span
                                        className={[
                                            "w-fit whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-bold",
                                            STATUS[item.status]
                                                .className,
                                        ].join(" ")}
                                    >
                    {
                        STATUS[item.status]
                            .label
                    }
                  </span>

                                    <div className="text-[10px] text-slate-600">
                                        {item.createdAt
                                            .split(" ")
                                            .map((part) => (
                                                <p key={part}>
                                                    {part}
                                                </p>
                                            ))}
                                    </div>

                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDetail(item)
                                            }
                                            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[10px] font-semibold text-blue-600 hover:bg-blue-50"
                                        >
                                            <Eye size={12} />
                                            Chi tiết
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelected(item);
                                                setModal(
                                                    "ACTIONS",
                                                );
                                            }}
                                            className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                                        >
                                            <MoreVertical
                                                size={15}
                                            />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <footer className="mt-auto flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-4 py-3">
                        <p className="text-[10px] text-slate-500">
                            Hiển thị{" "}
                            {(safePage - 1) *
                                PAGE_SIZE +
                                1}{" "}
                            đến{" "}
                            {Math.min(
                                safePage * PAGE_SIZE,
                                filtered.length,
                            )}{" "}
                            trong tổng số{" "}
                            {filtered.length} kết quả
                        </p>

                        <div className="flex gap-1">
                            <button
                                type="button"
                                disabled={safePage === 1}
                                onClick={() =>
                                    setPage(
                                        safePage - 1,
                                    )
                                }
                                className="flex size-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
                            >
                                <ChevronLeft
                                    size={13}
                                />
                            </button>

                            {Array.from(
                                {
                                    length:
                                    totalPages,
                                },
                                (_, i) => i + 1,
                            ).map((p) => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() =>
                                        setPage(p)
                                    }
                                    className={
                                        p === safePage
                                            ? "flex size-8 items-center justify-center rounded-lg bg-blue-600 text-[11px] font-bold !text-white"
                                            : "flex size-8 items-center justify-center rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-600"
                                    }
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                type="button"
                                disabled={
                                    safePage ===
                                    totalPages
                                }
                                onClick={() =>
                                    setPage(
                                        safePage + 1,
                                    )
                                }
                                className="flex size-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
                            >
                                <ChevronRight
                                    size={13}
                                />
                            </button>
                        </div>
                    </footer>
                </article>

                <aside className="space-y-4">
                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900">
                            Tổng quan nhận trả
                        </h2>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <SummaryCard
                                icon={PackageCheck}
                                label="Tổng phiếu"
                                value="24"
                                helper="+15%"
                                tone="BLUE"
                            />
                            <SummaryCard
                                icon={
                                    ClipboardCheck
                                }
                                label="Đang xử lý"
                                value="6"
                                helper="+20%"
                                tone="ORANGE"
                            />
                            <SummaryCard
                                icon={CheckCircle2}
                                label="Đã hoàn tất"
                                value="15"
                                helper="+25%"
                                tone="GREEN"
                            />
                            <SummaryCard
                                icon={
                                    AlertTriangle
                                }
                                label="Hư hỏng"
                                value="3"
                                helper="+50%"
                                tone="ROSE"
                            />
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-900">
                                Thiết bị hư hỏng
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setModal("DAMAGE")
                                }
                                className="text-[10px] font-bold text-blue-600"
                            >
                                Xem tất cả
                            </button>
                        </div>

                        <div className="mt-3 space-y-3">
                            {DAMAGES.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3"
                                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Box size={16} />
                  </span>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[11px] font-semibold text-slate-800">
                                            {item.name}
                                        </p>
                                        <p className="mt-0.5 text-[9px] text-slate-400">
                                            SN: {item.serial}
                                        </p>
                                    </div>

                                    <span
                                        className={[
                                            "rounded-full px-2 py-1 text-[8px] font-bold",
                                            DAMAGE[item.level]
                                                .className,
                                        ].join(" ")}
                                    >
                    {
                        DAMAGE[item.level]
                            .label
                    }
                  </span>
                                </div>
                            ))}
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900">
                            Hoạt động gần đây
                        </h2>

                        <div className="mt-3 space-y-3">
                            {ACTIVITIES.slice(
                                0,
                                3,
                            ).map((item) => (
                                <ActivityLine
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setModal(
                                    "ACTIVITY",
                                )
                            }
                            className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600"
                        >
                            Xem tất cả hoạt động
                            <ChevronRight
                                size={12}
                            />
                        </button>
                    </article>
                </aside>
            </section>

            {modal && (
                <Modal
                    title={
                        modal === "QUICK"
                            ? "Nhận trả nhanh"
                            : modal === "CREATE"
                                ? "Tạo phiếu trả thiết bị"
                                : modal === "DETAIL"
                                    ? "Chi tiết phiếu nhận trả"
                                    : modal === "DAMAGE"
                                        ? "Danh sách thiết bị hư hỏng"
                                        : modal === "ACTIVITY"
                                            ? "Tất cả hoạt động nhận trả"
                                            : "Thao tác phiếu nhận trả"
                    }
                    size={
                        modal ===
                        "ACTIVITY" ||
                        modal === "DAMAGE"
                            ? "LARGE"
                            : "DEFAULT"
                    }
                    onClose={() =>
                        setModal(null)
                    }
                >
                    {modal === "QUICK" ? (
                        <ReturnForm
                            quick
                            onDone={
                                handleReturnCreated
                            }
                        />
                    ) : modal === "CREATE" ? (
                        <ReturnForm
                            onDone={
                                handleReturnCreated
                            }
                        />
                    ) : modal ===
                    "DETAIL" &&
                    selected ? (
                        <ReturnDetail
                            item={selected}
                            onStartInspection={() =>
                                handleStartInspection(
                                    selected,
                                )
                            }
                            onComplete={() =>
                                handleCompleteReturn(
                                    selected,
                                )
                            }
                        />
                    ) : modal === "DAMAGE" ? (
                        <DamageList />
                    ) : modal ===
                    "ACTIVITY" ? (
                        <ActivityList />
                    ) : selected ? (
                        <ActionMenu
                            item={selected}
                            onDetail={() =>
                                setModal(
                                    "DETAIL",
                                )
                            }
                            onStartInspection={() =>
                                handleStartInspection(
                                    selected,
                                )
                            }
                            onProcess={() =>
                                handleProcessReturn(
                                    selected,
                                )
                            }
                            onComplete={() =>
                                handleCompleteReturn(
                                    selected,
                                )
                            }
                        />
                    ) : null}
                </Modal>
            )}

            {successData ? (
                <SuccessDialog
                    data={successData}
                    onClose={() =>
                        setSuccessData(null)
                    }
                    onView={() => {
                        setSuccessData(null);
                        setModal("DETAIL");
                    }}
                />
            ) : null}

            {actionSuccess ? (
                <ActionSuccessDialog
                    title={actionSuccess.title}
                    description={
                        actionSuccess.description
                    }
                    onClose={() =>
                        setActionSuccess(null)
                    }
                    onView={() => {
                        setActionSuccess(null);
                        setModal("DETAIL");
                    }}
                />
            ) : null}
        </main>
    );
};

const SummaryCard = ({
                         icon: Icon,
                         label,
                         value,
                         helper,
                         tone,
                     }: {
    icon: LucideIcon;
    label: string;
    value: string;
    helper: string;
    tone:
        | "BLUE"
        | "ORANGE"
        | "GREEN"
        | "ROSE";
}) => {
    const toneClass = {
        BLUE:
            "bg-blue-50 text-blue-600",
        ORANGE:
            "bg-orange-50 text-orange-600",
        GREEN:
            "bg-emerald-50 text-emerald-600",
        ROSE:
            "bg-rose-50 text-rose-600",
    }[tone];

    return (
        <div className="rounded-xl border border-slate-100 p-3">
      <span
          className={[
              "flex size-8 items-center justify-center rounded-xl",
              toneClass,
          ].join(" ")}
      >
        <Icon size={15} />
      </span>

            <p className="mt-3 text-xl font-bold leading-none text-slate-950">
                {value}
            </p>
            <p className="mt-1 text-[9px] text-slate-400">
                {label}
            </p>
            <p className="mt-1 text-[9px] font-bold text-emerald-600">
                ↗ {helper}
            </p>
        </div>
    );
};

const ActivityLine = ({
                          item,
                      }: {
    item: ActivityItem;
}) => {
    const Icon = item.icon;
    const toneClass = {
        GREEN:
            "bg-emerald-50 text-emerald-600",
        BLUE:
            "bg-blue-50 text-blue-600",
        ORANGE:
            "bg-orange-50 text-orange-600",
        ROSE:
            "bg-rose-50 text-rose-600",
    }[item.tone];

    return (
        <div className="flex items-start gap-2">
      <span
          className={[
              "flex size-7 shrink-0 items-center justify-center rounded-full",
              toneClass,
          ].join(" ")}
      >
        <Icon size={13} />
      </span>

            <div>
                <p className="text-[10px] font-semibold text-slate-800">
                    {item.title}
                </p>
                <p className="mt-0.5 text-[9px] text-slate-400">
                    {item.meta}
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
    size?:
        | "DEFAULT"
        | "LARGE";
}) => {
    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-[2px]"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div
                className={[
                    "w-full rounded-2xl bg-white p-5 shadow-2xl",
                    size === "LARGE"
                        ? "max-w-3xl"
                        : "max-w-lg",
                ].join(" ")}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-950">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        aria-label="Đóng"
                    >
                        <X size={16} />
                    </button>
                </div>

                {children}
            </div>
        </div>
    );
};

const SuccessDialog = ({
                           data,
                           onClose,
                           onView,
                       }: {
    data: ReturnSuccessData;
    onClose: () => void;
    onView: () => void;
}) => {
    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent,
        ) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[3px]"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="px-6 pb-5 pt-7 text-center">
                    <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
                        <CheckCircle2
                            size={34}
                            strokeWidth={2.2}
                        />
                    </span>

                    <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950">
                        {data.quick
                            ? "Tiếp nhận thiết bị thành công"
                            : "Tạo phiếu trả thành công"}
                    </h2>

                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                        {data.quick
                            ? "Thiết bị đã được ghi nhận trả về và chuyển sang bước kiểm tra."
                            : "Phiếu trả thiết bị đã được tạo và sẵn sàng để bộ phận vận hành xử lý."}
                    </p>
                </div>

                <div className="mx-6 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <SuccessInfo
                        label="Mã phiếu"
                        value={data.code}
                        highlight
                    />
                    <SuccessInfo
                        label="Khách hàng"
                        value={data.customer}
                    />
                    <SuccessInfo
                        label="Thiết bị"
                        value={data.equipment}
                    />

                    {!data.quick ? (
                        <>
                            <SuccessInfo
                                label="Serial"
                                value={
                                    data.serial ||
                                    "Chưa cập nhật"
                                }
                            />
                            <SuccessInfo
                                label="Kho nhận"
                                value={
                                    data.warehouse
                                }
                            />
                            <SuccessInfo
                                label="Người tiếp nhận"
                                value={data.receiver}
                            />
                        </>
                    ) : null}

                    <SuccessInfo
                        label="Tình trạng"
                        value={data.condition}
                    />
                </div>

                <div className="grid grid-cols-2 gap-3 px-6 pb-6 pt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                        Đóng
                    </button>

                    <button
                        type="button"
                        onClick={onView}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold !text-white transition hover:bg-blue-700"
                    >
                        <Eye size={15} />
                        Xem phiếu
                    </button>
                </div>
            </div>
        </div>
    );
};


const ActionSuccessDialog = ({
                                 title,
                                 description,
                                 onClose,
                                 onView,
                             }: {
    title: string;
    description: string;
    onClose: () => void;
    onView: () => void;
}) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
        <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="px-6 pb-5 pt-7 text-center">
                <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
                    <CheckCircle2
                        size={34}
                        strokeWidth={2.2}
                    />
                </span>

                <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950">
                    {title}
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    {description}
                </p>
            </div>

            <div className="mx-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700">
                    <ShieldCheck size={16} />
                    Thao tác đã được ghi nhận thành công
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 px-6 pb-6 pt-5">
                <button
                    type="button"
                    onClick={onClose}
                    className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                    Đóng
                </button>

                <button
                    type="button"
                    onClick={onView}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold !text-white transition hover:bg-blue-700"
                >
                    <Eye size={15} />
                    Xem phiếu
                </button>
            </div>
        </div>
    </div>
);

const SuccessInfo = ({
                         label,
                         value,
                         highlight = false,
                     }: {
    label: string;
    value: string;
    highlight?: boolean;
}) => (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 py-2.5 last:border-b-0 last:pb-0 first:pt-0">
        <span className="shrink-0 text-xs text-slate-500">
            {label}
        </span>
        <span
            className={
                highlight
                    ? "text-right text-xs font-bold text-blue-600"
                    : "text-right text-xs font-semibold text-slate-800"
            }
        >
            {value}
        </span>
    </div>
);

const ReturnForm = ({
                        quick = false,
                        onDone,
                    }: {
    quick?: boolean;
    onDone: (
        payload: ReturnFormPayload,
    ) => void;
}) => (
    <form
        onSubmit={(event) => {
            event.preventDefault();

            const formData =
                new FormData(
                    event.currentTarget,
                );

            onDone({
                customer: String(
                    formData.get(
                        "customer",
                    ) ?? CUSTOMERS[0],
                ),
                equipment: String(
                    formData.get(
                        "equipment",
                    ) ?? EQUIPMENT[0],
                ),
                serial: String(
                    formData.get(
                        "serial",
                    ) ?? "",
                ).trim(),
                warehouse: String(
                    formData.get(
                        "warehouse",
                    ) ?? "",
                ),
                condition: String(
                    formData.get(
                        "condition",
                    ) ?? "Bình thường",
                ),
                receiver: String(
                    formData.get(
                        "receiver",
                    ) ??
                    "Lê Văn Vận Hành — Nhân viên vận hành",
                ),
                note: String(
                    formData.get(
                        "note",
                    ) ?? "",
                ).trim(),
                quick,
            });
        }}
        className="space-y-4"
    >
        <Field
            name="customer"
            label="Khách hàng"
            options={CUSTOMERS}
        />

        <Field
            name="equipment"
            label="Thiết bị"
            options={EQUIPMENT}
        />

        {!quick ? (
            <div className="grid gap-3 sm:grid-cols-2">
                <div>
                    <FieldLabel>
                        Serial
                    </FieldLabel>
                    <input
                        required
                        name="serial"
                        placeholder="VD: A7S3-1023"
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                <Field
                    name="warehouse"
                    label="Kho nhận"
                    options={[
                        "Hà Nội",
                        "Đà Nẵng",
                        "TP.HCM",
                    ]}
                />
            </div>
        ) : null}

        <Field
            name="condition"
            label="Tình trạng ban đầu"
            options={[
                "Bình thường",
                "Có dấu hiệu hư hỏng",
                "Thiếu phụ kiện",
                "Cần vệ sinh",
            ]}
        />

        {!quick ? (
            <>
                <Field
                    name="receiver"
                    label="Người tiếp nhận"
                    options={[
                        "Lê Văn Vận Hành — Nhân viên vận hành",
                        "Trần Minh Đức — Nhân viên vận hành",
                        "Phạm Quốc Tuấn — Nhân viên vận hành",
                    ]}
                />

                <div>
                    <FieldLabel>
                        Ghi chú
                    </FieldLabel>
                    <textarea
                        name="note"
                        rows={3}
                        placeholder="Ghi chú tình trạng thiết bị, phụ kiện đi kèm..."
                        className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </>
        ) : null}

        <button
            type="submit"
            className="h-10 w-full rounded-xl bg-blue-600 text-sm font-bold !text-white transition hover:bg-blue-700"
        >
            {quick
                ? "Xác nhận tiếp nhận"
                : "Tạo phiếu trả thiết bị"}
        </button>
    </form>
);

const Field = ({
                   name,
                   label,
                   options,
               }: {
    name: string;
    label: string;
    options: string[];
}) => (
    <div>
        <FieldLabel>
            {label}
        </FieldLabel>
        <select
            name={name}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
            {options.map((item) => (
                <option
                    key={item}
                    value={item}
                >
                    {item}
                </option>
            ))}
        </select>
    </div>
);

const FieldLabel = ({
                        children,
                    }: {
    children: ReactNode;
}) => (
    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
        {children}
    </label>
);

const ReturnDetail = ({
                          item,
                          onStartInspection,
                          onComplete,
                      }: {
    item: ReturnRow;
    onStartInspection: () => void;
    onComplete: () => void;
}) => (
    <div className="space-y-3">
        <Info
            label="Mã phiếu"
            value={item.code}
        />
        <Info
            label="Khách hàng"
            value={item.customer}
        />
        <Info
            label="Thiết bị"
            value={item.equipment}
        />
        <Info
            label="Serial"
            value={item.serial}
        />
        <Info
            label="Kho nhận"
            value={item.warehouse}
        />
        <Info
            label="Người tiếp nhận"
            value={item.receiver}
        />
        <Info
            label="Trạng thái"
            value={
                STATUS[item.status].label
            }
        />

        <div className="grid grid-cols-2 gap-2 pt-2">
            <button
                type="button"
                onClick={onStartInspection}
                disabled={
                    item.status ===
                    "COMPLETED"
                }
                className="h-9 rounded-xl bg-blue-600 text-xs font-bold !text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                {item.status ===
                "INSPECTING"
                    ? "Tiếp tục kiểm tra"
                    : "Bắt đầu kiểm tra"}
            </button>

            <button
                type="button"
                onClick={onComplete}
                disabled={
                    item.status ===
                    "COMPLETED"
                }
                className="h-9 rounded-xl bg-emerald-600 text-xs font-bold !text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                {item.status ===
                "COMPLETED"
                    ? "Đã hoàn tất"
                    : "Hoàn tất phiếu"}
            </button>
        </div>
    </div>
);

const DamageList = () => (
    <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-[minmax(0,1.5fr)_120px_100px_110px] gap-3 bg-slate-50 px-4 py-2.5 text-[10px] font-bold uppercase text-slate-400">
            <span>Thiết bị</span>
            <span>Serial</span>
            <span>Kho</span>
            <span>Mức độ</span>
        </div>

        {DAMAGES.map((item) => (
            <div
                key={item.id}
                className="grid grid-cols-[minmax(0,1.5fr)_120px_100px_110px] items-center gap-3 border-t border-slate-100 px-4 py-3 text-xs"
            >
        <span className="font-semibold text-slate-800">
          {item.name}
        </span>
                <span>
          {item.serial}
        </span>
                <span>
          {item.warehouse}
        </span>
                <span
                    className={[
                        "w-fit rounded-full px-2 py-1 text-[9px] font-bold",
                        DAMAGE[item.level]
                            .className,
                    ].join(" ")}
                >
          {
              DAMAGE[item.level]
                  .label
          }
        </span>
            </div>
        ))}
    </div>
);

const ActivityList = () => (
    <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-[44px_minmax(0,1fr)_180px] gap-3 bg-slate-50 px-4 py-2.5 text-[10px] font-bold uppercase text-slate-400">
            <span />
            <span>Hoạt động</span>
            <span>
        Thời gian / Người thực hiện
      </span>
        </div>

        {ACTIVITIES.map((item) => {
            const Icon = item.icon;
            const [time, actor] =
                item.meta.split(" • ");

            return (
                <div
                    key={item.id}
                    className="grid grid-cols-[44px_minmax(0,1fr)_180px] items-center gap-3 border-t border-slate-100 px-4 py-3"
                >
          <span className="flex size-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Icon size={14} />
          </span>

                    <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                    </p>

                    <div>
                        <p className="text-xs font-semibold text-slate-700">
                            {time}
                        </p>
                        <p className="text-[11px] text-slate-400">
                            {actor}
                        </p>
                    </div>
                </div>
            );
        })}
    </div>
);

const ActionMenu = ({
                        item,
                        onDetail,
                        onStartInspection,
                        onProcess,
                        onComplete,
                    }: {
    item: ReturnRow;
    onDetail: () => void;
    onStartInspection: () => void;
    onProcess: () => void;
    onComplete: () => void;
}) => (
    <div className="space-y-2">
        {[
            {
                label: "Xem chi tiết",
                icon: Eye,
                action: onDetail,
                disabled: false,
            },
            {
                label:
                    item.status ===
                    "INSPECTING"
                        ? "Tiếp tục kiểm tra"
                        : "Bắt đầu kiểm tra",
                icon: ClipboardCheck,
                action: onStartInspection,
                disabled:
                    item.status ===
                    "COMPLETED",
            },
            {
                label: "Chuyển sang xử lý",
                icon: Wrench,
                action: onProcess,
                disabled:
                    item.status ===
                    "COMPLETED",
            },
            {
                label:
                    item.status ===
                    "COMPLETED"
                        ? "Đã hoàn tất"
                        : "Hoàn tất phiếu",
                icon: CheckCircle2,
                action: onComplete,
                disabled:
                    item.status ===
                    "COMPLETED",
            },
        ].map((action) => {
            const Icon = action.icon;

            return (
                <button
                    key={action.label}
                    type="button"
                    onClick={action.action}
                    disabled={action.disabled}
                    className="flex h-10 w-full items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                >
                    <Icon size={15} />
                    {action.label}
                </button>
            );
        })}
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