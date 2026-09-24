import type {
  AccountantInvoice,
  AccountantInvoicePayment,
  AccountantInvoiceStatus,
} from "@/modules/invoices/types/accountant-invoice.types";

type InvoiceSeed = Omit<
  AccountantInvoice,
  "id" | "customerPhone" | "customerEmail" | "contractCode" | "createdAt" | "updatedAt" | "lines" | "payments"
> & {
  payment?: Pick<AccountantInvoicePayment, "amount" | "method" | "referenceCode" | "paidAt" | "note">;
};

const customers: Record<string, { phone: string; email: string }> = {
  "Công ty TNHH Sự kiện Sao Việt": { phone: "0903123456", email: "saovietevent@gmail.com" },
  "Công ty CP Truyền thông Ánh Dương": { phone: "0912345678", email: "anhduongmedia@gmail.com" },
  "Công ty TNHH Giáo dục Hướng Dương": { phone: "0988123456", email: "huongduongedu@gmail.com" },
  "Công ty CP Công nghệ Nova": { phone: "0938123456", email: "novaevent@gmail.com" },
  "Công ty TNHH Tổ chức Sự kiện Sài Thành": { phone: "0909123456", email: "saithanhevent@gmail.com" },
  "Trường Đại học Kinh tế TP.HCM": { phone: "02838295299", email: "event@ueh.edu.vn" },
  "Công ty TNHH Du lịch Biển Xanh": { phone: "0905123456", email: "bienxanhtravel@gmail.com" },
  "Công ty CP Xây dựng Miền Trung": { phone: "0915123456", email: "mientrungconstruction@gmail.com" },
  "Công ty TNHH Nội thất Thành Công": { phone: "0903555777", email: "ketoan@thanhcong.vn" },
};

const makeInvoice = (seed: InvoiceSeed): AccountantInvoice => {
  const id = seed.invoiceCode.toLowerCase();
  const customer = customers[seed.customerName];
  const createdAt = seed.issuedAt ?? "2026-08-13T08:00:00+07:00";
  const payment = seed.payment
    ? [{
        id: `payment-${id}-01`,
        invoiceId: id,
        ...seed.payment,
        recordedBy: "Phạm Thị Kế Toán",
        status: "SUCCESS" as const,
      }]
    : [];

  return {
    ...seed,
    id,
    customerPhone: customer.phone,
    customerEmail: customer.email,
    contractCode: seed.rentalCode.replace("DT-", "HD-"),
    createdAt,
    updatedAt: seed.payment?.paidAt ?? createdAt,
    lines: [{
      id: `line-${id}-01`,
      description: `Dịch vụ thuê thiết bị theo ${seed.rentalCode}`,
      quantity: 1,
      unitPrice: seed.subtotal,
      amount: seed.subtotal,
    }],
    payments: payment,
  };
};

const seeds: InvoiceSeed[] = [
  { invoiceCode: "INV-HN-0081", branchId: "branch-hanoi", branchName: "Chi nhánh Hà Nội", customerId: "customer-hn-002", customerName: "Công ty TNHH Sự kiện Sao Việt", rentalId: "rental-hn-00081", rentalCode: "DT-HN-2026-0081", issuedAt: "2026-08-01T09:00:00+07:00", dueDate: "2026-08-18T23:59:59+07:00", subtotal: 25_000_000, depositAmount: 3_000_000, taxAmount: 2_470_000, discountAmount: 0, totalAmount: 30_470_000, paidAmount: 18_000_000, remainingAmount: 12_470_000, status: "PARTIALLY_PAID", note: "Thu phần còn lại trước hạn.", payment: { amount: 18_000_000, method: "BANK_TRANSFER", referenceCode: "VCB-HN-0805-018", paidAt: "2026-08-05T10:15:00+07:00", note: "Thanh toán đợt 1." } },
  { invoiceCode: "INV-HN-0079", branchId: "branch-hanoi", branchName: "Chi nhánh Hà Nội", customerId: "customer-hn-004", customerName: "Công ty CP Truyền thông Ánh Dương", rentalId: "rental-hn-00079", rentalCode: "DT-HN-2026-0079", issuedAt: "2026-07-29T08:30:00+07:00", dueDate: "2026-08-05T23:59:59+07:00", subtotal: 19_000_000, depositAmount: 2_000_000, taxAmount: 1_770_000, discountAmount: 0, totalAmount: 22_770_000, paidAmount: 10_000_000, remainingAmount: 12_770_000, status: "OVERDUE", note: "Đã quá hạn, cần ưu tiên xử lý.", payment: { amount: 10_000_000, method: "BANK_TRANSFER", referenceCode: "BIDV-HN-0802-010", paidAt: "2026-08-02T14:20:00+07:00", note: "Thanh toán một phần." } },
  { invoiceCode: "INV-HN-0082", branchId: "branch-hanoi", branchName: "Chi nhánh Hà Nội", customerId: "customer-hn-006", customerName: "Công ty TNHH Giáo dục Hướng Dương", rentalId: "rental-hn-00082", rentalCode: "DT-HN-2026-0082", issuedAt: "2026-08-06T11:20:00+07:00", dueDate: "2026-08-20T23:59:59+07:00", subtotal: 12_000_000, depositAmount: 2_000_000, taxAmount: 1_290_000, discountAmount: 0, totalAmount: 15_290_000, paidAmount: 5_000_000, remainingAmount: 10_290_000, status: "PARTIALLY_PAID", note: "Đã thu tiền giữ chỗ.", payment: { amount: 5_000_000, method: "CASH", referenceCode: "PT-HN-0806-005", paidAt: "2026-08-06T16:00:00+07:00", note: "Tiền giữ chỗ." } },
  { invoiceCode: "INV-HCM-0047", branchId: "branch-hcm", branchName: "Chi nhánh TP. Hồ Chí Minh", customerId: "customer-hcm-003", customerName: "Công ty CP Công nghệ Nova", rentalId: "rental-hcm-00047", rentalCode: "DT-HCM-2026-0047", issuedAt: "2026-08-07T09:00:00+07:00", dueDate: "2026-08-22T23:59:59+07:00", subtotal: 34_000_000, depositAmount: 3_500_000, taxAmount: 3_200_000, discountAmount: 0, totalAmount: 40_700_000, paidAmount: 0, remainingAmount: 40_700_000, status: "UNPAID", note: "Chờ thanh toán lần đầu." },
  { invoiceCode: "INV-HCM-0045", branchId: "branch-hcm", branchName: "Chi nhánh TP. Hồ Chí Minh", customerId: "customer-hcm-001", customerName: "Công ty TNHH Tổ chức Sự kiện Sài Thành", rentalId: "rental-hcm-00045", rentalCode: "DT-HCM-2026-0045", issuedAt: "2026-08-04T10:00:00+07:00", dueDate: "2026-08-10T23:59:59+07:00", subtotal: 54_000_000, depositAmount: 4_000_000, taxAmount: 5_250_000, discountAmount: 0, totalAmount: 63_250_000, paidAmount: 30_000_000, remainingAmount: 33_250_000, status: "OVERDUE", note: "Khoản còn lại đã quá hạn.", payment: { amount: 30_000_000, method: "BANK_TRANSFER", referenceCode: "ACB-HCM-0805-030", paidAt: "2026-08-05T13:30:00+07:00", note: "Thanh toán đợt 1." } },
  { invoiceCode: "INV-HCM-0043", branchId: "branch-hcm", branchName: "Chi nhánh TP. Hồ Chí Minh", customerId: "customer-hcm-005", customerName: "Trường Đại học Kinh tế TP.HCM", rentalId: "rental-hcm-00043", rentalCode: "DT-HCM-2026-0043", issuedAt: "2026-08-01T08:00:00+07:00", dueDate: "2026-08-12T23:59:59+07:00", subtotal: 14_000_000, depositAmount: 2_000_000, taxAmount: 1_380_000, discountAmount: 0, totalAmount: 17_380_000, paidAmount: 17_380_000, remainingAmount: 0, status: "PAID", note: "Đã thanh toán đầy đủ.", payment: { amount: 17_380_000, method: "BANK_TRANSFER", referenceCode: "VCB-HCM-0807-017", paidAt: "2026-08-07T08:00:00+07:00", note: "Thanh toán toàn bộ." } },
  { invoiceCode: "INV-DN-0021", branchId: "branch-danang", branchName: "Chi nhánh Đà Nẵng", customerId: "customer-dn-001", customerName: "Công ty TNHH Du lịch Biển Xanh", rentalId: "rental-dn-00021", rentalCode: "DT-DN-2026-0021", issuedAt: "2026-08-03T09:30:00+07:00", dueDate: "2026-08-08T23:59:59+07:00", subtotal: 23_000_000, depositAmount: 1_500_000, taxAmount: 2_450_000, discountAmount: 0, totalAmount: 26_950_000, paidAmount: 15_000_000, remainingAmount: 11_950_000, status: "OVERDUE", note: "Cần đối chiếu khoản còn lại.", payment: { amount: 15_000_000, method: "BANK_TRANSFER", referenceCode: "MB-DN-0804-015", paidAt: "2026-08-04T11:00:00+07:00", note: "Thanh toán đợt 1." } },
  { invoiceCode: "INV-DN-0019", branchId: "branch-danang", branchName: "Chi nhánh Đà Nẵng", customerId: "customer-dn-004", customerName: "Công ty CP Xây dựng Miền Trung", rentalId: "rental-dn-00019", rentalCode: "DT-DN-2026-0019", issuedAt: "2026-07-25T09:00:00+07:00", dueDate: "2026-07-28T23:59:59+07:00", subtotal: 10_000_000, depositAmount: 1_000_000, taxAmount: 1_100_000, discountAmount: 0, totalAmount: 12_100_000, paidAmount: 12_100_000, remainingAmount: 0, status: "PAID", note: "Đã tất toán.", payment: { amount: 12_100_000, method: "CARD", referenceCode: "POS-DN-0728-012", paidAt: "2026-07-28T16:30:00+07:00", note: "Thanh toán toàn bộ." } },
  { invoiceCode: "INV-HN-0083", branchId: "branch-hanoi", branchName: "Chi nhánh Hà Nội", customerId: "customer-hn-009", customerName: "Công ty TNHH Nội thất Thành Công", rentalId: "rental-hn-00083", rentalCode: "DT-HN-2026-0083", issuedAt: null, dueDate: "2026-08-28T23:59:59+07:00", subtotal: 8_000_000, depositAmount: 0, taxAmount: 800_000, discountAmount: 0, totalAmount: 8_800_000, paidAmount: 0, remainingAmount: 8_800_000, status: "DRAFT", note: "Chờ kiểm tra trước khi phát hành." },
];

export const cloneAccountantInvoiceMocks = (): AccountantInvoice[] =>
  seeds.map(makeInvoice);

export const invoiceStatusAfterPayment = (
  invoice: AccountantInvoice,
): AccountantInvoiceStatus => {
  if (invoice.remainingAmount === 0) return "PAID";
  if (new Date(invoice.dueDate) < new Date("2026-08-13T23:59:59+07:00")) return "OVERDUE";
  return invoice.paidAmount > 0 ? "PARTIALLY_PAID" : "UNPAID";
};
