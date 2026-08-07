import {
    ArrowDown,
    ArrowUp,
    Minus,
} from "lucide-react";

import type {
    CustomerIncidentPriority,
} from "../types/customerIncident.types";

interface CustomerIncidentPriorityBadgeProps {
    priority: CustomerIncidentPriority;
}

const PRIORITY_CONFIG = {
    HIGH: {
        label: "Cao",
        icon: ArrowUp,
        className:
            "border-red-200 bg-red-50 text-red-600",
    },

    MEDIUM: {
        label: "Trung bình",
        icon: Minus,
        className:
            "border-amber-200 bg-amber-50 text-amber-700",
    },

    LOW: {
        label: "Thấp",
        icon: ArrowDown,
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
};

export const CustomerIncidentPriorityBadge = ({
                                                  priority,
                                              }: CustomerIncidentPriorityBadgeProps) => {
    const config =
        PRIORITY_CONFIG[priority];

    const Icon = config.icon;

    return (
        <span
            className={[
                "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold",
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