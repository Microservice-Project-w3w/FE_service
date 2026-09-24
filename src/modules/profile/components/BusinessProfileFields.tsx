import {
    Building2,
} from "lucide-react";

import {
    ProfileFormField,
} from "./ProfileFormField";

interface BusinessProfileFieldsProps {
    companyName: string;
    taxCode: string;

    onCompanyNameChange: (
        value: string,
    ) => void;

    onTaxCodeChange: (
        value: string,
    ) => void;
}

export const BusinessProfileFields = ({
                                          companyName,
                                          taxCode,
                                          onCompanyNameChange,
                                          onTaxCodeChange,
                                      }: BusinessProfileFieldsProps) => {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <ProfileFormField
                icon={Building2}
                label="Tên doanh nghiệp"
            >
                <input
                    type="text"
                    value={companyName}
                    onChange={(event) =>
                        onCompanyNameChange(
                            event.target.value,
                        )
                    }
                    placeholder="Nhập tên doanh nghiệp"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </ProfileFormField>

            <ProfileFormField
                icon={Building2}
                label="Mã số thuế"
            >
                <input
                    type="text"
                    value={taxCode}
                    onChange={(event) =>
                        onTaxCodeChange(
                            event.target.value,
                        )
                    }
                    placeholder="Nhập mã số thuế"
                    className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
            </ProfileFormField>
        </div>
    );
};