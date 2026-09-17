import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth";
import {
  getInvoiceReferences,
  type InvoiceReferences,
} from "@/modules/invoices/api/accountant-invoice-reference.api";

const empty: InvoiceReferences = { branches: [], customers: [], orders: [], contracts: [] };

export const useAccountantInvoiceReferences = (enabled: boolean) => {
  const user = useAuthStore((state) => state.user);
  const [data, setData] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const load = useCallback(async () => {
    if (!enabled) return;
    if (!user?.organizationId || user.branchIds.length === 0) {
      setError("Tài khoản chưa có phạm vi tổ chức/chi nhánh hợp lệ.");
      return;
    }
    setLoading(true); setError(null);
    try { setData(await getInvoiceReferences(user.organizationId, user.branchIds)); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Không thể tải dữ liệu tham chiếu."); }
    finally { setLoading(false); }
  }, [enabled, user]);
  useEffect(() => { void load(); }, [load]);
  return { data, loading, error, organizationId: user?.organizationId, reload: load };
};
