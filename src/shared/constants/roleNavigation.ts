import {
  Boxes,
  Bot,
  Building2,
  ClipboardCheck,
  FileText,
  PackageCheck,
  Users,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

import type {
  UserRole,
} from "@/modules/auth/types/auth.types";

export interface RoleNavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface RoleNavigationGroup {
  label: string;
  items: RoleNavigationItem[];
}

export const ROLE_NAVIGATION: Record<
    UserRole,
    RoleNavigationGroup[]
> = {
  ADMIN: [
    {
      label: "Quản trị",
      items: [
        {
          label: "Tài khoản",
          path: "/admin/accounts",
          icon: Users,
        },
        {
          label: "Nhân viên",
          path: "/admin/employees",
          icon: Users,
        },
        {
          label: "Chi nhánh",
          path: "/admin/branches",
          icon: Building2,
        },
        {
          label: "Danh mục",
          path: "/admin/categories",
          icon: Boxes,
        },
      ],
    },
    {
      label: "Hỗ trợ",
      items: [
        {
          label: "Trợ lý AI",
          path: "/assistant",
          icon: Bot,
        },
      ],
    },
  ],

  MANAGER: [
    {
      label: "Quản lý",
      items: [
        {
          label: "Báo giá chờ duyệt",
          path: "/manager/quotation-approvals",
          icon: ClipboardCheck,
        },
        {
          label: "Hợp đồng chờ duyệt",
          path: "/manager/contract-approvals",
          icon: ClipboardCheck,
        },
        {
          label: "Đơn thuê",
          path: "/manager/rentals",
          icon: FileText,
        },
        {
          label: "Thiết bị",
          path: "/manager/equipment",
          icon: Boxes,
        },
      ],
    },
    {
      label: "Hỗ trợ",
      items: [
        {
          label: "Trợ lý AI",
          path: "/assistant",
          icon: Bot,
        },
      ],
    },
  ],

  SALES_STAFF: [
    {
      label: "Kinh doanh",
      items: [
        {
          label: "Khách hàng",
          path: "/sales/customers",
          icon: Users,
        },
        {
          label: "Yêu cầu thuê",
          path: "/sales/rental-requests",
          icon: PackageCheck,
        },
        {
          label: "Báo giá",
          path: "/sales/quotations",
          icon: FileText,
        },
        {
          label: "Đơn thuê",
          path: "/sales/rentals",
          icon: FileText,
        },
        {
          label: "Hợp đồng",
          path: "/sales/contracts",
          icon: ClipboardCheck,
        },
      ],
    },
  ],

  OPERATIONS_STAFF: [
    {
      label: "Vận hành",
      items: [
        {
          label: "Thiết bị và kho",
          path: "/operations/equipment",
          icon: Warehouse,
        },
      ],
    },
  ],

  ACCOUNTANT: [],

  CUSTOMER: [],
};
