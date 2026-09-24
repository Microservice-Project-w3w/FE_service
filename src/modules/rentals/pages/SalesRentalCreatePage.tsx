import {
    ArrowLeft,
    CalendarDays,
    Check,
    FileText,
    PackageCheck,
    Plus,
    Search,
    Trash2,
    Truck,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router";

interface RentalEquipmentItem {
    id: string;
    name: string;
    code: string;
    quantity: number;
}

const ACCEPTED_QUOTATIONS = [
    {
        id: "BG-2026-0022",
        customer:
            "Công ty TNHH Minh Tâm",
        contact:
            "Lê Hoàng Nam",
        value:
            120000000,
    },
    {
        id: "BG-2026-0018",
        customer:
            "Công ty TNHH ABC",
        contact:
            "Nguyễn Văn An",
        value:
            85000000,
    },
    {
        id: "BG-2026-0014",
        customer:
            "Công ty XYZ",
        contact:
            "Trần Thị B",
        value:
            52000000,
    },
];

const EQUIPMENT = [
    {
        id: "EQ-001",
        name: "Máy phát điện 50kVA",
    },
    {
        id: "EQ-002",
        name: "Loa Array JBL VTX A8",
    },
    {
        id: "EQ-003",
        name: "Đèn Beam 450W",
    },
    {
        id: "EQ-004",
        name: "Xe nâng người 12m",
    },
    {
        id: "EQ-005",
        name: "Máy đào 0.9m³",
    },
];

const formatCurrency = (
    value: number,
): string =>
    `${new Intl.NumberFormat(
        "vi-VN",
    ).format(value)} đ`;

export const SalesRentalCreatePage =
    () => {
        const navigate =
            useNavigate();

        const [
            quotationId,
            setQuotationId,
        ] = useState(
            ACCEPTED_QUOTATIONS[0]
                .id,
        );

        const [
            startDate,
            setStartDate,
        ] = useState(
            "2026-08-14",
        );

        const [
            endDate,
            setEndDate,
        ] = useState(
            "2026-08-20",
        );

        const [
            deliveryAddress,
            setDeliveryAddress,
        ] = useState(
            "123 Đường Láng, Đống Đa, Hà Nội",
        );

        const [
            note,
            setNote,
        ] = useState(
            "Chuẩn bị thiết bị trước thời gian giao 2 giờ.",
        );

        const [
            search,
            setSearch,
        ] = useState("");

        const [
            items,
            setItems,
        ] = useState<
            RentalEquipmentItem[]
        >([
            {
                id: "EQ-001",
                name: "Máy phát điện 50kVA",
                code: "EQ-001",
                quantity: 2,
            },
        ]);

        const quotation =
            ACCEPTED_QUOTATIONS.find(
                (item) =>
                    item.id ===
                    quotationId,
            ) ??
            ACCEPTED_QUOTATIONS[0];

        const filteredEquipment =
            useMemo(() => {
                const keyword =
                    search
                        .trim()
                        .toLowerCase();

                return EQUIPMENT.filter(
                    (item) =>
                        keyword === "" ||
                        `${item.id} ${item.name}`
                            .toLowerCase()
                            .includes(keyword),
                );
            }, [
                search,
            ]);

        const addEquipment = (
            id: string,
        ): void => {
            const equipment =
                EQUIPMENT.find(
                    (item) =>
                        item.id === id,
                );

            if (
                !equipment ||
                items.some(
                    (item) =>
                        item.id === id,
                )
            ) {
                return;
            }

            setItems(
                (current) => [
                    ...current,
                    {
                        id:
                        equipment.id,
                        code:
                        equipment.id,
                        name:
                        equipment.name,
                        quantity: 1,
                    },
                ],
            );

            setSearch("");
        };

        const updateQuantity = (
            id: string,
            quantity: number,
        ): void => {
            setItems(
                (current) =>
                    current.map(
                        (item) =>
                            item.id === id
                                ? {
                                    ...item,
                                    quantity:
                                        Math.max(
                                            1,
                                            quantity,
                                        ),
                                }
                                : item,
                    ),
            );
        };

        const removeItem = (
            id: string,
        ): void => {
            setItems(
                (current) =>
                    current.filter(
                        (item) =>
                            item.id !== id,
                    ),
            );
        };

        const handleSubmit =
            (): void => {
                if (
                    items.length === 0
                ) {
                    window.alert(
                        "Bạn cần chọn ít nhất một thiết bị.",
                    );
                    return;
                }

                window.alert(
                    "Đã tạo đơn thuê mới thành công.",
                );

                navigate(
                    "/sales/rentals",
                );
            };

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
                Tạo mới
              </span>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-950">
                            Tạo đơn thuê mới
                        </h1>

                        <p className="mt-1 text-xs text-slate-500">
                            Tạo đơn từ báo giá đã được khách hàng chấp nhận.
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

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
                    <div className="space-y-4">
                        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-2">
                                <FileText
                                    size={17}
                                    className="text-blue-600"
                                />

                                <h2 className="text-sm font-bold text-slate-950">
                                    Thông tin đơn thuê
                                </h2>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <label>
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">
                    Báo giá đã chốt
                  </span>

                                    <select
                                        value={
                                            quotationId
                                        }
                                        onChange={(event) => {
                                            setQuotationId(
                                                event.target
                                                    .value,
                                            );
                                        }}
                                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"
                                    >
                                        {ACCEPTED_QUOTATIONS.map(
                                            (item) => (
                                                <option
                                                    key={
                                                        item.id
                                                    }
                                                    value={
                                                        item.id
                                                    }
                                                >
                                                    {
                                                        item.id
                                                    }
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </label>

                                <label>
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">
                    Khách hàng
                  </span>

                                    <input
                                        readOnly
                                        value={
                                            quotation.customer
                                        }
                                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700"
                                    />
                                </label>

                                <label>
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">
                    Người liên hệ
                  </span>

                                    <input
                                        readOnly
                                        value={
                                            quotation.contact
                                        }
                                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700"
                                    />
                                </label>

                                <label>
                  <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <CalendarDays
                        size={13}
                    />
                    Ngày bắt đầu
                  </span>

                                    <input
                                        type="date"
                                        value={
                                            startDate
                                        }
                                        onChange={(event) => {
                                            setStartDate(
                                                event.target
                                                    .value,
                                            );
                                        }}
                                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"
                                    />
                                </label>

                                <label>
                  <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <CalendarDays
                        size={13}
                    />
                    Ngày kết thúc
                  </span>

                                    <input
                                        type="date"
                                        value={
                                            endDate
                                        }
                                        onChange={(event) => {
                                            setEndDate(
                                                event.target
                                                    .value,
                                            );
                                        }}
                                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"
                                    />
                                </label>

                                <label>
                  <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <Truck
                        size={13}
                    />
                    Địa chỉ giao
                  </span>

                                    <input
                                        value={
                                            deliveryAddress
                                        }
                                        onChange={(event) => {
                                            setDeliveryAddress(
                                                event.target
                                                    .value,
                                            );
                                        }}
                                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"
                                    />
                                </label>
                            </div>
                        </article>

                        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <header className="border-b border-slate-100 p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-2">
                                        <PackageCheck
                                            size={17}
                                            className="text-blue-600"
                                        />

                                        <div>
                                            <h2 className="text-sm font-bold text-slate-950">
                                                Thiết bị trong đơn
                                            </h2>

                                            <p className="mt-0.5 text-[11px] text-slate-400">
                                                Thêm thiết bị và cập nhật số lượng.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative w-full sm:w-[250px]">
                                        <Search
                                            size={15}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            value={
                                                search
                                            }
                                            onChange={(event) => {
                                                setSearch(
                                                    event.target
                                                        .value,
                                                );
                                            }}
                                            placeholder="Tìm thiết bị để thêm..."
                                            className="h-9 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {search && (
                                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                        {filteredEquipment.map(
                                            (equipment) => (
                                                <button
                                                    key={
                                                        equipment.id
                                                    }
                                                    type="button"
                                                    disabled={items.some(
                                                        (item) =>
                                                            item.id ===
                                                            equipment.id,
                                                    )}
                                                    onClick={() => {
                                                        addEquipment(
                                                            equipment.id,
                                                        );
                                                    }}
                                                    className="flex items-center justify-between rounded-xl border border-slate-200 p-2.5 text-left disabled:opacity-50"
                                                >
                                                    <div>
                                                        <p className="text-xs font-semibold text-slate-800">
                                                            {
                                                                equipment.name
                                                            }
                                                        </p>

                                                        <p className="mt-0.5 text-[10px] text-slate-400">
                                                            {
                                                                equipment.id
                                                            }
                                                        </p>
                                                    </div>

                                                    <Plus
                                                        size={15}
                                                        className="text-blue-600"
                                                    />
                                                </button>
                                            ),
                                        )}
                                    </div>
                                )}
                            </header>

                            <div className="divide-y divide-slate-100">
                                {items.map(
                                    (item) => (
                                        <div
                                            key={
                                                item.id
                                            }
                                            className="grid gap-3 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_110px_40px] sm:items-center"
                                        >
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">
                                                    {
                                                        item.name
                                                    }
                                                </p>

                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    {
                                                        item.code
                                                    }
                                                </p>
                                            </div>

                                            <input
                                                type="number"
                                                min={1}
                                                value={
                                                    item.quantity
                                                }
                                                onChange={(event) => {
                                                    updateQuantity(
                                                        item.id,
                                                        Number(
                                                            event.target
                                                                .value,
                                                        ),
                                                    );
                                                }}
                                                className="h-8 rounded-lg border border-slate-200 px-2 text-xs outline-none"
                                            />

                                            <button
                                                type="button"
                                                aria-label="Xóa thiết bị"
                                                onClick={() => {
                                                    removeItem(
                                                        item.id,
                                                    );
                                                }}
                                                className="flex size-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50"
                                            >
                                                <Trash2
                                                    size={15}
                                                />
                                            </button>
                                        </div>
                                    ),
                                )}
                            </div>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-950">
                                Ghi chú
                            </h2>

                            <textarea
                                rows={4}
                                value={note}
                                onChange={(event) => {
                                    setNote(
                                        event.target
                                            .value,
                                    );
                                }}
                                className="mt-3 w-full resize-none rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-blue-500"
                            />
                        </article>
                    </div>

                    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-950">
                            Tóm tắt đơn thuê
                        </h2>

                        <div className="mt-4 space-y-3 text-xs">
                            <SummaryRow
                                label="Báo giá"
                                value={
                                    quotation.id
                                }
                            />

                            <SummaryRow
                                label="Khách hàng"
                                value={
                                    quotation.customer
                                }
                            />

                            <SummaryRow
                                label="Số loại thiết bị"
                                value={String(
                                    items.length,
                                )}
                            />

                            <SummaryRow
                                label="Giá trị báo giá"
                                value={formatCurrency(
                                    quotation.value,
                                )}
                            />

                            <SummaryRow
                                label="Thời gian thuê"
                                value={`${startDate} → ${endDate}`}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={
                                handleSubmit
                            }
                            className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-xs font-bold !text-white hover:bg-blue-700 hover:!text-white"
                        >
                            <Check
                                size={16}
                            />

                            Tạo đơn thuê
                        </button>
                    </aside>
                </section>
            </main>
        );
    };

const SummaryRow = ({
                        label,
                        value,
                    }: {
    label: string;
    value: string;
}) => (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
    <span className="text-slate-500">
      {label}
    </span>

        <span className="max-w-[170px] text-right font-semibold text-slate-800">
      {value}
    </span>
    </div>
);