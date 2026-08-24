import type {
    NotificationItem,
} from "@/modules/notifications/types/notification.types";

export const defaultNotifications: NotificationItem[] = [
    {
        id: "notification-manager-001",
        role: "MANAGER",
        type: "APPROVAL",
        priority: "IMPORTANT",
        title: "Có báo giá mới chờ duyệt",
        message:
            "Báo giá QT-2026-018 đang chờ quản lý phê duyệt.",
        createdAt: "2026-08-23T09:15:00",
        isRead: false,
        actionPath:
            "/manager/quotation-approvals",
    },
    {
        id: "notification-manager-002",
        role: "MANAGER",
        type: "DELIVERY",
        priority: "URGENT",
        title: "Lệnh giao hàng có nguy cơ trễ",
        message:
            "Lệnh DG-2026-017 chưa hoàn tất theo lịch dự kiến.",
        createdAt: "2026-08-23T08:40:00",
        isRead: false,
        actionPath:
            "/manager/deliveries",
    },
    {
        id: "notification-manager-003",
        role: "MANAGER",
        type: "RENTAL",
        priority: "NORMAL",
        title: "Đơn thuê mới được tạo",
        message:
            "Một đơn thuê mới vừa được nhân viên kinh doanh tạo.",
        createdAt: "2026-08-22T16:20:00",
        isRead: true,
        actionPath:
            "/manager/rentals",
    },

    {
        id: "notification-sales-001",
        role: "SALES_STAFF",
        type: "RENTAL",
        priority: "IMPORTANT",
        title: "Có yêu cầu thuê mới",
        message:
            "Khách hàng vừa gửi một yêu cầu thuê thiết bị mới.",
        createdAt: "2026-08-23T10:05:00",
        isRead: false,
        actionPath:
            "/sales/rental-requests",
    },
    {
        id: "notification-sales-002",
        role: "SALES_STAFF",
        type: "APPROVAL",
        priority: "NORMAL",
        title: "Báo giá đã được phê duyệt",
        message:
            "Báo giá QT-2026-015 đã được quản lý phê duyệt.",
        createdAt: "2026-08-23T09:10:00",
        isRead: false,
        actionPath:
            "/sales/quotations",
    },

    {
        id: "notification-operations-001",
        role: "OPERATIONS_STAFF",
        type: "DELIVERY",
        priority: "IMPORTANT",
        title: "Có lệnh giao mới",
        message:
            "Lệnh DG-2026-021 đang chờ bộ phận vận hành tiếp nhận.",
        createdAt: "2026-08-23T10:30:00",
        isRead: false,
        actionPath:
            "/operations/deliveries",
    },
    {
        id: "notification-operations-002",
        role: "OPERATIONS_STAFF",
        type: "RETURN",
        priority: "NORMAL",
        title: "Có thiết bị vừa được trả",
        message:
            "Phiếu RT-2026-0247 vừa được tạo và đang chờ kiểm tra.",
        createdAt: "2026-08-23T09:35:00",
        isRead: false,
        actionPath:
            "/operations/returns",
    },
    {
        id: "notification-operations-003",
        role: "OPERATIONS_STAFF",
        type: "MAINTENANCE",
        priority: "URGENT",
        title: "Thiết bị cần bảo trì",
        message:
            "Máy ảnh Sony A7S III cần được kiểm tra và bảo trì.",
        createdAt: "2026-08-23T08:15:00",
        isRead: true,
        actionPath:
            "/operations/maintenance",
    },

    {
        id: "notification-accountant-001",
        role: "ACCOUNTANT",
        type: "INVOICE",
        priority: "IMPORTANT",
        title: "Có hóa đơn mới",
        message:
            "Hóa đơn INV-2026-031 vừa được tạo và cần kiểm tra.",
        createdAt: "2026-08-23T10:10:00",
        isRead: false,
        actionPath:
            "/accounting/invoices",
    },
    {
        id: "notification-accountant-002",
        role: "ACCOUNTANT",
        type: "PAYMENT",
        priority: "NORMAL",
        title: "Đã ghi nhận thanh toán",
        message:
            "Một khoản thanh toán mới vừa được ghi nhận.",
        createdAt: "2026-08-23T08:55:00",
        isRead: false,
        actionPath:
            "/accounting/payments",
    },

    {
        id: "notification-customer-001",
        role: "CUSTOMER",
        type: "RENTAL",
        priority: "IMPORTANT",
        title: "Yêu cầu thuê đã được tiếp nhận",
        message:
            "Yêu cầu thuê của bạn đang được nhân viên kinh doanh xử lý.",
        createdAt: "2026-08-23T10:25:00",
        isRead: false,
        actionPath:
            "/customer/rental-requests",
    },
    {
        id: "notification-customer-002",
        role: "CUSTOMER",
        type: "DELIVERY",
        priority: "NORMAL",
        title: "Thiết bị đang được giao",
        message:
            "Đơn thuê của bạn đã được chuyển sang bước giao thiết bị.",
        createdAt: "2026-08-23T09:00:00",
        isRead: false,
        actionPath:
            "/customer/rental-requests",
    },
    {
        id: "notification-customer-003",
        role: "CUSTOMER",
        type: "INVOICE",
        priority: "NORMAL",
        title: "Hóa đơn đã được phát hành",
        message:
            "Hóa đơn cho đơn thuê gần nhất của bạn đã được phát hành.",
        createdAt: "2026-08-22T15:40:00",
        isRead: true,
        actionPath:
            "/customer/invoices",
    },

    {
        id: "notification-admin-001",
        role: "ADMIN",
        type: "ACCOUNT",
        priority: "IMPORTANT",
        title: "Có tài khoản mới",
        message:
            "Một tài khoản mới vừa được đăng ký trong hệ thống.",
        createdAt: "2026-08-23T10:45:00",
        isRead: false,
        actionPath:
            "/admin/accounts",
    },
    {
        id: "notification-admin-002",
        role: "ADMIN",
        type: "SYSTEM",
        priority: "NORMAL",
        title: "Hệ thống hoạt động bình thường",
        message:
            "Các dịch vụ chính hiện đang hoạt động ổn định.",
        createdAt: "2026-08-23T08:00:00",
        isRead: true,
        actionPath:
            "/admin/dashboard",
    },
];