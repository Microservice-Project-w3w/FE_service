import type {
    LucideIcon,
} from "lucide-react";

import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    MapPin,
    PackageCheck,
    Phone,
    Truck,
    UserRound,
    XCircle,
} from "lucide-react";

import {
    Link,
    Navigate,
    useParams,
} from "react-router";

type RentalStatus =
    | "NEW"
    | "PROCESSING"
    | "DELIVERING"
    | "COMPLETED"
    | "CANCELLED";

interface RentalHistoryItem {
    id: string;
    title: string;
    description: string;
    date: string;
    type: RentalStatus;
}

interface RentalDetail {
    id: string;
    code: string;
    quotationCode: string;
    customerName: string;
    contactName: string;
    phone: string;
    address: string;
    startDate: string;
    endDate: string;
    createdDate: string;
    value: number;
    status: RentalStatus;
    equipmentName: string;
    equipmentCode: string;
    equipmentModel: string;
    quantity: number;
    note: string;
    history: RentalHistoryItem[];
}

const COMPANY_SEEDS = [
    {
        customerName: "Công ty TNHH ABC",
        contactName: "Nguyễn Văn An",
        phone: "0901 234 567",
        equipmentName: "Máy phát điện 50kVA",
        equipmentCode: "EQ-001",
        equipmentModel: "Cummins C50D5",
        value: 85000000,
    },
    {
        customerName: "Công ty XYZ",
        contactName: "Trần Thị B",
        phone: "0902 345 678",
        equipmentName: "Xe nâng người 12m",
        equipmentCode: "EQ-004",
        equipmentModel: "Genie GS-3246",
        value: 52000000,
    },
    {
        customerName: "Công ty DEF",
        contactName: "Lê Văn C",
        phone: "0903 456 789",
        equipmentName: "Máy đào 0.9m³",
        equipmentCode: "EQ-005",
        equipmentModel: "Kobelco SK75",
        value: 120000000,
    },
    {
        customerName: "Công ty GHI",
        contactName: "Phạm Thị D",
        phone: "0904 567 890",
        equipmentName: "Máy nén khí 10HP",
        equipmentCode: "EQ-006",
        equipmentModel: "Airman PDS100S",
        value: 28000000,
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

const HISTORY_CONFIG: Record<
    RentalStatus,
    {
        icon: LucideIcon;
        className: string;
    }
> = {
    NEW: {
        icon: PackageCheck,
        className:
            "bg-blue-50 text-blue-600",
    },
    PROCESSING: {
        icon: Clock3,
        className:
            "bg-orange-50 text-orange-600",
    },
    DELIVERING: {
        icon: Truck,
        className:
            "bg-violet-50 text-violet-600",
    },
    COMPLETED: {
        icon: CheckCircle2,
        className:
            "bg-emerald-50 text-emerald-600",
    },
    CANCELLED: {
        icon: XCircle,
        className:
            "bg-rose-50 text-rose-600",
    },
};

const formatCurrency = (
    value: number,
): string =>
    `${new Intl.NumberFormat(
        "vi-VN",
    ).format(value)} đ`;

const buildRentalDetail = (
    rentalId: string,
): RentalDetail | null => {
    const match =
        rentalId.match(
            /^rental-(\d{3})$/,
        );

    if (!match) {
        return null;
    }

    const number =
        Number(match[1]);

    if (
        number < 1 ||
        number > 28
    ) {
        return null;
    }

    const index =
        number - 1;

    const seed =
        COMPANY_SEEDS[
        index %
        COMPANY_SEEDS.length
            ];

    const status =
        STATUS_PATTERN[
        index %
        STATUS_PATTERN.length
            ];

    const codeNumber =
        28 - index;

    const history: RentalHistoryItem[] = [
        {
            id: "history-001",
            title: "Tạo đơn thuê",
            description:
                "Nhân viên kinh doanh đã tạo đơn thuê từ báo giá đã chốt.",
            date:
                "13/08/2026 10:30",
            type: "NEW",
        },
    ];

    if (
        status !== "NEW"
    ) {
        history.push({
            id: "history-002",
            title:
                status === "PROCESSING"
                    ? "Đơn thuê đang được xử lý"
                    : status === "DELIVERING"
                        ? "Thiết bị đang được giao"
                        : status === "COMPLETED"
                            ? "Đơn thuê đã hoàn thành"
                            : "Đơn thuê đã bị hủy",
            description:
                "Trạng thái đơn thuê đã được cập nhật.",
            date:
                "13/08/2026 14:15",
            type: status,
        });
    }

    return {
        id: rentalId,
        code: `RENT-2026-${String(
            codeNumber,
        ).padStart(3, "0")}`,
        quotationCode: `BG-2026-${String(
            24 - (index % 20),
        ).padStart(4, "0")}`,
        customerName:
        seed.customerName,
        contactName:
        seed.contactName,
        phone:
        seed.phone,
        address:
            index % 2 === 0
                ? "123 Đường Láng, Đống Đa, Hà Nội"
                : "88 Nguyễn Huệ, Quận 1, TP.HCM",
        startDate:
            "14/08/2026",
        endDate:
            "20/08/2026",
        createdDate:
            "13/08/2026",
        value:
            seed.value +
            (index % 3) *
            2500000,
        status,
        equipmentName:
        seed.equipmentName,
        equipmentCode:
        seed.equipmentCode,
        equipmentModel:
        seed.equipmentModel,
        quantity:
            (index % 3) + 1,
        note:
            "Chuẩn bị thiết bị đầy đủ trước thời gian giao, kiểm tra phụ kiện và biên bản bàn giao.",
        history,
    };
};

export const SalesRentalDetailPage =
    () => {
        const {
            rentalId,
        } = useParams<{
            rentalId: string;
        }>();

        const rental =
            rentalId
                ? buildRentalDetail(
                    rentalId,
                )
                : null;

        if (!rental) {
            return (
                <Navigate
                    to="/sales/rentals"
                    replace
                />
            );
        }

        const status =
            STATUS_CONFIG[
                rental.status
                ];

        return (
            <main className="space-y-4">
                <header className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
                            <Link
                                to="/sales/rentals"
                                className="hover:text-blue-600"
                            >
                                Đơn thuê
                            </Link>

                            <span>/</span>

                            <span className="font-semibold text-slate-700">
                                {rental.code}
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-950">
                                {rental.code}
                            </h1>

                            <span
                                className={[
                                    "rounded-full border px-2.5 py-1 text-[11px] font-bold",
                                    status.className,
                                ].join(" ")}
                            >
                                {status.label}
                            </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                            Chi tiết đơn thuê và tiến trình xử lý.
                        </p>
                    </div>

                    <Link
                        to="/sales/rentals"
                        className="inline-flex h-9 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 lg:self-auto"
                    >
                        <ArrowLeft
                            size={15}
                        />

                        Quay lại
                    </Link>
                </header>

                <section className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Building2
                                size={16}
                                className="text-blue-600"
                            />

                            <h2 className="text-sm font-bold text-slate-950">
                                Thông tin khách hàng
                            </h2>
                        </div>

                        <h3 className="mt-4 text-base font-bold text-slate-950">
                            {rental.customerName}
                        </h3>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <InfoRow
                                icon={UserRound}
                                label="Người liên hệ"
                                value={rental.contactName}
                            />

                            <InfoRow
                                icon={Phone}
                                label="Số điện thoại"
                                value={rental.phone}
                            />

                            <InfoRow
                                icon={MapPin}
                                label="Địa chỉ giao"
                                value={rental.address}
                            />

                            <InfoRow
                                icon={FileText}
                                label="Báo giá"
                                value={rental.quotationCode}
                            />
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={16}
                                className="text-violet-600"
                            />

                            <h2 className="text-sm font-bold text-slate-950">
                                Thông tin thuê
                            </h2>
                        </div>

                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                            <InfoBlock
                                label="Ngày tạo"
                                value={rental.createdDate}
                            />

                            <InfoBlock
                                label="Ngày bắt đầu"
                                value={rental.startDate}
                            />

                            <InfoBlock
                                label="Ngày kết thúc"
                                value={rental.endDate}
                            />

                            <InfoBlock
                                label="Giá trị đơn"
                                value={formatCurrency(
                                    rental.value,
                                )}
                            />

                            <InfoBlock
                                label="Trạng thái"
                                value={status.label}
                            />

                            <InfoBlock
                                label="Mã đơn"
                                value={rental.code}
                            />
                        </div>

                        <div className="mt-4 rounded-xl bg-slate-50 p-3">
                            <p className="text-[11px] font-semibold text-slate-500">
                                Ghi chú
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-700">
                                {rental.note}
                            </p>
                        </div>
                    </article>
                </section>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                            <PackageCheck
                                size={16}
                                className="text-blue-600"
                            />

                            <h2 className="text-sm font-bold text-slate-950">
                                Thiết bị thuê
                            </h2>
                        </div>

                        <div className="mt-4 grid gap-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 sm:grid-cols-4">
                            <InfoBlock
                                label="Tên thiết bị"
                                value={rental.equipmentName}
                            />

                            <InfoBlock
                                label="Mã thiết bị"
                                value={rental.equipmentCode}
                            />

                            <InfoBlock
                                label="Model"
                                value={rental.equipmentModel}
                            />

                            <InfoBlock
                                label="Số lượng"
                                value={String(
                                    rental.quantity,
                                )}
                            />
                        </div>
                    </article>

                    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-950">
                            Thao tác nhanh
                        </h2>

                        <div className="mt-4 space-y-2">
                            {rental.status ===
                                "NEW" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            window.alert(
                                                "Đã chuyển đơn sang trạng thái Đang xử lý.",
                                            );
                                        }}
                                        className="h-9 w-full rounded-xl bg-orange-500 text-xs font-bold !text-white hover:bg-orange-600"
                                    >
                                        Tiếp nhận xử lý
                                    </button>
                                )}

                            {rental.status ===
                                "PROCESSING" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            window.alert(
                                                "Đã chuyển đơn sang trạng thái Đang giao.",
                                            );
                                        }}
                                        className="h-9 w-full rounded-xl bg-violet-600 text-xs font-bold !text-white hover:bg-violet-700"
                                    >
                                        Chuyển sang giao hàng
                                    </button>
                                )}

                            {rental.status ===
                                "DELIVERING" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            window.alert(
                                                "Đã hoàn thành đơn thuê.",
                                            );
                                        }}
                                        className="h-9 w-full rounded-xl bg-emerald-600 text-xs font-bold !text-white hover:bg-emerald-700"
                                    >
                                        Hoàn thành đơn
                                    </button>
                                )}

                            <Link
                                to="/sales/rentals/activities"
                                className="flex h-9 w-full items-center justify-center rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Xem lịch sử hoạt động
                            </Link>
                        </div>
                    </aside>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Clock3
                            size={16}
                            className="text-slate-500"
                        />

                        <h2 className="text-sm font-bold text-slate-950">
                            Lịch sử đơn thuê
                        </h2>
                    </div>

                    <div className="mt-4">
                        {rental.history.map(
                            (
                                history,
                                index,
                            ) => {
                                const config =
                                    HISTORY_CONFIG[
                                        history.type
                                        ];

                                const Icon =
                                    config.icon;

                                return (
                                    <div
                                        key={
                                            history.id
                                        }
                                        className="relative flex gap-3 pb-4 last:pb-0"
                                    >
                                        {index <
                                            rental.history.length -
                                            1 && (
                                                <span className="absolute left-[15px] top-8 h-[calc(100%-12px)] w-px bg-slate-200" />
                                            )}

                                        <span
                                            className={[
                                                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
                                                config.className,
                                            ].join(" ")}
                                        >
                                            <Icon
                                                size={15}
                                            />
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                                <div>
                                                    <h3 className="text-xs font-bold text-slate-900">
                                                        {
                                                            history.title
                                                        }
                                                    </h3>

                                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                                        {
                                                            history.description
                                                        }
                                                    </p>
                                                </div>

                                                <span className="shrink-0 text-[10px] font-medium text-slate-400">
                                                    {
                                                        history.date
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                </section>
            </main>
        );
    };

const InfoRow = ({
                     icon: Icon,
                     label,
                     value,
                 }: {
    icon: LucideIcon;
    label: string;
    value: string;
}) => (
    <div className="flex items-start gap-2.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
            <Icon
                size={14}
            />
        </span>

        <div className="min-w-0">
            <p className="text-[10px] text-slate-400">
                {label}
            </p>

            <p className="mt-0.5 break-words text-xs font-semibold text-slate-800">
                {value}
            </p>
        </div>
    </div>
);

const InfoBlock = ({
                       label,
                       value,
                   }: {
    label: string;
    value: string;
}) => (
    <div>
        <p className="text-[10px] font-medium text-slate-400">
            {label}
        </p>

        <p className="mt-1 text-xs font-semibold text-slate-800">
            {value}
        </p>
    </div>
);