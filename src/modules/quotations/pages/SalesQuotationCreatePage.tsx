import {
    ArrowLeft,
    Calculator,
    CalendarDays,
    Check,
    FileText,
    Package,
    Percent,
    Plus,
    Search,
    Trash2,
} from "lucide-react";

import {
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router";

interface DraftItem {
    id: string;
    name: string;
    code: string;
    quantity: number;
    rentalDays: number;
    unitPrice: number;
}

const REQUESTS = [
    {
        id: "REQ-2026-028",
        customer:
            "Công ty TNHH ABC",
    },
    {
        id: "REQ-2026-027",
        customer:
            "Công ty CP Xây dựng Hòa Phát",
    },
    {
        id: "REQ-2026-026",
        customer:
            "Công ty TNHH Minh Tâm",
    },
];

const EQUIPMENT = [
    {
        id: "EQ-001",
        name: "Máy phát điện 50kVA",
        unitPrice: 8000000,
    },
    {
        id: "EQ-002",
        name: "Loa Array JBL VTX A8",
        unitPrice: 2500000,
    },
    {
        id: "EQ-003",
        name: "Đèn Beam 450W",
        unitPrice: 1500000,
    },
    {
        id: "EQ-004",
        name: "Xe nâng người 12m",
        unitPrice: 6500000,
    },
    {
        id: "EQ-005",
        name: "Máy đào 0.9m³",
        unitPrice: 12000000,
    },
];

const formatCurrency = (
    value: number,
): string =>
    `${new Intl.NumberFormat(
        "vi-VN",
    ).format(value)} đ`;

export const SalesQuotationCreatePage =
    () => {
        const navigate =
            useNavigate();

        const [
            requestId,
            setRequestId,
        ] = useState(
            REQUESTS[0].id,
        );

        const [
            validUntil,
            setValidUntil,
        ] = useState(
            "2026-08-20",
        );

        const [
            discount,
            setDiscount,
        ] = useState(0);

        const [
            vatRate,
            setVatRate,
        ] = useState(10);

        const [
            deposit,
            setDeposit,
        ] = useState(
            20000000,
        );

        const [
            note,
            setNote,
        ] = useState(
            "Báo giá có hiệu lực trong thời gian quy định.",
        );

        const [
            equipmentSearch,
            setEquipmentSearch,
        ] = useState("");

        const [
            items,
            setItems,
        ] = useState<
            DraftItem[]
        >([
            {
                id: "EQ-001",
                name: "Máy phát điện 50kVA",
                code: "EQ-001",
                quantity: 2,
                rentalDays: 3,
                unitPrice: 8000000,
            },
        ]);

        const selectedRequest =
            REQUESTS.find(
                (item) =>
                    item.id ===
                    requestId,
            ) ??
            REQUESTS[0];

        const filteredEquipment =
            useMemo(() => {
                const keyword =
                    equipmentSearch
                        .trim()
                        .toLowerCase();

                return EQUIPMENT.filter(
                    (item) =>
                        keyword === "" ||
                        `${item.name} ${item.id}`
                            .toLowerCase()
                            .includes(keyword),
                );
            }, [
                equipmentSearch,
            ]);

        const subtotal =
            items.reduce(
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
            Math.max(
                0,
                subtotal -
                discount,
            );

        const vat =
            afterDiscount *
            (vatRate / 100);

        const total =
            afterDiscount +
            vat;

        const addEquipment = (
            equipmentId: string,
        ): void => {
            const equipment =
                EQUIPMENT.find(
                    (item) =>
                        item.id ===
                        equipmentId,
                );

            if (!equipment) {
                return;
            }

            const existed =
                items.some(
                    (item) =>
                        item.id ===
                        equipmentId,
                );

            if (existed) {
                return;
            }

            setItems(
                (current) => [
                    ...current,
                    {
                        id:
                        equipment.id,
                        name:
                        equipment.name,
                        code:
                        equipment.id,
                        quantity: 1,
                        rentalDays: 1,
                        unitPrice:
                        equipment.unitPrice,
                    },
                ],
            );
        };

        const updateItem = (
            id: string,
            field:
                | "quantity"
                | "rentalDays"
                | "unitPrice",
            value: number,
        ): void => {
            setItems(
                (current) =>
                    current.map(
                        (item) =>
                            item.id === id
                                ? {
                                    ...item,
                                    [field]:
                                        Math.max(
                                            field ===
                                            "unitPrice"
                                                ? 0
                                                : 1,
                                            value,
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
                    "Đã tạo báo giá mới và lưu ở trạng thái chờ duyệt.",
                );

                navigate(
                    "/sales/quotations",
                );
            };

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
                Tạo mới
              </span>
                        </div>

                        <h1 className="text-2xl font-bold text-slate-950">
                            Tạo báo giá mới
                        </h1>

                        <p className="mt-1 text-xs text-slate-500">
                            Tạo báo giá từ yêu cầu thuê, thiết lập giá và gửi quản lý phê duyệt.
                        </p>
                    </div>

                    <Link
                        to="/sales/quotations"
                        className="inline-flex h-9 items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 lg:self-auto"
                    >
                        <ArrowLeft
                            size={15}
                        />
                        Quay lại
                    </Link>
                </header>

                <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-4">
                        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center gap-2">
                                <FileText
                                    size={17}
                                    className="text-blue-600"
                                />
                                <h2 className="text-sm font-bold text-slate-950">
                                    Thông tin báo giá
                                </h2>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <label>
                  <span className="mb-1 block text-[11px] font-semibold text-slate-500">
                    Yêu cầu thuê
                  </span>

                                    <select
                                        value={
                                            requestId
                                        }
                                        onChange={(event) => {
                                            setRequestId(
                                                event.target
                                                    .value,
                                            );
                                        }}
                                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"
                                    >
                                        {REQUESTS.map(
                                            (request) => (
                                                <option
                                                    key={
                                                        request.id
                                                    }
                                                    value={
                                                        request.id
                                                    }
                                                >
                                                    {
                                                        request.id
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
                                            selectedRequest.customer
                                        }
                                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700"
                                    />
                                </label>

                                <label>
                  <span className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                    <CalendarDays
                        size={13}
                    />
                    Hiệu lực đến
                  </span>

                                    <input
                                        type="date"
                                        value={
                                            validUntil
                                        }
                                        onChange={(event) => {
                                            setValidUntil(
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
                                        <Package
                                            size={17}
                                            className="text-blue-600"
                                        />
                                        <div>
                                            <h2 className="text-sm font-bold text-slate-950">
                                                Thiết bị báo giá
                                            </h2>
                                            <p className="mt-0.5 text-[11px] text-slate-400">
                                                Chỉnh số lượng, số ngày thuê và đơn giá.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative w-full sm:w-[260px]">
                                        <Search
                                            size={15}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            value={
                                                equipmentSearch
                                            }
                                            onChange={(event) => {
                                                setEquipmentSearch(
                                                    event.target
                                                        .value,
                                                );
                                            }}
                                            placeholder="Tìm thiết bị để thêm..."
                                            className="h-9 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {equipmentSearch && (
                                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                        {filteredEquipment.map(
                                            (equipment) => {
                                                const existed =
                                                    items.some(
                                                        (item) =>
                                                            item.id ===
                                                            equipment.id,
                                                    );

                                                return (
                                                    <button
                                                        key={
                                                            equipment.id
                                                        }
                                                        type="button"
                                                        disabled={
                                                            existed
                                                        }
                                                        onClick={() => {
                                                            addEquipment(
                                                                equipment.id,
                                                            );
                                                            setEquipmentSearch(
                                                                "",
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
                                                                }{" "}
                                                                •{" "}
                                                                {formatCurrency(
                                                                    equipment.unitPrice,
                                                                )}
                                                                /ngày
                                                            </p>
                                                        </div>

                                                        <Plus
                                                            size={15}
                                                            className="text-blue-600"
                                                        />
                                                    </button>
                                                );
                                            },
                                        )}
                                    </div>
                                )}
                            </header>

                            <div className="overflow-x-auto">
                                <div className="min-w-[760px]">
                                    <div className="grid grid-cols-[minmax(220px,1fr)_90px_100px_145px_145px_40px] gap-3 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold text-slate-500">
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
                                        <span>
                      Thành tiền
                    </span>
                                        <span />
                                    </div>

                                    <div className="divide-y divide-slate-100">
                                        {items.map(
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
                                                        className="grid grid-cols-[minmax(220px,1fr)_90px_100px_145px_145px_40px] items-center gap-3 px-4 py-3"
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
                                                                updateItem(
                                                                    item.id,
                                                                    "quantity",
                                                                    Number(
                                                                        event.target
                                                                            .value,
                                                                    ),
                                                                );
                                                            }}
                                                            className="h-8 rounded-lg border border-slate-200 px-2 text-xs outline-none"
                                                        />

                                                        <input
                                                            type="number"
                                                            min={1}
                                                            value={
                                                                item.rentalDays
                                                            }
                                                            onChange={(event) => {
                                                                updateItem(
                                                                    item.id,
                                                                    "rentalDays",
                                                                    Number(
                                                                        event.target
                                                                            .value,
                                                                    ),
                                                                );
                                                            }}
                                                            className="h-8 rounded-lg border border-slate-200 px-2 text-xs outline-none"
                                                        />

                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={
                                                                item.unitPrice
                                                            }
                                                            onChange={(event) => {
                                                                updateItem(
                                                                    item.id,
                                                                    "unitPrice",
                                                                    Number(
                                                                        event.target
                                                                            .value,
                                                                    ),
                                                                );
                                                            }}
                                                            className="h-8 rounded-lg border border-slate-200 px-2 text-xs outline-none"
                                                        />

                                                        <p className="text-xs font-bold text-slate-900">
                                                            {formatCurrency(
                                                                lineTotal,
                                                            )}
                                                        </p>

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
                                                );
                                            },
                                        )}

                                        {items.length ===
                                            0 && (
                                                <div className="px-5 py-10 text-center text-xs text-slate-400">
                                                    Chưa có thiết bị trong báo giá.
                                                </div>
                                            )}
                                    </div>
                                </div>
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
                        <div className="flex items-center gap-2">
                            <Calculator
                                size={17}
                                className="text-emerald-600"
                            />
                            <h2 className="text-sm font-bold text-slate-950">
                                Tổng hợp giá
                            </h2>
                        </div>

                        <div className="mt-4 space-y-3">
                            <PriceInput
                                icon={Percent}
                                label="Giảm giá"
                                value={discount}
                                onChange={
                                    setDiscount
                                }
                            />

                            <PriceInput
                                icon={Percent}
                                label="VAT (%)"
                                value={vatRate}
                                onChange={
                                    setVatRate
                                }
                            />

                            <PriceInput
                                icon={FileText}
                                label="Tiền đặt cọc"
                                value={deposit}
                                onChange={
                                    setDeposit
                                }
                            />
                        </div>

                        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs">
                            <SummaryRow
                                label="Tạm tính"
                                value={formatCurrency(
                                    subtotal,
                                )}
                            />

                            <SummaryRow
                                label="Giảm giá"
                                value={`- ${formatCurrency(
                                    discount,
                                )}`}
                            />

                            <SummaryRow
                                label={`VAT (${vatRate}%)`}
                                value={formatCurrency(
                                    vat,
                                )}
                            />

                            <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50 p-3">
                <span className="font-semibold text-blue-700">
                  Tổng cộng
                </span>

                                <span className="text-sm font-bold text-blue-700">
                  {formatCurrency(
                      total,
                  )}
                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={
                                handleSubmit
                            }
                            className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-xs font-bold text-white hover:bg-blue-700"
                        >
                            <Check
                                size={16}
                            />
                            Tạo & gửi duyệt
                        </button>
                    </aside>
                </section>
            </main>
        );
    };

const PriceInput = ({
                        icon: Icon,
                        label,
                        value,
                        onChange,
                    }: {
    icon: typeof Percent;
    label: string;
    value: number;
    onChange: (
        value: number,
    ) => void;
}) => (
    <label>
    <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
      <Icon
          size={13}
      />
        {label}
    </span>

        <input
            type="number"
            min={0}
            value={value}
            onChange={(event) => {
                onChange(
                    Number(
                        event.target.value,
                    ),
                );
            }}
            className="h-9 w-full rounded-xl border border-slate-200 px-3 text-xs outline-none focus:border-blue-500"
        />
    </label>
);

const SummaryRow = ({
                        label,
                        value,
                    }: {
    label: string;
    value: string;
}) => (
    <div className="flex items-center justify-between gap-3">
    <span className="text-slate-500">
      {label}
    </span>
        <span className="font-semibold text-slate-800">
      {value}
    </span>
    </div>
);