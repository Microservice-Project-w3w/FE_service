import {
  AlertTriangle,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

interface SettingsResetDialogProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SettingsResetDialog = ({
  isOpen,
  isSubmitting,
  onClose,
  onConfirm,
}: SettingsResetDialogProps) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Đóng hộp thoại"
        disabled={isSubmitting}
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative z-10 w-full max-w-md rounded-2xl border border-white/60 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle size={21} />
          </div>

          <button
            type="button"
            aria-label="Đóng"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Khôi phục cấu hình mặc định?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Toàn bộ thay đổi cấu hình đang lưu
          trong localStorage sẽ được thay bằng
          dữ liệu mẫu ban đầu.
        </p>

        <div className="mt-7 flex justify-end gap-3">
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
            className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Đang khôi phục..."
              : "Khôi phục"}
          </button>
        </div>
      </section>
    </div>
  );
};
