import {
    Filter,
    RotateCcw,
    Search,
} from "lucide-react";

import type {
    CustomerRentalRequestStatus,
} from "../types/customerRentalRequest.types";

export type CustomerRentalRequestDateFilter =
    | "ALL"
    | "LAST_7_DAYS"
    | "LAST_30_DAYS"
    | "LAST_90_DAYS";

interface CustomerRentalRequestFiltersProps {
    searchTerm: string;
    status: CustomerRentalRequestStatus | "ALL";
    dateFilter: CustomerRentalRequestDateFilter;
    onSearchChange: (value: string) => void;
    onStatusChange: (
        value: CustomerRentalRequestStatus | "ALL",
    ) => void;
    onDateFilterChange: (
        value: CustomerRentalRequestDateFilter,
    ) => void;
    onReset: () => void;
}

export const CustomerRentalRequestFilters = ({
                                                 searchTerm,
                                                 status,
                                                 dateFilter,
                                                 onSearchChange,
                                                 onStatusChange,
                                                 onDateFilterChange,
                                                 onReset,
                                             }: CustomerRentalRequestFiltersProps) => {
    const hasActiveFilters =
        searchTerm.trim() !== "" ||
        status !== "ALL" ||
        dateFilter !== "ALL";

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Filter
                        size={16}
                        aria-hidden="true"
                    />
                </span>

                <div>
                    <h2 className="text-[13px] font-bold text-slate-900">
                        Tìm kiếm và bộ lọc
                    </h2>

                    <p className="text-[11px] text-slate-500">
                        Tìm nhanh yêu cầu thuê của bạn
                    </p>
                </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_auto]">
                <label className="relative block">
                    <span className="sr-only">
                        Tìm kiếm yêu cầu thuê
                    </span>

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
                        placeholder="Tìm theo mã yêu cầu, tên hoặc mã thiết bị..."
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                </label>

                <select
                    aria-label="Lọc theo trạng thái yêu cầu"
                    value={status}
                    onChange={(event) => {
                        onStatusChange(
                            event.target.value as
                                | CustomerRentalRequestStatus
                                | "ALL",
                        );
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                    <option value="ALL">
                        Tất cả trạng thái
                    </option>

                    <option value="PENDING">
                        Chờ tiếp nhận
                    </option>

                    <option value="PROCESSING">
                        Đang xử lý
                    </option>

                    <option value="QUOTED">
                        Đã gửi báo giá
                    </option>

                    <option value="APPROVED">
                        Đã chấp nhận
                    </option>

                    <option value="DELIVERING">
                        Đang giao
                    </option>

                    <option value="COMPLETED">
                        Hoàn thành
                    </option>

                    <option value="REJECTED">
                        Đã từ chối
                    </option>

                    <option value="CANCELLED">
                        Đã hủy
                    </option>
                </select>

                <select
                    aria-label="Lọc theo thời gian gửi yêu cầu"
                    value={dateFilter}
                    onChange={(event) => {
                        onDateFilterChange(
                            event.target
                                .value as CustomerRentalRequestDateFilter,
                        );
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                    <option value="ALL">
                        Tất cả thời gian
                    </option>

                    <option value="LAST_7_DAYS">
                        7 ngày gần đây
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
                    className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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