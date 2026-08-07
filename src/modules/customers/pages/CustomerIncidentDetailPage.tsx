import {
    ArrowLeft,
    CalendarDays,
    FileText,
    MapPin,
    Package,
    Paperclip,
    StickyNote,
} from "lucide-react";
import {
    useEffect,
} from "react";
import {
    Navigate,
    useNavigate,
    useParams,
} from "react-router";

import {
    CustomerIncidentPriorityBadge,
} from "../components/CustomerIncidentPriorityBadge";
import {
    CustomerIncidentStatusBadge,
} from "../components/CustomerIncidentStatusBadge";
import {
    CUSTOMER_INCIDENT_MOCKS,
} from "../mocks/customerIncident.mock";

const formatDateTime = (
    value: string,
): string => {
    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
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

export const CustomerIncidentDetailPage = () => {
    const navigate =
        useNavigate();

    const {
        incidentId,
    } = useParams<{
        incidentId: string;
    }>();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    }, [incidentId]);

    const incident =
        CUSTOMER_INCIDENT_MOCKS.find(
            (item) =>
                item.id ===
                incidentId,
        );

    if (!incident) {
        return (
            <Navigate
                to="/customer/incidents"
                replace
            />
        );
    }

    return (
        <main className="space-y-5">
            <button
                type="button"
                onClick={() => {
                    navigate(
                        "/customer/incidents",
                    );
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"
            >
                <ArrowLeft
                    size={17}
                    aria-hidden="true"
                />

                Quay lại danh sách
            </button>

            {/* Header */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm font-bold text-blue-600">
                        {
                            incident.incidentCode
                        }
                    </p>

                    <h1 className="mt-1 text-3xl font-bold text-slate-950">
                        Chi tiết sự cố
                    </h1>

                    <p className="mt-1.5 text-sm text-slate-500">
                        Theo dõi thông tin và
                        tiến độ xử lý báo cáo.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <CustomerIncidentPriorityBadge
                        priority={
                            incident.priority
                        }
                    />

                    <CustomerIncidentStatusBadge
                        status={
                            incident.status
                        }
                    />
                </div>
            </header>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div className="space-y-5">
                    {/* Thiết bị */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Package
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Thiết bị liên quan
                            </h2>
                        </div>

                        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h3 className="text-lg font-bold text-slate-950">
                                {
                                    incident.equipmentName
                                }
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                {
                                    incident.equipmentCode
                                }
                            </p>

                            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                                <MapPin
                                    size={14}
                                    aria-hidden="true"
                                />

                                {
                                    incident.branch
                                }
                            </p>
                        </div>
                    </article>

                    {/* Nội dung sự cố */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <FileText
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Nội dung báo cáo
                            </h2>
                        </div>

                        <div className="mt-5">
                            <h3 className="text-lg font-bold text-slate-950">
                                {
                                    incident.title
                                }
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {
                                    incident.description
                                }
                            </p>
                        </div>
                    </article>

                    {/* Thông tin thời gian */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Thời gian xử lý
                            </h2>
                        </div>

                        <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="text-xs text-slate-500">
                                    Ngày báo cáo
                                </dt>

                                <dd className="mt-1.5 text-sm font-semibold text-slate-900">
                                    {formatDateTime(
                                        incident.reportedAt,
                                    )}
                                </dd>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <dt className="text-xs text-slate-500">
                                    Hoàn thành xử lý
                                </dt>

                                <dd className="mt-1.5 text-sm font-semibold text-slate-900">
                                    {incident.resolvedAt
                                        ? formatDateTime(
                                            incident.resolvedAt,
                                        )
                                        : "Chưa hoàn thành"}
                                </dd>
                            </div>
                        </dl>
                    </article>

                    {/* Tệp */}
                    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center gap-2">
                            <Paperclip
                                size={19}
                                aria-hidden="true"
                                className="text-blue-600"
                            />

                            <h2 className="text-base font-bold text-slate-950">
                                Tệp đính kèm
                            </h2>
                        </div>

                        <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                            <Paperclip
                                size={15}
                                aria-hidden="true"
                            />

                            {
                                incident.attachmentCount
                            }{" "}
                            tệp
                        </div>
                    </article>

                    {incident.note && (
                        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-2">
                                <StickyNote
                                    size={19}
                                    aria-hidden="true"
                                    className="text-blue-600"
                                />

                                <h2 className="text-base font-bold text-slate-950">
                                    Ghi chú xử lý
                                </h2>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-slate-600">
                                {
                                    incident.note
                                }
                            </p>
                        </article>
                    )}
                </div>

                {/* Sidebar detail */}
                <aside className="space-y-4">
                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-base font-bold text-slate-950">
                            Thông tin báo cáo
                        </h2>

                        <dl className="mt-5 space-y-4">
                            <div>
                                <dt className="text-xs text-slate-500">
                                    Mã sự cố
                                </dt>

                                <dd className="mt-1 text-sm font-bold text-blue-600">
                                    {
                                        incident.incidentCode
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-slate-500">
                                    Hợp đồng
                                </dt>

                                <dd className="mt-1 text-sm font-bold text-blue-600">
                                    {
                                        incident.contractCode
                                    }
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-slate-500">
                                    Mức độ
                                </dt>

                                <dd className="mt-2">
                                    <CustomerIncidentPriorityBadge
                                        priority={
                                            incident.priority
                                        }
                                    />
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-slate-500">
                                    Trạng thái
                                </dt>

                                <dd className="mt-2">
                                    <CustomerIncidentStatusBadge
                                        status={
                                            incident.status
                                        }
                                    />
                                </dd>
                            </div>

                            <div>
                                <dt className="text-xs text-slate-500">
                                    Tệp đính kèm
                                </dt>

                                <dd className="mt-1 text-sm font-semibold text-slate-900">
                                    {
                                        incident.attachmentCount
                                    }{" "}
                                    tệp
                                </dd>
                            </div>
                        </dl>
                    </section>

                    {incident.status ===
                        "PROCESSING" && (
                            <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                                <p className="text-sm font-bold text-blue-800">
                                    Đang được xử lý
                                </p>

                                <p className="mt-1.5 text-xs leading-5 text-blue-700">
                                    Bộ phận kỹ thuật
                                    đang kiểm tra báo
                                    cáo của bạn.
                                </p>
                            </section>
                        )}

                    {incident.status ===
                        "WAITING_RESPONSE" && (
                            <section className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
                                <p className="text-sm font-bold text-orange-800">
                                    Cần thêm thông tin
                                </p>

                                <p className="mt-1.5 text-xs leading-5 text-orange-700">
                                    Hãy kiểm tra yêu
                                    cầu phản hồi từ
                                    bộ phận hỗ trợ.
                                </p>
                            </section>
                        )}

                    {incident.status ===
                        "RESOLVED" && (
                            <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                                <p className="text-sm font-bold text-emerald-800">
                                    Sự cố đã được giải quyết
                                </p>

                                <p className="mt-1.5 text-xs leading-5 text-emerald-700">
                                    Thiết bị đã được
                                    kiểm tra và hoàn
                                    thành xử lý.
                                </p>
                            </section>
                        )}
                </aside>
            </section>
        </main>
    );
};