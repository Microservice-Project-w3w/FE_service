import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuthStore } from "@/modules/auth";
import { accountantInvoicesApi } from "@/modules/invoices/api/accountant-invoices.api";
import type {
  AccountantInvoiceStatusFilter,
} from "@/modules/invoices/components/AccountantInvoiceFilters";
import type {
  AccountantInvoice,
  AccountantInvoiceListData,
  RecordInvoicePaymentInput,
} from "@/modules/invoices/types/accountant-invoice.types";

export const ACCOUNTANT_INVOICE_PAGE_SIZE = 5;

const emptyData: AccountantInvoiceListData = {
  invoices: [],
  summary: {
    totalInvoices: 0,
    unpaidCount: 0,
    partiallyPaidCount: 0,
    paidCount: 0,
    overdueCount: 0,
    outstandingAmount: 0,
  },
};

export const useAccountantInvoices = () => {
  const user = useAuthStore((state) => state.user);
  const [data, setData] = useState<AccountantInvoiceListData>(emptyData);
  const [selectedInvoice, setSelectedInvoice] = useState<AccountantInvoice | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<AccountantInvoice | null>(null);
  const [actionTarget, setActionTarget] = useState<{ invoice: AccountantInvoice; action: "ISSUE" | "CANCEL" } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchId, setBranchId] = useState("ALL");
  const [status, setStatus] = useState<AccountantInvoiceStatusFilter>("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      setData(await accountantInvoicesApi.getList());
    } catch (error) {
      setData(emptyData);
      setErrorMessage(error instanceof Error ? error.message : "Không thể tải danh sách hóa đơn.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void loadInvoices(); }, [loadInvoices]);

  const branches = useMemo(() => Array.from(
    new Map(data.invoices.map((invoice) => [invoice.branchId, { id: invoice.branchId, name: invoice.branchName }])).values(),
  ), [data.invoices]);

  const filteredInvoices = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return data.invoices.filter((invoice) => {
      const searchable = `${invoice.invoiceCode} ${invoice.customerName} ${invoice.rentalCode}`.toLowerCase();
      const invoiceDate = (invoice.issuedAt ?? invoice.createdAt).slice(0, 10);
      return (!search || searchable.includes(search))
        && (branchId === "ALL" || invoice.branchId === branchId)
        && (status === "ALL" || invoice.status === status)
        && (!fromDate || invoiceDate >= fromDate)
        && (!toDate || invoiceDate <= toDate);
    });
  }, [branchId, data.invoices, fromDate, searchTerm, status, toDate]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / ACCOUNTANT_INVOICE_PAGE_SIZE));
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * ACCOUNTANT_INVOICE_PAGE_SIZE;
    return filteredInvoices.slice(start, start + ACCOUNTANT_INVOICE_PAGE_SIZE);
  }, [currentPage, filteredInvoices]);

  useEffect(() => setCurrentPage(1), [branchId, fromDate, searchTerm, status, toDate]);
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const viewInvoice = useCallback(async (invoice: AccountantInvoice) => {
    setSelectedInvoice(invoice);
    setIsDetailLoading(true);
    try {
      setSelectedInvoice(await accountantInvoicesApi.getById(invoice.id));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể tải chi tiết hóa đơn.");
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const recordPayment = async (input: RecordInvoicePaymentInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await accountantInvoicesApi.recordPayment(input);
      setPaymentInvoice(null);
      setSuccessMessage("Đã ghi nhận thanh toán và cập nhật số dư hóa đơn.");
      await loadInvoices();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể ghi nhận thanh toán.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmAction = async () => {
    if (!actionTarget) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      if (actionTarget.action === "ISSUE") await accountantInvoicesApi.issue(actionTarget.invoice.id);
      else await accountantInvoicesApi.cancel(actionTarget.invoice.id);
      setSuccessMessage(actionTarget.action === "ISSUE" ? "Hóa đơn đã được phát hành." : "Hóa đơn đã được hủy.");
      setActionTarget(null);
      setSelectedInvoice(null);
      await loadInvoices();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể cập nhật hóa đơn.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportInvoices = () => {
    const rows = filteredInvoices.map((invoice) => [invoice.invoiceCode, invoice.customerName, invoice.rentalCode, invoice.totalAmount, invoice.paidAmount, invoice.remainingAmount, invoice.status]);
    const csv = [["Mã hóa đơn", "Khách hàng", "Đơn thuê", "Tổng tiền", "Đã thu", "Còn lại", "Trạng thái"], ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "danh-sach-hoa-don.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearchTerm(""); setBranchId("ALL"); setStatus("ALL"); setFromDate(""); setToDate("");
  };

  return {
    user, data, branches, filteredInvoices, paginatedInvoices, totalPages,
    selectedInvoice, paymentInvoice, actionTarget, searchTerm, branchId, status, fromDate, toDate,
    currentPage, isLoading, isDetailLoading, isSubmitting, errorMessage, successMessage,
    setSearchTerm, setBranchId, setStatus, setFromDate, setToDate, setCurrentPage,
    setSelectedInvoice, setPaymentInvoice, setActionTarget, setSuccessMessage,
    loadInvoices, viewInvoice, recordPayment, confirmAction, exportInvoices, resetFilters,
  };
};
