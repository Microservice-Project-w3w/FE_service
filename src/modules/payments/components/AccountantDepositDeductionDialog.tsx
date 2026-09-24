import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LoaderCircle, X } from "lucide-react";
import type { AccountantDeposit } from "@/modules/payments/types/accountant-payment.types";

interface Props { deposit: AccountantDeposit | null; isSubmitting: boolean; onClose: () => void; onConfirm: (amount: number, reason: string) => void; }

export const AccountantDepositDeductionDialog = ({ deposit, isSubmitting, onClose, onConfirm }: Props) => {
  const [amount, setAmount] = useState(""); const [reason, setReason] = useState("");
  useEffect(() => { setAmount(""); setReason(""); }, [deposit]);
  if (!deposit) return null;
  const numericAmount = Number(amount); const valid = numericAmount > 0 && numericAmount <= deposit.remainingAmount && reason.trim().length > 0;
  return createPortal(<div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4"><form onSubmit={(event) => { event.preventDefault(); if (valid) onConfirm(numericAmount, reason.trim()); }} className="w-full max-w-md rounded-3xl bg-white shadow-2xl"><header className="flex items-center justify-between border-b px-6 py-5"><h2 className="font-bold text-slate-900">Khấu trừ tiền cọc</h2><button type="button" onClick={onClose}><X size={18} /></button></header><div className="space-y-4 px-6 py-5"><label className="block text-sm font-semibold text-slate-700">Số tiền<input type="number" min="1" max={deposit.remainingAmount} value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-2 h-11 w-full rounded-xl border px-3" /></label><label className="block text-sm font-semibold text-slate-700">Lý do<input value={reason} onChange={(event) => setReason(event.target.value)} className="mt-2 h-11 w-full rounded-xl border px-3" placeholder="Nhập lý do khấu trừ" /></label></div><footer className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4"><button type="button" onClick={onClose} className="h-10 rounded-xl border px-5">Hủy</button><button type="submit" disabled={!valid || isSubmitting} className="inline-flex h-10 items-center gap-2 rounded-xl bg-orange-600 px-5 font-semibold text-white disabled:opacity-50">{isSubmitting && <LoaderCircle size={17} className="animate-spin" />}Khấu trừ</button></footer></form></div>, document.body);
};
