import {
    CheckCircle2,
    Clock3,
    XCircle,
} from "lucide-react";

import type {
    CustomerContractStatus,
} from "../types/customerContract.types";

interface CustomerContractStatusBadgeProps {
    status: CustomerContractStatus;
}

const STATUS_CONFIG: Record<
    CustomerContractStatus,
    {
        label: string;
        className: string;
        icon: typeof CheckCircle2;
    }
> = {
    ACTIVE: {
        label: "Đang hiệu lực",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: CheckCircle2,
    },

    EXPIRING_SOON: {
        label: "Sắp hết hạn",
        className:
            "border-amber-200 bg-amber-50 text-amber-700",
        icon: Clock3,
    },

    COMPLETED: {
        label: "Hoàn thành",
        className:
            "border-violet-200 bg-violet-50 text-violet-700",
        icon: CheckCircle2,
    },

    CANCELLED: {
        label: "Đã hủy",
        className:
            "border-red-200 bg-red-50 text-red-700",
        icon: XCircle,
    },
};

export const CustomerContractStatusBadge = ({
                                                status,
                                            }: CustomerContractStatusBadgeProps) => {
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