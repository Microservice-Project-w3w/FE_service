import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import type { ApiEnvelope } from "@/modules/auth/types/auth.types";

export interface SalesRentalRequestItemDto {
    id: number;
    equipmentTypeId: number;
    quantity: number;
}

export interface SalesRentalRequestDto {
    id: number;
    organizationId: number;
    branchId: number;
    requestCode: string;
    customerId: number;
    startAt: string;
    endAt: string;
    deliveryAddress: string | null;
    note: string | null;
    status: "DRAFT" | "SUBMITTED" | "PROCESSING" | "QUOTED" | "REJECTED" | "CANCELLED";
    items: SalesRentalRequestItemDto[];
    createdAt: string;
}

const getForBranch = async (organizationId: number, branchId: number) => {
    const response = await authenticatedRequest<ApiEnvelope<SalesRentalRequestDto[]>>(
        "GET",
        `/api/v1/rental-requests?organizationId=${organizationId}&branchId=${branchId}`,
    );
    return response.data;
};

export const salesRentalWorkflowApi = {
    async getRequests(organizationId: number, branchIds: number[]) {
        const requests = await Promise.all(
            branchIds.map((branchId) => getForBranch(organizationId, branchId)),
        );
        return requests.flat().sort((left, right) => right.createdAt.localeCompare(left.createdAt));
    },

    async getRequest(id: string) {
        const response = await authenticatedRequest<ApiEnvelope<SalesRentalRequestDto>>(
            "GET",
            `/api/v1/rental-requests/${id}`,
        );
        return response.data;
    },
};
