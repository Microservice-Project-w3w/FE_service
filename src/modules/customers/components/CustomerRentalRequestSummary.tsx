import {
    BadgeCheck,
    CalendarDays,
    Headphones,
    PackageCheck,
    ShieldCheck,
} from "lucide-react";

import type {
    CustomerEquipment,
} from "../types/customerEquipment.types";

interface CustomerRentalRequestSummaryProps {
    equipment: CustomerEquipment;
    startDate: string;
    endDate: string;
    quantity: number;
}

const formatCurrency = (
    value: number,
): string =>
    new Intl.NumberFormat("vi-VN").format(
        value,
    );

const calculateRentalDays = (
    startDate: string,
    endDate: string,
): number => {
    if (!startDate || !endDate) {
        return 0;
    }

    const start = new Date(
        `${startDate}T00:00:00`,
    );

    const end = new Date(
        `${endDate}T00:00:00`,
    );

    if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime()) ||
        end < start
    ) {
        return 0;
    }

    const millisecondsPerDay =
        1000 * 60 * 60 * 24;

    return (
        Math.floor(
            (end.getTime() - start.getTime()) /
            millisecondsPerDay,
        ) + 1
    );
};

export const CustomerRentalRequestSummary = ({
                                                 equipment,
                                                 startDate,
                                                 endDate,
                                                 quantity,
                                             }: CustomerRentalRequestSummaryProps) => {
    const rentalDays = calculateRentalDays(
        startDate,
        endDate,
    );

    const safeQuantity = Math.max(
        quantity || 0,
        0,
    );

    const subtotal =
        equipment.pricePerDay *
        rentalDays *
        safeQuantity;

    return (
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-lg font-bold text-slate-950">
                        Tóm tắt thiết bị
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Kiểm tra thông tin trước khi gửi yêu cầu.
                    </p>
                </div>

                <div className="p-5">
                    <div className="flex gap-4">
                        <div className="h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                            <img
                                src={equipment.imageUrl}
                                alt={equipment.name}
                                className="h-full w-full object-cover"
                            />
                        </div>

                        <div className="min-w-0">
                            <h3 className="line-clamp-2 text-sm font-bold text-slate-950">
                                {equipment.name}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                {equipment.code}
                            </p>

                            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                <PackageCheck
                                    size={14}
                                    aria-hidden="true"
                                />

                                Còn {equipment.availableQuantity} thiết bị
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">
                Giá thuê
              </span>

                            <strong className="text-slate-900">
                                {formatCurrency(
                                    equipment.pricePerDay,
                                )}{" "}
                                đ / {equipment.rentalUnit}
                            </strong>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">
                Số ngày thuê
              </span>

                            <strong className="text-slate-900">
                                {rentalDays > 0
                                    ? `${rentalDays} ngày`
                                    : "Chưa chọn"}
                            </strong>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">
                Số lượng
              </span>

                            <strong className="text-slate-900">
                                {safeQuantity}
                            </strong>
                        </div>

                        <div className="my-4 border-t border-slate-200" />

                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Chi phí dự kiến
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Chưa gồm phí giao nhận và tiền đặt cọc.
                                </p>
                            </div>

                            <strong className="text-xl font-bold text-blue-600">
                                {formatCurrency(subtotal)} đ
                            </strong>
                        </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-4">
                        <div className="flex gap-3">
                            <CalendarDays
                                size={18}
                                aria-hidden="true"
                                className="mt-0.5 shrink-0 text-amber-600"
                            />

                            <p className="text-xs leading-5 text-amber-800">
                                Đây chỉ là chi phí tạm tính. Giá chính thức,
                                phí giao nhận và tiền đặt cọc sẽ được xác nhận
                                trong báo giá.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-sm font-bold text-slate-950">
                    Quyền lợi khi thuê
                </h2>

                <div className="mt-4 space-y-4">
                    <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BadgeCheck
                  size={18}
                  aria-hidden="true"
              />
            </span>

                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Thiết bị được kiểm tra
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Thiết bị được kiểm tra tình trạng trước khi bàn giao.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Headphones
                  size={18}
                  aria-hidden="true"
              />
            </span>

                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Hỗ trợ trong quá trình thuê
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Hỗ trợ xử lý sự cố và hướng dẫn sử dụng thiết bị.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck
                  size={18}
                  aria-hidden="true"
              />
            </span>

                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Thông tin được bảo mật
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                                Thông tin yêu cầu chỉ được dùng để xử lý giao dịch thuê.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </aside>
    );
};