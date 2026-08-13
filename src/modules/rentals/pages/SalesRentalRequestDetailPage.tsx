import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    MapPin,
    Package,
    Phone,
    ReceiptText,
    UserRound,
} from "lucide-react";

import {
    Link,
    Navigate,
    useParams,
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

interface EquipmentItem {
    id: string;
    equipmentName: string;
    category: string;
    quantity: number;
    rentalDays: number;
    estimatedPrice: number;
}

interface RequestTimelineItem {
    id: string;
    title: string;
    description: string;
    date: string;
    completed: boolean;
}

interface RentalRequestDetail {
    id: string;
    requestCode: string;

    customerName: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;

    branch: string;
    deliveryAddress: string;

    createdDate: string;
    rentalStartDate: string;
    rentalEndDate: string;

    purpose: string;
    note: string;

    status: RentalRequestStatus;
    priority: RentalRequestPriority;

    equipment: EquipmentItem[];

    timeline: RequestTimelineItem[];
}

const REQUEST_DETAIL_MOCKS:
    RentalRequestDetail[] = [
    {
        id: "request-001",
        requestCode: "REQ-2026-028",

        customerName:
            "Công ty ABC",

        contactName:
            "Nguyễn Văn A",

        contactPhone:
            "0901 234 567",

        contactEmail:
            "nguyenvana@abc.vn",

        branch:
            "Chi nhánh Hà Nội",

        deliveryAddress:
            "123 Đường Láng, Đống Đa, Hà Nội",

        createdDate:
            "12/08/2026 10:30",

        rentalStartDate:
            "20/08/2026",

        rentalEndDate:
            "22/08/2026",

        purpose:
            "Tổ chức sự kiện giới thiệu sản phẩm mới tại Hà Nội.",

        note:
            "Khách hàng yêu cầu giao thiết bị trước 08:00 sáng ngày 20/08/2026.",

        status: "NEW",

        priority: "HIGH",

        equipment: [
            {
                id: "equipment-001",
                equipmentName:
                    "Loa Array JBL VTX A8",
                category:
                    "Âm thanh",
                quantity: 6,
                rentalDays: 3,
                estimatedPrice:
                    18000000,
            },
            {
                id: "equipment-002",
                equipmentName:
                    "Đèn Beam 450W",
                category:
                    "Ánh sáng",
                quantity: 4,
                rentalDays: 3,
                estimatedPrice:
                    9600000,
            },
            {
                id: "equipment-003",
                equipmentName:
                    "Micro Shure Axient",
                category:
                    "Âm thanh",
                quantity: 2,
                rentalDays: 3,
                estimatedPrice:
                    4800000,
            },
        ],

        timeline: [
            {
                id: "timeline-001",
                title:
                    "Yêu cầu được tạo",
                description:
                    "Khách hàng gửi yêu cầu thuê thiết bị.",
                date:
                    "12/08/2026 10:30",
                completed: true,
            },
            {
                id: "timeline-002",
                title:
                    "Tiếp nhận yêu cầu",
                description:
                    "Nhân viên kinh doanh kiểm tra thông tin yêu cầu.",
                date:
                    "Chưa thực hiện",
                completed: false,
            },
            {
                id: "timeline-003",
                title:
                    "Chuẩn bị báo giá",
                description:
                    "Tạo báo giá dựa trên thiết bị và thời gian thuê.",
                date:
                    "Chưa thực hiện",
                completed: false,
            },
        ],
    },

    {
        id: "request-002",
        requestCode: "REQ-2026-027",

        customerName:
            "Công ty XYZ",

        contactName:
            "Trần Thị B",

        contactPhone:
            "0902 345 678",

        contactEmail:
            "tranthib@xyz.vn",

        branch:
            "Chi nhánh Hà Nội",

        deliveryAddress:
            "89 Trần Thái Tông, Cầu Giấy, Hà Nội",

        createdDate:
            "12/08/2026 09:15",

        rentalStartDate:
            "18/08/2026",

        rentalEndDate:
            "20/08/2026",

        purpose:
            "Phục vụ hội nghị khách hàng thường niên.",

        note:
            "Cần kiểm tra số lượng thiết bị trước khi lập báo giá.",

        status:
            "PROCESSING",

        priority: "HIGH",

        equipment: [
            {
                id: "equipment-004",
                equipmentName:
                    "Màn hình LED P3",
                category:
                    "Trình chiếu",
                quantity: 12,
                rentalDays: 3,
                estimatedPrice:
                    36000000,
            },
            {
                id: "equipment-005",
                equipmentName:
                    "Đèn Beam 450W",
                category:
                    "Ánh sáng",
                quantity: 8,
                rentalDays: 3,
                estimatedPrice:
                    19200000,
            },
            {
                id: "equipment-006",
                equipmentName:
                    "Micro Shure Axient",
                category:
                    "Âm thanh",
                quantity: 5,
                rentalDays: 3,
                estimatedPrice:
                    12000000,
            },
        ],

        timeline: [
            {
                id: "timeline-004",
                title:
                    "Yêu cầu được tạo",
                description:
                    "Khách hàng gửi yêu cầu thuê thiết bị.",
                date:
                    "12/08/2026 09:15",
                completed: true,
            },
            {
                id: "timeline-005",
                title:
                    "Đang xử lý",
                description:
                    "Nhân viên kinh doanh đang kiểm tra khả dụng thiết bị.",
                date:
                    "12/08/2026 10:10",
                completed: true,
            },
            {
                id: "timeline-006",
                title:
                    "Chuẩn bị báo giá",
                description:
                    "Chờ hoàn thiện thông tin giá thuê.",
                date:
                    "Chưa thực hiện",
                completed: false,
            },
        ],
    },

    {
        id: "request-003",
        requestCode:
            "REQ-2026-026",

        customerName:
            "Công ty DEF",

        contactName:
            "Lê Văn C",

        contactPhone:
            "0903 456 789",

        contactEmail:
            "levanc@def.vn",

        branch:
            "Chi nhánh Đà Nẵng",

        deliveryAddress:
            "56 Bạch Đằng, Hải Châu, Đà Nẵng",

        createdDate:
            "11/08/2026 16:45",

        rentalStartDate:
            "25/08/2026",

        rentalEndDate:
            "26/08/2026",

        purpose:
            "Thuê thiết bị cho chương trình hội nghị doanh nghiệp.",

        note:
            "Khách hàng cần xác nhận trước ngày 18/08.",

        status:
            "PROCESSING",

        priority:
            "MEDIUM",

        equipment: [
            {
                id: "equipment-007",
                equipmentName:
                    "Loa Array JBL VTX A8",
                category:
                    "Âm thanh",
                quantity: 4,
                rentalDays: 2,
                estimatedPrice:
                    8000000,
            },
            {
                id: "equipment-008",
                equipmentName:
                    "Micro Shure Axient",
                category:
                    "Âm thanh",
                quantity: 4,
                rentalDays: 2,
                estimatedPrice:
                    6400000,
            },
        ],

        timeline: [
            {
                id: "timeline-007",
                title:
                    "Yêu cầu được tạo",
                description:
                    "Yêu cầu thuê đã được ghi nhận.",
                date:
                    "11/08/2026 16:45",
                completed: true,
            },
            {
                id: "timeline-008",
                title:
                    "Đang xử lý",
                description:
                    "Sales đang kiểm tra thông tin.",
                date:
                    "12/08/2026 08:30",
                completed: true,
            },
        ],
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
        label: "Đã báo giá",
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
        className: string;
        dot: string;
    }
> = {
    HIGH: {
        label: "Ưu tiên cao",
        className:
            "border-rose-100 bg-rose-50 text-rose-700",
        dot: "bg-rose-500",
    },

    MEDIUM: {
        label: "Ưu tiên trung bình",
        className:
            "border-orange-100 bg-orange-50 text-orange-700",
        dot: "bg-orange-500",
    },

    LOW: {
        label: "Ưu tiên thấp",
        className:
            "border-emerald-100 bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
    },
};

const formatCurrency = (
    value: number,
): string =>
    `${new Intl.NumberFormat(
        "vi-VN",
    ).format(value)} đ`;

export const SalesRentalRequestDetailPage =
    () => {
        const {
            requestId,
        } = useParams<{
            requestId: string;
        }>();

        const request =
            REQUEST_DETAIL_MOCKS.find(
                (item) =>
                    item.id === requestId,
            );

        if (!request) {
            return (
                <Navigate
                    to="/sales/rental-requests"
                    replace
                />
            );
        }

        const status =
            STATUS_CONFIG[
                request.status
                ];

        const priority =
            PRIORITY_CONFIG[
                request.priority
                ];

        const totalEquipment =
            request.equipment.reduce(
                (
                    total,
                    equipment,
                ) =>
                    total +
                    equipment.quantity,
                0,
            );

        const estimatedValue =
            request.equipment.reduce(
                (
                    total,
                    equipment,
                ) =>
                    total +
                    equipment.estimatedPrice,
                0,
            );

        return (
            <main className="space-y-5">
                {/* HEADER */}
                <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                            <Link
                                to="/sales/rental-requests"
                                className="transition hover:text-blue-600"
                            >
                                Yêu cầu thuê
                            </Link>

                            <span>
                                /
                            </span>

                            <span className="font-medium text-slate-700">
                                {
                                    request.requestCode
                                }
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                                {
                                    request.requestCode
                                }
                            </h1>

                            <span
                                className={[
                                    "rounded-full border px-3 py-1 text-xs font-bold",
                                    status.className,
                                ].join(
                                    " ",
                                )}
                            >
                                {
                                    status.label
                                }
                            </span>

                            <span
                                className={[
                                    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold",
                                    priority.className,
                                ].join(
                                    " ",
                                )}
                            >
                                <span
                                    className={[
                                        "size-2 rounded-full",
                                        priority.dot,
                                    ].join(
                                        " ",
                                    )}
                                />

                                {
                                    priority.label
                                }
                            </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            Chi tiết yêu cầu
                            thuê thiết bị của
                            khách hàng.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            to="/sales/rental-requests"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                        >
                            <ArrowLeft
                                size={
                                    16
                                }
                            />

                            Quay lại
                        </Link>

                        {request.status ===
                            "NEW" && (
                                <button
                                    type="button"
                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                >
                                    <Clock3
                                        size={
                                            17
                                        }
                                    />

                                    Tiếp nhận xử lý
                                </button>
                            )}

                        {(request.status ===
                            "NEW" ||
                            request.status ===
                            "PROCESSING") && (
                            <button
                                type="button"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                <ReceiptText
                                    size={
                                        17
                                    }
                                />

                                Tạo báo giá
                            </button>
                        )}
                    </div>
                </header>

                {/* CUSTOMER + REQUEST */}
                <section className="grid gap-5 xl:grid-cols-[0.9fr_1.3fr]">
                    {/* CUSTOMER */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Building2
                                size={
                                    18
                                }
                                className="text-slate-500"
                            />

                            <h2 className="font-bold text-slate-950">
                                Thông tin khách hàng
                            </h2>
                        </div>

                        <div className="mt-5">
                            <p className="text-lg font-bold text-slate-950">
                                {
                                    request.customerName
                                }
                            </p>

                            <div className="mt-4 space-y-3">
                                <InfoRow
                                    icon={
                                        UserRound
                                    }
                                    label="Người liên hệ"
                                    value={
                                        request.contactName
                                    }
                                />

                                <InfoRow
                                    icon={
                                        Phone
                                    }
                                    label="Điện thoại"
                                    value={
                                        request.contactPhone
                                    }
                                />

                                <InfoRow
                                    icon={
                                        FileText
                                    }
                                    label="Email"
                                    value={
                                        request.contactEmail
                                    }
                                />

                                <InfoRow
                                    icon={
                                        Building2
                                    }
                                    label="Chi nhánh"
                                    value={
                                        request.branch
                                    }
                                />

                                <InfoRow
                                    icon={
                                        MapPin
                                    }
                                    label="Địa chỉ giao"
                                    value={
                                        request.deliveryAddress
                                    }
                                />
                            </div>
                        </div>
                    </article>

                    {/* RENTAL INFO */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={
                                    18
                                }
                                className="text-slate-500"
                            />

                            <h2 className="font-bold text-slate-950">
                                Thông tin yêu cầu
                            </h2>
                        </div>

                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                            <InfoBlock
                                label="Ngày tạo yêu cầu"
                                value={
                                    request.createdDate
                                }
                            />

                            <InfoBlock
                                label="Thời gian thuê"
                                value={`${request.rentalStartDate} → ${request.rentalEndDate}`}
                            />

                            <div className="sm:col-span-2">
                                <InfoBlock
                                    label="Mục đích thuê"
                                    value={
                                        request.purpose
                                    }
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <InfoBlock
                                    label="Ghi chú"
                                    value={
                                        request.note
                                    }
                                />
                            </div>
                        </div>
                    </article>
                </section>

                {/* EQUIPMENT + SUMMARY */}
                <section className="grid gap-5 xl:grid-cols-[1.5fr_0.7fr]">
                    {/* EQUIPMENT */}
                    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <header className="border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center gap-2">
                                <Package
                                    size={
                                        18
                                    }
                                    className="text-slate-500"
                                />

                                <h2 className="font-bold text-slate-950">
                                    Danh sách thiết bị
                                </h2>
                            </div>

                            <p className="mt-1 text-xs text-slate-400">
                                Thiết bị khách
                                hàng đang yêu cầu
                                thuê.
                            </p>
                        </header>

                        <div className="overflow-x-auto">
                            <div className="min-w-[700px]">
                                <div className="grid grid-cols-[minmax(220px,1fr)_130px_90px_100px_150px] gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-3 text-xs font-semibold text-slate-500">
                                    <span>
                                        Thiết bị
                                    </span>

                                    <span>
                                        Danh mục
                                    </span>

                                    <span>
                                        Số lượng
                                    </span>

                                    <span>
                                        Số ngày
                                    </span>

                                    <span className="text-right">
                                        Giá dự kiến
                                    </span>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {request.equipment.map(
                                        (
                                            equipment,
                                        ) => (
                                            <div
                                                key={
                                                    equipment.id
                                                }
                                                className="grid grid-cols-[minmax(220px,1fr)_130px_90px_100px_150px] items-center gap-3 px-5 py-4"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                        <Package
                                                            size={
                                                                18
                                                            }
                                                        />
                                                    </span>

                                                    <p className="text-sm font-bold text-slate-900">
                                                        {
                                                            equipment.equipmentName
                                                        }
                                                    </p>
                                                </div>

                                                <p className="text-sm text-slate-600">
                                                    {
                                                        equipment.category
                                                    }
                                                </p>

                                                <p className="text-sm font-semibold text-slate-800">
                                                    {
                                                        equipment.quantity
                                                    }
                                                </p>

                                                <p className="text-sm text-slate-600">
                                                    {
                                                        equipment.rentalDays
                                                    }{" "}
                                                    ngày
                                                </p>

                                                <p className="text-right text-sm font-bold text-slate-900">
                                                    {formatCurrency(
                                                        equipment.estimatedPrice,
                                                    )}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* SUMMARY */}
                    <article className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="font-bold text-slate-950">
                            Tổng quan yêu cầu
                        </h2>

                        <div className="mt-5 divide-y divide-slate-100">
                            <SummaryRow
                                label="Loại thiết bị"
                                value={`${request.equipment.length} loại`}
                            />

                            <SummaryRow
                                label="Tổng thiết bị"
                                value={`${totalEquipment} thiết bị`}
                            />

                            <SummaryRow
                                label="Giá trị dự kiến"
                                value={formatCurrency(
                                    estimatedValue,
                                )}
                                important
                            />
                        </div>

                        <div className="mt-5 rounded-xl bg-blue-50 p-4">
                            <p className="text-xs font-semibold text-blue-600">
                                Lưu ý
                            </p>

                            <p className="mt-1 text-xs leading-5 text-blue-700">
                                Đây là giá trị dự
                                kiến từ yêu cầu
                                thuê. Giá chính
                                thức sẽ được xác
                                định khi lập báo
                                giá.
                            </p>
                        </div>
                    </article>
                </section>

                {/* TIMELINE */}
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Clock3
                            size={18}
                            className="text-slate-500"
                        />

                        <h2 className="font-bold text-slate-950">
                            Tiến trình xử lý
                        </h2>
                    </div>

                    <div className="mt-6">
                        {request.timeline.map(
                            (
                                item,
                                index,
                            ) => (
                                <div
                                    key={
                                        item.id
                                    }
                                    className="relative flex gap-4 pb-6 last:pb-0"
                                >
                                    {index <
                                        request
                                            .timeline
                                            .length -
                                        1 && (
                                            <span className="absolute left-[19px] top-10 h-[calc(100%-20px)] w-px bg-slate-200" />
                                        )}

                                    <span
                                        className={
                                            item.completed
                                                ? "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
                                                : "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400"
                                        }
                                    >
                                        {item.completed ? (
                                            <CheckCircle2
                                                size={
                                                    18
                                                }
                                            />
                                        ) : (
                                            <Clock3
                                                size={
                                                    18
                                                }
                                            />
                                        )}
                                    </span>

                                    <div className="min-w-0 flex-1 pt-1">
                                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">
                                                    {
                                                        item.title
                                                    }
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {
                                                        item.description
                                                    }
                                                </p>
                                            </div>

                                            <span className="shrink-0 text-xs font-medium text-slate-400">
                                                {
                                                    item.date
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </section>
            </main>
        );
    };

interface InfoRowProps {
    icon: typeof UserRound;
    label: string;
    value: string;
}

const InfoRow = ({
                     icon: Icon,
                     label,
                     value,
                 }: InfoRowProps) => (
    <div className="flex items-start gap-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
            <Icon size={15} />
        </span>

        <div>
            <p className="text-xs text-slate-400">
                {label}
            </p>

            <p className="mt-0.5 text-sm font-semibold text-slate-800">
                {value}
            </p>
        </div>
    </div>
);

interface InfoBlockProps {
    label: string;
    value: string;
}

const InfoBlock = ({
                       label,
                       value,
                   }: InfoBlockProps) => (
    <div>
        <p className="text-xs font-medium text-slate-400">
            {label}
        </p>

        <p className="mt-1.5 text-sm font-semibold leading-6 text-slate-800">
            {value}
        </p>
    </div>
);

interface SummaryRowProps {
    label: string;
    value: string;
    important?: boolean;
}

const SummaryRow = ({
                        label,
                        value,
                        important = false,
                    }: SummaryRowProps) => (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
        <span className="text-sm text-slate-500">
            {label}
        </span>

        <span
            className={
                important
                    ? "text-sm font-bold text-blue-600"
                    : "text-sm font-bold text-slate-900"
            }
        >
            {value}
        </span>
    </div>
);