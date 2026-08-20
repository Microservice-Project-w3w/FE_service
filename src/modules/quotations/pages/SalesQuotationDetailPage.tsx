import type {
    LucideIcon,
} from "lucide-react";

import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    FileText,
    Mail,
    MapPin,
    Package,
    Phone,
    Send,
    UserRound,
    XCircle,
} from "lucide-react";

import {
    Link,
    Navigate,
    useParams,
} from "react-router";

type QuotationStatus =
    | "PENDING"
    | "SENT"
    | "ACCEPTED"
    | "REJECTED";

interface QuotationItem {
    id: string;
    equipmentName: string;
    equipmentCode: string;
    quantity: number;
    rentalDays: number;
    unitPrice: number;
}

interface QuotationHistoryItem {
    id: string;
    title: string;
    description: string;
    date: string;
    type:
        | "CREATED"
        | "SENT"
        | "ACCEPTED"
        | "REJECTED";
}

interface SalesQuotationDetail {
    id: string;
    code: string;
    requestCode: string;
    customerName: string;
    contactName: string;
    phone: string;
    email: string;
    branch: string;
    address: string;
    createdDate: string;
    validUntil: string;
    status: QuotationStatus;
    note: string;
    discount: number;
    vatRate: number;
    deposit: number;
    items: QuotationItem[];
    history: QuotationHistoryItem[];
}

const COMPANY_SEEDS = [
    {
        customerName: "Công ty TNHH ABC",
        contactName: "Nguyễn Văn An",
        equipmentName: "Máy phát điện 50kVA",
        equipmentCode: "EQ-001",
        unitPrice: 8000000,
    },
    {
        customerName: "Công ty CP Xây dựng Hòa Phát",
        contactName: "Phạm Thị Bích",
        equipmentName: "Xe nâng người 12m",
        equipmentCode: "EQ-004",
        unitPrice: 6500000,
    },
    {
        customerName: "Công ty TNHH Minh Tâm",
        contactName: "Lê Hoàng Nam",
        equipmentName: "Máy đào 0.9m³",
        equipmentCode: "EQ-005",
        unitPrice: 12000000,
    },
    {
        customerName: "Công ty CP Đầu tư Phú Quý",
        contactName: "Trần Quốc Hưng",
        equipmentName: "Máy nén khí 10HP",
        equipmentCode: "EQ-006",
        unitPrice: 4500000,
    },
    {
        customerName: "Công ty TNHH Dịch vụ An Phát",
        contactName: "Đỗ Thị Mai",
        equipmentName: "Tháp đèn LED 7m",
        equipmentCode: "EQ-007",
        unitPrice: 3500000,
    },
    {
        customerName: "Công ty TNHH Sự kiện Việt",
        contactName: "Hoàng Minh Khang",
        equipmentName: "Loa Array JBL VTX A8",
        equipmentCode: "EQ-002",
        unitPrice: 2500000,
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

const HISTORY_CONFIG: Record<
    QuotationHistoryItem["type"],
    {
        icon: LucideIcon;
        className: string;
    }
> = {
    CREATED: {
        icon: FileText,
        className:
            "bg-blue-50 text-blue-600",
    },
    SENT: {
        icon: Send,
        className:
            "bg-orange-50 text-orange-600",
    },
    ACCEPTED: {
        icon: CheckCircle2,
        className:
            "bg-emerald-50 text-emerald-600",
    },
    REJECTED: {
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

const buildQuotationDetail = (
    quotationId: string,
): SalesQuotationDetail | null => {
    const match =
        quotationId.match(
            /^quotation-(\d{3})$/,
        );

    if (!match) {
        return null;
    }

    const number =
        Number(match[1]);

    if (
        number < 1 ||
        number > 24
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
        24 - index;

    const quantity =
        (index % 3) + 1;

    const rentalDays =
        (index % 4) + 2;

    const historyType: QuotationHistoryItem["type"] =
        status ===
        "ACCEPTED"
            ? "ACCEPTED"
            : status ===
            "REJECTED"
                ? "REJECTED"
                : "SENT";

    return {
        id:
        quotationId,
        code: `BG-2026-${String(
            codeNumber,
        ).padStart(4, "0")}`,
        requestCode: `REQ-2026-${String(
            28 - (index % 10),
        ).padStart(3, "0")}`,
        customerName:
        seed.customerName,
        contactName:
        seed.contactName,
        phone: `090${(index % 8) + 1} 234 567`,
        email: `contact${number}@company.vn`,
        branch:
            index % 2 === 0
                ? "Chi nhánh Hà Nội"
                : "Chi nhánh TP.HCM",
        address:
            index % 2 === 0
                ? "123 Đường Láng, Đống Đa, Hà Nội"
                : "88 Nguyễn Huệ, Quận 1, TP.HCM",
        createdDate: `${String(
            Math.max(
                13 -
                (index % 12),
                1,
            ),
        ).padStart(2, "0")}/08/2026`,
        validUntil: "20/08/2026",
        status,
        note:
            "Báo giá áp dụng theo số lượng, thời gian thuê và điều kiện giao nhận đã thống nhất với khách hàng.",
        discount:
            index % 2 === 0
                ? 3000000
                : 1500000,
        vatRate: 10,
        deposit:
            15000000 +
            (index % 3) *
            5000000,
        items: [
            {
                id: "item-001",
                equipmentName:
                seed.equipmentName,
                equipmentCode:
                seed.equipmentCode,
                quantity,
                rentalDays,
                unitPrice:
                seed.unitPrice,
            },
            {
                id: "item-002",
                equipmentName:
                    "Phụ kiện & vận chuyển",
                equipmentCode:
                    "SERVICE-01",
                quantity: 1,
                rentalDays: 1,
                unitPrice:
                    3500000 +
                    (index % 2) *
                    1500000,
            },
        ],
        history: [
            {
                id: "history-001",
                title:
                    "Tạo báo giá",
                description:
                    "Nhân viên kinh doanh đã tạo báo giá từ yêu cầu thuê.",
                date:
                    "12/08/2026 09:45",
                type:
                    "CREATED",
            },
            {
                id: "history-002",
                title:
                    status ===
                    "ACCEPTED"
                        ? "Khách hàng đã chốt báo giá"
                        : status ===
                        "REJECTED"
                            ? "Khách hàng từ chối báo giá"
                            : status ===
                            "SENT"
                                ? "Đã gửi báo giá cho khách hàng"
                                : "Đã gửi quản lý phê duyệt",
                description:
                    "Trạng thái báo giá đã được cập nhật.",
                date:
                    "12/08/2026 10:30",
                type:
                historyType,
            },
        ],
    };
};

export const SalesQuotationDetailPage =
    () => {
        const {
            quotationId,
        } = useParams<{
            quotationId: string;
        }>();

        const quotation =
            quotationId
                ? buildQuotationDetail(
                    quotationId,
                )
                : null;

        if (!quotation) {
            return (
                <Navigate
                    to="/sales/quotations"
                    replace
                />
            );
        }

        const status =
            STATUS_CONFIG[
                quotation.status
                ];

        const subtotal =
            quotation.items.reduce(
                (
                    total,
                    item,
                ) =>
                    total +
                    item.quantity *
                    item.rentalDays *
                    item.unitPrice,
                0,
            );

        const afterDiscount =
            subtotal -
            quotation.discount;

        const vat =
            afterDiscount *
            (quotation.vatRate /
                100);

        const total =
            afterDiscount +
            vat;

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
                {
                    quotation.code
                }
              </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-bold text-slate-950">
                                {
                                    quotation.code
                                }
                            </h1>

                            <span
                                className={[
                                    "rounded-full border px-2.5 py-1 text-[11px] font-bold",
                                    status.className,
                                ].join(" ")}
                            >
                {
                    status.label
                }
              </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                            Chi tiết báo giá và thông tin phê duyệt.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Link
                            to="/sales/quotations"
                            className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <ArrowLeft
                                size={15}
                            />
                            Quay lại
                        </Link>

                        {quotation.status ===
                            "PENDING" && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        window.alert(
                                            "Đã gửi báo giá tới quản lý phê duyệt.",
                                        );
                                    }}
                                    className="inline-flex h-9 items-center gap-2 rounded-xl bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700"
                                >
                                    <Send
                                        size={15}
                                    />
                                    Gửi quản lý phê duyệt
                                </button>
                            )}
                    </div>
                </header>

                <section className="grid gap-4 xl:grid-cols-[1fr_1.25fr]">
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
                            {
                                quotation.customerName
                            }
                        </h3>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <InfoRow
                                icon={
                                    UserRound
                                }
                                label="Người liên hệ"
                                value={
                                    quotation.contactName
                                }
                            />
                            <InfoRow
                                icon={Phone}
                                label="Số điện thoại"
                                value={
                                    quotation.phone
                                }
                            />
                            <InfoRow
                                icon={Mail}
                                label="Email"
                                value={
                                    quotation.email
                                }
                            />
                            <InfoRow
                                icon={MapPin}
                                label="Địa chỉ"
                                value={
                                    quotation.address
                                }
                            />
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                            <FileText
                                size={16}
                                className="text-violet-600"
                            />
                            <h2 className="text-sm font-bold text-slate-950">
                                Thông tin báo giá
                            </h2>
                        </div>

                        <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-3">
                            <InfoBlock
                                label="Mã báo giá"
                                value={
                                    quotation.code
                                }
                            />
                            <InfoBlock
                                label="Yêu cầu thuê"
                                value={
                                    quotation.requestCode
                                }
                            />
                            <InfoBlock
                                label="Ngày tạo"
                                value={
                                    quotation.createdDate
                                }
                            />
                            <InfoBlock
                                label="Hiệu lực đến"
                                value={
                                    quotation.validUntil
                                }
                            />
                            <InfoBlock
                                label="Chi nhánh"
                                value={
                                    quotation.branch
                                }
                            />
                            <InfoBlock
                                label="Trạng thái"
                                value={
                                    status.label
                                }
                            />
                        </div>

                        <div className="mt-4 rounded-xl bg-slate-50 p-3">
                            <p className="text-[11px] font-semibold text-slate-500">
                                Ghi chú
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-700">
                                {
                                    quotation.note
                                }
                            </p>
                        </div>
                    </article>
                </section>

                <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.5fr)_310px]">
                    <article className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <header className="border-b border-slate-100 px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Package
                                    size={16}
                                    className="text-blue-600"
                                />
                                <h2 className="text-sm font-bold text-slate-950">
                                    Chi tiết thiết bị
                                </h2>
                            </div>
                        </header>

                        <div className="overflow-x-auto">
                            <div className="min-w-[720px]">
                                <div className="grid grid-cols-[minmax(220px,1fr)_80px_90px_140px_150px] gap-3 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold text-slate-500">
                  <span>
                    Thiết bị
                  </span>
                                    <span>
                    Số lượng
                  </span>
                                    <span>
                    Số ngày
                  </span>
                                    <span>
                    Đơn giá/ngày
                  </span>
                                    <span className="text-right">
                    Thành tiền
                  </span>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {quotation.items.map(
                                        (item) => {
                                            const lineTotal =
                                                item.quantity *
                                                item.rentalDays *
                                                item.unitPrice;

                                            return (
                                                <div
                                                    key={
                                                        item.id
                                                    }
                                                    className="grid grid-cols-[minmax(220px,1fr)_80px_90px_140px_150px] items-center gap-3 px-4 py-3"
                                                >
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">
                                                            {
                                                                item.equipmentName
                                                            }
                                                        </p>
                                                        <p className="mt-0.5 text-[10px] text-slate-400">
                                                            {
                                                                item.equipmentCode
                                                            }
                                                        </p>
                                                    </div>

                                                    <p className="text-xs font-semibold text-slate-700">
                                                        {
                                                            item.quantity
                                                        }
                                                    </p>

                                                    <p className="text-xs text-slate-600">
                                                        {
                                                            item.rentalDays
                                                        }{" "}
                                                        ngày
                                                    </p>

                                                    <p className="text-xs text-slate-700">
                                                        {formatCurrency(
                                                            item.unitPrice,
                                                        )}
                                                    </p>

                                                    <p className="text-right text-xs font-bold text-slate-900">
                                                        {formatCurrency(
                                                            lineTotal,
                                                        )}
                                                    </p>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            </div>
                        </div>
                    </article>

                    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                            <CircleDollarSign
                                size={16}
                                className="text-emerald-600"
                            />
                            <h2 className="text-sm font-bold text-slate-950">
                                Tổng thanh toán
                            </h2>
                        </div>

                        <div className="mt-4 divide-y divide-slate-100">
                            <PriceRow
                                label="Tạm tính"
                                value={formatCurrency(
                                    subtotal,
                                )}
                            />
                            <PriceRow
                                label="Giảm giá"
                                value={`- ${formatCurrency(
                                    quotation.discount,
                                )}`}
                            />
                            <PriceRow
                                label={`VAT (${quotation.vatRate}%)`}
                                value={formatCurrency(
                                    vat,
                                )}
                            />
                        </div>

                        <div className="mt-4 rounded-xl bg-blue-50 p-3">
                            <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-blue-700">
                  Tổng cộng
                </span>
                                <span className="text-base font-bold text-blue-700">
                  {formatCurrency(
                      total,
                  )}
                </span>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-orange-100 bg-orange-50 p-3">
              <span className="text-xs font-semibold text-orange-700">
                Tiền đặt cọc
              </span>
                            <span className="text-xs font-bold text-orange-700">
                {formatCurrency(
                    quotation.deposit,
                )}
              </span>
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
                            Lịch sử báo giá
                        </h2>
                    </div>

                    <div className="mt-4">
                        {quotation.history.map(
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
                                            quotation
                                                .history
                                                .length -
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

const PriceRow = ({
                      label,
                      value,
                  }: {
    label: string;
    value: string;
}) => (
    <div className="flex items-center justify-between gap-3 py-2.5 first:pt-0">
    <span className="text-xs text-slate-500">
      {label}
    </span>
        <span className="text-xs font-semibold text-slate-800">
      {value}
    </span>
    </div>
);