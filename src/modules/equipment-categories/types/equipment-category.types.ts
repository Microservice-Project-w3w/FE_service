export type EquipmentCategoryStatus =
  | "ACTIVE"
  | "INACTIVE";

export type EquipmentCategoryIcon =
  | "AUDIO"
  | "LIGHTING"
  | "STAGE"
  | "POWER"
  | "VISUAL"
  | "OTHER";

export type EquipmentCategoryLevel =
  | "ROOT"
  | "CHILD";

export interface EquipmentCategory {
  id: string;
  organizationId: string;
  categoryCode: string;
  name: string;
  icon: EquipmentCategoryIcon;
  parentId: string | null;
  parentName: string | null;
  description: string;
  equipmentTypeCount: number;
  equipmentCount: number;
  status: EquipmentCategoryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentCategoryFilters {
  search: string;
  status:
    | EquipmentCategoryStatus
    | "ALL";
  level:
    | EquipmentCategoryLevel
    | "ALL";
}

export interface CreateEquipmentCategoryInput {
  organizationId: string;
  categoryCode: string;
  name: string;
  icon: EquipmentCategoryIcon;
  parentId: string | null;
  description: string;
}

export type UpdateEquipmentCategoryInput =
  CreateEquipmentCategoryInput;
