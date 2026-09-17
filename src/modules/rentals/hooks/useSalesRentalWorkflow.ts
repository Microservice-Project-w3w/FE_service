import { useCallback, useEffect, useState } from "react";

import { useAuthStore } from "@/modules/auth/store/auth.store";
import {
    salesRentalWorkflowApi,
    type SalesContractDto,
    type SalesQuotationDto,
    type SalesRentalOrderDto,
} from "@/modules/rentals/api/sales-rental-workflow.api";

type WorkflowData = {
    quotations: SalesQuotationDto[];
    orders: SalesRentalOrderDto[];
    contracts: SalesContractDto[];
};

const emptyData: WorkflowData = { quotations: [], orders: [], contracts: [] };

export const useSalesRentalWorkflow = () => {
    const user = useAuthStore((state) => state.user);
    const [data, setData] = useState<WorkflowData>(emptyData);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const reload = useCallback(async () => {
        if (!user?.organizationId || user.branchIds.length === 0) {
            setData(emptyData);
            setError("Tài khoản chưa có organization/branch scope trong JWT.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const [quotations, orders, contracts] = await Promise.all([
                salesRentalWorkflowApi.getQuotations(user.organizationId, user.branchIds),
                salesRentalWorkflowApi.getOrders(user.organizationId, user.branchIds),
                salesRentalWorkflowApi.getContracts(user.organizationId, user.branchIds),
            ]);
            setData({ quotations, orders, contracts });
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Không thể tải Sales workflow.");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => { void reload(); }, [reload]);

    return { ...data, isLoading, error, reload };
};
