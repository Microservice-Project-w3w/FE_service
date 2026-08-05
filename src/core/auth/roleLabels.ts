import type {
  UserRole,
} from "@/modules/auth/types/auth.types";

export const USER_ROLE_LABELS: Record<
  UserRole,
  string
> = {
  ADMIN: "Quản trị viên",
  MANAGER: "Quản lý",
  SALES_STAFF: "Nhân viên kinh doanh",
  OPERATIONS_STAFF: "Nhân viên vận hành",
  ACCOUNTANT: "Kế toán",
  CUSTOMER: "Khách hàng",
};
