import type {
  ManagerScopeId,
} from "@/modules/manager-context";

export type ContractApprovalStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "SIGNED"
  | "EXPIRED";

export type ContractPriority =
  | "URGENT"
  | "HIGH"
  | "NORMAL";

export type ContractApprovalAction =
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "SIGNED";

export type PaymentMilestoneStatus =
  | "PENDING"
  | "PAID"
  | "OVERDUE";

export interface ContractEquipmentItem {
  id: string;
  equipmentTypeId: string;
  equipmentName: string;
  quantity: number;
  rentalDays: number;
  unitPrice: number;
  subtotal: number;
}

export interface ContractPaymentMilestone {
  id: string;
  name: string;
  dueDate: string;
  amount: number;
  percentage: number;
  status: PaymentMilestoneStatus;
}

export interface ContractClause {
  id: string;
  title: string;
  content: string;
  required: boolean;
}

export interface ContractAppendix {
  id: string;
  code: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface ContractApprovalHistory {
  id: string;
  action: ContractApprovalAction;
  actorId: string;
  actorName: string;
  note: string | null;
  createdAt: string;
}

export interface ManagerContract {
  id: string;
  organizationId: string;
  branchId: string;
  branchName: string;

  contractCode: string;
  quotationId: string;
  quotationCode: string;
  rentalRequestId: string;
  rentalRequestCode: string;

  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerTaxCode: string | null;

  eventName: string;
  eventLocation: string;
  rentalStartDate: string;
  rentalEndDate: string;
  approvalDeadline: string;

  status: ContractApprovalStatus;
  priority: ContractPriority;

  equipmentSubtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;
  totalContractValue: number;

  depositAmount: number;
  remainingAmount: number;
  lateFeePerDay: number;

  cancellationPolicy: string;
  damageCompensationPolicy: string;

  createdById: string;
  createdByName: string;
  createdAt: string;
  note: string | null;

  equipmentItems: ContractEquipmentItem[];
  paymentSchedule: ContractPaymentMilestone[];
  clauses: ContractClause[];
  appendices: ContractAppendix[];
  approvalHistory: ContractApprovalHistory[];
}

export interface ManagerContractSummary {
  pendingCount: number;
  pendingValue: number;
  expiringSoonCount: number;
  processedCount: number;
}

export interface GetManagerContractsInput {
  organizationId: string;
  assignedBranchIds: string[];
  selectedScopeId: ManagerScopeId;
}

export interface ManagerContractListData {
  summary: ManagerContractSummary;
  contracts: ManagerContract[];
  generatedAt: string;
}

export interface ApproveManagerContractInput {
  contractId: string;
  reviewerId: string;
  reviewerName: string;
  note?: string;
}

export interface RejectManagerContractInput {
  contractId: string;
  reviewerId: string;
  reviewerName: string;
  reason: string;
}
