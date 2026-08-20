import { ArrowLeft, Check, FileSignature, PackageCheck, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

interface EquipmentItem { id: string; name: string; quantity: number; }
const RENTALS = [
    { id: "RENT-2026-028", customer: "Công ty TNHH ABC", quotation: "BG-2026-0022", value: 85000000 },
    { id: "RENT-2026-027", customer: "Công ty XYZ", quotation: "BG-2026-0018", value: 104000000 },
    { id: "RENT-2026-026", customer: "Công ty DEF", quotation: "BG-2026-0014", value: 120000000 },
];
const EQUIPMENT = ["Máy phát điện 50kVA", "Xe nâng người 12m", "Máy đào 0.9m³", "Máy nén khí 10HP"];
const formatCurrency = (v:number)=>`${new Intl.NumberFormat("vi-VN").format(v)} đ`;

export const SalesContractCreatePage = () => {
    const navigate = useNavigate();
    const [rentalId, setRentalId] = useState(RENTALS[0].id);
    const [startDate, setStartDate] = useState("2026-08-14");
    const [endDate, setEndDate] = useState("2026-08-21");
    const [deposit, setDeposit] = useState("20000000");
    const [terms, setTerms] = useState("Thanh toán 50% khi ký hợp đồng, phần còn lại trước ngày giao thiết bị.");
    const [search, setSearch] = useState("");
    const [items, setItems] = useState<EquipmentItem[]>([{ id: "EQ-001", name: EQUIPMENT[0], quantity: 1 }]);

    const rental = RENTALS.find((item)=>item.id===rentalId) ?? RENTALS[0];
    const filteredEquipment = useMemo(()=>EQUIPMENT.filter((name)=>name.toLowerCase().includes(search.toLowerCase())),[search]);

    const addItem = (name:string) => {
        if (items.some((item)=>item.name===name)) return;
        setItems((current)=>[...current,{ id:`EQ-${String(current.length+2).padStart(3,"0")}`, name, quantity:1 }]);
        setSearch("");
    };
    const submit = () => {
        if (!items.length) return window.alert("Cần ít nhất một thiết bị.");
        window.alert("Đã tạo hợp đồng thành công.");
        navigate("/sales/contracts");
    };

    return (
        <main className="space-y-4">
            <header className="flex items-center justify-between">
                <div><h1 className="text-2xl font-bold text-slate-950">Tạo hợp đồng mới</h1><p className="mt-1 text-xs text-slate-500">Tạo hợp đồng từ đơn thuê đã được xác nhận.</p></div>
                <Link to="/sales/contracts" className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700"><ArrowLeft size={15}/>Quay lại</Link>
            </header>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-4">
                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2"><FileSignature size={17} className="text-blue-600"/><h2 className="text-sm font-bold">Thông tin hợp đồng</h2></div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <Field label="Đơn thuê">
                                <select value={rentalId} onChange={(e)=>setRentalId(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs">{RENTALS.map((item)=><option key={item.id}>{item.id}</option>)}</select>
                            </Field>
                            <Field label="Khách hàng"><input readOnly value={rental.customer} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs"/></Field>
                            <Field label="Ngày bắt đầu"><input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs"/></Field>
                            <Field label="Ngày kết thúc"><input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs"/></Field>
                            <Field label="Tiền đặt cọc"><input type="number" min={0} value={deposit} onChange={(e)=>setDeposit(e.target.value)} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-xs"/></Field>
                            <Field label="Báo giá"><input readOnly value={rental.quotation} className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs"/></Field>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><PackageCheck size={17} className="text-blue-600"/><h2 className="text-sm font-bold">Thiết bị thuê</h2></div><div className="relative w-[260px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Tìm thiết bị để thêm..." className="h-9 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-xs"/></div></div>
                        {search && <div className="mt-2 grid gap-2 sm:grid-cols-2">{filteredEquipment.map((name)=><button key={name} type="button" onClick={()=>addItem(name)} className="flex items-center justify-between rounded-xl border border-slate-200 p-2.5 text-left text-xs"><span>{name}</span><Plus size={14} className="text-blue-600"/></button>)}</div>}
                        <div className="mt-3 divide-y divide-slate-100">{items.map((item)=><div key={item.id} className="grid grid-cols-[1fr_100px_36px] items-center gap-3 py-3"><div><p className="text-xs font-bold text-slate-900">{item.name}</p><p className="text-[10px] text-slate-400">{item.id}</p></div><input type="number" min={1} value={item.quantity} onChange={(e)=>setItems((current)=>current.map((x)=>x.id===item.id?{...x,quantity:Math.max(1,Number(e.target.value))}:x))} className="h-8 rounded-lg border border-slate-200 px-2 text-xs"/><button type="button" onClick={()=>setItems((current)=>current.filter((x)=>x.id!==item.id))} className="flex size-8 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50"><Trash2 size={14}/></button></div>)}</div>
                    </article>

                    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-sm font-bold">Điều khoản</h2><textarea rows={5} value={terms} onChange={(e)=>setTerms(e.target.value)} className="mt-3 w-full resize-none rounded-xl border border-slate-200 p-3 text-xs"/></article>
                </div>

                <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="text-sm font-bold">Tóm tắt hợp đồng</h2>
                    <div className="mt-4 space-y-3 text-xs">
                        <SummaryRow label="Khách hàng" value={rental.customer}/><SummaryRow label="Đơn thuê" value={rental.id}/><SummaryRow label="Báo giá" value={rental.quotation}/><SummaryRow label="Giá trị" value={formatCurrency(rental.value)}/><SummaryRow label="Tiền cọc" value={formatCurrency(Number(deposit||0))}/><SummaryRow label="Số thiết bị" value={String(items.length)}/>
                    </div>
                    <button type="button" onClick={submit} className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-xs font-bold !text-white hover:bg-blue-700"><Check size={16}/>Tạo hợp đồng</button>
                </aside>
            </section>
        </main>
    );
};

const Field = ({label,children}:{label:string;children:React.ReactNode}) => <label><span className="mb-1 block text-[11px] font-semibold text-slate-500">{label}</span>{children}</label>;
const SummaryRow = ({label,value}:{label:string;value:string}) => <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-0"><span className="text-slate-500">{label}</span><span className="max-w-[180px] text-right font-semibold text-slate-800">{value}</span></div>;
