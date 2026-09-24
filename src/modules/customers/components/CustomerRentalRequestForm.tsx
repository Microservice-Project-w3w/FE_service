import { zodResolver } from "@hookform/resolvers/zod";
import {
    CalendarDays,
    MapPin,
    Minus,
    Package,
    Plus,
    Send,
    Truck,
    UserRound,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
    customerRentalRequestSchema,
    type CustomerRentalRequestSchema,
} from "../schemas/customerRentalRequest.schema";

interface RentalRequestPreview {
    startDate: string;
    endDate: string;
    quantity: number;
}

interface CustomerRentalRequestFormProps {
    branchName: string;
    availableQuantity: number;
    isSubmitting?: boolean;
    onCancel: () => void;
    onPreviewChange: (
        preview: RentalRequestPreview,
    ) => void;
    onSubmit: (
        values: CustomerRentalRequestSchema,
    ) => void | Promise<void>;
}

const getTodayValue = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(
        today.getMonth() + 1,
    ).padStart(2, "0");
    const day = String(
        today.getDate(),
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const CustomerRentalRequestForm = ({
                                              branchName,
                                              availableQuantity,
                                              isSubmitting = false,
                                              onCancel,
                                              onPreviewChange,
                                              onSubmit,
                                          }: CustomerRentalRequestFormProps) => {
    const today = getTodayValue();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<CustomerRentalRequestSchema>({
        resolver: zodResolver(
            customerRentalRequestSchema,
        ),
        defaultValues: {
            startDate: "",
            endDate: "",
            quantity: 1,
            deliveryMethod: "PICKUP_AT_BRANCH",
            deliveryAddress: "",
            contactName: "",
            contactPhone: "",
            note: "",
        },
    });

    const startDate = watch("startDate");
    const endDate = watch("endDate");
    const watchedQuantity = watch("quantity");
    const deliveryMethod = watch(
        "deliveryMethod",
    );

    const quantity = Number.isFinite(
        watchedQuantity,
    )
        ? watchedQuantity
        : 1;

    useEffect(() => {
        onPreviewChange({
            startDate,
            endDate,
            quantity,
        });
    }, [
        startDate,
        endDate,
        quantity,
        onPreviewChange,
    ]);

    const updateQuantity = (
        nextQuantity: number,
    ): void => {
        const safeQuantity = Math.min(
            Math.max(nextQuantity, 1),
            availableQuantity,
        );

        setValue("quantity", safeQuantity, {
            shouldValidate: true,
            shouldDirty: true,
        });

        clearErrors("quantity");
    };

    const handleValidSubmit = async (
        values: CustomerRentalRequestSchema,
    ): Promise<void> => {
        if (
            values.quantity > availableQuantity
        ) {
            setError("quantity", {
                type: "manual",
                message:
                    `Số lượng tối đa có thể thuê là ${availableQuantity}`,
            });

            return;
        }

        const currentDate = new Date(
            `${today}T00:00:00`,
        );
        const selectedStartDate = new Date(
            `${values.startDate}T00:00:00`,
        );

        if (
            selectedStartDate < currentDate
        ) {
            setError("startDate", {
                type: "manual",
                message:
                    "Ngày bắt đầu không được nhỏ hơn ngày hiện tại",
            });

            return;
        }

        await onSubmit(values);
    };

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
            <div>
                <h2 className="text-lg font-bold text-slate-950">
                    Thông tin yêu cầu
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Vui lòng điền đầy đủ thông tin để gửi
                    yêu cầu thuê thiết bị.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(
                    handleValidSubmit,
                )}
                className="mt-6 space-y-6"
            >
                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <CalendarDays
                            size={18}
                            className="text-blue-600"
                        />

                        <h3 className="text-sm font-bold text-slate-900">
                            Thời gian thuê
                        </h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Ngày bắt đầu{" "}
                  <span className="text-red-500">
                  *
                </span>
              </span>

                            <input
                                type="date"
                                min={today}
                                {...register("startDate")}
                                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                            {errors.startDate && (
                                <span className="mt-1.5 block text-xs font-medium text-red-600">
                  {errors.startDate.message}
                </span>
                            )}
                        </label>

                        <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Ngày kết thúc{" "}
                  <span className="text-red-500">
                  *
                </span>
              </span>

                            <input
                                type="date"
                                min={startDate || today}
                                {...register("endDate")}
                                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                            {errors.endDate && (
                                <span className="mt-1.5 block text-xs font-medium text-red-600">
                  {errors.endDate.message}
                </span>
                            )}
                        </label>
                    </div>
                </div>

                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <Package
                            size={18}
                            className="text-blue-600"
                        />

                        <h3 className="text-sm font-bold text-slate-900">
                            Số lượng thiết bị
                        </h3>
                    </div>

                    <div className="flex max-w-64 items-center rounded-xl border border-slate-200 p-1">
                        <button
                            type="button"
                            disabled={
                                quantity <= 1 ||
                                isSubmitting
                            }
                            onClick={() => {
                                updateQuantity(quantity - 1);
                            }}
                            className="flex size-9 items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-40"
                        >
                            <Minus size={17} />
                        </button>

                        <input
                            type="number"
                            min={1}
                            max={availableQuantity}
                            {...register("quantity", {
                                valueAsNumber: true,
                            })}
                            className="h-9 min-w-0 flex-1 bg-transparent text-center text-sm font-bold outline-none"
                        />

                        <button
                            type="button"
                            disabled={
                                quantity >=
                                availableQuantity ||
                                isSubmitting
                            }
                            onClick={() => {
                                updateQuantity(quantity + 1);
                            }}
                            className="flex size-9 items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-40"
                        >
                            <Plus size={17} />
                        </button>
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                        Tối đa{" "}
                        <strong>
                            {availableQuantity}
                        </strong>{" "}
                        thiết bị.
                    </p>

                    {errors.quantity && (
                        <span className="mt-1.5 block text-xs font-medium text-red-600">
              {errors.quantity.message}
            </span>
                    )}
                </div>

                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <Truck
                            size={18}
                            className="text-blue-600"
                        />

                        <h3 className="text-sm font-bold text-slate-900">
                            Hình thức nhận thiết bị
                        </h3>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <label
                            className={[
                                "cursor-pointer rounded-xl border p-4 transition",
                                deliveryMethod ===
                                "PICKUP_AT_BRANCH"
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-slate-200",
                            ].join(" ")}
                        >
                            <input
                                type="radio"
                                value="PICKUP_AT_BRANCH"
                                {...register(
                                    "deliveryMethod",
                                )}
                                className="sr-only"
                            />

                            <div className="flex gap-3">
                                <MapPin
                                    size={20}
                                    className="text-blue-600"
                                />

                                <div>
                                    <p className="text-sm font-bold">
                                        Nhận tại chi nhánh
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Nhận trực tiếp tại{" "}
                                        {branchName}.
                                    </p>
                                </div>
                            </div>
                        </label>

                        <label
                            className={[
                                "cursor-pointer rounded-xl border p-4 transition",
                                deliveryMethod ===
                                "DELIVERY_TO_ADDRESS"
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-slate-200",
                            ].join(" ")}
                        >
                            <input
                                type="radio"
                                value="DELIVERY_TO_ADDRESS"
                                {...register(
                                    "deliveryMethod",
                                )}
                                className="sr-only"
                            />

                            <div className="flex gap-3">
                                <Truck
                                    size={20}
                                    className="text-blue-600"
                                />

                                <div>
                                    <p className="text-sm font-bold">
                                        Giao tận nơi
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Phí giao nhận xác nhận sau.
                                    </p>
                                </div>
                            </div>
                        </label>
                    </div>

                    {deliveryMethod ===
                        "DELIVERY_TO_ADDRESS" && (
                            <label className="mt-4 block">
              <span className="text-sm font-medium text-slate-700">
                Địa chỉ giao hàng{" "}
                  <span className="text-red-500">
                  *
                </span>
              </span>

                                <input
                                    type="text"
                                    {...register(
                                        "deliveryAddress",
                                    )}
                                    placeholder="Nhập địa chỉ giao thiết bị"
                                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                                />

                                {errors.deliveryAddress && (
                                    <span className="mt-1.5 block text-xs font-medium text-red-600">
                  {
                      errors.deliveryAddress
                          .message
                  }
                </span>
                                )}
                            </label>
                        )}
                </div>

                <div>
                    <div className="mb-3 flex items-center gap-2">
                        <UserRound
                            size={18}
                            className="text-blue-600"
                        />

                        <h3 className="text-sm font-bold text-slate-900">
                            Thông tin liên hệ
                        </h3>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <label>
              <span className="text-sm font-medium text-slate-700">
                Người liên hệ *
              </span>

                            <input
                                type="text"
                                {...register("contactName")}
                                placeholder="Nhập họ và tên"
                                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                            {errors.contactName && (
                                <span className="mt-1.5 block text-xs text-red-600">
                  {errors.contactName.message}
                </span>
                            )}
                        </label>

                        <label>
              <span className="text-sm font-medium text-slate-700">
                Số điện thoại *
              </span>

                            <input
                                type="tel"
                                {...register(
                                    "contactPhone",
                                )}
                                placeholder="Ví dụ: 0912345678"
                                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />

                            {errors.contactPhone && (
                                <span className="mt-1.5 block text-xs text-red-600">
                  {
                      errors.contactPhone
                          .message
                  }
                </span>
                            )}
                        </label>
                    </div>
                </div>

                <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Ghi chú
          </span>

                    <textarea
                        rows={4}
                        maxLength={500}
                        {...register("note")}
                        placeholder="Nhập yêu cầu hoặc lưu ý thêm..."
                        className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    {errors.note && (
                        <span className="mt-1.5 block text-xs text-red-600">
              {errors.note.message}
            </span>
                    )}
                </label>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={onCancel}
                        className="h-11 rounded-xl border border-slate-300 px-6 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50"
                    >
                        Hủy bỏ
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                        <Send size={17} />

                        {isSubmitting
                            ? "Đang gửi..."
                            : "Gửi yêu cầu thuê"}
                    </button>
                </div>
            </form>
        </section>
    );
};