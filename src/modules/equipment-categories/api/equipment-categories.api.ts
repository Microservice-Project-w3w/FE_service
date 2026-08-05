import {
  readEquipmentCategories,
  resetEquipmentCategories,
  writeEquipmentCategories,
} from "@/modules/equipment-categories/api/equipment-categories.storage";

import type {
  CreateEquipmentCategoryInput,
  EquipmentCategory,
  EquipmentCategoryFilters,
  EquipmentCategoryStatus,
  UpdateEquipmentCategoryInput,
} from "@/modules/equipment-categories/types/equipment-category.types";

const delay = async (
  milliseconds = 150,
): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(
      resolve,
      milliseconds,
    );
  });
};

const normalizeText = (
  value: string,
): string => {
  return value
    .trim()
    .toLocaleLowerCase("vi");
};

const createId = (): string => {
  return `category-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};

const resolveParent = (
  categories: EquipmentCategory[],
  parentId: string | null,
): EquipmentCategory | null => {
  if (parentId === null) {
    return null;
  }

  const parent = categories.find(
    (category) =>
      category.id === parentId,
  );

  if (!parent) {
    throw new Error(
      "Không tìm thấy danh mục cha.",
    );
  }

  return parent;
};

const ensureUniqueCategory = (
  categories: EquipmentCategory[],
  input: CreateEquipmentCategoryInput,
  ignoredId?: string,
): void => {
  const normalizedCode = normalizeText(
    input.categoryCode,
  );

  const normalizedName = normalizeText(
    input.name,
  );

  const duplicatedCode = categories.some(
    (category) =>
      category.id !== ignoredId &&
      normalizeText(
        category.categoryCode,
      ) === normalizedCode,
  );

  if (duplicatedCode) {
    throw new Error(
      "Mã danh mục đã tồn tại.",
    );
  }

  const duplicatedName =
    categories.some(
      (category) =>
        category.id !== ignoredId &&
        category.parentId ===
          input.parentId &&
        normalizeText(category.name) ===
          normalizedName,
    );

  if (duplicatedName) {
    throw new Error(
      "Tên danh mục đã tồn tại trong cùng cấp.",
    );
  }
};

const isDescendant = (
  categories: EquipmentCategory[],
  categoryId: string,
  candidateParentId: string,
): boolean => {
  let currentId: string | null =
    candidateParentId;

  while (currentId !== null) {
    if (currentId === categoryId) {
      return true;
    }

    const currentCategory =
      categories.find(
        (category) =>
          category.id === currentId,
      );

    currentId =
      currentCategory?.parentId ?? null;
  }

  return false;
};

export const equipmentCategoriesApi = {
  async list(
    filters?: EquipmentCategoryFilters,
  ): Promise<EquipmentCategory[]> {
    await delay();

    const categories =
      readEquipmentCategories();

    if (!filters) {
      return categories;
    }

    const normalizedSearch =
      normalizeText(filters.search);

    return categories.filter(
      (category) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [
            category.categoryCode,
            category.name,
            category.parentName ?? "",
            category.description,
          ].some((value) =>
            normalizeText(value).includes(
              normalizedSearch,
            ),
          );

        const matchesStatus =
          filters.status === "ALL" ||
          category.status ===
            filters.status;

        const categoryLevel =
          category.parentId === null
            ? "ROOT"
            : "CHILD";

        const matchesLevel =
          filters.level === "ALL" ||
          categoryLevel ===
            filters.level;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesLevel
        );
      },
    );
  },

  async getById(
    id: string,
  ): Promise<EquipmentCategory> {
    await delay();

    const category =
      readEquipmentCategories().find(
        (item) => item.id === id,
      );

    if (!category) {
      throw new Error(
        "Không tìm thấy danh mục.",
      );
    }

    return category;
  },

  async create(
    input: CreateEquipmentCategoryInput,
  ): Promise<EquipmentCategory> {
    await delay();

    const categories =
      readEquipmentCategories();

    ensureUniqueCategory(
      categories,
      input,
    );

    const parent = resolveParent(
      categories,
      input.parentId,
    );

    if (
      parent &&
      parent.status === "INACTIVE"
    ) {
      throw new Error(
        "Không thể tạo danh mục con trong danh mục cha đã ngừng hoạt động.",
      );
    }

    const now = new Date().toISOString();

    const category: EquipmentCategory = {
      id: createId(),
      organizationId:
        input.organizationId,
      categoryCode:
        input.categoryCode
          .trim()
          .toUpperCase(),
      name: input.name.trim(),
      icon: input.icon,
      parentId: parent?.id ?? null,
      parentName:
        parent?.name ?? null,
      description:
        input.description.trim(),
      equipmentTypeCount: 0,
      equipmentCount: 0,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
    };

    writeEquipmentCategories([
      category,
      ...categories,
    ]);

    return category;
  },

  async update(
    id: string,
    input: UpdateEquipmentCategoryInput,
  ): Promise<EquipmentCategory> {
    await delay();

    const categories =
      readEquipmentCategories();

    const currentCategory =
      categories.find(
        (category) =>
          category.id === id,
      );

    if (!currentCategory) {
      throw new Error(
        "Không tìm thấy danh mục.",
      );
    }

    if (input.parentId === id) {
      throw new Error(
        "Danh mục không thể là cha của chính nó.",
      );
    }

    if (
      input.parentId !== null &&
      isDescendant(
        categories,
        id,
        input.parentId,
      )
    ) {
      throw new Error(
        "Không thể chọn danh mục con làm danh mục cha.",
      );
    }

    ensureUniqueCategory(
      categories,
      input,
      id,
    );

    const parent = resolveParent(
      categories,
      input.parentId,
    );

    if (
      parent &&
      parent.status === "INACTIVE"
    ) {
      throw new Error(
        "Danh mục cha đang ngừng hoạt động.",
      );
    }

    const updatedCategory:
      EquipmentCategory = {
        ...currentCategory,
        organizationId:
          input.organizationId,
        categoryCode:
          input.categoryCode
            .trim()
            .toUpperCase(),
        name: input.name.trim(),
        icon: input.icon,
        parentId:
          parent?.id ?? null,
        parentName:
          parent?.name ?? null,
        description:
          input.description.trim(),
        updatedAt:
          new Date().toISOString(),
      };

    const updatedCategories =
      categories.map((category) => {
        if (category.id === id) {
          return updatedCategory;
        }

        if (
          category.parentId === id
        ) {
          return {
            ...category,
            parentName:
              updatedCategory.name,
            updatedAt:
              new Date().toISOString(),
          };
        }

        return category;
      });

    writeEquipmentCategories(
      updatedCategories,
    );

    return updatedCategory;
  },

  async updateStatus(
    id: string,
    status: EquipmentCategoryStatus,
  ): Promise<EquipmentCategory> {
    await delay();

    const categories =
      readEquipmentCategories();

    const currentCategory =
      categories.find(
        (category) =>
          category.id === id,
      );

    if (!currentCategory) {
      throw new Error(
        "Không tìm thấy danh mục.",
      );
    }

    if (
      status === "INACTIVE" &&
      currentCategory.equipmentCount > 0
    ) {
      throw new Error(
        "Không thể ngừng hoạt động danh mục đang có thiết bị.",
      );
    }

    const activeChildExists =
      categories.some(
        (category) =>
          category.parentId === id &&
          category.status === "ACTIVE",
      );

    if (
      status === "INACTIVE" &&
      activeChildExists
    ) {
      throw new Error(
        "Hãy ngừng hoạt động các danh mục con trước.",
      );
    }

    if (
      status === "ACTIVE" &&
      currentCategory.parentId !== null
    ) {
      const parent = categories.find(
        (category) =>
          category.id ===
          currentCategory.parentId,
      );

      if (
        parent?.status === "INACTIVE"
      ) {
        throw new Error(
          "Không thể kích hoạt khi danh mục cha đang ngừng hoạt động.",
        );
      }
    }

    const updatedCategory:
      EquipmentCategory = {
        ...currentCategory,
        status,
        updatedAt:
          new Date().toISOString(),
      };

    writeEquipmentCategories(
      categories.map((category) =>
        category.id === id
          ? updatedCategory
          : category,
      ),
    );

    return updatedCategory;
  },

  async remove(
    id: string,
  ): Promise<void> {
    await delay();

    const categories =
      readEquipmentCategories();

    const category = categories.find(
      (item) => item.id === id,
    );

    if (!category) {
      throw new Error(
        "Không tìm thấy danh mục.",
      );
    }

    if (
      category.equipmentTypeCount > 0 ||
      category.equipmentCount > 0
    ) {
      throw new Error(
        "Không thể xóa danh mục đang chứa loại thiết bị hoặc thiết bị.",
      );
    }

    const hasChildren =
      categories.some(
        (item) =>
          item.parentId === id,
      );

    if (hasChildren) {
      throw new Error(
        "Không thể xóa danh mục đang có danh mục con.",
      );
    }

    if (
      category.status !== "INACTIVE"
    ) {
      throw new Error(
        "Chỉ có thể xóa danh mục đã ngừng hoạt động.",
      );
    }

    writeEquipmentCategories(
      categories.filter(
        (item) => item.id !== id,
      ),
    );
  },

  async resetMockData(): Promise<
    EquipmentCategory[]
  > {
    await delay();

    return resetEquipmentCategories();
  },
};
