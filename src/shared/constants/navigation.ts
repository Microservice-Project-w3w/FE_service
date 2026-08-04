import {
  BarChart3,
  Boxes,
  Building2,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Settings,
  Truck,
  Users,
  Warehouse,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
  {
    label: "Tổng quan",
    items: [
      {
        label: "Tổng quan",
        path: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Quản lý vận hành",
    items: [
      {
        label: "Thiết bị",
        path: "/equipment",
        icon: Boxes,
      },
      {
        label: "Kho thiết bị",
        path: "/inventory",
        icon: Warehouse,
      },
      {
        label: "Đơn thuê",
        path: "/rentals",
        icon: FileText,
      },
      {
        label: "Giao và nhận",
        path: "/deliveries",
        icon: Truck,
      },
      {
        label: "Bảo trì",
        path: "/maintenance",
        icon: Wrench,
      },
    ],
  },
  {
    label: "Đối tác và nhân sự",
    items: [
      {
        label: "Khách hàng",
        path: "/customers",
        icon: Users,
      },
      {
        label: "Nhân viên",
        path: "/employees",
        icon: Building2,
      },
    ],
  },
  {
    label: "Quản trị",
    items: [
      {
        label: "Phê duyệt",
        path: "/approvals",
        icon: ClipboardCheck,
      },
      {
        label: "Báo cáo",
        path: "/reports",
        icon: BarChart3,
      },
      {
        label: "Cài đặt",
        path: "/settings",
        icon: Settings,
      },
    ],
  },
];
