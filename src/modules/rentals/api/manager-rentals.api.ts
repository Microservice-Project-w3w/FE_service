import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import type { ApiEnvelope } from "@/modules/auth/types/auth.types";
import type {
  CancelManagerRentalInput, ConfirmRentalReservationInput, ExtendManagerRentalInput,
  GetManagerRentalsInput, ManagerRental, ManagerRentalListData, ManagerRentalStatus,
} from "@/modules/rentals/types/manager-rental.types";

interface RentalOrderDto {
  id: number; organizationId: number; branchId: number; orderCode: string;
  quotationId: number; customerId: number; startAt: string; endAt: string;
  totalAmount: number; status: "PENDING" | "RESERVED" | "CONFIRMED" | "CANCELLED" | "EXPIRED";
  reservedUntil: string | null; inventoryReservationId: string | null; cancelReason: string | null;
}
const statusMap: Record<RentalOrderDto["status"], ManagerRentalStatus> = {
  PENDING: "PENDING_CONFIRMATION", RESERVED: "RESERVED", CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED", EXPIRED: "CANCELLED",
};
const toRental = (dto: RentalOrderDto): ManagerRental => ({
  id: String(dto.id), organizationId: String(dto.organizationId), branchId: String(dto.branchId),
  branchName: `Chi nhánh #${dto.branchId}`, rentalCode: dto.orderCode,
  quotationId: String(dto.quotationId), quotationCode: `Báo giá #${dto.quotationId}`,
  contractId: null, contractCode: null, customerId: String(dto.customerId),
  customerName: `Khách hàng #${dto.customerId}`, customerPhone: "", customerEmail: "",
  eventName: "", eventLocation: "", rentalStartDate: dto.startAt, rentalEndDate: dto.endAt,
  expectedReturnDate: dto.endAt, actualReturnDate: null, status: statusMap[dto.status],
  priority: "NORMAL", reservationStatus: dto.inventoryReservationId
    ? "HELD" : dto.status === "CANCELLED" ? "RELEASED" : "PENDING",
  reservationExpiresAt: dto.reservedUntil, paymentStatus: "UNPAID",
  equipmentSubtotal: Number(dto.totalAmount), discountAmount: 0, deliveryFee: 0,
  lateFee: 0, taxAmount: 0, totalAmount: Number(dto.totalAmount),
  depositAmount: 0, paidAmount: 0,
  outstandingAmount: dto.status === "CANCELLED" ? 0 : Number(dto.totalAmount),
  deliveryRequired: false, extensionCount: 0, createdById: "", createdByName: "",
  createdAt: dto.startAt, note: dto.cancelReason, equipmentItems: [], history: [],
});
const load = async (organizationId: string, branchId: string): Promise<ManagerRental[]> => {
  const response = await authenticatedRequest<ApiEnvelope<RentalOrderDto[]>>(
    "GET", `/api/v1/rental-orders?organizationId=${Number(organizationId)}&branchId=${Number(branchId)}`,
  );
  return response.data.map(toRental);
};
const summary = (rentals: ManagerRental[]) => {
  const today = new Date().toISOString().slice(0, 10);
  return {
    totalCount: rentals.length,
    activeCount: rentals.filter((item) =>
      ["RESERVED", "CONFIRMED", "ACTIVE", "OVERDUE", "RETURNING"].includes(item.status),
    ).length,
    overdueCount: rentals.filter((item) => item.status === "OVERDUE").length,
    dueTodayCount: rentals.filter((item) =>
      item.expectedReturnDate.slice(0, 10) === today &&
      item.status !== "COMPLETED" && item.status !== "CANCELLED",
    ).length,
    outstandingAmount: rentals.reduce((sum, item) => sum + item.outstandingAmount, 0),
  };
};

export const managerRentalsApi = {
  async getList(input: GetManagerRentalsInput): Promise<ManagerRentalListData> {
    const branches = input.selectedScopeId === "ALL"
      ? input.assignedBranchIds : [input.selectedScopeId];
    const rentals = (await Promise.all(
      branches.map((branchId) => load(input.organizationId, branchId)),
    )).flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return { summary: summary(rentals), rentals, generatedAt: new Date().toISOString() };
  },
  async getById(_rentalId: string): Promise<ManagerRental> {
    throw new Error("Backend chưa có API lấy rental order theo ID.");
  },
  async confirmReservation(input: ConfirmRentalReservationInput): Promise<ManagerRental> {
    const response = await authenticatedRequest<ApiEnvelope<RentalOrderDto>>(
      "PATCH", `/api/v1/rental-orders/${input.rentalId}/reserve`,
      { body: { reservedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() } },
    );
    return toRental(response.data);
  },
  async extend(_input: ExtendManagerRentalInput): Promise<ManagerRental> {
    throw new Error("Backend chỉ hỗ trợ gia hạn hợp đồng, chưa hỗ trợ gia hạn rental order.");
  },
  async cancel(input: CancelManagerRentalInput): Promise<ManagerRental> {
    if (!input.reason.trim()) throw new Error("Bắt buộc nhập lý do hủy đơn thuê.");
    const response = await authenticatedRequest<ApiEnvelope<RentalOrderDto>>(
      "PATCH", `/api/v1/rental-orders/${input.rentalId}/cancel`,
      { body: { reason: input.reason.trim() } },
    );
    return toRental(response.data);
  },
  async resetMockData(): Promise<void> {
    throw new Error("Khôi phục dữ liệu mẫu đã bị vô hiệu hóa.");
  },
};
