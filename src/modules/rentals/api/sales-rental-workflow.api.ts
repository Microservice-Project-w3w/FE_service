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
  status:
    "DRAFT" | "SUBMITTED" | "PROCESSING" | "QUOTED" | "REJECTED" | "CANCELLED";
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
  status:
    | "DRAFT"
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "SENT"
    | "ACCEPTED"
    | "REJECTED"
    | "EXPIRED"
    | "CONVERTED"
    | "CANCELLED";
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
  status:
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "REJECTED"
    | "SIGNED"
    | "ACTIVE"
    | "EXTENDED"
    | "LIQUIDATED"
    | "CANCELLED";
  terms: string | null;
  approvedAt: string | null;
  signedAt: string | null;
}

const loadScoped = async <T>(
  path: string,
  organizationId: number,
  branchIds: number[],
): Promise<T[]> => {
  const groups = await Promise.all(
    branchIds.map(async (branchId) => {
      const separator = path.includes("?") ? "&" : "?";
      const response = await authenticatedRequest<ApiEnvelope<T[]>>(
        "GET",
        `${path}${separator}organizationId=${organizationId}&branchId=${branchId}`,
      );
      return response.data;
    }),
  );
  return groups.flat();
};

const getForBranch = async (organizationId: number, branchId: number) => {
  const response = await authenticatedRequest<
    ApiEnvelope<SalesRentalRequestDto[]>
  >(
    "GET",
    `/api/v1/rental-requests?organizationId=${organizationId}&branchId=${branchId}`,
  );
  return response.data;
};

export const salesRentalWorkflowApi = {
  async recordAcceptance(id: number) {
    return (
      await authenticatedRequest<ApiEnvelope<SalesQuotationDto>>(
        "PATCH",
        `/api/v1/quotations/${id}/record-acceptance`,
        { body: { customerConfirmed: true } },
      )
    ).data;
  },
  async recordSignature(id: number, appendix = false) {
    return (
      await authenticatedRequest<ApiEnvelope<unknown>>(
        "PATCH",
        `/api/v1/rental-contracts/${appendix ? "appendices/" : ""}${id}/record-signature`,
        { body: { customerConfirmed: true } },
      )
    ).data;
  },
  async getQuotation(id: string) {
    return (
      await authenticatedRequest<ApiEnvelope<SalesQuotationDto>>(
        "GET",
        `/api/v1/quotations/${id}`,
      )
    ).data;
  },
  async getOrder(id: string) {
    return (
      await authenticatedRequest<ApiEnvelope<SalesRentalOrderDto>>(
        "GET",
        `/api/v1/rental-orders/${id}`,
      )
    ).data;
  },
  async acceptQuotation(id: number) {
    return (
      await authenticatedRequest<ApiEnvelope<SalesQuotationDto>>(
        "PATCH",
        `/api/v1/quotations/${id}/accept`,
      )
    ).data;
  },
  async reserveOrder(id: number) {
    const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
    // The backend uses LocalDateTime, not a UTC timestamp ending in Z.
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 19);
    return (
      await authenticatedRequest<ApiEnvelope<SalesRentalOrderDto>>(
        "PATCH",
        `/api/v1/rental-orders/${id}/reserve`,
        { body: { reservedUntil: local } },
      )
    ).data;
  },
  async confirmOrder(id: number) {
    return (
      await authenticatedRequest<ApiEnvelope<SalesRentalOrderDto>>(
        "PATCH",
        `/api/v1/rental-orders/${id}/confirm`,
      )
    ).data;
  },
  async cancelOrder(id: number, reason: string) {
    if (!reason.trim()) throw new Error("Cần nhập lý do hủy.");
    return (
      await authenticatedRequest<ApiEnvelope<SalesRentalOrderDto>>(
        "PATCH",
        `/api/v1/rental-orders/${id}/cancel`,
        { body: { reason: reason.trim() } },
      )
    ).data;
  },
  async signContract(id: number) {
    return (
      await authenticatedRequest<ApiEnvelope<SalesContractDto>>(
        "PATCH",
        `/api/v1/rental-contracts/${id}/sign`,
      )
    ).data;
  },
  async extendContract(id: number, newEndAt: string, terms: string) {
    if (!newEndAt || !terms.trim())
      throw new Error("Cần nhập ngày kết thúc và điều khoản gia hạn.");
    return (
      await authenticatedRequest<ApiEnvelope<ContractAppendixDto>>(
        "POST",
        `/api/v1/rental-contracts/${id}/extensions`,
        { body: { newEndAt, terms: terms.trim() } },
      )
    ).data;
  },
  async getAppendices(id: number) {
    return (
      await authenticatedRequest<ApiEnvelope<ContractAppendixDto[]>>(
        "GET",
        `/api/v1/rental-contracts/${id}/appendices`,
      )
    ).data;
  },
  async appendixAction(id: number, action: "approve" | "sign") {
    return (
      await authenticatedRequest<ApiEnvelope<ContractAppendixDto>>(
        "PATCH",
        `/api/v1/rental-contracts/appendices/${id}/${action}`,
      )
    ).data;
  },
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
    return requests
      .flat()
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  },

  async getRequest(id: string) {
    const response = await authenticatedRequest<
      ApiEnvelope<SalesRentalRequestDto>
    >("GET", `/api/v1/rental-requests/${id}`);
    return response.data;
  },

  async createRequest(input: CreateSalesRentalRequestInput) {
    const response = await authenticatedRequest<
      ApiEnvelope<SalesRentalRequestDto>
    >("POST", "/api/v1/rental-requests", { body: input });
    return response.data;
  },

  getQuotations(organizationId: number, branchIds: number[]) {
    return loadScoped<SalesQuotationDto>(
      "/api/v1/quotations",
      organizationId,
      branchIds,
    );
  },

  async createQuotation(input: {
    rentalRequestId: number;
    rentalAmount: number;
    depositAmount: number;
    deliveryFee: number;
    discountCode?: string;
    validUntil: string;
    specialTerms?: string;
  }) {
    const response = await authenticatedRequest<ApiEnvelope<SalesQuotationDto>>(
      "POST",
      "/api/v1/quotations",
      { body: input },
    );
    return response.data;
  },

  async sendQuotation(id: number) {
    const response = await authenticatedRequest<ApiEnvelope<SalesQuotationDto>>(
      "PATCH",
      `/api/v1/quotations/${id}/send`,
    );
    return response.data;
  },

  async convertQuotationToOrder(id: number) {
    const response = await authenticatedRequest<
      ApiEnvelope<SalesRentalOrderDto>
    >("POST", `/api/v1/quotations/${id}/convert-to-order`);
    return response.data;
  },

  getOrders(organizationId: number, branchIds: number[]) {
    return loadScoped<SalesRentalOrderDto>(
      "/api/v1/rental-orders",
      organizationId,
      branchIds,
    );
  },

  getContracts(organizationId: number, branchIds: number[]) {
    return loadScoped<SalesContractDto>(
      "/api/v1/rental-contracts",
      organizationId,
      branchIds,
    );
  },

  async getContract(id: number) {
    const response = await authenticatedRequest<ApiEnvelope<SalesContractDto>>(
      "GET",
      `/api/v1/rental-contracts/${id}`,
    );
    return response.data;
  },

  async createContract(rentalOrderId: number, terms?: string) {
    const response = await authenticatedRequest<ApiEnvelope<SalesContractDto>>(
      "POST",
      "/api/v1/rental-contracts",
      { body: { rentalOrderId, terms } },
    );
    return response.data;
  },
};

export interface ContractAppendixDto {
  id: number;
  appendixCode: string;
  status: string;
  newEndAt: string;
  terms: string;
}
