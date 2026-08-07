import {
    RotateCcw,
    Search,
} from "lucide-react";

import type {
    CustomerReturnRequestStatus,
} from "../types/customerReturnRequest.types";

export type CustomerReturnRequestDateFilter =
    | "ALL"
    | "LAST_30_DAYS"
    | "LAST_90_DAYS";

interface CustomerReturnRequestFiltersProps {
    searchTerm: string;

    status:
        | CustomerReturnRequestStatus
        | "ALL";

    dateFilter:
        CustomerReturnRequestDateFilter;

    onSearchChange: (
        value: string,
    ) => void;

    onStatusChange: (
        value:
            | CustomerReturnRequestStatus
            | "ALL",
    ) => void;

    onDateFilterChange: (
        value:
        CustomerReturnRequestDateFilter,
    ) => void;

    onReset: () => void;
}

export const CustomerReturnRequestFilters = ({
                                                 searchTerm,
                                                 status,
                                                 dateFilter,
                                                 onSearchChange,
                                                 onStatusChange,
                                                 onDateFilterChange,
                                                 onReset,
                                             }: CustomerReturnRequestFiltersProps) => {
    const hasActiveFilters =
        searchTerm.trim() !== "" ||
        status !== "ALL" ||
        dateFilter !== "ALL";

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_210px_210px_auto]">
                <label className="relative block">
                    <Search
                        size={17}
                        aria-hidden="true"
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="search"
                        value={
                            searchTerm
                        }
                        onChange={(
                            event,
                        ) => {
                            onSearchChange(
                                event
                                    .target
                                    .value,
                            );
                        }}
                        placeholder="Tìm mã yêu cầu, thiết bị, hợp đồng..."
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </label>

                <select
                    value={status}
                    onChange={(
                        event,
                    ) => {
                        onStatusChange(
                            event
                                .target
                                .value as
                                | CustomerReturnRequestStatus
                                | "ALL",
                        );
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                    <option value="ALL">
                        Tất cả trạng thái
                    </option>

                    <option value="PROCESSING">
                        Đang xử lý
                    </option>

                    <option value="DUE_SOON">
                        Sắp đến ngày trả
                    </option>

                    <option value="COMPLETED">
                        Hoàn thành
                    </option>

                    <option value="CANCELLED">
                        Đã hủy
                    </option>
                </select>

                <select
                    value={
                        dateFilter
                    }
                    onChange={(
                        event,
                    ) => {
                        onDateFilterChange(
                            event
                                .target
                                .value as
                                CustomerReturnRequestDateFilter,
                        );
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                    <option value="ALL">
                        Tất cả thời gian
                    </option>

                    <option value="LAST_30_DAYS">
                        30 ngày gần đây
                    </option>

                    <option value="LAST_90_DAYS">
                        90 ngày gần đây
                    </option>
                </select>

                <button
                    type="button"
                    disabled={
                        !hasActiveFilters
                    }
                    onClick={
                        onReset
                    }
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <RotateCcw
                        size={15}
                        aria-hidden="true"
                    />

                    Đặt lại
                </button>
            </div>
        </section>
    );
};