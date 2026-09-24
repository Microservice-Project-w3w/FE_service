import {
  Ban,
  CalendarPlus,
  PackageCheck,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ManagerRental,
} from "@/modules/rentals/types/manager-rental.types";

export type ManagerRentalAction =
  | "RESERVE"
  | "EXTEND"
  | "CANCEL";

export interface ManagerRentalActionFormValue {
  note: string;
  newEndDate: string;
}

interface ManagerRentalActionDialogProps {
  rental: ManagerRental | null;
  action: ManagerRentalAction | null;
  isSubmitting: boolean;
  errorMessage: string | null;

  onClose: () => void;

  onSubmit: (
    value: ManagerRentalActionFormValue,
  ) => void;
}

const toDateTimeLocalValue = (
  value: string,
) => {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  const localDate =
    new Date(
      date.getTime() -
        date.getTimezoneOffset() *
          60_000,
    );

  return localDate
    .toISOString()
    .slice(0, 16);
};

export const ManagerRentalActionDialog = ({
  rental,
  action,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: ManagerRentalActionDialogProps) => {
  const [
    note,
    setNote,
  ] = useState("");

  const [
    newEndDate,
    setNewEndDate,
  ] = useState("");

  useEffect(() => {
    setNote("");

    setNewEndDate(
      rental
        ? toDateTimeLocalValue(
            rental.rentalEndDate,
          )
        : "",
    );
  }, [
    action,
    rental,
  ]);

  useEffect(() => {
    if (
      !rental ||
      !action
    ) {
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

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    action,
    isSubmitting,
    onClose,
    rental,
  ]);

  const configuration =
    useMemo(() => {
      switch (action) {
        case "RESERVE":
          return {
            title:
              "Xác nhận giữ chỗ thiết bị",

            description:
              "Xác nhận số lượng thiết bị đã được giữ cho đơn thuê này.",

            submitLabel:
              "Xác nhận giữ chỗ",

            icon: PackageCheck,
          };

        case "EXTEND":
          return {
            title:
              "Gia hạn đơn thuê",

            description:
              "Chọn thời gian kết thúc mới. Thời gian mới phải sau thời gian kết thúc hiện tại.",

            submitLabel:
              "Xác nhận gia hạn",

            icon: CalendarPlus,
          };

        case "CANCEL":
          return {
            title:
              "Hủy đơn thuê",

            description:
              "Việc hủy đơn sẽ giải phóng toàn bộ thiết bị đang giữ chỗ.",

            submitLabel:
              "Xác nhận hủy đơn",

            icon: Ban,
          };

        default:
          return null;
      }
    }, [action]);

  if (
    !rental ||
    !action ||
    !configuration
  ) {
    return null;
  }

  const Icon =
    configuration.icon;

  const requiresNote =
    action === "CANCEL";

  const requiresNewEndDate =
    action === "EXTEND";

  const isSubmitDisabled =
    isSubmitting ||
    (
      requiresNote &&
      !note.trim()
    ) ||
    (
      requiresNewEndDate &&
      !newEndDate
    );

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      return;
    }

    onSubmit({
      note: note.trim(),
      newEndDate,
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Đóng hộp thoại"
        disabled={isSubmitting}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
      />

      <section className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="flex items-start gap-3">
            <div
              className={[
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                action === "CANCEL"
                  ? "bg-rose-50 text-rose-600"
                  : "bg-blue-50 text-blue-600",
              ].join(" ")}
            >
              <Icon size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {
                  configuration.title
                }
              </h2>

              <p className="mt-1 text-sm font-medium text-blue-700">
                {rental.rentalCode}
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

        <div className="space-y-5 px-6 py-5">
          <p className="text-sm leading-6 text-slate-600">
            {
              configuration.description
            }
          </p>

          {action === "EXTEND" && (
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Thời gian kết thúc mới *
              </span>

              <input
                type="datetime-local"
                value={newEndDate}
                disabled={isSubmitting}
                min={toDateTimeLocalValue(
                  rental.rentalEndDate,
                )}
                onChange={(event) =>
                  setNewEndDate(
                    event.target.value,
                  )
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                Thời gian hiện tại:{" "}
                {new Date(
                  rental.rentalEndDate,
                ).toLocaleString(
                  "vi-VN",
                )}
              </p>
            </label>
          )}

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              {action === "CANCEL"
                ? "Lý do hủy đơn *"
                : "Ghi chú"}
            </span>

            <textarea
              rows={4}
              value={note}
              disabled={isSubmitting}
              onChange={(event) =>
                setNote(
                  event.target.value,
                )
              }
              placeholder={
                action === "CANCEL"
                  ? "Nhập lý do hủy đơn thuê..."
                  : action === "EXTEND"
                    ? "Nhập lý do hoặc ghi chú gia hạn..."
                    : "Nhập ghi chú giữ chỗ nếu cần..."
              }
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            />
          </label>

          {requiresNote &&
            !note.trim() && (
              <p className="text-xs text-slate-500">
                Bắt buộc nhập lý do khi hủy đơn.
              </p>
            )}

          {errorMessage && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
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
            Đóng
          </button>

          <button
            type="button"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
            className={[
              "h-11 rounded-xl px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50",
              action === "CANCEL"
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-blue-600 hover:bg-blue-700",
            ].join(" ")}
          >
            {isSubmitting
              ? "Đang xử lý..."
              : configuration.submitLabel}
          </button>
        </footer>
      </section>
    </div>
  );
};
