import {
    CheckCircle2,
    Clock3,
    Truck,
} from "lucide-react";

interface CustomerReturnRequestSummaryProps {
    processingCount: number;
    dueSoonCount: number;
    completedCount: number;
}

export const CustomerReturnRequestSummary = ({
                                                 processingCount,
                                                 dueSoonCount,
                                                 completedCount,
                                             }: CustomerReturnRequestSummaryProps) => {
    const items = [
        {
            label: "Đang xử lý",
            value: processingCount,
            icon: Truck,
            className:
                "bg-blue-50 text-blue-600",
        },
        {
            label: "Sắp đến ngày trả",
            value: dueSoonCount,
            icon: Clock3,
            className:
                "bg-amber-50 text-amber-600",
        },
        {
            label: "Hoàn thành",
            value: completedCount,
            icon: CheckCircle2,
            className:
                "bg-emerald-50 text-emerald-600",
        },
    ];

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid sm:grid-cols-3">
                {items.map(
                    (
                        item,
                        index,
                    ) => {
                        const Icon =
                            item.icon;

                        return (
                            <article
                                key={
                                    item.label
                                }
                                className={[
                                    "flex items-center gap-3 px-5 py-4",
                                    index >
                                    0
                                        ? "border-t border-slate-100 sm:border-l sm:border-t-0"
                                        : "",
                                ].join(
                                    " ",
                                )}
                            >
                                <span
                                    className={[
                                        "flex size-10 shrink-0 items-center justify-center rounded-xl",
                                        item.className,
                                    ].join(
                                        " ",
                                    )}
                                >
                                    <Icon
                                        size={
                                            19
                                        }
                                        aria-hidden="true"
                                    />
                                </span>

                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        {
                                            item.label
                                        }
                                    </p>

                                    <p className="mt-0.5 text-xl font-bold text-slate-950">
                                        {
                                            item.value
                                        }
                                    </p>
                                </div>
                            </article>
                        );
                    },
                )}
            </div>
        </section>
    );
};