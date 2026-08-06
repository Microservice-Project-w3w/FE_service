import { z } from "zod";

export const customerRentalRequestSchema =
    z
        .object({
            startDate: z
                .string()
                .min(1, "Vui lòng chọn ngày bắt đầu"),

            endDate: z
                .string()
                .min(1, "Vui lòng chọn ngày kết thúc"),

            quantity: z
                .number({
                    error:
                        "Số lượng phải là một số hợp lệ",
                })
                .int(
                    "Số lượng phải là số nguyên",
                )
                .min(
                    1,
                    "Số lượng tối thiểu là 1",
                ),

            deliveryMethod: z.enum([
                "PICKUP_AT_BRANCH",
                "DELIVERY_TO_ADDRESS",
            ]),

            deliveryAddress: z.string(),

            contactName: z
                .string()
                .trim()
                .min(
                    2,
                    "Tên người liên hệ phải có ít nhất 2 ký tự",
                ),

            contactPhone: z
                .string()
                .trim()
                .regex(
                    /^(0|\+84)[0-9]{9}$/,
                    "Số điện thoại không đúng định dạng",
                ),

            note: z
                .string()
                .trim()
                .max(
                    500,
                    "Ghi chú không được vượt quá 500 ký tự",
                ),
        })
        .superRefine((values, context) => {
            const startDate = new Date(
                values.startDate,
            );

            const endDate = new Date(
                values.endDate,
            );

            if (
                values.startDate &&
                values.endDate &&
                endDate < startDate
            ) {
                context.addIssue({
                    code: "custom",
                    path: ["endDate"],
                    message:
                        "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu",
                });
            }

            if (
                values.deliveryMethod ===
                "DELIVERY_TO_ADDRESS" &&
                !values.deliveryAddress.trim()
            ) {
                context.addIssue({
                    code: "custom",
                    path: ["deliveryAddress"],
                    message:
                        "Vui lòng nhập địa chỉ giao thiết bị",
                });
            }
        });

export type CustomerRentalRequestSchema =
    z.infer<
        typeof customerRentalRequestSchema
    >;