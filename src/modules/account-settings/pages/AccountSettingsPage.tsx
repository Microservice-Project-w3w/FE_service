import {
    ArrowLeft,
    Settings,
    ShieldCheck,
} from "lucide-react";

import {
    useNavigate,
} from "react-router";

import {
    useAuthStore,
} from "@/modules/auth";

import {
    AccountSessionCard,
} from "../components/AccountSessionCard";

import {
    ChangePasswordForm,
} from "../components/ChangePasswordForm";

export const AccountSettingsPage = () => {
    const navigate =
        useNavigate();

    const user =
        useAuthStore(
            (state) => state.user,
        );

    const logout =
        useAuthStore(
            (state) => state.logout,
        );

    const isLoggingOut =
        useAuthStore(
            (state) =>
                state.isLoggingOut,
        );

    if (!user) {
        return (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                    Không tìm thấy thông tin tài khoản.
                </p>
            </section>
        );
    }

    const handleLogout =
        async (): Promise<void> => {
            await logout();

            navigate(
                "/login",
                {
                    replace: true,
                },
            );
        };

    const handleBack = (): void => {
        navigate(-1);
    };

    return (
        <main className="space-y-4">
            <header>
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={handleBack}
                        aria-label="Trở lại"
                        title="Trở lại"
                        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <ArrowLeft
                            size={17}
                        />
                    </button>

                    <div>
                        <div className="flex items-center gap-2">
                            <Settings
                                size={25}
                                className="text-blue-600"
                            />

                            <h1 className="text-[26px] font-bold tracking-tight text-slate-950">
                                Cài đặt tài khoản
                            </h1>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                            Quản lý bảo mật và phiên đăng nhập của tài khoản.
                        </p>
                    </div>
                </div>
            </header>

            <section className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
            <ShieldCheck
                size={17}
            />
          </span>

                    <div>
                        <p className="text-xs font-bold text-slate-800">
                            Bảo mật tài khoản
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                            Nên sử dụng mật khẩu mạnh và không chia sẻ thông tin đăng nhập với người khác.
                        </p>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
                <ChangePasswordForm />

                <AccountSessionCard
                    user={user}
                    isLoggingOut={
                        isLoggingOut
                    }
                    onLogout={
                        handleLogout
                    }
                />
            </section>
        </main>
    );
};