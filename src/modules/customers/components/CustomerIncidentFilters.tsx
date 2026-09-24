import {
    RotateCcw,
    Search,
} from "lucide-react";

import type {
    CustomerIncidentPriority,
    CustomerIncidentStatus,
} from "../types/customerIncident.types";

export type CustomerIncidentDateFilter =
    | "ALL"
    | "LAST_30_DAYS"
    | "LAST_90_DAYS";

interface CustomerIncidentFiltersProps {
    searchTerm: string;

    status:
        | CustomerIncidentStatus
        | "ALL";

    priority:
        | CustomerIncidentPriority
        | "ALL";

    dateFilter:
        CustomerIncidentDateFilter;

    onSearchChange: (
        value: string,
    ) => void;

    onStatusChange: (
        value:
            | CustomerIncidentStatus
            | "ALL",
    ) => void;

    onPriorityChange: (
        value:
            | CustomerIncidentPriority
            | "ALL",
    ) => void;

    onDateFilterChange: (
        value:
        CustomerIncidentDateFilter,
    ) => void;

    onReset: () => void;
}

export const CustomerIncidentFilters = ({
                                            searchTerm,
                                            status,
                                            priority,
                                            dateFilter,
                                            onSearchChange,
                                            onStatusChange,
                                            onPriorityChange,
                                            onDateFilterChange,
                                            onReset,
                                        }: CustomerIncidentFiltersProps) => {
    const hasActiveFilters =
        searchTerm.trim() !== "" ||
        status !== "ALL" ||
        priority !== "ALL" ||
        dateFilter !== "ALL";

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="grid gap-3 xl:grid-cols-[minmax(260px,1fr)_180px_160px_180px_auto]">
                <label className="relative">
                    <Search
                        size={17}
                        aria-hidden="true"
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => {
                            onSearchChange(
                                event.target.value,
                            );
                        }}
                        placeholder="Tìm mã sự cố, thiết bị, hợp đồng..."
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </label>

                <select
                    value={status}
                    onChange={(event) => {
                        onStatusChange(
                            event.target.value as
                                | CustomerIncidentStatus
                                | "ALL",
                        );
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
                >
                    <option value="ALL">
                        Tất cả trạng thái
                    </option>

                    <option value="PROCESSING">
                        Đang xử lý
                    </option>

                    <option value="WAITING_RESPONSE">
                        Chờ phản hồi
                    </option>

                    <option value="RESOLVED">
                        Đã giải quyết
                    </option>

                    <option value="CANCELLED">
                        Đã hủy
                    </option>
                </select>

                <select
                    value={priority}
                    onChange={(event) => {
                        onPriorityChange(
                            event.target.value as
                                | CustomerIncidentPriority
                                | "ALL",
                        );
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
                >
                    <option value="ALL">
                        Tất cả mức độ
                    </option>

                    <option value="HIGH">
                        Cao
                    </option>

                    <option value="MEDIUM">
                        Trung bình
                    </option>

                    <option value="LOW">
                        Thấp
                    </option>
                </select>

                <select
                    value={dateFilter}
                    onChange={(event) => {
                        onDateFilterChange(
                            event.target.value as
                                CustomerIncidentDateFilter,
                        );
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
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
                    disabled={!hasActiveFilters}
                    onClick={onReset}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
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