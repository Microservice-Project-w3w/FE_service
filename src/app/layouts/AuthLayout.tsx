import {
  Outlet,
  useLocation,
} from "react-router";

import { AuthBrand } from "@/modules/auth/components/AuthBrand";
import { AuthShowcase } from "@/modules/auth/components/AuthShowcase";

export const AuthLayout = () => {
  const location = useLocation();

  const isRegister =
    location.pathname === "/register";

  return (
    <div
      className={[
        "auth-page min-h-screen bg-white lg:grid",
        isRegister
          ? "lg:grid-cols-[48%_52%]"
          : "lg:grid-cols-[43%_57%]",
      ].join(" ")}
    >
      <section className="relative flex min-h-screen flex-col overflow-hidden bg-white px-5 py-6 sm:px-10 lg:px-12 xl:px-16">
        <div className="auth-glow pointer-events-none absolute -left-32 top-1/3 size-80 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="auth-glow pointer-events-none absolute -bottom-32 right-0 size-72 rounded-full bg-indigo-100/40 blur-3xl" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "radial-gradient(#2563eb 1px, transparent 1px)",
            backgroundSize:
              "28px 28px",
          }}
        />

        <header className="relative z-10 animate-fade-in">
          <AuthBrand />
        </header>

        <main className="relative z-10 flex flex-1 items-center justify-center py-9 lg:py-12">
          <div
            key={location.pathname}
            className={[
              "auth-page-enter w-full",
              isRegister
                ? "max-w-[760px]"
                : "max-w-[540px]",
            ].join(" ")}
          >
            <Outlet />
          </div>
        </main>

        <footer className="relative z-10 flex items-center justify-between border-t border-slate-100 pt-5 text-[11px] text-slate-400">
          <span>© 2026 RentAI Manager</span>

          <span className="hidden sm:block">
            Bảo mật · Tin cậy · Hiệu quả
          </span>
        </footer>
      </section>

      <div className="hidden min-h-screen lg:block">
        <AuthShowcase
          variant={
            isRegister
              ? "register"
              : "login"
          }
        />
      </div>
    </div>
  );
};
