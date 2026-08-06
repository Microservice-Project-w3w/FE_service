import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type DataPaginationProps = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  itemLabel: string;
  pageSizeOptions?: number[];
  onPageChange: (
    page: number,
  ) => void;
  onPageSizeChange: (
    pageSize: number,
  ) => void;
};

export function DataPagination({
  currentPage,
  pageSize,
  totalItems,
  itemLabel,
  pageSizeOptions = [
    5,
    10,
    20,
    50,
  ],
  onPageChange,
  onPageSizeChange,
}: DataPaginationProps) {
  const totalPages = Math.max(
    1,
    Math.ceil(
      totalItems / pageSize,
    ),
  );

  const safeCurrentPage = Math.min(
    Math.max(
      currentPage,
      1,
    ),
    totalPages,
  );

  const startItem =
    totalItems === 0
      ? 0
      : (safeCurrentPage - 1) *
          pageSize +
        1;

  const endItem = Math.min(
    safeCurrentPage * pageSize,
    totalItems,
  );

  const pages = Array.from(
    {
      length: totalPages,
    },
    (_, index) => index + 1,
  );

  return (
    <div className="grid min-h-24 w-full grid-cols-1 items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_auto]">
      <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-3">
        <p className="whitespace-nowrap text-sm text-slate-500">
          Hiển thị{" "}
          <span className="font-semibold text-slate-900">
            {startItem} - {endItem}
          </span>{" "}
          trên{" "}
          <span className="font-semibold text-slate-900">
            {totalItems}
          </span>{" "}
          {itemLabel}
        </p>

        <label className="flex shrink-0 items-center gap-3 text-sm text-slate-500">
          <span className="whitespace-nowrap">
            Số dòng:
          </span>

          <select
            value={pageSize}
            onChange={(event) => {
              onPageSizeChange(
                Number(
                  event.target.value,
                ),
              );
            }}
            className="h-11 min-w-20 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {pageSizeOptions.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              ),
            )}
          </select>
        </label>
      </div>

      <div className="flex min-w-52 shrink-0 items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Trang trước"
          disabled={
            safeCurrentPage <= 1
          }
          onClick={() =>
            onPageChange(
              safeCurrentPage - 1,
            )
          }
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        {pages.map((page) => {
          const isActive =
            page === safeCurrentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() =>
                onPageChange(page)
              }
              className={[
                "flex size-11 shrink-0 items-center justify-center rounded-xl border text-sm font-medium transition",
                isActive
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600",
              ].join(" ")}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          aria-label="Trang tiếp theo"
          disabled={
            safeCurrentPage >=
            totalPages
          }
          onClick={() =>
            onPageChange(
              safeCurrentPage + 1,
            )
          }
          className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
