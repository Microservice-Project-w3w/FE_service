import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";

export interface InventoryEquipment {
  id: number;
  organizationId: number;
  branchId: number;
  warehouseId: number | null;
  modelId: number;
  assetCode: string;
  serialNumber: string | null;
  imei: string | null;
  macAddress: string | null;
  warehouseLocationId: number | null;
  status: string;
  conditionStatus: string;
  note: string | null;
  purchasePrice: number | null;
  purchaseDate: string | null;
}
export interface InventoryWarehouse {
  id: number;
  organizationId: number;
  branchId: number;
  code: string;
  name: string;
  address: string | null;
  active: boolean;
}
export interface InventoryModel {
  id: number;
  code: string;
  name: string;
}
export interface InventoryAuditItem {
  equipmentId: number;
  result: string | null;
}
export interface InventoryDocument {
  id: number;
  status: string;
  stockInCode?: string;
  stockOutCode?: string;
  transferCode?: string;
  auditCode?: string;
  warehouseId?: number;
  sourceWarehouseId?: number;
  destinationWarehouseId?: number;
  items: InventoryAuditItem[];
}
export type InventoryDocumentKind =
  "stock-in" | "stock-out" | "transfers" | "stock-audits";
export type EquipmentPayload = {
  organizationId: number;
  branchId: number;
  warehouseId: number | null;
  modelId: number;
  assetCode: string;
  serialNumber: string | null;
  conditionStatus: string;
  note: string | null;
};
const base = "/api/v1/inventory";
export const operationsInventoryApi = {
  loadEquipment(org: number, branch: number) {
    return authenticatedRequest<InventoryEquipment[]>(
      "GET",
      `${base}/equipment?organizationId=${org}&branchId=${branch}`,
    );
  },
  loadWarehouses(org: number) {
    return authenticatedRequest<InventoryWarehouse[]>(
      "GET",
      `${base}/warehouses?organizationId=${org}`,
    );
  },
  loadModels(org: number) {
    return authenticatedRequest<InventoryModel[]>(
      "GET",
      `${base}/models?organizationId=${org}`,
    );
  },
  documents(kind: InventoryDocumentKind, org: number, branch: number) {
    return authenticatedRequest<InventoryDocument[]>(
      "GET",
      `${base}/${kind}?organizationId=${org}&branchId=${branch}`,
    );
  },
  saveEquipment(payload: EquipmentPayload, id?: number) {
    return authenticatedRequest<InventoryEquipment>(
      id ? "PUT" : "POST",
      `${base}/equipment${id ? `/${id}?organizationId=${payload.organizationId}` : ""}`,
      { body: payload },
    );
  },
  changeStatus(id: number, org: number, status: string) {
    return authenticatedRequest<InventoryEquipment>(
      "PATCH",
      `${base}/equipment/${id}/status?organizationId=${org}`,
      { body: { status } },
    );
  },
  saveWarehouse(
    payload: {
      organizationId: number;
      branchId: number;
      code: string;
      name: string;
      address: string;
    },
    id?: number,
  ) {
    return authenticatedRequest<InventoryWarehouse>(
      id ? "PUT" : "POST",
      `${base}/warehouses${id ? `/${id}` : ""}`,
      { body: payload },
    );
  },
  setWarehouseActive(id: number, active: boolean) {
    return authenticatedRequest<InventoryWarehouse>(
      "PATCH",
      `${base}/warehouses/${id}/active?active=${active}`,
    );
  },
  createDocument(kind: InventoryDocumentKind, body: Record<string, unknown>) {
    return authenticatedRequest<InventoryDocument>("POST", `${base}/${kind}`, {
      body,
    });
  },
  documentAction(
    kind: InventoryDocumentKind,
    id: number,
    action: string,
    body: Record<string, unknown> = {},
  ) {
    return authenticatedRequest<InventoryDocument>(
      "POST",
      `${base}/${kind}/${id}/${action}`,
      { body },
    );
  },
};
