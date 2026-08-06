import type {
  ManagerScopeId,
} from "@/modules/manager-context";

export type QuotationApprovalStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export type QuotationPriority =
  | "URGENT"
  | "HIGH"
  | "NORMAL";

export type QuotationApprovalAction =
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";

export type RentalPriceUnit =
  | "HOUR"
  | "DAY"
  | "WEEK"
  | "MONTH";

export type DepositType =
  | "FIXED"
  | "PERCENTAGE";

export interface QuotationLineItem {
  id: string;
  equipmentTypeId: string;
  equipmentName: string;
  quantity: number;
  priceUnit: RentalPriceUnit;
  rentalDuration: number;
  unitPrice: number;
  subtotal: number;
}

export interface QuotationApprovalHistory {
  id: string;
  action: QuotationApprovalAction;
  actorId: string;
  actorName: string;
  note: string | null;
  createdAt: string;
}

export interface ManagerQuotation {
  id: string;
  organizationId: string;
  branchId: string;
  branchName: string;
  quotationCode: string;

  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;

  eventName: string;
  eventLocation: string;
  rentalStartDate: string;
  rentalEndDate: string;
  expiresAt: string;

  status: QuotationApprovalStatus;
  priority: QuotationPriority;

  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  taxAmount: number;

  depositType: DepositType;
  depositValue: number;
  depositAmount: number;

  totalAmount: number;

  createdById: string;
  createdByName: string;
  createdAt: string;
  note: string | null;

  lineItems: QuotationLineItem[];
  approvalHistory:
    QuotationApprovalHistory[];
}

export interface ManagerQuotationSummary {
  pendingCount: number;
  pendingValue: number;
  expiringSoonCount: number;
  processedCount: number;
}

export interface GetManagerQuotationsInput {
  organizationId: string;
  assignedBranchIds: string[];
  selectedScopeId: ManagerScopeId;
}

export interface ManagerQuotationListData {
  summary: ManagerQuotationSummary;
  quotations: ManagerQuotation[];
  generatedAt: string;
}

export interface ApproveManagerQuotationInput {
  quotationId: string;
  reviewerId: string;
  reviewerName: string;
  note?: string;
}

export interface RejectManagerQuotationInput {
  quotationId: string;
  reviewerId: string;
  reviewerName: string;
  reason: string;
}
