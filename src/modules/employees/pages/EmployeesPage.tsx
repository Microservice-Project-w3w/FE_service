import {
  BriefcaseBusiness,
  Building2,
  Eye,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  UserCheck,
  UserCog,
  UserMinus,
  Users,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  employeesApi,
} from "@/modules/employees/api/employees.api";

import {
  EmployeeActionConfirmDialog,
} from "@/modules/employees/components/EmployeeActionConfirmDialog";

import {
  EmployeeDetailDrawer,
} from "@/modules/employees/components/EmployeeDetailDrawer";

import {
  EmployeeFormModal,
} from "@/modules/employees/components/EmployeeFormModal";

import {
  DataPagination,
} from "@/shared/components/data-display/DataPagination";

import {
  EmployeeStatusBadge,
} from "@/modules/employees/components/EmployeeStatusBadge";

import {
  EmployeeStatusDialog,
} from "@/modules/employees/components/EmployeeStatusDialog";

import {
  EmployeeTransferBranchDialog,
} from "@/modules/employees/components/EmployeeTransferBranchDialog";

import type {
  CreateEmployeeInput,
  Employee,
  EmployeePosition,
  EmployeeStatus,
  UpdateEmployeeInput,
} from "@/modules/employees/types/employee.types";

const branches = [
  {
    id: "branch-hanoi",
    name: "Chi nhánh Hà Nội",
  },
  {
    id: "branch-hcm",
    name: "Chi nhánh TP. Hồ Chí Minh",
  },
  {
    id: "branch-danang",
    name: "Chi nhánh Đà Nẵng",
  },
];

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

const dateFormatter =
  new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

const normalizeText = (
  value: string,
): string => {
  return value
    .trim()
    .toLocaleLowerCase("vi");
};

export const EmployeesPage = () => {
  const [
    employees,
    setEmployees,
  ] = useState<Employee[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null,
  );

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string | null>(
    null,
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    branchId,
    setBranchId,
  ] = useState("ALL");

  const [
    status,
    setStatus,
  ] = useState<
    "ALL" | EmployeeStatus
  >("ALL");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    pageSize,
    setPageSize,
  ] = useState(5);

  const [
    detailEmployee,
    setDetailEmployee,
  ] = useState<Employee | null>(
    null,
  );

  const [
    formMode,
    setFormMode,
  ] = useState<
    "CREATE" | "EDIT"
  >("CREATE");

  const [
    formEmployee,
    setFormEmployee,
  ] = useState<Employee | null>(
    null,
  );

  const [
    isFormOpen,
    setIsFormOpen,
  ] = useState(false);

  const [
    statusEmployee,
    setStatusEmployee,
  ] = useState<Employee | null>(
    null,
  );

  const [
    transferEmployee,
    setTransferEmployee,
  ] = useState<Employee | null>(
    null,
  );

  const [
    employeeToDelete,
    setEmployeeToDelete,
  ] = useState<Employee | null>(
    null,
  );

  const loadEmployees =
    useCallback(async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        setEmployees(
          await employeesApi.list(),
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách nhân viên.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId =
      window.setTimeout(() => {
        setSuccessMessage(null);
      }, 3500);

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, [successMessage]);

  const statistics = useMemo(
    () => ({
      total: employees.length,
      active: employees.filter(
        (item) =>
          item.status === "ACTIVE",
      ).length,
      onLeave: employees.filter(
        (item) =>
          item.status === "ON_LEAVE",
      ).length,
      resigned: employees.filter(
        (item) =>
          item.status === "RESIGNED",
      ).length,
    }),
    [employees],
  );

  const filteredEmployees =
    useMemo(() => {
      const searchValue =
        normalizeText(search);

      return employees.filter(
        (employee) => {
          const matchesSearch =
            !searchValue ||
            [
              employee.employeeCode,
              employee.fullName,
              employee.email,
              employee.phone,
            ].some((value) =>
              normalizeText(
                value,
              ).includes(
                searchValue,
              ),
            );

          const matchesBranch =
            branchId === "ALL" ||
            employee.branchId ===
              branchId;

          const matchesStatus =
            status === "ALL" ||
            employee.status ===
              status;

          return (
            matchesSearch &&
            matchesBranch &&
            matchesStatus
          );
        },
      );
    }, [
      branchId,
      employees,
      search,
      status,
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredEmployees.length /
        pageSize,
    ),
  );

  const paginatedEmployees =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        pageSize;

      return filteredEmployees.slice(
        startIndex,
        startIndex + pageSize,
      );
    }, [
      currentPage,
      filteredEmployees,
      pageSize,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    branchId,
    search,
    status,
  ]);

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages,
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const replaceEmployee = (
    updatedEmployee: Employee,
  ) => {
    setEmployees((current) =>
      current.map((item) =>
        item.id ===
        updatedEmployee.id
          ? updatedEmployee
          : item,
      ),
    );
  };

  const handleSubmitForm = async (
    input: CreateEmployeeInput,
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (
        formMode === "CREATE"
      ) {
        const created =
          await employeesApi.create(
            input,
          );

        setEmployees((current) => [
          created,
          ...current,
        ]);

        setSuccessMessage(
          "Đã thêm nhân viên mới.",
        );
      } else if (formEmployee) {
        const updateInput:
          UpdateEmployeeInput = {
            fullName:
              input.fullName,
            email: input.email,
            phone: input.phone,
            dateOfBirth:
              input.dateOfBirth,
            address: input.address,
            branchId:
              input.branchId,
            branchName:
              input.branchName,
            departmentName:
              input.departmentName,
            position:
              input.position,
            employmentType:
              input.employmentType,
            startDate:
              input.startDate,
            status: input.status,
            linkedAccountId:
              input.linkedAccountId,
            linkedAccountEmail:
              input.linkedAccountEmail,
            note: input.note,
          };

        const updated =
          await employeesApi.update(
            formEmployee.id,
            updateInput,
          );

        replaceEmployee(updated);

        setSuccessMessage(
          "Đã cập nhật nhân viên.",
        );
      }

      setIsFormOpen(false);
      setFormEmployee(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể lưu nhân viên.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange =
    async (
      nextStatus: EmployeeStatus,
    ) => {
      if (!statusEmployee) {
        return;
      }

      setIsSubmitting(true);

      try {
        const updated =
          await employeesApi
            .updateStatus(
              statusEmployee.id,
              {
                status: nextStatus,
              },
            );

        replaceEmployee(updated);
        setStatusEmployee(null);

        setSuccessMessage(
          "Đã cập nhật trạng thái nhân viên.",
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể cập nhật trạng thái.",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  const handleTransfer =
    async (
      nextBranchId: string,
      nextBranchName: string,
    ) => {
      if (!transferEmployee) {
        return;
      }

      setIsSubmitting(true);

      try {
        const updated =
          await employeesApi
            .transferBranch(
              transferEmployee.id,
              {
                branchId:
                  nextBranchId,
                branchName:
                  nextBranchName,
              },
            );

        replaceEmployee(updated);
        setTransferEmployee(null);

        setSuccessMessage(
          "Đã chuyển chi nhánh.",
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể chuyển chi nhánh.",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  const handleDelete =
    async () => {
      if (!employeeToDelete) {
        return;
      }

      setIsSubmitting(true);

      try {
        await employeesApi.remove(
          employeeToDelete.id,
        );

        setEmployees((current) =>
          current.filter(
            (item) =>
              item.id !==
              employeeToDelete.id,
          ),
        );

        setEmployeeToDelete(null);

        setSuccessMessage(
          "Đã xóa hồ sơ nhân viên.",
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể xóa nhân viên.",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

  const handleReset =
    async () => {
      setIsLoading(true);

      try {
        setEmployees(
          await employeesApi
            .resetMockData(),
        );

        setSearch("");
        setBranchId("ALL");
        setStatus("ALL");

        setSuccessMessage(
          "Đã khôi phục dữ liệu.",
        );
      } finally {
        setIsLoading(false);
      }
    };

  const cards = [
    {
      label: "Tổng nhân viên",
      value: statistics.total,
      icon: Users,
    },
    {
      label: "Đang làm việc",
      value: statistics.active,
      icon: UserCheck,
    },
    {
      label: "Tạm nghỉ",
      value: statistics.onLeave,
      icon: UserCog,
    },
    {
      label: "Đã nghỉ việc",
      value: statistics.resigned,
      icon: UserMinus,
    },
  ];

  return (
    <div className="pb-10">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Quản lý nhân viên
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Quản lý hồ sơ, chức vụ,
            chi nhánh và trạng thái làm việc.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              void handleReset();
            }}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
          >
            <RefreshCcw size={17} />
            Khôi phục dữ liệu
          </button>

          <button
            type="button"
            onClick={() => {
              setFormMode("CREATE");
              setFormEmployee(null);
              setErrorMessage(null);
              setIsFormOpen(true);
            }}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Thêm nhân viên
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={21} />
                </span>

                <strong className="text-3xl font-bold text-slate-950">
                  {item.value}
                </strong>
              </div>

              <p className="mt-5 text-sm font-bold text-slate-800">
                {item.label}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_240px_220px]">
          <label className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value,
                );
              }}
              placeholder="Tìm tên, mã, email hoặc số điện thoại"
              className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <select
            value={branchId}
            onChange={(event) => {
              setBranchId(
                event.target.value,
              );
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
          >
            <option value="ALL">
              Tất cả chi nhánh
            </option>

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

          <select
            value={status}
            onChange={(event) => {
              setStatus(
                event.target
                  .value as
                  | "ALL"
                  | EmployeeStatus,
              );
            }}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
          >
            <option value="ALL">
              Tất cả trạng thái
            </option>

            <option value="ACTIVE">
              Đang làm việc
            </option>

            <option value="ON_LEAVE">
              Tạm nghỉ
            </option>

            <option value="RESIGNED">
              Đã nghỉ việc
            </option>
          </select>
        </div>
      </section>

      {successMessage && (
        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {successMessage}
        </div>
      )}

      {errorMessage &&
        !isFormOpen && (
          <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        )}

      <div className="mt-5 w-full">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Danh sách nhân viên
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Hồ sơ và phân công nhân sự
            </p>
          </div>

          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700">
            {filteredEmployees.length}
            {" nhân viên"}
          </span>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1380px] border-collapse">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                {[
                  "STT",
                  "Nhân viên",
                  "Liên hệ",
                  "Chức vụ",
                  "Chi nhánh",
                  "Trạng thái",
                  "Ngày vào làm",
                  "Thao tác",
                ].map((label) => (
                  <th
                    key={label}
                    className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center text-sm text-slate-500"
                  >
                    Đang tải danh sách...
                  </td>
                </tr>
              ) : filteredEmployees.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center text-sm text-slate-500"
                  >
                    Không tìm thấy nhân viên.
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map(
                  (
                    employee,
                    index,
                  ) => (
                    <tr
                      key={employee.id}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-5 text-sm font-semibold text-slate-500">
                        {(currentPage - 1) *
                          pageSize +
                          index +
                          1}
                      </td>

                      <td className="px-5 py-5">
                        <p className="font-bold text-slate-900">
                          {employee.fullName}
                        </p>

                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {employee.employeeCode}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <p className="text-sm font-semibold text-slate-700">
                          {employee.email}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {employee.phone}
                        </p>
                      </td>

                      <td className="px-5 py-5">
                        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                          <BriefcaseBusiness
                            size={14}
                          />

                          {
                            positionLabels[
                              employee.position
                            ]
                          }
                        </span>
                      </td>

                      <td className="px-5 py-5 text-sm font-semibold text-slate-600">
                        {employee.branchName}
                      </td>

                      <td className="px-5 py-5">
                        <EmployeeStatusBadge
                          status={employee.status}
                        />
                      </td>

                      <td className="px-5 py-5 text-sm font-semibold text-slate-600">
                        {dateFormatter.format(
                          new Date(
                            employee.startDate,
                          ),
                        )}
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            title="Xem chi tiết"
                            onClick={() => {
                              setDetailEmployee(
                                employee,
                              );
                            }}
                            className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            title="Sửa"
                            onClick={() => {
                              setFormMode("EDIT");
                              setFormEmployee(
                                employee,
                              );
                              setErrorMessage(null);
                              setIsFormOpen(true);
                            }}
                            className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            title="Chuyển chi nhánh"
                            disabled={
                              employee.status ===
                              "RESIGNED"
                            }
                            onClick={() => {
                              setTransferEmployee(
                                employee,
                              );
                            }}
                            className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-30"
                          >
                            <Building2 size={16} />
                          </button>

                          <button
                            type="button"
                            title="Cập nhật trạng thái"
                            onClick={() => {
                              setStatusEmployee(
                                employee,
                              );
                            }}
                            className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                          >
                            <UserCog size={16} />
                          </button>

                          <button
                            type="button"
                            title="Xóa"
                            disabled={
                              employee.status !==
                              "RESIGNED"
                            }
                            onClick={() => {
                              setEmployeeToDelete(
                                employee,
                              );
                            }}
                            className="flex size-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
        </section>

        {!isLoading && (
          <DataPagination
          currentPage={
            currentPage
          }
          pageSize={pageSize}
          totalItems={
            filteredEmployees.length
          }
          itemLabel="nhân viên"
          onPageChange={
            setCurrentPage
          }
          onPageSizeChange={(
            nextPageSize,
          ) => {
            setPageSize(
              nextPageSize,
            );

            setCurrentPage(1);
          }}
          />
        )}
      </div>

      <EmployeeDetailDrawer
        isOpen={
          detailEmployee !== null
        }
        employee={detailEmployee}
        onClose={() => {
          setDetailEmployee(null);
        }}
      />

      <EmployeeFormModal
        isOpen={isFormOpen}
        mode={formMode}
        employee={formEmployee}
        branches={branches}
        isSubmitting={isSubmitting}
        errorMessage={
          isFormOpen
            ? errorMessage
            : null
        }
        onClose={() => {
          if (!isSubmitting) {
            setIsFormOpen(false);
            setFormEmployee(null);
            setErrorMessage(null);
          }
        }}
        onSubmit={(input) => {
          void handleSubmitForm(input);
        }}
      />

      <EmployeeStatusDialog
        isOpen={
          statusEmployee !== null
        }
        employee={statusEmployee}
        isSubmitting={isSubmitting}
        onClose={() => {
          setStatusEmployee(null);
        }}
        onConfirm={(nextStatus) => {
          void handleStatusChange(
            nextStatus,
          );
        }}
      />

      <EmployeeTransferBranchDialog
        isOpen={
          transferEmployee !== null
        }
        employee={transferEmployee}
        branches={branches}
        isSubmitting={isSubmitting}
        onClose={() => {
          setTransferEmployee(null);
        }}
        onConfirm={(
          nextBranchId,
          nextBranchName,
        ) => {
          void handleTransfer(
            nextBranchId,
            nextBranchName,
          );
        }}
      />

      <EmployeeActionConfirmDialog
        isOpen={
          employeeToDelete !== null
        }
        title="Xóa hồ sơ nhân viên?"
        message={
          employeeToDelete
            ? `Hồ sơ của ${employeeToDelete.fullName} sẽ bị xóa khỏi dữ liệu mock.`
            : ""
        }
        confirmLabel="Xóa nhân viên"
        isSubmitting={isSubmitting}
        onClose={() => {
          setEmployeeToDelete(null);
        }}
        onConfirm={() => {
          void handleDelete();
        }}
      />
    </div>
  );
};
