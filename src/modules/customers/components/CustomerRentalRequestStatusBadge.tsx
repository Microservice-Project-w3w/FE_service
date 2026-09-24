import {
    CheckCircle2,
    Clock3,
    FileText,
    LoaderCircle,
    PackageCheck,
    Truck,
    XCircle,
} from "lucide-react";

import type {
    CustomerRentalRequestStatus,
} from "../types/customerRentalRequest.types";

interface CustomerRentalRequestStatusBadgeProps {
    status: CustomerRentalRequestStatus;
}

const STATUS_CONFIG: Record<
    CustomerRentalRequestStatus,
    {
        label: string;
        className: string;
        icon: typeof Clock3;
    }
> = {
    PENDING: {
        label: "Chờ tiếp nhận",
        className:
            "border-amber-200 bg-amber-50 text-amber-700",
        icon: Clock3,
    },

    PROCESSING: {
        label: "Đang xử lý",
        className:
            "border-blue-200 bg-blue-50 text-blue-700",
        icon: LoaderCircle,
    },

    QUOTED: {
        label: "Đã gửi báo giá",
        className:
            "border-violet-200 bg-violet-50 text-violet-700",
        icon: FileText,
    },

    APPROVED: {
        label: "Đã chấp nhận",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        icon: CheckCircle2,
    },

    DELIVERING: {
        label: "Đang giao",
        className:
            "border-purple-200 bg-purple-50 text-purple-700",
        icon: Truck,
    },

    COMPLETED: {
        label: "Hoàn thành",
        className:
            "border-sky-200 bg-sky-50 text-sky-700",
        icon: PackageCheck,
    },

    REJECTED: {
        label: "Đã từ chối",
        className:
            "border-red-200 bg-red-50 text-red-700",
        icon: XCircle,
    },

    CANCELLED: {
        label: "Đã hủy",
        className:
            "border-slate-200 bg-slate-100 text-slate-600",
        icon: XCircle,
    },
};

export const CustomerRentalRequestStatusBadge = ({
                                                     status,
                                                 }: CustomerRentalRequestStatusBadgeProps) => {
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
                className={
                    status === "PROCESSING"
                        ? "animate-spin"
                        : undefined
                }
            />

            {config.label}
        </span>
    );
};