import {
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CircleAlert,

    Clock3,
    Download,
    Eye,
    Gauge,
    Search,
    SlidersHorizontal,

    Wrench,
    X,
    type LucideIcon,
} from "lucide-react";

import {
    useMemo,
    useState,
    type FormEvent,
    type ReactNode,
} from "react";

type MaintenanceStatus =
    | "PENDING"
    | "REPAIRING"
    | "SCHEDULED"
    | "COMPLETED";

type MaintenancePriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH";

type MaintenanceKind =
    | "REPAIR"
    | "PERIODIC";

interface MaintenanceRow {
    id: string;
    code: string;
    equipment: string;
    category: string;
    serial: string;
    issue: string;
    technician: string;
    priority: MaintenancePriority;
    status: MaintenanceStatus;
    appointmentDate: string;
    appointmentTime: string;
    warehouse: string;
    kind: MaintenanceKind;
}

interface TechnicianItem {
    id: string;
    name: string;
    task: string;
    time: string;
    avatar: string;
}

interface AlertItem {
    id: string;
    equipment: string;
    overdueDays: number;
    warehouse: string;
}

interface SuccessData {
    title: string;
    description: string;
    code?: string;
}

const STATUS_CONFIG: Record<
    MaintenanceStatus,
    {
        label: string;
        className: string;
    }
> = {
    PENDING: {
        label: "Chờ xử lý",
        className: "bg-orange-50 text-orange-700",
    },
    REPAIRING: {
        label: "Đang sửa",
        className: "bg-blue-50 text-blue-700",
    },
    SCHEDULED: {
        label: "Bảo trì định kỳ",
        className: "bg-violet-50 text-violet-700",
    },
    COMPLETED: {
        label: "Hoàn thành",
        className: "bg-emerald-50 text-emerald-700",
    },
};

const PRIORITY_CONFIG: Record<
    MaintenancePriority,
    {
        label: string;
        className: string;
    }
> = {
    HIGH: {
        label: "Cao",
        className: "bg-rose-50 text-rose-700",
    },
    MEDIUM: {
        label: "Trung bình",
        className: "bg-amber-50 text-amber-700",
    },
    LOW: {
        label: "Thấp",
        className: "bg-emerald-50 text-emerald-700",
    },
};

const INITIAL_MAINTENANCE_DATA: MaintenanceRow[] = [
    {
        id: "maintenance-642",
        code: "MT-2026-0642",
        equipment: "Canon XA60",
        category: "Máy quay chuyên nghiệp",
        serial: "XA60-22018",
        issue: "Không lên nguồn",
        technician: "Nguyễn Minh Tuấn",
        priority: "HIGH",
        status: "REPAIRING",
        appointmentDate: "15/08/2026",
        appointmentTime: "09:00",
        warehouse: "Hà Nội",
        kind: "REPAIR",
    },
    {
        id: "maintenance-641",
        code: "MT-2026-0641",
        equipment: "Sony FE 24-70mm GM II",
        category: "Ống kính",
        serial: "GM2-91822",
        issue: "Lỗi lấy nét",
        technician: "Trần Quốc Bảo",
        priority: "MEDIUM",
        status: "PENDING",
        appointmentDate: "16/08/2026",
        appointmentTime: "14:30",
        warehouse: "Hà Nội",
        kind: "REPAIR",
    },
    {
        id: "maintenance-640",
        code: "MT-2026-0640",
        equipment: "Manfrotto 055",
        category: "Chân máy",
        serial: "MT055-55031",
        issue: "Khóa chân bị lỏng",
        technician: "Phạm Hoàng Nam",
        priority: "LOW",
        status: "SCHEDULED",
        appointmentDate: "18/08/2026",
        appointmentTime: "10:00",
        warehouse: "Đà Nẵng",
        kind: "PERIODIC",
    },
    {
        id: "maintenance-639",
        code: "MT-2026-0639",
        equipment: "Aputure 300x",
        category: "Đèn LED",
        serial: "APT300X-1007",
        issue: "Quạt tản nhiệt kêu to",
        technician: "Lê Hoàng Phúc",
        priority: "HIGH",
        status: "REPAIRING",
        appointmentDate: "14/08/2026",
        appointmentTime: "16:00",
        warehouse: "TP.HCM",
        kind: "REPAIR",
    },
    {
        id: "maintenance-638",
        code: "MT-2026-0638",
        equipment: "Rode Wireless GO II",
        category: "Micro không dây",
        serial: "RDEWGO2-3821",
        issue: "Mất tín hiệu 1 kênh",
        technician: "Đặng Văn Khoa",
        priority: "MEDIUM",
        status: "COMPLETED",
        appointmentDate: "12/08/2026",
        appointmentTime: "11:00",
        warehouse: "Hà Nội",
        kind: "REPAIR",
    },
    {
        id: "maintenance-637",
        code: "MT-2026-0637",
        equipment: "DJI Mini 4 Pro",
        category: "Flycam",
        serial: "DJIM4P-0921",
        issue: "Cảm biến tránh vật cản lỗi",
        technician: "Nguyễn Minh Tuấn",
        priority: "HIGH",
        status: "PENDING",
        appointmentDate: "17/08/2026",
        appointmentTime: "09:30",
        warehouse: "Đà Nẵng",
        kind: "REPAIR",
    },
    {
        id: "maintenance-636",
        code: "MT-2026-0636",
        equipment: "Epson EB-L630U",
        category: "Máy chiếu",
        serial: "EPL630-301",
        issue: "Bảo trì hệ thống quang học",
        technician: "Trần Quốc Bảo",
        priority: "MEDIUM",
        status: "SCHEDULED",
        appointmentDate: "19/08/2026",
        appointmentTime: "13:30",
        warehouse: "TP.HCM",
        kind: "PERIODIC",
    },
    {
        id: "maintenance-635",
        code: "MT-2026-0635",
        equipment: "JBL EON715",
        category: "Loa",
        serial: "EON715-019",
        issue: "Kiểm tra định kỳ 6 tháng",
        technician: "Phạm Hoàng Nam",
        priority: "LOW",
        status: "COMPLETED",
        appointmentDate: "10/08/2026",
        appointmentTime: "15:00",
        warehouse: "Hà Nội",
        kind: "PERIODIC",
    },
];


const STATUS_TARGET_COUNTS: Record<
    MaintenanceStatus,
    number
> = {
    PENDING: 18,
    REPAIRING: 15,
    SCHEDULED: 26,
    COMPLETED: 142,
};

const createInitialMaintenanceData =
    (): MaintenanceRow[] => {
        const data: MaintenanceRow[] = [
            ...INITIAL_MAINTENANCE_DATA,
        ];

        (
            Object.entries(
                STATUS_TARGET_COUNTS,
            ) as Array<
                [
                    MaintenanceStatus,
                    number,
                ]
            >
        ).forEach(
            ([
                 targetStatus,
                 targetCount,
             ]) => {
                const templates =
                    INITIAL_MAINTENANCE_DATA.filter(
                        (item) =>
                            item.status ===
                            targetStatus,
                    );

                const currentCount =
                    data.filter(
                        (item) =>
                            item.status ===
                            targetStatus,
                    ).length;

                for (
                    let index =
                        currentCount;
                    index <
                    targetCount;
                    index += 1
                ) {
                    const template =
                        templates[
                        index %
                        templates.length
                            ];

                    const sequence =
                        1000 +
                        data.length +
                        1;

                    data.push({
                        ...template,
                        id: `maintenance-generated-${targetStatus}-${index + 1}`,
                        code: `MT-2026-${String(
                            sequence,
                        ).padStart(
                            4,
                            "0",
                        )}`,
                        serial: `${template.serial}-M${String(
                            index + 1,
                        ).padStart(
                            3,
                            "0",
                        )}`,
                    });
                }
            },
        );

        return data;
    };

const TECHNICIANS: TechnicianItem[] = [
    {
        id: "tech-1",
        name: "Nguyễn Minh Tuấn",
        task: "Sửa Canon XA60",
        time: "09:00 - 11:30",
        avatar: "MT",
    },
    {
        id: "tech-2",
        name: "Trần Quốc Bảo",
        task: "Kiểm tra Sony FE 24-70mm GM II",
        time: "14:30 - 16:30",
        avatar: "QB",
    },
    {
        id: "tech-3",
        name: "Phạm Hoàng Nam",
        task: "Bảo trì Manfrotto 055",
        time: "10:00 - 12:00",
        avatar: "HN",
    },
    {
        id: "tech-4",
        name: "Lê Hoàng Phúc",
        task: "Sửa Aputure 300x",
        time: "16:00 - 18:00",
        avatar: "HP",
    },
    {
        id: "tech-5",
        name: "Đặng Văn Khoa",
        task: "Kiểm tra Rode Wireless GO II",
        time: "11:00 - 12:30",
        avatar: "VK",
    },
];

const MAINTENANCE_ALERTS: AlertItem[] = [
    {
        id: "alert-1",
        equipment: "Máy chiếu Epson EH-TW7000",
        overdueDays: 7,
        warehouse: "Hà Nội",
    },
    {
        id: "alert-2",
        equipment: "Đèn LED Nanlite FS-300B",
        overdueDays: 5,
        warehouse: "Đà Nẵng",
    },
    {
        id: "alert-3",
        equipment: "Gimbal DJI RS 3 Pro",
        overdueDays: 4,
        warehouse: "TP.HCM",
    },
    {
        id: "alert-4",
        equipment: "Ống kính Sigma 35mm f/1.4",
        overdueDays: 3,
        warehouse: "Hà Nội",
    },
    {
        id: "alert-5",
        equipment: "Mixer Yamaha MG12XU",
        overdueDays: 2,
        warehouse: "TP.HCM",
    },
];

const EQUIPMENT_OPTIONS = [
    "Canon XA60",
    "Sony FE 24-70mm GM II",
    "Manfrotto 055",
    "Aputure 300x",
    "Rode Wireless GO II",
    "DJI Mini 4 Pro",
    "Epson EB-L630U",
    "JBL EON715",
];

const TECHNICIAN_OPTIONS = TECHNICIANS.map(
    (item) => item.name,
);

const PAGE_SIZE = 5;


const getPaginationItems = (
    currentPage: number,
    totalPages: number,
): Array<number | "ELLIPSIS_LEFT" | "ELLIPSIS_RIGHT"> => {
    if (totalPages <= 7) {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1,
        );
    }

    if (currentPage <= 4) {
        return [
            1,
            2,
            3,
            4,
            5,
            "ELLIPSIS_RIGHT",
            totalPages,
        ];
    }

    if (currentPage >= totalPages - 3) {
        return [
            1,
            "ELLIPSIS_LEFT",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [
        1,
        "ELLIPSIS_LEFT",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "ELLIPSIS_RIGHT",
        totalPages,
    ];
};



export const OperationsMaintenancePage = () => {
    const [
        rows,
        setRows,
    ] = useState<MaintenanceRow[]>(
        () =>
            createInitialMaintenanceData(),
    );

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        status,
        setStatus,
    ] = useState<
        MaintenanceStatus | "ALL"
    >("ALL");

    const [
        priority,
        setPriority,
    ] = useState<
        MaintenancePriority | "ALL"
    >("ALL");

    const [
        timeFilter,
        setTimeFilter,
    ] = useState("ALL");

    const [
        page,
        setPage,
    ] = useState(1);

    const [
        selected,
        setSelected,
    ] = useState<MaintenanceRow | null>(
        null,
    );

    const [
        modal,
        setModal,
    ] = useState<
        | "CREATE_REPAIR"
        | "SCHEDULE"
        | "DETAIL"
        | "HEALTH"
        | "STATUS"
        | "TECHNICIANS"
        | "ALERTS"
        | null
    >(null);

    const [
        success,
        setSuccess,
    ] = useState<SuccessData | null>(
        null,
    );

    const statusCounts = useMemo(
        () => ({
            PENDING: rows.filter(
                (item) =>
                    item.status ===
                    "PENDING",
            ).length,
            REPAIRING: rows.filter(
                (item) =>
                    item.status ===
                    "REPAIRING",
            ).length,
            SCHEDULED: rows.filter(
                (item) =>
                    item.status ===
                    "SCHEDULED",
            ).length,
            COMPLETED: rows.filter(
                (item) =>
                    item.status ===
                    "COMPLETED",
            ).length,
        }),
        [rows],
    );

    const filtered = useMemo(() => {
        const keyword = search
            .trim()
            .toLowerCase();

        return rows.filter((item) => {
            const searchable =
                `${item.code} ${item.equipment} ${item.serial} ${item.issue} ${item.technician}`
                    .toLowerCase();

            return (
                (keyword === "" ||
                    searchable.includes(keyword)) &&
                (status === "ALL" ||
                    item.status === status) &&
                (priority === "ALL" ||
                    item.priority === priority)
            );
        });
    }, [
        rows,
        search,
        status,
        priority,
        timeFilter,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filtered.length / PAGE_SIZE,
        ),
    );

    const safePage = Math.min(
        page,
        totalPages,
    );

    const visibleRows = filtered.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE,
    );

    const paginationItems =
        getPaginationItems(
            safePage,
            totalPages,
        );

    const resetFilters = () => {
        setSearch("");
        setStatus("ALL");
        setPriority("ALL");
        setTimeFilter("ALL");
        setPage(1);
    };

    const downloadMaintenanceReport = () => {
        const header = [
            "Mã phiếu",
            "Thiết bị",
            "Serial",
            "Lỗi / Công việc",
            "Kỹ thuật viên",
            "Ưu tiên",
            "Trạng thái",
            "Lịch hẹn",
            "Kho",
        ];

        const csvRows = filtered.map((item) => [
            item.code,
            item.equipment,
            item.serial,
            item.issue,
            item.technician,
            PRIORITY_CONFIG[item.priority].label,
            STATUS_CONFIG[item.status].label,
            `${item.appointmentDate} ${item.appointmentTime}`,
            item.warehouse,
        ]);

        const escapeCsv = (value: string) =>
            `"${value.replace(/"/g, '""')}"`;

        const csv = [
            header,
            ...csvRows,
        ]
            .map((row) =>
                row
                    .map((value) =>
                        escapeCsv(String(value)),
                    )
                    .join(","),
            )
            .join("\n");

        const blob = new Blob(
            ["\uFEFF", csv],
            {
                type: "text/csv;charset=utf-8;",
            },
        );

        const url =
            URL.createObjectURL(blob);
        const anchor =
            document.createElement("a");

        anchor.href = url;
        anchor.download =
            "bao-tri-sua-chua.csv";
        anchor.click();

        URL.revokeObjectURL(url);
    };

    const openDetail = (
        item: MaintenanceRow,
    ) => {
        setSelected(item);
        setModal("DETAIL");
    };

    const showSuccess = (
        data: SuccessData,
    ) => {
        setModal(null);
        setSuccess(data);
    };

    const createRepairRequest = (
        input: RepairRequestInput,
    ) => {
        const code = `MT-2026-${String(
            643 + rows.length,
        ).padStart(4, "0")}`;

        const newRow: MaintenanceRow = {
            id: `maintenance-new-${Date.now()}`,
            code,
            equipment: input.equipment,
            category: "Thiết bị cho thuê",
            serial: input.serial,
            issue: input.issue,
            technician: input.technician,
            priority: input.priority,
            status: "PENDING",
            appointmentDate: input.date,
            appointmentTime: input.time,
            warehouse: input.warehouse,
            kind: "REPAIR",
        };

        setRows((current) => [
            newRow,
            ...current,
        ]);
        setSelected(newRow);
        setPage(1);

        showSuccess({
            title:
                "Tạo yêu cầu sửa chữa thành công",
            description:
                "Phiếu sửa chữa đã được ghi nhận và đang chờ kỹ thuật viên tiếp nhận.",
            code,
        });
    };

    const createSchedule = (
        input: ScheduleInput,
    ) => {
        const code = `MT-2026-${String(
            700 + rows.length,
        ).padStart(4, "0")}`;

        const newRow: MaintenanceRow = {
            id: `maintenance-schedule-${Date.now()}`,
            code,
            equipment: input.equipment,
            category: "Thiết bị cho thuê",
            serial: input.serial,
            issue: input.work,
            technician: input.technician,
            priority: input.priority,
            status: "SCHEDULED",
            appointmentDate: input.date,
            appointmentTime: input.time,
            warehouse: input.warehouse,
            kind: "PERIODIC",
        };

        setRows((current) => [
            newRow,
            ...current,
        ]);
        setSelected(newRow);
        setPage(1);

        showSuccess({
            title:
                "Lập lịch bảo trì thành công",
            description:
                "Lịch bảo trì định kỳ đã được tạo và phân công cho kỹ thuật viên.",
            code,
        });
    };

    const updateSelectedStatus = (
        nextStatus: MaintenanceStatus,
    ) => {
        if (!selected) {
            return;
        }

        const updated: MaintenanceRow = {
            ...selected,
            status: nextStatus,
        };

        setRows((current) =>
            current.map((item) =>
                item.id === updated.id
                    ? updated
                    : item,
            ),
        );

        setSelected(updated);

        if (nextStatus === "REPAIRING") {
            showSuccess({
                title:
                    "Bắt đầu xử lý thành công",
                description:
                    `${updated.code} đã được chuyển sang trạng thái Đang sửa.`,
                code: updated.code,
            });
            return;
        }

        if (nextStatus === "COMPLETED") {
            showSuccess({
                title:
                    "Hoàn thành phiếu thành công",
                description:
                    `${updated.code} đã hoàn tất xử lý và sẵn sàng cập nhật tình trạng thiết bị.`,
                code: updated.code,
            });
        }
    };

    return (
        <main className="flex h-[calc(100vh-112px)] min-h-[650px] flex-col gap-3 overflow-hidden">
            <header className="flex shrink-0 flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-[22px] font-bold leading-tight tracking-tight text-slate-950">
                        Bảo trì và sửa chữa
                    </h1>

                    <p className="mt-0.5 text-[11px] text-slate-500">
                        Quản lý lịch bảo trì, yêu cầu sửa chữa và tình trạng thiết bị lỗi.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            setModal(
                                "CREATE_REPAIR",
                            )
                        }
                        className="inline-flex h-8 items-center gap-2 rounded-lg bg-blue-600 px-3.5 text-xs font-semibold !text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <Wrench size={16} />
                        Tạo yêu cầu sửa chữa
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setModal(
                                "SCHEDULE",
                            )
                        }
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-blue-200 bg-white px-3.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                        <CalendarDays
                            size={16}
                        />
                        Lập lịch bảo trì
                    </button>
                </div>
            </header>

            <section className="grid h-[178px] shrink-0 gap-3 xl:grid-cols-[1.08fr_0.92fr]">
                <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-900">
                            Sức khỏe thiết bị
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                setModal(
                                    "HEALTH",
                                )
                            }
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                        >
                            Xem chi tiết
                        </button>
                    </div>

                    <div className="mt-2 grid gap-3 md:grid-cols-[132px_1fr] md:items-center">
                        <div className="flex justify-center">
                            <div className="relative flex size-28 items-center justify-center rounded-full bg-[conic-gradient(#2563eb_0deg_280deg,#22c55e_280deg_330deg,#f59e0b_330deg_350deg,#ef4444_350deg_360deg)]">
                                <div className="flex size-[82px] flex-col items-center justify-center rounded-full bg-white shadow-inner">
                                    <strong className="text-2xl font-bold text-slate-950">
                                        78%
                                    </strong>
                                    <span className="mt-1 text-xs text-slate-400">
                                        Ổn định
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm font-bold text-slate-800">
                                Tỷ lệ thiết bị ổn định
                            </p>
                            <p className="mt-1 text-xs font-semibold text-emerald-600">
                                ↑ 4,2% so với tháng trước
                            </p>

                            <div className="mt-2 grid gap-2 sm:grid-cols-3">
                                <HealthStat
                                    icon={
                                        CheckCircle2
                                    }
                                    value="1.236"
                                    label="Thiết bị ổn định"
                                    helper="78%"
                                    tone="BLUE"
                                />

                                <HealthStat
                                    icon={
                                        AlertTriangle
                                    }
                                    value="221"
                                    label="Cần bảo trì"
                                    helper="14%"
                                    tone="ORANGE"
                                />

                                <HealthStat
                                    icon={
                                        CircleAlert
                                    }
                                    value="123"
                                    label="Thiết bị lỗi"
                                    helper="8%"
                                    tone="ROSE"
                                />
                            </div>
                        </div>
                    </div>
                </article>

                <article className="min-h-0 flex-1 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-900">
                            Trạng thái bảo trì
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                setModal(
                                    "STATUS",
                                )
                            }
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                        >
                            Xem tất cả
                        </button>
                    </div>

                    <div className="mt-1 divide-y divide-slate-100">
                        <MaintenanceStatusLine
                            icon={Clock3}
                            title="Chờ xử lý"
                            description="Yêu cầu chờ phân công"
                            value={String(statusCounts.PENDING)}
                            tone="ORANGE"
                            onClick={() => {
                                setStatus("PENDING");
                                setPage(1);
                            }}
                        />

                        <MaintenanceStatusLine
                            icon={Wrench}
                            title="Đang sửa"
                            description="Đang được xử lý"
                            value={String(statusCounts.REPAIRING)}
                            tone="BLUE"
                            onClick={() => {
                                setStatus("REPAIRING");
                                setPage(1);
                            }}
                        />

                        <MaintenanceStatusLine
                            icon={
                                CalendarDays
                            }
                            title="Bảo trì định kỳ"
                            description="Đến hạn trong 7 ngày"
                            value={String(statusCounts.SCHEDULED)}
                            tone="VIOLET"
                            onClick={() => {
                                setStatus("SCHEDULED");
                                setPage(1);
                            }}
                        />

                        <MaintenanceStatusLine
                            icon={
                                CheckCircle2
                            }
                            title="Hoàn thành"
                            description="Hoàn thành trong 30 ngày"
                            value={String(statusCounts.COMPLETED)}
                            tone="GREEN"
                            onClick={() => {
                                setStatus("COMPLETED");
                                setPage(1);
                            }}
                        />
                    </div>
                </article>
            </section>

            <section className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[minmax(0,1fr)_310px]">
                <article className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="shrink-0 border-b border-slate-100 px-3.5 py-2">
                        <h2 className="text-sm font-bold text-slate-900">
                            Danh sách bảo trì & sửa chữa
                        </h2>
                    </div>

                    <div className="shrink-0 border-b border-slate-100 px-3.5 py-2">
                        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.45fr)_150px_140px_145px_108px_42px]">
                            <label className="relative min-w-0">
                                <Search
                                    size={15}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(
                                            event.target.value,
                                        );
                                        setPage(1);
                                    }}
                                    placeholder="Tìm theo mã phiếu, thiết bị..."
                                    className="h-8 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
                                />
                            </label>

                            <select
                                value={status}
                                onChange={(event) => {
                                    setStatus(
                                        event.target.value as
                                            | MaintenanceStatus
                                            | "ALL",
                                    );
                                    setPage(1);
                                }}
                                className="h-8 w-full rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 outline-none transition focus:border-blue-500"
                            >
                                <option value="ALL">
                                    Trạng thái: Tất cả
                                </option>
                                <option value="PENDING">
                                    Chờ xử lý
                                </option>
                                <option value="REPAIRING">
                                    Đang sửa
                                </option>
                                <option value="SCHEDULED">
                                    Bảo trì định kỳ
                                </option>
                                <option value="COMPLETED">
                                    Hoàn thành
                                </option>
                            </select>

                            <select
                                value={priority}
                                onChange={(event) => {
                                    setPriority(
                                        event.target.value as
                                            | MaintenancePriority
                                            | "ALL",
                                    );
                                    setPage(1);
                                }}
                                className="h-8 w-full rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 outline-none transition focus:border-blue-500"
                            >
                                <option value="ALL">
                                    Ưu tiên: Tất cả
                                </option>
                                <option value="HIGH">
                                    Cao
                                </option>
                                <option value="MEDIUM">
                                    Trung bình
                                </option>
                                <option value="LOW">
                                    Thấp
                                </option>
                            </select>

                            <select
                                value={timeFilter}
                                onChange={(event) => {
                                    setTimeFilter(
                                        event.target.value,
                                    );
                                    setPage(1);
                                }}
                                className="h-8 w-full rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-700 outline-none transition focus:border-blue-500"
                            >
                                <option value="ALL">
                                    Thời gian: Tất cả
                                </option>
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
                                onClick={resetFilters}
                                title="Đặt lại bộ lọc"
                                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-blue-100 bg-white px-3 text-[11px] font-bold text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                            >
                                <SlidersHorizontal
                                    size={14}
                                />
                                Bộ lọc
                            </button>

                            <button
                                type="button"
                                onClick={downloadMaintenanceReport}
                                title="Tải danh sách"
                                aria-label="Tải danh sách bảo trì và sửa chữa"
                                className="inline-flex size-8 items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-600 transition hover:border-blue-200 hover:bg-blue-50"
                            >
                                <Download
                                    size={15}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 overflow-hidden">
                        <div className="min-w-0">
                            <div className="grid grid-cols-[96px_minmax(125px,1.25fr)_minmax(105px,1fr)_118px_72px_96px_86px_72px] gap-2 bg-slate-50 px-3.5 py-2 text-[9px] font-bold uppercase tracking-wide text-slate-500">
                                <span>Mã phiếu</span>
                                <span>Thiết bị</span>
                                <span>Lỗi / Công việc</span>
                                <span>Kỹ thuật viên</span>
                                <span>Ưu tiên</span>
                                <span>Trạng thái</span>
                                <span>Lịch hẹn</span>
                                <span className="text-right">
                                    Thao tác
                                </span>
                            </div>

                            {visibleRows.map(
                                (item) => (
                                    <div
                                        key={item.id}
                                        className="grid grid-cols-[96px_minmax(125px,1.25fr)_minmax(105px,1fr)_118px_72px_96px_86px_72px] items-center gap-2 border-t border-slate-100 px-3.5 py-2 text-[10px] transition hover:bg-slate-50/70"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDetail(
                                                    item,
                                                )
                                            }
                                            className="truncate text-left font-bold text-blue-600 hover:underline"
                                        >
                                            {item.code}
                                        </button>

                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-slate-900">
                                                {
                                                    item.equipment
                                                }
                                            </p>
                                            <p className="mt-0.5 truncate text-[9px] text-slate-400">
                                                {
                                                    item.category
                                                }
                                            </p>
                                        </div>

                                        <p className="truncate text-slate-700">
                                            {item.issue}
                                        </p>

                                        <div className="flex min-w-0 items-center gap-2">
                                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[8px] font-bold text-slate-600">
                                                {item.technician
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
                                                    )}
                                            </span>
                                            <span className="truncate text-slate-700">
                                                {
                                                    item.technician
                                                }
                                            </span>
                                        </div>

                                        <span
                                            className={[
                                                "w-fit rounded-full px-2 py-1 text-[9px] font-bold",
                                                PRIORITY_CONFIG[
                                                    item
                                                        .priority
                                                    ]
                                                    .className,
                                            ].join(
                                                " ",
                                            )}
                                        >
                                            {
                                                PRIORITY_CONFIG[
                                                    item
                                                        .priority
                                                    ].label
                                            }
                                        </span>

                                        <span
                                            className={[
                                                "w-fit whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-bold",
                                                STATUS_CONFIG[
                                                    item
                                                        .status
                                                    ]
                                                    .className,
                                            ].join(
                                                " ",
                                            )}
                                        >
                                            {
                                                STATUS_CONFIG[
                                                    item
                                                        .status
                                                    ].label
                                            }
                                        </span>

                                        <div className="text-[10px] text-slate-600">
                                            <p>
                                                {
                                                    item.appointmentDate
                                                }
                                            </p>
                                            <p className="mt-0.5">
                                                {
                                                    item.appointmentTime
                                                }
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openDetail(
                                                    item,
                                                )
                                            }
                                            className="ml-auto inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[10px] font-semibold text-blue-600 transition hover:bg-blue-50"
                                        >
                                            <Eye
                                                size={12}
                                            />
                                            Chi tiết
                                        </button>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    <footer className="shrink-0 flex flex-col gap-2 border-t border-slate-100 bg-white px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span>
                                Hiển thị
                            </span>
                            <strong className="font-semibold text-slate-700">
                                {filtered.length === 0
                                    ? 0
                                    : (safePage - 1) *
                                    PAGE_SIZE +
                                    1}
                                –
                                {Math.min(
                                    safePage * PAGE_SIZE,
                                    filtered.length,
                                )}
                            </strong>
                            <span>
                                trong tổng số
                            </span>
                            <strong className="font-semibold text-slate-700">
                                {filtered.length}
                            </strong>
                            <span>
                                kết quả
                            </span>
                        </div>

                        <nav
                            aria-label="Phân trang danh sách bảo trì"
                            className="flex items-center gap-1"
                        >
                            <button
                                type="button"
                                disabled={safePage === 1}
                                onClick={() =>
                                    setPage(
                                        Math.max(
                                            1,
                                            safePage - 1,
                                        ),
                                    )
                                }
                                aria-label="Trang trước"
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={13} />
                                <span className="hidden sm:inline">
                                    Trước
                                </span>
                            </button>

                            {paginationItems.map(
                                (item, index) => {
                                    if (
                                        item ===
                                        "ELLIPSIS_LEFT" ||
                                        item ===
                                        "ELLIPSIS_RIGHT"
                                    ) {
                                        return (
                                            <span
                                                key={`${item}-${index}`}
                                                className="flex size-8 items-center justify-center text-[11px] font-semibold text-slate-400"
                                            >
                                                …
                                            </span>
                                        );
                                    }

                                    return (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() =>
                                                setPage(
                                                    item,
                                                )
                                            }
                                            aria-current={
                                                item ===
                                                safePage
                                                    ? "page"
                                                    : undefined
                                            }
                                            className={
                                                item ===
                                                safePage
                                                    ? "flex size-8 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-bold !text-white shadow-sm"
                                                    : "flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-[10px] font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                            }
                                        >
                                            {item}
                                        </button>
                                    );
                                },
                            )}

                            <button
                                type="button"
                                disabled={
                                    safePage ===
                                    totalPages
                                }
                                onClick={() =>
                                    setPage(
                                        Math.min(
                                            totalPages,
                                            safePage + 1,
                                        ),
                                    )
                                }
                                aria-label="Trang sau"
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <span className="hidden sm:inline">
                                    Sau
                                </span>
                                <ChevronRight size={13} />
                            </button>
                        </nav>
                    </footer>
                </article>

                <aside className="flex min-h-0 flex-col gap-3">
                    <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-900">
                                Lịch kỹ thuật viên
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setModal(
                                        "TECHNICIANS",
                                    )
                                }
                                className="text-[10px] font-bold text-blue-600"
                            >
                                Xem tất cả
                            </button>
                        </div>

                        <div className="mt-2 space-y-2">
                            {TECHNICIANS.map(
                                (item) => (
                                    <div
                                        key={
                                            item.id
                                        }
                                        className="flex items-center gap-2"
                                    >
                                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-700">
                                            {
                                                item.avatar
                                            }
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[11px] font-bold text-slate-800">
                                                {
                                                    item.name
                                                }
                                            </p>
                                            <p className="mt-0.5 truncate text-[9px] text-slate-400">
                                                {
                                                    item.task
                                                }
                                            </p>
                                        </div>

                                        <span className="whitespace-nowrap rounded-lg bg-blue-50 px-1.5 py-1 text-[8px] font-bold text-blue-600">
                                            {
                                                item.time
                                            }
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-900">
                                Cảnh báo thiết bị cần bảo trì
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setModal(
                                        "ALERTS",
                                    )
                                }
                                className="text-[10px] font-bold text-blue-600"
                            >
                                Xem tất cả
                            </button>
                        </div>

                        <div className="mt-2 space-y-2">
                            {MAINTENANCE_ALERTS.slice(
                                0,
                                4,
                            ).map(
                                (item) => (
                                    <div
                                        key={
                                            item.id
                                        }
                                        className="flex items-center gap-2 border-b border-slate-100 pb-2 last:border-0 last:pb-0"
                                    >
                                        <AlertTriangle
                                            size={14}
                                            className="shrink-0 text-rose-500"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-[11px] font-semibold text-slate-800">
                                                {
                                                    item.equipment
                                                }
                                            </p>
                                            <p className="mt-0.5 text-[9px] text-slate-400">
                                                Kho{" "}
                                                {
                                                    item.warehouse
                                                }
                                            </p>
                                        </div>

                                        <span className="whitespace-nowrap text-[9px] font-bold text-rose-600">
                                            Quá hạn{" "}
                                            {
                                                item.overdueDays
                                            }{" "}
                                            ngày
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    </article>
                </aside>
            </section>

            {modal ? (
                <Modal
                    title={
                        modal ===
                        "CREATE_REPAIR"
                            ? "Tạo yêu cầu sửa chữa"
                            : modal ===
                            "SCHEDULE"
                                ? "Lập lịch bảo trì"
                                : modal ===
                                "DETAIL"
                                    ? "Chi tiết phiếu bảo trì"
                                    : modal ===
                                    "HEALTH"
                                        ? "Chi tiết sức khỏe thiết bị"
                                        : modal ===
                                        "STATUS"
                                            ? "Tổng quan trạng thái bảo trì"
                                            : modal ===
                                            "TECHNICIANS"
                                                ? "Lịch kỹ thuật viên"
                                                : "Thiết bị cần bảo trì"
                    }
                    size={
                        modal ===
                        "TECHNICIANS" ||
                        modal ===
                        "ALERTS"
                            ? "LARGE"
                            : "DEFAULT"
                    }
                    onClose={() =>
                        setModal(null)
                    }
                >
                    {modal ===
                    "CREATE_REPAIR" ? (
                        <RepairRequestForm
                            onSubmit={
                                createRepairRequest
                            }
                            onCancel={() =>
                                setModal(
                                    null,
                                )
                            }
                        />
                    ) : modal ===
                    "SCHEDULE" ? (
                        <ScheduleForm
                            onSubmit={
                                createSchedule
                            }
                            onCancel={() =>
                                setModal(
                                    null,
                                )
                            }
                        />
                    ) : modal ===
                    "DETAIL" &&
                    selected ? (
                        <MaintenanceDetail
                            item={selected}
                            onStart={() =>
                                updateSelectedStatus(
                                    "REPAIRING",
                                )
                            }
                            onComplete={() =>
                                updateSelectedStatus(
                                    "COMPLETED",
                                )
                            }
                            onClose={() =>
                                setModal(
                                    null,
                                )
                            }
                        />
                    ) : modal ===
                    "HEALTH" ? (
                        <HealthDetails />
                    ) : modal ===
                    "STATUS" ? (
                        <StatusDetails
                            rows={rows}
                        />
                    ) : modal ===
                    "TECHNICIANS" ? (
                        <TechnicianSchedule />
                    ) : (
                        <MaintenanceAlertList />
                    )}
                </Modal>
            ) : null}

            {success ? (
                <SuccessDialog
                    data={success}
                    onClose={() =>
                        setSuccess(null)
                    }
                    onView={
                        selected
                            ? () => {
                                setSuccess(
                                    null,
                                );
                                setModal(
                                    "DETAIL",
                                );
                            }
                            : undefined
                    }
                />
            ) : null}
        </main>
    );
};

const HealthStat = ({
                        icon: Icon,
                        value,
                        label,
                        helper,
                        tone,
                    }: {
    icon: LucideIcon;
    value: string;
    label: string;
    helper: string;
    tone: "BLUE" | "ORANGE" | "ROSE";
}) => {
    const toneClass = {
        BLUE: "bg-blue-50 text-blue-600",
        ORANGE:
            "bg-orange-50 text-orange-600",
        ROSE: "bg-rose-50 text-rose-600",
    }[tone];

    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2.5">
            <div className="flex items-center gap-2">
                <span
                    className={[
                        "flex size-8 items-center justify-center rounded-full",
                        toneClass,
                    ].join(" ")}
                >
                    <Icon size={15} />
                </span>

                <strong className="text-base font-bold text-slate-950">
                    {value}
                </strong>
            </div>

            <p className="mt-1.5 text-[9px] text-slate-500">
                {label}
            </p>
            <p className="mt-0.5 text-[9px] font-bold text-slate-500">
                {helper}
            </p>
        </div>
    );
};

const MaintenanceStatusLine = ({
                                   icon: Icon,
                                   title,
                                   description,
                                   value,
                                   tone,
                                   onClick,
                               }: {
    icon: LucideIcon;
    title: string;
    description: string;
    value: string;
    tone:
        | "ORANGE"
        | "BLUE"
        | "VIOLET"
        | "GREEN";
    onClick: () => void;
}) => {
    const toneClass = {
        ORANGE:
            "bg-orange-50 text-orange-600",
        BLUE: "bg-blue-50 text-blue-600",
        VIOLET:
            "bg-violet-50 text-violet-600",
        GREEN:
            "bg-emerald-50 text-emerald-600",
    }[tone];

    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex w-full items-center gap-2.5 rounded-lg px-1 py-1.5 text-left transition hover:bg-slate-50"
        >
            <span
                className={[
                    "flex size-9 shrink-0 items-center justify-center rounded-xl",
                    toneClass,
                ].join(" ")}
            >
                <Icon size={16} />
            </span>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800">
                    {title}
                </p>
                <p className="mt-0.5 text-[9px] text-slate-400">
                    {description}
                </p>
            </div>

            <strong className="text-sm text-slate-800">
                {value}
            </strong>

            <span className="flex size-7 items-center justify-center rounded-lg text-slate-300 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                <ChevronRight size={14} />
            </span>
        </button>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-[1px]">
        <div
            className={[
                "max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl",
                size === "LARGE"
                    ? "max-w-3xl"
                    : "max-w-lg",
            ].join(" ")}
        >
            <div className="mb-4 flex items-start justify-between gap-4">
                <h2 className="text-base font-bold text-slate-950">
                    {title}
                </h2>

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

interface RepairRequestInput {
    equipment: string;
    serial: string;
    issue: string;
    priority: MaintenancePriority;
    warehouse: string;
    technician: string;
    date: string;
    time: string;
}

const RepairRequestForm = ({
                               onSubmit,
                               onCancel,
                           }: {
    onSubmit: (
        input: RepairRequestInput,
    ) => void;
    onCancel: () => void;
}) => {
    const [
        equipment,
        setEquipment,
    ] = useState(
        EQUIPMENT_OPTIONS[0],
    );
    const [
        serial,
        setSerial,
    ] = useState("");
    const [
        issue,
        setIssue,
    ] = useState("");
    const [
        priority,
        setPriority,
    ] = useState<MaintenancePriority>(
        "HIGH",
    );
    const [
        warehouse,
        setWarehouse,
    ] = useState("Hà Nội");
    const [
        technician,
        setTechnician,
    ] = useState(
        TECHNICIAN_OPTIONS[0],
    );
    const [
        date,
        setDate,
    ] = useState("2026-08-17");
    const [
        time,
        setTime,
    ] = useState("09:00");

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        onSubmit({
            equipment,
            serial,
            issue,
            priority,
            warehouse,
            technician,
            date: formatDate(date),
            time,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            <FieldLabel label="Thiết bị">
                <select
                    value={equipment}
                    onChange={(event) =>
                        setEquipment(
                            event.target.value,
                        )
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                >
                    {EQUIPMENT_OPTIONS.map(
                        (item) => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>
                        ),
                    )}
                </select>
            </FieldLabel>

            <FieldLabel label="Serial">
                <input
                    required
                    value={serial}
                    onChange={(event) =>
                        setSerial(
                            event.target.value,
                        )
                    }
                    placeholder="VD: XA60-22018"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                />
            </FieldLabel>

            <FieldLabel label="Mô tả lỗi / sự cố">
                <textarea
                    required
                    rows={3}
                    value={issue}
                    onChange={(event) =>
                        setIssue(
                            event.target.value,
                        )
                    }
                    placeholder="Mô tả hiện tượng lỗi, phụ kiện liên quan..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
            </FieldLabel>

            <div className="grid gap-3 sm:grid-cols-2">
                <FieldLabel label="Mức ưu tiên">
                    <select
                        value={
                            priority
                        }
                        onChange={(
                            event,
                        ) =>
                            setPriority(
                                event.target
                                    .value as MaintenancePriority,
                            )
                        }
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    >
                        <option value="HIGH">
                            Cao
                        </option>
                        <option value="MEDIUM">
                            Trung bình
                        </option>
                        <option value="LOW">
                            Thấp
                        </option>
                    </select>
                </FieldLabel>

                <FieldLabel label="Kho">
                    <select
                        value={
                            warehouse
                        }
                        onChange={(
                            event,
                        ) =>
                            setWarehouse(
                                event.target
                                    .value,
                            )
                        }
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    >
                        <option>
                            Hà Nội
                        </option>
                        <option>
                            Đà Nẵng
                        </option>
                        <option>
                            TP.HCM
                        </option>
                    </select>
                </FieldLabel>
            </div>

            <FieldLabel label="Kỹ thuật viên">
                <select
                    value={
                        technician
                    }
                    onChange={(
                        event,
                    ) =>
                        setTechnician(
                            event.target
                                .value,
                        )
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                >
                    {TECHNICIAN_OPTIONS.map(
                        (item) => (
                            <option
                                key={item}
                            >
                                {item}
                            </option>
                        ),
                    )}
                </select>
            </FieldLabel>

            <div className="grid gap-3 sm:grid-cols-2">
                <FieldLabel label="Ngày hẹn">
                    <input
                        type="date"
                        required
                        value={date}
                        onChange={(
                            event,
                        ) =>
                            setDate(
                                event.target
                                    .value,
                            )
                        }
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm"
                    />
                </FieldLabel>

                <FieldLabel label="Giờ">
                    <input
                        type="time"
                        required
                        value={time}
                        onChange={(
                            event,
                        ) =>
                            setTime(
                                event.target
                                    .value,
                            )
                        }
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm"
                    />
                </FieldLabel>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                    type="button"
                    onClick={onCancel}
                    className="h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    className="h-10 rounded-xl bg-blue-600 text-sm font-bold !text-white hover:bg-blue-700"
                >
                    Tạo yêu cầu
                </button>
            </div>
        </form>
    );
};

interface ScheduleInput {
    equipment: string;
    serial: string;
    work: string;
    priority: MaintenancePriority;
    warehouse: string;
    technician: string;
    date: string;
    time: string;
}

const ScheduleForm = ({
                          onSubmit,
                          onCancel,
                      }: {
    onSubmit: (
        input: ScheduleInput,
    ) => void;
    onCancel: () => void;
}) => {
    const [
        equipment,
        setEquipment,
    ] = useState(
        EQUIPMENT_OPTIONS[1],
    );
    const [
        serial,
        setSerial,
    ] = useState("");
    const [
        work,
        setWork,
    ] = useState(
        "Bảo trì định kỳ",
    );
    const [
        priority,
        setPriority,
    ] = useState<MaintenancePriority>(
        "MEDIUM",
    );
    const [
        warehouse,
        setWarehouse,
    ] = useState("Hà Nội");
    const [
        technician,
        setTechnician,
    ] = useState(
        TECHNICIAN_OPTIONS[1],
    );
    const [
        date,
        setDate,
    ] = useState("2026-08-18");
    const [
        time,
        setTime,
    ] = useState("14:30");

    const handleSubmit = (
        event: FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        onSubmit({
            equipment,
            serial,
            work,
            priority,
            warehouse,
            technician,
            date: formatDate(date),
            time,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4"
        >
            <FieldLabel label="Thiết bị">
                <select
                    value={equipment}
                    onChange={(event) =>
                        setEquipment(
                            event.target.value,
                        )
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                >
                    {EQUIPMENT_OPTIONS.map(
                        (item) => (
                            <option
                                key={item}
                            >
                                {item}
                            </option>
                        ),
                    )}
                </select>
            </FieldLabel>

            <div className="grid gap-3 sm:grid-cols-2">
                <FieldLabel label="Serial">
                    <input
                        required
                        value={serial}
                        onChange={(
                            event,
                        ) =>
                            setSerial(
                                event.target
                                    .value,
                            )
                        }
                        placeholder="Serial thiết bị"
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm"
                    />
                </FieldLabel>

                <FieldLabel label="Công việc bảo trì">
                    <select
                        value={work}
                        onChange={(
                            event,
                        ) =>
                            setWork(
                                event.target
                                    .value,
                            )
                        }
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    >
                        <option>
                            Bảo trì định kỳ
                        </option>
                        <option>
                            Vệ sinh thiết bị
                        </option>
                        <option>
                            Kiểm tra hiệu chuẩn
                        </option>
                        <option>
                            Thay vật tư hao mòn
                        </option>
                    </select>
                </FieldLabel>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <FieldLabel label="Mức ưu tiên">
                    <select
                        value={
                            priority
                        }
                        onChange={(
                            event,
                        ) =>
                            setPriority(
                                event.target
                                    .value as MaintenancePriority,
                            )
                        }
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    >
                        <option value="HIGH">
                            Cao
                        </option>
                        <option value="MEDIUM">
                            Trung bình
                        </option>
                        <option value="LOW">
                            Thấp
                        </option>
                    </select>
                </FieldLabel>

                <FieldLabel label="Kho">
                    <select
                        value={
                            warehouse
                        }
                        onChange={(
                            event,
                        ) =>
                            setWarehouse(
                                event.target
                                    .value,
                            )
                        }
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                    >
                        <option>
                            Hà Nội
                        </option>
                        <option>
                            Đà Nẵng
                        </option>
                        <option>
                            TP.HCM
                        </option>
                    </select>
                </FieldLabel>
            </div>

            <FieldLabel label="Kỹ thuật viên">
                <select
                    value={
                        technician
                    }
                    onChange={(
                        event,
                    ) =>
                        setTechnician(
                            event.target
                                .value,
                        )
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm"
                >
                    {TECHNICIAN_OPTIONS.map(
                        (item) => (
                            <option
                                key={item}
                            >
                                {item}
                            </option>
                        ),
                    )}
                </select>
            </FieldLabel>

            <div className="grid gap-3 sm:grid-cols-2">
                <FieldLabel label="Ngày bảo trì">
                    <input
                        type="date"
                        required
                        value={date}
                        onChange={(
                            event,
                        ) =>
                            setDate(
                                event.target
                                    .value,
                            )
                        }
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm"
                    />
                </FieldLabel>

                <FieldLabel label="Giờ">
                    <input
                        type="time"
                        required
                        value={time}
                        onChange={(
                            event,
                        ) =>
                            setTime(
                                event.target
                                    .value,
                            )
                        }
                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm"
                    />
                </FieldLabel>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                    type="button"
                    onClick={onCancel}
                    className="h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                    Hủy
                </button>

                <button
                    type="submit"
                    className="h-10 rounded-xl bg-blue-600 text-sm font-bold !text-white hover:bg-blue-700"
                >
                    Xác nhận lịch
                </button>
            </div>
        </form>
    );
};

const MaintenanceDetail = ({
                               item,
                               onStart,
                               onComplete,
                               onClose,
                           }: {
    item: MaintenanceRow;
    onStart: () => void;
    onComplete: () => void;
    onClose: () => void;
}) => (
    <div className="space-y-3">
        <Info
            label="Mã phiếu"
            value={item.code}
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
            label="Công việc"
            value={item.issue}
        />
        <Info
            label="Kho"
            value={item.warehouse}
        />
        <Info
            label="Kỹ thuật viên"
            value={item.technician}
        />
        <Info
            label="Ưu tiên"
            value={
                PRIORITY_CONFIG[
                    item.priority
                    ].label
            }
        />
        <Info
            label="Lịch hẹn"
            value={`${item.appointmentDate} ${item.appointmentTime}`}
        />
        <Info
            label="Trạng thái"
            value={
                STATUS_CONFIG[
                    item.status
                    ].label
            }
        />

        {item.status ===
        "COMPLETED" ? (
            <div className="pt-2">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center">
                    <CheckCircle2
                        size={22}
                        className="mx-auto text-emerald-600"
                    />
                    <p className="mt-2 text-sm font-bold text-emerald-700">
                        Phiếu đã hoàn thành
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 h-10 w-full rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                    Đóng
                </button>
            </div>
        ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                    type="button"
                    disabled={
                        item.status ===
                        "REPAIRING"
                    }
                    onClick={onStart}
                    className="h-10 rounded-xl bg-blue-600 text-xs font-bold !text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:!text-slate-400"
                >
                    {item.status ===
                    "REPAIRING"
                        ? "Đang xử lý"
                        : item.status ===
                        "SCHEDULED"
                            ? "Bắt đầu bảo trì"
                            : "Bắt đầu sửa"}
                </button>

                <button
                    type="button"
                    onClick={
                        onComplete
                    }
                    className="h-10 rounded-xl bg-emerald-600 text-xs font-bold !text-white hover:bg-emerald-700"
                >
                    Hoàn thành
                </button>
            </div>
        )}
    </div>
);

const HealthDetails = () => (
    <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
            <MetricBox
                label="Thiết bị ổn định"
                value="1.236"
                helper="78% tổng thiết bị"
            />
            <MetricBox
                label="Cần bảo trì"
                value="221"
                helper="14% tổng thiết bị"
            />
            <MetricBox
                label="Thiết bị lỗi"
                value="123"
                helper="8% tổng thiết bị"
            />
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
                <Gauge
                    size={18}
                    className="text-blue-600"
                />
                <p className="text-sm font-bold text-slate-900">
                    Đánh giá tổng thể
                </p>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-500">
                Hệ thống đang duy trì tỷ lệ thiết bị ổn định 78%. Nhóm cần ưu tiên hiện tại là thiết bị quá hạn bảo trì và các phiếu sửa chữa mức ưu tiên cao.
            </p>
        </div>
    </div>
);

const StatusDetails = ({
                           rows,
                       }: {
    rows: MaintenanceRow[];
}) => {
    const count = (
        target: MaintenanceStatus,
    ) =>
        rows.filter(
            (item) =>
                item.status === target,
        ).length;

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            <StatusSummary
                icon={Clock3}
                title="Chờ xử lý"
                value={count(
                    "PENDING",
                )}
                tone="ORANGE"
            />
            <StatusSummary
                icon={Wrench}
                title="Đang sửa"
                value={count(
                    "REPAIRING",
                )}
                tone="BLUE"
            />
            <StatusSummary
                icon={
                    CalendarDays
                }
                title="Bảo trì định kỳ"
                value={count(
                    "SCHEDULED",
                )}
                tone="VIOLET"
            />
            <StatusSummary
                icon={
                    CheckCircle2
                }
                title="Hoàn thành"
                value={count(
                    "COMPLETED",
                )}
                tone="GREEN"
            />
        </div>
    );
};

const TechnicianSchedule = () => (
    <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="grid grid-cols-[60px_1fr_1.3fr_130px] gap-3 bg-slate-50 px-4 py-2.5 text-[10px] font-bold uppercase text-slate-400">
            <span />
            <span>Kỹ thuật viên</span>
            <span>Công việc</span>
            <span>Khung giờ</span>
        </div>

        {TECHNICIANS.map(
            (item) => (
                <div
                    key={item.id}
                    className="grid grid-cols-[60px_1fr_1.3fr_130px] items-center gap-3 border-t border-slate-100 px-4 py-3"
                >
                    <span className="flex size-9 items-center justify-center rounded-full bg-blue-50 text-[10px] font-bold text-blue-700">
                        {item.avatar}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                        {item.name}
                    </span>
                    <span className="text-xs text-slate-600">
                        {item.task}
                    </span>
                    <span className="rounded-lg bg-blue-50 px-2 py-1 text-center text-[10px] font-bold text-blue-600">
                        {item.time}
                    </span>
                </div>
            ),
        )}
    </div>
);

const MaintenanceAlertList = () => (
    <div className="space-y-2">
        {MAINTENANCE_ALERTS.map(
            (item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                        <AlertTriangle
                            size={16}
                        />
                    </span>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            {item.equipment}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                            Kho{" "}
                            {item.warehouse}
                        </p>
                    </div>

                    <span className="whitespace-nowrap text-xs font-bold text-rose-600">
                        Quá hạn{" "}
                        {item.overdueDays} ngày
                    </span>
                </div>
            ),
        )}
    </div>
);

const SuccessDialog = ({
                           data,
                           onClose,
                           onView,
                       }: {
    data: SuccessData;
    onClose: () => void;
    onView?: () => void;
}) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={34} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-950">
                {data.title}
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {data.description}
            </p>

            {data.code ? (
                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        Mã phiếu
                    </p>
                    <p className="mt-1 text-sm font-bold text-blue-600">
                        {data.code}
                    </p>
                </div>
            ) : null}

            <div
                className={
                    onView
                        ? "mt-6 grid grid-cols-2 gap-2"
                        : "mt-6"
                }
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="h-11 w-full rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                    Đóng
                </button>

                {onView ? (
                    <button
                        type="button"
                        onClick={onView}
                        className="h-11 w-full rounded-xl bg-blue-600 text-sm font-bold !text-white hover:bg-blue-700"
                    >
                        Xem phiếu
                    </button>
                ) : null}
            </div>
        </div>
    </div>
);

const FieldLabel = ({
                        label,
                        children,
                    }: {
    label: string;
    children: ReactNode;
}) => (
    <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-slate-700">
            {label}
        </span>
        {children}
    </label>
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
        <span className="max-w-[65%] text-right font-semibold text-slate-800">
            {value}
        </span>
    </div>
);

const MetricBox = ({
                       label,
                       value,
                       helper,
                   }: {
    label: string;
    value: string;
    helper: string;
}) => (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-[11px] text-slate-400">
            {label}
        </p>
        <p className="mt-1 text-xl font-bold text-slate-950">
            {value}
        </p>
        <p className="mt-1 text-[10px] text-slate-500">
            {helper}
        </p>
    </div>
);

const StatusSummary = ({
                           icon: Icon,
                           title,
                           value,
                           tone,
                       }: {
    icon: LucideIcon;
    title: string;
    value: number;
    tone:
        | "ORANGE"
        | "BLUE"
        | "VIOLET"
        | "GREEN";
}) => {
    const toneClass = {
        ORANGE:
            "bg-orange-50 text-orange-600",
        BLUE: "bg-blue-50 text-blue-600",
        VIOLET:
            "bg-violet-50 text-violet-600",
        GREEN:
            "bg-emerald-50 text-emerald-600",
    }[tone];

    return (
        <div className="rounded-xl border border-slate-200 p-4">
            <span
                className={[
                    "flex size-10 items-center justify-center rounded-xl",
                    toneClass,
                ].join(" ")}
            >
                <Icon size={18} />
            </span>
            <p className="mt-3 text-2xl font-bold text-slate-950">
                {value}
            </p>
            <p className="mt-1 text-xs text-slate-500">
                {title}
            </p>
        </div>
    );
};

const formatDate = (
    value: string,
) => {
    const [
        year,
        month,
        day,
    ] = value.split("-");

    return `${day}/${month}/${year}`;
};