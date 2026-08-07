import type {
  LucideIcon,
} from "lucide-react";

interface ManagerContractSummaryCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

export const ManagerContractSummaryCard = ({
  title,
  value,
  description,
  icon: Icon,
}: ManagerContractSummaryCardProps) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={21} />
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>
    </article>
  );
};
