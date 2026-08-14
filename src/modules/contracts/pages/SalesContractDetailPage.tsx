import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, FileSignature, PackageCheck, UserRound } from "lucide-react";
import { Link, Navigate, useParams } from "react-router";

const DATA = {
    customerName: "Công ty TNHH ABC",
    taxCode: "0101234567",
    contactName: "Nguyễn Văn An",
    phone: "0901 234 567",
    rentalCode: "RENT-2026-028",
    quotationCode: "BG-2026-0022",
    startDate: "14/08/2026",
    endDate: "21/08/2026",
    value: "85.000.000 đ",
    deposit: "20.000.000 đ",
    equipment: "Máy phát điện 50kVA",
    model: "Cummins C50D5",
};

export const SalesContractDetailPage = () => {
    const { contractId } = useParams<{contractId:string}>();
    if (!contractId || !/^contract-\d{3}$/.test(contractId)) return <Navigate to="/sales/contracts" replace />;

    return (
        <main className="space-y-4">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div><div className="flex items-center gap-2 text-xs text-slate-500"><Link to="/sales/contracts" className="hover:text-blue-600">Hợp đồng</Link><span>/</span><span className="font-semibold text-slate-700">HD-2026-0024</span></div><div className="mt-2 flex items-center gap-2"><h1 className="text-2xl font-bold text-slate-950">HD-2026-0024</h1><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Đang hiệu lực</span></div></div>
                <Link to="/sales/contracts" className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700"><ArrowLeft size={15}/>Quay lại</Link>
            </header>

            <section className="grid gap-4 lg:grid-cols-2">
                <Card title="Thông tin khách hàng" icon={<UserRound size={16} className="text-blue-600"/>}>
                    <Grid><Info label="Khách hàng" value={DATA.customerName}/><Info label="Mã số thuế" value={DATA.taxCode}/><Info label="Người liên hệ" value={DATA.contactName}/><Info label="Số điện thoại" value={DATA.phone}/></Grid>
                </Card>
                <Card title="Thông tin hợp đồng" icon={<FileSignature size={16} className="text-violet-600"/>}>
                    <Grid><Info label="Đơn thuê" value={DATA.rentalCode}/><Info label="Báo giá" value={DATA.quotationCode}/><Info label="Ngày bắt đầu" value={DATA.startDate}/><Info label="Ngày kết thúc" value={DATA.endDate}/><Info label="Giá trị" value={DATA.value}/><Info label="Tiền đặt cọc" value={DATA.deposit}/></Grid>
                </Card>
            </section>

            <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
                <Card title="Thiết bị thuê" icon={<PackageCheck size={16} className="text-blue-600"/>}>
                    <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-4"><Info label="Thiết bị" value={DATA.equipment}/><Info label="Model" value={DATA.model}/><Info label="Số lượng" value="1"/><Info label="Thời gian thuê" value="7 ngày"/></div>
                </Card>
                <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="text-sm font-bold">Thao tác nhanh</h2>
                    <div className="mt-4 space-y-2"><button onClick={()=>window.alert("Đã gửi yêu cầu gia hạn.")} className="h-9 w-full rounded-xl bg-blue-600 text-xs font-bold !text-white">Gia hạn hợp đồng</button><button onClick={()=>window.alert("Đã tải bản hợp đồng mẫu.")} className="h-9 w-full rounded-xl border border-slate-200 text-xs font-semibold">Tải hợp đồng</button><Link to="/sales/contracts/activities" className="flex h-9 items-center justify-center rounded-xl border border-slate-200 text-xs font-semibold">Xem lịch sử hoạt động</Link></div>
                </aside>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2"><Clock3 size={16} className="text-slate-500"/><h2 className="text-sm font-bold">Lịch sử hợp đồng</h2></div>
                <div className="mt-4 space-y-4">
                    <Timeline icon={<CheckCircle2 size={14}/>} title="Hợp đồng có hiệu lực" time="14/08/2026 08:00" />
                    <Timeline icon={<FileSignature size={14}/>} title="Tạo hợp đồng" time="13/08/2026 10:30" />
                    <Timeline icon={<CalendarDays size={14}/>} title="Xác nhận thời gian thuê" time="13/08/2026 09:45" />
                </div>
            </section>
        </main>
    );
};

const Card=({title,icon,children}:{title:string;icon:React.ReactNode;children:React.ReactNode})=><article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center gap-2">{icon}<h2 className="text-sm font-bold">{title}</h2></div><div className="mt-4">{children}</div></article>;
const Grid=({children}:{children:React.ReactNode})=><div className="grid gap-4 sm:grid-cols-2">{children}</div>;
const Info=({label,value}:{label:string;value:string})=><div><p className="text-[10px] text-slate-400">{label}</p><p className="mt-1 text-xs font-semibold text-slate-800">{value}</p></div>;
const Timeline=({icon,title,time}:{icon:React.ReactNode;title:string;time:string})=><div className="flex gap-3"><span className="flex size-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">{icon}</span><div><p className="text-xs font-bold text-slate-800">{title}</p><p className="mt-1 text-[10px] text-slate-400">{time}</p></div></div>;