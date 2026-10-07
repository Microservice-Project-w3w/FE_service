import { createSafeDateFormatter } from "@/shared/utils/dateFormat";

export const liveInputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800";
export const liveButtonClass =
  "rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold !text-white disabled:opacity-50";
export const formatLiveDate = (value?: string | null) =>
  value
    ? createSafeDateFormatter("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date(value))
    : "Chưa có thông tin";
export const formatLiveMoney = (value: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    value,
  );
