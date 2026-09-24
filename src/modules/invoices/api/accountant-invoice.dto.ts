export interface InvoiceItemDto {
  id: number;
  itemType: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  referenceType: string | null;
  referenceId: number | null;
}

export interface InvoiceDto {
  id: number;
  organizationId: number;
  branchId: number;
  customerId: number;
  rentalOrderId: number;
  rentalContractId: number;
  invoiceType: string;
  status: string;
  subtotal: number;
  totalAmount: number;
  dueAt: string | null;
  items: InvoiceItemDto[];
}

export interface InvoicePaymentStatusDto {
  invoiceId: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentStatus: string;
}
