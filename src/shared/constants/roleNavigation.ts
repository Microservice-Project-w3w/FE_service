import {
  BarChart3,
  Boxes,
  Building2,
  CircleDollarSign,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  PackageCheck,
  Scale,
  Settings,
  Truck,
  Users,
  Warehouse,
  Wrench,
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
      label: "Tổng quan",
      items: [
        {
          label: "Dashboard",
          path: "/admin/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
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
        {
          label: "Cấu hình",
          path: "/admin/settings",
          icon: Settings,
        },
        {
          label: "Báo cáo",
          path: "/admin/reports",
          icon: BarChart3,
        },
      ],
    },
  ],

  MANAGER: [
    {
      label: "Quản lý",
      items: [
        {
          label: "Dashboard quản lý",
          path: "/manager/dashboard",
          icon: LayoutDashboard,
        },
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
          label: "Giao nhận",
          path: "/manager/deliveries",
          icon: Truck,
        },
        {
          label: "Công nợ",
          path: "/manager/receivables",
          icon: CircleDollarSign,
        },
        {
          label: "Thiết bị",
          path: "/manager/equipment",
          icon: Boxes,
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
        {
          label: "Giao thiết bị",
          path: "/operations/deliveries",
          icon: Truck,
        },
        {
          label: "Nhận trả thiết bị",
          path: "/operations/returns",
          icon: PackageCheck,
        },
        {
          label: "Bảo trì và sửa chữa",
          path: "/operations/maintenance",
          icon: Wrench,
        },
      ],
    },
  ],

  ACCOUNTANT: [
    {
      label: "Kế toán",
      items: [
        {
          label: "Hóa đơn",
          path: "/accounting/invoices",
          icon: FileText,
        },
        {
          label: "Thanh toán",
          path: "/accounting/payments",
          icon: CircleDollarSign,
        },
        {
          label: "Tiền đặt cọc",
          path: "/accounting/deposits",
          icon: CircleDollarSign,
        },
        {
          label: "Công nợ",
          path: "/accounting/receivables",
          icon: ClipboardCheck,
        },
        {
          label: "Đối soát",
          path: "/accounting/reconciliation",
          icon: Scale,
        },
        {
          label: "Báo cáo doanh thu",
          path: "/accounting/revenue-reports",
          icon: BarChart3,
        },
      ],
    },
  ],

  CUSTOMER: [
    {
      label: "Dịch vụ của tôi",
      items: [
        {
          label: "Thiết bị",
          path: "/customer/equipment",
          icon: Boxes,
        },
        {
          label: "Yêu cầu thuê của tôi",
          path: "/customer/rental-requests",
          icon: PackageCheck,
        },
        {
          label: "Báo giá của tôi",
          path: "/customer/quotations",
          icon: FileText,
        },
        {
          label: "Hợp đồng của tôi",
          path: "/customer/contracts",
          icon: ClipboardCheck,
        },
        {
          label: "Hóa đơn",
          path: "/customer/invoices",
          icon: CircleDollarSign,
        },
        {
          label: "Yêu cầu trả",
          path: "/customer/return-requests",
          icon: Truck,
        },
        {
          label: "Báo cáo sự cố",
          path: "/customer/incidents",
          icon: Wrench,
        },
      ],
    },
  ],
};
