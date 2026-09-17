import { authenticatedRequest } from "@/modules/auth/api/authenticatedClient";

import type {
  CreateEquipmentCategoryInput,
  EquipmentCategory,
  EquipmentCategoryFilters,
  EquipmentCategoryStatus,
  UpdateEquipmentCategoryInput,
} from "@/modules/equipment-categories/types/equipment-category.types";

interface OrganizationDto { id: number; }
interface EquipmentCategoryDto {
  id: number; organizationId: number; code: string; name: string;
  description: string | null; active: boolean; createdAt: string; updatedAt: string;
}

const BASE_PATH = "/api/v1/inventory/categories";
const toCategory = (dto: EquipmentCategoryDto): EquipmentCategory => ({
  id: String(dto.id), organizationId: String(dto.organizationId),
  categoryCode: dto.code, name: dto.name, icon: "OTHER",
  parentId: null, parentName: null, description: dto.description ?? "",
  equipmentTypeCount: 0, equipmentCount: 0,
  status: dto.active ? "ACTIVE" : "INACTIVE",
  createdAt: dto.createdAt, updatedAt: dto.updatedAt,
});
const normalizeText = (value: string): string => value.trim().toLocaleLowerCase("vi");
const filterCategories = (
  categories: EquipmentCategory[], filters?: EquipmentCategoryFilters,
): EquipmentCategory[] => {
  if (!filters) return categories;
  const search = normalizeText(filters.search);
  return categories.filter((category) => {
    const matchesSearch = search.length === 0 || [
      category.categoryCode, category.name, category.description,
    ].some((value) => normalizeText(value).includes(search));
    const matchesStatus = filters.status === "ALL" || category.status === filters.status;
    const matchesLevel = filters.level === "ALL" || filters.level === "ROOT";
    return matchesSearch && matchesStatus && matchesLevel;
  });
};
const unsupported = (action: string): never => {
  throw new Error(`${action} chưa được backend hỗ trợ.`);
};

export const equipmentCategoriesApi = {
  async list(filters?: EquipmentCategoryFilters): Promise<EquipmentCategory[]> {
    const organizations = await authenticatedRequest<OrganizationDto[]>(
      "GET", "/api/v1/organizations",
    );
    const responses = await Promise.all(organizations.map((organization) =>
      authenticatedRequest<EquipmentCategoryDto[]>(
        "GET", `${BASE_PATH}?organizationId=${organization.id}`,
      ),
    ));
    return filterCategories(responses.flat().map(toCategory), filters);
  },

  async getById(id: string): Promise<EquipmentCategory> {
    const category = (await this.list()).find((item) => item.id === id);
    if (!category) throw new Error("Không tìm thấy danh mục.");
    return category;
  },

  async create(input: CreateEquipmentCategoryInput): Promise<EquipmentCategory> {
    if (input.parentId !== null) unsupported("Danh mục cha/con");
    return toCategory(await authenticatedRequest<EquipmentCategoryDto>("POST", BASE_PATH, {
      body: {
        organizationId: Number(input.organizationId),
        code: input.categoryCode.trim().toUpperCase(),
        name: input.name.trim(),
        description: input.description.trim(),
        active: true,
      },
    }));
  },

  async update(id: string, input: UpdateEquipmentCategoryInput): Promise<EquipmentCategory> {
    if (input.parentId !== null) unsupported("Danh mục cha/con");
    return toCategory(await authenticatedRequest<EquipmentCategoryDto>(
      "PUT", `${BASE_PATH}/${id}?organizationId=${Number(input.organizationId)}`, {
        body: {
          code: input.categoryCode.trim().toUpperCase(),
          name: input.name.trim(),
          description: input.description.trim(),
          active: true,
        },
      },
    ));
  },

  async updateStatus(id: string, status: EquipmentCategoryStatus): Promise<EquipmentCategory> {
    const current = await this.getById(id);
    return toCategory(await authenticatedRequest<EquipmentCategoryDto>(
      "PATCH",
      `${BASE_PATH}/${id}/active?organizationId=${Number(current.organizationId)}&active=${status === "ACTIVE"}`,
    ));
  },

  async remove(_id?: string): Promise<void> {
    unsupported("Xóa danh mục");
  },

  async resetMockData(): Promise<EquipmentCategory[]> {
    return unsupported("Khôi phục dữ liệu mẫu");
  },
};
