import { Activity, ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileSignature, Search, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

type ActivityType = "CREATED" | "EXTENDED" | "EXPIRING" | "EXPIRED";
const ACTIVITIES = Array.from({ length: 18 }, (_, i) => {
    const types: ActivityType[] = ["CREATED","EXPIRING","EXTENDED","EXPIRED"];
    const type = types[i % types.length];
    return {
        id:`activity-${i+1}`, contractId:`contract-${String((i%24)+1).padStart(3,"0")}`, code:`HD-2026-${String(24-(i%24)).padStart(4,"0")}`,
        title:type==="CREATED"?"Tạo hợp đồng mới":type==="EXTENDED"?"Gia hạn hợp đồng":type==="EXPIRING"?"Hợp đồng sắp hết hạn":"Hợp đồng đã hết hạn",
        actor:i%2===0?"Trần Thị Kinh Doanh":"Nguyễn Văn A", time:i<2?`${10-i}:30 hôm nay`:`${String(13-(i%10)).padStart(2,"0")}/08/2026`, type
    };
});
const PAGE_SIZE=6;

export const SalesContractActivitiesPage=()=>{
    const [search,setSearch]=useState(""); const [type,setType]=useState<ActivityType|"ALL">("ALL"); const [page,setPage]=useState(1);
    const filtered=useMemo(()=>ACTIVITIES.filter((x)=>(search===""||`${x.code} ${x.title} ${x.actor}`.toLowerCase().includes(search.toLowerCase()))&&(type==="ALL"||x.type===type)),[search,type]);
    const totalPages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE)); const safe=Math.min(page,totalPages); const visible=filtered.slice((safe-1)*PAGE_SIZE,safe*PAGE_SIZE);

    return <main className="space-y-4">
        <header className="flex items-center justify-between"><div><div className="flex items-center gap-2"><Activity size={18} className="text-blue-600"/><h1 className="text-2xl font-bold">Lịch sử hoạt động hợp đồng</h1></div><p className="mt-1 text-xs text-slate-500">Theo dõi các thay đổi quan trọng của hợp đồng.</p></div><Link to="/sales/contracts" className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold"><ArrowLeft size={15}/>Quay lại</Link></header>
        <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><div className="flex gap-2"><label className="relative flex-1"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={(e)=>{setSearch(e.target.value);setPage(1)}} placeholder="Tìm mã hợp đồng, hoạt động, người thực hiện..." className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs"/></label><select value={type} onChange={(e)=>{setType(e.target.value as ActivityType|"ALL");setPage(1)}} className="h-10 rounded-xl border border-slate-200 px-3 text-xs"><option value="ALL">Tất cả hoạt động</option><option value="CREATED">Tạo mới</option><option value="EXTENDED">Gia hạn</option><option value="EXPIRING">Sắp hết hạn</option><option value="EXPIRED">Hết hạn</option></select></div></section>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="divide-y divide-slate-100">{visible.map((a)=><Row key={a.id} activity={a}/>)}</div><footer className="flex items-center justify-between border-t border-slate-100 px-4 py-3"><p className="text-[11px] text-slate-500">{filtered.length} hoạt động</p><div className="flex gap-1"><button disabled={safe===1} onClick={()=>setPage(Math.max(1,safe-1))} className="flex size-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"><ChevronLeft size={14}/></button>{Array.from({length:totalPages},(_,i)=>i+1).map(p=><button key={p} onClick={()=>setPage(p)} className={`flex size-8 items-center justify-center rounded-lg text-xs font-semibold ${p===safe?"bg-blue-600 text-white":"border border-slate-200"}`}>{p}</button>)}<button disabled={safe===totalPages} onClick={()=>setPage(Math.min(totalPages,safe+1))} className="flex size-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"><ChevronRight size={14}/></button></div></footer></section>
    </main>;
};

const Row=({activity}:{activity:(typeof ACTIVITIES)[number]})=>{
    const config={CREATED:{icon:FileSignature,tone:"bg-emerald-50 text-emerald-600"},EXTENDED:{icon:CheckCircle2,tone:"bg-blue-50 text-blue-600"},EXPIRING:{icon:Clock3,tone:"bg-amber-50 text-amber-600"},EXPIRED:{icon:XCircle,tone:"bg-rose-50 text-rose-600"}}[activity.type];
    const Icon=config.icon;
    return <div className="flex items-center gap-3 px-4 py-3"><span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${config.tone}`}><Icon size={15}/></span><div className="min-w-0 flex-1"><Link to={`/sales/contracts/${activity.contractId}`} className="text-xs font-bold text-blue-600">{activity.code}</Link><p className="mt-1 text-xs font-semibold text-slate-800">{activity.title}</p><p className="mt-1 text-[10px] text-slate-400">{activity.actor}</p></div><span className="text-[10px] text-slate-400">{activity.time}</span></div>;
};