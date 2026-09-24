import {
  Building2,
  ChevronDown,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useNavigate,
} from "react-router";

import {
  USER_ROLE_LABELS,
} from "@/core/auth/roleLabels";

import {
  useAuthStore,
} from "@/modules/auth";

import { ConfirmDialog } from "@/shared/components/feedback";

const getInitials = (
  fullName: string,
): string => {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join("");

  return initials || "ND";
};

export const AccountMenu = () => {
  const navigate = useNavigate();

  const containerRef =
    useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [
    logoutDialogOpen,
    setLogoutDialogOpen,
  ] = useState(false);

  const user = useAuthStore(
    (state) => state.user,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  const isLoggingOut = useAuthStore(
    (state) => state.isLoggingOut,
  );

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handlePointerDown = (
      event: MouseEvent,
    ): void => {
      const target =
        event.target as Node;

      if (
        containerRef.current &&
        !containerRef.current.contains(
          target,
        )
      ) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (
      event: KeyboardEvent,
    ): void => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handlePointerDown,
    );

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      );

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [menuOpen]);

  const handleLogout =
    async (): Promise<void> => {
      await logout();

      setLogoutDialogOpen(false);
      setMenuOpen(false);

      navigate("/login", {
        replace: true,
      });
    };

  const displayName =
    user?.fullName ?? "Người dùng";

  const displayEmail =
    user?.email ?? "";

  const displayRole =
    user
      ? USER_ROLE_LABELS[user.role]
      : "Người dùng";

  const accountLabel =
    user?.accountType === "business"
      ? "Tài khoản doanh nghiệp"
      : "Tài khoản cá nhân";

  return (
    <>
      <div
        ref={containerRef}
        className="relative"
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() =>
            setMenuOpen(
              (current) => !current,
            )
          }
          className={[
            "group flex items-center gap-3 rounded-2xl border px-2 py-1.5",
            "transition duration-200",
            menuOpen
              ? "border-blue-200 bg-blue-50/70 shadow-sm"
              : "border-transparent hover:border-slate-200 hover:bg-slate-50",
          ].join(" ")}
        >
          <span className="relative flex size-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-sm font-bold text-white shadow-[0_8px_20px_rgba(37,99,235,0.25)]">
            {getInitials(displayName)}

            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-emerald-500" />
          </span>

          <span className="hidden min-w-0 text-left sm:block">
            <strong className="block max-w-44 truncate text-sm font-semibold text-slate-900">
              {displayName}
            </strong>

            <span className="mt-0.5 block max-w-44 truncate text-xs text-slate-500">
              {displayRole}
            </span>
          </span>

          <ChevronDown
            size={16}
            className={[
              "hidden text-slate-400 transition-transform duration-200 sm:block",
              menuOpen
                ? "rotate-180 text-blue-600"
                : "group-hover:text-slate-600",
            ].join(" ")}
          />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="animate-account-menu-in absolute right-0 top-[calc(100%+12px)] z-50 w-[310px] origin-top-right overflow-hidden rounded-[22px] border border-slate-200/90 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]"
          >
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 px-5 py-5 text-white">
              <div className="absolute -right-12 -top-14 size-36 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 -left-10 size-32 rounded-full bg-white/10" />

              <div className="relative flex items-center gap-4">
                <span className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-base font-bold shadow-inner backdrop-blur">
                  {getInitials(displayName)}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">
                    {displayName}
                  </p>

                  <p className="mt-1 truncate text-xs text-blue-100">
                    {displayEmail}
                  </p>
                </div>
              </div>

              <div className="relative mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-medium backdrop-blur">
                  <ShieldCheck size={13} />
                  {displayRole}
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-medium backdrop-blur">
                  <Building2 size={13} />
                  {accountLabel}
                </span>
              </div>
            </section>

            <div className="p-2.5">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profile");
                }}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
                  <UserRound size={18} />
                </span>

                <span>
                  <strong className="block text-sm font-semibold text-slate-800">
                    Hồ sơ cá nhân
                  </strong>

                  <span className="mt-0.5 block text-[11px] text-slate-400">
                    Xem và cập nhật thông tin
                  </span>
                </span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings");
                }}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-slate-50"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-100">
                  <Settings size={18} />
                </span>

                <span>
                  <strong className="block text-sm font-semibold text-slate-800">
                    Cài đặt tài khoản
                  </strong>

                  <span className="mt-0.5 block text-[11px] text-slate-400">
                    Bảo mật và tùy chọn cá nhân
                  </span>
                </span>
              </button>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/60 p-2.5">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setLogoutDialogOpen(true);
                }}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-red-50"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-red-50 text-red-600 transition group-hover:bg-red-100">
                  <LogOut size={18} />
                </span>

                <span>
                  <strong className="block text-sm font-semibold text-red-600">
                    Đăng xuất
                  </strong>

                  <span className="mt-0.5 block text-[11px] text-slate-400">
                    Kết thúc phiên làm việc hiện tại
                  </span>
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={logoutDialogOpen}
        title="Đăng xuất khỏi hệ thống?"
        description={`Bạn đang đăng nhập với tài khoản ${displayEmail}. Bạn có chắc chắn muốn đăng xuất không?`}
        confirmLabel="Đăng xuất"
        cancelLabel="Ở lại"
        isLoading={isLoggingOut}
        onCancel={() =>
          setLogoutDialogOpen(false)
        }
        onConfirm={handleLogout}
      />
    </>
  );
};
