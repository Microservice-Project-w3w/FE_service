import {
  Layers3,
  PackageSearch,
  Pencil,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  EquipmentCategoryIconBadge,
} from "@/modules/equipment-categories/components/EquipmentCategoryIconBadge";

import {
  EquipmentCategoryStatusBadge,
} from "@/modules/equipment-categories/components/EquipmentCategoryStatusBadge";

import type {
  EquipmentCategory,
} from "@/modules/equipment-categories/types/equipment-category.types";

interface EquipmentCategoryDetailDrawerProps {
  category: EquipmentCategory | null;
  childCount: number;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (
    category: EquipmentCategory,
  ) => void;
}

const dateFormatter =
  new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

const formatDate = (
  value: string,
): string => {
  return dateFormatter.format(
    new Date(value),
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({
  label,
  value,
}: DetailItemProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold leading-6 text-slate-800">
        {value}
      </p>
    </div>
  );
};

export const EquipmentCategoryDetailDrawer = ({
  category,
  childCount,
  isOpen,
  onClose,
  onEdit,
}: EquipmentCategoryDetailDrawerProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
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
    onClose,
  ]);

  if (!isOpen || !category) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Đóng chi tiết"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <EquipmentCategoryIconBadge
                icon={category.icon}
              />

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  {category.categoryCode}
                </p>

                <h2 className="mt-1 truncate text-xl font-bold text-slate-900">
                  {category.name}
                </h2>
              </div>
            </div>

            <button
              type="button"
              aria-label="Đóng"
              onClick={onClose}
              className="flex size-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-4">
            <EquipmentCategoryStatusBadge
              status={category.status}
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <section>
            <h3 className="text-sm font-bold text-slate-900">
              Cấu trúc danh mục
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Cấp danh mục"
                value={
                  category.parentId === null
                    ? "Danh mục gốc"
                    : "Danh mục con"
                }
              />

              <DetailItem
                label="Danh mục cha"
                value={
                  category.parentName ??
                  "Không có"
                }
              />

              <DetailItem
                label="Số danh mục con"
                value={`${childCount} danh mục`}
              />

              <DetailItem
                label="Mã danh mục"
                value={
                  category.categoryCode
                }
              />
            </div>
          </section>

          <section className="mt-7">
            <h3 className="text-sm font-bold text-slate-900">
              Dữ liệu thiết bị
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Loại thiết bị"
                value={`${category.equipmentTypeCount} loại`}
              />

              <DetailItem
                label="Tổng thiết bị"
                value={`${category.equipmentCount} thiết bị`}
              />
            </div>
          </section>

          <section className="mt-7">
            <h3 className="text-sm font-bold text-slate-900">
              Thông tin cập nhật
            </h3>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <DetailItem
                label="Ngày tạo"
                value={formatDate(
                  category.createdAt,
                )}
              />

              <DetailItem
                label="Cập nhật gần nhất"
                value={formatDate(
                  category.updatedAt,
                )}
              />

              <div className="sm:col-span-2">
                <DetailItem
                  label="Mô tả"
                  value={
                    category.description ||
                    "Chưa có mô tả."
                  }
                />
              </div>
            </div>
          </section>

          <section className="mt-7 rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <div className="flex items-start gap-3">
              {category.parentId === null ? (
                <Layers3
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-600"
                />
              ) : (
                <PackageSearch
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-600"
                />
              )}

              <p className="text-sm leading-6 text-blue-700">
                Danh mục đang quản lý{" "}
                {category.equipmentTypeCount} loại
                và {category.equipmentCount} thiết
                bị trong hệ thống.
              </p>
            </div>
          </section>
        </div>

        <footer className="border-t border-slate-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={() =>
              onEdit(category)
            }
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Pencil size={18} />
            Chỉnh sửa danh mục
          </button>
        </footer>
      </aside>
    </div>
  );
};
