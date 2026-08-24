import type {
    ElementType,
    ReactNode,
} from "react";

interface ProfileFormFieldProps {
    icon: ElementType;
    label: string;
    children: ReactNode;
}

export const ProfileFormField = ({
                                     icon: Icon,
                                     label,
                                     children,
                                 }: ProfileFormFieldProps) => {
    return (
        <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Icon
                    size={13}
                    className="text-slate-400"
                />

                {label}
            </label>

            {children}
        </div>
    );
};