import type {
    UserRole,
} from "@/modules/auth";

export type NotificationType =
    | "SYSTEM"
    | "ACCOUNT"
    | "APPROVAL"
    | "RENTAL"
    | "DELIVERY"
    | "RETURN"
    | "MAINTENANCE"
    | "INVOICE"
    | "PAYMENT";

export type NotificationPriority =
    | "NORMAL"
    | "IMPORTANT"
    | "URGENT";

export interface NotificationItem {
    id: string;

    role: UserRole;

    type: NotificationType;

    priority: NotificationPriority;

    title: string;

    message: string;

    createdAt: string;

    isRead: boolean;

    actionPath?: string;
}