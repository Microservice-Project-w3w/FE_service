import {
    CalendarDays,
    Eye,
    Package,
    Paperclip,
} from "lucide-react";

import type {
    CustomerIncidentItem,
} from "../types/customerIncident.types";

import {
    CustomerIncidentPriorityBadge,
} from "./CustomerIncidentPriorityBadge";

import {
    CustomerIncidentStatusBadge,
} from "./CustomerIncidentStatusBadge";

interface CustomerIncidentListProps {
    incidents: CustomerIncidentItem[];

    onViewDetail: (
        incident: CustomerIncidentItem,
    ) => void;
}

const formatDateTime = (
    value: string,
): string => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(
        "vi-VN",
        {
            dateStyle: "short",
            timeStyle: "short",
        },
    ).format(date);
};

export const CustomerIncidentList = ({
                                         incidents,
                                         onViewDetail,
                                     }: CustomerIncidentListProps) => {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100">
                {incidents.map(
                    (incident) => (
                        <article
                            key={incident.id}
                            className="grid gap-4 px-4 py-4 transition hover:bg-slate-50/70 xl:grid-cols-[minmax(0,1fr)_105px_135px_120px]"
                        >
                            <div className="flex min-w-0 gap-3">
                                <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                                    <Package
                                        size={20}
                                        aria-hidden="true"
                                        className="text-blue-500"
                                    />

                                    {incident.equipmentImageUrl && (
                                        <img
                                            src={
                                                incident.equipmentImageUrl
                                            }
                                            alt={
                                                incident.equipmentName
                                            }
                                            className="absolute inset-0 h-full w-full object-cover"
                                            onError={(
                                                event,
                                            ) => {
                                                event.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />
                                    )}
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <p className="text-sm font-bold text-blue-600">
                                            {
                                                incident.incidentCode
                                            }
                                        </p>

                                        <h3 className="text-sm font-bold text-slate-950">
                                            {
                                                incident.equipmentName
                                            }
                                        </h3>
                                    </div>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Hợp đồng:{" "}
                                        <span className="font-semibold text-blue-600">
                                            {
                                                incident.contractCode
                                            }
                                        </span>
                                    </p>

                                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">
                                        {
                                            incident.description
                                        }
                                    </p>

                                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                                        <span className="inline-flex items-center gap-1.5">
                                            <CalendarDays
                                                size={14}
                                                aria-hidden="true"
                                            />

                                            {formatDateTime(
                                                incident.reportedAt,
                                            )}
                                        </span>

                                        <span className="inline-flex items-center gap-1.5">
                                            <Paperclip
                                                size={14}
                                                aria-hidden="true"
                                            />

                                            {
                                                incident.attachmentCount
                                            }{" "}
                                            tệp
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start xl:justify-center">
                                <CustomerIncidentPriorityBadge
                                    priority={
                                        incident.priority
                                    }
                                />
                            </div>

                            <div className="flex items-start xl:justify-center">
                                <CustomerIncidentStatusBadge
                                    status={
                                        incident.status
                                    }
                                />
                            </div>

                            <div className="flex items-start xl:justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onViewDetail(
                                            incident,
                                        );
                                    }}
                                    className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                >
                                    <Eye
                                        size={14}
                                        aria-hidden="true"
                                    />

                                    Chi tiết
                                </button>
                            </div>
                        </article>
                    ),
                )}
            </div>
        </section>
    );
};