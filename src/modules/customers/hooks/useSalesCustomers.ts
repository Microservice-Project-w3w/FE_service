import { useEffect, useState } from "react";
import { salesCustomersApi } from "@/modules/customers/api/sales-customers.api";
import type { SalesCustomerItem } from "@/modules/customers/types/sales-customer.types";
export const useSalesCustomers = (organizationId?: number, branchIds: number[] = []) => {
  const [customers, setCustomers] = useState<SalesCustomerItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const branchKey = branchIds.join(",");
  useEffect(() => {
    let active = true;
    if (!organizationId || !branchKey) {
      setCustomers([]); setError("Tài khoản Sales chưa có organization/branch scope.");
      setIsLoading(false); return () => { active = false; };
    }
    setIsLoading(true); setError(null);
    const scopedBranchIds = branchKey.split(",").filter(Boolean).map(Number);
    salesCustomersApi.list(organizationId, scopedBranchIds)
      .then((data) => { if (active) setCustomers(data); })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : "Không thể tải khách hàng.");
      })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [organizationId, branchKey]);
  return { customers, isLoading, error };
};
