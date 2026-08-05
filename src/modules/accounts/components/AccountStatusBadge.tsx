import type {
  AccountStatus,
} from "@/modules/accounts/types/account.types";

interface AccountStatusBadgeProps {
  status: AccountStatus;
}

const statusConfig: Record<
  AccountStatus,
  {
    label: string;
    dotClassName: string;
  }
> = {
  ACTIVE: {
    label: "Đang hoạt động",
    dotClassName: "bg-emerald-500",
  },

  INACTIVE: {
    label: "Ngừng hoạt động",
    dotClassName: "bg-slate-400",
  },

  LOCKED: {
    label: "Đã khóa",
    dotClassName: "bg-rose-500",
  },

  PENDING: {
    label: "Chờ kích hoạt",
    dotClassName: "bg-amber-500",
  },
};

export const AccountStatusBadge = ({
  status,
}: AccountStatusBadgeProps) => {
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
