import {
  CheckCircle2,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  ManagerQuotation,
} from "@/modules/quotations/types/manager-quotation-approval.types";

export type QuotationDecisionAction =
  | "APPROVE"
  | "REJECT";

interface ManagerQuotationDecisionDialogProps {
  quotation:
    ManagerQuotation | null;
  action:
    QuotationDecisionAction | null;
  isSubmitting: boolean;
  errorMessage: string | null;

  onClose: () => void;
  onSubmit: (
    value: string,
  ) => void;
}

export const ManagerQuotationDecisionDialog = ({
  quotation,
  action,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: ManagerQuotationDecisionDialogProps) => {
  const [
    value,
    setValue,
  ] = useState("");

  useEffect(() => {
    setValue("");
  }, [
    quotation?.id,
    action,
  ]);

  if (
    !quotation ||
    !action
  ) {
    return null;
  }

  const isReject =
    action === "REJECT";

  const title = isReject
    ? "Từ chối báo giá"
    : "Phê duyệt báo giá";

  const description = isReject
    ? "Lý do từ chối sẽ được lưu vào lịch sử xử lý và gửi lại cho nhân viên lập báo giá."
    : "Xác nhận báo giá đã được kiểm tra đầy đủ trước khi phê duyệt.";

  const handleSubmit = () => {
    if (
      isReject &&
      !value.trim()
    ) {
      return;
    }

    onSubmit(value);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Đóng hộp thoại"
        onClick={
          isSubmitting
            ? undefined
            : onClose
        }
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />

      <section className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="flex gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2
                size={21}
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {title}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {
                  quotation.quotationCode
                }
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </header>

        <div className="px-6 py-5">
          <p className="text-sm leading-6 text-slate-600">
            {description}
          </p>

          <label className="mt-5 block">
            <span className="text-sm font-semibold text-slate-700">
              {isReject
                ? "Lý do từ chối *"
                : "Ghi chú phê duyệt"}
            </span>

            <textarea
              value={value}
              disabled={isSubmitting}
              onChange={(event) =>
                setValue(
                  event.target.value,
                )
              }
              rows={4}
              placeholder={
                isReject
                  ? "Nhập lý do từ chối báo giá..."
                  : "Nhập ghi chú nếu cần..."
              }
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </label>

          {isReject &&
            !value.trim() && (
              <p className="mt-2 text-xs text-slate-500">
                Bắt buộc nhập lý do khi từ chối.
              </p>
            )}

          {errorMessage && (
            <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {errorMessage}
            </p>
          )}
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={
              isSubmitting ||
              (isReject &&
                !value.trim())
            }
            onClick={handleSubmit}
            className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : isReject
                ? "Xác nhận từ chối"
                : "Xác nhận phê duyệt"}
          </button>
        </footer>
      </section>
    </div>
  );
};
