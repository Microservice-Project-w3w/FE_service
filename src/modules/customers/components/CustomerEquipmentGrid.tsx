import type {
    CustomerEquipment,
} from "../types/customerEquipment.types";

import {
    CustomerEquipmentCard,
} from "./CustomerEquipmentCard";

interface CustomerEquipmentGridProps {
    equipments: CustomerEquipment[];
}

export const CustomerEquipmentGrid = ({
                                          equipments,
                                      }: CustomerEquipmentGridProps) => {
    if (equipments.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <h3 className="text-base font-semibold text-slate-900">
                    Không tìm thấy thiết bị
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                    Hãy thử thay đổi từ khóa hoặc bộ lọc.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {equipments.map((equipment) => (
                <CustomerEquipmentCard
                    key={equipment.id}
                    equipment={equipment}
                />
            ))}
        </div>
    );
};