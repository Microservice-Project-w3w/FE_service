import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(
      5,
      "Vui lòng nhập email hoặc số điện thoại",
    ),

  password: z
    .string()
    .min(
      8,
      "Mật khẩu phải có ít nhất 8 ký tự",
    ),

  rememberMe: z.boolean(),
});

export type LoginFormValues =
  z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    accountType: z.enum([
      "personal",
      "business",
    ]),

    fullName: z
      .string()
      .trim()
      .min(
        2,
        "Vui lòng nhập họ và tên",
      ),

    email: z
      .string()
      .trim()
      .email("Email không hợp lệ"),

    phone: z
      .string()
      .trim()
      .regex(
        /^(0|\+84)[0-9]{9}$/,
        "Số điện thoại không hợp lệ",
      ),

    password: z
      .string()
      .min(
        8,
        "Mật khẩu phải có ít nhất 8 ký tự",
      ),

    confirmPassword: z
      .string()
      .min(
        1,
        "Vui lòng xác nhận mật khẩu",
      ),

    companyName: z.string().trim(),
    taxCode: z.string().trim(),

    agreeTerms: z.boolean().refine(
      (value) => value,
      "Bạn cần đồng ý với quy định sử dụng",
    ),

    receiveNews: z.boolean(),
  })
  .superRefine((data, context) => {
    if (
      data.password !==
      data.confirmPassword
    ) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message:
          "Mật khẩu xác nhận không khớp",
      });
    }

    if (
      data.accountType === "business" &&
      data.companyName.length < 2
    ) {
      context.addIssue({
        code: "custom",
        path: ["companyName"],
        message:
          "Vui lòng nhập tên công ty",
      });
    }

    if (
      data.accountType === "business" &&
      data.taxCode.length < 8
    ) {
      context.addIssue({
        code: "custom",
        path: ["taxCode"],
        message:
          "Mã số thuế không hợp lệ",
      });
    }
  });

export type RegisterFormValues =
  z.infer<typeof registerSchema>;
