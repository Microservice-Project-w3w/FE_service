import type {
  EmployeeStatus,
} from "@/modules/employees/types/employee.types";

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
}

const statusConfig: Record<
  EmployeeStatus,
  {
    label: string;
    dotClassName: string;
  }
> = {
  ACTIVE: {
    label: "Đang làm việc",
    dotClassName: "bg-emerald-500",
  },

  ON_LEAVE: {
    label: "Tạm nghỉ",
    dotClassName: "bg-amber-500",
  },

  RESIGNED: {
    label: "Đã nghỉ việc",
    dotClassName: "bg-rose-500",
  },
};

export const EmployeeStatusBadge = ({
  status,
}: EmployeeStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
      <span
        aria-hidden="true"
        className={[
          "size-2 rounded-full",
          config.dotClassName,
        ].join(" ")}
      />

      {config.label}
    </span>
  );
};
