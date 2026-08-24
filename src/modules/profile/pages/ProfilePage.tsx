import {
    ArrowLeft,
    Building2,
    CheckCircle2,
    Mail,
    Pencil,
    Phone,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import {
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

import {
    EditProfileDialog,
} from "@/modules/profile/components/EditProfileDialog";

import {
    ProfileCard,
    ProfileInfo,
} from "@/modules/profile/components/ProfileInfo";

export const ProfilePage = () => {
    const navigate =
        useNavigate();

    const user = useAuthStore(
        (state) => state.user,
    );

    const updateProfile =
        useAuthStore(
            (state) =>
                state.updateProfile,
        );

    const [
        editDialogOpen,
        setEditDialogOpen,
    ] = useState(false);

    const [
        updateSuccess,
        setUpdateSuccess,
    ] = useState(false);

    if (!user) {
        return (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                    Không tìm thấy thông tin tài khoản.
                </p>
            </section>
        );
    }

    const initials =
        user.fullName
            .trim()
            .split(/\s+/)
            .slice(-2)
            .map((part) =>
                part
                    .charAt(0)
                    .toUpperCase(),
            )
            .join("");

    const accountTypeLabel =
        user.accountType ===
        "business"
            ? "Tài khoản doanh nghiệp"
            : "Tài khoản cá nhân";

    const handleBack = (): void => {
        navigate(-1);
    };

    return (
        <>
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
                            <h1 className="text-[26px] font-bold tracking-tight text-slate-950">
                                Hồ sơ cá nhân
                            </h1>

                            <p className="mt-1 text-xs text-slate-500">
                                Xem và cập nhật thông tin cá nhân, thông tin tài khoản của bạn.
                            </p>
                        </div>
                    </div>
                </header>

                {updateSuccess ? (
                    <section className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
                        <CheckCircle2
                            size={16}
                        />

                        Thông tin hồ sơ đã được cập nhật thành công.
                    </section>
                ) : null}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="flex size-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-xl font-bold text-white shadow-lg">
              {initials || "ND"}
            </span>

                        <div className="min-w-0 flex-1">
                            <h2 className="truncate text-xl font-bold text-slate-950">
                                {user.fullName}
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {
                                    USER_ROLE_LABELS[
                                        user.role
                                        ]
                                }
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700">
                  {
                      USER_ROLE_LABELS[
                          user.role
                          ]
                  }
                </span>

                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
                  Đang hoạt động
                </span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setUpdateSuccess(
                                    false,
                                );

                                setEditDialogOpen(
                                    true,
                                );
                            }}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 text-xs font-bold text-blue-600 transition hover:bg-blue-50"
                        >
                            <Pencil
                                size={14}
                            />

                            Chỉnh sửa hồ sơ
                        </button>
                    </div>
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                    <ProfileCard
                        title="Thông tin cá nhân"
                    >
                        <ProfileInfo
                            icon={UserRound}
                            label="Họ và tên"
                            value={
                                user.fullName
                            }
                        />

                        <ProfileInfo
                            icon={Mail}
                            label="Email"
                            value={
                                user.email
                            }
                        />

                        <ProfileInfo
                            icon={Phone}
                            label="Số điện thoại"
                            value={
                                user.phone
                            }
                        />

                        <ProfileInfo
                            icon={ShieldCheck}
                            label="Mã tài khoản"
                            value={
                                user.id
                            }
                        />
                    </ProfileCard>

                    <ProfileCard
                        title="Thông tin tài khoản"
                    >
                        <ProfileInfo
                            icon={ShieldCheck}
                            label="Vai trò"
                            value={
                                USER_ROLE_LABELS[
                                    user.role
                                    ]
                            }
                        />

                        <ProfileInfo
                            icon={UserRound}
                            label="Loại tài khoản"
                            value={
                                accountTypeLabel
                            }
                        />

                        {user.companyName ? (
                            <ProfileInfo
                                icon={Building2}
                                label="Tên doanh nghiệp"
                                value={
                                    user.companyName
                                }
                            />
                        ) : null}

                        {user.taxCode ? (
                            <ProfileInfo
                                icon={Building2}
                                label="Mã số thuế"
                                value={
                                    user.taxCode
                                }
                            />
                        ) : null}
                    </ProfileCard>
                </section>
            </main>

            {editDialogOpen ? (
                <EditProfileDialog
                    user={user}
                    onClose={() =>
                        setEditDialogOpen(
                            false,
                        )
                    }
                    onSave={async (
                        values,
                    ) => {
                        await updateProfile(
                            values,
                        );

                        setUpdateSuccess(
                            true,
                        );
                    }}
                />
            ) : null}
        </>
    );
};