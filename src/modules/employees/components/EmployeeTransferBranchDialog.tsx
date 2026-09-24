import {
  Building2,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  Employee,
} from "@/modules/employees/types/employee.types";

interface BranchOption {
  id: string;
  name: string;
}

interface EmployeeTransferBranchDialogProps {
  isOpen: boolean;
  employee: Employee | null;
  branches: BranchOption[];
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (
    branchId: string,
    branchName: string,
  ) => void;
}

export const EmployeeTransferBranchDialog = ({
  isOpen,
  employee,
  branches,
  isSubmitting,
  onClose,
  onConfirm,
}: EmployeeTransferBranchDialogProps) => {
  const [
    selectedBranchId,
    setSelectedBranchId,
  ] = useState("");

  useEffect(() => {
    if (
      isOpen &&
      employee
    ) {
      setSelectedBranchId(
        employee.branchId,
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

  const selectedBranch =
    branches.find(
      (branch) =>
        branch.id ===
        selectedBranchId,
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
          <Building2 size={22} />
        </span>

        <h2 className="mt-5 text-xl font-bold text-slate-950">
          Chuyển chi nhánh
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Nhân viên:{" "}
          <strong className="text-slate-800">
            {employee.fullName}
          </strong>
        </p>

        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Chi nhánh hiện tại
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {employee.branchName}
          </p>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-slate-700">
            Chi nhánh mới
          </span>

          <select
            value={selectedBranchId}
            onChange={(event) => {
              setSelectedBranchId(
                event.target.value,
              );
            }}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {branches.map(
              (branch) => (
                <option
                  key={branch.id}
                  value={branch.id}
                >
                  {branch.name}
                </option>
              ),
            )}
          </select>
        </label>

        {employee.status ===
          "RESIGNED" && (
          <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Không thể chuyển chi nhánh
            cho nhân viên đã nghỉ việc.
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
              employee.status ===
                "RESIGNED" ||
              !selectedBranch ||
              selectedBranchId ===
                employee.branchId
            }
            onClick={() => {
              if (selectedBranch) {
                onConfirm(
                  selectedBranch.id,
                  selectedBranch.name,
                );
              }
            }}
            className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Đang chuyển..."
              : "Xác nhận chuyển"}
          </button>
        </div>
      </section>
    </div>
  );
};
