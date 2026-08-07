import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    Package,
    Truck,
} from "lucide-react";
import {
    useMemo,
    useState,
} from "react";
import {
    useNavigate,
} from "react-router";

type ReturnMethod =
    | "BRANCH_RETURN"
    | "PICKUP";

interface ReturnCandidate {
    id: string;
    contractCode: string;
    equipmentCode: string;
    equipmentName: string;
    branch: string;
    quantity: number;
    endDate: string;
}

const RETURN_CANDIDATES: ReturnCandidate[] = [
    {
        id: "contract-008",
        contractCode: "HD-2026-0008",
        equipmentCode: "EQ-2505-003",
        equipmentName:
            "Máy phát điện Denyo 45kVA",
        branch: "Chi nhánh Hà Nội",
        quantity: 1,
        endDate: "2026-08-14",
    },
    {
        id: "contract-007",
        contractCode: "HD-2026-0007",
        equipmentCode: "EQ-2505-002",
        equipmentName:
            "Xe nâng Heli CPCD30",
        branch: "Chi nhánh Hà Nội",
        quantity: 1,
        endDate: "2026-08-12",
    },
    {
        id: "contract-005",
        contractCode: "HD-2026-0005",
        equipmentCode: "EQ-2505-001",
        equipmentName:
            "Máy xúc Komatsu PC200-8",
        branch: "Chi nhánh Hà Nội",
        quantity: 1,
        endDate: "2026-08-10",
    },
];

export const CustomerReturnRequestCreatePage = () => {
    const navigate = useNavigate();

    const [
        contractId,
        setContractId,
    ] = useState(
        RETURN_CANDIDATES[0]?.id ?? "",
    );

    const [
        expectedReturnDate,
        setExpectedReturnDate,
    ] = useState("");

    const [
        expectedReturnTime,
        setExpectedReturnTime,
    ] = useState("09:00");

    const [
        returnMethod,
        setReturnMethod,
    ] =
        useState<ReturnMethod>(
            "BRANCH_RETURN",
        );

    const [
        note,
        setNote,
    ] = useState("");

    const [
        submitted,
        setSubmitted,
    ] = useState(false);

    const selectedContract =
        useMemo(
            () =>
                RETURN_CANDIDATES.find(
                    (item) =>
                        item.id ===
                        contractId,
                ) ?? null,
            [contractId],
        );

    const canSubmit =
        selectedContract !== null &&
        expectedReturnDate !== "" &&
        expectedReturnTime !== "";

    const handleSubmit = (): void => {
        if (!canSubmit) {
            return;
        }

        console.log(
            "Tạo yêu cầu trả:",
            {
                contractId,
                expectedReturnDate,
                expectedReturnTime,
                returnMethod,
                note,
            },
        );

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <main className="mx-auto max-w-2xl">
                <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <CheckCircle2
                            size={28}
                            aria-hidden="true"
                        />
                    </span>

                    <h1 className="mt-5 text-2xl font-bold text-slate-950">
                        Đã gửi yêu cầu trả
                    </h1>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Yêu cầu của bạn đã
                        được ghi nhận. Chi
                        nhánh sẽ kiểm tra và
                        xác nhận lịch hoàn trả
                        thiết bị.
                    </p>

                    <div className="mt-6 flex justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                navigate(
                                    "/customer/return-requests",
                                );
                            }}
                            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Về danh sách
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="space-y-5">
            <button
                type="button"
                onClick={() => {
                    navigate(
                        "/customer/return-requests",
                    );
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
                <ArrowLeft
                    size={17}
                    aria-hidden="true"
                />

                Quay lại
            </button>

            <header>
                <h1 className="text-3xl font-bold text-slate-950">
                    Tạo yêu cầu trả
                </h1>

                <p className="mt-1.5 text-sm text-slate-500">
                    Chọn hợp đồng và thời
                    gian bạn muốn hoàn trả
                    thiết bị.
                </p>
            </header>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-5">
                    {/* Hợp đồng */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <FileText
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Hợp đồng cần trả
                            </h2>
                        </div>

                        <label className="mt-5 block">
                            <span className="text-sm font-semibold text-slate-700">
                                Chọn hợp đồng
                            </span>

                            <select
                                value={
                                    contractId
                                }
                                onChange={(
                                    event,
                                ) => {
                                    setContractId(
                                        event
                                            .target
                                            .value,
                                    );
                                }}
                                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            >
                                {RETURN_CANDIDATES.map(
                                    (
                                        item,
                                    ) => (
                                        <option
                                            key={
                                                item.id
                                            }
                                            value={
                                                item.id
                                            }
                                        >
                                            {
                                                item.contractCode
                                            }{" "}
                                            -{" "}
                                            {
                                                item.equipmentName
                                            }
                                        </option>
                                    ),
                                )}
                            </select>
                        </label>

                        {selectedContract && (
                            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <Package
                                            size={
                                                19
                                            }
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-950">
                                            {
                                                selectedContract.equipmentName
                                            }
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {
                                                selectedContract.equipmentCode
                                            }{" "}
                                            · Số
                                            lượng{" "}
                                            {
                                                selectedContract.quantity
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {
                                                selectedContract.branch
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </article>

                    {/* Thời gian */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Thời gian trả
                            </h2>
                        </div>

                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            <label>
                                <span className="text-sm font-semibold text-slate-700">
                                    Ngày dự kiến
                                    trả
                                </span>

                                <input
                                    type="date"
                                    value={
                                        expectedReturnDate
                                    }
                                    onChange={(
                                        event,
                                    ) => {
                                        setExpectedReturnDate(
                                            event
                                                .target
                                                .value,
                                        );
                                    }}
                                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </label>

                            <label>
                                <span className="text-sm font-semibold text-slate-700">
                                    Thời gian
                                </span>

                                <input
                                    type="time"
                                    value={
                                        expectedReturnTime
                                    }
                                    onChange={(
                                        event,
                                    ) => {
                                        setExpectedReturnTime(
                                            event
                                                .target
                                                .value,
                                        );
                                    }}
                                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </label>
                        </div>
                    </article>

                    {/* Hình thức */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Truck
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Hình thức trả
                            </h2>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setReturnMethod(
                                        "BRANCH_RETURN",
                                    );
                                }}
                                className={[
                                    "rounded-xl border p-4 text-left transition",
                                    returnMethod ===
                                    "BRANCH_RETURN"
                                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                        : "border-slate-200 hover:border-blue-200 hover:bg-slate-50",
                                ].join(
                                    " ",
                                )}
                            >
                                <p className="text-sm font-bold text-slate-900">
                                    Trả tại chi
                                    nhánh
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Mang thiết bị
                                    đến chi nhánh
                                    để bàn giao.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setReturnMethod(
                                        "PICKUP",
                                    );
                                }}
                                className={[
                                    "rounded-xl border p-4 text-left transition",
                                    returnMethod ===
                                    "PICKUP"
                                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                        : "border-slate-200 hover:border-blue-200 hover:bg-slate-50",
                                ].join(
                                    " ",
                                )}
                            >
                                <p className="text-sm font-bold text-slate-900">
                                    Yêu cầu đến
                                    nhận
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Đơn vị cho thuê
                                    đến địa điểm
                                    nhận thiết bị.
                                </p>
                            </button>
                        </div>
                    </article>

                    {/* Ghi chú */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <label>
                            <span className="text-sm font-semibold text-slate-700">
                                Ghi chú
                            </span>

                            <textarea
                                value={note}
                                onChange={(
                                    event,
                                ) => {
                                    setNote(
                                        event
                                            .target
                                            .value,
                                    );
                                }}
                                rows={4}
                                maxLength={
                                    500
                                }
                                placeholder="Nhập tình trạng thiết bị hoặc yêu cầu hỗ trợ nếu có..."
                                className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                            <span className="mt-1 block text-right text-xs text-slate-400">
                                {
                                    note.length
                                }
                                /500
                            </span>
                        </label>
                    </article>
                </div>

                {/* Summary */}
                <aside>
                    <section className="sticky top-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-bold text-slate-950">
                            Xác nhận yêu cầu
                        </h2>

                        {selectedContract && (
                            <dl className="mt-5 space-y-4">
                                <div>
                                    <dt className="text-xs text-slate-500">
                                        Hợp đồng
                                    </dt>

                                    <dd className="mt-1 text-sm font-bold text-blue-600">
                                        {
                                            selectedContract.contractCode
                                        }
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-slate-500">
                                        Thiết bị
                                    </dt>

                                    <dd className="mt-1 text-sm font-semibold text-slate-900">
                                        {
                                            selectedContract.equipmentName
                                        }
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-slate-500">
                                        Ngày kết
                                        thúc hợp
                                        đồng
                                    </dt>

                                    <dd className="mt-1 text-sm font-semibold text-slate-900">
                                        {
                                            selectedContract.endDate
                                        }
                                    </dd>
                                </div>
                            </dl>
                        )}

                        <div className="mt-5 rounded-xl bg-slate-50 p-3">
                            <div className="flex gap-2">
                                <Clock3
                                    size={16}
                                    aria-hidden="true"
                                    className="mt-0.5 shrink-0 text-slate-500"
                                />

                                <p className="text-xs leading-5 text-slate-600">
                                    Lịch trả cần
                                    được chi nhánh
                                    xác nhận trước
                                    khi thực hiện
                                    bàn giao.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled={
                                !canSubmit
                            }
                            onClick={
                                handleSubmit
                            }
                            className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Gửi yêu cầu trả
                        </button>
                    </section>
                </aside>
            </section>
        </main>
    );
};