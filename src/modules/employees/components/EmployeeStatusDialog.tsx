import {
  RefreshCcw,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  Employee,
  EmployeeStatus,
} from "@/modules/employees/types/employee.types";

interface EmployeeStatusDialogProps {
  isOpen: boolean;
  employee: Employee | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (
    status: EmployeeStatus,
  ) => void;
}

const statusOptions: Array<{
  value: EmployeeStatus;
  label: string;
  description: string;
}> = [
  {
    value: "ACTIVE",
    label: "Đang làm việc",
    description:
      "Nhân viên đang làm việc bình thường trong hệ thống.",
  },
  {
    value: "ON_LEAVE",
    label: "Tạm nghỉ",
    description:
      "Nhân viên đang nghỉ phép hoặc tạm ngừng làm việc.",
  },
  {
    value: "RESIGNED",
    label: "Đã nghỉ việc",
    description:
      "Nhân viên đã kết thúc công việc tại doanh nghiệp.",
  },
];

export const EmployeeStatusDialog = ({
  isOpen,
  employee,
  isSubmitting,
  onClose,
  onConfirm,
}: EmployeeStatusDialogProps) => {
  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState<EmployeeStatus>(
    "ACTIVE",
  );

  useEffect(() => {
    if (
      isOpen &&
      employee
    ) {
      setSelectedStatus(
        employee.status,
      );
    }
  }, [
    employee,
    isOpen,
  ]);

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

  if (
    !isOpen ||
    !employee
  ) {
    return null;
  }

  const selectedOption =
    statusOptions.find(
      (option) =>
        option.value ===
        selectedStatus,
    );

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
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

      <section className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          type="button"
          aria-label="Đóng"
          disabled={isSubmitting}
          onClick={onClose}
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={19} />
        </button>

        <span className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <RefreshCcw size={22} />
        </span>

        <h2 className="mt-5 text-xl font-bold text-slate-950">
          Cập nhật trạng thái
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Nhân viên:{" "}
          <strong className="text-slate-800">
            {employee.fullName}
          </strong>
        </p>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-slate-700">
            Trạng thái mới
          </span>

          <select
            value={selectedStatus}
            onChange={(event) => {
              setSelectedStatus(
                event.target
                  .value as EmployeeStatus,
              );
            }}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {statusOptions.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ),
            )}
          </select>
        </label>

        <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          {selectedOption?.description}
        </p>

        {selectedStatus ===
          "RESIGNED" && (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-700">
            Sau khi chuyển sang trạng
            thái đã nghỉ việc, nhân viên
            không thể được phân công vào
            nghiệp vụ mới.
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={
              isSubmitting ||
              selectedStatus ===
                employee.status
            }
            onClick={() => {
              onConfirm(
                selectedStatus,
              );
            }}
            className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Đang cập nhật..."
              : "Cập nhật"}
          </button>
        </div>
      </section>
    </div>
  );
};
