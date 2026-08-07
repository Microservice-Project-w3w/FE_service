import {
    CalendarDays,
    Eye,
    FilePlus2,
} from "lucide-react";

import type {
    CustomerContractItem,
} from "../types/customerContract.types";

import {
    CustomerContractStatusBadge,
} from "./CustomerContractStatusBadge";

interface CustomerContractTableProps {
    contracts: CustomerContractItem[];
    onViewDetail: (
        contract: CustomerContractItem,
    ) => void;
    onRequestExtension?: (
        contract: CustomerContractItem,
    ) => void;
}

const formatCurrency = (
    value: number,
): string =>
    new Intl.NumberFormat("vi-VN").format(
        value,
    );

const formatDate = (
    value: string,
): string => {
    const date = new Date(
        `${value}T00:00:00`,
    );

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(
        "vi-VN",
    ).format(date);
};

const getProgressClassName = (
    progress: number,
): string => {
    if (progress >= 100) {
        return "bg-emerald-500";
    }

    if (progress >= 50) {
        return "bg-blue-500";
    }

    return "bg-amber-500";
};

export const CustomerContractTable = ({
                                          contracts,
                                          onViewDetail,
                                          onRequestExtension,
                                      }: CustomerContractTableProps) => {
    return (
        <section
            id="contract-list"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
            <div className="w-full">
                <table className="w-full table-fixed">
                    <colgroup>
                        <col className="w-[13%]" />
                        <col className="w-[24%]" />
                        <col className="w-[18%]" />
                        <col className="w-[23%]" />
                        <col className="w-[11%]" />
                        <col className="w-[11%]" />
                    </colgroup>

                    <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Hợp đồng
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Thiết bị
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Thời gian thuê
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Thanh toán
                        </th>

                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                            Trạng thái
                        </th>

                        <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                            Thao tác
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                    {contracts.map((contract) => {
                        const progress =
                            Math.min(
                                100,
                                Math.max(
                                    0,
                                    contract.paymentProgress,
                                ),
                            );

                        const progressClassName =
                            getProgressClassName(
                                progress,
                            );

                        return (
                            <tr
                                key={contract.id}
                                className="align-middle transition hover:bg-slate-50/70"
                            >
                                <td className="px-4 py-4">
                                    <div className="min-w-0">
                                        <p className="whitespace-nowrap text-sm font-bold text-blue-600">
                                            {
                                                contract.contractCode
                                            }
                                        </p>

                                        <p className="mt-1 text-[11px] text-slate-500">
                                            Tạo ngày{" "}
                                            {formatDate(
                                                contract.createdAt.slice(
                                                    0,
                                                    10,
                                                ),
                                            )}
                                        </p>
                                    </div>
                                </td>

                                <td className="px-4 py-4">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                                            <img
                                                src={
                                                    contract.equipmentImageUrl
                                                }
                                                alt={
                                                    contract.equipmentName
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="line-clamp-2 text-sm font-bold leading-5 text-slate-950">
                                                {
                                                    contract.equipmentName
                                                }
                                            </p>

                                            <p className="mt-1 text-[11px] text-slate-500">
                                                SL:{" "}
                                                {
                                                    contract.quantity
                                                }
                                            </p>

                                            <p className="mt-0.5 truncate text-[11px] text-slate-500">
                                                {
                                                    contract.branch
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-4">
                                    <div className="min-w-0">
                                        <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                                            <CalendarDays
                                                size={14}
                                                aria-hidden="true"
                                                className="shrink-0 text-slate-400"
                                            />

                                            <span className="truncate">
                                                    {formatDate(
                                                        contract.startDate,
                                                    )}
                                                {" - "}
                                                {formatDate(
                                                    contract.endDate,
                                                )}
                                                </span>
                                        </p>

                                        <p className="mt-1.5 text-[11px] text-slate-500">
                                            {
                                                contract.rentalDays
                                            }{" "}
                                            ngày
                                        </p>
                                    </div>
                                </td>

                                <td className="px-4 py-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center justify-between gap-3">
                                                <span className="text-[11px] font-medium text-slate-500">
                                                    Đã thanh toán
                                                </span>

                                            <span className="text-xs font-bold text-slate-700">
                                                    {
                                                        contract.paymentProgress
                                                    }
                                                %
                                                </span>
                                        </div>

                                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className={[
                                                    "h-full rounded-full transition-all",
                                                    progressClassName,
                                                ].join(
                                                    " ",
                                                )}
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            />
                                        </div>

                                        <p className="mt-2 text-xs font-semibold text-slate-800">
                                            {formatCurrency(
                                                contract.paidAmount,
                                            )}{" "}
                                            đ
                                            <span className="font-normal text-slate-400">
                                                    {" "}
                                                /{" "}
                                                {formatCurrency(
                                                    contract.totalAmount,
                                                )}{" "}
                                                đ
                                                </span>
                                        </p>

                                        {contract.remainingAmount >
                                            0 && (
                                                <p className="mt-1 text-[11px] font-semibold text-amber-700">
                                                    Còn{" "}
                                                    {formatCurrency(
                                                        contract.remainingAmount,
                                                    )}{" "}
                                                    đ
                                                </p>
                                            )}
                                    </div>
                                </td>

                                <td className="px-4 py-4">
                                    <div className="flex justify-start">
                                        <CustomerContractStatusBadge
                                            status={
                                                contract.status
                                            }
                                        />
                                    </div>
                                </td>

                                <td className="px-4 py-4">
                                    <div className="flex flex-col items-stretch gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onViewDetail(
                                                    contract,
                                                );
                                            }}
                                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                        >
                                            <Eye
                                                size={14}
                                                aria-hidden="true"
                                            />

                                            Chi tiết
                                        </button>

                                        {contract.canRequestExtension &&
                                            onRequestExtension && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        onRequestExtension(
                                                            contract,
                                                        );
                                                    }}
                                                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                                                >
                                                    <FilePlus2
                                                        size={14}
                                                        aria-hidden="true"
                                                        className="text-white"
                                                    />

                                                    Gia hạn
                                                </button>
                                            )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};