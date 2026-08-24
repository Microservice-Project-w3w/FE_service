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

export interface CreateSalesRentalRequestInput {
    organizationId: number;
    branchId: number;
    customerId: number;
    startAt: string;
    endAt: string;
    deliveryAddress?: string;
    note?: string;
    items: Array<{ equipmentTypeId: number; quantity: number }>;
}

export interface SalesEquipmentTypeDto {
    id: number;
    organizationId: number;
    categoryId: number;
    code: string;
    name: string;
    description: string | null;
    active: boolean;
}

const getForBranch = async (organizationId: number, branchId: number) => {
    const response = await authenticatedRequest<ApiEnvelope<SalesRentalRequestDto[]>>(
        "GET",
        `/api/v1/rental-requests?organizationId=${organizationId}&branchId=${branchId}`,
    );
    return response.data;
};

export const salesRentalWorkflowApi = {
    async getEquipmentTypes(organizationId: number) {
        return authenticatedRequest<SalesEquipmentTypeDto[]>(
            "GET",
            `/api/v1/inventory/equipment-types?organizationId=${organizationId}`,
        );
    },

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

    async createRequest(input: CreateSalesRentalRequestInput) {
        const response = await authenticatedRequest<ApiEnvelope<SalesRentalRequestDto>>(
            "POST",
            "/api/v1/rental-requests",
            { body: input },
        );
        return response.data;
    },
};
