import type {
  ManagerScopeId,
} from "@/modules/manager-context";

export type ManagerEquipmentStatus =
  | "AVAILABLE"
  | "RENTED"
  | "RESERVED"
  | "MAINTENANCE"
  | "DAMAGED";

export type ManagerEquipmentCondition =
  | "GOOD"
  | "NEEDS_INSPECTION"
  | "DAMAGED";

export type ManagerMaintenanceStatus =
  | "COMPLETED"
  | "SCHEDULED"
  | "OVERDUE";

export interface ManagerEquipmentMaintenanceRecord {
  id: string;

  status:
    ManagerMaintenanceStatus;

  performedAt: string | null;

  scheduledAt: string;

  technicianName: string | null;

  description: string;

  note: string | null;
}

export interface ManagerEquipment {
  id: string;

  organizationId: string;

  branchId: string;
  branchName: string;

  equipmentCode: string;
  equipmentName: string;

  categoryId: string;
  categoryName: string;

  warehouseId: string;
  warehouseName: string;

  status:
    ManagerEquipmentStatus;

  condition:
    ManagerEquipmentCondition;

  totalQuantity: number;

  availableQuantity: number;

  rentedQuantity: number;

  reservedQuantity: number;

  maintenanceQuantity: number;

  damagedQuantity: number;

  currentRentalCodes: string[];

  lastMaintenanceAt:
    string | null;

  nextMaintenanceAt:
    string | null;

  note: string | null;

  updatedAt: string;

  maintenanceHistory:
    ManagerEquipmentMaintenanceRecord[];
}

export interface ManagerEquipmentSummary {
  totalQuantity: number;

  availableQuantity: number;

  rentedQuantity: number;

  reservedQuantity: number;

  maintenanceQuantity: number;

  damagedQuantity: number;

  maintenanceDueCount: number;
}

export interface GetManagerEquipmentInput {
  organizationId: string;

  assignedBranchIds: string[];

  selectedScopeId:
    ManagerScopeId;
}

export interface ManagerEquipmentListData {
  summary:
    ManagerEquipmentSummary;

  equipment:
    ManagerEquipment[];

  generatedAt: string;
}
