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

export interface SalesQuotationDto {
    id: number;
    organizationId: number;
    branchId: number;
    quotationCode: string;
    rentalRequestId: number;
    customerId: number;
    rentalAmount: number;
    depositAmount: number;
    deliveryFee: number;
    discountAmount: number;
    totalAmount: number;
    discountCode: string | null;
    status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "SENT" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "CONVERTED" | "CANCELLED";
    validUntil: string;
    specialTerms: string | null;
}

export interface SalesRentalOrderDto {
    id: number;
    organizationId: number;
    branchId: number;
    orderCode: string;
    quotationId: number;
    customerId: number;
    startAt: string;
    endAt: string;
    totalAmount: number;
    status: "PENDING" | "RESERVED" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
    reservedUntil: string | null;
    inventoryReservationId: string | null;
    cancelReason: string | null;
}

export interface SalesContractDto {
    id: number;
    organizationId: number;
    branchId: number;
    contractCode: string;
    rentalOrderId: number;
    customerId: number;
    startAt: string;
    endAt: string;
    totalAmount: number;
    status: "PENDING_APPROVAL" | "APPROVED" | "SIGNED" | "ACTIVE" | "EXTENDED" | "LIQUIDATED" | "CANCELLED";
    terms: string | null;
    approvedAt: string | null;
    signedAt: string | null;
}

const loadScoped = async <T>(
    path: string,
    organizationId: number,
    branchIds: number[],
): Promise<T[]> => {
    const groups = await Promise.all(branchIds.map(async (branchId) => {
        const separator = path.includes("?") ? "&" : "?";
        const response = await authenticatedRequest<ApiEnvelope<T[]>>(
            "GET",
            `${path}${separator}organizationId=${organizationId}&branchId=${branchId}`,
        );
        return response.data;
    }));
    return groups.flat();
};

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

    getQuotations(organizationId: number, branchIds: number[]) {
        return loadScoped<SalesQuotationDto>("/api/v1/quotations", organizationId, branchIds);
    },

    async createQuotation(input: {
        rentalRequestId: number; rentalAmount: number; depositAmount: number;
        deliveryFee: number; discountCode?: string; validUntil: string; specialTerms?: string;
    }) {
        const response = await authenticatedRequest<ApiEnvelope<SalesQuotationDto>>(
            "POST", "/api/v1/quotations", { body: input },
        );
        return response.data;
    },

    async sendQuotation(id: number) {
        const response = await authenticatedRequest<ApiEnvelope<SalesQuotationDto>>(
            "PATCH", `/api/v1/quotations/${id}/send`,
        );
        return response.data;
    },

    async convertQuotationToOrder(id: number) {
        const response = await authenticatedRequest<ApiEnvelope<SalesRentalOrderDto>>(
            "POST", `/api/v1/quotations/${id}/convert-to-order`,
        );
        return response.data;
    },

    getOrders(organizationId: number, branchIds: number[]) {
        return loadScoped<SalesRentalOrderDto>("/api/v1/rental-orders", organizationId, branchIds);
    },

    getContracts(organizationId: number, branchIds: number[]) {
        return loadScoped<SalesContractDto>("/api/v1/rental-contracts", organizationId, branchIds);
    },

    async getContract(id: number) {
        const response = await authenticatedRequest<ApiEnvelope<SalesContractDto>>(
            "GET", `/api/v1/rental-contracts/${id}`,
        );
        return response.data;
    },

    async createContract(rentalOrderId: number, terms?: string) {
        const response = await authenticatedRequest<ApiEnvelope<SalesContractDto>>(
            "POST", "/api/v1/rental-contracts", { body: { rentalOrderId, terms } },
        );
        return response.data;
    },
};
