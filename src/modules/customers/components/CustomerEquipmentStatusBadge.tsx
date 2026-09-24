import type {
    CustomerEquipmentStatus,
} from "../types/customerEquipment.types";

interface CustomerEquipmentStatusBadgeProps {
    status: CustomerEquipmentStatus;
}

const STATUS_CONFIG: Record<
    CustomerEquipmentStatus,
    {
        label: string;
        className: string;
    }
> = {
    AVAILABLE: {
        label: "Sẵn sàng",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    LOW_STOCK: {
        label: "Sắp hết",
        className:
            "border-amber-200 bg-amber-50 text-amber-700",
    },
    UNAVAILABLE: {
        label: "Không khả dụng",
        className:
            "border-slate-200 bg-slate-100 text-slate-600",
    },
};

export const CustomerEquipmentStatusBadge = ({
                                                 status,
                                             }: CustomerEquipmentStatusBadgeProps) => {
    const config = STATUS_CONFIG[status];

    return (
        <span
            className={[
                "inline-flex items-center rounded-full border px-2.5 py-1",
                "text-xs font-semibold",
                config.className,
            ].join(" ")}
        >
      {config.label}
    </span>
    );
};