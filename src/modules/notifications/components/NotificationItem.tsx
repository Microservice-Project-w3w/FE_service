import {
    Bell,
    CheckCircle2,
    CircleDollarSign,
    ClipboardCheck,
    FileText,
    PackageCheck,
    RotateCcw,
    Settings,
    Truck,
    UserRoundPlus,
    Wrench,
    type LucideIcon,
} from "lucide-react";

import type {
    NotificationItem as NotificationData,
    NotificationType,
} from "@/modules/notifications/types/notification.types";

interface NotificationItemProps {
    notification: NotificationData;
    isRead: boolean;
    onClick: () => void;
}

const TYPE_ICON: Record<
    NotificationType,
    LucideIcon
> = {
    SYSTEM: Settings,
    ACCOUNT: UserRoundPlus,
    APPROVAL: ClipboardCheck,
    RENTAL: PackageCheck,
    DELIVERY: Truck,
    RETURN: RotateCcw,
    MAINTENANCE: Wrench,
    INVOICE: FileText,
    PAYMENT: CircleDollarSign,
};

const TYPE_STYLE: Record<
    NotificationType,
    string
> = {
    SYSTEM:
        "bg-slate-100 text-slate-600",

    ACCOUNT:
        "bg-violet-50 text-violet-600",

    APPROVAL:
        "bg-amber-50 text-amber-600",

    RENTAL:
        "bg-blue-50 text-blue-600",

    DELIVERY:
        "bg-cyan-50 text-cyan-600",

    RETURN:
        "bg-indigo-50 text-indigo-600",

    MAINTENANCE:
        "bg-orange-50 text-orange-600",

    INVOICE:
        "bg-emerald-50 text-emerald-600",

    PAYMENT:
        "bg-teal-50 text-teal-600",
};

const formatDateTime = (
    value: string,
): string => {
    const date = new Date(value);

    return new Intl.DateTimeFormat(
        "vi-VN",
        {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
        },
    ).format(date);
};

export const NotificationItem = ({
                                     notification,
                                     isRead,
                                     onClick,
                                 }: NotificationItemProps) => {
    const Icon =
        TYPE_ICON[
            notification.type
            ] ?? Bell;

    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "flex w-full items-start gap-3 px-4 py-3 text-left transition",
                "border-b border-slate-100 last:border-b-0",
                "hover:bg-slate-50",
                isRead
                    ? "bg-white"
                    : "bg-blue-50/35",
            ].join(" ")}
        >
      <span
          className={[
              "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
              TYPE_STYLE[
                  notification.type
                  ],
          ].join(" ")}
      >
        <Icon size={16} />
      </span>

            <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                    <p className="min-w-0 flex-1 text-xs font-bold leading-5 text-slate-900">
                        {notification.title}
                    </p>

                    {!isRead ? (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-blue-600" />
                    ) : (
                        <CheckCircle2
                            size={13}
                            className="mt-1 shrink-0 text-slate-300"
                        />
                    )}
                </div>

                <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-slate-500">
                    {notification.message}
                </p>

                <p className="mt-1.5 text-[9px] font-medium text-slate-400">
                    {formatDateTime(
                        notification.createdAt,
                    )}
                </p>
            </div>
        </button>
    );
};