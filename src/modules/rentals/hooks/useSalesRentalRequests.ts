import { useCallback, useEffect, useState } from "react";

import { useAuthStore } from "@/modules/auth/store/auth.store";
import {
    salesRentalWorkflowApi,
    type SalesRentalRequestDto,
} from "@/modules/rentals/api/sales-rental-workflow.api";

export const useSalesRentalRequests = () => {
    const user = useAuthStore((state) => state.user);
    const [requests, setRequests] = useState<SalesRentalRequestDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const reload = useCallback(async () => {
        if (!user?.organizationId || user.branchIds.length === 0) {
            setRequests([]);
            setError("Tài khoản chưa có organization/branch scope trong JWT.");
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            setRequests(await salesRentalWorkflowApi.getRequests(
                user.organizationId,
                user.branchIds,
            ));
        } catch (requestError) {
            setError(requestError instanceof Error
                ? requestError.message
                : "Không thể tải yêu cầu thuê từ backend.");
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        void reload();
    }, [reload]);

    return { requests, error, isLoading, reload };
};
