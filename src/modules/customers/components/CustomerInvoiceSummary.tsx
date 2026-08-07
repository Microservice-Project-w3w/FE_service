import {
    AlertCircle,
    CreditCard,
    ReceiptText,
    WalletCards,
} from "lucide-react";

interface CustomerInvoiceSummaryProps {
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    overdueCount: number;
}

const formatCurrency = (
    value: number,
): string =>
    new Intl.NumberFormat("vi-VN").format(
        value,
    );

export const CustomerInvoiceSummary = ({
                                           totalAmount,
                                           paidAmount,
                                           remainingAmount,
                                           overdueCount,
                                       }: CustomerInvoiceSummaryProps) => {
    const summaryItems = [
        {
            label: "Tổng phải trả",
            value: `${formatCurrency(
                totalAmount,
            )} đ`,
            icon: ReceiptText,
            iconClassName:
                "bg-blue-50 text-blue-600",
            valueClassName:
                "text-slate-950",
        },
        {
            label: "Đã thanh toán",
            value: `${formatCurrency(
                paidAmount,
            )} đ`,
            icon: CreditCard,
            iconClassName:
                "bg-emerald-50 text-emerald-600",
            valueClassName:
                "text-emerald-700",
        },
        {
            label: "Còn phải trả",
            value: `${formatCurrency(
                remainingAmount,
            )} đ`,
            icon: WalletCards,
            iconClassName:
                "bg-amber-50 text-amber-600",
            valueClassName:
                "text-amber-700",
        },
        {
            label: "Hóa đơn quá hạn",
            value: String(overdueCount),
            icon: AlertCircle,
            iconClassName:
                "bg-red-50 text-red-600",
            valueClassName:
                "text-red-600",
        },
    ];

    return (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryItems.map((item) => {
                const Icon = item.icon;

                return (
                    <article
                        key={item.label}
                        className="flex min-h-[104px] items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm"
                    >
                        <span
                            className={[
                                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                                item.iconClassName,
                            ].join(" ")}
                        >
                            <Icon
                                size={20}
                                aria-hidden="true"
                            />
                        </span>

                        <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-500">
                                {item.label}
                            </p>

                            <p
                                className={[
                                    "mt-1 truncate text-lg font-bold",
                                    item.valueClassName,
                                ].join(" ")}
                            >
                                {item.value}
                            </p>
                        </div>
                    </article>
                );
            })}
        </section>
    );
};