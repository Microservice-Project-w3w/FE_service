import {
    RotateCcw,
    Search,
} from "lucide-react";

import type {
    CustomerInvoiceStatus,
} from "../types/customerInvoice.types";

export type CustomerInvoiceDateFilter =
    | "ALL"
    | "LAST_30_DAYS"
    | "LAST_90_DAYS"
    | "THIS_YEAR";

interface CustomerInvoiceFiltersProps {
    searchTerm: string;

    status:
        | CustomerInvoiceStatus
        | "ALL";

    dateFilter:
        CustomerInvoiceDateFilter;

    onSearchChange: (
        value: string,
    ) => void;

    onStatusChange: (
        value:
            | CustomerInvoiceStatus
            | "ALL",
    ) => void;

    onDateFilterChange: (
        value:
        CustomerInvoiceDateFilter,
    ) => void;

    onReset: () => void;
}

export const CustomerInvoiceFilters = ({
                                           searchTerm,
                                           status,
                                           dateFilter,
                                           onSearchChange,
                                           onStatusChange,
                                           onDateFilterChange,
                                           onReset,
                                       }: CustomerInvoiceFiltersProps) => {
    const hasActiveFilters =
        searchTerm.trim() !== "" ||
        status !== "ALL" ||
        dateFilter !== "ALL";

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
                <label className="relative block">
                    <Search
                        size={18}
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
                        placeholder="Tìm theo mã hóa đơn, hợp đồng hoặc thiết bị..."
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </label>

                <select
                    value={status}
                    onChange={(event) => {
                        onStatusChange(
                            event.target.value as
                                | CustomerInvoiceStatus
                                | "ALL",
                        );
                    }}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                    <option value="ALL">
                        Tất cả trạng thái
                    </option>

                    <option value="PAID">
                        Đã thanh toán
                    </option>

                    <option value="PENDING">
                        Chờ thanh toán
                    </option>

                    <option value="OVERDUE">
                        Quá hạn
                    </option>

                    <option value="CANCELLED">
                        Đã hủy
                    </option>
                </select>

                <select
                    value={dateFilter}
                    onChange={(event) => {
                        onDateFilterChange(
                            event.target.value as
                                CustomerInvoiceDateFilter,
                        );
                    }}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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

                    <option value="THIS_YEAR">
                        Năm nay
                    </option>
                </select>

                <button
                    type="button"
                    disabled={!hasActiveFilters}
                    onClick={onReset}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <RotateCcw
                        size={16}
                        aria-hidden="true"
                    />

                    Đặt lại
                </button>
            </div>
        </section>
    );
};