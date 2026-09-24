interface Props { currentPage: number; totalPages: number; pageItems: number; totalItems: number; itemLabel?: string; onPageChange: (page: number) => void; }

export const AccountantPaymentPagination = ({ currentPage, totalPages, pageItems, totalItems, itemLabel = "giao dịch", onPageChange }: Props) => (
  <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
    <p className="text-sm text-slate-500">Hiển thị <span className="font-bold text-slate-800">{pageItems}</span> trong <span className="font-bold text-slate-800">{totalItems}</span> {itemLabel}</p>
    <div className="flex items-center gap-4">
      <button type="button" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 hover:bg-blue-50 disabled:text-slate-300">Trước</button>
      <span className="min-w-24 text-center text-sm font-semibold text-slate-600">Trang {currentPage}/{totalPages}</span>
      <button type="button" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)} className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 hover:bg-blue-50 disabled:text-slate-300">Sau</button>
    </div>
  </section>
);
