import {
  Home,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import {
  useNavigate,
} from "react-router";

import {
  getRoleHomePath,
} from "@/core/auth/roleHome";

import {
  useAuthStore,
} from "@/modules/auth/store/auth.store";

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const user = useAuthStore(
    (state) => state.user,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  const isLoggingOut =
    useAuthStore(
      (state) =>
        state.isLoggingOut,
    );

  const handleGoHome = (): void => {
    if (!user) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    navigate(
      getRoleHomePath(user.role),
      {
        replace: true,
      },
    );
  };

  const handleLogout =
    async (): Promise<void> => {
      await logout();

      navigate("/login", {
        replace: true,
      });
    };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50 sm:p-10">
        <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-600">
          <ShieldAlert
            size={32}
            aria-hidden="true"
          />
        </span>

        <h1 className="mt-6 text-3xl font-bold text-slate-950">
          Không có quyền truy cập
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Tài khoản của bạn không được phép truy cập khu vực này.
          Hãy quay về trang làm việc được phân quyền cho tài khoản.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleGoHome}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Home size={18} />
            Về trang của tôi
          </button>

          <button
            type="button"
            disabled={isLoggingOut}
            onClick={() => {
              void handleLogout();
            }}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={18} />
            {isLoggingOut
              ? "Đang đăng xuất..."
              : "Đăng xuất"}
          </button>
        </div>
      </section>
    </main>
  );
};
