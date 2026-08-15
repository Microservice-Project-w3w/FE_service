import {
    AlertTriangle,
    ArrowDownToLine,
    Boxes,
    Building2,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ClipboardCheck,
    Eye,
    MapPin,
    PackageCheck,
    RefreshCw,
    Search,
    Truck,
    X,
} from "lucide-react";

import {
    useMemo,
    useState,
    type ReactNode,
} from "react";

type EquipmentStatus =
    | "AVAILABLE"
    | "RENTED"
    | "TRANSFERRING"
    | "MAINTENANCE";

interface EquipmentRow {
    id: string;
    code: string;
    name: string;
    model: string;
    warehouse: string;
    status: EquipmentStatus;
    quantity: number;
}

const STATUS_CONFIG: Record<
    EquipmentStatus,
    {
        label: string;
        className: string;
    }
> = {
    AVAILABLE: {
        label: "Sẵn sàng",
        className:
            "bg-emerald-50 text-emerald-700",
    },

    RENTED: {
        label: "Đang cho thuê",
        className:
            "bg-blue-50 text-blue-700",
    },

    TRANSFERRING: {
        label: "Đang điều chuyển",
        className:
            "bg-amber-50 text-amber-700",
    },

    MAINTENANCE: {
        label: "Bảo trì",
        className:
            "bg-violet-50 text-violet-700",
    },
};

const EQUIPMENT: EquipmentRow[] =
    Array.from(
        {
            length: 28,
        },
        (_, index) => {
            const equipmentSeeds = [
                {
                    code: "CAM-SONY-A7S3",
                    name: "Máy ảnh Sony A7S III",
                    model: "Sony A7S III",
                },
                {
                    code: "LEN-24-70GM2",
                    name:
                        "Ống kính Sony 24-70mm GM II",
                    model:
                        "FE 24-70mm GM II",
                },
                {
                    code: "LED-NANLITE-FS300",
                    name:
                        "Đèn LED Nanlite FS-300B",
                    model:
                        "FS-300B",
                },
                {
                    code: "TRIP-MANF-055",
                    name:
                        "Chân máy Manfrotto 055",
                    model:
                        "MT055XPRO3",
                },
                {
                    code: "GIM-DJI-RS3",
                    name:
                        "Gimbal DJI RS 3",
                    model:
                        "DJI RS 3",
                },
            ];

            const warehouses = [
                "Hà Nội",
                "Đà Nẵng",
                "TP.HCM",
            ];

            const statuses:
                EquipmentStatus[] = [
                "AVAILABLE",
                "AVAILABLE",
                "RENTED",
                "TRANSFERRING",
                "MAINTENANCE",
            ];

            const equipment =
                equipmentSeeds[
                index %
                equipmentSeeds.length
                    ];

            return {
                id:
                    `equipment-${index + 1}`,
                code:
                    `${equipment.code}-${String(
                        index + 1,
                    ).padStart(2, "0")}`,
                name:
                equipment.name,
                model:
                equipment.model,
                warehouse:
                    warehouses[
                    index %
                    warehouses.length
                        ],
                status:
                    statuses[
                    index %
                    statuses.length
                        ],
                quantity:
                    4 +
                    ((index * 7) %
                        35),
            };
        },
    );

const PAGE_SIZE = 5;

export const OperationsEquipmentPage =
    () => {
        const [
            search,
            setSearch,
        ] = useState("");

        const [
            warehouse,
            setWarehouse,
        ] = useState("ALL");

        const [
            status,
            setStatus,
        ] = useState<
            EquipmentStatus | "ALL"
        >("ALL");

        const [
            page,
            setPage,
        ] = useState(1);

        const [
            modal,
            setModal,
        ] = useState<
            | "INBOUND"
            | "AUDIT"
            | "DETAIL"
            | "STOCK_ALERTS"
            | "CAPACITY"
            | null
        >(null);

        const [
            selected,
            setSelected,
        ] =
            useState<EquipmentRow | null>(
                null,
            );

        const filtered =
            useMemo(() => {
                const keyword =
                    search
                        .trim()
                        .toLowerCase();

                return EQUIPMENT.filter(
                    (item) => {
                        const searchableText =
                            `${item.code} ${item.name} ${item.model}`
                                .toLowerCase();

                        const matchesSearch =
                            keyword ===
                            "" ||
                            searchableText.includes(
                                keyword,
                            );

                        const matchesWarehouse =
                            warehouse ===
                            "ALL" ||
                            item.warehouse ===
                            warehouse;

                        const matchesStatus =
                            status ===
                            "ALL" ||
                            item.status ===
                            status;

                        return (
                            matchesSearch &&
                            matchesWarehouse &&
                            matchesStatus
                        );
                    },
                );
            }, [
                search,
                warehouse,
                status,
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
                setWarehouse("ALL");
                setStatus("ALL");
                setPage(1);
            };

        const showDetail = (
            item: EquipmentRow,
        ): void => {
            setSelected(item);
            setModal("DETAIL");
        };

        return (
            <main className="space-y-4">
                {/* HEADER */}
                <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                            Thiết bị và kho
                        </h1>

                        <p className="mt-1 text-xs text-slate-500">
                            Quản lý thiết bị,
                            kho, nhập xuất,
                            điều chuyển và
                            kiểm kê.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setModal(
                                    "INBOUND",
                                );
                            }}
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold !text-white transition hover:bg-blue-700 hover:!text-white"
                        >
                            <ArrowDownToLine
                                size={16}
                            />

                            Nhập kho
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setModal(
                                    "AUDIT",
                                );
                            }}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                        >
                            <ClipboardCheck
                                size={16}
                            />

                            Tạo phiếu kiểm kê
                        </button>
                    </div>
                </header>

                {/* OVERVIEW */}
                <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900">
                            Tổng quan kho
                        </h2>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                            <MiniStat
                                icon={
                                    Boxes
                                }
                                label="Tổng thiết bị"
                                value="1.248"
                                tone="blue"
                            />

                            <MiniStat
                                icon={
                                    CheckCircle2
                                }
                                label="Thiết bị sẵn sàng"
                                value="842"
                                tone="emerald"
                            />

                            <MiniStat
                                icon={
                                    Truck
                                }
                                label="Đang điều chuyển"
                                value="126"
                                tone="amber"
                            />

                            <MiniStat
                                icon={
                                    AlertTriangle
                                }
                                label="Cảnh báo tồn kho"
                                value="28"
                                tone="rose"
                            />
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-900">
                                Công suất kho
                            </h2>

                            <button
                                type="button"
                                onClick={() => {
                                    setModal(
                                        "CAPACITY",
                                    );
                                }}
                                className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                            >
                                Xem chi tiết
                            </button>
                        </div>

                        <div className="mt-4 space-y-4">
                            <WarehouseCapacity
                                name="Hà Nội"
                                current={
                                    620
                                }
                                capacity={
                                    1000
                                }
                            />

                            <WarehouseCapacity
                                name="Đà Nẵng"
                                current={
                                    280
                                }
                                capacity={
                                    600
                                }
                            />

                            <WarehouseCapacity
                                name="TP.HCM"
                                current={
                                    480
                                }
                                capacity={
                                    1200
                                }
                            />
                        </div>
                    </article>
                </section>

                {/* CONTENT */}
                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
                    {/* TABLE */}
                    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-2 border-b border-slate-100 p-3 lg:flex-row">
                            <label className="relative flex-1">
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
                                    placeholder="Tìm thiết bị..."
                                    className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none transition focus:border-blue-500"
                                />
                            </label>

                            <select
                                value={
                                    warehouse
                                }
                                onChange={(
                                    event,
                                ) => {
                                    setWarehouse(
                                        event
                                            .target
                                            .value,
                                    );

                                    setPage(
                                        1,
                                    );
                                }}
                                className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700"
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
                                            EquipmentStatus |
                                            "ALL",
                                    );

                                    setPage(
                                        1,
                                    );
                                }}
                                className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700"
                            >
                                <option value="ALL">
                                    Trạng thái:
                                    Tất cả
                                </option>

                                <option value="AVAILABLE">
                                    Sẵn sàng
                                </option>

                                <option value="RENTED">
                                    Đang cho thuê
                                </option>

                                <option value="TRANSFERRING">
                                    Đang điều
                                    chuyển
                                </option>

                                <option value="MAINTENANCE">
                                    Bảo trì
                                </option>
                            </select>

                            <button
                                type="button"
                                onClick={
                                    resetFilters
                                }
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                <RefreshCw
                                    size={
                                        14
                                    }
                                />

                                Đặt lại
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <div className="min-w-[760px]">
                                <div className="grid grid-cols-[150px_1.4fr_110px_120px_80px_90px] gap-3 bg-slate-50 px-4 py-2.5 text-[10px] font-bold uppercase text-slate-500">
                                    <span>
                                        Mã thiết
                                        bị
                                    </span>

                                    <span>
                                        Tên thiết
                                        bị
                                    </span>

                                    <span>
                                        Kho
                                    </span>

                                    <span>
                                        Trạng thái
                                    </span>

                                    <span>
                                        Số lượng
                                    </span>

                                    <span className="text-right">
                                        Thao tác
                                    </span>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {visibleRows.map(
                                        (
                                            item,
                                        ) => (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="grid grid-cols-[150px_1.4fr_110px_120px_80px_90px] items-center gap-3 px-4 py-3 text-xs transition hover:bg-slate-50/70"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        showDetail(
                                                            item,
                                                        );
                                                    }}
                                                    className="text-left font-bold text-blue-600 hover:underline"
                                                >
                                                    {
                                                        item.code
                                                    }
                                                </button>

                                                <div>
                                                    <p className="font-semibold text-slate-900">
                                                        {
                                                            item.name
                                                        }
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                                        {
                                                            item.model
                                                        }
                                                    </p>
                                                </div>

                                                <span className="inline-flex items-center gap-1 text-slate-600">
                                                    <MapPin
                                                        size={
                                                            12
                                                        }
                                                    />

                                                    {
                                                        item.warehouse
                                                    }
                                                </span>

                                                <span
                                                    className={[
                                                        "w-fit rounded-full px-2 py-1 text-[10px] font-bold",
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
                                                            ]
                                                            .label
                                                    }
                                                </span>

                                                <span className="font-bold text-slate-800">
                                                    {
                                                        item.quantity
                                                    }
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        showDetail(
                                                            item,
                                                        );
                                                    }}
                                                    className="ml-auto inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[11px] font-semibold text-blue-600 transition hover:bg-blue-50"
                                                >
                                                    <Eye
                                                        size={
                                                            13
                                                        }
                                                    />

                                                    Chi tiết
                                                </button>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>

                        <footer className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                            <p className="text-[11px] text-slate-500">
                                Hiển thị{" "}
                                {(safePage -
                                        1) *
                                    PAGE_SIZE +
                                    1}{" "}
                                -{" "}
                                {Math.min(
                                    safePage *
                                    PAGE_SIZE,
                                    filtered.length,
                                )}{" "}
                                /{" "}
                                {
                                    filtered.length
                                }
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
                                    className="flex size-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
                                >
                                    <ChevronLeft
                                        size={
                                            14
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
                                )
                                    .slice(
                                        0,
                                        5,
                                    )
                                    .map(
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
                                                        ? "flex size-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold text-white"
                                                        : "flex size-8 items-center justify-center rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
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
                                    className="flex size-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
                                >
                                    <ChevronRight
                                        size={
                                            14
                                        }
                                    />
                                </button>
                            </div>
                        </footer>
                    </article>

                    {/* RIGHT SIDEBAR */}
                    <aside className="space-y-4">
                        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-slate-900">
                                    Cảnh báo tồn kho
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setModal(
                                            "STOCK_ALERTS",
                                        );
                                    }}
                                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
                                >
                                    Xem tất cả
                                </button>
                            </div>

                            <div className="mt-3 space-y-3">
                                {[
                                    {
                                        name:
                                            "Ống kính Sony 70-200mm GM II",
                                        warehouse:
                                            "Hà Nội",
                                        remaining:
                                            2,
                                    },
                                    {
                                        name:
                                            "Pin NP-F970",
                                        warehouse:
                                            "Đà Nẵng",
                                        remaining:
                                            3,
                                    },
                                    {
                                        name:
                                            "Đèn LED Aputure 300x",
                                        warehouse:
                                            "TP.HCM",
                                        remaining:
                                            1,
                                    },
                                ].map(
                                    (
                                        item,
                                    ) => (
                                        <div
                                            key={
                                                item.name
                                            }
                                            className="flex items-center gap-2 border-b border-slate-100 pb-3 last:border-0"
                                        >
                                            <AlertTriangle
                                                size={
                                                    14
                                                }
                                                className="text-rose-500"
                                            />

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-xs font-semibold text-slate-800">
                                                    {
                                                        item.name
                                                    }
                                                </p>

                                                <p className="text-[10px] text-slate-400">
                                                    Kho{" "}
                                                    {
                                                        item.warehouse
                                                    }
                                                </p>
                                            </div>

                                            <span className="text-[11px] font-bold text-rose-600">
                                                Còn{" "}
                                                {
                                                    item.remaining
                                                }
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-900">
                                Hoạt động gần đây
                            </h2>

                            <div className="mt-3 space-y-3">
                                {[
                                    "Nhập kho • Máy ảnh Sony A7S III",
                                    "Xuất kho • Ống kính Sony 24-70mm",
                                    "Điều chuyển • Đèn LED Nanlite",
                                    "Kiểm kê • Kho Đà Nẵng",
                                ].map(
                                    (
                                        activity,
                                    ) => (
                                        <div
                                            key={
                                                activity
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            <PackageCheck
                                                size={
                                                    14
                                                }
                                                className="text-blue-600"
                                            />

                                            <p className="text-xs text-slate-700">
                                                {
                                                    activity
                                                }
                                            </p>
                                        </div>
                                    ),
                                )}
                            </div>
                        </article>
                    </aside>
                </section>

                {/* MODAL */}
                {modal && (
                    <Modal
                        title={
                            modal ===
                            "INBOUND"
                                ? "Nhập kho"
                                : modal ===
                                "AUDIT"
                                    ? "Tạo phiếu kiểm kê"
                                    : modal ===
                                    "STOCK_ALERTS"
                                        ? "Danh sách cảnh báo tồn kho"
                                        : modal ===
                                        "CAPACITY"
                                            ? "Chi tiết công suất kho"
                                            : "Chi tiết thiết bị"
                        }
                        size={
                            modal ===
                            "CAPACITY"
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
                        "CAPACITY" ? (
                            <WarehouseCapacityDetails />
                        ) : modal ===
                        "STOCK_ALERTS" ? (
                            <StockAlertsContent
                                onViewEquipment={(
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
                        "DETAIL" &&
                        selected ? (
                            <div className="space-y-3 text-sm">
                                <Info
                                    label="Mã thiết bị"
                                    value={
                                        selected.code
                                    }
                                />

                                <Info
                                    label="Tên thiết bị"
                                    value={
                                        selected.name
                                    }
                                />

                                <Info
                                    label="Model"
                                    value={
                                        selected.model
                                    }
                                />

                                <Info
                                    label="Kho"
                                    value={
                                        selected.warehouse
                                    }
                                />

                                <Info
                                    label="Số lượng"
                                    value={String(
                                        selected.quantity,
                                    )}
                                />
                            </div>
                        ) : (
                            <form
                                onSubmit={(
                                    event,
                                ) => {
                                    event.preventDefault();

                                    window.alert(
                                        modal ===
                                        "INBOUND"
                                            ? "Đã tạo phiếu nhập kho."
                                            : "Đã tạo phiếu kiểm kê.",
                                    );

                                    setModal(
                                        null,
                                    );
                                }}
                                className="space-y-3"
                            >
                                <input
                                    required
                                    placeholder="Mã phiếu / ghi chú"
                                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
                                />

                                <select className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm">
                                    <option>
                                        Kho Hà Nội
                                    </option>

                                    <option>
                                        Kho Đà Nẵng
                                    </option>

                                    <option>
                                        Kho TP.HCM
                                    </option>
                                </select>

                                <button
                                    type="submit"
                                    className="h-10 w-full rounded-xl bg-blue-600 text-sm font-bold !text-white hover:bg-blue-700"
                                >
                                    Xác nhận
                                </button>
                            </form>
                        )}
                    </Modal>
                )}
            </main>
        );
    };

const MiniStat = ({
                      icon: Icon,
                      label,
                      value,
                      tone,
                  }: {
    icon: typeof Boxes;
    label: string;
    value: string;
    tone:
        | "blue"
        | "emerald"
        | "amber"
        | "rose";
}) => {
    const toneClasses = {
        blue:
            "bg-blue-50 text-blue-600",
        emerald:
            "bg-emerald-50 text-emerald-600",
        amber:
            "bg-amber-50 text-amber-600",
        rose:
            "bg-rose-50 text-rose-600",
    };

    return (
        <div className="rounded-xl border border-slate-100 p-3">
            <span
                className={[
                    "flex size-9 items-center justify-center rounded-xl",
                    toneClasses[
                        tone
                        ],
                ].join(" ")}
            >
                <Icon
                    size={17}
                />
            </span>

            <p className="mt-3 text-xl font-bold text-slate-950">
                {value}
            </p>

            <p className="text-[10px] text-slate-500">
                {label}
            </p>
        </div>
    );
};

const WarehouseCapacity = ({
                               name,
                               current,
                               capacity,
                           }: {
    name: string;
    current: number;
    capacity: number;
}) => {
    const percent =
        Math.round(
            (current /
                capacity) *
            100,
        );

    return (
        <div className="grid grid-cols-[90px_1fr_42px] items-center gap-3">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                <Building2
                    size={13}
                />

                {name}
            </span>

            <div>
                <p className="mb-1 text-[10px] text-slate-400">
                    {current} /{" "}
                    {capacity} thiết bị
                </p>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                        className="h-full rounded-full bg-blue-600"
                        style={{
                            width:
                                `${percent}%`,
                        }}
                    />
                </div>
            </div>

            <span className="text-xs font-bold text-blue-600">
                {percent}%
            </span>
        </div>
    );
};

const WarehouseCapacityDetails = () => {
    const warehouses = [
        {
            name: "Hà Nội",
            current: 620,
            capacity: 1000,
            available: 380,
            ready: 438,
            rented: 112,
            transferring: 42,
            maintenance: 28,
            warning: 9,
        },
        {
            name: "Đà Nẵng",
            current: 280,
            capacity: 600,
            available: 320,
            ready: 192,
            rented: 49,
            transferring: 23,
            maintenance: 16,
            warning: 6,
        },
        {
            name: "TP.HCM",
            current: 480,
            capacity: 1200,
            available: 720,
            ready: 337,
            rented: 78,
            transferring: 61,
            maintenance: 24,
            warning: 13,
        },
    ];

    return (
        <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">
                        Tổng sức chứa
                    </p>

                    <p className="mt-1 text-xl font-bold text-slate-950">
                        2.800 thiết bị
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">
                        Đang sử dụng
                    </p>

                    <p className="mt-1 text-xl font-bold text-blue-600">
                        1.380 thiết bị
                    </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">
                        Còn trống
                    </p>

                    <p className="mt-1 text-xl font-bold text-emerald-600">
                        1.420 vị trí
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="grid grid-cols-[120px_130px_minmax(180px,1fr)_90px_90px_90px_90px_80px] gap-3 bg-slate-50 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                    <span>Kho</span>
                    <span>Sử dụng</span>
                    <span>Công suất</span>
                    <span>Sẵn sàng</span>
                    <span>Cho thuê</span>
                    <span>Điều chuyển</span>
                    <span>Bảo trì</span>
                    <span>Cảnh báo</span>
                </div>

                {warehouses.map((warehouse) => {
                    const percent = Math.round(
                        (warehouse.current /
                            warehouse.capacity) *
                        100,
                    );

                    return (
                        <div
                            key={warehouse.name}
                            className="grid grid-cols-[120px_130px_minmax(180px,1fr)_90px_90px_90px_90px_80px] items-center gap-3 border-t border-slate-100 px-4 py-3 text-xs"
                        >
                            <span className="inline-flex items-center gap-2 font-semibold text-slate-800">
                                <Building2 size={14} className="text-slate-400" />
                                {warehouse.name}
                            </span>

                            <div>
                                <p className="font-semibold text-slate-800">
                                    {warehouse.current} / {warehouse.capacity}
                                </p>

                                <p className="mt-0.5 text-[10px] text-slate-400">
                                    Còn {warehouse.available} vị trí
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-blue-600"
                                        style={{
                                            width: `${percent}%`,
                                        }}
                                    />
                                </div>

                                <span className="w-9 text-right font-bold text-blue-600">
                                    {percent}%
                                </span>
                            </div>

                            <span className="font-semibold text-emerald-700">
                                {warehouse.ready}
                            </span>

                            <span className="font-semibold text-blue-700">
                                {warehouse.rented}
                            </span>

                            <span className="font-semibold text-amber-700">
                                {warehouse.transferring}
                            </span>

                            <span className="font-semibold text-violet-700">
                                {warehouse.maintenance}
                            </span>

                            <span className="font-bold text-rose-600">
                                {warehouse.warning}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                {warehouses.map((warehouse) => {
                    const percent = Math.round(
                        (warehouse.current /
                            warehouse.capacity) *
                        100,
                    );

                    return (
                        <div
                            key={`${warehouse.name}-summary`}
                            className="rounded-xl border border-slate-200 p-3"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-slate-900">
                                    Kho {warehouse.name}
                                </p>

                                <span
                                    className={[
                                        "rounded-full px-2 py-1 text-[10px] font-bold",
                                        percent >= 80
                                            ? "bg-rose-50 text-rose-700"
                                            : percent >= 60
                                                ? "bg-amber-50 text-amber-700"
                                                : "bg-emerald-50 text-emerald-700",
                                    ].join(" ")}
                                >
                                    {percent >= 80
                                        ? "Gần đầy"
                                        : percent >= 60
                                            ? "Theo dõi"
                                            : "Ổn định"}
                                </span>
                            </div>

                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-blue-600"
                                    style={{
                                        width: `${percent}%`,
                                    }}
                                />
                            </div>

                            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                                <span>
                                    Đã dùng {warehouse.current}
                                </span>

                                <span>
                                    Còn {warehouse.available}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const StockAlertsContent = ({
                                onViewEquipment,
                            }: {
    onViewEquipment: (
        item: EquipmentRow,
    ) => void;
}) => {
    const alertItems = EQUIPMENT.filter(
        (item) =>
            item.quantity <= 12 ||
            item.status ===
            "MAINTENANCE",
    ).slice(0, 8);

    return (
        <div className="space-y-3">
            <div className="rounded-xl bg-rose-50 px-3 py-2">
                <p className="text-xs font-semibold text-rose-700">
                    Có {alertItems.length} thiết bị cần chú ý trong danh sách mô phỏng.
                </p>
                <p className="mt-0.5 text-[11px] text-rose-500">
                    Bao gồm thiết bị tồn kho thấp hoặc đang bảo trì.
                </p>
            </div>

            <div className="max-h-[420px] overflow-y-auto rounded-xl border border-slate-200">
                {alertItems.map(
                    (item) => (
                        <div
                            key={
                                item.id
                            }
                            className="flex items-center gap-3 border-b border-slate-100 px-3 py-3 last:border-b-0"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                <AlertTriangle
                                    size={
                                        16
                                    }
                                />
                            </span>

                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {
                                        item.name
                                    }
                                </p>

                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                    <span>
                                        {
                                            item.code
                                        }
                                    </span>

                                    <span>
                                        •
                                    </span>

                                    <span>
                                        Kho{" "}
                                        {
                                            item.warehouse
                                        }
                                    </span>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-xs font-bold text-rose-600">
                                    {item.status ===
                                    "MAINTENANCE"
                                        ? "Đang bảo trì"
                                        : `Còn ${item.quantity}`}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        onViewEquipment(
                                            item,
                                        );
                                    }}
                                    className="mt-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Xem thiết bị
                                </button>
                            </div>
                        </div>
                    ),
                )}
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
                    ? "max-w-4xl"
                    : "max-w-md",
            ].join(" ")}
        >
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h2 className="font-bold text-slate-950">
                        {title}
                    </h2>

                    {size === "LARGE" ? (
                        <p className="mt-1 text-xs text-slate-400">
                            Theo dõi mức sử dụng, dung lượng còn trống và tình trạng vận hành của từng kho.
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


const Info = ({
                  label,
                  value,
              }: {
    label: string;
    value: string;
}) => (
    <div className="flex justify-between gap-4 border-b border-slate-100 pb-2">
        <span className="text-slate-500">
            {label}
        </span>

        <span className="text-right font-semibold text-slate-800">
            {value}
        </span>
    </div>
);