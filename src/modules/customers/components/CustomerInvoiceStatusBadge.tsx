import {
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

import type {
    CustomerInvoiceStatus,
} from "../types/customerInvoice.types";

interface CustomerInvoiceStatusBadgeProps {
    status: CustomerInvoiceStatus;
}

const STATUS_CONFIG: Record<
    CustomerInvoiceStatus,
    {
        label: string;
        className: string;
        icon: typeof CheckCircle2;
    }
> = {
    PAID: {
        label: "Đã thanh toán",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: CheckCircle2,
    },

    PENDING: {
        label: "Chờ thanh toán",
        className:
            "border-amber-200 bg-amber-50 text-amber-700",
        icon: Clock3,
    },

    OVERDUE: {
        label: "Quá hạn",
        className:
            "border-red-200 bg-red-50 text-red-700",
        icon: Clock3,
    },

    CANCELLED: {
        label: "Đã hủy",
        className:
            "border-slate-200 bg-slate-100 text-slate-600",
        icon: XCircle,
    },
};

export const CustomerInvoiceStatusBadge = ({
                                               status,
                                           }: CustomerInvoiceStatusBadgeProps) => {
    const config =
        STATUS_CONFIG[status];

    const Icon = config.icon;

    return (
        <span
            className={[
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold",
                config.className,
            ].join(" ")}
        >
            <Icon
                size={13}
                aria-hidden="true"
            />

            {config.label}
        </span>
    );
};