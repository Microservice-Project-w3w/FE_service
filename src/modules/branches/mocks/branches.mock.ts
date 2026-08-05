import type {
  Branch,
} from "@/modules/branches/types/branch.types";

export const initialBranches: Branch[] = [
  {
    id: "branch-hanoi",
    organizationId: "org-rentai",
    branchCode: "CN-HN",
    name: "Chi nhánh Hà Nội",
    phone: "02473001234",
    email: "hanoi@rentai.vn",
    address:
      "Số 25 đường Nguyễn Trãi, Thanh Xuân",
    province: "Hà Nội",
    managerEmployeeId: "employee-001",
    managerName: "Nguyễn Văn Quản Lý",
    managerEmail: "manager@rentai.vn",
    employeeCount: 5,
    activeRentalCount: 8,
    status: "ACTIVE",
    openedAt: "2023-01-10",
    description:
      "Chi nhánh điều hành chính tại khu vực miền Bắc.",
    createdAt: "2023-01-05T08:00:00.000Z",
    updatedAt: "2026-08-01T09:30:00.000Z",
  },
  {
    id: "branch-hcm",
    organizationId: "org-rentai",
    branchCode: "CN-HCM",
    name: "Chi nhánh TP. Hồ Chí Minh",
    phone: "02873005678",
    email: "hcm@rentai.vn",
    address:
      "Số 120 đường Cộng Hòa, Tân Bình",
    province: "TP. Hồ Chí Minh",
    managerEmployeeId: "employee-004",
    managerName: "Phạm Văn Minh",
    managerEmail:
      "minh.operations@rentai.vn",
    employeeCount: 2,
    activeRentalCount: 5,
    status: "ACTIVE",
    openedAt: "2023-08-01",
    description:
      "Phụ trách vận hành và giao nhận khu vực phía Nam.",
    createdAt: "2023-07-15T08:00:00.000Z",
    updatedAt: "2026-07-28T14:20:00.000Z",
  },
  {
    id: "branch-danang",
    organizationId: "org-rentai",
    branchCode: "CN-DN",
    name: "Chi nhánh Đà Nẵng",
    phone: "02367300999",
    email: "danang@rentai.vn",
    address:
      "Số 88 đường Nguyễn Văn Linh, Hải Châu",
    province: "Đà Nẵng",
    managerEmployeeId: "employee-007",
    managerName: "Đỗ Văn Kỹ Thuật",
    managerEmail:
      "technician@rentai.vn",
    employeeCount: 2,
    activeRentalCount: 2,
    status: "ACTIVE",
    openedAt: "2024-02-15",
    description:
      "Phục vụ khách hàng tại khu vực miền Trung.",
    createdAt: "2024-02-01T08:00:00.000Z",
    updatedAt: "2026-07-20T10:15:00.000Z",
  },
  {
    id: "branch-cantho",
    organizationId: "org-rentai",
    branchCode: "CN-CT",
    name: "Chi nhánh Cần Thơ",
    phone: "02927300111",
    email: "cantho@rentai.vn",
    address:
      "Số 35 đường 30 Tháng 4, Ninh Kiều",
    province: "Cần Thơ",
    managerEmployeeId: null,
    managerName: null,
    managerEmail: null,
    employeeCount: 0,
    activeRentalCount: 0,
    status: "INACTIVE",
    openedAt: "2025-05-20",
    description:
      "Chi nhánh đang tạm ngừng hoạt động.",
    createdAt: "2025-05-01T08:00:00.000Z",
    updatedAt: "2026-06-10T08:30:00.000Z",
  },
];
