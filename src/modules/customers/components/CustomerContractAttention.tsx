import {
    AlertTriangle,
    ArrowRight,
    Clock3,
    CreditCard,
    Eye,
} from "lucide-react";

import type {
    CustomerContractItem,
} from "../types/customerContract.types";

interface CustomerContractAttentionProps {
    contracts: CustomerContractItem[];
    onViewDetail: (
        contract: CustomerContractItem,
    ) => void;
}

const formatCurrency = (
    value: number,
): string =>
    new Intl.NumberFormat("vi-VN").format(
        value,
    );

const getAttentionMessage = (
    contract: CustomerContractItem,
): {
    label: string;
    icon: typeof Clock3;
} => {
    if (
        contract.status ===
        "EXPIRING_SOON"
    ) {
        return {
            label: "Hợp đồng sắp hết hạn",
            icon: Clock3,
        };
    }

    return {
        label: `Còn ${formatCurrency(
            contract.remainingAmount,
        )} đ cần thanh toán`,
        icon: CreditCard,
    };
};

export const CustomerContractAttention = ({
                                              contracts,
                                              onViewDetail,
                                          }: CustomerContractAttentionProps) => {
    const attentionContracts =
        contracts
            .filter(
                (contract) =>
                    contract.status ===
                    "EXPIRING_SOON" ||
                    (contract.status ===
                        "ACTIVE" &&
                        contract.remainingAmount >
                        0),
            )
            .slice(0, 2);

    if (
        attentionContracts.length === 0
    ) {
        return null;
    }

    return (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 shadow-sm">
            <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <AlertTriangle
                            size={18}
                            aria-hidden="true"
                        />
                    </span>

                    <div>
                        <h2 className="text-sm font-bold text-amber-950">
                            {
                                attentionContracts.length
                            }{" "}
                            hợp đồng cần chú ý
                        </h2>

                        <p className="text-xs text-amber-800">
                            Kiểm tra thời hạn và tiến độ
                            thanh toán.
                        </p>
                    </div>
                </div>

                <a
                    href="#contract-list"
                    className="inline-flex items-center gap-1 self-start text-xs font-semibold text-blue-600 transition hover:text-blue-700 sm:self-auto"
                >
                    Xem danh sách

                    <ArrowRight
                        size={14}
                        aria-hidden="true"
                    />
                </a>
            </header>

            <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {attentionContracts.map(
                    (contract) => {
                        const attention =
                            getAttentionMessage(
                                contract,
                            );

                        const AttentionIcon =
                            attention.icon;

                        return (
                            <article
                                key={contract.id}
                                className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-white p-3 sm:flex-row sm:items-center"
                            >
                                <div className="h-20 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:w-24">
                                    <img
                                        src={
                                            contract.equipmentImageUrl
                                        }
                                        alt={
                                            contract.equipmentName
                                        }
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-blue-600">
                                        {
                                            contract.contractCode
                                        }
                                    </p>

                                    <h3 className="mt-1 truncate text-sm font-bold text-slate-950">
                                        {
                                            contract.equipmentName
                                        }
                                    </h3>

                                    <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                                        <AttentionIcon
                                            size={14}
                                            aria-hidden="true"
                                        />

                                        {
                                            attention.label
                                        }
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        onViewDetail(
                                            contract,
                                        );
                                    }}
                                    className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 text-xs font-semibold text-blue-700 transition hover:bg-blue-50"
                                >
                                    <Eye
                                        size={14}
                                        aria-hidden="true"
                                    />

                                    Xem hợp đồng
                                </button>
                            </article>
                        );
                    },
                )}
            </div>
        </section>
    );
};