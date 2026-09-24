import {
    AlertCircle,
    PackageCheck,
    ShoppingCart,
    Tag,
    Wrench,
} from "lucide-react";
import {
    Link,
} from "react-router";

import type {
    CustomerEquipment,
    CustomerEquipmentAvailabilityReason,
} from "../types/customerEquipment.types";

import {
    CustomerEquipmentStatusBadge,
} from "./CustomerEquipmentStatusBadge";

interface CustomerEquipmentCardProps {
    equipment: CustomerEquipment;
}

const formatCurrency = (
    value: number,
): string =>
    new Intl.NumberFormat("vi-VN").format(
        value,
    );

const getAvailabilityLabel = (
    reason: CustomerEquipmentAvailabilityReason,
): string => {
    switch (reason) {
        case "MAINTENANCE":
            return "Đang bảo trì";

        case "REPAIR":
            return "Đang sửa chữa";

        case "RENTED_OUT":
            return "Đã được thuê hết";

        case "INACTIVE":
            return "Tạm ngừng cho thuê";

        case "LOW_QUANTITY":
            return "Số lượng còn ít";

        case "IN_STOCK":
        default:
            return "Có thể thuê";
    }
};

export const CustomerEquipmentCard = ({
                                          equipment,
                                      }: CustomerEquipmentCardProps) => {
    const canRent =
        equipment.status !== "UNAVAILABLE" &&
        equipment.availableQuantity > 0;

    const availabilityLabel =
        getAvailabilityLabel(
            equipment.availabilityReason,
        );

    return (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="h-40 overflow-hidden bg-slate-100">
                <img
                    src={equipment.imageUrl}
                    alt={equipment.name}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col p-3">
                <div className="flex flex-wrap items-center gap-1.5">
                    <CustomerEquipmentStatusBadge
                        status={equipment.status}
                    />

                    {equipment.status ===
                        "LOW_STOCK" && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                            <AlertCircle
                                size={13}
                                aria-hidden="true"
                            />

                            Còn{" "}
                                {
                                    equipment.availableQuantity
                                }
                        </span>
                        )}

                    {equipment.status ===
                        "UNAVAILABLE" && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
                            <Wrench
                                size={13}
                                aria-hidden="true"
                            />

                                {
                                    availabilityLabel
                                }
                        </span>
                        )}
                </div>

                <h3 className="mt-2 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-slate-950">
                    {equipment.name}
                </h3>

                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <Tag
                        size={13}
                        aria-hidden="true"
                    />

                    <span>
                        {equipment.code}
                    </span>
                </div>

                {equipment.status ===
                    "AVAILABLE" && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-emerald-700">
                            <PackageCheck
                                size={13}
                                aria-hidden="true"
                            />

                            <span>
                            Còn{" "}
                                {
                                    equipment.availableQuantity
                                }{" "}
                                thiết bị
                        </span>
                        </div>
                    )}

                <div className="mt-2">
                    <span className="text-base font-bold text-blue-600">
                        {formatCurrency(
                            equipment.pricePerDay,
                        )}{" "}
                        đ
                    </span>

                    <span className="ml-1 text-xs text-slate-500">
                        /{" "}
                        {
                            equipment.rentalUnit
                        }
                    </span>
                </div>

                <div className="mt-auto pt-3">
                    <div className="grid grid-cols-2 gap-2.5">
                        <Link
                            to={`/customer/equipment/${equipment.id}`}
                            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-blue-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                            Xem chi tiết
                        </Link>

                        {canRent ? (
                            <Link
                                to={`/customer/equipment/${equipment.id}/rental-request`}
                                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                            >
                                <ShoppingCart
                                    size={15}
                                    aria-hidden="true"
                                    className="shrink-0 text-white"
                                />

                                <span className="whitespace-nowrap text-white">
                                    Yêu cầu thuê
                                </span>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                disabled
                                className="inline-flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 px-3 text-sm font-semibold text-slate-400"
                            >
                                <ShoppingCart
                                    size={15}
                                    aria-hidden="true"
                                    className="shrink-0"
                                />

                                <span className="whitespace-nowrap">
                                    Chưa thể thuê
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
};