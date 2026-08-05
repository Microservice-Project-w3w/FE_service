import {
  Boxes,
  CircleOff,
  Eye,
  Layers3,
  PackageSearch,
  Pencil,
  Plus,
  Power,
  PowerOff,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  equipmentCategoriesApi,
} from "@/modules/equipment-categories/api/equipment-categories.api";

import {
  EquipmentCategoryActionConfirmDialog,
} from "@/modules/equipment-categories/components/EquipmentCategoryActionConfirmDialog";

import {
  EquipmentCategoryDetailDrawer,
} from "@/modules/equipment-categories/components/EquipmentCategoryDetailDrawer";

import {
  EquipmentCategoryFormModal,
} from "@/modules/equipment-categories/components/EquipmentCategoryFormModal";

import {
  EquipmentCategoryIconBadge,
} from "@/modules/equipment-categories/components/EquipmentCategoryIconBadge";

import {
  EquipmentCategoryStatusBadge,
} from "@/modules/equipment-categories/components/EquipmentCategoryStatusBadge";

import type {
  CreateEquipmentCategoryInput,
  EquipmentCategory,
  EquipmentCategoryLevel,
  EquipmentCategoryStatus,
} from "@/modules/equipment-categories/types/equipment-category.types";

import {
  DataPagination,
} from "@/shared/components/data-display/DataPagination";

type CategoryFormMode =
  | "CREATE"
  | "EDIT";

type PendingAction =
  | {
      type: "STATUS";
      category: EquipmentCategory;
      nextStatus: EquipmentCategoryStatus;
    }
  | {
      type: "DELETE";
      category: EquipmentCategory;
    }
  | {
      type: "RESET";
    };

const normalizeText = (
  value: string,
): string => {
  return value
    .trim()
    .toLocaleLowerCase("vi");
};

export const EquipmentCategoriesPage = () => {
  const [
    categories,
    setCategories,
  ] = useState<EquipmentCategory[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    EquipmentCategoryStatus | "ALL"
  >("ALL");

  const [
    levelFilter,
    setLevelFilter,
  ] = useState<
    EquipmentCategoryLevel | "ALL"
  >("ALL");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    pageSize,
    setPageSize,
  ] = useState(5);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null,
  );

  const [
    formOpen,
    setFormOpen,
  ] = useState(false);

  const [
    formMode,
    setFormMode,
  ] = useState<CategoryFormMode>(
    "CREATE",
  );

  const [
    formCategory,
    setFormCategory,
  ] = useState<EquipmentCategory | null>(
    null,
  );

  const [
    detailCategory,
    setDetailCategory,
  ] = useState<EquipmentCategory | null>(
    null,
  );

  const [
    pendingAction,
    setPendingAction,
  ] = useState<PendingAction | null>(
    null,
  );

  const loadCategories =
    useCallback(async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data =
          await equipmentCategoriesApi.list();

        setCategories(data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu danh mục.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const statistics = useMemo(() => {
    return {
      total: categories.length,

      active: categories.filter(
        (category) =>
          category.status === "ACTIVE",
      ).length,

      inactive: categories.filter(
        (category) =>
          category.status === "INACTIVE",
      ).length,

      root: categories.filter(
        (category) =>
          category.parentId === null,
      ).length,

      equipment: categories.reduce(
        (total, category) =>
          total +
          category.equipmentCount,
        0,
      ),
    };
  }, [categories]);

  const childCountById = useMemo(() => {
    const counts =
      new Map<string, number>();

    categories.forEach((category) => {
      if (category.parentId === null) {
        return;
      }

      counts.set(
        category.parentId,
        (counts.get(
          category.parentId,
        ) ?? 0) + 1,
      );
    });

    return counts;
  }, [categories]);

  const filteredCategories =
    useMemo(() => {
      const normalizedSearch =
        normalizeText(search);

      return categories
        .filter((category) => {
          const matchesSearch =
            normalizedSearch.length ===
              0 ||
            [
              category.categoryCode,
              category.name,
              category.parentName ?? "",
              category.description,
            ].some((value) =>
              normalizeText(
                value,
              ).includes(
                normalizedSearch,
              ),
            );

          const matchesStatus =
            statusFilter === "ALL" ||
            category.status ===
              statusFilter;

          const categoryLevel:
            EquipmentCategoryLevel =
              category.parentId === null
                ? "ROOT"
                : "CHILD";

          const matchesLevel =
            levelFilter === "ALL" ||
            categoryLevel ===
              levelFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesLevel
          );
        })
        .sort((left, right) => {
          const leftIsRoot =
            left.parentId === null;

          const rightIsRoot =
            right.parentId === null;

          if (
            leftIsRoot !== rightIsRoot
          ) {
            return leftIsRoot ? -1 : 1;
          }

          const parentComparison =
            (
              left.parentName ?? ""
            ).localeCompare(
              right.parentName ?? "",
              "vi",
            );

          if (parentComparison !== 0) {
            return parentComparison;
          }

          return left.name.localeCompare(
            right.name,
            "vi",
          );
        });
    }, [
      categories,
      levelFilter,
      search,
      statusFilter,
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCategories.length /
        pageSize,
    ),
  );

  const paginatedCategories =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        pageSize;

      return filteredCategories.slice(
        startIndex,
        startIndex + pageSize,
      );
    }, [
      currentPage,
      filteredCategories,
      pageSize,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    levelFilter,
  ]);

  useEffect(() => {
    if (
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const refreshCategories =
    async (): Promise<void> => {
      const data =
        await equipmentCategoriesApi.list();

      setCategories(data);
    };

  const handleOpenCreate = () => {
    setErrorMessage(null);
    setFormMode("CREATE");
    setFormCategory(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (
    category: EquipmentCategory,
  ) => {
    setErrorMessage(null);
    setDetailCategory(null);
    setFormMode("EDIT");
    setFormCategory(category);
    setFormOpen(true);
  };

  const handleSaveCategory = async (
    input: CreateEquipmentCategoryInput,
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (
        formMode === "EDIT" &&
        formCategory
      ) {
        await equipmentCategoriesApi.update(
          formCategory.id,
          input,
        );
      } else {
        await equipmentCategoriesApi.create(
          input,
        );
      }

      await refreshCategories();

      setFormOpen(false);
      setFormCategory(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể lưu danh mục.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction =
    async () => {
      if (!pendingAction) {
        return;
      }

      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        if (
          pendingAction.type ===
          "RESET"
        ) {
          const data =
            await equipmentCategoriesApi
              .resetMockData();

          setCategories(data);
          setCurrentPage(1);
        }

        if (
          pendingAction.type ===
          "STATUS"
        ) {
          await equipmentCategoriesApi
            .updateStatus(
              pendingAction.category.id,
              pendingAction.nextStatus,
            );

          await refreshCategories();
        }

        if (
          pendingAction.type ===
          "DELETE"
        ) {
          await equipmentCategoriesApi
            .remove(
              pendingAction.category.id,
            );

          await refreshCategories();
        }

        setPendingAction(null);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể thực hiện thao tác.",
        );

        setPendingAction(null);
      } finally {
        setIsSubmitting(false);
      }
    };

  const confirmConfig =
    useMemo(() => {
      if (!pendingAction) {
        return null;
      }

      if (
        pendingAction.type ===
        "RESET"
      ) {
        return {
          title:
            "Khôi phục dữ liệu mẫu?",
          message:
            "Toàn bộ thay đổi danh mục trong localStorage sẽ được thay bằng dữ liệu mẫu ban đầu.",
          confirmLabel: "Khôi phục",
          tone:
            "WARNING" as const,
        };
      }

      if (
        pendingAction.type ===
        "DELETE"
      ) {
        return {
          title: "Xóa danh mục?",
          message: `Danh mục ${pendingAction.category.name} sẽ bị xóa khỏi dữ liệu mock.`,
          confirmLabel:
            "Xóa danh mục",
          tone:
            "DANGER" as const,
        };
      }

      const isActivating =
        pendingAction.nextStatus ===
        "ACTIVE";

      return {
        title: isActivating
          ? "Kích hoạt danh mục?"
          : "Ngừng hoạt động danh mục?",

        message: isActivating
          ? `Danh mục ${pendingAction.category.name} sẽ được sử dụng trở lại.`
          : `Danh mục ${pendingAction.category.name} sẽ ngừng được sử dụng cho dữ liệu mới.`,

        confirmLabel: isActivating
          ? "Kích hoạt"
          : "Ngừng hoạt động",

        tone:
          "WARNING" as const,
      };
    }, [pendingAction]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Quản trị thiết bị
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Quản lý danh mục
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Tổ chức danh mục cha, danh mục
            con và các nhóm thiết bị trong
            hệ thống.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setPendingAction({
                type: "RESET",
              })
            }
            className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCcw size={17} />
            Khôi phục dữ liệu
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Thêm danh mục
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Boxes size={21} />
            </span>

            <span className="text-2xl font-bold text-slate-900">
              {statistics.total}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Tổng danh mục
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Power size={21} />
            </span>

            <span className="text-2xl font-bold text-slate-900">
              {statistics.active}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Đang hoạt động
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <CircleOff size={21} />
            </span>

            <span className="text-2xl font-bold text-slate-900">
              {statistics.inactive}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Ngừng hoạt động
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <Layers3 size={21} />
            </span>

            <span className="text-2xl font-bold text-slate-900">
              {statistics.root}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Danh mục gốc
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
              <PackageSearch size={21} />
            </span>

            <span className="text-2xl font-bold text-slate-900">
              {statistics.equipment}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Tổng thiết bị
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <label className="relative">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Tìm theo tên, mã hoặc danh mục cha..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | EquipmentCategoryStatus
                  | "ALL",
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">
              Tất cả trạng thái
            </option>

            <option value="ACTIVE">
              Đang hoạt động
            </option>

            <option value="INACTIVE">
              Ngừng hoạt động
            </option>
          </select>

          <select
            value={levelFilter}
            onChange={(event) =>
              setLevelFilter(
                event.target.value as
                  | EquipmentCategoryLevel
                  | "ALL",
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">
              Tất cả cấp danh mục
            </option>

            <option value="ROOT">
              Danh mục gốc
            </option>

            <option value="CHILD">
              Danh mục con
            </option>
          </select>
        </div>
      </section>

      {errorMessage &&
        !formOpen && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              Danh sách danh mục
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Theo dõi cấu trúc phân loại
              thiết bị trong hệ thống.
            </p>
          </div>

          <span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            {filteredCategories.length} danh
            mục
          </span>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">
                  STT
                </th>

                <th className="px-5 py-4">
                  Danh mục
                </th>

                <th className="px-5 py-4">
                  Cấp danh mục
                </th>

                <th className="px-5 py-4">
                  Danh mục cha
                </th>

                <th className="px-5 py-4">
                  Danh mục con
                </th>

                <th className="px-5 py-4">
                  Loại thiết bị
                </th>

                <th className="px-5 py-4">
                  Thiết bị
                </th>

                <th className="px-5 py-4">
                  Trạng thái
                </th>

                <th className="px-5 py-4 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-16 text-center text-sm text-slate-500"
                  >
                    Đang tải dữ liệu danh
                    mục...
                  </td>
                </tr>
              ) : filteredCategories.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-16 text-center text-sm text-slate-500"
                  >
                    Không tìm thấy danh mục
                    phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedCategories.map(
                  (category, index) => {
                    const childCount =
                      childCountById.get(
                        category.id,
                      ) ?? 0;

                    const activeChildExists =
                      categories.some(
                        (item) =>
                          item.parentId ===
                            category.id &&
                          item.status ===
                            "ACTIVE",
                      );

                    const parent =
                      category.parentId
                        ? categories.find(
                            (item) =>
                              item.id ===
                              category.parentId,
                          )
                        : null;

                    const canDeactivate =
                      category.equipmentCount ===
                        0 &&
                      !activeChildExists;

                    const canActivate =
                      category.parentId ===
                        null ||
                      parent?.status ===
                        "ACTIVE";

                    const canToggleStatus =
                      category.status ===
                      "ACTIVE"
                        ? canDeactivate
                        : canActivate;

                    const canDelete =
                      category.status ===
                        "INACTIVE" &&
                      category
                        .equipmentTypeCount ===
                        0 &&
                      category.equipmentCount ===
                        0 &&
                      childCount === 0;

                    return (
                      <tr
                        key={category.id}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-5 text-sm font-medium text-slate-500">
                          {(currentPage -
                            1) *
                            pageSize +
                            index +
                            1}
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <EquipmentCategoryIconBadge
                              icon={
                                category.icon
                              }
                            />

                            <div>
                              <p className="font-bold text-slate-900">
                                {
                                  category.name
                                }
                              </p>

                              <p className="mt-1 text-xs font-semibold text-blue-600">
                                {
                                  category.categoryCode
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
                            {category.parentId ===
                            null
                              ? "Danh mục gốc"
                              : "Danh mục con"}
                          </span>
                        </td>

                        <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                          {category.parentName ??
                            "—"}
                        </td>

                        <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                          {childCount}
                        </td>

                        <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                          {
                            category.equipmentTypeCount
                          }
                        </td>

                        <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                          {
                            category.equipmentCount
                          }
                        </td>

                        <td className="px-5 py-5">
                          <EquipmentCategoryStatusBadge
                            status={
                              category.status
                            }
                          />
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              title="Xem chi tiết"
                              onClick={() =>
                                setDetailCategory(
                                  category,
                                )
                              }
                              className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              type="button"
                              title="Chỉnh sửa"
                              onClick={() =>
                                handleOpenEdit(
                                  category,
                                )
                              }
                              className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Pencil
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              disabled={
                                !canToggleStatus
                              }
                              title={
                                category.status ===
                                "ACTIVE"
                                  ? canDeactivate
                                    ? "Ngừng hoạt động"
                                    : "Danh mục đang có thiết bị hoặc danh mục con hoạt động"
                                  : canActivate
                                    ? "Kích hoạt"
                                    : "Danh mục cha đang ngừng hoạt động"
                              }
                              onClick={() =>
                                setPendingAction(
                                  {
                                    type: "STATUS",
                                    category,
                                    nextStatus:
                                      category.status ===
                                      "ACTIVE"
                                        ? "INACTIVE"
                                        : "ACTIVE",
                                  },
                                )
                              }
                              className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              {category.status ===
                              "ACTIVE" ? (
                                <PowerOff
                                  size={16}
                                />
                              ) : (
                                <Power
                                  size={16}
                                />
                              )}
                            </button>

                            <button
                              type="button"
                              disabled={
                                !canDelete
                              }
                              title={
                                canDelete
                                  ? "Xóa danh mục"
                                  : "Chỉ xóa danh mục ngừng hoạt động và không có dữ liệu"
                              }
                              onClick={() =>
                                setPendingAction(
                                  {
                                    type: "DELETE",
                                    category,
                                  },
                                )
                              }
                              className="flex size-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Trash2
                                size={16}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {!isLoading && (
        <DataPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={
            filteredCategories.length
          }
          itemLabel="danh mục"
          onPageChange={
            setCurrentPage
          }
          onPageSizeChange={(
            nextPageSize,
          ) => {
            setPageSize(
              nextPageSize,
            );

            setCurrentPage(1);
          }}
        />
      )}

      <EquipmentCategoryDetailDrawer
        category={detailCategory}
        childCount={
          detailCategory
            ? childCountById.get(
                detailCategory.id,
              ) ?? 0
            : 0
        }
        isOpen={
          detailCategory !== null
        }
        onClose={() =>
          setDetailCategory(null)
        }
        onEdit={handleOpenEdit}
      />

      <EquipmentCategoryFormModal
        isOpen={formOpen}
        mode={formMode}
        category={formCategory}
        categories={categories}
        isSubmitting={isSubmitting}
        errorMessage={
          formOpen
            ? errorMessage
            : null
        }
        onClose={() => {
          if (!isSubmitting) {
            setFormOpen(false);
            setFormCategory(null);
            setErrorMessage(null);
          }
        }}
        onSubmit={(input) => {
          void handleSaveCategory(
            input,
          );
        }}
      />

      <EquipmentCategoryActionConfirmDialog
        isOpen={
          pendingAction !== null
        }
        title={
          confirmConfig?.title ?? ""
        }
        message={
          confirmConfig?.message ?? ""
        }
        confirmLabel={
          confirmConfig?.confirmLabel ??
          "Xác nhận"
        }
        tone={
          confirmConfig?.tone ??
          "WARNING"
        }
        isSubmitting={isSubmitting}
        onClose={() => {
          if (!isSubmitting) {
            setPendingAction(null);
          }
        }}
        onConfirm={() => {
          void handleConfirmAction();
        }}
      />
    </div>
  );
};
