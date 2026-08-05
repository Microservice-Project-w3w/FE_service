import {
  UserRoundCog,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import type {
  Branch,
} from "@/modules/branches/types/branch.types";

export interface BranchManagerOption {
  id: string;
  fullName: string;
  email: string;
  positionLabel: string;
  assignedBranchId: string | null;
  assignedBranchName: string | null;
}

interface BranchManagerDialogProps {
  branch: Branch | null;
  isOpen: boolean;
  managers: BranchManagerOption[];
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: (
    manager: BranchManagerOption | null,
  ) => void;
}

export const BranchManagerDialog = ({
  branch,
  isOpen,
  managers,
  isSubmitting,
  errorMessage,
  onClose,
  onConfirm,
}: BranchManagerDialogProps) => {
  const [
    selectedManagerId,
    setSelectedManagerId,
  ] = useState("NONE");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedManagerId(
      branch?.managerEmployeeId ??
        "NONE",
    );
  }, [
    branch,
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

  if (!isOpen || !branch) {
    return null;
  }

  const handleConfirm = () => {
    if (
      selectedManagerId === "NONE"
    ) {
      onConfirm(null);
      return;
    }

    const selectedManager =
      managers.find(
        (manager) =>
          manager.id === selectedManagerId,
      );

    if (selectedManager) {
      onConfirm(selectedManager);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Đóng"
        disabled={isSubmitting}
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative z-10 w-full max-w-xl rounded-3xl bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <UserRoundCog size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Gán quản lý chi nhánh
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {branch.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </header>

        <div className="px-6 py-6">
          {errorMessage && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {errorMessage}
            </div>
          )}

          <label className="text-sm font-semibold text-slate-700">
            Nhân viên quản lý

            <select
              value={selectedManagerId}
              onChange={(event) =>
                setSelectedManagerId(
                  event.target.value,
                )
              }
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="NONE">
                Chưa gán quản lý
              </option>

              {managers.map((manager) => {
                const assignedElsewhere =
                  manager.assignedBranchId !==
                    null &&
                  manager.assignedBranchId !==
                    branch.id;

                return (
                  <option
                    key={manager.id}
                    value={manager.id}
                    disabled={
                      assignedElsewhere
                    }
                  >
                    {manager.fullName} —{" "}
                    {manager.positionLabel}
                    {assignedElsewhere
                      ? ` — đang quản lý ${manager.assignedBranchName}`
                      : ""}
                  </option>
                );
              })}
            </select>
          </label>

          {selectedManagerId !==
            "NONE" && (
            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              {managers
                .filter(
                  (manager) =>
                    manager.id ===
                    selectedManagerId,
                )
                .map((manager) => (
                  <div key={manager.id}>
                    <p className="font-semibold text-blue-900">
                      {manager.fullName}
                    </p>

                    <p className="mt-1 text-sm text-blue-700">
                      {manager.email}
                    </p>

                    <p className="mt-1 text-xs font-medium text-blue-600">
                      {manager.positionLabel}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirm}
            className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Đang lưu..."
              : "Xác nhận"}
          </button>
        </footer>
      </section>
    </div>
  );
};
