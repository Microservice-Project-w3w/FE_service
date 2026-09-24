import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/modules/auth";
import { accountantPaymentsApi } from "@/modules/payments/api/accountant-payments.api";
import type { AccountantPaymentMethodFilter, AccountantPaymentStatusFilter } from "@/modules/payments/components/AccountantPaymentFilters";
import type {
  AccountantPayment,
  AccountantPaymentListData,
  RecordAccountantPaymentInput,
  UpdateAccountantPaymentInput,
} from "@/modules/payments/types/accountant-payment.types";

export const ACCOUNTANT_PAYMENT_PAGE_SIZE = 5;
const emptyData: AccountantPaymentListData = { payments: [], payableInvoices: [], summary: { collectedAmount: 0, collectedToday: 0, successCount: 0, pendingCount: 0, failedOrVoidedCount: 0 } };

export const useAccountantPayments = () => {
  const user = useAuthStore((state) => state.user);
  const [data, setData] = useState<AccountantPaymentListData>(emptyData);
  const [selectedPayment, setSelectedPayment] = useState<AccountantPayment | null>(null);
  const [editPayment, setEditPayment] = useState<AccountantPayment | null>(null);
  const [voidPayment, setVoidPayment] = useState<AccountantPayment | null>(null);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); const [branchId, setBranchId] = useState("ALL");
  const [method, setMethod] = useState<AccountantPaymentMethodFilter>("ALL"); const [status, setStatus] = useState<AccountantPaymentStatusFilter>("ALL");
  const [fromDate, setFromDate] = useState(""); const [toDate, setToDate] = useState(""); const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); const [isDetailLoading, setIsDetailLoading] = useState(false); const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    setIsLoading(true); setErrorMessage(null);
    try { setData(await accountantPaymentsApi.getList()); }
    catch (error) { setData(emptyData); setErrorMessage(error instanceof Error ? error.message : "Không thể tải danh sách thanh toán."); }
    finally { setIsLoading(false); }
  }, []);
  useEffect(() => { void loadPayments(); }, [loadPayments]);

  const branches = useMemo(() => Array.from(new Map(data.payments.map((payment) => [payment.branchId, { id: payment.branchId, name: payment.branchName }])).values()), [data.payments]);
  const filteredPayments = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return data.payments.filter((payment) => {
      const searchable = `${payment.id} ${payment.invoiceCode} ${payment.customerName} ${payment.referenceCode ?? ""}`.toLowerCase();
      const date = payment.paidAt.slice(0, 10);
      return (!search || searchable.includes(search)) && (branchId === "ALL" || payment.branchId === branchId)
        && (method === "ALL" || payment.method === method) && (status === "ALL" || payment.status === status)
        && (!fromDate || date >= fromDate) && (!toDate || date <= toDate);
    });
  }, [branchId, data.payments, fromDate, method, searchTerm, status, toDate]);
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / ACCOUNTANT_PAYMENT_PAGE_SIZE));
  const paginatedPayments = useMemo(() => { const start = (currentPage - 1) * ACCOUNTANT_PAYMENT_PAGE_SIZE; return filteredPayments.slice(start, start + ACCOUNTANT_PAYMENT_PAGE_SIZE); }, [currentPage, filteredPayments]);
  useEffect(() => setCurrentPage(1), [branchId, fromDate, method, searchTerm, status, toDate]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  const viewPayment = useCallback(async (payment: AccountantPayment) => {
    setSelectedPayment(payment); setIsDetailLoading(true);
    try { setSelectedPayment(await accountantPaymentsApi.getById(payment.id)); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : "Không thể tải chi tiết thanh toán."); }
    finally { setIsDetailLoading(false); }
  }, []);
  const record = async (input: RecordAccountantPaymentInput) => {
    setIsSubmitting(true); setErrorMessage(null);
    try { await accountantPaymentsApi.record(input); setRecordDialogOpen(false); setSuccessMessage("Đã ghi nhận khoản thu; hóa đơn và công nợ đã cập nhật số dư."); await loadPayments(); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : "Không thể ghi nhận thanh toán."); }
    finally { setIsSubmitting(false); }
  };
  const update = async (input: UpdateAccountantPaymentInput) => {
    setIsSubmitting(true); setErrorMessage(null);
    try { await accountantPaymentsApi.update(input); setEditPayment(null); setSelectedPayment(null); setSuccessMessage("Đã cập nhật mã tham chiếu và ghi chú."); await loadPayments(); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : "Không thể cập nhật thanh toán."); }
    finally { setIsSubmitting(false); }
  };
  const confirmVoid = async () => {
    if (!voidPayment) return;
    setIsSubmitting(true); setErrorMessage(null);
    try { await accountantPaymentsApi.voidPayment(voidPayment.id); setVoidPayment(null); setSelectedPayment(null); setSuccessMessage("Đã hủy giao dịch và hoàn nguyên số dư hóa đơn."); await loadPayments(); }
    catch (error) { setErrorMessage(error instanceof Error ? error.message : "Không thể hủy giao dịch."); }
    finally { setIsSubmitting(false); }
  };
  const resetFilters = () => { setSearchTerm(""); setBranchId("ALL"); setMethod("ALL"); setStatus("ALL"); setFromDate(""); setToDate(""); };

  return { user, data, branches, filteredPayments, paginatedPayments, totalPages, selectedPayment, editPayment, voidPayment, recordDialogOpen,
    searchTerm, branchId, method, status, fromDate, toDate, currentPage, isLoading, isDetailLoading, isSubmitting, errorMessage, successMessage,
    setSelectedPayment, setEditPayment, setVoidPayment, setRecordDialogOpen, setSearchTerm, setBranchId, setMethod, setStatus, setFromDate, setToDate, setCurrentPage, setSuccessMessage,
    loadPayments, viewPayment, record, update, confirmVoid, resetFilters };
};
