import { useCallback, useEffect, useMemo, useState } from "react";
import { accountantPaymentsApi } from "@/modules/payments/api/accountant-payments.api";
import type { AccountantDeposit, AccountantDepositListData, AccountantDepositStatus } from "@/modules/payments/types/accountant-payment.types";

const PAGE_SIZE = 5;
const emptyData: AccountantDepositListData = { deposits: [], summary: { totalDeposit: 0, heldAmount: 0, refundableAmount: 0, refundedAmount: 0 } };
export const useAccountantDeposits = () => {
  const [data, setData] = useState(emptyData); const [search, setSearch] = useState(""); const [status, setStatus] = useState<"ALL" | AccountantDepositStatus>("ALL"); const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AccountantDeposit | null>(null); const [refundTarget, setRefundTarget] = useState<AccountantDeposit | null>(null);
  const [loading, setLoading] = useState(true); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState<string | null>(null); const [success, setSuccess] = useState<string | null>(null);
  const load = useCallback(async () => { setLoading(true); setError(null); try { setData(await accountantPaymentsApi.getDeposits()); } catch (caught) { setData(emptyData); setError(caught instanceof Error ? caught.message : "Không thể tải dữ liệu tiền cọc."); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); }, [load]);
  const filtered = useMemo(() => { const term = search.trim().toLowerCase(); return data.deposits.filter((item) => (!term || `${item.id} ${item.invoiceCode} ${item.customerName} ${item.rentalCode}`.toLowerCase().includes(term)) && (status === "ALL" || item.status === status)); }, [data.deposits, search, status]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)); const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
  useEffect(() => setPage(1), [search, status]); useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);
  const refund = async () => { if (!refundTarget) return; setSubmitting(true); setError(null); try { await accountantPaymentsApi.refundDeposit(refundTarget.id); setRefundTarget(null); setSelected(null); setSuccess("Đã ghi nhận hoàn toàn bộ số tiền cọc còn giữ."); await load(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Không thể hoàn cọc."); } finally { setSubmitting(false); } };
  const reset = () => { setSearch(""); setStatus("ALL"); };
  return { data, search, status, page, selected, refundTarget, loading, submitting, error, success, filtered, paginated, totalPages, setSearch, setStatus, setPage, setSelected, setRefundTarget, setSuccess, load, refund, reset };
};
