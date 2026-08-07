import type {
  ManagerScopeId,
} from "@/modules/manager-context";

export type ManagerReceivableStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE";

export type ManagerReceivablePriority =
  | "URGENT"
  | "HIGH"
  | "NORMAL";

export type ManagerPaymentMethod =
  | "BANK_TRANSFER"
  | "CASH"
  | "CARD";

export interface ManagerPaymentTransaction {
  id: string;

  amount: number;

  method:
    ManagerPaymentMethod;

  referenceCode:
    string | null;

  note: string | null;

  paidAt: string;
}

export interface ManagerReceivable {
  id: string;

  organizationId: string;

  branchId: string;
  branchName: string;

  receivableCode: string;
  invoiceCode: string;

  rentalId: string;
  rentalCode: string;

  contractId: string | null;
  contractCode: string | null;

  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;

  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;

  dueDate: string;

  status:
    ManagerReceivableStatus;

  priority:
    ManagerReceivablePriority;

  lastPaymentAt:
    string | null;

  note: string | null;

  createdAt: string;
  updatedAt: string;

  transactions:
    ManagerPaymentTransaction[];
}

export interface ManagerReceivableSummary {
  totalBilledAmount: number;

  paidAmount: number;

  outstandingAmount: number;

  overdueAmount: number;

  dueSoonAmount: number;

  overdueCount: number;
}

export interface GetManagerReceivablesInput {
  organizationId: string;

  assignedBranchIds: string[];

  selectedScopeId:
    ManagerScopeId;
}

export interface ManagerReceivableListData {
  summary:
    ManagerReceivableSummary;

  receivables:
    ManagerReceivable[];

  generatedAt: string;
}
