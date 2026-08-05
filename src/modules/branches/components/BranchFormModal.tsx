import {
  Building2,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import type {
  Branch,
  CreateBranchInput,
} from "@/modules/branches/types/branch.types";

type BranchFormMode =
  | "CREATE"
  | "EDIT";

interface BranchFormModalProps {
  isOpen: boolean;
  mode: BranchFormMode;
  branch: Branch | null;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (
    input: CreateBranchInput,
  ) => void;
}

type BranchFormErrors = Partial<
  Record<
    | "branchCode"
    | "name"
    | "phone"
    | "email"
    | "address"
    | "province"
    | "openedAt",
    string
  >
>;

const getToday = (): string => {
  return new Date()
    .toISOString()
    .slice(0, 10);
};

const createInitialForm = (
  branch: Branch | null,
): CreateBranchInput => {
  if (branch) {
    return {
      organizationId:
        branch.organizationId,
      branchCode: branch.branchCode,
      name: branch.name,
      phone: branch.phone,
      email: branch.email,
      address: branch.address,
      province: branch.province,
      openedAt: branch.openedAt,
      description: branch.description,
      managerEmployeeId:
        branch.managerEmployeeId,
      managerName: branch.managerName,
      managerEmail: branch.managerEmail,
    };
  }

  return {
    organizationId: "org-rentai",
    branchCode: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    openedAt: getToday(),
    description: "",
    managerEmployeeId: null,
    managerName: null,
    managerEmail: null,
  };
};

const inputClassName =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const textareaClassName =
  "mt-2 min-h-28 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export const BranchFormModal = ({
  isOpen,
  mode,
  branch,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: BranchFormModalProps) => {
  const [
    form,
    setForm,
  ] = useState<CreateBranchInput>(
    createInitialForm(branch),
  );

  const [
    errors,
    setErrors,
  ] = useState<BranchFormErrors>({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(
      createInitialForm(branch),
    );

    setErrors({});
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

  if (!isOpen) {
    return null;
  }

  const updateField = <
    Key extends keyof CreateBranchInput,
  >(
    key: Key,
    value: CreateBranchInput[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  };

  const validate = (): boolean => {
    const nextErrors: BranchFormErrors = {};

    if (!form.branchCode.trim()) {
      nextErrors.branchCode =
        "Vui lòng nhập mã chi nhánh.";
    }

    if (!form.name.trim()) {
      nextErrors.name =
        "Vui lòng nhập tên chi nhánh.";
    }

    if (
      !/^[0-9]{9,15}$/.test(
        form.phone.replace(/\s+/g, ""),
      )
    ) {
      nextErrors.phone =
        "Số điện thoại phải có từ 9 đến 15 chữ số.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim(),
      )
    ) {
      nextErrors.email =
        "Email không đúng định dạng.";
    }

    if (!form.address.trim()) {
      nextErrors.address =
        "Vui lòng nhập địa chỉ.";
    }

    if (!form.province.trim()) {
      nextErrors.province =
        "Vui lòng nhập tỉnh hoặc thành phố.";
    }

    if (!form.openedAt) {
      nextErrors.openedAt =
        "Vui lòng chọn ngày khai trương.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      ...form,
      branchCode:
        form.branchCode.trim(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      province: form.province.trim(),
      description:
        form.description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Đóng biểu mẫu"
        disabled={isSubmitting}
        onClick={onClose}
        className="absolute inset-0"
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Building2 size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {mode === "CREATE"
                  ? "Thêm chi nhánh"
                  : "Chỉnh sửa chi nhánh"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Cập nhật thông tin liên hệ và
                hoạt động của chi nhánh.
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto px-6 py-6">
          {errorMessage && (
            <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              Mã chi nhánh
              <input
                value={form.branchCode}
                onChange={(event) =>
                  updateField(
                    "branchCode",
                    event.target.value,
                  )
                }
                placeholder="Ví dụ: CN-HN"
                className={inputClassName}
              />

              {errors.branchCode && (
                <span className="mt-1.5 block text-xs text-rose-600">
                  {errors.branchCode}
                </span>
              )}
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Tên chi nhánh
              <input
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value,
                  )
                }
                placeholder="Nhập tên chi nhánh"
                className={inputClassName}
              />

              {errors.name && (
                <span className="mt-1.5 block text-xs text-rose-600">
                  {errors.name}
                </span>
              )}
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Số điện thoại
              <input
                value={form.phone}
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value,
                  )
                }
                placeholder="Nhập số điện thoại"
                className={inputClassName}
              />

              {errors.phone && (
                <span className="mt-1.5 block text-xs text-rose-600">
                  {errors.phone}
                </span>
              )}
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value,
                  )
                }
                placeholder="branch@rentai.vn"
                className={inputClassName}
              />

              {errors.email && (
                <span className="mt-1.5 block text-xs text-rose-600">
                  {errors.email}
                </span>
              )}
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Tỉnh hoặc thành phố
              <input
                value={form.province}
                onChange={(event) =>
                  updateField(
                    "province",
                    event.target.value,
                  )
                }
                placeholder="Ví dụ: Hà Nội"
                className={inputClassName}
              />

              {errors.province && (
                <span className="mt-1.5 block text-xs text-rose-600">
                  {errors.province}
                </span>
              )}
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Ngày khai trương
              <input
                type="date"
                value={form.openedAt}
                onChange={(event) =>
                  updateField(
                    "openedAt",
                    event.target.value,
                  )
                }
                className={inputClassName}
              />

              {errors.openedAt && (
                <span className="mt-1.5 block text-xs text-rose-600">
                  {errors.openedAt}
                </span>
              )}
            </label>

            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Địa chỉ
              <input
                value={form.address}
                onChange={(event) =>
                  updateField(
                    "address",
                    event.target.value,
                  )
                }
                placeholder="Nhập địa chỉ chi tiết"
                className={inputClassName}
              />

              {errors.address && (
                <span className="mt-1.5 block text-xs text-rose-600">
                  {errors.address}
                </span>
              )}
            </label>

            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Mô tả
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value,
                  )
                }
                placeholder="Mô tả phạm vi hoạt động của chi nhánh"
                className={textareaClassName}
              />
            </label>
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Đang lưu..."
              : mode === "CREATE"
                ? "Thêm chi nhánh"
                : "Lưu thay đổi"}
          </button>
        </footer>
      </form>
    </div>
  );
};
