import {
    LoaderCircle,
    Phone,
    Save,
    UserRound,
    X,
} from "lucide-react";

import {
    useEffect,
    useState,
    type ComponentProps,
} from "react";

import type {
    AuthUser,
} from "@/modules/auth";

import {
    BusinessProfileFields,
} from "./BusinessProfileFields";

import {
    ProfileFormField,
} from "./ProfileFormField";

interface EditProfileValues {
    fullName: string;
    phone: string;
    companyName?: string;
    taxCode?: string;
}

interface EditProfileDialogProps {
    user: AuthUser;

    onClose: () => void;

    onSave: (
        values: EditProfileValues,
    ) => Promise<void>;
}

type FormSubmitHandler = NonNullable<
    ComponentProps<"form">["onSubmit"]
>;

export const EditProfileDialog = ({
                                      user,
                                      onClose,
                                      onSave,
                                  }: EditProfileDialogProps) => {
    const [
        fullName,
        setFullName,
    ] = useState(
        user.fullName,
    );

    const [
        phone,
        setPhone,
    ] = useState(
        user.phone,
    );

    const [
        companyName,
        setCompanyName,
    ] = useState(
        user.companyName ?? "",
    );

    const [
        taxCode,
        setTaxCode,
    ] = useState(
        user.taxCode ?? "",
    );

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    useEffect(() => {
        const handleKeyDown = (
            event: KeyboardEvent,
        ): void => {
            if (
                event.key === "Escape" &&
                !isSaving
            ) {
                onClose();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [
        isSaving,
        onClose,
    ]);

    const handleSubmit: FormSubmitHandler =
        async (event) => {
            event.preventDefault();

            setError("");

            const normalizedName =
                fullName.trim();

            const normalizedPhone =
                phone.trim();

            if (
                normalizedName.length < 2
            ) {
                setError(
                    "Họ và tên phải có ít nhất 2 ký tự.",
                );

                return;
            }

            if (
                normalizedPhone.length < 8
            ) {
                setError(
                    "Số điện thoại chưa hợp lệ.",
                );

                return;
            }

            setIsSaving(true);

            try {
                await onSave({
                    fullName:
                    normalizedName,

                    phone:
                    normalizedPhone,

                    companyName:
                        user.accountType ===
                        "business"
                            ? companyName.trim()
                            : undefined,

                    taxCode:
                        user.accountType ===
                        "business"
                            ? taxCode.trim()
                            : undefined,
                });

                onClose();
            } catch (caughtError) {
                setError(
                    caughtError
                    instanceof Error
                        ? caughtError.message
                        : "Không thể cập nhật hồ sơ.",
                );
            } finally {
                setIsSaving(false);
            }
        };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 backdrop-blur-[2px]"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget &&
                    !isSaving
                ) {
                    onClose();
                }
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
                <header className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-950">
                            Chỉnh sửa hồ sơ
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            Cập nhật thông tin cá nhân của bạn.
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={onClose}
                        aria-label="Đóng"
                        className="flex size-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X size={17} />
                    </button>
                </header>

                <div className="space-y-4 px-6 py-5">
                    <ProfileFormField
                        icon={UserRound}
                        label="Họ và tên"
                    >
                        <input
                            type="text"
                            autoFocus
                            value={fullName}
                            onChange={(event) =>
                                setFullName(
                                    event.target.value,
                                )
                            }
                            placeholder="Nhập họ và tên"
                            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </ProfileFormField>

                    <ProfileFormField
                        icon={Phone}
                        label="Số điện thoại"
                    >
                        <input
                            type="tel"
                            value={phone}
                            onChange={(event) =>
                                setPhone(
                                    event.target.value,
                                )
                            }
                            placeholder="Nhập số điện thoại"
                            className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </ProfileFormField>

                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                            Email
                        </label>

                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="h-10 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500"
                        />

                        <p className="mt-1 text-[10px] text-slate-400">
                            Email đăng nhập chưa hỗ trợ thay đổi tại đây.
                        </p>
                    </div>

                    {user.accountType ===
                    "business" ? (
                        <BusinessProfileFields
                            companyName={
                                companyName
                            }
                            taxCode={
                                taxCode
                            }
                            onCompanyNameChange={
                                setCompanyName
                            }
                            onTaxCodeChange={
                                setTaxCode
                            }
                        />
                    ) : null}

                    {error ? (
                        <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700">
                            {error}
                        </div>
                    ) : null}
                </div>

                <footer className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={onClose}
                        className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Hủy
                    </button>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold !text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSaving ? (
                            <LoaderCircle
                                size={15}
                                className="animate-spin"
                            />
                        ) : (
                            <Save size={15} />
                        )}

                        {isSaving
                            ? "Đang lưu..."
                            : "Lưu thay đổi"}
                    </button>
                </footer>
            </form>
        </div>
    );
};