import {
    Filter,
    RotateCcw,
    Search,
} from "lucide-react";

import type {
    CustomerEquipmentStatus,
} from "../types/customerEquipment.types";

export type EquipmentPriceRange =
    | "ALL"
    | "UNDER_500000"
    | "FROM_500000_TO_1000000"
    | "OVER_1000000";

interface CustomerEquipmentFiltersProps {
    searchTerm: string;
    category: string;
    priceRange: EquipmentPriceRange;
    branch: string;
    status: CustomerEquipmentStatus | "ALL";
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onPriceRangeChange: (
        value: EquipmentPriceRange,
    ) => void;
    onBranchChange: (value: string) => void;
    onStatusChange: (
        value: CustomerEquipmentStatus | "ALL",
    ) => void;
    onReset: () => void;
}

export const CustomerEquipmentFilters = ({
                                             searchTerm,
                                             category,
                                             priceRange,
                                             branch,
                                             status,
                                             onSearchChange,
                                             onCategoryChange,
                                             onPriceRangeChange,
                                             onBranchChange,
                                             onStatusChange,
                                             onReset,
                                         }: CustomerEquipmentFiltersProps) => {
    const hasActiveFilters =
        searchTerm.trim() !== "" ||
        category !== "ALL" ||
        priceRange !== "ALL" ||
        branch !== "ALL" ||
        status !== "ALL";

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
                        Lọc thiết bị theo nhu cầu của bạn
                    </p>
                </div>
            </div>

            <label className="relative block">
                <span className="sr-only">
                    Tìm kiếm thiết bị
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
                    placeholder="Tìm theo tên, mã, danh mục hoặc chi nhánh..."
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
            </label>

            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <select
                    aria-label="Lọc theo danh mục"
                    value={category}
                    onChange={(event) => {
                        onCategoryChange(
                            event.target.value,
                        );
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                    <option value="ALL">
                        Tất cả danh mục
                    </option>

                    <option value="Máy công trình">
                        Máy công trình
                    </option>

                    <option value="Thiết bị nâng">
                        Thiết bị nâng
                    </option>

                    <option value="Máy phát điện">
                        Máy phát điện
                    </option>

                    <option value="Giàn giáo">
                        Giàn giáo
                    </option>
                </select>

                <select
                    aria-label="Lọc theo mức giá"
                    value={priceRange}
                    onChange={(event) => {
                        onPriceRangeChange(
                            event.target
                                .value as EquipmentPriceRange,
                        );
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                    <option value="ALL">
                        Tất cả mức giá
                    </option>

                    <option value="UNDER_500000">
                        Dưới 500.000 đ
                    </option>

                    <option value="FROM_500000_TO_1000000">
                        500.000 - 1.000.000 đ
                    </option>

                    <option value="OVER_1000000">
                        Trên 1.000.000 đ
                    </option>
                </select>

                <select
                    aria-label="Lọc theo chi nhánh"
                    value={branch}
                    onChange={(event) => {
                        onBranchChange(
                            event.target.value,
                        );
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                    <option value="ALL">
                        Tất cả chi nhánh
                    </option>

                    <option value="Chi nhánh Hà Nội">
                        Chi nhánh Hà Nội
                    </option>

                    <option value="Chi nhánh Đà Nẵng">
                        Chi nhánh Đà Nẵng
                    </option>

                    <option value="Chi nhánh TP.HCM">
                        Chi nhánh TP.HCM
                    </option>
                </select>

                <select
                    aria-label="Lọc theo trạng thái"
                    value={status}
                    onChange={(event) => {
                        onStatusChange(
                            event.target.value as
                                | CustomerEquipmentStatus
                                | "ALL",
                        );
                    }}
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                    <option value="ALL">
                        Tất cả trạng thái
                    </option>

                    <option value="AVAILABLE">
                        Sẵn sàng
                    </option>

                    <option value="LOW_STOCK">
                        Sắp hết
                    </option>

                    <option value="UNAVAILABLE">
                        Không khả dụng
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