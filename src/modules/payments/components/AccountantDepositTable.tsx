import { Eye, RotateCcw } from "lucide-react";
import { AccountantDepositBadge } from "@/modules/payments/components/AccountantPaymentBadge";
import { formatPaymentCurrency } from "@/modules/payments/components/accountantPaymentFormatters";
import type { AccountantDeposit } from "@/modules/payments/types/accountant-payment.types";

interface Props { deposits: AccountantDeposit[]; isLoading: boolean; onView: (deposit: AccountantDeposit) => void; onRefund: (deposit: AccountantDeposit) => void; }

export const AccountantDepositTable = ({ deposits, isLoading, onView, onRefund }: Props) => {
  if (isLoading) return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="space-y-3">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-xl bg-slate-100" />)}</div></section>;
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[1180px] border-collapse">
      <thead><tr className="border-b border-slate-200 bg-slate-50/80">{["Mã cọc", "Hóa đơn", "Khách hàng", "Đơn thuê", "Giá trị cọc", "Đang giữ", "Đã hoàn", "Trạng thái", "Thao tác"].map((heading) => <th key={heading} className={`px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 ${["Giá trị cọc", "Đang giữ", "Đã hoàn"].includes(heading) ? "text-right" : "text-left"}`}>{heading}</th>)}</tr></thead>
      <tbody>{deposits.length === 0 ? <tr><td colSpan={9} className="px-6 py-16 text-center"><p className="font-semibold text-slate-700">Không tìm thấy khoản cọc</p><p className="mt-2 text-sm text-slate-400">Hãy thay đổi bộ lọc hiện tại.</p></td></tr> : deposits.map((deposit) => {
        const canRefund = deposit.heldAmount > deposit.refundedAmount;
        return <tr key={deposit.id} className="border-b border-slate-100 last:border-b-0 hover:bg-blue-50/30">
          <td className="whitespace-nowrap px-4 py-4 font-semibold text-blue-700"><button type="button" onClick={() => onView(deposit)}>{deposit.id}</button></td>
          <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-700">{deposit.invoiceCode}</td><td className="px-4 py-4 font-semibold text-slate-700">{deposit.customerName}<p className="mt-1 text-xs font-normal text-slate-400">{deposit.branchName}</p></td><td className="whitespace-nowrap px-4 py-4 text-slate-600">{deposit.rentalCode}</td>
          <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-slate-700">{formatPaymentCurrency(deposit.depositAmount)}</td><td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-blue-700">{formatPaymentCurrency(deposit.heldAmount)}</td><td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-emerald-700">{formatPaymentCurrency(deposit.refundedAmount)}</td>
          <td className="px-4 py-4"><AccountantDepositBadge status={deposit.status} /></td><td className="px-4 py-4"><div className="flex gap-1"><button type="button" title="Xem chi tiết" onClick={() => onView(deposit)} className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-700"><Eye size={17} /></button><button type="button" title="Hoàn toàn bộ số cọc còn giữ" disabled={!canRefund} onClick={() => onRefund(deposit)} className="inline-flex size-9 items-center justify-center rounded-lg text-violet-600 hover:bg-violet-50 disabled:opacity-30"><RotateCcw size={17} /></button></div></td>
        </tr>;
      })}</tbody>
    </table></div></section>
  );
};
