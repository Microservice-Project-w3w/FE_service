import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import type { ApiEnvelope } from "@/modules/auth/types/auth.types";
import type {
  ApproveManagerQuotationInput, GetManagerQuotationsInput, ManagerQuotation,
  ManagerQuotationListData, QuotationApprovalStatus, RejectManagerQuotationInput,
} from "@/modules/quotations/types/manager-quotation-approval.types";

interface QuotationDto {
  id: number; organizationId: number; branchId: number; quotationCode: string;
  rentalRequestId: number; customerId: number; rentalAmount: number; depositAmount: number;
  deliveryFee: number; discountAmount: number; totalAmount: number;
  status: string; validUntil: string; specialTerms: string | null;
}
const supportedStatuses = new Set(["PENDING_APPROVAL", "APPROVED", "REJECTED", "EXPIRED"]);
const toQuotation = (dto: QuotationDto): ManagerQuotation => ({
  id: String(dto.id), organizationId: String(dto.organizationId), branchId: String(dto.branchId),
  branchName: `Chi nhánh #${dto.branchId}`, quotationCode: dto.quotationCode,
  customerId: String(dto.customerId), customerName: `Khách hàng #${dto.customerId}`,
  customerPhone: "", customerEmail: "", eventName: `Yêu cầu thuê #${dto.rentalRequestId}`,
  eventLocation: "", rentalStartDate: "", rentalEndDate: "", expiresAt: dto.validUntil,
  status: dto.status as QuotationApprovalStatus, priority: "NORMAL",
  subtotal: Number(dto.rentalAmount), discountAmount: Number(dto.discountAmount),
  deliveryFee: Number(dto.deliveryFee), taxAmount: 0, depositType: "FIXED",
  depositValue: Number(dto.depositAmount), depositAmount: Number(dto.depositAmount),
  totalAmount: Number(dto.totalAmount), createdById: "", createdByName: "",
  createdAt: dto.validUntil, note: dto.specialTerms, lineItems: [], approvalHistory: [],
});
const getBranches = (input: GetManagerQuotationsInput): string[] =>
  input.selectedScopeId === "ALL" ? input.assignedBranchIds : [input.selectedScopeId];
const load = async (organizationId: string, branchId: string): Promise<ManagerQuotation[]> => {
  const response = await authenticatedRequest<ApiEnvelope<QuotationDto[]>>(
    "GET", `/api/v1/quotations?organizationId=${Number(organizationId)}&branchId=${Number(branchId)}`,
  );
  return response.data.filter((dto) => supportedStatuses.has(dto.status)).map(toQuotation);
};

export const managerQuotationApprovalsApi = {
  async getList(input: GetManagerQuotationsInput): Promise<ManagerQuotationListData> {
    const quotations = (await Promise.all(
      getBranches(input).map((branchId) => load(input.organizationId, branchId)),
    )).flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const pending = quotations.filter((item) => item.status === "PENDING_APPROVAL");
    const soon = Date.now() + 48 * 60 * 60 * 1000;
    return {
      summary: {
        pendingCount: pending.length,
        pendingValue: pending.reduce((sum, item) => sum + item.totalAmount, 0),
        expiringSoonCount: pending.filter((item) => new Date(item.expiresAt).getTime() <= soon).length,
        processedCount: quotations.filter((item) =>
          item.status === "APPROVED" || item.status === "REJECTED",
        ).length,
      },
      quotations, generatedAt: new Date().toISOString(),
    };
  },
  async getById(quotationId: string): Promise<ManagerQuotation> {
    const response = await authenticatedRequest<ApiEnvelope<QuotationDto>>(
      "GET", `/api/v1/quotations/${quotationId}`,
    );
    return toQuotation(response.data);
  },
  async approve(input: ApproveManagerQuotationInput): Promise<ManagerQuotation> {
    const response = await authenticatedRequest<ApiEnvelope<QuotationDto>>(
      "PATCH", `/api/v1/quotations/${input.quotationId}/approve`,
    );
    return toQuotation(response.data);
  },
  async reject(input: RejectManagerQuotationInput): Promise<ManagerQuotation> {
    if (!input.reason.trim()) throw new Error("Vui lòng nhập lý do từ chối báo giá.");
    const response = await authenticatedRequest<ApiEnvelope<QuotationDto>>(
      "PATCH", `/api/v1/quotations/${input.quotationId}/reject`,
      { body: { reason: input.reason.trim() } },
    );
    return toQuotation(response.data);
  },
  resetMockData(): void {
    throw new Error("Khôi phục dữ liệu mẫu đã bị vô hiệu hóa.");
  },
};
