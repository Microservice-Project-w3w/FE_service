import { useCallback, useEffect, useMemo, useState } from "react";
import { accountantInvoicesApi, type AccountantInvoice } from "@/modules/invoices";
import { accountantPaymentsApi, type RecordAccountantPaymentInput } from "@/modules/payments";
import { accountantReceivablesApi } from "@/modules/receivables/api/accountant-receivables.api";
import type { AccountantReceivableStatusFilter } from "@/modules/receivables/components/AccountantReceivableFilters";
import type { AccountantReceivable, AccountantReceivableDueFilter, AccountantReceivableListData } from "@/modules/receivables/types/accountant-receivable.types";

const PAGE_SIZE = 5; const emptyData: AccountantReceivableListData = { receivables: [], summary: { totalAmount: 0, paidAmount: 0, outstandingAmount: 0, overdueAmount: 0, dueSoonAmount: 0 } };
export const useAccountantReceivables = () => {
  const [data, setData] = useState(emptyData); const [selected, setSelected] = useState<AccountantReceivable | null>(null); const [paymentTarget, setPaymentTarget] = useState<AccountantReceivable | null>(null); const [invoices, setInvoices] = useState<AccountantInvoice[]>([]);
  const [search, setSearch] = useState(""); const [branchId, setBranchId] = useState("ALL"); const [customerId, setCustomerId] = useState("ALL"); const [status, setStatus] = useState<AccountantReceivableStatusFilter>("ALL"); const [due, setDue] = useState<AccountantReceivableDueFilter>("ALL"); const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); const [detailLoading, setDetailLoading] = useState(false); const [submitting, setSubmitting] = useState(false); const [error, setError] = useState<string | null>(null); const [success, setSuccess] = useState<string | null>(null);
  const load = useCallback(async () => { setLoading(true); setError(null); try { const [receivableData, invoiceData] = await Promise.all([accountantReceivablesApi.getList(), accountantInvoicesApi.getList()]); setData(receivableData); setInvoices(invoiceData.invoices); } catch (caught) { setData(emptyData); setInvoices([]); setError(caught instanceof Error ? caught.message : "Không thể tải dữ liệu công nợ."); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); }, [load]);
  const branches = useMemo(() => Array.from(new Map(data.receivables.map((i) => [i.branchId, { id: i.branchId, name: i.branchName }])).values()), [data.receivables]);
  const customers = useMemo(() => Array.from(new Map(data.receivables.map((i) => [i.customerId, { id: i.customerId, name: i.customerName }])).values()), [data.receivables]);
  const filtered = useMemo(() => { const term = search.trim().toLowerCase(); const now = new Date(); const soon = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); return data.receivables.filter((i) => {
    const matchesDue = due === "ALL" || (due === "OVERDUE" && i.status === "OVERDUE") || (due === "CURRENT" && i.status !== "OVERDUE" && i.status !== "PAID") || (due === "DUE_SOON" && i.status !== "OVERDUE" && i.status !== "PAID" && new Date(i.dueDate) >= now && new Date(i.dueDate) <= soon);
    return (!term || `${i.receivableCode} ${i.invoiceCode} ${i.rentalCode} ${i.customerName}`.toLowerCase().includes(term)) && (branchId === "ALL" || i.branchId === branchId) && (customerId === "ALL" || i.customerId === customerId) && (status === "ALL" || i.status === status) && matchesDue;
  }); }, [branchId, customerId, data.receivables, due, search, status]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)); const paginated = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
  useEffect(() => setPage(1), [branchId, customerId, due, search, status]); useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);
  const payableInvoices = invoices.filter((i) =>
    !["DRAFT", "PAID", "CANCELLED"].includes(i.status) && i.remainingAmount > 0,
  );
  const view = useCallback(async (item: AccountantReceivable) => { setSelected(item); setDetailLoading(true); try { setSelected(await accountantReceivablesApi.getById(item.id)); } catch (caught) { setError(caught instanceof Error ? caught.message : "Không thể tải chi tiết công nợ."); } finally { setDetailLoading(false); } }, []);
  const record = async (input: RecordAccountantPaymentInput) => { setSubmitting(true); setError(null); try { await accountantPaymentsApi.record(input); setPaymentTarget(null); setSelected(null); setSuccess("Đã ghi nhận thanh toán; công nợ và hóa đơn đã cập nhật."); await load(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Không thể ghi nhận thanh toán."); } finally { setSubmitting(false); } };
  const reset = () => { setSearch(""); setBranchId("ALL"); setCustomerId("ALL"); setStatus("ALL"); setDue("ALL"); };
  return { data, selected, paymentTarget, search, branchId, customerId, status, due, page, loading, detailLoading, submitting, error, success, branches, customers, filtered, paginated, totalPages, payableInvoices,
    setSelected, setPaymentTarget, setSearch, setBranchId, setCustomerId, setStatus, setDue, setPage, setSuccess, load, view, record, reset };
};
