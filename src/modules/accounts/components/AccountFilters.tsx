import {
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";

import {
  USER_ROLE_LABELS,
} from "@/core/auth/roleLabels";

import {
  USER_ROLES,
  isUserRole,
  type UserRole,
} from "@/modules/auth/types/auth.types";

import type {
  AccountFilters as AccountFiltersValue,
  AccountStatus,
} from "@/modules/accounts/types/account.types";

interface AccountFiltersProps {
  value: AccountFiltersValue;
  branches: string[];
  onChange: (
    value: AccountFiltersValue,
  ) => void;
}

const accountStatuses: Array<{
  value: AccountStatus;
  label: string;
}> = [
  {
    value: "ACTIVE",
    label: "Đang hoạt động",
  },
  {
    value: "INACTIVE",
    label: "Ngừng hoạt động",
  },
  {
    value: "LOCKED",
    label: "Đã khóa",
  },
  {
    value: "PENDING",
    label: "Chờ kích hoạt",
  },
];

const isAccountStatus = (
  value: string,
): value is AccountStatus => {
  return accountStatuses.some(
    (item) => item.value === value,
  );
};

const selectClassName = [
  "h-12 rounded-2xl border border-slate-200",
  "bg-white px-4 text-sm font-medium text-slate-700",
  "outline-none transition",
  "hover:border-blue-300",
  "focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
].join(" ");

export const AccountFilters = ({
  value,
  branches,
  onChange,
}: AccountFiltersProps) => {
  const handleReset = (): void => {
    onChange({
      search: "",
      role: "ALL",
      status: "ALL",
      branchName: "ALL",
    });
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
        <span className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Filter size={19} />
        </span>

        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Bộ lọc tài khoản
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Tìm kiếm và lọc dữ liệu theo nhu cầu
          </p>
        </div>
      </header>

      <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-[minmax(280px,1fr)_200px_200px_230px_auto]">
        <label className="relative block">
          <span className="sr-only">
            Tìm kiếm tài khoản
          </span>

          <Search
            size={19}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
          />

          <input
            type="search"
            value={value.search}
            onChange={(event) => {
              onChange({
                ...value,
                search: event.target.value,
              });
            }}
            placeholder="Tìm tên, email hoặc số điện thoại..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </label>

        <select
          value={value.role}
          aria-label="Lọc theo vai trò"
          onChange={(event) => {
            const selectedValue =
              event.target.value;

            onChange({
              ...value,
              role:
                selectedValue === "ALL"
                  ? "ALL"
                  : isUserRole(selectedValue)
                    ? selectedValue
                    : "ALL",
            });
          }}
          className={selectClassName}
        >
          <option value="ALL">
            Tất cả vai trò
          </option>

          {USER_ROLES.map(
            (role: UserRole) => (
              <option
                key={role}
                value={role}
              >
                {USER_ROLE_LABELS[role]}
              </option>
            ),
          )}
        </select>

        <select
          value={value.status}
          aria-label="Lọc theo trạng thái"
          onChange={(event) => {
            const selectedValue =
              event.target.value;

            onChange({
              ...value,
              status:
                selectedValue === "ALL"
                  ? "ALL"
                  : isAccountStatus(
                        selectedValue,
                      )
                    ? selectedValue
                    : "ALL",
            });
          }}
          className={selectClassName}
        >
          <option value="ALL">
            Tất cả trạng thái
          </option>

          {accountStatuses.map(
            (status) => (
              <option
                key={status.value}
                value={status.value}
              >
                {status.label}
              </option>
            ),
          )}
        </select>

        <select
          value={value.branchName}
          aria-label="Lọc theo chi nhánh"
          onChange={(event) => {
            onChange({
              ...value,
              branchName:
                event.target.value,
            });
          }}
          className={selectClassName}
        >
          <option value="ALL">
            Tất cả chi nhánh
          </option>

          {branches.map((branch) => (
            <option
              key={branch}
              value={branch}
            >
              {branch}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleReset}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
        >
          <RotateCcw size={17} />
          Đặt lại
        </button>
      </div>
    </section>
  );
};
