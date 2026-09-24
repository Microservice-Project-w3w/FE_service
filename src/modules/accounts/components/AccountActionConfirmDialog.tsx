import {
  AlertTriangle,
  KeyRound,
  LoaderCircle,
  Trash2,
  X,
} from "lucide-react";
import { useEffect } from "react";

type AccountActionTone =
  | "WARNING"
  | "DANGER"
  | "PRIMARY";

interface AccountActionConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: AccountActionTone;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

const toneConfig: Record<
  AccountActionTone,
  {
    iconClassName: string;
    buttonClassName: string;
  }
> = {
  WARNING: {
    iconClassName:
      "bg-amber-50 text-amber-600",
    buttonClassName:
      "bg-amber-500 hover:bg-amber-600 shadow-amber-200",
  },

  DANGER: {
    iconClassName:
      "bg-rose-50 text-rose-600",
    buttonClassName:
      "bg-rose-600 hover:bg-rose-700 shadow-rose-200",
  },

  PRIMARY: {
    iconClassName:
      "bg-blue-50 text-blue-600",
    buttonClassName:
      "bg-blue-600 hover:bg-blue-700 shadow-blue-200",
  },
};

export const AccountActionConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel,
  tone = "WARNING",
  isLoading,
  onCancel,
  onConfirm,
}: AccountActionConfirmDialogProps) => {
  const config = toneConfig[tone];

  useEffect(() => {
    if (!open) {
      return;
    }

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
        onCancel();
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
    onCancel,
  ]);

  if (!open) {
    return null;
  }

  const Icon =
    tone === "DANGER"
      ? Trash2
      : tone === "PRIMARY"
        ? KeyRound
        : AlertTriangle;

  return (
    <div
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isLoading
        ) {
          onCancel();
        }
      }}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]"
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="account-action-title"
        aria-describedby="account-action-description"
        className="w-full max-w-md overflow-hidden rounded-[26px] border border-white/60 bg-white shadow-[0_35px_100px_rgba(15,23,42,0.3)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-4">
            <span
              className={[
                "flex size-12 shrink-0 items-center justify-center rounded-2xl",
                config.iconClassName,
              ].join(" ")}
            >
              <Icon size={23} />
            </span>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Xác nhận thao tác
              </p>

              <h2
                id="account-action-title"
                className="mt-1 text-lg font-bold text-slate-950"
              >
                {title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đóng hộp thoại"
            disabled={isLoading}
            onClick={onCancel}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </header>

        <div className="px-6 py-5">
          <p
            id="account-action-description"
            className="text-sm leading-6 text-slate-600"
          >
            {description}
          </p>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/80 px-6 py-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="h-10 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              void onConfirm();
            }}
            className={[
              "flex h-10 min-w-32 items-center justify-center gap-2 rounded-xl",
              "px-5 text-sm font-bold text-white shadow-lg transition",
              "hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60",
              config.buttonClassName,
            ].join(" ")}
          >
            {isLoading && (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            )}

            {isLoading
              ? "Đang xử lý..."
              : confirmLabel}
          </button>
        </footer>
      </section>
    </div>
  );
};
