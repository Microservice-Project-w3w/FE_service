import type {
  UserRole,
} from "@/modules/auth/types/auth.types";

export const ROLE_HOME_PATHS: Record<
    UserRole,
    string
> = {
  ADMIN: "/admin/accounts",
  MANAGER: "/manager/quotation-approvals",
  SALES_STAFF: "/sales/rental-requests",
  OPERATIONS_STAFF:
      "/operations/equipment",
  ACCOUNTANT: "/profile",
  CUSTOMER: "/profile",
};

export const getRoleHomePath = (
    role: UserRole,
): string => {
  return ROLE_HOME_PATHS[role];
};
