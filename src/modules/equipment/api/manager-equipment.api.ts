import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";
import type {
  GetManagerEquipmentInput, ManagerEquipment, ManagerEquipmentCondition,
  ManagerEquipmentListData, ManagerEquipmentStatus,
} from "@/modules/equipment/types/manager-equipment.types";

interface EquipmentDto {
  id: number; organizationId: number; branchId: number; warehouseId: number;
  modelId: number; assetCode: string; serialNumber: string | null;
  status: string; conditionStatus: string; note: string | null; updatedAt: string;
}
const uiStatus = (status: string): ManagerEquipmentStatus => {
  if (status === "AVAILABLE") return "AVAILABLE";
  if (status === "RESERVED") return "RESERVED";
  if (status === "MAINTENANCE" || status === "INSPECTION") return "MAINTENANCE";
  if (status === "DAMAGED" || status === "LOST" || status === "RETIRED") return "DAMAGED";
  return "RENTED";
};
const uiCondition = (condition: string): ManagerEquipmentCondition =>
  condition === "DAMAGED" || condition === "POOR"
    ? "DAMAGED" : condition === "FAIR" ? "NEEDS_INSPECTION" : "GOOD";
const toEquipment = (dto: EquipmentDto): ManagerEquipment => {
  const status = uiStatus(dto.status);
  return {
    id: String(dto.id), organizationId: String(dto.organizationId),
    branchId: String(dto.branchId), branchName: `Chi nhánh #${dto.branchId}`,
    equipmentCode: dto.assetCode, equipmentName: dto.serialNumber || `Thiết bị #${dto.id}`,
    categoryId: "", categoryName: "", warehouseId: String(dto.warehouseId),
    warehouseName: `Kho #${dto.warehouseId}`, status,
    condition: uiCondition(dto.conditionStatus), totalQuantity: 1,
    availableQuantity: status === "AVAILABLE" ? 1 : 0,
    rentedQuantity: status === "RENTED" ? 1 : 0,
    reservedQuantity: status === "RESERVED" ? 1 : 0,
    maintenanceQuantity: status === "MAINTENANCE" ? 1 : 0,
    damagedQuantity: status === "DAMAGED" ? 1 : 0,
    currentRentalCodes: [], lastMaintenanceAt: null, nextMaintenanceAt: null,
    note: dto.note, updatedAt: dto.updatedAt, maintenanceHistory: [],
  };
};
let lastItems: ManagerEquipment[] = [];
const summary = (items: ManagerEquipment[]) => ({
  totalQuantity: items.length,
  availableQuantity: items.reduce((sum, item) => sum + item.availableQuantity, 0),
  rentedQuantity: items.reduce((sum, item) => sum + item.rentedQuantity, 0),
  reservedQuantity: items.reduce((sum, item) => sum + item.reservedQuantity, 0),
  maintenanceQuantity: items.reduce((sum, item) => sum + item.maintenanceQuantity, 0),
  damagedQuantity: items.reduce((sum, item) => sum + item.damagedQuantity, 0),
  maintenanceDueCount: 0,
});

export const managerEquipmentApi = {
  async getList(input: GetManagerEquipmentInput): Promise<ManagerEquipmentListData> {
    const branchIds = input.selectedScopeId === "ALL"
      ? input.assignedBranchIds : [input.selectedScopeId];
    const groups = await Promise.all(branchIds.map((branchId) =>
      authenticatedRequest<EquipmentDto[]>(
        "GET",
        `/api/v1/inventory/equipment?organizationId=${Number(input.organizationId)}&branchId=${Number(branchId)}`,
      ),
    ));
    lastItems = groups.flat().map(toEquipment)
      .sort((a, b) => a.equipmentCode.localeCompare(b.equipmentCode));
    return { summary: summary(lastItems), equipment: lastItems, generatedAt: new Date().toISOString() };
  },
  async getById(equipmentId: string): Promise<ManagerEquipment> {
    const cached = lastItems.find((item) => item.id === equipmentId);
    if (!cached) throw new Error("Hãy tải danh sách thiết bị trước khi xem chi tiết.");
    const dto = await authenticatedRequest<EquipmentDto>(
      "GET",
      `/api/v1/inventory/equipment/${equipmentId}?organizationId=${Number(cached.organizationId)}`,
    );
    return toEquipment(dto);
  },
};
