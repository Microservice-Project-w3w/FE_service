import {
    LogOut,
    Mail,
    Monitor,
    ShieldCheck,
    type LucideIcon,
} from "lucide-react";

import {
    USER_ROLE_LABELS,
} from "@/core/auth/roleLabels";

import type {
    AuthUser,
} from "@/modules/auth";

interface AccountSessionCardProps {
    user: AuthUser;
    isLoggingOut: boolean;
    onLogout: () => void;
}

export const AccountSessionCard = ({
                                       user,
                                       isLoggingOut,
                                       onLogout,
                                   }: AccountSessionCardProps) => {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Monitor size={18} />
          </span>

                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            Phiên đăng nhập
                        </h2>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                            Thông tin phiên làm việc hiện tại.
                        </p>
                    </div>
                </div>
            </header>

            <div className="space-y-4 p-5">
                <SessionInfo
                    icon={Mail}
                    label="Email đăng nhập"
                    value={user.email}
                />

                <SessionInfo
                    icon={ShieldCheck}
                    label="Vai trò"
                    value={
                        USER_ROLE_LABELS[
                            user.role
                            ]
                    }
                />

                <SessionInfo
                    icon={Monitor}
                    label="Thiết bị"
                    value="Trình duyệt hiện tại"
                />

                <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-3">
                    <div>
                        <p className="text-xs font-bold text-emerald-700">
                            Đang hoạt động
                        </p>

                        <p className="mt-0.5 text-[10px] text-emerald-600">
                            Phiên đăng nhập hiện tại
                        </p>
                    </div>

                    <span className="size-2.5 rounded-full bg-emerald-500" />
                </div>

                <button
                    type="button"
                    disabled={isLoggingOut}
                    onClick={onLogout}
                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <LogOut size={15} />

                    {isLoggingOut
                        ? "Đang đăng xuất..."
                        : "Đăng xuất khỏi phiên này"}
                </button>
            </div>
        </article>
    );
};

const SessionInfo = ({
                         icon: Icon,
                         label,
                         value,
                     }: {
    icon: LucideIcon;
    label: string;
    value: string;
}) => {
    return (
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        <Icon size={15} />
      </span>

            <div className="min-w-0">
                <p className="text-[10px] text-slate-400">
                    {label}
                </p>

                <p className="mt-0.5 break-words text-sm font-semibold text-slate-800">
                    {value}
                </p>
            </div>
        </div>
    );
};