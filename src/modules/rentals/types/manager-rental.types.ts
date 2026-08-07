import type {
  ManagerScopeId,
} from "@/modules/manager-context";

export type ManagerRentalStatus =
  | "PENDING_CONFIRMATION"
  | "RESERVED"
  | "CONFIRMED"
  | "ACTIVE"
  | "OVERDUE"
  | "RETURNING"
  | "COMPLETED"
  | "CANCELLED";

export type ManagerRentalPriority =
  | "URGENT"
  | "HIGH"
  | "NORMAL";

export type RentalPaymentStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE";

export type RentalReservationStatus =
  | "NOT_REQUIRED"
  | "PENDING"
  | "HELD"
  | "RELEASED"
  | "EXPIRED";

export type ManagerRentalHistoryAction =
  | "CREATED"
  | "RESERVED"
  | "CONFIRMED"
  | "STARTED"
  | "EXTENDED"
  | "RETURN_REQUESTED"
  | "COMPLETED"
  | "CANCELLED";

export interface ManagerRentalEquipmentItem {
  id: string;
  equipmentTypeId: string;
  equipmentName: string;
  requestedQuantity: number;
  allocatedQuantity: number;
  deliveredQuantity: number;
  unitPrice: number;
  rentalDays: number;
  subtotal: number;
}

export interface ManagerRentalHistory {
  id: string;
  action: ManagerRentalHistoryAction;
  actorId: string;
  actorName: string;
  note: string | null;
  createdAt: string;
}

export interface ManagerRental {
  id: string;
  organizationId: string;
  branchId: string;
  branchName: string;

  rentalCode: string;
  quotationId: string;
  quotationCode: string;
  contractId: string | null;
  contractCode: string | null;

  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;

  eventName: string;
  eventLocation: string;

  rentalStartDate: string;
  rentalEndDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;

  status: ManagerRentalStatus;
  priority: ManagerRentalPriority;

  reservationStatus:
    RentalReservationStatus;

  reservationExpiresAt:
    string | null;

  paymentStatus:
    RentalPaymentStatus;

  equipmentSubtotal: number;
  discountAmount: number;
  deliveryFee: number;
  lateFee: number;
  taxAmount: number;
  totalAmount: number;

  depositAmount: number;
  paidAmount: number;
  outstandingAmount: number;

  deliveryRequired: boolean;
  extensionCount: number;

  createdById: string;
  createdByName: string;
  createdAt: string;
  note: string | null;

  equipmentItems:
    ManagerRentalEquipmentItem[];

  history:
    ManagerRentalHistory[];
}

export interface ManagerRentalSummary {
  totalCount: number;
  activeCount: number;
  overdueCount: number;
  dueTodayCount: number;
  outstandingAmount: number;
}

export interface GetManagerRentalsInput {
  organizationId: string;
  assignedBranchIds: string[];
  selectedScopeId: ManagerScopeId;
}

export interface ManagerRentalListData {
  summary: ManagerRentalSummary;
  rentals: ManagerRental[];
  generatedAt: string;
}

export interface CancelManagerRentalInput {
  rentalId: string;
  actorId: string;
  actorName: string;
  reason: string;
}

export interface ExtendManagerRentalInput {
  rentalId: string;
  actorId: string;
  actorName: string;
  newEndDate: string;
  note?: string;
}

export interface ConfirmRentalReservationInput {
  rentalId: string;
  actorId: string;
  actorName: string;
  note?: string;
}
