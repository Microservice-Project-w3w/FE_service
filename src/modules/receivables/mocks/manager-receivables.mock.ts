import type {
  ManagerReceivable,
} from "@/modules/receivables/types/manager-receivable.types";

export const MANAGER_RECEIVABLE_BRANCH_IDS = {
  HANOI: "branch-hanoi",
  HO_CHI_MINH: "branch-hcm",
  DA_NANG: "branch-danang",
} as const;

const ORGANIZATION_ID =
  "organization-rentai";

export const managerReceivableMockData:
  ManagerReceivable[] = [
  {
    id: "receivable-hn-0081",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_RECEIVABLE_BRANCH_IDS.HANOI,

    branchName:
      "Chi nhánh Hà Nội",

    receivableCode:
      "CN-HN-0081",

    invoiceCode:
      "INV-HN-0081",

    rentalId:
      "rental-hn-00081",

    rentalCode:
      "DT-HN-2026-0081",

    contractId:
      "contract-hn-0066",

    contractCode:
      "HD-HN-2026-0066",

    customerId:
      "customer-hn-002",

    customerName:
      "Công ty TNHH Sự kiện Sao Việt",

    customerPhone:
      "0903123456",

    customerEmail:
      "saovietevent@gmail.com",

    totalAmount:
      30_470_000,

    paidAmount:
      18_000_000,

    outstandingAmount:
      12_470_000,

    dueDate:
      "2026-08-12T23:59:59+07:00",

    status:
      "PARTIALLY_PAID",

    priority:
      "NORMAL",

    lastPaymentAt:
      "2026-08-05T10:15:00+07:00",

    note:
      "Khách hàng thanh toán phần còn lại trước ngày hết hạn.",

    createdAt:
      "2026-08-01T09:00:00+07:00",

    updatedAt:
      "2026-08-05T10:15:00+07:00",

    transactions: [
      {
        id:
          "payment-hn-0081-01",

        amount:
          18_000_000,

        method:
          "BANK_TRANSFER",

        referenceCode:
          "VCB-HN-0805-018",

        note:
          "Thanh toán đợt 1.",

        paidAt:
          "2026-08-05T10:15:00+07:00",
      },
    ],
  },

  {
    id: "receivable-hn-0079",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_RECEIVABLE_BRANCH_IDS.HANOI,

    branchName:
      "Chi nhánh Hà Nội",

    receivableCode:
      "CN-HN-0079",

    invoiceCode:
      "INV-HN-0079",

    rentalId:
      "rental-hn-00079",

    rentalCode:
      "DT-HN-2026-0079",

    contractId:
      "contract-hn-0065",

    contractCode:
      "HD-HN-2026-0065",

    customerId:
      "customer-hn-004",

    customerName:
      "Công ty Cổ phần Truyền thông Ánh Dương",

    customerPhone:
      "0912345678",

    customerEmail:
      "anhduongmedia@gmail.com",

    totalAmount:
      22_770_000,

    paidAmount:
      10_000_000,

    outstandingAmount:
      12_770_000,

    dueDate:
      "2026-08-05T23:59:59+07:00",

    status:
      "OVERDUE",

    priority:
      "URGENT",

    lastPaymentAt:
      "2026-08-02T14:20:00+07:00",

    note:
      "Công nợ đã quá hạn, cần liên hệ khách hàng.",

    createdAt:
      "2026-07-29T08:30:00+07:00",

    updatedAt:
      "2026-08-07T09:30:00+07:00",

    transactions: [
      {
        id:
          "payment-hn-0079-01",

        amount:
          10_000_000,

        method:
          "BANK_TRANSFER",

        referenceCode:
          "BIDV-HN-0802-010",

        note:
          "Thanh toán một phần.",

        paidAt:
          "2026-08-02T14:20:00+07:00",
      },
    ],
  },

  {
    id: "receivable-hn-0082",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_RECEIVABLE_BRANCH_IDS.HANOI,

    branchName:
      "Chi nhánh Hà Nội",

    receivableCode:
      "CN-HN-0082",

    invoiceCode:
      "INV-HN-0082",

    rentalId:
      "rental-hn-00082",

    rentalCode:
      "DT-HN-2026-0082",

    contractId: null,

    contractCode: null,

    customerId:
      "customer-hn-006",

    customerName:
      "Công ty TNHH Giáo dục Hướng Dương",

    customerPhone:
      "0988123456",

    customerEmail:
      "huongduongedu@gmail.com",

    totalAmount:
      15_290_000,

    paidAmount:
      5_000_000,

    outstandingAmount:
      10_290_000,

    dueDate:
      "2026-08-11T23:59:59+07:00",

    status:
      "PARTIALLY_PAID",

    priority:
      "NORMAL",

    lastPaymentAt:
      "2026-08-06T16:00:00+07:00",

    note:
      "Đã thu tiền giữ chỗ.",

    createdAt:
      "2026-08-06T11:20:00+07:00",

    updatedAt:
      "2026-08-06T16:00:00+07:00",

    transactions: [
      {
        id:
          "payment-hn-0082-01",

        amount:
          5_000_000,

        method:
          "BANK_TRANSFER",

        referenceCode:
          "VCB-HN-0806-005",

        note:
          "Tiền giữ chỗ.",

        paidAt:
          "2026-08-06T16:00:00+07:00",
      },
    ],
  },

  {
    id: "receivable-hcm-0047",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_RECEIVABLE_BRANCH_IDS.HO_CHI_MINH,

    branchName:
      "Chi nhánh TP. Hồ Chí Minh",

    receivableCode:
      "CN-HCM-0047",

    invoiceCode:
      "INV-HCM-0047",

    rentalId:
      "rental-hcm-00047",

    rentalCode:
      "DT-HCM-2026-0047",

    contractId: null,

    contractCode: null,

    customerId:
      "customer-hcm-003",

    customerName:
      "Công ty Cổ phần Công nghệ Nova",

    customerPhone:
      "0938123456",

    customerEmail:
      "novaevent@gmail.com",

    totalAmount:
      40_700_000,

    paidAmount: 0,

    outstandingAmount:
      40_700_000,

    dueDate:
      "2026-08-18T23:59:59+07:00",

    status:
      "UNPAID",

    priority:
      "HIGH",

    lastPaymentAt: null,

    note:
      "Chờ khách hàng thanh toán lần đầu.",

    createdAt:
      "2026-08-07T09:00:00+07:00",

    updatedAt:
      "2026-08-07T09:00:00+07:00",

    transactions: [],
  },

  {
    id: "receivable-hcm-0045",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_RECEIVABLE_BRANCH_IDS.HO_CHI_MINH,

    branchName:
      "Chi nhánh TP. Hồ Chí Minh",

    receivableCode:
      "CN-HCM-0045",

    invoiceCode:
      "INV-HCM-0045",

    rentalId:
      "rental-hcm-00045",

    rentalCode:
      "DT-HCM-2026-0045",

    contractId:
      "contract-hcm-0039",

    contractCode:
      "HD-HCM-2026-0039",

    customerId:
      "customer-hcm-001",

    customerName:
      "Công ty TNHH Tổ chức Sự kiện Sài Thành",

    customerPhone:
      "0909123456",

    customerEmail:
      "saithanhevent@gmail.com",

    totalAmount:
      63_250_000,

    paidAmount:
      30_000_000,

    outstandingAmount:
      33_250_000,

    dueDate:
      "2026-08-10T23:59:59+07:00",

    status:
      "PARTIALLY_PAID",

    priority:
      "HIGH",

    lastPaymentAt:
      "2026-08-05T13:30:00+07:00",

    note:
      "Khoản còn lại đến hạn trong vài ngày tới.",

    createdAt:
      "2026-08-04T10:00:00+07:00",

    updatedAt:
      "2026-08-05T13:30:00+07:00",

    transactions: [
      {
        id:
          "payment-hcm-0045-01",

        amount:
          30_000_000,

        method:
          "BANK_TRANSFER",

        referenceCode:
          "ACB-HCM-0805-030",

        note:
          "Thanh toán đợt 1.",

        paidAt:
          "2026-08-05T13:30:00+07:00",
      },
    ],
  },

  {
    id: "receivable-hcm-0043",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_RECEIVABLE_BRANCH_IDS.HO_CHI_MINH,

    branchName:
      "Chi nhánh TP. Hồ Chí Minh",

    receivableCode:
      "CN-HCM-0043",

    invoiceCode:
      "INV-HCM-0043",

    rentalId:
      "rental-hcm-00043",

    rentalCode:
      "DT-HCM-2026-0043",

    contractId:
      "contract-hcm-0036",

    contractCode:
      "HD-HCM-2026-0036",

    customerId:
      "customer-hcm-005",

    customerName:
      "Trường Đại học Kinh tế TP.HCM",

    customerPhone:
      "02838295299",

    customerEmail:
      "event@ueh.edu.vn",

    totalAmount:
      17_380_000,

    paidAmount:
      17_380_000,

    outstandingAmount: 0,

    dueDate:
      "2026-08-07T23:59:59+07:00",

    status:
      "PAID",

    priority:
      "NORMAL",

    lastPaymentAt:
      "2026-08-07T08:00:00+07:00",

    note:
      "Đã thanh toán đầy đủ.",

    createdAt:
      "2026-08-01T08:00:00+07:00",

    updatedAt:
      "2026-08-07T08:00:00+07:00",

    transactions: [
      {
        id:
          "payment-hcm-0043-01",

        amount:
          17_380_000,

        method:
          "BANK_TRANSFER",

        referenceCode:
          "VCB-HCM-0807-017",

        note:
          "Thanh toán toàn bộ.",

        paidAt:
          "2026-08-07T08:00:00+07:00",
      },
    ],
  },

  {
    id: "receivable-dn-0021",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_RECEIVABLE_BRANCH_IDS.DA_NANG,

    branchName:
      "Chi nhánh Đà Nẵng",

    receivableCode:
      "CN-DN-0021",

    invoiceCode:
      "INV-DN-0021",

    rentalId:
      "rental-dn-00021",

    rentalCode:
      "DT-DN-2026-0021",

    contractId:
      "contract-dn-0016",

    contractCode:
      "HD-DN-2026-0016",

    customerId:
      "customer-dn-001",

    customerName:
      "Công ty TNHH Du lịch Biển Xanh",

    customerPhone:
      "0905123456",

    customerEmail:
      "bienxanhtravel@gmail.com",

    totalAmount:
      26_950_000,

    paidAmount:
      15_000_000,

    outstandingAmount:
      11_950_000,

    dueDate:
      "2026-08-08T23:59:59+07:00",

    status:
      "PARTIALLY_PAID",

    priority:
      "HIGH",

    lastPaymentAt:
      "2026-08-04T11:00:00+07:00",

    note:
      "Công nợ đến hạn ngày mai.",

    createdAt:
      "2026-08-03T09:30:00+07:00",

    updatedAt:
      "2026-08-04T11:00:00+07:00",

    transactions: [
      {
        id:
          "payment-dn-0021-01",

        amount:
          15_000_000,

        method:
          "BANK_TRANSFER",

        referenceCode:
          "MB-DN-0804-015",

        note:
          "Thanh toán đợt 1.",

        paidAt:
          "2026-08-04T11:00:00+07:00",
      },
    ],
  },

  {
    id: "receivable-dn-0019",

    organizationId:
      ORGANIZATION_ID,

    branchId:
      MANAGER_RECEIVABLE_BRANCH_IDS.DA_NANG,

    branchName:
      "Chi nhánh Đà Nẵng",

    receivableCode:
      "CN-DN-0019",

    invoiceCode:
      "INV-DN-0019",

    rentalId:
      "rental-dn-00019",

    rentalCode:
      "DT-DN-2026-0019",

    contractId:
      "contract-dn-0014",

    contractCode:
      "HD-DN-2026-0014",

    customerId:
      "customer-dn-004",

    customerName:
      "Công ty Cổ phần Xây dựng Miền Trung",

    customerPhone:
      "0915123456",

    customerEmail:
      "mientrungconstruction@gmail.com",

    totalAmount:
      12_100_000,

    paidAmount:
      12_100_000,

    outstandingAmount: 0,

    dueDate:
      "2026-07-28T23:59:59+07:00",

    status:
      "PAID",

    priority:
      "NORMAL",

    lastPaymentAt:
      "2026-07-28T16:30:00+07:00",

    note:
      "Đã tất toán.",

    createdAt:
      "2026-07-25T09:00:00+07:00",

    updatedAt:
      "2026-07-28T16:30:00+07:00",

    transactions: [
      {
        id:
          "payment-dn-0019-01",

        amount:
          12_100_000,

        method:
          "BANK_TRANSFER",

        referenceCode:
          "VCB-DN-0728-012",

        note:
          "Thanh toán toàn bộ.",

        paidAt:
          "2026-07-28T16:30:00+07:00",
      },
    ],
  },
];

export const cloneManagerReceivableMockData =
  (): ManagerReceivable[] =>
    structuredClone(
      managerReceivableMockData,
    );
