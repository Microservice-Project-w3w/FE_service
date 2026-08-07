import type {
  ManagerScopeId,
} from "@/modules/manager-context";

export type ManagerDeliveryTaskType =
  | "DELIVERY"
  | "RETURN";

export type ManagerDeliveryStatus =
  | "SCHEDULED"
  | "PREPARING"
  | "READY"
  | "IN_TRANSIT"
  | "ARRIVED"
  | "COMPLETED"
  | "DELAYED"
  | "CANCELLED";

export type ManagerDeliveryPriority =
  | "URGENT"
  | "HIGH"
  | "NORMAL";

export type DeliveryHandoverStatus =
  | "PENDING"
  | "CONFIRMED";

export type DeliveryEquipmentCondition =
  | "GOOD"
  | "DAMAGED"
  | "MISSING";

export type ManagerDeliveryHistoryAction =
  | "CREATED"
  | "ASSIGNED"
  | "PREPARING"
  | "READY"
  | "DEPARTED"
  | "ARRIVED"
  | "HANDOVER_CONFIRMED"
  | "RETURN_STARTED"
  | "RETURN_INSPECTED"
  | "COMPLETED"
  | "DELAYED"
  | "CANCELLED";

export interface ManagerDeliveryEquipmentItem {
  id: string;
  equipmentName: string;
  quantity: number;

  checkedQuantity: number;

  condition:
    DeliveryEquipmentCondition;

  issueNote: string | null;
}

export interface ManagerDeliveryHistory {
  id: string;

  action:
    ManagerDeliveryHistoryAction;

  actorId: string;
  actorName: string;

  note: string | null;

  createdAt: string;
}

export interface ManagerDeliveryTask {
  id: string;

  organizationId: string;

  branchId: string;
  branchName: string;

  taskCode: string;

  type:
    ManagerDeliveryTaskType;

  rentalId: string;
  rentalCode: string;

  contractId: string | null;
  contractCode: string | null;

  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;

  eventName: string;

  address: string;

  scheduledAt: string;

  startedAt: string | null;

  arrivedAt: string | null;

  completedAt: string | null;

  status:
    ManagerDeliveryStatus;

  priority:
    ManagerDeliveryPriority;

  assignedEmployeeId:
    string | null;

  assignedEmployeeName:
    string | null;

  assignedEmployeePhone:
    string | null;

  vehiclePlate:
    string | null;

  handoverStatus:
    DeliveryHandoverStatus;

  handoverPersonName:
    string | null;

  equipmentItemCount: number;

  totalEquipmentQuantity: number;

  issueCount: number;

  equipmentItems:
    ManagerDeliveryEquipmentItem[];

  note: string | null;

  createdAt: string;
  updatedAt: string;

  history:
    ManagerDeliveryHistory[];
}

export interface ManagerDeliverySummary {
  totalCount: number;

  scheduledTodayCount: number;

  inProgressCount: number;

  delayedCount: number;

  completedTodayCount: number;

  issueCount: number;
}

export interface GetManagerDeliveriesInput {
  organizationId: string;

  assignedBranchIds: string[];

  selectedScopeId:
    ManagerScopeId;
}

export interface ManagerDeliveryListData {
  summary:
    ManagerDeliverySummary;

  tasks:
    ManagerDeliveryTask[];

  generatedAt: string;
}
