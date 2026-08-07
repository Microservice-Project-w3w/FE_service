import {
    AlertTriangle,
    ArrowLeft,
    CheckCircle2,
    FileImage,
    FileText,
    Package,
    Send,
    UploadCloud,
} from "lucide-react";
import {
    useMemo,
    useState,
} from "react";
import {
    useNavigate,
} from "react-router";

import type {
    CustomerIncidentPriority,
} from "../types/customerIncident.types";

interface IncidentContract {
    id: string;
    contractCode: string;
    equipmentId: string;
    equipmentCode: string;
    equipmentName: string;
    branch: string;
}

const INCIDENT_CONTRACTS: IncidentContract[] = [
    {
        id: "contract-008",
        contractCode: "HD-2026-0008",
        equipmentId: "equipment-003",
        equipmentCode: "EQ-2505-003",
        equipmentName:
            "Máy phát điện Denyo 45kVA",
        branch: "Chi nhánh Hà Nội",
    },
    {
        id: "contract-007",
        contractCode: "HD-2026-0007",
        equipmentId: "equipment-002",
        equipmentCode: "EQ-2505-002",
        equipmentName:
            "Xe nâng Heli CPCD30",
        branch: "Chi nhánh Hà Nội",
    },
    {
        id: "contract-005",
        contractCode: "HD-2026-0005",
        equipmentId: "equipment-001",
        equipmentCode: "EQ-2505-001",
        equipmentName:
            "Máy xúc Komatsu PC200-8",
        branch: "Chi nhánh Hà Nội",
    },
];

export const CustomerIncidentCreatePage = () => {
    const navigate =
        useNavigate();

    const [
        contractId,
        setContractId,
    ] = useState(
        INCIDENT_CONTRACTS[0]?.id ??
        "",
    );

    const [
        title,
        setTitle,
    ] = useState("");

    const [
        description,
        setDescription,
    ] = useState("");

    const [
        priority,
        setPriority,
    ] =
        useState<CustomerIncidentPriority>(
            "MEDIUM",
        );

    const [
        files,
        setFiles,
    ] = useState<File[]>([]);

    const [
        submitted,
        setSubmitted,
    ] = useState(false);

    const selectedContract =
        useMemo(
            () =>
                INCIDENT_CONTRACTS.find(
                    (item) =>
                        item.id ===
                        contractId,
                ) ?? null,
            [contractId],
        );

    const canSubmit =
        selectedContract !== null &&
        title.trim().length >= 5 &&
        description.trim().length >=
        10;

    const handleFilesChange = (
        event:
        React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const selectedFiles =
            Array.from(
                event.target.files ?? [],
            );

        setFiles(selectedFiles);
    };

    const handleSubmit = (): void => {
        if (!canSubmit) {
            return;
        }

        console.log(
            "Tạo báo cáo sự cố:",
            {
                contractId,
                title,
                description,
                priority,
                files,
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
                        Đã gửi báo cáo sự cố
                    </h1>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                        Báo cáo của bạn đã
                        được ghi nhận. Bộ phận
                        kỹ thuật sẽ kiểm tra và
                        cập nhật trạng thái xử
                        lý.
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            navigate(
                                "/customer/incidents",
                            );
                        }}
                        className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Về danh sách sự cố
                    </button>
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
                        "/customer/incidents",
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
                    Tạo báo cáo sự cố
                </h1>

                <p className="mt-1.5 text-sm text-slate-500">
                    Cung cấp thông tin rõ
                    ràng để sự cố được kiểm
                    tra và xử lý nhanh hơn.
                </p>
            </header>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-5">
                    {/* Chọn thiết bị */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Package
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Thiết bị gặp sự cố
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
                                {INCIDENT_CONTRACTS.map(
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
                                <p className="text-sm font-bold text-slate-950">
                                    {
                                        selectedContract.equipmentName
                                    }
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {
                                        selectedContract.equipmentCode
                                    }{" "}
                                    •{" "}
                                    {
                                        selectedContract.branch
                                    }
                                </p>
                            </div>
                        )}
                    </article>

                    {/* Nội dung */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <FileText
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Thông tin sự cố
                            </h2>
                        </div>

                        <div className="mt-5 space-y-4">
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">
                                    Tiêu đề sự cố
                                </span>

                                <input
                                    type="text"
                                    value={title}
                                    maxLength={
                                        120
                                    }
                                    onChange={(
                                        event,
                                    ) => {
                                        setTitle(
                                            event
                                                .target
                                                .value,
                                        );
                                    }}
                                    placeholder="Ví dụ: Máy phát điện không khởi động"
                                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-slate-700">
                                    Mô tả chi tiết
                                </span>

                                <textarea
                                    value={
                                        description
                                    }
                                    rows={5}
                                    maxLength={
                                        1000
                                    }
                                    onChange={(
                                        event,
                                    ) => {
                                        setDescription(
                                            event
                                                .target
                                                .value,
                                        );
                                    }}
                                    placeholder="Mô tả hiện tượng, thời điểm xảy ra và tình trạng hiện tại của thiết bị..."
                                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />

                                <span className="mt-1 block text-right text-xs text-slate-400">
                                    {
                                        description.length
                                    }
                                    /1000
                                </span>
                            </label>
                        </div>
                    </article>

                    {/* Mức độ */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <AlertTriangle
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Mức độ sự cố
                            </h2>
                        </div>

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setPriority(
                                        "LOW",
                                    );
                                }}
                                className={[
                                    "rounded-xl border p-4 text-left transition",
                                    priority ===
                                    "LOW"
                                        ? "border-emerald-400 bg-emerald-50 ring-2 ring-emerald-100"
                                        : "border-slate-200 hover:bg-slate-50",
                                ].join(
                                    " ",
                                )}
                            >
                                <p className="text-sm font-bold text-emerald-700">
                                    Thấp
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Không ảnh
                                    hưởng nhiều
                                    đến hoạt động.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setPriority(
                                        "MEDIUM",
                                    );
                                }}
                                className={[
                                    "rounded-xl border p-4 text-left transition",
                                    priority ===
                                    "MEDIUM"
                                        ? "border-amber-400 bg-amber-50 ring-2 ring-amber-100"
                                        : "border-slate-200 hover:bg-slate-50",
                                ].join(
                                    " ",
                                )}
                            >
                                <p className="text-sm font-bold text-amber-700">
                                    Trung bình
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Ảnh hưởng đến
                                    quá trình sử
                                    dụng thiết bị.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setPriority(
                                        "HIGH",
                                    );
                                }}
                                className={[
                                    "rounded-xl border p-4 text-left transition",
                                    priority ===
                                    "HIGH"
                                        ? "border-red-400 bg-red-50 ring-2 ring-red-100"
                                        : "border-slate-200 hover:bg-slate-50",
                                ].join(
                                    " ",
                                )}
                            >
                                <p className="text-sm font-bold text-red-700">
                                    Cao
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Thiết bị không
                                    thể tiếp tục sử
                                    dụng an toàn.
                                </p>
                            </button>
                        </div>
                    </article>

                    {/* Tệp */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <FileImage
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Ảnh / video đính kèm
                            </h2>
                        </div>

                        <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-blue-300 hover:bg-blue-50/50">
                            <UploadCloud
                                size={28}
                                aria-hidden="true"
                                className="text-blue-500"
                            />

                            <span className="mt-3 text-sm font-semibold text-slate-800">
                                Chọn ảnh hoặc video
                            </span>

                            <span className="mt-1 text-xs text-slate-500">
                                Giúp bộ phận kỹ thuật
                                đánh giá chính xác hơn
                            </span>

                            <input
                                type="file"
                                multiple
                                accept="image/*,video/*"
                                onChange={
                                    handleFilesChange
                                }
                                className="sr-only"
                            />
                        </label>

                        {files.length > 0 && (
                            <div className="mt-3 rounded-xl bg-slate-50 px-4 py-3">
                                <p className="text-xs font-semibold text-slate-700">
                                    {
                                        files.length
                                    }{" "}
                                    tệp đã chọn
                                </p>

                                <div className="mt-2 space-y-1">
                                    {files.map(
                                        (
                                            file,
                                        ) => (
                                            <p
                                                key={`${file.name}-${file.size}`}
                                                className="truncate text-xs text-slate-500"
                                            >
                                                {
                                                    file.name
                                                }
                                            </p>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </article>
                </div>

                {/* Xác nhận */}
                <aside>
                    <section className="sticky top-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-bold text-slate-950">
                            Xác nhận báo cáo
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
                                        Mức độ
                                    </dt>

                                    <dd className="mt-1 text-sm font-semibold text-slate-900">
                                        {priority ===
                                        "HIGH"
                                            ? "Cao"
                                            : priority ===
                                            "MEDIUM"
                                                ? "Trung bình"
                                                : "Thấp"}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs text-slate-500">
                                        Tệp đính kèm
                                    </dt>

                                    <dd className="mt-1 text-sm font-semibold text-slate-900">
                                        {
                                            files.length
                                        }{" "}
                                        tệp
                                    </dd>
                                </div>
                            </dl>
                        )}

                        <div className="mt-5 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-700">
                            Sau khi gửi, bạn có
                            thể theo dõi tiến độ
                            trong danh sách Báo
                            cáo sự cố.
                        </div>

                        <button
                            type="button"
                            disabled={
                                !canSubmit
                            }
                            onClick={
                                handleSubmit
                            }
                            className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Send
                                size={16}
                                aria-hidden="true"
                            />

                            Gửi báo cáo
                        </button>
                    </section>
                </aside>
            </section>
        </main>
    );
};