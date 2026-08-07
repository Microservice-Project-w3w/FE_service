import {
    CheckCircle2,
    Clock3,
    RefreshCw,
    XCircle,
} from "lucide-react";

import type {
    CustomerIncidentStatus,
} from "../types/customerIncident.types";

interface CustomerIncidentStatusBadgeProps {
    status: CustomerIncidentStatus;
}

const STATUS_CONFIG = {
    PROCESSING: {
        label: "Đang xử lý",
        icon: RefreshCw,
        className:
            "border-blue-200 bg-blue-50 text-blue-700",
    },

    WAITING_RESPONSE: {
        label: "Chờ phản hồi",
        icon: Clock3,
        className:
            "border-orange-200 bg-orange-50 text-orange-700",
    },

    RESOLVED: {
        label: "Đã giải quyết",
        icon: CheckCircle2,
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
    },

    CANCELLED: {
        label: "Đã hủy",
        icon: XCircle,
        className:
            "border-slate-200 bg-slate-100 text-slate-600",
    },
};

export const CustomerIncidentStatusBadge = ({
                                                status,
                                            }: CustomerIncidentStatusBadgeProps) => {
    const config =
        STATUS_CONFIG[status];

    const Icon = config.icon;

    return (
        <span
            className={[
                "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1 text-xs font-semibold",
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