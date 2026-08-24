export interface CancelInvoiceRequestDto {
  reason: string;
}

export interface CreateInvoiceItemRequestDto {
  itemType: string;
  description: string;
  quantity: number;
  unitPrice: number;
  referenceType?: string;
  referenceId?: number;
}

export interface CreateInvoiceRequestDto {
  organizationId: number;
  branchId: number;
  customerId: number;
  rentalOrderId: number;
  rentalContractId: number;
  invoiceType: string;
  dueAt: string;
  items: CreateInvoiceItemRequestDto[];
}
