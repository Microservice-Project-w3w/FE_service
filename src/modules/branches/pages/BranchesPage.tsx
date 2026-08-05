import {
  Building2,
  CircleOff,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Power,
  PowerOff,
  RefreshCcw,
  Search,
  Trash2,
  UserRoundCog,
  Users,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  branchesApi,
} from "@/modules/branches/api/branches.api";

import {
  BranchActionConfirmDialog,
} from "@/modules/branches/components/BranchActionConfirmDialog";

import {
  BranchDetailDrawer,
} from "@/modules/branches/components/BranchDetailDrawer";

import {
  BranchFormModal,
} from "@/modules/branches/components/BranchFormModal";

import {
  BranchManagerDialog,
  type BranchManagerOption,
} from "@/modules/branches/components/BranchManagerDialog";

import {
  BranchStatusBadge,
} from "@/modules/branches/components/BranchStatusBadge";

import type {
  Branch,
  BranchStatus,
  CreateBranchInput,
} from "@/modules/branches/types/branch.types";

import {
  employeesApi,
} from "@/modules/employees/api/employees.api";

import type {
  Employee,
  EmployeePosition,
} from "@/modules/employees/types/employee.types";

import {
  DataPagination,
} from "@/shared/components/data-display/DataPagination";

type BranchFormMode =
  | "CREATE"
  | "EDIT";

type PendingAction =
  | {
      type: "STATUS";
      branch: Branch;
      nextStatus: BranchStatus;
    }
  | {
      type: "DELETE";
      branch: Branch;
    }
  | {
      type: "RESET";
    };

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

const formatDate = (
  value: string,
): string => {
  return dateFormatter.format(
    new Date(value),
  );
};

const normalizeText = (
  value: string,
): string => {
  return value
    .trim()
    .toLocaleLowerCase("vi");
};

export const BranchesPage = () => {
  const [
    branches,
    setBranches,
  ] = useState<Branch[]>([]);

  const [
    employees,
    setEmployees,
  ] = useState<Employee[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    BranchStatus | "ALL"
  >("ALL");

  const [
    provinceFilter,
    setProvinceFilter,
  ] = useState("ALL");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    pageSize,
    setPageSize,
  ] = useState(5);

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
    formOpen,
    setFormOpen,
  ] = useState(false);

  const [
    formMode,
    setFormMode,
  ] = useState<BranchFormMode>(
    "CREATE",
  );

  const [
    formBranch,
    setFormBranch,
  ] = useState<Branch | null>(
    null,
  );

  const [
    detailBranch,
    setDetailBranch,
  ] = useState<Branch | null>(
    null,
  );

  const [
    managerBranch,
    setManagerBranch,
  ] = useState<Branch | null>(
    null,
  );

  const [
    pendingAction,
    setPendingAction,
  ] = useState<PendingAction | null>(
    null,
  );

  const loadData =
    useCallback(async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const [
          branchData,
          employeeData,
        ] = await Promise.all([
          branchesApi.list(),
          employeesApi.list(),
        ]);

        setBranches(branchData);
        setEmployees(employeeData);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu chi nhánh.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const statistics = useMemo(() => {
    return {
      total: branches.length,

      active: branches.filter(
        (branch) =>
          branch.status === "ACTIVE",
      ).length,

      inactive: branches.filter(
        (branch) =>
          branch.status ===
          "INACTIVE",
      ).length,

      employees: branches.reduce(
        (total, branch) =>
          total +
          branch.employeeCount,
        0,
      ),
    };
  }, [branches]);

  const provinces = useMemo(() => {
    return Array.from(
      new Set(
        branches.map(
          (branch) =>
            branch.province,
        ),
      ),
    ).sort((left, right) =>
      left.localeCompare(
        right,
        "vi",
      ),
    );
  }, [branches]);

  const filteredBranches =
    useMemo(() => {
      const normalizedSearch =
        normalizeText(search);

      return branches
        .filter((branch) => {
          const matchesSearch =
            normalizedSearch.length ===
              0 ||
            [
              branch.branchCode,
              branch.name,
              branch.phone,
              branch.email,
              branch.address,
              branch.province,
              branch.managerName ?? "",
            ].some((value) =>
              normalizeText(
                value,
              ).includes(
                normalizedSearch,
              ),
            );

          const matchesStatus =
            statusFilter === "ALL" ||
            branch.status ===
              statusFilter;

          const matchesProvince =
            provinceFilter === "ALL" ||
            branch.province ===
              provinceFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesProvince
          );
        })
        .sort((left, right) => {
          if (
            left.status !==
            right.status
          ) {
            return left.status ===
              "ACTIVE"
              ? -1
              : 1;
          }

          return left.name.localeCompare(
            right.name,
            "vi",
          );
        });
    }, [
      branches,
      provinceFilter,
      search,
      statusFilter,
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredBranches.length /
        pageSize,
    ),
  );

  const paginatedBranches =
    useMemo(() => {
      const startIndex =
        (currentPage - 1) *
        pageSize;

      return filteredBranches.slice(
        startIndex,
        startIndex + pageSize,
      );
    }, [
      currentPage,
      filteredBranches,
      pageSize,
    ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    provinceFilter,
  ]);

  useEffect(() => {
    if (
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const managerOptions =
    useMemo<
      BranchManagerOption[]
    >(() => {
      return employees
        .filter(
          (employee) =>
            employee.status ===
            "ACTIVE",
        )
        .map((employee) => {
          const assignedBranch =
            branches.find(
              (branch) =>
                branch.managerEmployeeId ===
                employee.id,
            );

          return {
            id: employee.id,
            fullName:
              employee.fullName,
            email: employee.email,
            positionLabel:
              positionLabels[
                employee.position
              ],
            assignedBranchId:
              assignedBranch?.id ??
              null,
            assignedBranchName:
              assignedBranch?.name ??
              null,
          };
        })
        .sort((left, right) =>
          left.fullName.localeCompare(
            right.fullName,
            "vi",
          ),
        );
    }, [
      branches,
      employees,
    ]);

  const handleOpenCreate = () => {
    setErrorMessage(null);
    setFormMode("CREATE");
    setFormBranch(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (
    branch: Branch,
  ) => {
    setErrorMessage(null);
    setDetailBranch(null);
    setFormMode("EDIT");
    setFormBranch(branch);
    setFormOpen(true);
  };

  const handleOpenManager = (
    branch: Branch,
  ) => {
    setErrorMessage(null);
    setDetailBranch(null);
    setManagerBranch(branch);
  };

  const handleSaveBranch = async (
    input: CreateBranchInput,
  ) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (
        formMode === "EDIT" &&
        formBranch
      ) {
        const updatedBranch =
          await branchesApi.update(
            formBranch.id,
            input,
          );

        setBranches((current) =>
          current.map((branch) =>
            branch.id ===
            updatedBranch.id
              ? updatedBranch
              : branch,
          ),
        );
      } else {
        const createdBranch =
          await branchesApi.create(
            input,
          );

        setBranches((current) => [
          createdBranch,
          ...current,
        ]);
      }

      setFormOpen(false);
      setFormBranch(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể lưu chi nhánh.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignManager = async (
    manager:
      | BranchManagerOption
      | null,
  ) => {
    if (!managerBranch) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const updatedBranch =
        await branchesApi.assignManager(
          managerBranch.id,
          {
            managerEmployeeId:
              manager?.id ?? null,
            managerName:
              manager?.fullName ?? null,
            managerEmail:
              manager?.email ?? null,
          },
        );

      setBranches((current) =>
        current.map((branch) =>
          branch.id ===
          updatedBranch.id
            ? updatedBranch
            : branch,
        ),
      );

      setManagerBranch(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể gán quản lý.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction =
    async () => {
      if (!pendingAction) {
        return;
      }

      setIsSubmitting(true);
      setErrorMessage(null);

      try {
        if (
          pendingAction.type ===
          "RESET"
        ) {
          const resetData =
            await branchesApi.resetMockData();

          setBranches(resetData);
          setCurrentPage(1);
        }

        if (
          pendingAction.type ===
          "STATUS"
        ) {
          const updatedBranch =
            await branchesApi.updateStatus(
              pendingAction.branch.id,
              pendingAction.nextStatus,
            );

          setBranches((current) =>
            current.map((branch) =>
              branch.id ===
              updatedBranch.id
                ? updatedBranch
                : branch,
            ),
          );
        }

        if (
          pendingAction.type ===
          "DELETE"
        ) {
          await branchesApi.remove(
            pendingAction.branch.id,
          );

          setBranches((current) =>
            current.filter(
              (branch) =>
                branch.id !==
                pendingAction.branch.id,
            ),
          );
        }

        setPendingAction(null);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể thực hiện thao tác.",
        );

        setPendingAction(null);
      } finally {
        setIsSubmitting(false);
      }
    };

  const confirmConfig =
    useMemo(() => {
      if (!pendingAction) {
        return null;
      }

      if (
        pendingAction.type ===
        "RESET"
      ) {
        return {
          title:
            "Khôi phục dữ liệu mẫu?",
          message:
            "Toàn bộ thay đổi chi nhánh trong localStorage sẽ được thay bằng dữ liệu mẫu ban đầu.",
          confirmLabel: "Khôi phục",
          tone:
            "WARNING" as const,
        };
      }

      if (
        pendingAction.type ===
        "DELETE"
      ) {
        return {
          title:
            "Xóa chi nhánh?",
          message: `Chi nhánh ${pendingAction.branch.name} sẽ bị xóa khỏi dữ liệu mock.`,
          confirmLabel:
            "Xóa chi nhánh",
          tone:
            "DANGER" as const,
        };
      }

      const isActivating =
        pendingAction.nextStatus ===
        "ACTIVE";

      return {
        title: isActivating
          ? "Kích hoạt chi nhánh?"
          : "Ngừng hoạt động chi nhánh?",
        message: isActivating
          ? `Chi nhánh ${pendingAction.branch.name} sẽ được phép hoạt động trở lại.`
          : `Chi nhánh ${pendingAction.branch.name} sẽ ngừng tiếp nhận hoạt động mới.`,
        confirmLabel: isActivating
          ? "Kích hoạt"
          : "Ngừng hoạt động",
        tone:
          "WARNING" as const,
      };
    }, [pendingAction]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Quản trị tổ chức
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Quản lý chi nhánh
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Quản lý thông tin, nhân sự và
            trạng thái vận hành của từng
            chi nhánh.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setPendingAction({
                type: "RESET",
              })
            }
            className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCcw size={17} />
            Khôi phục dữ liệu
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Thêm chi nhánh
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Building2 size={21} />
            </span>

            <span className="text-2xl font-bold text-slate-900">
              {statistics.total}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Tổng chi nhánh
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Power size={21} />
            </span>

            <span className="text-2xl font-bold text-slate-900">
              {statistics.active}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Đang hoạt động
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <CircleOff size={21} />
            </span>

            <span className="text-2xl font-bold text-slate-900">
              {statistics.inactive}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Ngừng hoạt động
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <Users size={21} />
            </span>

            <span className="text-2xl font-bold text-slate-900">
              {statistics.employees}
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">
            Tổng nhân viên
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <label className="relative">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Tìm theo tên, mã, email, điện thoại..."
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value as
                  | BranchStatus
                  | "ALL",
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">
              Tất cả trạng thái
            </option>

            <option value="ACTIVE">
              Đang hoạt động
            </option>

            <option value="INACTIVE">
              Ngừng hoạt động
            </option>
          </select>

          <select
            value={provinceFilter}
            onChange={(event) =>
              setProvinceFilter(
                event.target.value,
              )
            }
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">
              Tất cả tỉnh thành
            </option>

            {provinces.map(
              (province) => (
                <option
                  key={province}
                  value={province}
                >
                  {province}
                </option>
              ),
            )}
          </select>
        </div>
      </section>

      {errorMessage && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <header className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              Danh sách chi nhánh
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Theo dõi các đơn vị trực
              thuộc doanh nghiệp.
            </p>
          </div>

          <span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
            {filteredBranches.length} chi
            nhánh
          </span>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1450px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">
                  STT
                </th>

                <th className="px-5 py-4">
                  Chi nhánh
                </th>

                <th className="px-5 py-4">
                  Liên hệ
                </th>

                <th className="px-5 py-4">
                  Địa chỉ
                </th>

                <th className="px-5 py-4">
                  Quản lý
                </th>

                <th className="px-5 py-4">
                  Nhân viên
                </th>

                <th className="px-5 py-4">
                  Đơn thuê
                </th>

                <th className="px-5 py-4">
                  Trạng thái
                </th>

                <th className="px-5 py-4">
                  Khai trương
                </th>

                <th className="px-5 py-4 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-5 py-16 text-center text-sm text-slate-500"
                  >
                    Đang tải dữ liệu chi
                    nhánh...
                  </td>
                </tr>
              ) : filteredBranches.length ===
                0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-5 py-16 text-center text-sm text-slate-500"
                  >
                    Không tìm thấy chi
                    nhánh phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedBranches.map(
                  (branch, index) => {
                    const canDeactivate =
                      branch.activeRentalCount ===
                      0;

                    const canDelete =
                      branch.status ===
                        "INACTIVE" &&
                      branch.employeeCount ===
                        0 &&
                      branch.activeRentalCount ===
                        0;

                    return (
                      <tr
                        key={branch.id}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-5 text-sm font-medium text-slate-500">
                          {(currentPage -
                            1) *
                            pageSize +
                            index +
                            1}
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-3">
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
                              <Building2
                                size={
                                  20
                                }
                              />
                            </span>

                            <div>
                              <p className="font-bold text-slate-900">
                                {
                                  branch.name
                                }
                              </p>

                              <p className="mt-1 text-xs font-semibold text-blue-600">
                                {
                                  branch.branchCode
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-sm font-semibold text-slate-700">
                            {branch.email}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {branch.phone}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex max-w-64 items-start gap-2 text-sm text-slate-600">
                            <MapPin
                              size={16}
                              className="mt-0.5 shrink-0 text-slate-400"
                            />

                            <span>
                              {
                                branch.address
                              }
                              ,{" "}
                              {
                                branch.province
                              }
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-sm font-semibold text-slate-700">
                            {branch.managerName ??
                              "Chưa gán"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {branch.managerEmail ??
                              "Chưa có email"}
                          </p>
                        </td>

                        <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                          {
                            branch.employeeCount
                          }
                        </td>

                        <td className="px-5 py-5 text-sm font-semibold text-slate-700">
                          {
                            branch.activeRentalCount
                          }
                        </td>

                        <td className="px-5 py-5">
                          <BranchStatusBadge
                            status={
                              branch.status
                            }
                          />
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-600">
                          {formatDate(
                            branch.openedAt,
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              title="Xem chi tiết"
                              onClick={() =>
                                setDetailBranch(
                                  branch,
                                )
                              }
                              className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Eye
                                size={
                                  16
                                }
                              />
                            </button>

                            <button
                              type="button"
                              title="Chỉnh sửa"
                              onClick={() =>
                                handleOpenEdit(
                                  branch,
                                )
                              }
                              className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Pencil
                                size={
                                  16
                                }
                              />
                            </button>

                            <button
                              type="button"
                              title="Gán quản lý"
                              onClick={() =>
                                handleOpenManager(
                                  branch,
                                )
                              }
                              className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                              <UserRoundCog
                                size={
                                  16
                                }
                              />
                            </button>

                            <button
                              type="button"
                              disabled={
                                branch.status ===
                                  "ACTIVE" &&
                                !canDeactivate
                              }
                              title={
                                branch.status ===
                                "ACTIVE"
                                  ? canDeactivate
                                    ? "Ngừng hoạt động"
                                    : "Chi nhánh đang có đơn thuê"
                                  : "Kích hoạt"
                              }
                              onClick={() =>
                                setPendingAction(
                                  {
                                    type: "STATUS",
                                    branch,
                                    nextStatus:
                                      branch.status ===
                                      "ACTIVE"
                                        ? "INACTIVE"
                                        : "ACTIVE",
                                  },
                                )
                              }
                              className="flex size-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-amber-50 hover:text-amber-700 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              {branch.status ===
                              "ACTIVE" ? (
                                <PowerOff
                                  size={
                                    16
                                  }
                                />
                              ) : (
                                <Power
                                  size={
                                    16
                                  }
                                />
                              )}
                            </button>

                            <button
                              type="button"
                              title={
                                canDelete
                                  ? "Xóa chi nhánh"
                                  : "Chỉ xóa chi nhánh ngừng hoạt động và không có dữ liệu nghiệp vụ"
                              }
                              disabled={
                                !canDelete
                              }
                              onClick={() =>
                                setPendingAction(
                                  {
                                    type: "DELETE",
                                    branch,
                                  },
                                )
                              }
                              className="flex size-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                              <Trash2
                                size={
                                  16
                                }
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  },
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {!isLoading && (
        <DataPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={
            filteredBranches.length
          }
          itemLabel="chi nhánh"
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

      <BranchDetailDrawer
        branch={detailBranch}
        isOpen={
          detailBranch !== null
        }
        onClose={() =>
          setDetailBranch(null)
        }
        onEdit={handleOpenEdit}
        onAssignManager={
          handleOpenManager
        }
      />

      <BranchFormModal
        isOpen={formOpen}
        mode={formMode}
        branch={formBranch}
        isSubmitting={isSubmitting}
        errorMessage={
          formOpen
            ? errorMessage
            : null
        }
        onClose={() => {
          if (!isSubmitting) {
            setFormOpen(false);
            setFormBranch(null);
            setErrorMessage(null);
          }
        }}
        onSubmit={(input) => {
          void handleSaveBranch(
            input,
          );
        }}
      />

      <BranchManagerDialog
        branch={managerBranch}
        isOpen={
          managerBranch !== null
        }
        managers={managerOptions}
        isSubmitting={isSubmitting}
        errorMessage={
          managerBranch
            ? errorMessage
            : null
        }
        onClose={() => {
          if (!isSubmitting) {
            setManagerBranch(null);
            setErrorMessage(null);
          }
        }}
        onConfirm={(manager) => {
          void handleAssignManager(
            manager,
          );
        }}
      />

      <BranchActionConfirmDialog
        isOpen={
          pendingAction !== null
        }
        title={
          confirmConfig?.title ?? ""
        }
        message={
          confirmConfig?.message ?? ""
        }
        confirmLabel={
          confirmConfig?.confirmLabel ??
          "Xác nhận"
        }
        tone={
          confirmConfig?.tone ??
          "WARNING"
        }
        isSubmitting={isSubmitting}
        onClose={() => {
          if (!isSubmitting) {
            setPendingAction(null);
          }
        }}
        onConfirm={() => {
          void handleConfirmAction();
        }}
      />
    </div>
  );
};
