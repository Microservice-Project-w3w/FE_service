import {
  initialEquipmentCategories,
} from "@/modules/equipment-categories/mocks/equipment-categories.mock";

import type {
  EquipmentCategory,
} from "@/modules/equipment-categories/types/equipment-category.types";

export const EQUIPMENT_CATEGORIES_STORAGE_KEY =
  "rentai_mock_equipment_categories_v1";

const cloneCategories = (
  categories: EquipmentCategory[],
): EquipmentCategory[] => {
  return categories.map((category) => ({
    ...category,
  }));
};

const isEquipmentCategory = (
  value: unknown,
): value is EquipmentCategory => {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const category =
    value as Record<string, unknown>;

  return (
    typeof category.id === "string" &&
    typeof category.organizationId ===
      "string" &&
    typeof category.categoryCode ===
      "string" &&
    typeof category.name === "string" &&
    typeof category.description ===
      "string" &&
    typeof category.equipmentTypeCount ===
      "number" &&
    typeof category.equipmentCount ===
      "number" &&
    (category.status === "ACTIVE" ||
      category.status === "INACTIVE")
  );
};

export const readEquipmentCategories =
  (): EquipmentCategory[] => {
    try {
      const storedValue =
        localStorage.getItem(
          EQUIPMENT_CATEGORIES_STORAGE_KEY,
        );

      if (!storedValue) {
        const defaultCategories =
          cloneCategories(
            initialEquipmentCategories,
          );

        localStorage.setItem(
          EQUIPMENT_CATEGORIES_STORAGE_KEY,
          JSON.stringify(
            defaultCategories,
          ),
        );

        return defaultCategories;
      }

      const parsedValue: unknown =
        JSON.parse(storedValue);

      if (
        !Array.isArray(parsedValue) ||
        !parsedValue.every(
          isEquipmentCategory,
        )
      ) {
        throw new Error(
          "Dữ liệu danh mục không hợp lệ.",
        );
      }

      return cloneCategories(
        parsedValue,
      );
    } catch {
      const defaultCategories =
        cloneCategories(
          initialEquipmentCategories,
        );

      localStorage.setItem(
        EQUIPMENT_CATEGORIES_STORAGE_KEY,
        JSON.stringify(
          defaultCategories,
        ),
      );

      return defaultCategories;
    }
  };

export const writeEquipmentCategories = (
  categories: EquipmentCategory[],
): void => {
  localStorage.setItem(
    EQUIPMENT_CATEGORIES_STORAGE_KEY,
    JSON.stringify(categories),
  );
};

export const resetEquipmentCategories =
  (): EquipmentCategory[] => {
    const defaultCategories =
      cloneCategories(
        initialEquipmentCategories,
      );

    writeEquipmentCategories(
      defaultCategories,
    );

    return defaultCategories;
  };
