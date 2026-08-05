import {
  AlertTriangle,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

interface EmployeeActionConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const EmployeeActionConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel,
  isSubmitting = false,
  onClose,
  onConfirm,
}: EmployeeActionConfirmDialogProps) => {
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

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Đóng hộp thoại"
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (!isSubmitting) {
            onClose();
          }
        }}
      />

      <section className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          type="button"
          aria-label="Đóng"
          disabled={isSubmitting}
          onClick={onClose}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
        >
          <X size={19} />
        </button>

        <span className="flex size-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle size={23} />
        </span>

        <h2 className="mt-5 text-xl font-bold text-slate-950">
          {title}
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="h-11 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
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
