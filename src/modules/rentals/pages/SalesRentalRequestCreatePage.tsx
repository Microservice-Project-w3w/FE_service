import type {
    LucideIcon,
} from "lucide-react";

import {
    ArrowLeft,
    CalendarDays,
    Check,
    ChevronRight,
    MapPin,
    Search,
    UserRound,
    X,
} from "lucide-react";

import type {
    ReactNode,
} from "react";

import {
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router";

type CreateStep =
    | 1
    | 2
    | 3;

interface EquipmentOption {
    id: string;
    name: string;
    code: string;
    category: string;
    available: number;
    selected: boolean;
    quantity: number;
}

const CUSTOMERS = [
    "Công ty ABC",
    "Công ty XYZ",
    "Công ty DEF",
    "Công ty GHI",
    "Công ty TNHH Sự kiện Việt",
    "Công ty Minh Phát",
];

const INITIAL_EQUIPMENT: EquipmentOption[] = [
    {
        id: "equipment-001",
        name: "Loa Array JBL VTX A8",
        code: "EQ-001",
        category: "Âm thanh",
        available: 12,
        selected: false,
        quantity: 1,
    },
    {
        id: "equipment-002",
        name: "Đèn Beam 450W",
        code: "EQ-002",
        category: "Ánh sáng",
        available: 16,
        selected: false,
        quantity: 1,
    },
    {
        id: "equipment-003",
        name: "Màn hình LED P3",
        code: "EQ-003",
        category: "Trình chiếu",
        available: 8,
        selected: false,
        quantity: 1,
    },
    {
        id: "equipment-004",
        name: "Micro Shure Axient",
        code: "EQ-004",
        category: "Âm thanh",
        available: 20,
        selected: false,
        quantity: 1,
    },
    {
        id: "equipment-005",
        name: "Máy phát điện 100kVA",
        code: "EQ-005",
        category: "Khác",
        available: 10,
        selected: false,
        quantity: 1,
    },
];

const inputClass =
    "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

interface FieldProps {
    label: string;
    required?: boolean;
    children: ReactNode;
}

const Field = ({
                   label,
                   required = false,
                   children,
               }: FieldProps) => (
    <label className="block">
    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
      {label}

        {required && (
            <span className="ml-1 text-rose-500">
          *
        </span>
        )}
    </span>

        {children}
    </label>
);

interface SectionTitleProps {
    icon: LucideIcon;
    title: string;
}

const SectionTitle = ({
                          icon: Icon,
                          title,
                      }: SectionTitleProps) => (
    <div className="flex items-center gap-2">
        <Icon
            size={18}
            className="text-blue-600"
            aria-hidden="true"
        />

        <h2 className="font-bold text-slate-950">
            {title}
        </h2>
    </div>
);

interface StepItemProps {
    number: number;
    label: string;
    active: boolean;
    completed: boolean;
}

const StepItem = ({
                      number,
                      label,
                      active,
                      completed,
                  }: StepItemProps) => (
    <div className="flex items-center gap-2">
    <span
        className={[
            "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            active || completed
                ? "bg-blue-600 text-white"
                : "border border-slate-300 bg-white text-slate-500",
        ].join(" ")}
    >
      {completed ? (
          <Check
              size={15}
              aria-hidden="true"
          />
      ) : (
          number
      )}
    </span>

        <span
            className={
                active
                    ? "hidden whitespace-nowrap text-sm font-bold text-blue-600 sm:block"
                    : "hidden whitespace-nowrap text-sm font-medium text-slate-500 sm:block"
            }
        >
      {label}
    </span>
    </div>
);

const StepLine = ({
                      completed,
                  }: {
    completed: boolean;
}) => (
    <span
        className={
            completed
                ? "mx-3 h-px flex-1 bg-blue-500"
                : "mx-3 h-px flex-1 bg-slate-200"
        }
    />
);

const ConfirmItem = ({
                         label,
                         value,
                     }: {
    label: string;
    value: string;
}) => (
    <div>
        <p className="text-xs font-medium text-slate-400">
            {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">
            {value}
        </p>
    </div>
);

export const SalesRentalRequestCreatePage =
    () => {
        const navigate = useNavigate();

        const [
            step,
            setStep,
        ] = useState<CreateStep>(1);

        const [
            customer,
            setCustomer,
        ] = useState("");

        const [
            contactName,
            setContactName,
        ] = useState("");

        const [
            phone,
            setPhone,
        ] = useState("");

        const [
            email,
            setEmail,
        ] = useState("");

        const [
            branch,
            setBranch,
        ] = useState(
            "Chi nhánh Hà Nội",
        );

        const [
            requestDate,
            setRequestDate,
        ] = useState(
            "2026-08-13",
        );

        const [
            startDate,
            setStartDate,
        ] = useState("");

        const [
            endDate,
            setEndDate,
        ] = useState("");

        const [
            purpose,
            setPurpose,
        ] = useState("");

        const [
            note,
            setNote,
        ] = useState("");

        const [
            deliveryAddress,
            setDeliveryAddress,
        ] = useState("");

        const [
            specialRequest,
            setSpecialRequest,
        ] = useState("");

        const [
            equipmentSearch,
            setEquipmentSearch,
        ] = useState("");

        const [
            equipment,
            setEquipment,
        ] = useState(
            INITIAL_EQUIPMENT,
        );

        const selectedEquipment =
            useMemo(
                () =>
                    equipment.filter(
                        (item) =>
                            item.selected,
                    ),
                [equipment],
            );

        const filteredEquipment =
            useMemo(() => {
                const keyword =
                    equipmentSearch
                        .trim()
                        .toLowerCase();

                if (!keyword) {
                    return equipment;
                }

                return equipment.filter(
                    (item) =>
                        [
                            item.name,
                            item.code,
                            item.category,
                        ]
                            .join(" ")
                            .toLowerCase()
                            .includes(keyword),
                );
            }, [
                equipment,
                equipmentSearch,
            ]);

        const toggleEquipment = (
            id: string,
        ): void => {
            setEquipment(
                (current) =>
                    current.map(
                        (item) =>
                            item.id === id
                                ? {
                                    ...item,
                                    selected:
                                        !item.selected,
                                }
                                : item,
                    ),
            );
        };

        const changeQuantity = (
            id: string,
            quantity: number,
        ): void => {
            setEquipment(
                (current) =>
                    current.map(
                        (item) =>
                            item.id === id
                                ? {
                                    ...item,
                                    quantity:
                                        Math.max(
                                            1,
                                            Math.min(
                                                item.available,
                                                quantity,
                                            ),
                                        ),
                                }
                                : item,
                    ),
            );
        };

        const handleNext =
            (): void => {
                if (step === 1) {
                    setStep(2);
                    return;
                }

                if (step === 2) {
                    setStep(3);
                }
            };

        const handleBack =
            (): void => {
                if (step === 1) {
                    navigate(
                        "/sales/rental-requests",
                    );
                    return;
                }

                setStep(
                    (step - 1) as CreateStep,
                );
            };

        const handleSubmit =
            (): void => {
                window.alert(
                    "Đã tạo yêu cầu thuê mới thành công.",
                );

                navigate(
                    "/sales/rental-requests",
                );
            };

        return (
            <main className="space-y-5">
                <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                            <Link
                                to="/sales/rental-requests"
                                className="transition hover:text-blue-600"
                            >
                                Yêu cầu thuê
                            </Link>

                            <span>/</span>

                            <span className="font-medium text-slate-700">
                Tạo mới
              </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                            Tạo yêu cầu thuê mới
                        </h1>

                        <p className="mt-1.5 text-sm text-slate-500">
                            Nhập thông tin yêu cầu,
                            lựa chọn thiết bị và xác
                            nhận trước khi gửi.
                        </p>
                    </div>

                    <Link
                        to="/sales/rental-requests"
                        aria-label="Đóng"
                        title="Đóng"
                        className="inline-flex size-10 items-center justify-center self-start rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-slate-800 lg:self-auto"
                    >
                        <X
                            size={18}
                            aria-hidden="true"
                        />
                    </Link>
                </header>

                <section className="rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                    <div className="mx-auto flex max-w-3xl items-center">
                        <StepItem
                            number={1}
                            label="Thông tin chung"
                            active={
                                step === 1
                            }
                            completed={
                                step > 1
                            }
                        />

                        <StepLine
                            completed={
                                step > 1
                            }
                        />

                        <StepItem
                            number={2}
                            label="Danh sách thiết bị"
                            active={
                                step === 2
                            }
                            completed={
                                step > 2
                            }
                        />

                        <StepLine
                            completed={
                                step > 2
                            }
                        />

                        <StepItem
                            number={3}
                            label="Xác nhận & Gửi"
                            active={
                                step === 3
                            }
                            completed={false}
                        />
                    </div>
                </section>

                {step === 1 && (
                    <section className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:grid-cols-3">
                        <div className="border-b border-slate-200 p-6 xl:border-b-0 xl:border-r">
                            <SectionTitle
                                icon={
                                    UserRound
                                }
                                title="Thông tin khách hàng"
                            />

                            <div className="mt-5 space-y-4">
                                <Field
                                    label="Khách hàng"
                                    required
                                >
                                    <select
                                        value={
                                            customer
                                        }
                                        onChange={(
                                            event,
                                        ) => {
                                            setCustomer(
                                                event.target
                                                    .value,
                                            );
                                        }}
                                        className={
                                            inputClass
                                        }
                                    >
                                        <option value="">
                                            Chọn khách hàng
                                        </option>

                                        {CUSTOMERS.map(
                                            (item) => (
                                                <option
                                                    key={
                                                        item
                                                    }
                                                    value={
                                                        item
                                                    }
                                                >
                                                    {item}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </Field>

                                <Field
                                    label="Người liên hệ"
                                    required
                                >
                                    <input
                                        value={
                                            contactName
                                        }
                                        onChange={(
                                            event,
                                        ) => {
                                            setContactName(
                                                event.target
                                                    .value,
                                            );
                                        }}
                                        placeholder="Nhập tên người liên hệ"
                                        className={
                                            inputClass
                                        }
                                    />
                                </Field>

                                <Field
                                    label="Số điện thoại"
                                    required
                                >
                                    <input
                                        value={phone}
                                        onChange={(
                                            event,
                                        ) => {
                                            setPhone(
                                                event.target
                                                    .value,
                                            );
                                        }}
                                        placeholder="Nhập số điện thoại"
                                        className={
                                            inputClass
                                        }
                                    />
                                </Field>

                                <Field label="Email">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(
                                            event,
                                        ) => {
                                            setEmail(
                                                event.target
                                                    .value,
                                            );
                                        }}
                                        placeholder="Nhập email"
                                        className={
                                            inputClass
                                        }
                                    />
                                </Field>

                                <Field
                                    label="Chi nhánh"
                                    required
                                >
                                    <select
                                        value={branch}
                                        onChange={(
                                            event,
                                        ) => {
                                            setBranch(
                                                event.target
                                                    .value,
                                            );
                                        }}
                                        className={
                                            inputClass
                                        }
                                    >
                                        <option>
                                            Chi nhánh Hà Nội
                                        </option>

                                        <option>
                                            Chi nhánh Đà Nẵng
                                        </option>

                                        <option>
                                            Chi nhánh TP.HCM
                                        </option>
                                    </select>
                                </Field>
                            </div>
                        </div>

                        <div className="border-b border-slate-200 p-6 xl:border-b-0 xl:border-r">
                            <SectionTitle
                                icon={
                                    CalendarDays
                                }
                                title="Thông tin yêu cầu"
                            />

                            <div className="mt-5 space-y-4">
                                <Field
                                    label="Ngày yêu cầu"
                                    required
                                >
                                    <input
                                        type="date"
                                        value={
                                            requestDate
                                        }
                                        onChange={(
                                            event,
                                        ) => {
                                            setRequestDate(
                                                event.target
                                                    .value,
                                            );
                                        }}
                                        className={
                                            inputClass
                                        }
                                    />
                                </Field>

                                <Field label="Thời gian thuê">
                                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                                        <input
                                            type="date"
                                            value={
                                                startDate
                                            }
                                            onChange={(
                                                event,
                                            ) => {
                                                setStartDate(
                                                    event
                                                        .target
                                                        .value,
                                                );
                                            }}
                                            className={
                                                inputClass
                                            }
                                        />

                                        <span className="text-slate-400">
                      →
                    </span>

                                        <input
                                            type="date"
                                            value={
                                                endDate
                                            }
                                            onChange={(
                                                event,
                                            ) => {
                                                setEndDate(
                                                    event
                                                        .target
                                                        .value,
                                                );
                                            }}
                                            className={
                                                inputClass
                                            }
                                        />
                                    </div>
                                </Field>

                                <Field
                                    label="Mục đích thuê"
                                    required
                                >
                                    <input
                                        value={
                                            purpose
                                        }
                                        onChange={(
                                            event,
                                        ) => {
                                            setPurpose(
                                                event.target
                                                    .value,
                                            );
                                        }}
                                        placeholder="Nhập mục đích thuê"
                                        className={
                                            inputClass
                                        }
                                    />
                                </Field>

                                <Field label="Ghi chú">
                  <textarea
                      value={note}
                      onChange={(
                          event,
                      ) => {
                          setNote(
                              event.target
                                  .value,
                          );
                      }}
                      placeholder="Nhập ghi chú nếu có"
                      rows={4}
                      className={`${inputClass} h-auto resize-none py-3`}
                  />
                                </Field>
                            </div>
                        </div>

                        <div className="p-6">
                            <SectionTitle
                                icon={MapPin}
                                title="Thông tin giao hàng"
                            />

                            <div className="mt-5 space-y-4">
                                <Field
                                    label="Địa chỉ giao hàng"
                                    required
                                >
                                    <input
                                        value={
                                            deliveryAddress
                                        }
                                        onChange={(
                                            event,
                                        ) => {
                                            setDeliveryAddress(
                                                event.target
                                                    .value,
                                            );
                                        }}
                                        placeholder="Nhập địa chỉ giao hàng"
                                        className={
                                            inputClass
                                        }
                                    />
                                </Field>

                                <Field label="Yêu cầu đặc biệt">
                  <textarea
                      value={
                          specialRequest
                      }
                      onChange={(
                          event,
                      ) => {
                          setSpecialRequest(
                              event.target
                                  .value,
                          );
                      }}
                      placeholder="Nhập yêu cầu đặc biệt nếu có"
                      rows={6}
                      className={`${inputClass} h-auto resize-none py-3`}
                  />
                                </Field>
                            </div>
                        </div>
                    </section>
                )}

                {step === 2 && (
                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <header className="border-b border-slate-100 p-5">
                            <h2 className="text-lg font-bold text-slate-950">
                                Chọn thiết bị
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Chọn thiết bị và số
                                lượng cần thuê.
                            </p>

                            <label className="relative mt-4 block">
                                <Search
                                    size={18}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    aria-hidden="true"
                                />

                                <input
                                    value={
                                        equipmentSearch
                                    }
                                    onChange={(
                                        event,
                                    ) => {
                                        setEquipmentSearch(
                                            event.target
                                                .value,
                                        );
                                    }}
                                    placeholder="Tìm thiết bị..."
                                    className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </label>
                        </header>

                        <div className="divide-y divide-slate-100">
                            {filteredEquipment.map(
                                (item) => (
                                    <div
                                        key={
                                            item.id
                                        }
                                        className="grid gap-4 px-5 py-4 md:grid-cols-[40px_minmax(0,1fr)_150px_120px_140px] md:items-center"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                item.selected
                                            }
                                            onChange={() => {
                                                toggleEquipment(
                                                    item.id,
                                                );
                                            }}
                                            className="size-4 accent-blue-600"
                                        />

                                        <div>
                                            <p className="font-bold text-slate-900">
                                                {item.name}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-400">
                                                {item.code}
                                            </p>
                                        </div>

                                        <span className="text-sm text-slate-600">
                      {
                          item.category
                      }
                    </span>

                                        <span className="text-sm font-medium text-emerald-600">
                      {
                          item.available
                      }{" "}
                                            sẵn sàng
                    </span>

                                        <input
                                            type="number"
                                            min={1}
                                            max={
                                                item.available
                                            }
                                            disabled={
                                                !item.selected
                                            }
                                            value={
                                                item.quantity
                                            }
                                            onChange={(
                                                event,
                                            ) => {
                                                changeQuantity(
                                                    item.id,
                                                    Number(
                                                        event
                                                            .target
                                                            .value,
                                                    ),
                                                );
                                            }}
                                            className="h-9 rounded-lg border border-slate-200 px-3 text-sm outline-none disabled:bg-slate-50 disabled:text-slate-400"
                                        />
                                    </div>
                                ),
                            )}

                            {filteredEquipment.length ===
                                0 && (
                                    <div className="px-6 py-12 text-center">
                                        <p className="text-sm font-semibold text-slate-700">
                                            Không tìm thấy thiết bị
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Hãy thử thay đổi từ khóa tìm kiếm.
                                        </p>
                                    </div>
                                )}
                        </div>
                    </section>
                )}

                {step === 3 && (
                    <section className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
                        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-950">
                                Xác nhận thông tin
                            </h2>

                            <div className="mt-5 grid gap-5 sm:grid-cols-2">
                                <ConfirmItem
                                    label="Khách hàng"
                                    value={
                                        customer ||
                                        "Chưa chọn"
                                    }
                                />

                                <ConfirmItem
                                    label="Người liên hệ"
                                    value={
                                        contactName ||
                                        "Chưa nhập"
                                    }
                                />

                                <ConfirmItem
                                    label="Số điện thoại"
                                    value={
                                        phone ||
                                        "Chưa nhập"
                                    }
                                />

                                <ConfirmItem
                                    label="Email"
                                    value={
                                        email ||
                                        "Chưa nhập"
                                    }
                                />

                                <ConfirmItem
                                    label="Chi nhánh"
                                    value={branch}
                                />

                                <ConfirmItem
                                    label="Ngày yêu cầu"
                                    value={
                                        requestDate ||
                                        "Chưa chọn"
                                    }
                                />

                                <ConfirmItem
                                    label="Thời gian thuê"
                                    value={
                                        startDate &&
                                        endDate
                                            ? `${startDate} → ${endDate}`
                                            : "Chưa chọn"
                                    }
                                />

                                <ConfirmItem
                                    label="Mục đích thuê"
                                    value={
                                        purpose ||
                                        "Chưa nhập"
                                    }
                                />

                                <div className="sm:col-span-2">
                                    <ConfirmItem
                                        label="Địa chỉ giao"
                                        value={
                                            deliveryAddress ||
                                            "Chưa nhập"
                                        }
                                    />
                                </div>

                                {note && (
                                    <div className="sm:col-span-2">
                                        <ConfirmItem
                                            label="Ghi chú"
                                            value={note}
                                        />
                                    </div>
                                )}

                                {specialRequest && (
                                    <div className="sm:col-span-2">
                                        <ConfirmItem
                                            label="Yêu cầu đặc biệt"
                                            value={
                                                specialRequest
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h2 className="font-bold text-slate-950">
                                    Thiết bị đã chọn
                                </h2>

                                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {
                      selectedEquipment.length
                  }{" "}
                                    loại
                </span>
                            </div>

                            <div className="mt-4 divide-y divide-slate-100">
                                {selectedEquipment.map(
                                    (item) => (
                                        <div
                                            key={
                                                item.id
                                            }
                                            className="flex items-center justify-between gap-3 py-3"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">
                                                    {item.name}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {
                                                        item.category
                                                    }
                                                </p>
                                            </div>

                                            <span className="text-sm font-bold text-blue-600">
                        x
                                                {
                                                    item.quantity
                                                }
                      </span>
                                        </div>
                                    ),
                                )}

                                {selectedEquipment.length ===
                                    0 && (
                                        <p className="py-8 text-center text-sm text-slate-400">
                                            Chưa chọn thiết
                                            bị.
                                        </p>
                                    )}
                            </div>
                        </article>
                    </section>
                )}

                <footer className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <button
                        type="button"
                        onClick={
                            handleBack
                        }
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <ArrowLeft
                            size={16}
                            aria-hidden="true"
                        />

                        {step === 1
                            ? "Hủy"
                            : "Quay lại"}
                    </button>

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={
                                handleNext
                            }
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Tiếp tục

                            <ChevronRight
                                size={16}
                                aria-hidden="true"
                            />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={
                                handleSubmit
                            }
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Check
                                size={17}
                                aria-hidden="true"
                            />

                            Tạo yêu cầu
                        </button>
                    )}
                </footer>
            </main>
        );
    };