import { createSafeDateFormatter } from "@/shared/utils/dateFormat";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Link2,
  Mail,
  MapPin,
  Phone,
  UserRound,
  X,
} from "lucide-react";

import {
  useEffect,
} from "react";

import {
  EmployeeStatusBadge,
} from "@/modules/employees/components/EmployeeStatusBadge";

import type {
  Employee,
  EmployeePosition,
  EmploymentType,
} from "@/modules/employees/types/employee.types";

interface EmployeeDetailDrawerProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
}

const positionLabels: Record<
  EmployeePosition,
  string
> = {
  BRANCH_MANAGER: "Quản lý chi nhánh",
  SALES_STAFF: "Nhân viên kinh doanh",
  OPERATIONS_STAFF: "Nhân viên vận hành",
  ACCOUNTANT: "Kế toán",
  TECHNICIAN: "Kỹ thuật viên",
  WAREHOUSE_STAFF: "Nhân viên kho",
  CUSTOMER_SERVICE: "Chăm sóc khách hàng",
};

const employmentTypeLabels: Record<
  EmploymentType,
  string
> = {
  FULL_TIME: "Toàn thời gian",
  PART_TIME: "Bán thời gian",
  CONTRACT: "Hợp đồng",
};

const dateFormatter =
  createSafeDateFormatter(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

const formatDate = (
  value: string | null,
): string => {
  if (!value) {
    return "Chưa cập nhật";
  }

  return dateFormatter.format(
    new Date(value),
  );
};

export const EmployeeDetailDrawer = ({
  isOpen,
  employee,
  onClose,
}: EmployeeDetailDrawerProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isOpen,
    onClose,
  ]);

  if (!isOpen || !employee) {
    return null;
  }

  const initials = employee.fullName
    .split(" ")
    .slice(-2)
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const details = [
    {
      label: "Email",
      value: employee.email,
      icon: Mail,
    },
    {
      label: "Số điện thoại",
      value: employee.phone,
      icon: Phone,
    },
    {
      label: "Ngày sinh",
      value: formatDate(
        employee.dateOfBirth,
      ),
      icon: CalendarDays,
    },
    {
      label: "Địa chỉ",
      value:
        employee.address ||
        "Chưa cập nhật",
      icon: MapPin,
    },
    {
      label: "Chi nhánh",
      value: employee.branchName,
      icon: Building2,
    },
    {
      label: "Phòng ban",
      value:
        employee.departmentName,
      icon: UserRound,
    },
    {
      label: "Chức vụ",
      value:
        positionLabels[
          employee.position
        ],
      icon: BriefcaseBusiness,
    },
    {
      label: "Loại làm việc",
      value:
        employmentTypeLabels[
          employee.employmentType
        ],
      icon: BriefcaseBusiness,
    },
    {
      label: "Ngày vào làm",
      value: formatDate(
        employee.startDate,
      ),
      icon: CalendarDays,
    },
    {
      label: "Tài khoản liên kết",
      value:
        employee.linkedAccountEmail ||
        "Chưa liên kết",
      icon: Link2,
    },
  ];

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Đóng chi tiết"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
      />

      <aside className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Hồ sơ nhân viên
            </p>

            <h2 className="mt-1 text-xl font-bold text-slate-950">
              Chi tiết nhân viên
            </h2>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </header>

        <div className="p-6">
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-4">
              <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-xl font-bold text-blue-700">
                {initials}
              </span>

              <div>
                <h3 className="text-xl font-bold text-slate-950">
                  {employee.fullName}
                </h3>

                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {employee.employeeCode}
                </p>

                <div className="mt-3">
                  <EmployeeStatusBadge
                    status={employee.status}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            {details.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={17} />
                    </span>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-400">
                        {item.label}
                      </p>

                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="text-sm font-bold text-slate-900">
              Ghi chú
            </h3>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {employee.note ||
                "Chưa có ghi chú."}
            </p>
          </section>
        </div>
      </aside>
    </div>
  );
};
