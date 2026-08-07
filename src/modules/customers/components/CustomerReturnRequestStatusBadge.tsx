import {
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

import type {
    CustomerReturnRequestStatus,
} from "../types/customerReturnRequest.types";

interface CustomerReturnRequestStatusBadgeProps {
    status: CustomerReturnRequestStatus;
}

const STATUS_CONFIG: Record<
    CustomerReturnRequestStatus,
    {
        label: string;
        className: string;
        icon: typeof CheckCircle2;
    }
> = {
    PROCESSING: {
        label: "Đang xử lý",
        className:
            "border-amber-200 bg-amber-50 text-amber-700",
        icon: Clock3,
    },

    DUE_SOON: {
        label: "Sắp đến ngày trả",
        className:
            "border-orange-200 bg-orange-50 text-orange-700",
        icon: Clock3,
    },

    COMPLETED: {
        label: "Hoàn thành",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: CheckCircle2,
    },

    CANCELLED: {
        label: "Đã hủy",
        className:
            "border-red-200 bg-red-50 text-red-700",
        icon: XCircle,
    },
};

export const CustomerReturnRequestStatusBadge = ({
                                                     status,
                                                 }: CustomerReturnRequestStatusBadgeProps) => {
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