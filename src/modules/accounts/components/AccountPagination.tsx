import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface AccountPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (
    page: number,
  ) => void;
  onPageSizeChange: (
    pageSize: number,
  ) => void;
}

const getVisiblePages = (
  currentPage: number,
  totalPages: number,
): number[] => {
  if (totalPages <= 5) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  const startPage = Math.max(
    1,
    Math.min(
      currentPage - 2,
      totalPages - 4,
    ),
  );

  return Array.from(
    {
      length: 5,
    },
    (_, index) =>
      startPage + index,
  );
};

export const AccountPagination = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: AccountPaginationProps) => {
  const visiblePages =
    getVisiblePages(
      currentPage,
      totalPages,
    );

  const firstItem =
    totalItems === 0
      ? 0
      : (currentPage - 1) *
          pageSize +
        1;

  const lastItem = Math.min(
    currentPage * pageSize,
    totalItems,
  );

  return (
    <section className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-slate-500">
          Hiển thị{" "}
          <strong className="text-slate-800">
            {firstItem}
          </strong>
          {" - "}
          <strong className="text-slate-800">
            {lastItem}
          </strong>
          {" trên "}
          <strong className="text-slate-800">
            {totalItems}
          </strong>{" "}
          tài khoản
        </p>

        <label className="flex items-center gap-2 text-sm text-slate-500">
          Số dòng:

          <select
            value={pageSize}
            onChange={(event) => {
              onPageSizeChange(
                Number(
                  event.target.value,
                ),
              );
            }}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {[5, 10, 20, 50].map(
              (size) => (
                <option
                  key={size}
                  value={size}
                >
                  {size}
                </option>
              ),
            )}
          </select>
        </label>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          aria-label="Trang trước"
          disabled={
            currentPage <= 1
          }
          onClick={() => {
            onPageChange(
              currentPage - 1,
            );
          }}
          className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={18} />
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => {
              onPageChange(page);
            }}
            className={[
              "flex size-9 items-center justify-center rounded-lg border text-sm font-semibold transition",
              page === currentPage
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
            ].join(" ")}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          aria-label="Trang sau"
          disabled={
            currentPage >= totalPages
          }
          onClick={() => {
            onPageChange(
              currentPage + 1,
            );
          }}
          className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};
