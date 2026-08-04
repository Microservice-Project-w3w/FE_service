import {
  AlertTriangle,
  LoaderCircle,
  X,
} from "lucide-react";
import { useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  isLoading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {
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
      className="animate-dialog-backdrop-in fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-[3px]"
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="animate-dialog-card-in w-full max-w-md overflow-hidden rounded-[26px] border border-white/70 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.25)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle size={24} />
            </span>

            <div>
              <h2
                id="confirm-dialog-title"
                className="text-lg font-bold text-slate-950"
              >
                {title}
              </h2>

              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                Xác nhận thao tác
              </p>
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
            id="confirm-dialog-description"
            className="text-sm leading-6 text-slate-600"
          >
            {description}
          </p>

          <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3">
            <p className="text-xs leading-5 text-amber-800">
              Phiên đăng nhập hiện tại sẽ kết thúc.
              Bạn cần đăng nhập lại để tiếp tục sử dụng hệ thống.
            </p>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="h-10 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => {
              void onConfirm();
            }}
            className="flex h-10 min-w-28 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(220,38,38,0.22)] transition hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            )}

            {confirmLabel}
          </button>
        </footer>
      </section>
    </div>
  );
};
