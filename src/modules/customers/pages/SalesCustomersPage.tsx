import {
    Building2,
    ChevronLeft,
    ChevronRight,
    CircleDollarSign,
    Eye,
    Mail,
    Phone,
    Search,
    TrendingUp,
    Users,
} from "lucide-react";
import {
    useMemo,
    useState,
} from "react";
import {
    useNavigate,
} from "react-router";

type SalesCustomerStatus =
    | "NEW"
    | "INTERESTED"
    | "NEGOTIATING"
    | "CUSTOMER";

interface SalesCustomerItem {
    id: string;
    customerCode: string;
    companyName: string;
    contactName: string;
    phone: string;
    email: string;
    branch: string;
    totalTransactions: number;
    potentialValue: number;
    status: SalesCustomerStatus;
    lastInteraction: string;
}

const CUSTOMER_MOCKS: SalesCustomerItem[] = [
    {
        id: "customer-001",
        customerCode: "CUS-2026-001",
        companyName: "Công ty ABC",
        contactName: "Nguyễn Văn A",
        phone: "0901 234 567",
        email: "nguyenvana@abc.vn",
        branch: "Chi nhánh Hà Nội",
        totalTransactions: 3,
        potentialValue: 120000000,
        status: "INTERESTED",
        lastInteraction: "12/08/2026",
    },
    {
        id: "customer-002",
        customerCode: "CUS-2026-002",
        companyName: "Công ty XYZ",
        contactName: "Trần Thị B",
        phone: "0902 345 678",
        email: "tranthib@xyz.vn",
        branch: "Chi nhánh Hà Nội",
        totalTransactions: 5,
        potentialValue: 85500000,
        status: "NEGOTIATING",
        lastInteraction: "12/08/2026",
    },
    {
        id: "customer-003",
        customerCode: "CUS-2026-003",
        companyName: "Công ty DEF",
        contactName: "Lê Văn C",
        phone: "0903 456 789",
        email: "levanc@def.vn",
        branch: "Chi nhánh Đà Nẵng",
        totalTransactions: 2,
        potentialValue: 60000000,
        status: "NEW",
        lastInteraction: "11/08/2026",
    },
    {
        id: "customer-004",
        customerCode: "CUS-2026-004",
        companyName: "Công ty GHI",
        contactName: "Phạm Thị D",
        phone: "0904 567 890",
        email: "phamthid@ghi.vn",
        branch: "Chi nhánh Đà Nẵng",
        totalTransactions: 2,
        potentialValue: 45000000,
        status: "NEW",
        lastInteraction: "10/08/2026",
    },
    {
        id: "customer-005",
        customerCode: "CUS-2026-005",
        companyName: "Công ty TNHH Sự kiện Việt",
        contactName: "Hoàng Minh Khang",
        phone: "0905 112 233",
        email: "khang@sukienviet.vn",
        branch: "Chi nhánh Hà Nội",
        totalTransactions: 8,
        potentialValue: 250000000,
        status: "CUSTOMER",
        lastInteraction: "12/08/2026",
    },
    {
        id: "customer-006",
        customerCode: "CUS-2026-006",
        companyName: "Công ty Minh Phát",
        contactName: "Nguyễn Thanh Tùng",
        phone: "0906 223 344",
        email: "tung@minhphat.vn",
        branch: "Chi nhánh TP.HCM",
        totalTransactions: 4,
        potentialValue: 95000000,
        status: "CUSTOMER",
        lastInteraction: "09/08/2026",
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

const ITEMS_PER_PAGE = 4;

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

export const SalesCustomersPage = () => {
    const navigate = useNavigate();

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        status,
        setStatus,
    ] = useState<
        SalesCustomerStatus | "ALL"
    >("ALL");

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const filteredCustomers =
        useMemo(() => {
            const keyword =
                normalizeSearch(
                    searchTerm,
                );

            return CUSTOMER_MOCKS.filter(
                (customer) => {
                    const searchable =
                        normalizeSearch(
                            [
                                customer.customerCode,
                                customer.companyName,
                                customer.contactName,
                                customer.phone,
                                customer.email,
                                customer.branch,
                            ].join(" "),
                        );

                    const matchesSearch =
                        keyword === "" ||
                        searchable.includes(
                            keyword,
                        );

                    const matchesStatus =
                        status === "ALL" ||
                        customer.status ===
                        status;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                },
            );
        }, [
            searchTerm,
            status,
        ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredCustomers.length /
            ITEMS_PER_PAGE,
        ),
    );

    const paginatedCustomers =
        useMemo(() => {
            const start =
                (currentPage - 1) *
                ITEMS_PER_PAGE;

            return filteredCustomers.slice(
                start,
                start +
                ITEMS_PER_PAGE,
            );
        }, [
            filteredCustomers,
            currentPage,
        ]);

    const totalPotentialValue =
        CUSTOMER_MOCKS.reduce(
            (total, customer) =>
                total +
                customer.potentialValue,
            0,
        );

    const interestedCount =
        CUSTOMER_MOCKS.filter(
            (customer) =>
                customer.status ===
                "INTERESTED" ||
                customer.status ===
                "NEGOTIATING",
        ).length;

    const negotiatingCount =
        CUSTOMER_MOCKS.filter(
            (customer) =>
                customer.status ===
                "NEGOTIATING",
        ).length;

    const handleSearchChange = (
        value: string,
    ): void => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (
        value:
            | SalesCustomerStatus
            | "ALL",
    ): void => {
        setStatus(value);
        setCurrentPage(1);
    };

    return (
        <main className="space-y-5">
            <header className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Users
                        size={22}
                        aria-hidden="true"
                    />
                </span>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                        Khách hàng
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Quản lý khách hàng,
                        khách hàng tiềm năng
                        và lịch sử tương tác
                        trong quá trình bán
                        hàng.
                    </p>
                </div>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <article className="flex min-h-[118px] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <Users
                            size={24}
                            aria-hidden="true"
                        />
                    </span>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium text-slate-500">
                                Tổng khách hàng
                            </p>

                            <TrendingUp
                                size={17}
                                className="text-emerald-500"
                                aria-hidden="true"
                            />
                        </div>

                        <p className="mt-2 text-2xl font-bold text-slate-950">
                            {
                                CUSTOMER_MOCKS.length
                            }
                        </p>
                    </div>
                </article>

                <article className="flex min-h-[118px] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <Building2
                            size={24}
                            aria-hidden="true"
                        />
                    </span>

                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            Khách hàng tiềm năng
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-950">
                            {interestedCount}
                        </p>
                    </div>
                </article>

                <article className="flex min-h-[118px] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                        <TrendingUp
                            size={24}
                            aria-hidden="true"
                        />
                    </span>

                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            Đang đàm phán
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-950">
                            {negotiatingCount}
                        </p>
                    </div>
                </article>

                <article className="flex min-h-[118px] items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                        <CircleDollarSign
                            size={24}
                            aria-hidden="true"
                        />
                    </span>

                    <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-500">
                            Doanh thu tiềm năng
                        </p>

                        <p className="mt-2 truncate text-xl font-bold text-slate-950">
                            {formatCurrency(
                                totalPotentialValue,
                            )}
                        </p>
                    </div>
                </article>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 lg:flex-row">
                    <label className="relative flex-1">
                        <Search
                            size={18}
                            aria-hidden="true"
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={
                                searchTerm
                            }
                            onChange={(
                                event,
                            ) => {
                                handleSearchChange(
                                    event.target
                                        .value,
                                );
                            }}
                            placeholder="Tìm theo tên công ty, người liên hệ, số điện thoại..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        />
                    </label>

                    <select
                        value={status}
                        onChange={(event) => {
                            handleStatusChange(
                                event.target
                                    .value as
                                    | SalesCustomerStatus
                                    | "ALL",
                            );
                        }}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 lg:w-[220px]"
                    >
                        <option value="ALL">
                            Tất cả trạng thái
                        </option>

                        <option value="NEW">
                            Mới
                        </option>

                        <option value="INTERESTED">
                            Quan tâm
                        </option>

                        <option value="NEGOTIATING">
                            Đàm phán
                        </option>

                        <option value="CUSTOMER">
                            Đã giao dịch
                        </option>
                    </select>
                </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <header className="border-b border-slate-100 px-5 py-4">
                    <h2 className="text-base font-bold text-slate-950">
                        Danh sách khách hàng
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        Tìm thấy{" "}
                        {
                            filteredCustomers.length
                        }{" "}
                        khách hàng
                    </p>
                </header>

                <div className="hidden grid-cols-[minmax(260px,1.25fr)_minmax(210px,1fr)_180px_130px_150px_110px] gap-4 border-b border-slate-100 bg-slate-50/80 px-5 py-3 text-xs font-semibold text-slate-500 xl:grid">
                    <span>
                        Khách hàng
                    </span>

                    <span>
                        Người liên hệ
                    </span>

                    <span>
                        Giá trị tiềm năng
                    </span>

                    <span>
                        Trạng thái
                    </span>

                    <span>
                        Tương tác cuối
                    </span>

                    <span className="text-right">
                        Thao tác
                    </span>
                </div>

                <div className="divide-y divide-slate-100">
                    {paginatedCustomers.map(
                        (customer) => {
                            const statusInfo =
                                STATUS_CONFIG[
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
                                <article
                                    key={
                                        customer.id
                                    }
                                    className="grid gap-4 px-5 py-4 transition hover:bg-slate-50/70 xl:grid-cols-[minmax(260px,1.25fr)_minmax(210px,1fr)_180px_130px_150px_110px] xl:items-center"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white shadow-sm shadow-blue-100">
                                            {
                                                initials
                                            }
                                        </span>

                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-blue-600">
                                                {
                                                    customer.customerCode
                                                }
                                            </p>

                                            <h3 className="mt-0.5 truncate text-sm font-bold text-slate-900">
                                                {
                                                    customer.companyName
                                                }
                                            </h3>

                                            <p className="mt-1 truncate text-xs text-slate-400">
                                                {
                                                    customer.branch
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800">
                                            {
                                                customer.contactName
                                            }
                                        </p>

                                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                            <Phone
                                                size={
                                                    13
                                                }
                                                aria-hidden="true"
                                            />

                                            {
                                                customer.phone
                                            }
                                        </p>

                                        <p className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                                            <Mail
                                                size={
                                                    13
                                                }
                                                aria-hidden="true"
                                                className="shrink-0"
                                            />

                                            <span className="truncate">
                                                {
                                                    customer.email
                                                }
                                            </span>
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Giá trị tiềm năng
                                        </p>

                                        <p className="mt-1 text-sm font-bold text-slate-900">
                                            {formatCurrency(
                                                customer.potentialValue,
                                            )}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {
                                                customer.totalTransactions
                                            }{" "}
                                            giao dịch
                                        </p>
                                    </div>

                                    <div>
                                        <span
                                            className={[
                                                "inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold",
                                                statusInfo.className,
                                            ].join(
                                                " ",
                                            )}
                                        >
                                            {
                                                statusInfo.label
                                            }
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400">
                                            Tương tác cuối:
                                        </p>

                                        <p className="mt-1 text-xs font-semibold text-slate-700">
                                            {
                                                customer.lastInteraction
                                            }
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-start xl:justify-end">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate(
                                                    `/sales/customers/${customer.id}`,
                                                );
                                            }}
                                            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                        >
                                            <Eye
                                                size={
                                                    15
                                                }
                                                aria-hidden="true"
                                            />

                                            Chi tiết
                                        </button>
                                    </div>
                                </article>
                            );
                        },
                    )}

                    {paginatedCustomers.length ===
                        0 && (
                            <div className="px-6 py-14 text-center">
                                <Users
                                    size={
                                        34
                                    }
                                    className="mx-auto text-slate-300"
                                    aria-hidden="true"
                                />

                                <p className="mt-3 text-sm font-semibold text-slate-700">
                                    Không tìm thấy
                                    khách hàng
                                </p>

                                <p className="mt-1 text-xs text-slate-400">
                                    Hãy thử thay
                                    đổi từ khóa
                                    hoặc bộ lọc.
                                </p>
                            </div>
                        )}
                </div>
            </section>

            {totalPages > 1 && (
                <nav className="flex items-center justify-center gap-1.5">
                    <button
                        type="button"
                        aria-label="Trang trước"
                        disabled={
                            currentPage ===
                            1
                        }
                        onClick={() => {
                            setCurrentPage(
                                (page) =>
                                    Math.max(
                                        1,
                                        page -
                                        1,
                                    ),
                            );
                        }}
                        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <ChevronLeft
                            size={17}
                            aria-hidden="true"
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
                    ).map(
                        (page) => (
                            <button
                                key={
                                    page
                                }
                                type="button"
                                onClick={() => {
                                    setCurrentPage(
                                        page,
                                    );
                                }}
                                className={
                                    page ===
                                    currentPage
                                        ? "flex size-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white shadow-sm"
                                        : "flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                                }
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
                            currentPage ===
                            totalPages
                        }
                        onClick={() => {
                            setCurrentPage(
                                (page) =>
                                    Math.min(
                                        totalPages,
                                        page +
                                        1,
                                    ),
                            );
                        }}
                        className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <ChevronRight
                            size={17}
                            aria-hidden="true"
                        />
                    </button>
                </nav>
            )}
        </main>
    );
};