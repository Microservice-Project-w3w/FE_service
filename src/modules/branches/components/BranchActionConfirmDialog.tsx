import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

interface BranchActionConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  tone?: "WARNING" | "DANGER";
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const BranchActionConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  tone = "WARNING",
  isSubmitting,
  onClose,
  onConfirm,
}: BranchActionConfirmDialogProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape" &&
        !isSubmitting
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
    isOpen,
    isSubmitting,
    onClose,
  ]);

  if (!isOpen) {
    return null;
  }

  const isDanger = tone === "DANGER";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Đóng hộp thoại"
        className="absolute inset-0"
        disabled={isSubmitting}
        onClick={onClose}
      />

      <section className="relative z-10 w-full max-w-md rounded-3xl border border-white/60 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div
            className={[
              "flex size-12 shrink-0 items-center justify-center rounded-2xl",
              isDanger
                ? "bg-rose-50 text-rose-600"
                : "bg-amber-50 text-amber-600",
            ].join(" ")}
          >
            {isDanger ? (
              <Trash2 size={22} />
            ) : (
              <AlertTriangle size={22} />
            )}
          </div>

          <button
            type="button"
            aria-label="Đóng"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {message}
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className={[
              "h-11 rounded-xl px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50",
              isDanger
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-blue-600 hover:bg-blue-700",
            ].join(" ")}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
};
