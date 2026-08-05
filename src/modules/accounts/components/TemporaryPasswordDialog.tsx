import {
  Check,
  Copy,
  KeyRound,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

interface TemporaryPasswordDialogProps {
  open: boolean;
  accountName: string;
  password: string;
  onClose: () => void;
}

export const TemporaryPasswordDialog = ({
  open,
  accountName,
  password,
  onClose,
}: TemporaryPasswordDialogProps) => {
  const [copied, setCopied] =
    useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setCopied(false);

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ): void => {
      if (event.key === "Escape") {
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
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const handleCopy =
    async (): Promise<void> => {
      try {
        await navigator.clipboard.writeText(
          password,
        );

        setCopied(true);

        window.setTimeout(() => {
          setCopied(false);
        }, 1800);
      } catch {
        setCopied(false);
      }
    };

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="temporary-password-title"
        className="w-full max-w-md overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_35px_100px_rgba(15,23,42,0.3)]"
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
                id="temporary-password-title"
                className="mt-1 text-lg font-bold text-slate-950"
              >
                Mật khẩu tạm thời
              </h2>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </header>

        <div className="px-6 py-6">
          <p className="text-sm leading-6 text-slate-600">
            Mật khẩu của tài khoản{" "}
            <strong className="text-slate-900">
              {accountName}
            </strong>{" "}
            đã được đặt lại.
          </p>

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-500">
              Mật khẩu mới
            </p>

            <div className="mt-2 flex items-center gap-3">
              <code className="min-w-0 flex-1 break-all rounded-xl bg-white px-4 py-3 text-base font-bold text-blue-800 shadow-sm">
                {password}
              </code>

              <button
                type="button"
                aria-label="Sao chép mật khẩu"
                onClick={() => {
                  void handleCopy();
                }}
                className={[
                  "flex size-12 shrink-0 items-center justify-center rounded-xl",
                  "border text-sm font-bold transition",
                  copied
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-blue-200 bg-white text-blue-700 hover:bg-blue-100",
                ].join(" ")}
              >
                {copied ? (
                  <Check size={19} />
                ) : (
                  <Copy size={19} />
                )}
              </button>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Hãy gửi mật khẩu này cho người dùng bằng kênh an toàn.
            Người dùng nên đổi mật khẩu ngay sau khi đăng nhập.
          </p>
        </div>

        <footer className="border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-11 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5"
          >
            Hoàn tất
          </button>
        </footer>
      </section>
    </div>
  );
};
