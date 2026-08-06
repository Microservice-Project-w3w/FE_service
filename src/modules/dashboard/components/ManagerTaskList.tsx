import {
  ArrowRight,
  ClipboardCheck,
  CircleDollarSign,
  PackageCheck,
  Truck,
  Wrench,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  useNavigate,
} from "react-router";

import type {
  ManagerDashboardTask,
  ManagerTaskPriority,
  ManagerTaskType,
} from "@/modules/dashboard/types/manager-dashboard.types";

interface ManagerTaskListProps {
  tasks: ManagerDashboardTask[];
}

const taskIcons: Record<
  ManagerTaskType,
  LucideIcon
> = {
  QUOTATION_APPROVAL:
    ClipboardCheck,
  CONTRACT_APPROVAL:
    ClipboardCheck,
  DELIVERY: Truck,
  RETURN: PackageCheck,
  PAYMENT: CircleDollarSign,
  MAINTENANCE: Wrench,
};

const priorityLabels: Record<
  ManagerTaskPriority,
  string
> = {
  HIGH: "Ưu tiên cao",
  MEDIUM: "Ưu tiên vừa",
  LOW: "Ưu tiên thấp",
};

const priorityStyles: Record<
  ManagerTaskPriority,
  string
> = {
  HIGH: "border-blue-200 bg-blue-50 text-blue-700",
  MEDIUM: "border-blue-200 bg-blue-50 text-blue-700",
  LOW: "border-blue-100 bg-blue-50/70 text-blue-700",
};

const dateTimeFormatter =
  new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

export const ManagerTaskList = ({
  tasks,
}: ManagerTaskListProps) => {
  const navigate = useNavigate();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Công việc cần xử lý
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Các nghiệp vụ cần quản lý kiểm tra và phê duyệt.
          </p>
        </div>

        <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {tasks.length} công việc
        </span>
      </header>

      <div className="divide-y divide-slate-100">
        {tasks.map((task) => {
          const Icon =
            taskIcons[task.type];

          return (
            <button
              key={task.id}
              type="button"
              onClick={() =>
                navigate(task.route)
              }
              className="flex w-full items-start gap-4 px-6 py-4 text-left transition hover:bg-blue-50/40"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-800">
                    {task.title}
                  </p>

                  <span
                    className={[
                      "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                      priorityStyles[
                        task.priority
                      ],
                    ].join(" ")}
                  >
                    {
                      priorityLabels[
                        task.priority
                      ]
                    }
                  </span>
                </div>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {task.description}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-400">
                  {task.branchName && (
                    <span>
                      {task.branchName}
                    </span>
                  )}

                  <span>
                    Hạn xử lý:{" "}
                    {dateTimeFormatter.format(
                      new Date(
                        task.dueAt,
                      ),
                    )}
                  </span>
                </div>
              </div>

              <ArrowRight
                size={18}
                className="mt-2 shrink-0 text-blue-400"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};
