import type {
  UserRole,
} from "@/modules/auth/types/auth.types";

export const ROLE_HOME_PATHS: Record<
    UserRole,
    string
> = {
  ADMIN: "/admin/dashboard",
  MANAGER: "/manager/dashboard",
  SALES_STAFF: "/sales/dashboard",
  OPERATIONS_STAFF:
      "/operations/equipment",
  ACCOUNTANT: "/accounting/invoices",
  CUSTOMER: "/customer/equipment",
};

export const getRoleHomePath = (
    role: UserRole,
): string => {
  return ROLE_HOME_PATHS[role];
};