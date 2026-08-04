import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MessageSquareText,
  Phone,
  ShieldCheck,
  UserPlus,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useNavigate,
} from "react-router";

import {
  registerSchema,
  type RegisterFormValues,
} from "@/modules/auth/schemas/auth.schema";
import { useAuthStore } from "@/modules/auth/store/auth.store";

export const RegisterPage = () => {
  const navigate = useNavigate();

  const registerAccount =
    useAuthStore(
      (state) =>
        state.registerAccount,
    );

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      accountType: "personal",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      taxCode: "",
      agreeTerms: false,
      receiveNews: true,
    },
  });

  const accountType =
    watch("accountType");

  const onSubmit = async (
    values: RegisterFormValues,
  ): Promise<void> => {
    try {
      await registerAccount({
        accountType:
          values.accountType,
        fullName:
          values.fullName,
        email:
          values.email,
        phone:
          values.phone,
        password:
          values.password,
        companyName:
          values.companyName,
        taxCode:
          values.taxCode,
      });

      navigate("/login", {
        replace: true,

        state: {
          registered: true,
          identifier:
            values.email,
        },
      });
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Không thể đăng ký tài khoản.",
      });
    }
  };

  return (
    <section className="auth-card rounded-[28px] p-7 sm:p-9">
      <header className="text-center">
        <div className="flex items-center justify-center gap-3">
          <UserPlus
            size={34}
            className="text-blue-600"
          />

          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Đăng ký tài khoản
          </h1>
        </div>

        <p className="mt-3 text-sm text-slate-500">
          Tạo tài khoản để bắt đầu thuê và quản lý thiết bị dễ dàng
        </p>
      </header>

      <div className="mt-7 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() =>
            setValue(
              "accountType",
              "personal",
              {
                shouldValidate: true,
              },
            )
          }
          className={[
            "flex h-12 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition",
            accountType === "personal"
              ? "border-blue-500 bg-blue-50 text-blue-600"
              : "border-slate-200 text-slate-600 hover:bg-slate-50",
          ].join(" ")}
        >
          <UserRound size={18} />
          Cá nhân
        </button>

        <button
          type="button"
          onClick={() =>
            setValue(
              "accountType",
              "business",
              {
                shouldValidate: true,
              },
            )
          }
          className={[
            "flex h-12 items-center justify-center gap-2 rounded-lg border text-sm font-medium transition",
            accountType === "business"
              ? "border-blue-500 bg-blue-50 text-blue-600"
              : "border-slate-200 text-slate-600 hover:bg-slate-50",
          ].join(" ")}
        >
          <Building2 size={18} />
          Doanh nghiệp
        </button>
      </div>

      {errors.root && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.root.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6"
      >
        <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="fullName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Họ và tên
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <UserRound
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="fullName"
                type="text"
                placeholder="Nhập họ và tên của bạn"
                {...register("fullName")}
                className="h-11 w-full rounded-lg border border-slate-300 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="registerEmail"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="registerEmail"
                type="email"
                placeholder="name@email.com"
                {...register("email")}
                className="h-11 w-full rounded-lg border border-slate-300 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Số điện thoại
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <Phone
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                {...register("phone")}
                className="h-11 w-full rounded-lg border border-slate-300 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="registerPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Mật khẩu
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="registerPassword"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Tối thiểu 8 ký tự"
                {...register("password")}
                className="h-11 w-full rounded-lg border border-slate-300 pl-11 pr-11 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Xác nhận mật khẩu
              <span className="ml-1 text-red-500">*</span>
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                placeholder="Nhập lại mật khẩu"
                {...register("confirmPassword")}
                className="h-11 w-full rounded-lg border border-slate-300 pl-11 pr-11 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {accountType === "business" && (
          <section className="mt-6">
            <div className="flex items-center gap-4">
              <span className="h-px flex-1 bg-slate-200" />

              <p className="text-xs font-medium text-slate-500">
                Thông tin doanh nghiệp
              </p>

              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="companyName"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Tên công ty
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="companyName"
                    type="text"
                    placeholder="Nhập tên công ty"
                    {...register("companyName")}
                    className="h-11 w-full rounded-lg border border-slate-300 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {errors.companyName && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="taxCode"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Mã số thuế
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                    #
                  </span>

                  <input
                    id="taxCode"
                    type="text"
                    placeholder="Nhập mã số thuế"
                    {...register("taxCode")}
                    className="h-11 w-full rounded-lg border border-slate-300 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {errors.taxCode && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.taxCode.message}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        <div className="mt-5 space-y-2.5">
          <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-600">
            <input
              type="checkbox"
              {...register("agreeTerms")}
              className="mt-0.5 size-4 shrink-0 accent-blue-600"
            />

            <span>
              Tôi đã đọc và đồng ý với{" "}
              <strong className="font-medium text-blue-600">
                Quy định sử dụng
              </strong>{" "}
              và{" "}
              <strong className="font-medium text-blue-600">
                Chính sách bảo mật
              </strong>{" "}
              của RentAI Manager
            </span>
          </label>

          {errors.agreeTerms && (
            <p className="text-xs text-red-600">
              {errors.agreeTerms.message}
            </p>
          )}

          <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-slate-600">
            <input
              type="checkbox"
              {...register("receiveNews")}
              className="mt-0.5 size-4 shrink-0 accent-blue-600"
            />

            Tôi đồng ý nhận thông tin, ưu đãi và cập nhật từ
            RentAI Manager qua email, SMS
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="auth-primary-button mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
        >
          <UserPlus size={18} />
          Tạo tài khoản
        </button>

        <button
          type="button"
          className="mt-2.5 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-blue-500 bg-white text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          <MessageSquareText size={18} />
          Đăng ký bằng mã xác thực
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Đã có tài khoản?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Đăng nhập
        </Link>
      </p>

      <footer className="mt-6 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
        {[
          {
            icon: ShieldCheck,
            title: "Bảo mật dữ liệu",
            description: "Mã hóa dữ liệu 256-bit",
            className: "text-blue-600",
          },
          {
            icon: LockKeyhole,
            title: "Thông tin an toàn",
            description: "Không chia sẻ bên thứ ba",
            className: "text-red-500",
          },
          {
            icon: ShieldCheck,
            title: "Xác thực bảo mật",
            description: "Mã xác thực và kiểm soát truy cập",
            className: "text-purple-600",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className="flex items-start gap-3"
            >
              <Icon
                size={21}
                className={item.className}
              />

              <div>
                <p className="text-xs font-bold text-slate-700">
                  {item.title}
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  {item.description}
                </p>
              </div>
            </article>
          );
        })}
      </footer>
    </section>
  );
};
