import type {
    ElementType,
    ReactNode,
} from "react";

interface ProfileCardProps {
    title: string;
    children: ReactNode;
}

export const ProfileCard = ({
                                title,
                                children,
                            }: ProfileCardProps) => {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-900">
                {title}
            </h2>

            <div className="space-y-4">
                {children}
            </div>
        </article>
    );
};

interface ProfileInfoProps {
    icon: ElementType;
    label: string;
    value: string;
}

export const ProfileInfo = ({
                                icon: Icon,
                                label,
                                value,
                            }: ProfileInfoProps) => {
    return (
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        <Icon size={16} />
      </span>

            <div className="min-w-0">
                <p className="text-[10px] text-slate-400">
                    {label}
                </p>

                <p className="mt-0.5 break-words text-sm font-semibold text-slate-800">
                    {value}
                </p>
            </div>
        </div>
    );
};