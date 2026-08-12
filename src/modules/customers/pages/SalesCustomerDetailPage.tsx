import type {
    LucideIcon,
} from "lucide-react";

import {
    ArrowLeft,
    Building2,
    CalendarDays,
    CircleDollarSign,
    ClipboardList,
    Mail,
    MapPin,
    Phone,
    ShoppingCart,
    UserRound,
    Users,
} from "lucide-react";

import {
    Link,
    Navigate,
    useParams,
} from "react-router";

type SalesCustomerStatus =
    | "NEW"
    | "INTERESTED"
    | "NEGOTIATING"
    | "CUSTOMER";

type CustomerInteractionType =
    | "CALL"
    | "EMAIL"
    | "MEETING";

interface CustomerInteraction {
    id: string;
    type: CustomerInteractionType;
    title: string;
    description: string;
    date: string;
}

interface SalesCustomerDetail {
    id: string;
    customerCode: string;
    companyName: string;
    companyPhone: string;
    companyEmail: string;
    taxCode: string;
    address: string;
    industry: string;
    companySize: string;
    website: string;
    branch: string;
    contactName: string;
    contactPosition: string;
    contactPhone: string;
    contactEmail: string;
    totalTransactions: number;
    potentialValue: number;
    generatedRevenue: number;
    status: SalesCustomerStatus;
    customerSince: string;
    lastInteraction: string;
    interactions: CustomerInteraction[];
}

const CUSTOMER_DETAIL_MOCKS:
    SalesCustomerDetail[] = [
    {
        id: "customer-001",
        customerCode: "CUS-2026-001",
        companyName: "Công ty ABC",
        companyPhone: "024 1234 5678",
        companyEmail: "info@abc.vn",
        taxCode: "0101234567",
        address:
            "123 Đường Láng, Đống Đa, Hà Nội",
        industry:
            "Sự kiện, Truyền thông",
        companySize:
            "100 - 200 nhân viên",
        website: "www.abc.vn",
        branch: "Chi nhánh Hà Nội",
        contactName:
            "Nguyễn Văn A",
        contactPosition:
            "Giám đốc",
        contactPhone:
            "0901 234 567",
        contactEmail:
            "nguyenvana@abc.vn",
        totalTransactions: 3,
        potentialValue: 120000000,
        generatedRevenue: 65000000,
        status: "INTERESTED",
        customerSince: "12/08/2026",
        lastInteraction: "12/08/2026",
        interactions: [
            {
                id: "interaction-001",
                type: "CALL",
                title: "Gọi điện",
                description:
                    "Trao đổi về nhu cầu thuê thiết bị cho sự kiện tháng 9.",
                date:
                    "12/08/2026 14:30",
            },
            {
                id: "interaction-002",
                type: "EMAIL",
                title: "Gửi báo giá",
                description:
                    "Gửi báo giá thiết bị sự kiện cho Công ty ABC.",
                date:
                    "12/08/2026 10:15",
            },
            {
                id: "interaction-003",
                type: "MEETING",
                title: "Gặp mặt",
                description:
                    "Gặp trực tiếp để tư vấn giải pháp thiết bị.",
                date:
                    "10/08/2026 09:00",
            },
        ],
    },
    {
        id: "customer-002",
        customerCode: "CUS-2026-002",
        companyName: "Công ty XYZ",
        companyPhone: "024 2234 5678",
        companyEmail: "info@xyz.vn",
        taxCode: "0102345678",
        address:
            "89 Trần Thái Tông, Cầu Giấy, Hà Nội",
        industry:
            "Xây dựng, Công nghiệp",
        companySize:
            "50 - 100 nhân viên",
        website: "www.xyz.vn",
        branch: "Chi nhánh Hà Nội",
        contactName: "Trần Thị B",
        contactPosition:
            "Trưởng phòng mua hàng",
        contactPhone:
            "0902 345 678",
        contactEmail:
            "tranthib@xyz.vn",
        totalTransactions: 5,
        potentialValue: 85500000,
        generatedRevenue: 42000000,
        status: "NEGOTIATING",
        customerSince: "05/08/2026",
        lastInteraction: "12/08/2026",
        interactions: [
            {
                id: "interaction-004",
                type: "MEETING",
                title:
                    "Gặp khách hàng",
                description:
                    "Trao đổi điều khoản báo giá và lịch thuê thiết bị.",
                date:
                    "12/08/2026 10:30",
            },
            {
                id: "interaction-005",
                type: "CALL",
                title:
                    "Xác nhận nhu cầu",
                description:
                    "Xác nhận số lượng thiết bị và thời gian thuê.",
                date:
                    "11/08/2026 16:20",
            },
        ],
    },
    {
        id: "customer-003",
        customerCode: "CUS-2026-003",
        companyName: "Công ty DEF",
        companyPhone: "0236 345 6789",
        companyEmail: "info@def.vn",
        taxCode: "0401234567",
        address:
            "56 Bạch Đằng, Hải Châu, Đà Nẵng",
        industry:
            "Tổ chức sự kiện",
        companySize:
            "20 - 50 nhân viên",
        website: "www.def.vn",
        branch:
            "Chi nhánh Đà Nẵng",
        contactName: "Lê Văn C",
        contactPosition: "Quản lý",
        contactPhone:
            "0903 456 789",
        contactEmail:
            "levanc@def.vn",
        totalTransactions: 2,
        potentialValue: 60000000,
        generatedRevenue: 18000000,
        status: "NEW",
        customerSince: "08/08/2026",
        lastInteraction: "11/08/2026",
        interactions: [
            {
                id: "interaction-006",
                type: "EMAIL",
                title:
                    "Gửi thông tin dịch vụ",
                description:
                    "Gửi danh mục thiết bị và chính sách thuê cho khách hàng.",
                date:
                    "11/08/2026 16:00",
            },
        ],
    },
    {
        id: "customer-004",
        customerCode: "CUS-2026-004",
        companyName: "Công ty GHI",
        companyPhone: "0236 456 7890",
        companyEmail: "info@ghi.vn",
        taxCode: "0402345678",
        address:
            "102 Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
        industry:
            "Triển lãm, Hội nghị",
        companySize:
            "20 - 50 nhân viên",
        website: "www.ghi.vn",
        branch:
            "Chi nhánh Đà Nẵng",
        contactName: "Phạm Thị D",
        contactPosition:
            "Trưởng phòng sự kiện",
        contactPhone:
            "0904 567 890",
        contactEmail:
            "phamthid@ghi.vn",
        totalTransactions: 2,
        potentialValue: 45000000,
        generatedRevenue: 12000000,
        status: "NEW",
        customerSince: "07/08/2026",
        lastInteraction: "10/08/2026",
        interactions: [
            {
                id: "interaction-007",
                type: "CALL",
                title:
                    "Tư vấn nhu cầu thuê",
                description:
                    "Trao đổi sơ bộ về thiết bị cho hội nghị cuối tháng.",
                date:
                    "10/08/2026 11:00",
            },
        ],
    },
    {
        id: "customer-005",
        customerCode: "CUS-2026-005",
        companyName:
            "Công ty TNHH Sự kiện Việt",
        companyPhone:
            "024 5566 7788",
        companyEmail:
            "contact@sukienviet.vn",
        taxCode: "0103456789",
        address:
            "25 Nguyễn Chí Thanh, Đống Đa, Hà Nội",
        industry:
            "Sự kiện, Truyền thông",
        companySize:
            "200 - 500 nhân viên",
        website:
            "www.sukienviet.vn",
        branch: "Chi nhánh Hà Nội",
        contactName:
            "Hoàng Minh Khang",
        contactPosition:
            "Giám đốc vận hành",
        contactPhone:
            "0905 112 233",
        contactEmail:
            "khang@sukienviet.vn",
        totalTransactions: 8,
        potentialValue: 250000000,
        generatedRevenue: 188000000,
        status: "CUSTOMER",
        customerSince: "15/06/2026",
        lastInteraction: "12/08/2026",
        interactions: [
            {
                id: "interaction-008",
                type: "EMAIL",
                title:
                    "Gửi báo giá bổ sung",
                description:
                    "Gửi báo giá bổ sung cho gói thiết bị âm thanh và ánh sáng.",
                date:
                    "12/08/2026 09:20",
            },
            {
                id: "interaction-009",
                type: "MEETING",
                title:
                    "Họp triển khai sự kiện",
                description:
                    "Thống nhất kế hoạch giao nhận và lắp đặt thiết bị.",
                date:
                    "09/08/2026 14:00",
            },
        ],
    },
    {
        id: "customer-006",
        customerCode: "CUS-2026-006",
        companyName:
            "Công ty Minh Phát",
        companyPhone:
            "028 6677 8899",
        companyEmail:
            "contact@minhphat.vn",
        taxCode: "0312345678",
        address:
            "77 Điện Biên Phủ, Bình Thạnh, TP.HCM",
        industry:
            "Xây dựng, Hạ tầng",
        companySize:
            "100 - 200 nhân viên",
        website:
            "www.minhphat.vn",
        branch:
            "Chi nhánh TP.HCM",
        contactName:
            "Nguyễn Thanh Tùng",
        contactPosition:
            "Trưởng phòng thiết bị",
        contactPhone:
            "0906 223 344",
        contactEmail:
            "tung@minhphat.vn",
        totalTransactions: 4,
        potentialValue: 95000000,
        generatedRevenue: 73000000,
        status: "CUSTOMER",
        customerSince: "20/06/2026",
        lastInteraction: "09/08/2026",
        interactions: [
            {
                id: "interaction-010",
                type: "CALL",
                title:
                    "Theo dõi hợp đồng",
                description:
                    "Trao đổi tiến độ hợp đồng và kế hoạch thuê đợt tiếp theo.",
                date:
                    "09/08/2026 15:10",
            },
        ],
    },
];

const STATUS_CONFIG: Record<
    SalesCustomerStatus,
    {
        label: string;
        className: string;
    }
> = {
    NEW: {
        label: "Mới",
        className:
            "border-emerald-100 bg-emerald-50 text-emerald-700",
    },
    INTERESTED: {
        label: "Quan tâm",
        className:
            "border-blue-100 bg-blue-50 text-blue-700",
    },
    NEGOTIATING: {
        label: "Đàm phán",
        className:
            "border-orange-100 bg-orange-50 text-orange-700",
    },
    CUSTOMER: {
        label: "Đã giao dịch",
        className:
            "border-violet-100 bg-violet-50 text-violet-700",
    },
};

const formatCurrency = (
    value: number,
): string =>
    `${new Intl.NumberFormat(
        "vi-VN",
    ).format(value)} đ`;

const INTERACTION_CONFIG: Record<
    CustomerInteractionType,
    {
        icon: LucideIcon;
        tone: string;
    }
> = {
    CALL: {
        icon: Phone,
        tone:
            "bg-emerald-50 text-emerald-600",
    },
    EMAIL: {
        icon: Mail,
        tone:
            "bg-blue-50 text-blue-600",
    },
    MEETING: {
        icon: Users,
        tone:
            "bg-violet-50 text-violet-600",
    },
};

type MetricTone =
    | "BLUE"
    | "GREEN"
    | "ORANGE"
    | "VIOLET";

const METRIC_TONE: Record<
    MetricTone,
    string
> = {
    BLUE:
        "bg-blue-50 text-blue-600",
    GREEN:
        "bg-emerald-50 text-emerald-600",
    ORANGE:
        "bg-orange-50 text-orange-600",
    VIOLET:
        "bg-violet-50 text-violet-600",
};

interface InfoItemProps {
    label: string;
    value: string;
}

const InfoItem = ({
                      label,
                      value,
                  }: InfoItemProps) => {
    return (
        <div>
            <p className="text-xs font-medium text-slate-400">
                {label}
            </p>

            <p className="mt-1.5 text-sm font-semibold leading-6 text-slate-800">
                {value}
            </p>
        </div>
    );
};

interface MetricRowProps {
    icon: LucideIcon;
    label: string;
    value: string;
    tone: MetricTone;
}

const MetricRow = ({
                       icon: Icon,
                       label,
                       value,
                       tone,
                   }: MetricRowProps) => {
    return (
        <div className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
            <span
                className={[
                    "flex size-10 shrink-0 items-center justify-center rounded-xl",
                    METRIC_TONE[
                        tone
                        ],
                ].join(" ")}
            >
                <Icon
                    size={18}
                    aria-hidden="true"
                />
            </span>

            <p className="flex-1 text-sm text-slate-500">
                {label}
            </p>

            <p className="text-right text-sm font-bold text-slate-900">
                {value}
            </p>
        </div>
    );
};

export const SalesCustomerDetailPage = () => {
    const {
        customerId,
    } = useParams<{
        customerId: string;
    }>();

    const customer =
        CUSTOMER_DETAIL_MOCKS.find(
            (item) =>
                item.id === customerId,
        );

    if (!customer) {
        return (
            <Navigate
                to="/sales/customers"
                replace
            />
        );
    }

    const status =
        STATUS_CONFIG[
            customer.status
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
        <main className="space-y-5">
            <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                        <Link
                            to="/sales/customers"
                            className="transition hover:text-blue-600"
                        >
                            Khách hàng
                        </Link>

                        <span>/</span>

                        <span className="font-medium text-slate-700">
                            Chi tiết khách hàng
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                        Chi tiết khách hàng
                    </h1>

                    <p className="mt-1.5 text-sm text-slate-500">
                        Quản lý thông tin và lịch sử tương tác của khách hàng.
                    </p>
                </div>

                <Link
                    to="/sales/customers"
                    className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 lg:self-auto"
                >
                    <ArrowLeft
                        size={16}
                        aria-hidden="true"
                    />

                    Quay lại danh sách
                </Link>
            </header>

            <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        <span className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-sm shadow-blue-100">
                            {initials}
                        </span>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                                    {
                                        customer.customerCode
                                    }
                                </span>

                                <span
                                    className={[
                                        "rounded-full border px-2.5 py-1 text-xs font-bold",
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

                            <h2 className="mt-3 text-2xl font-bold text-slate-950">
                                {
                                    customer.companyName
                                }
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Khách hàng doanh nghiệp
                            </p>

                            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
                                <span className="inline-flex items-center gap-2">
                                    <MapPin
                                        size={16}
                                        className="text-slate-400"
                                    />

                                    {
                                        customer.branch
                                    }
                                </span>

                                <span className="inline-flex items-center gap-2">
                                    <ShoppingCart
                                        size={16}
                                        className="text-slate-400"
                                    />

                                    {
                                        customer.totalTransactions
                                    }{" "}
                                    giao dịch
                                </span>

                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays
                                        size={16}
                                        className="text-slate-400"
                                    />

                                    Khách hàng từ{" "}
                                    {
                                        customer.customerSince
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <UserRound
                            size={18}
                            className="text-slate-500"
                        />

                        <h2 className="text-base font-bold text-slate-950">
                            Người liên hệ chính
                        </h2>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <Users
                                size={20}
                                aria-hidden="true"
                            />
                        </span>

                        <div>
                            <p className="font-bold text-slate-900">
                                {
                                    customer.contactName
                                }
                            </p>

                            <p className="mt-0.5 text-sm text-slate-500">
                                {
                                    customer.contactPosition
                                }
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        <p className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone
                                size={16}
                                className="text-slate-400"
                            />

                            {
                                customer.contactPhone
                            }
                        </p>

                        <p className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail
                                size={16}
                                className="text-slate-400"
                            />

                            {
                                customer.contactEmail
                            }
                        </p>
                    </div>
                </article>
            </section>

            <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Building2
                            size={18}
                            className="text-slate-500"
                        />

                        <h2 className="text-base font-bold text-slate-950">
                            Thông tin khách hàng
                        </h2>
                    </div>

                    <div className="mt-5 grid gap-x-10 gap-y-4 md:grid-cols-2">
                        <InfoItem
                            label="Mã khách hàng"
                            value={
                                customer.customerCode
                            }
                        />

                        <InfoItem
                            label="Điện thoại công ty"
                            value={
                                customer.companyPhone
                            }
                        />

                        <InfoItem
                            label="Tên công ty"
                            value={
                                customer.companyName
                            }
                        />

                        <InfoItem
                            label="Email công ty"
                            value={
                                customer.companyEmail
                            }
                        />

                        <InfoItem
                            label="Mã số thuế"
                            value={
                                customer.taxCode
                            }
                        />

                        <InfoItem
                            label="Địa chỉ"
                            value={
                                customer.address
                            }
                        />

                        <InfoItem
                            label="Ngành nghề"
                            value={
                                customer.industry
                            }
                        />

                        <InfoItem
                            label="Quy mô"
                            value={
                                customer.companySize
                            }
                        />

                        <InfoItem
                            label="Website"
                            value={
                                customer.website
                            }
                        />
                    </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2">
                        <CircleDollarSign
                            size={18}
                            className="text-slate-500"
                        />

                        <h2 className="text-base font-bold text-slate-950">
                            Giá trị và giao dịch
                        </h2>
                    </div>

                    <div className="mt-5 divide-y divide-slate-100">
                        <MetricRow
                            icon={
                                CircleDollarSign
                            }
                            label="Doanh thu tiềm năng"
                            value={formatCurrency(
                                customer.potentialValue,
                            )}
                            tone="VIOLET"
                        />

                        <MetricRow
                            icon={
                                ShoppingCart
                            }
                            label="Tổng số giao dịch"
                            value={`${customer.totalTransactions} giao dịch`}
                            tone="GREEN"
                        />

                        <MetricRow
                            icon={
                                ClipboardList
                            }
                            label="Doanh thu đã phát sinh"
                            value={formatCurrency(
                                customer.generatedRevenue,
                            )}
                            tone="BLUE"
                        />

                        <MetricRow
                            icon={
                                CalendarDays
                            }
                            label="Giao dịch gần nhất"
                            value={
                                customer.lastInteraction
                            }
                            tone="ORANGE"
                        />
                    </div>
                </article>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <header className="border-b border-slate-100 px-5 py-4">
                    <h2 className="text-base font-bold text-slate-950">
                        Lịch sử tương tác
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        Các hoạt động gần đây giữa Sales và khách hàng.
                    </p>
                </header>

                <div className="divide-y divide-slate-100">
                    {customer.interactions.map(
                        (interaction) => {
                            const config =
                                INTERACTION_CONFIG[
                                    interaction.type
                                    ];

                            const Icon =
                                config.icon;

                            return (
                                <article
                                    key={
                                        interaction.id
                                    }
                                    className="flex gap-4 px-5 py-4 transition hover:bg-slate-50/70"
                                >
                                    <span
                                        className={[
                                            "flex size-10 shrink-0 items-center justify-center rounded-xl",
                                            config.tone,
                                        ].join(
                                            " ",
                                        )}
                                    >
                                        <Icon
                                            size={
                                                18
                                            }
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900">
                                                    {
                                                        interaction.title
                                                    }
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    {
                                                        interaction.description
                                                    }
                                                </p>
                                            </div>

                                            <span className="shrink-0 text-xs font-medium text-slate-400">
                                                {
                                                    interaction.date
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        },
                    )}
                </div>
            </section>
        </main>
    );
};