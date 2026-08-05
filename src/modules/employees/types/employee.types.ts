export const employeeStatuses = [
  "ACTIVE",
  "ON_LEAVE",
  "RESIGNED",
] as const;

export type EmployeeStatus =
  (typeof employeeStatuses)[number];

export const employeePositions = [
  "BRANCH_MANAGER",
  "SALES_STAFF",
  "OPERATIONS_STAFF",
  "ACCOUNTANT",
  "TECHNICIAN",
  "WAREHOUSE_STAFF",
  "CUSTOMER_SERVICE",
] as const;

export type EmployeePosition =
  (typeof employeePositions)[number];

export const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
] as const;

export type EmploymentType =
  (typeof employmentTypes)[number];

export interface Employee {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  address: string;
  branchId: string;
  branchName: string;
  departmentName: string;
  position: EmployeePosition;
  employmentType: EmploymentType;
  startDate: string;
  status: EmployeeStatus;
  linkedAccountId: string | null;
  linkedAccountEmail: string | null;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFilters {
  search: string;
  branchId: "ALL" | string;
  position: "ALL" | EmployeePosition;
  status: "ALL" | EmployeeStatus;
}

export interface CreateEmployeeInput {
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  address: string;
  branchId: string;
  branchName: string;
  departmentName: string;
  position: EmployeePosition;
  employmentType: EmploymentType;
  startDate: string;
  status: EmployeeStatus;
  linkedAccountId: string | null;
  linkedAccountEmail: string | null;
  note: string;
}

export type UpdateEmployeeInput =
  Partial<
    Omit<
      CreateEmployeeInput,
      "employeeCode"
    >
  >;

export interface TransferEmployeeBranchInput {
  branchId: string;
  branchName: string;
}

export interface UpdateEmployeeStatusInput {
  status: EmployeeStatus;
}

export interface EmployeeStatistics {
  total: number;
  active: number;
  onLeave: number;
  resigned: number;
}
