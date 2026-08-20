import {
    Activity,

    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Eye,
    FileSignature,
    
    MoreVertical,
    Plus,
    RefreshCw,
    Search,
    TrendingUp,
    XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

type ContractStatus = "ACTIVE" | "EXPIRING" | "EXPIRED" | "CANCELLED";

interface ContractItem {
    id: string;
    code: string;
    customerName: string;
    customerTaxCode: string;
    equipmentName: string;
    equipmentModel: string;
    startDate: string;
    endDate: string;
    duration: string;
    value: number;
    status: ContractStatus;
}

const STATUS_CONFIG: Record<ContractStatus, { label: string; className: string }> = {
    ACTIVE: { label: "Hiệu lực", className: "bg-emerald-50 text-emerald-700" },
    EXPIRING: { label: "Sắp hết hạn", className: "bg-amber-50 text-amber-700" },
    EXPIRED: { label: "Hết hạn", className: "bg-rose-50 text-rose-700" },
    CANCELLED: { label: "Đã hủy", className: "bg-slate-100 text-slate-600" },
};

const CONTRACTS: ContractItem[] = Array.from({ length: 24 }, (_, index) => {
    const customers = ["Công ty TNHH ABC", "Công ty XYZ", "Công ty DEF", "Công ty GHI", "Công ty JKL"];
    const equipment = [
        ["Máy phát điện 50kVA", "Cummins C50D5"],
        ["Xe nâng người 12m", "Genie GS-3246"],
        ["Máy đào 0.9m³", "Kobelco SK75"],
        ["Máy nén khí 10HP", "Airman PDS100S"],
        ["Máy phát điện 100kVA", "Cummins C100D5"],
    ];
    const pattern: ContractStatus[] = ["ACTIVE", "EXPIRING", "EXPIRED", "CANCELLED", "ACTIVE", "ACTIVE"];
    const e = equipment[index % equipment.length];
    return {
        id: `contract-${String(index + 1).padStart(3, "0")}`,
        code: `HD-2026-${String(24 - index).padStart(4, "0")}`,
        customerName: customers[index % customers.length],
        customerTaxCode: `0${101234567 + index}`,
        equipmentName: e[0],
        equipmentModel: e[1],
        startDate: `${String(10 + (index % 10)).padStart(2, "0")}/08/2026`,
        endDate: `${String(17 + (index % 10)).padStart(2, "0")}/08/2026`,
        duration: `${7 + (index % 5)} ngày`,
        value: 28000000 + (index % 5) * 23000000,
        status: pattern[index % pattern.length],
    };
});

const PAGE_SIZE = 5;
const formatCurrency = (value: number) => `${new Intl.NumberFormat("vi-VN").format(value)} đ`;

export const SalesContractsPage = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<ContractStatus | "ALL">("ALL");
    const [timeRange, setTimeRange] = useState("ALL");
    const [page, setPage] = useState(1);

    const summary = useMemo(() => {
        const count = (s: ContractStatus) => CONTRACTS.filter((item) => item.status === s).length;
        return {
            total: CONTRACTS.length,
            active: count("ACTIVE"),
            expiring: count("EXPIRING"),
            expired: count("EXPIRED"),
            cancelled: count("CANCELLED"),
            totalValue: CONTRACTS.reduce((sum, item) => sum + item.value, 0),
        };
    }, []);

    const filtered = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        return CONTRACTS.filter((item) => {
            const text = `${item.code} ${item.customerName} ${item.equipmentName} ${item.equipmentModel}`.toLowerCase();
            return (keyword === "" || text.includes(keyword)) && (status === "ALL" || item.status === status);
        });
    }, [search, status]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const reset = () => {
        setSearch("");
        setStatus("ALL");
        setTimeRange("ALL");
        setPage(1);
    };

    return (
        <main className="space-y-4">
            <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-950">Hợp đồng</h1>
                    <p className="mt-1 text-xs text-slate-500">Tạo và theo dõi hợp đồng thuê thiết bị.</p>
                </div>
                <Link
                    to="/sales/contracts/create"
                    className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl bg-blue-600 px-4 text-sm font-semibold !text-white shadow-sm transition hover:bg-blue-700 hover:!text-white lg:self-auto"
                >
                    <Plus size={17} /> Tạo hợp đồng mới
                </Link>
            </header>

            <section className="grid gap-4 xl:grid-cols-[1.05fr_1fr_1.15fr]">
                <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-900">Tổng quan hợp đồng</h2>
                        <span className="text-[10px] text-slate-400">Tất cả thời gian</span>
                    </div>
                    <div className="mt-4 flex items-center gap-5">
                        <div className="relative flex size-28 items-center justify-center rounded-full border-[16px] border-blue-100 border-r-blue-600 border-b-blue-600">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-slate-950">{summary.total}</p>
                                <p className="text-[10px] text-slate-400">Tổng hợp đồng</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-xs">
                            <p><span className="font-bold text-emerald-600">{summary.active}</span> đang hiệu lực</p>
                            <p><span className="font-bold text-amber-600">{summary.expiring}</span> sắp hết hạn</p>
                            <p><span className="font-bold text-rose-600">{summary.expired}</span> đã hết hạn</p>
                        </div>
                    </div>
                    <div className="mt-4 border-t border-slate-100 pt-3">
                        <p className="text-[10px] text-slate-400">Tổng giá trị hợp đồng</p>
                        <div className="mt-1 flex items-center gap-2">
                            <p className="text-lg font-bold text-blue-600">{formatCurrency(summary.totalValue)}</p>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600"><TrendingUp size={12} />12.4%</span>
                        </div>
                    </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900">Trạng thái hợp đồng</h2>
                    <div className="mt-4 space-y-2">
                        <StatusCard icon={CheckCircle2} label="Đang hiệu lực" value={summary.active} tone="emerald" />
                        <StatusCard icon={Clock3} label="Sắp hết hạn" value={summary.expiring} tone="amber" />
                        <StatusCard icon={XCircle} label="Đã hết hạn" value={summary.expired} tone="rose" />
                    </div>
                    <Link to="/sales/contracts/activities" className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700">
                        Xem tất cả hoạt động <Activity size={14} />
                    </Link>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-slate-900">Xu hướng hợp đồng</h2>
                        <span className="text-[10px] text-slate-400">7 ngày</span>
                    </div>
                    <svg viewBox="0 0 320 125" className="mt-4 h-32 w-full" aria-hidden="true">
                        <polyline points="10,92 55,60 100,76 145,76 190,48 235,62 310,54" fill="none" stroke="currentColor" strokeWidth="3" className="text-blue-600" />
                        {[["10","92"],["55","60"],["100","76"],["145","76"],["190","48"],["235","62"],["310","54"]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="4" className="fill-white stroke-blue-600" strokeWidth="2" />)}
                    </svg>
                    <div className="grid grid-cols-4 gap-2 border-t border-slate-100 pt-3 text-center">
                        <MiniMetric label="Tạo mới" value="12" />
                        <MiniMetric label="Gia hạn" value="8" />
                        <MiniMetric label="Đã kết thúc" value="6" />
                        <MiniMetric label="Hết hạn" value="3" />
                    </div>
                </article>
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-slate-100 p-3 lg:flex-row">
                        <label className="relative flex-1">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm theo mã hợp đồng, khách hàng, thiết bị..." className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs outline-none focus:border-blue-500" />
                        </label>
                        <select value={status} onChange={(e) => { setStatus(e.target.value as ContractStatus | "ALL"); setPage(1); }} className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 lg:w-[160px]">
                            <option value="ALL">Tất cả trạng thái</option><option value="ACTIVE">Hiệu lực</option><option value="EXPIRING">Sắp hết hạn</option><option value="EXPIRED">Hết hạn</option><option value="CANCELLED">Đã hủy</option>
                        </select>
                        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="h-10 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700 lg:w-[145px]">
                            <option value="ALL">Tất cả thời gian</option><option value="30">30 ngày</option><option value="90">90 ngày</option>
                        </select>
                        <button type="button" onClick={reset} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"><RefreshCw size={14} />Đặt lại</button>
                    </div>

                    <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 pt-1">
                        {[
                            ["ALL", "Tất cả", summary.total],
                            ["ACTIVE", "Đang hiệu lực", summary.active],
                            ["EXPIRING", "Sắp hết hạn", summary.expiring],
                            ["EXPIRED", "Đã hết hạn", summary.expired],
                            ["CANCELLED", "Đã hủy", summary.cancelled],
                        ].map(([value, label, count]) => (
                            <button key={String(value)} type="button" onClick={() => { setStatus(value as ContractStatus | "ALL"); setPage(1); }} className={`shrink-0 border-b-2 px-3 py-3 text-xs font-semibold ${status === value ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500"}`}>
                                {label} ({count})
                            </button>
                        ))}
                    </div>

                    <div className="overflow-x-auto">
                        <div className="min-w-[930px]">
                            <div className="grid grid-cols-[130px_1.2fr_1.2fr_120px_125px_110px_110px] gap-3 bg-slate-50 px-4 py-2.5 text-[10px] font-bold uppercase text-slate-500">
                                <span>Mã hợp đồng</span><span>Khách hàng</span><span>Thiết bị</span><span>Thời hạn</span><span>Giá trị</span><span>Trạng thái</span><span className="text-right">Thao tác</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {visible.map((item) => (
                                    <div key={item.id} className="grid grid-cols-[130px_1.2fr_1.2fr_120px_125px_110px_110px] items-center gap-3 px-4 py-3 text-xs hover:bg-slate-50/70">
                                        <div><Link to={`/sales/contracts/${item.id}`} className="font-bold text-blue-600 hover:underline">{item.code}</Link><p className="mt-1 text-[10px] text-slate-400">Tạo 13/08/2026</p></div>
                                        <div><p className="font-bold text-slate-900">{item.customerName}</p><p className="mt-1 text-[10px] text-slate-400">MST: {item.customerTaxCode}</p></div>
                                        <div><p className="font-semibold text-slate-800">{item.equipmentName}</p><p className="mt-1 text-[10px] text-slate-400">{item.equipmentModel}</p></div>
                                        <div><p className="font-semibold text-slate-700">{item.startDate}</p><p className="text-[10px] text-slate-400">đến {item.endDate} • {item.duration}</p></div>
                                        <p className="font-bold text-slate-900">{formatCurrency(item.value)}</p>
                                        <span className={`w-fit rounded-full px-2 py-1 text-[10px] font-bold ${STATUS_CONFIG[item.status].className}`}>{STATUS_CONFIG[item.status].label}</span>
                                        <div className="flex justify-end gap-1">
                                            <button type="button" onClick={() => navigate(`/sales/contracts/${item.id}`)} className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"><Eye size={13}/>Chi tiết</button>
                                            <button type="button" onClick={() => window.alert(`Tùy chọn cho ${item.code}`)} className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"><MoreVertical size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <footer className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                        <p className="text-[11px] text-slate-500">Hiển thị {(safePage - 1) * PAGE_SIZE + 1} - {Math.min(safePage * PAGE_SIZE, filtered.length)} của {filtered.length} hợp đồng</p>
                        <div className="flex items-center gap-1">
                            <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)} className="flex size-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"><ChevronLeft size={14}/></button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((p) => <button key={p} onClick={() => setPage(p)} className={`flex size-8 items-center justify-center rounded-lg text-xs font-semibold ${p === safePage ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600"}`}>{p}</button>)}
                            <button disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)} className="flex size-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"><ChevronRight size={14}/></button>
                        </div>
                    </footer>
                </div>

                <aside className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <h2 className="text-sm font-bold text-slate-900">Hoạt động gần đây</h2>
                        <Link to="/sales/contracts/activities" className="text-[11px] font-bold text-blue-600">Xem tất cả</Link>
                    </div>
                    <div className="space-y-1 p-4">
                        {[
                            ["Tạo hợp đồng mới HD-2026-0024", "10:30 hôm nay"],
                            ["Hợp đồng HD-2026-0023 sắp hết hạn", "09:15 hôm nay"],
                            ["Gia hạn hợp đồng HD-2026-0021", "Hôm qua"],
                            ["Hợp đồng HD-2026-0020 đã hết hạn", "12/08/2026"],
                        ].map(([title, time], i) => (
                            <div key={title} className="flex gap-3 py-2.5">
                                <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${i === 0 ? "bg-emerald-50 text-emerald-600" : i === 1 ? "bg-amber-50 text-amber-600" : i === 2 ? "bg-blue-50 text-blue-600" : "bg-rose-50 text-rose-600"}`}><FileSignature size={14}/></span>
                                <div><p className="text-xs font-semibold text-slate-800">{title}</p><p className="mt-1 text-[10px] text-slate-400">{time}</p></div>
                            </div>
                        ))}
                    </div>
                </aside>
            </section>
        </main>
    );
};

const StatusCard = ({ icon: Icon, label, value, tone }: { icon: typeof CheckCircle2; label: string; value: number; tone: "emerald" | "amber" | "rose" }) => {
    const tones = {
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600",
    };
    return <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"><span className={`flex size-8 items-center justify-center rounded-lg ${tones[tone]}`}><Icon size={16}/></span><div className="flex-1"><p className="text-xs font-bold text-slate-800">{label}</p><p className="text-[10px] text-slate-400">Theo dõi trạng thái</p></div><span className="text-lg font-bold text-slate-950">{value}</span></div>;
};

const MiniMetric = ({ label, value }: { label: string; value: string }) => <div><p className="text-sm font-bold text-slate-950">{value}</p><p className="text-[9px] text-slate-400">{label}</p></div>;