import type {
  LucideIcon,
} from "lucide-react";

interface ManagerRentalSummaryCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export const ManagerRentalSummaryCard = ({
  title,
  value,
  description,
  icon: Icon,
}: ManagerRentalSummaryCardProps) => (
  <article className="min-h-[190px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-500">
          {title}
        </p>

        <p className="mt-3 whitespace-nowrap text-[clamp(1.125rem,1.35vw,1.5rem)] font-bold tracking-tight text-slate-900">
          {value}
        </p>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          {description}
        </p>
      </div>

      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={21} />
      </div>
    </div>
  </article>
);
