import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import type { ApiEnvelope } from "@/modules/auth/types/auth.types";
import type {
  ApproveManagerContractInput, ContractApprovalStatus, GetManagerContractsInput,
  ManagerContract, ManagerContractListData, RejectManagerContractInput,
} from "@/modules/contracts/types/manager-contract-approval.types";

interface ContractDto {
  id: number; organizationId: number; branchId: number; contractCode: string;
  rentalOrderId: number; customerId: number; startAt: string; endAt: string;
  totalAmount: number; status: string; terms: string | null;
  approvedAt: string | null; signedAt: string | null;
}
const statuses = new Set(["PENDING_APPROVAL", "APPROVED", "SIGNED"]);
const toContract = (dto: ContractDto): ManagerContract => ({
  id: String(dto.id), organizationId: String(dto.organizationId), branchId: String(dto.branchId),
  branchName: `Chi nhánh #${dto.branchId}`, contractCode: dto.contractCode,
  quotationId: "", quotationCode: "", rentalRequestId: "", rentalRequestCode: "",
  customerId: String(dto.customerId), customerName: `Khách hàng #${dto.customerId}`,
  customerPhone: "", customerEmail: "", customerAddress: "", customerTaxCode: null,
  eventName: `Đơn thuê #${dto.rentalOrderId}`, eventLocation: "",
  rentalStartDate: dto.startAt, rentalEndDate: dto.endAt, approvalDeadline: dto.startAt,
  status: dto.status as ContractApprovalStatus, priority: "NORMAL",
  equipmentSubtotal: Number(dto.totalAmount), discountAmount: 0, deliveryFee: 0, taxAmount: 0,
  totalContractValue: Number(dto.totalAmount), depositAmount: 0,
  remainingAmount: Number(dto.totalAmount), lateFeePerDay: 0,
  cancellationPolicy: "", damageCompensationPolicy: "", createdById: "", createdByName: "",
  createdAt: dto.approvedAt ?? dto.startAt, note: dto.terms,
  equipmentItems: [], paymentSchedule: [], clauses: [], appendices: [], approvalHistory: [],
});
const load = async (organizationId: string, branchId: string): Promise<ManagerContract[]> => {
  const response = await authenticatedRequest<ApiEnvelope<ContractDto[]>>(
    "GET", `/api/v1/rental-contracts?organizationId=${Number(organizationId)}&branchId=${Number(branchId)}`,
  );
  return response.data.filter((dto) => statuses.has(dto.status)).map(toContract);
};

export const managerContractApprovalsApi = {
  async getList(input: GetManagerContractsInput): Promise<ManagerContractListData> {
    const branchIds = input.selectedScopeId === "ALL"
      ? input.assignedBranchIds : [input.selectedScopeId];
    const contracts = (await Promise.all(
      branchIds.map((branchId) => load(input.organizationId, branchId)),
    )).flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const pending = contracts.filter((item) => item.status === "PENDING_APPROVAL");
    const soon = Date.now() + 48 * 60 * 60 * 1000;
    return {
      summary: {
        pendingCount: pending.length,
        pendingValue: pending.reduce((sum, item) => sum + item.totalContractValue, 0),
        expiringSoonCount: pending.filter((item) =>
          new Date(item.approvalDeadline).getTime() <= soon,
        ).length,
        processedCount: contracts.filter((item) =>
          item.status === "APPROVED" || item.status === "SIGNED",
        ).length,
      },
      contracts, generatedAt: new Date().toISOString(),
    };
  },
  async getById(contractId: string): Promise<ManagerContract> {
    const response = await authenticatedRequest<ApiEnvelope<ContractDto>>(
      "GET", `/api/v1/rental-contracts/${contractId}`,
    );
    return toContract(response.data);
  },
  async approve(input: ApproveManagerContractInput): Promise<ManagerContract> {
    const response = await authenticatedRequest<ApiEnvelope<ContractDto>>(
      "PATCH", `/api/v1/rental-contracts/${input.contractId}/approve`,
    );
    return toContract(response.data);
  },
  async reject(_input: RejectManagerContractInput): Promise<ManagerContract> {
    throw new Error("Backend không có transition từ chối hợp đồng; thao tác không được thực hiện.");
  },
  resetMockData(): void {
    throw new Error("Khôi phục dữ liệu mẫu đã bị vô hiệu hóa.");
  },
};
