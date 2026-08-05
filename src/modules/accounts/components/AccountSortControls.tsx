import {
  ArrowDown,
  ArrowUp,
  ListFilter,
} from "lucide-react";

export type AccountSortField =
  | "FULL_NAME"
  | "ROLE"
  | "BRANCH"
  | "STATUS"
  | "CREATED_AT"
  | "LAST_LOGIN_AT";

export type SortDirection =
  | "ASC"
  | "DESC";

interface AccountSortControlsProps {
  field: AccountSortField;
  direction: SortDirection;
  onFieldChange: (
    field: AccountSortField,
  ) => void;
  onDirectionChange: (
    direction: SortDirection,
  ) => void;
}

const sortOptions: Array<{
  value: AccountSortField;
  label: string;
}> = [
  {
    value: "FULL_NAME",
    label: "Họ tên",
  },
  {
    value: "ROLE",
    label: "Vai trò",
  },
  {
    value: "BRANCH",
    label: "Chi nhánh",
  },
  {
    value: "STATUS",
    label: "Trạng thái",
  },
  {
    value: "CREATED_AT",
    label: "Ngày tạo",
  },
  {
    value: "LAST_LOGIN_AT",
    label: "Đăng nhập gần nhất",
  },
];

const isAccountSortField = (
  value: string,
): value is AccountSortField => {
  return sortOptions.some(
    (option) =>
      option.value === value,
  );
};

export const AccountSortControls = ({
  field,
  direction,
  onFieldChange,
  onDirectionChange,
}: AccountSortControlsProps) => {
  const isAscending =
    direction === "ASC";

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <ListFilter size={18} />
        </span>

        <div>
          <p className="text-sm font-bold text-slate-800">
            Sắp xếp danh sách
          </p>

          <p className="text-xs text-slate-500">
            Thay đổi thứ tự hiển thị tài khoản
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <select
          value={field}
          aria-label="Tiêu chí sắp xếp"
          onChange={(event) => {
            const selectedValue =
              event.target.value;

            if (
              isAccountSortField(
                selectedValue,
              )
            ) {
              onFieldChange(
                selectedValue,
              );
            }
          }}
          className="h-10 min-w-48 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          {sortOptions.map(
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

        <button
          type="button"
          onClick={() => {
            onDirectionChange(
              isAscending
                ? "DESC"
                : "ASC",
            );
          }}
          className="flex h-10 min-w-32 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
        >
          {isAscending ? (
            <ArrowUp size={17} />
          ) : (
            <ArrowDown size={17} />
          )}

          {isAscending
            ? "Tăng dần"
            : "Giảm dần"}
        </button>
      </div>
    </section>
  );
};
