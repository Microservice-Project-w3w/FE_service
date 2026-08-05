import {
  Shapes,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  CreateEquipmentCategoryInput,
  EquipmentCategory,
  EquipmentCategoryIcon,
} from "@/modules/equipment-categories/types/equipment-category.types";

type EquipmentCategoryFormMode =
  | "CREATE"
  | "EDIT";

interface EquipmentCategoryFormModalProps {
  isOpen: boolean;
  mode: EquipmentCategoryFormMode;
  category: EquipmentCategory | null;
  categories: EquipmentCategory[];
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (
    input: CreateEquipmentCategoryInput,
  ) => void;
}

type FormErrors = Partial<
  Record<
    | "categoryCode"
    | "name",
    string
  >
>;

const iconOptions: {
  value: EquipmentCategoryIcon;
  label: string;
}[] = [
  {
    value: "AUDIO",
    label: "Âm thanh",
  },
  {
    value: "LIGHTING",
    label: "Ánh sáng",
  },
  {
    value: "STAGE",
    label: "Sân khấu",
  },
  {
    value: "POWER",
    label: "Nguồn điện",
  },
  {
    value: "VISUAL",
    label: "Trình chiếu",
  },
  {
    value: "OTHER",
    label: "Khác",
  },
];

const createInitialForm = (
  category: EquipmentCategory | null,
): CreateEquipmentCategoryInput => {
  if (category) {
    return {
      organizationId:
        category.organizationId,
      categoryCode:
        category.categoryCode,
      name: category.name,
      icon: category.icon,
      parentId: category.parentId,
      description:
        category.description,
    };
  }

  return {
    organizationId: "org-rentai",
    categoryCode: "",
    name: "",
    icon: "OTHER",
    parentId: null,
    description: "",
  };
};

const inputClassName =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export const EquipmentCategoryFormModal = ({
  isOpen,
  mode,
  category,
  categories,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: EquipmentCategoryFormModalProps) => {
  const [
    form,
    setForm,
  ] = useState<CreateEquipmentCategoryInput>(
    createInitialForm(category),
  );

  const [
    errors,
    setErrors,
  ] = useState<FormErrors>({});

  const hasChildren = useMemo(() => {
    if (!category) {
      return false;
    }

    return categories.some(
      (item) =>
        item.parentId === category.id,
    );
  }, [
    categories,
    category,
  ]);

  const parentOptions = useMemo(() => {
    return categories
      .filter(
        (item) =>
          item.parentId === null &&
          item.status === "ACTIVE" &&
          item.id !== category?.id,
      )
      .sort((left, right) =>
        left.name.localeCompare(
          right.name,
          "vi",
        ),
      );
  }, [
    categories,
    category,
  ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(
      createInitialForm(category),
    );
    setErrors({});
  }, [
    category,
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
    Key extends keyof CreateEquipmentCategoryInput,
  >(
    key: Key,
    value:
      CreateEquipmentCategoryInput[Key],
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

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!form.categoryCode.trim()) {
      nextErrors.categoryCode =
        "Vui lòng nhập mã danh mục.";
    }

    if (!form.name.trim()) {
      nextErrors.name =
        "Vui lòng nhập tên danh mục.";
    }

    setErrors(nextErrors);

    if (
      Object.keys(nextErrors).length > 0
    ) {
      return;
    }

    onSubmit({
      ...form,
      categoryCode:
        form.categoryCode.trim(),
      name: form.name.trim(),
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
        className="relative z-10 flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Shapes size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {mode === "CREATE"
                  ? "Thêm danh mục"
                  : "Chỉnh sửa danh mục"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Thiết lập thông tin và cấu trúc
                phân cấp của danh mục.
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
              Mã danh mục
              <input
                value={form.categoryCode}
                onChange={(event) =>
                  updateField(
                    "categoryCode",
                    event.target.value,
                  )
                }
                placeholder="Ví dụ: CAT-AUDIO"
                className={inputClassName}
              />

              {errors.categoryCode && (
                <span className="mt-1.5 block text-xs text-rose-600">
                  {errors.categoryCode}
                </span>
              )}
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Tên danh mục
              <input
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value,
                  )
                }
                placeholder="Nhập tên danh mục"
                className={inputClassName}
              />

              {errors.name && (
                <span className="mt-1.5 block text-xs text-rose-600">
                  {errors.name}
                </span>
              )}
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Nhóm biểu tượng
              <select
                value={form.icon}
                onChange={(event) =>
                  updateField(
                    "icon",
                    event.target.value as
                      EquipmentCategoryIcon,
                  )
                }
                className={inputClassName}
              >
                {iconOptions.map(
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

            <label className="text-sm font-semibold text-slate-700">
              Danh mục cha
              <select
                value={
                  form.parentId ?? "ROOT"
                }
                disabled={hasChildren}
                onChange={(event) =>
                  updateField(
                    "parentId",
                    event.target.value ===
                      "ROOT"
                      ? null
                      : event.target.value,
                  )
                }
                className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`}
              >
                <option value="ROOT">
                  Không có — danh mục gốc
                </option>

                {parentOptions.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  ),
                )}
              </select>

              {hasChildren && (
                <span className="mt-1.5 block text-xs text-amber-600">
                  Không thể đổi cấp vì danh mục
                  đang có danh mục con.
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
                placeholder="Mô tả phạm vi và các thiết bị thuộc danh mục"
                className="mt-2 min-h-28 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                ? "Thêm danh mục"
                : "Lưu thay đổi"}
          </button>
        </footer>
      </form>
    </div>
  );
};
