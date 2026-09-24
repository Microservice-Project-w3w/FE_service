import {
  Save,
  UserPlus,
  X,
} from "lucide-react";

import {
  type FormEvent,
  useEffect,
  useState,
} from "react";

import type {
  CreateEmployeeInput,
  Employee,
  EmployeePosition,
  EmployeeStatus,
  EmploymentType,
} from "@/modules/employees/types/employee.types";

interface BranchOption {
  id: string;
  name: string;
}

interface EmployeeFormModalProps {
  isOpen: boolean;
  mode: "CREATE" | "EDIT";
  employee: Employee | null;
  branches: BranchOption[];
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSubmit: (
    input: CreateEmployeeInput,
  ) => void;
}

interface EmployeeFormState {
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  branchId: string;
  departmentName: string;
  position: EmployeePosition;
  employmentType: EmploymentType;
  startDate: string;
  status: EmployeeStatus;
  linkedAccountEmail: string;
  note: string;
}

const positionOptions: Array<{
  value: EmployeePosition;
  label: string;
}> = [
  {
    value: "BRANCH_MANAGER",
    label: "Quản lý chi nhánh",
  },
  {
    value: "SALES_STAFF",
    label: "Nhân viên kinh doanh",
  },
  {
    value: "OPERATIONS_STAFF",
    label: "Nhân viên vận hành",
  },
  {
    value: "ACCOUNTANT",
    label: "Kế toán",
  },
  {
    value: "TECHNICIAN",
    label: "Kỹ thuật viên",
  },
  {
    value: "WAREHOUSE_STAFF",
    label: "Nhân viên kho",
  },
  {
    value: "CUSTOMER_SERVICE",
    label: "Chăm sóc khách hàng",
  },
];

const employmentTypeOptions: Array<{
  value: EmploymentType;
  label: string;
}> = [
  {
    value: "FULL_TIME",
    label: "Toàn thời gian",
  },
  {
    value: "PART_TIME",
    label: "Bán thời gian",
  },
  {
    value: "CONTRACT",
    label: "Hợp đồng",
  },
];

const statusOptions: Array<{
  value: EmployeeStatus;
  label: string;
}> = [
  {
    value: "ACTIVE",
    label: "Đang làm việc",
  },
  {
    value: "ON_LEAVE",
    label: "Tạm nghỉ",
  },
  {
    value: "RESIGNED",
    label: "Đã nghỉ việc",
  },
];

const inputClassName =
  "mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const createInitialForm = (
  employee: Employee | null,
  defaultBranchId: string,
): EmployeeFormState => {
  if (employee) {
    return {
      employeeCode:
        employee.employeeCode,
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      dateOfBirth:
        employee.dateOfBirth ?? "",
      address: employee.address,
      branchId: employee.branchId,
      departmentName:
        employee.departmentName,
      position: employee.position,
      employmentType:
        employee.employmentType,
      startDate: employee.startDate,
      status: employee.status,
      linkedAccountEmail:
        employee.linkedAccountEmail ??
        "",
      note: employee.note,
    };
  }

  return {
    employeeCode: "",
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    branchId: defaultBranchId,
    departmentName: "",
    position: "SALES_STAFF",
    employmentType: "FULL_TIME",
    startDate:
      new Date()
        .toISOString()
        .slice(0, 10),
    status: "ACTIVE",
    linkedAccountEmail: "",
    note: "",
  };
};

export const EmployeeFormModal = ({
  isOpen,
  mode,
  employee,
  branches,
  isSubmitting,
  errorMessage,
  onClose,
  onSubmit,
}: EmployeeFormModalProps) => {
  const [
    form,
    setForm,
  ] = useState<EmployeeFormState>(
    createInitialForm(
      null,
      branches[0]?.id ?? "",
    ),
  );

  const [
    errors,
    setErrors,
  ] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setForm(
      createInitialForm(
        employee,
        branches[0]?.id ?? "",
      ),
    );

    setErrors({});
  }, [
    branches,
    employee,
    isOpen,
  ]);

  if (!isOpen) {
    return null;
  }

  const updateField = <
    K extends keyof EmployeeFormState,
  >(
    field: K,
    value: EmployeeFormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const validate = (): boolean => {
    const nextErrors:
      Record<string, string> = {};

    if (!form.employeeCode.trim()) {
      nextErrors.employeeCode =
        "Mã nhân viên không được để trống.";
    }

    if (!form.fullName.trim()) {
      nextErrors.fullName =
        "Họ tên không được để trống.";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim(),
      )
    ) {
      nextErrors.email =
        "Email không đúng định dạng.";
    }

    if (
      !/^0\d{9,10}$/.test(
        form.phone.trim(),
      )
    ) {
      nextErrors.phone =
        "Số điện thoại phải có 10 đến 11 chữ số.";
    }

    if (!form.branchId) {
      nextErrors.branchId =
        "Vui lòng chọn chi nhánh.";
    }

    if (!form.departmentName.trim()) {
      nextErrors.departmentName =
        "Phòng ban không được để trống.";
    }

    if (!form.startDate) {
      nextErrors.startDate =
        "Ngày vào làm không được để trống.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length ===
      0
    );
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const branch = branches.find(
      (item) =>
        item.id === form.branchId,
    );

    if (!branch) {
      return;
    }

    const linkedEmail =
      form.linkedAccountEmail
        .trim()
        .toLowerCase();

    onSubmit({
      employeeCode:
        form.employeeCode
          .trim()
          .toUpperCase(),
      fullName:
        form.fullName.trim(),
      email:
        form.email
          .trim()
          .toLowerCase(),
      phone: form.phone.trim(),
      dateOfBirth:
        form.dateOfBirth || null,
      address: form.address.trim(),
      branchId: branch.id,
      branchName: branch.name,
      departmentName:
        form.departmentName.trim(),
      position: form.position,
      employmentType:
        form.employmentType,
      startDate: form.startDate,
      status: form.status,
      linkedAccountId:
        linkedEmail
          ? employee?.linkedAccountId ??
            `account-${Date.now()}`
          : null,
      linkedAccountEmail:
        linkedEmail || null,
      note: form.note.trim(),
    });
  };

  const renderError = (
    field: keyof EmployeeFormState,
  ) => {
    if (!errors[field]) {
      return null;
    }

    return (
      <p className="mt-1.5 text-xs font-medium text-rose-600">
        {errors[field]}
      </p>
    );
  };

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/40 px-4 py-6 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Đóng biểu mẫu"
        className="absolute inset-0 cursor-default"
        onClick={() => {
          if (!isSubmitting) {
            onClose();
          }
        }}
      />

      <section className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <UserPlus size={21} />
            </span>

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {mode === "CREATE"
                  ? "Thêm nhân viên"
                  : "Cập nhật nhân viên"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Điền thông tin hồ sơ nhân sự
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đóng"
            disabled={isSubmitting}
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <X size={20} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >
          {errorMessage && (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="text-sm font-semibold text-slate-700">
                Mã nhân viên
              </span>

              <input
                value={form.employeeCode}
                disabled={mode === "EDIT"}
                onChange={(event) => {
                  updateField(
                    "employeeCode",
                    event.target.value,
                  );
                }}
                className={[
                  inputClassName,
                  mode === "EDIT"
                    ? "cursor-not-allowed bg-slate-100"
                    : "",
                ].join(" ")}
              />

              {renderError(
                "employeeCode",
              )}
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">
                Họ và tên
              </span>

              <input
                value={form.fullName}
                onChange={(event) => {
                  updateField(
                    "fullName",
                    event.target.value,
                  );
                }}
                className={inputClassName}
              />

              {renderError("fullName")}
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">
                Email
              </span>

              <input
                type="email"
                value={form.email}
                onChange={(event) => {
                  updateField(
                    "email",
                    event.target.value,
                  );
                }}
                className={inputClassName}
              />

              {renderError("email")}
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">
                Số điện thoại
              </span>

              <input
                value={form.phone}
                onChange={(event) => {
                  updateField(
                    "phone",
                    event.target.value,
                  );
                }}
                className={inputClassName}
              />

              {renderError("phone")}
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">
                Ngày sinh
              </span>

              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(event) => {
                  updateField(
                    "dateOfBirth",
                    event.target.value,
                  );
                }}
                className={inputClassName}
              />
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">
                Ngày vào làm
              </span>

              <input
                type="date"
                value={form.startDate}
                onChange={(event) => {
                  updateField(
                    "startDate",
                    event.target.value,
                  );
                }}
                className={inputClassName}
              />

              {renderError("startDate")}
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">
                Chi nhánh
              </span>

              <select
                value={form.branchId}
                onChange={(event) => {
                  updateField(
                    "branchId",
                    event.target.value,
                  );
                }}
                className={inputClassName}
              >
                {branches.map(
                  (branch) => (
                    <option
                      key={branch.id}
                      value={branch.id}
                    >
                      {branch.name}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">
                Phòng ban
              </span>

              <input
                value={
                  form.departmentName
                }
                onChange={(event) => {
                  updateField(
                    "departmentName",
                    event.target.value,
                  );
                }}
                className={inputClassName}
              />

              {renderError(
                "departmentName",
              )}
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">
                Chức vụ
              </span>

              <select
                value={form.position}
                onChange={(event) => {
                  updateField(
                    "position",
                    event.target
                      .value as EmployeePosition,
                  );
                }}
                className={inputClassName}
              >
                {positionOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">
                Loại làm việc
              </span>

              <select
                value={
                  form.employmentType
                }
                onChange={(event) => {
                  updateField(
                    "employmentType",
                    event.target
                      .value as EmploymentType,
                  );
                }}
                className={inputClassName}
              >
                {employmentTypeOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">
                Trạng thái
              </span>

              <select
                value={form.status}
                onChange={(event) => {
                  updateField(
                    "status",
                    event.target
                      .value as EmployeeStatus,
                  );
                }}
                className={inputClassName}
              >
                {statusOptions.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label>
              <span className="text-sm font-semibold text-slate-700">
                Email tài khoản liên kết
              </span>

              <input
                type="email"
                value={
                  form.linkedAccountEmail
                }
                onChange={(event) => {
                  updateField(
                    "linkedAccountEmail",
                    event.target.value,
                  );
                }}
                className={inputClassName}
              />
            </label>

            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">
                Địa chỉ
              </span>

              <input
                value={form.address}
                onChange={(event) => {
                  updateField(
                    "address",
                    event.target.value,
                  );
                }}
                className={inputClassName}
              />
            </label>

            <label className="md:col-span-2">
              <span className="text-sm font-semibold text-slate-700">
                Ghi chú
              </span>

              <textarea
                rows={4}
                value={form.note}
                onChange={(event) => {
                  updateField(
                    "note",
                    event.target.value,
                  );
                }}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          <footer className="mt-7 flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={17} />

              {isSubmitting
                ? "Đang lưu..."
                : mode === "CREATE"
                  ? "Thêm nhân viên"
                  : "Lưu thay đổi"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
};
