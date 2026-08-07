import {
    CheckCircle2,
    Clock3,
    History,
    RefreshCcw,
    XCircle,
} from "lucide-react";

import type {
    CustomerQuotationStatus,
} from "../types/customerQuotation.types";

interface CustomerQuotationStatusBadgeProps {
    status: CustomerQuotationStatus;
}

const STATUS_CONFIG: Record<
    CustomerQuotationStatus,
    {
        label: string;
        className: string;
        icon: typeof Clock3;
    }
> = {
    PENDING_RESPONSE: {
        label: "Chờ phản hồi",
        className:
            "border-amber-200 bg-amber-50 text-amber-700",
        icon: Clock3,
    },

    ACCEPTED: {
        label: "Đã chấp nhận",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: CheckCircle2,
    },

    REJECTED: {
        label: "Đã từ chối",
        className:
            "border-red-200 bg-red-50 text-red-700",
        icon: XCircle,
    },

    EXPIRED: {
        label: "Hết hiệu lực",
        className:
            "border-slate-200 bg-slate-100 text-slate-600",
        icon: History,
    },

    SUPERSEDED: {
        label: "Đã thay thế",
        className:
            "border-violet-200 bg-violet-50 text-violet-700",
        icon: RefreshCcw,
    },
};

export const CustomerQuotationStatusBadge = ({
                                                 status,
                                             }: CustomerQuotationStatusBadgeProps) => {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
        <span
            className={[
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
                "text-xs font-semibold",
                config.className,
            ].join(" ")}
        >
            <Icon
                size={14}
                aria-hidden="true"
            />

            {config.label}
        </span>
    );
};