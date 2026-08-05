import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";

import {
  getRoleHomePath,
} from "@/core/auth/roleHome";

import {
  loginSchema,
  type LoginFormValues,
} from "@/modules/auth/schemas/auth.schema";
import { useAuthStore } from "@/modules/auth/store/auth.store";

interface LoginLocationState {
  registered?: boolean;
  identifier?: string;
  from?: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    location.state as LoginLocationState | null;

  const [showPassword, setShowPassword] =
    useState(false);

  const login = useAuthStore(
    (authState) => authState.login,
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      identifier:
        state?.identifier ?? "",
      password: "",
      rememberMe: true,
    },
  });

  const onSubmit = async (
    values: LoginFormValues,
  ): Promise<void> => {
    try {
      await login(values);

      const authenticatedUser =
        useAuthStore.getState().user;

      const destination =
        state?.from ??
        (
          authenticatedUser
            ? getRoleHomePath(
                authenticatedUser.role,
              )
            : "/"
        );

      navigate(
        destination,
        {
          replace: true,
        },
      );
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Không thể đăng nhập.",
      });
    }
  };

  return (
    <div>
      <section className="auth-card rounded-[28px] p-7 sm:p-10">
        <header>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Đăng nhập hệ thống
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
            Quản lý hoạt động cho thuê thiết bị hiệu quả,
            minh bạch và tối ưu.
          </p>
        </header>

        {state?.registered && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Đăng ký tài khoản thành công. Bạn có thể đăng nhập.
          </div>
        )}

        {errors.root && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.root.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="identifier"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Email hoặc số điện thoại
            </label>

            <div className="relative">
              <UserRound
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder="Nhập email hoặc số điện thoại"
                {...register("identifier")}
                className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-12 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {errors.identifier && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.identifier.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="loginPassword"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Mật khẩu
            </label>

            <div className="relative">
              <LockKeyhole
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="loginPassword"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                placeholder="Nhập mật khẩu"
                {...register("password")}
                className="h-12 w-full rounded-lg border border-slate-300 bg-white pl-12 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <button
                type="button"
                aria-label={
                  showPassword
                    ? "Ẩn mật khẩu"
                    : "Hiện mật khẩu"
                }
                onClick={() =>
                  setShowPassword(
                    (current) => !current,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="size-4 rounded accent-blue-600"
              />

              Ghi nhớ đăng nhập
            </label>

            <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="auth-primary-button flex h-12 w-full items-center justify-center rounded-xl px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Đăng nhập
          </button>

          <button
            type="button"
            className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ShieldCheck
              size={19}
              className="text-blue-600"
            />

            Đăng nhập bằng mã xác thực
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Đăng ký tài khoản
          </Link>
        </p>
      </section>

      <section className="mt-5 flex items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <ShieldCheck size={23} />
        </span>

        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Bảo mật đăng nhập đa lớp
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Tài khoản của bạn được bảo vệ bằng mã hóa dữ liệu,
            xác thực nhiều lớp và các lớp bảo mật tiên tiến.
          </p>
        </div>
      </section>
    </div>
  );
};
