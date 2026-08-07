import {
    CheckCircle2,
    Clock3,
    FileImage,
    FileText,
    Headphones,
    Send,
} from "lucide-react";

interface CustomerIncidentSupportPanelProps {
    processingCount: number;
    waitingCount: number;
    resolvedCount: number;
}

export const CustomerIncidentSupportPanel = ({
                                                 processingCount,
                                                 waitingCount,
                                                 resolvedCount,
                                             }: CustomerIncidentSupportPanelProps) => {
    const steps = [
        {
            number: 1,
            label: "Chọn hợp đồng",
            icon: FileText,
        },
        {
            number: 2,
            label: "Mô tả sự cố",
            icon: FileText,
        },
        {
            number: 3,
            label: "Tải ảnh / video",
            icon: FileImage,
        },
        {
            number: 4,
            label: "Gửi báo cáo",
            icon: Send,
        },
    ];

    return (
        <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                    <Headphones
                        size={18}
                        aria-hidden="true"
                        className="text-blue-600"
                    />

                    <h2 className="text-sm font-bold text-slate-950">
                        Hỗ trợ nhanh
                    </h2>
                </div>

                <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3.5">
                    <p className="text-xs font-semibold text-red-700">
                        Sự cố cần hỗ trợ gấp?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-600">
                        Hãy mô tả rõ tình trạng thiết bị và chọn mức độ cao khi
                        tạo báo cáo.
                    </p>
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-sm font-bold text-slate-950">
                    Quy trình báo cáo
                </h2>

                <div className="mt-4 space-y-3">
                    {steps.map((step) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.number}
                                className="flex items-center gap-3"
                            >
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                    {step.number}
                                </span>

                                <div className="flex min-w-0 items-center gap-2">
                                    <Icon
                                        size={14}
                                        aria-hidden="true"
                                        className="shrink-0 text-slate-400"
                                    />

                                    <span className="text-xs font-medium text-slate-700">
                                        {step.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="text-sm font-bold text-slate-950">
                    Tổng quan sự cố
                </h2>

                <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between rounded-xl bg-blue-50 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                            <Clock3
                                size={15}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <span className="text-xs font-medium text-blue-800">
                                Đang xử lý
                            </span>
                        </div>

                        <span className="text-sm font-bold text-blue-700">
                            {processingCount}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-orange-50 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                            <Clock3
                                size={15}
                                aria-hidden="true"
                                className="text-orange-600"
                            />

                            <span className="text-xs font-medium text-orange-800">
                                Chờ phản hồi
                            </span>
                        </div>

                        <span className="text-sm font-bold text-orange-700">
                            {waitingCount}
                        </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                            <CheckCircle2
                                size={15}
                                aria-hidden="true"
                                className="text-emerald-600"
                            />

                            <span className="text-xs font-medium text-emerald-800">
                                Đã giải quyết
                            </span>
                        </div>

                        <span className="text-sm font-bold text-emerald-700">
                            {resolvedCount}
                        </span>
                    </div>
                </div>
            </section>
        </aside>
    );
};