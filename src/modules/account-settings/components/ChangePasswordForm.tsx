import {
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    LoaderCircle,
    LockKeyhole,
} from "lucide-react";

import {
    useState,
    type ComponentProps,
} from "react";

import {
    useAuthStore,
} from "@/modules/auth";

type FormSubmitHandler =
    NonNullable<
        ComponentProps<"form">["onSubmit"]
    >;

interface PasswordFieldProps {
    label: string;
    value: string;
    placeholder: string;
    showPassword: boolean;
    autoComplete:
        | "current-password"
        | "new-password";
    onChange: (
        value: string,
    ) => void;
    onToggle: () => void;
}

export const ChangePasswordForm = () => {
    const changePassword =
        useAuthStore(
            (state) =>
                state.changePassword,
        );

    const [
        currentPassword,
        setCurrentPassword,
    ] = useState("");

    const [
        newPassword,
        setNewPassword,
    ] = useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [
        showCurrentPassword,
        setShowCurrentPassword,
    ] = useState(false);

    const [
        showNewPassword,
        setShowNewPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState(false);

    const handleSubmit:
        FormSubmitHandler =
        async (event) => {
            event.preventDefault();

            setError("");
            setSuccess(false);

            if (!currentPassword) {
                setError(
                    "Vui lòng nhập mật khẩu hiện tại.",
                );
                return;
            }

            if (
                currentPassword.length < 8
            ) {
                setError(
                    "Mật khẩu hiện tại phải có ít nhất 8 ký tự.",
                );
                return;
            }

            if (!newPassword) {
                setError(
                    "Vui lòng nhập mật khẩu mới.",
                );
                return;
            }

            if (
                newPassword.length < 8
            ) {
                setError(
                    "Mật khẩu mới phải có ít nhất 8 ký tự.",
                );
                return;
            }

            if (!confirmPassword) {
                setError(
                    "Vui lòng xác nhận mật khẩu mới.",
                );
                return;
            }

            if (
                newPassword !==
                confirmPassword
            ) {
                setError(
                    "Xác nhận mật khẩu mới không khớp.",
                );
                return;
            }

            if (
                currentPassword ===
                newPassword
            ) {
                setError(
                    "Mật khẩu mới phải khác mật khẩu hiện tại.",
                );
                return;
            }

            setIsSaving(true);

            try {
                await changePassword({
                    currentPassword,
                    newPassword,
                });

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");

                setSuccess(true);
            } catch (caughtError) {
                setError(
                    caughtError
                    instanceof Error
                        ? caughtError.message
                        : "Không thể đổi mật khẩu.",
                );
            } finally {
                setIsSaving(false);
            }
        };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <header className="border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <KeyRound size={18} />
          </span>

                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            Đổi mật khẩu
                        </h2>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                            Cập nhật mật khẩu đăng nhập của bạn.
                        </p>
                    </div>
                </div>
            </header>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 p-5"
            >
                <PasswordField
                    label="Mật khẩu hiện tại"
                    value={currentPassword}
                    placeholder="Nhập mật khẩu hiện tại"
                    showPassword={
                        showCurrentPassword
                    }
                    autoComplete="current-password"
                    onChange={
                        setCurrentPassword
                    }
                    onToggle={() =>
                        setShowCurrentPassword(
                            (current) =>
                                !current,
                        )
                    }
                />

                <PasswordField
                    label="Mật khẩu mới"
                    value={newPassword}
                    placeholder="Tối thiểu 8 ký tự"
                    showPassword={
                        showNewPassword
                    }
                    autoComplete="new-password"
                    onChange={
                        setNewPassword
                    }
                    onToggle={() =>
                        setShowNewPassword(
                            (current) =>
                                !current,
                        )
                    }
                />

                <PasswordField
                    label="Xác nhận mật khẩu mới"
                    value={confirmPassword}
                    placeholder="Nhập lại mật khẩu mới"
                    showPassword={
                        showConfirmPassword
                    }
                    autoComplete="new-password"
                    onChange={
                        setConfirmPassword
                    }
                    onToggle={() =>
                        setShowConfirmPassword(
                            (current) =>
                                !current,
                        )
                    }
                />

                {error ? (
                    <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700">
                        {error}
                    </div>
                ) : null}

                {success ? (
                    <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700">
                        <CheckCircle2
                            size={15}
                        />

                        Đổi mật khẩu thành công.
                    </div>
                ) : null}

                <div className="flex justify-end pt-1">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-bold !text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? (
                            <LoaderCircle
                                size={15}
                                className="animate-spin"
                            />
                        ) : (
                            <LockKeyhole
                                size={15}
                            />
                        )}

                        {isSaving
                            ? "Đang cập nhật..."
                            : "Đổi mật khẩu"}
                    </button>
                </div>
            </form>
        </article>
    );
};

const PasswordField = ({
                           label,
                           value,
                           placeholder,
                           showPassword,
                           autoComplete,
                           onChange,
                           onToggle,
                       }: PasswordFieldProps) => {
    return (
        <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                {label}
            </label>

            <div className="relative">
                <input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    value={value}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={false}
                    onChange={(event) => {
                        onChange(
                            event.currentTarget
                                .value,
                        );
                    }}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <button
                    type="button"
                    aria-label={
                        showPassword
                            ? "Ẩn mật khẩu"
                            : "Hiện mật khẩu"
                    }
                    onClick={onToggle}
                    className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                    {showPassword ? (
                        <EyeOff size={15} />
                    ) : (
                        <Eye size={15} />
                    )}
                </button>
            </div>
        </div>
    );
};