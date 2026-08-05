import {
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  RefreshCcw,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

interface ResetPasswordDialogProps {
  open: boolean;
  accountName: string;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: (
    password: string,
  ) => Promise<void>;
}

const generatePassword = (): string => {
  const randomPart = Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase();

  return `RentAI@${randomPart}`;
};

export const ResetPasswordDialog = ({
  open,
  accountName,
  isLoading,
  onClose,
  onConfirm,
}: ResetPasswordDialogProps) => {
  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setPassword(generatePassword());
    setShowPassword(false);
    setErrorMessage(null);

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ): void => {
      if (
        event.key === "Escape" &&
        !isLoading
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    isLoading,
    onClose,
  ]);

  if (!open) {
    return null;
  }

  const handleSubmit =
    async (): Promise<void> => {
      const normalizedPassword =
        password.trim();

      if (
        normalizedPassword.length < 8
      ) {
        setErrorMessage(
          "Mật khẩu phải có ít nhất 8 ký tự.",
        );

        return;
      }

      setErrorMessage(null);

      await onConfirm(
        normalizedPassword,
      );
    };

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isLoading
        ) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[115] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-password-title"
        className="w-full max-w-lg overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_35px_100px_rgba(15,23,42,0.3)]"
      >
        <header className="flex items-start justify-between border-b border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white shadow-lg shadow-blue-200">
              <KeyRound size={23} />
            </span>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Đặt lại mật khẩu
              </p>

              <h2
                id="reset-password-title"
                className="mt-1 text-xl font-bold text-slate-950"
              >
                Nhập mật khẩu mới
              </h2>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            disabled={isLoading}
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </header>

        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-slate-600">
            Đặt mật khẩu tạm thời mới cho tài khoản{" "}
            <strong className="text-slate-900">
              {accountName}
            </strong>
            .
          </p>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-slate-700">
              Mật khẩu mới
            </span>

            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  disabled={isLoading}
                  onChange={(event) => {
                    setPassword(
                      event.target.value,
                    );

                    setErrorMessage(null);
                  }}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-sm font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Ẩn mật khẩu"
                      : "Hiện mật khẩu"
                  }
                  onClick={() => {
                    setShowPassword(
                      (current) =>
                        !current,
                    );
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <button
                type="button"
                title="Tạo mật khẩu ngẫu nhiên"
                aria-label="Tạo mật khẩu ngẫu nhiên"
                disabled={isLoading}
                onClick={() => {
                  setPassword(
                    generatePassword(),
                  );

                  setShowPassword(true);
                  setErrorMessage(null);
                }}
                className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-700 transition hover:bg-blue-100"
              >
                <RefreshCcw size={18} />
              </button>
            </div>

            {errorMessage && (
              <span className="mt-2 block text-xs font-semibold text-red-600">
                {errorMessage}
              </span>
            )}

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Mật khẩu phải có tối thiểu 8 ký tự. Có thể nhập thủ công
              hoặc dùng nút tạo mật khẩu ngẫu nhiên.
            </p>
          </label>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="h-11 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              void handleSubmit();
            }}
            className="flex h-11 min-w-40 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 disabled:opacity-60"
          >
            {isLoading && (
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
            )}

            {isLoading
              ? "Đang đặt lại..."
              : "Xác nhận mật khẩu"}
          </button>
        </footer>
      </section>
    </div>
  );
};
