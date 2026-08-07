import type {
  ManagerContract,
} from "@/modules/contracts/types/manager-contract-approval.types";

export const initialManagerContracts:
  ManagerContract[] = [
    {
      id: "contract-hn-001",
      organizationId: "org-rentai",
      branchId: "branch-hanoi",
      branchName: "Chi nhánh Hà Nội",

      contractCode: "HD-HN-2026-0068",
      quotationId: "quotation-hn-001",
      quotationCode: "BG-HN-2026-0086",
      rentalRequestId: "request-hn-001",
      rentalRequestCode: "YCT-HN-2026-0091",

      customerId: "customer-101",
      customerName: "Công ty Sự kiện Ánh Dương",
      customerPhone: "0901234567",
      customerEmail: "contact@anhduongevent.vn",
      customerAddress: "Cầu Giấy, Hà Nội",
      customerTaxCode: "0109123456",

      eventName: "Hội nghị khách hàng 2026",
      eventLocation: "Trung tâm Hội nghị Quốc gia",
      rentalStartDate: "2026-08-10",
      rentalEndDate: "2026-08-11",
      approvalDeadline: "2026-08-07T10:00:00.000Z",

      status: "PENDING_APPROVAL",
      priority: "URGENT",

      equipmentSubtotal: 43000000,
      discountAmount: 2000000,
      deliveryFee: 2500000,
      taxAmount: 5000000,
      totalContractValue: 48500000,

      depositAmount: 14550000,
      remainingAmount: 33950000,
      lateFeePerDay: 1500000,

      cancellationPolicy:
        "Hủy trước 07 ngày được hoàn 70% tiền đặt cọc. Hủy trong vòng 03 ngày không hoàn tiền đặt cọc.",

      damageCompensationPolicy:
        "Khách hàng chịu chi phí sửa chữa hoặc thay thế theo giá trị thực tế khi làm mất hoặc hư hỏng thiết bị.",

      createdById: "sales-001",
      createdByName: "Trần Thị Kinh Doanh",
      createdAt: "2026-08-06T03:10:00.000Z",
      note: "Khách hàng yêu cầu ký hợp đồng trong ngày.",

      equipmentItems: [
        {
          id: "contract-item-hn-001",
          equipmentTypeId: "equipment-sound-system",
          equipmentName: "Hệ thống âm thanh hội trường",
          quantity: 1,
          rentalDays: 2,
          unitPrice: 12500000,
          subtotal: 25000000,
        },
        {
          id: "contract-item-hn-002",
          equipmentTypeId: "equipment-led-screen",
          equipmentName: "Màn hình LED P3",
          quantity: 12,
          rentalDays: 2,
          unitPrice: 750000,
          subtotal: 18000000,
        },
      ],

      paymentSchedule: [
        {
          id: "payment-hn-001",
          name: "Đặt cọc khi ký hợp đồng",
          dueDate: "2026-08-07",
          amount: 14550000,
          percentage: 30,
          status: "PENDING",
        },
        {
          id: "payment-hn-002",
          name: "Thanh toán trước khi giao thiết bị",
          dueDate: "2026-08-09",
          amount: 24250000,
          percentage: 50,
          status: "PENDING",
        },
        {
          id: "payment-hn-003",
          name: "Thanh toán sau khi thanh lý",
          dueDate: "2026-08-12",
          amount: 9700000,
          percentage: 20,
          status: "PENDING",
        },
      ],

      clauses: [
        {
          id: "clause-hn-001",
          title: "Trách nhiệm bàn giao",
          content:
            "Bên cho thuê bàn giao đúng số lượng, chủng loại và thời gian đã thỏa thuận.",
          required: true,
        },
        {
          id: "clause-hn-002",
          title: "Trách nhiệm bảo quản",
          content:
            "Bên thuê có trách nhiệm bảo quản thiết bị trong toàn bộ thời gian thuê.",
          required: true,
        },
        {
          id: "clause-hn-003",
          title: "Phát sinh ngoài hợp đồng",
          content:
            "Mọi phát sinh phải được hai bên xác nhận bằng văn bản hoặc phụ lục.",
          required: false,
        },
      ],

      appendices: [
        {
          id: "appendix-hn-001",
          code: "PL-HD-HN-0068-01",
          title: "Danh sách thiết bị",
          description:
            "Chi tiết mã thiết bị, số lượng và tình trạng khi bàn giao.",
          createdAt: "2026-08-06T03:10:00.000Z",
        },
      ],

      approvalHistory: [
        {
          id: "history-contract-hn-001",
          action: "SUBMITTED",
          actorId: "sales-001",
          actorName: "Trần Thị Kinh Doanh",
          note: "Gửi quản lý phê duyệt hợp đồng.",
          createdAt: "2026-08-06T03:10:00.000Z",
        },
      ],
    },

    {
      id: "contract-hn-002",
      organizationId: "org-rentai",
      branchId: "branch-hanoi",
      branchName: "Chi nhánh Hà Nội",

      contractCode: "HD-HN-2026-0065",
      quotationId: "quotation-hn-003",
      quotationCode: "BG-HN-2026-0081",
      rentalRequestId: "request-hn-002",
      rentalRequestCode: "YCT-HN-2026-0087",

      customerId: "customer-103",
      customerName: "Trung tâm Hội nghị Hà Nội",
      customerPhone: "02437654321",
      customerEmail: "event@hanoicenter.vn",
      customerAddress: "Từ Liêm, Hà Nội",
      customerTaxCode: "0106789123",

      eventName: "Hội thảo chuyển đổi số",
      eventLocation: "Cung Trí thức Hà Nội",
      rentalStartDate: "2026-08-09",
      rentalEndDate: "2026-08-09",
      approvalDeadline: "2026-08-06T10:00:00.000Z",

      status: "APPROVED",
      priority: "NORMAL",

      equipmentSubtotal: 22000000,
      discountAmount: 1000000,
      deliveryFee: 1200000,
      taxAmount: 2220000,
      totalContractValue: 24420000,

      depositAmount: 4884000,
      remainingAmount: 19536000,
      lateFeePerDay: 800000,

      cancellationPolicy:
        "Hủy trước 05 ngày được hoàn 50% tiền đặt cọc.",

      damageCompensationPolicy:
        "Bồi thường theo giá trị sửa chữa hoặc giá trị còn lại của thiết bị.",

      createdById: "sales-001",
      createdByName: "Trần Thị Kinh Doanh",
      createdAt: "2026-08-04T05:00:00.000Z",
      note: null,

      equipmentItems: [
        {
          id: "contract-item-hn-003",
          equipmentTypeId: "equipment-projector",
          equipmentName: "Máy chiếu hội nghị",
          quantity: 4,
          rentalDays: 1,
          unitPrice: 2500000,
          subtotal: 10000000,
        },
        {
          id: "contract-item-hn-004",
          equipmentTypeId: "equipment-conference-mic",
          equipmentName: "Micro hội nghị không dây",
          quantity: 12,
          rentalDays: 1,
          unitPrice: 1000000,
          subtotal: 12000000,
        },
      ],

      paymentSchedule: [
        {
          id: "payment-hn-004",
          name: "Đặt cọc",
          dueDate: "2026-08-06",
          amount: 4884000,
          percentage: 20,
          status: "PAID",
        },
        {
          id: "payment-hn-005",
          name: "Thanh toán còn lại",
          dueDate: "2026-08-09",
          amount: 19536000,
          percentage: 80,
          status: "PENDING",
        },
      ],

      clauses: [
        {
          id: "clause-hn-004",
          title: "Bàn giao thiết bị",
          content:
            "Thiết bị được kiểm tra và ký biên bản khi bàn giao.",
          required: true,
        },
      ],

      appendices: [],

      approvalHistory: [
        {
          id: "history-contract-hn-002",
          action: "SUBMITTED",
          actorId: "sales-001",
          actorName: "Trần Thị Kinh Doanh",
          note: null,
          createdAt: "2026-08-04T05:00:00.000Z",
        },
        {
          id: "history-contract-hn-003",
          action: "APPROVED",
          actorId: "manager-001",
          actorName: "Nguyễn Văn Quản Lý",
          note: "Điều khoản và lịch thanh toán phù hợp.",
          createdAt: "2026-08-06T01:45:00.000Z",
        },
      ],
    },

    {
      id: "contract-hcm-001",
      organizationId: "org-rentai",
      branchId: "branch-hcm",
      branchName: "Chi nhánh TP. Hồ Chí Minh",

      contractCode: "HD-HCM-2026-0039",
      quotationId: "quotation-hcm-001",
      quotationCode: "BG-HCM-2026-0048",
      rentalRequestId: "request-hcm-001",
      rentalRequestCode: "YCT-HCM-2026-0052",

      customerId: "customer-201",
      customerName: "Công ty Truyền thông Phương Nam",
      customerPhone: "0938123456",
      customerEmail: "booking@phuongnam.vn",
      customerAddress: "Quận 7, TP. Hồ Chí Minh",
      customerTaxCode: "0312345678",

      eventName: "Triển lãm thương mại",
      eventLocation: "SECC TP. Hồ Chí Minh",
      rentalStartDate: "2026-08-15",
      rentalEndDate: "2026-08-17",
      approvalDeadline: "2026-08-08T09:00:00.000Z",

      status: "PENDING_APPROVAL",
      priority: "HIGH",

      equipmentSubtotal: 58000000,
      discountAmount: 3000000,
      deliveryFee: 3500000,
      taxAmount: 5850000,
      totalContractValue: 64350000,

      depositAmount: 19305000,
      remainingAmount: 45045000,
      lateFeePerDay: 2000000,

      cancellationPolicy:
        "Hủy trước 10 ngày được hoàn 70% tiền đặt cọc.",

      damageCompensationPolicy:
        "Thiết bị mất hoặc hư hỏng phải bồi thường theo biên bản xác nhận.",

      createdById: "sales-hcm-001",
      createdByName: "Nguyễn Thị Thanh",
      createdAt: "2026-08-05T09:00:00.000Z",
      note: "Hợp đồng triển lãm kéo dài ba ngày.",

      equipmentItems: [
        {
          id: "contract-item-hcm-001",
          equipmentTypeId: "equipment-booth",
          equipmentName: "Gian hàng triển lãm tiêu chuẩn",
          quantity: 10,
          rentalDays: 3,
          unitPrice: 1200000,
          subtotal: 36000000,
        },
        {
          id: "contract-item-hcm-002",
          equipmentTypeId: "equipment-led-screen",
          equipmentName: "Màn hình LED P3",
          quantity: 10,
          rentalDays: 3,
          unitPrice: 733333,
          subtotal: 22000000,
        },
      ],

      paymentSchedule: [
        {
          id: "payment-hcm-001",
          name: "Đặt cọc",
          dueDate: "2026-08-08",
          amount: 19305000,
          percentage: 30,
          status: "PENDING",
        },
        {
          id: "payment-hcm-002",
          name: "Thanh toán trước sự kiện",
          dueDate: "2026-08-14",
          amount: 32175000,
          percentage: 50,
          status: "PENDING",
        },
        {
          id: "payment-hcm-003",
          name: "Thanh toán khi thanh lý",
          dueDate: "2026-08-18",
          amount: 12870000,
          percentage: 20,
          status: "PENDING",
        },
      ],

      clauses: [
        {
          id: "clause-hcm-001",
          title: "Thời gian lắp đặt",
          content:
            "Bên cho thuê hoàn tất lắp đặt trước giờ khai mạc tối thiểu 06 giờ.",
          required: true,
        },
        {
          id: "clause-hcm-002",
          title: "Nhân sự kỹ thuật",
          content:
            "Bố trí nhân sự kỹ thuật trực trong toàn bộ thời gian sự kiện.",
          required: true,
        },
      ],

      appendices: [
        {
          id: "appendix-hcm-001",
          code: "PL-HD-HCM-0039-01",
          title: "Sơ đồ gian hàng",
          description:
            "Sơ đồ bố trí gian hàng và màn hình LED tại khu triển lãm.",
          createdAt: "2026-08-05T09:00:00.000Z",
        },
      ],

      approvalHistory: [
        {
          id: "history-contract-hcm-001",
          action: "SUBMITTED",
          actorId: "sales-hcm-001",
          actorName: "Nguyễn Thị Thanh",
          note: "Gửi quản lý phê duyệt.",
          createdAt: "2026-08-05T09:00:00.000Z",
        },
      ],
    },

    {
      id: "contract-hcm-002",
      organizationId: "org-rentai",
      branchId: "branch-hcm",
      branchName: "Chi nhánh TP. Hồ Chí Minh",

      contractCode: "HD-HCM-2026-0035",
      quotationId: "quotation-hcm-002",
      quotationCode: "BG-HCM-2026-0045",
      rentalRequestId: "request-hcm-002",
      rentalRequestCode: "YCT-HCM-2026-0047",

      customerId: "customer-202",
      customerName: "Khách sạn Sài Gòn Central",
      customerPhone: "02838223344",
      customerEmail: "events@saigoncentral.vn",
      customerAddress: "Quận 1, TP. Hồ Chí Minh",
      customerTaxCode: "0310987654",

      eventName: "Tiệc tri ân khách hàng",
      eventLocation: "Khách sạn Sài Gòn Central",
      rentalStartDate: "2026-08-11",
      rentalEndDate: "2026-08-11",
      approvalDeadline: "2026-08-07T09:00:00.000Z",

      status: "REJECTED",
      priority: "NORMAL",

      equipmentSubtotal: 27500000,
      discountAmount: 0,
      deliveryFee: 1500000,
      taxAmount: 2900000,
      totalContractValue: 31900000,

      depositAmount: 8000000,
      remainingAmount: 23900000,
      lateFeePerDay: 1000000,

      cancellationPolicy:
        "Không hoàn tiền đặt cọc khi hủy trong vòng 03 ngày.",

      damageCompensationPolicy:
        "Bồi thường theo chi phí sửa chữa thực tế.",

      createdById: "sales-hcm-001",
      createdByName: "Nguyễn Thị Thanh",
      createdAt: "2026-08-04T07:15:00.000Z",
      note: null,

      equipmentItems: [
        {
          id: "contract-item-hcm-003",
          equipmentTypeId: "equipment-sound-system",
          equipmentName: "Hệ thống âm thanh tiệc",
          quantity: 1,
          rentalDays: 1,
          unitPrice: 19500000,
          subtotal: 19500000,
        },
        {
          id: "contract-item-hcm-004",
          equipmentTypeId: "equipment-lighting",
          equipmentName: "Bộ ánh sáng trang trí",
          quantity: 1,
          rentalDays: 1,
          unitPrice: 8000000,
          subtotal: 8000000,
        },
      ],

      paymentSchedule: [
        {
          id: "payment-hcm-004",
          name: "Đặt cọc",
          dueDate: "2026-08-07",
          amount: 8000000,
          percentage: 25,
          status: "PENDING",
        },
        {
          id: "payment-hcm-005",
          name: "Thanh toán còn lại",
          dueDate: "2026-08-10",
          amount: 23900000,
          percentage: 75,
          status: "PENDING",
        },
      ],

      clauses: [
        {
          id: "clause-hcm-003",
          title: "Thời gian vận hành",
          content:
            "Thiết bị được vận hành trong khung giờ ghi trên biên bản bàn giao.",
          required: true,
        },
      ],

      appendices: [],

      approvalHistory: [
        {
          id: "history-contract-hcm-002",
          action: "SUBMITTED",
          actorId: "sales-hcm-001",
          actorName: "Nguyễn Thị Thanh",
          note: null,
          createdAt: "2026-08-04T07:15:00.000Z",
        },
        {
          id: "history-contract-hcm-003",
          action: "REJECTED",
          actorId: "manager-001",
          actorName: "Nguyễn Văn Quản Lý",
          note:
            "Điều khoản hủy hợp đồng chưa thống nhất với báo giá đã duyệt.",
          createdAt: "2026-08-06T02:35:00.000Z",
        },
      ],
    },

    {
      id: "contract-dn-001",
      organizationId: "org-rentai",
      branchId: "branch-danang",
      branchName: "Chi nhánh Đà Nẵng",

      contractCode: "HD-DN-2026-0016",
      quotationId: "quotation-dn-001",
      quotationCode: "BG-DN-2026-0019",
      rentalRequestId: "request-dn-001",
      rentalRequestCode: "YCT-DN-2026-0022",

      customerId: "customer-301",
      customerName: "Công ty Du lịch Miền Trung",
      customerPhone: "0905123456",
      customerEmail: "event@mientravel.vn",
      customerAddress: "Hải Châu, Đà Nẵng",
      customerTaxCode: "0401234567",

      eventName: "Hội nghị đối tác du lịch",
      eventLocation: "Furama Resort Đà Nẵng",
      rentalStartDate: "2026-08-13",
      rentalEndDate: "2026-08-14",
      approvalDeadline: "2026-08-09T09:00:00.000Z",

      status: "PENDING_APPROVAL",
      priority: "NORMAL",

      equipmentSubtotal: 26000000,
      discountAmount: 1000000,
      deliveryFee: 1200000,
      taxAmount: 2620000,
      totalContractValue: 28820000,

      depositAmount: 7205000,
      remainingAmount: 21615000,
      lateFeePerDay: 900000,

      cancellationPolicy:
        "Hủy trước 05 ngày được hoàn 50% tiền đặt cọc.",

      damageCompensationPolicy:
        "Khách hàng chịu trách nhiệm bồi thường khi thiết bị mất hoặc hư hỏng.",

      createdById: "sales-dn-001",
      createdByName: "Lê Thị Minh Trang",
      createdAt: "2026-08-05T10:10:00.000Z",
      note: null,

      equipmentItems: [
        {
          id: "contract-item-dn-001",
          equipmentTypeId: "equipment-led-screen",
          equipmentName: "Màn hình LED ngoài trời",
          quantity: 8,
          rentalDays: 2,
          unitPrice: 1000000,
          subtotal: 16000000,
        },
        {
          id: "contract-item-dn-002",
          equipmentTypeId: "equipment-sound-system",
          equipmentName: "Hệ thống âm thanh sự kiện",
          quantity: 1,
          rentalDays: 2,
          unitPrice: 5000000,
          subtotal: 10000000,
        },
      ],

      paymentSchedule: [
        {
          id: "payment-dn-001",
          name: "Đặt cọc",
          dueDate: "2026-08-09",
          amount: 7205000,
          percentage: 25,
          status: "PENDING",
        },
        {
          id: "payment-dn-002",
          name: "Thanh toán trước sự kiện",
          dueDate: "2026-08-12",
          amount: 21615000,
          percentage: 75,
          status: "PENDING",
        },
      ],

      clauses: [
        {
          id: "clause-dn-001",
          title: "Lắp đặt ngoài trời",
          content:
            "Bên thuê chuẩn bị nguồn điện và khu vực lắp đặt đảm bảo an toàn.",
          required: true,
        },
      ],

      appendices: [],

      approvalHistory: [
        {
          id: "history-contract-dn-001",
          action: "SUBMITTED",
          actorId: "sales-dn-001",
          actorName: "Lê Thị Minh Trang",
          note: null,
          createdAt: "2026-08-05T10:10:00.000Z",
        },
      ],
    },
  ];
