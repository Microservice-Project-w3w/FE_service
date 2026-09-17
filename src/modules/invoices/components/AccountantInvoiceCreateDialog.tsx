import { useMemo, useState } from "react";
import { X } from "lucide-react";
import type { CreateInvoiceRequestDto } from "@/modules/invoices/api/accountant-invoice-write.dto";
import { useAccountantInvoiceReferences } from "@/modules/invoices/hooks/useAccountantInvoiceReferences";

interface Props {
  open: boolean;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (request: CreateInvoiceRequestDto) => Promise<void>;
}

const fieldClass = "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400";

export const AccountantInvoiceCreateDialog = ({ open, submitting, onClose, onSubmit }: Props) => {
  const refs = useAccountantInvoiceReferences(open);
  const [branchId, setBranchId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [contractId, setContractId] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [unitPrice, setUnitPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const customers = useMemo(() => refs.data.customers.filter((item) => String(item.branchId) === branchId), [branchId, refs.data.customers]);
  const orders = useMemo(() => refs.data.orders.filter((item) => String(item.branchId) === branchId && String(item.customerId) === customerId), [branchId, customerId, refs.data.orders]);
  const contracts = useMemo(() => refs.data.contracts.filter((item) => String(item.rentalOrderId) === orderId && String(item.customerId) === customerId), [customerId, orderId, refs.data.contracts]);
  if (!open) return null;
  const submit = async () => {
    const qty = Number(quantity); const price = Number(unitPrice);
    if (!refs.organizationId || !branchId || !customerId || !orderId || !contractId || !dueAt || !description.trim() || qty <= 0 || price <= 0) {
      setError("Vui lòng nhập đầy đủ dữ liệu hợp lệ."); return;
    }
    setError(null);
    await onSubmit({
      organizationId: refs.organizationId,
      branchId: Number(branchId), customerId: Number(customerId),
      rentalOrderId: Number(orderId), rentalContractId: Number(contractId),
      invoiceType: "RENTAL", dueAt: new Date(`${dueAt}T23:59:00`).toISOString(),
      items: [{ itemType: "RENTAL", description: description.trim(), quantity: qty, unitPrice: price, referenceType: "RENTAL_ORDER", referenceId: Number(orderId) }],
    });
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
      <div className="flex items-center justify-between"><div><h2 className="text-lg font-bold">Tạo hóa đơn</h2><p className="text-sm text-slate-500">Dữ liệu tham chiếu được tải từ backend.</p></div><button onClick={onClose}><X /></button></div>
      {(refs.error || error) && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{refs.error ?? error}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <select className={fieldClass} value={branchId} onChange={(e) => { setBranchId(e.target.value); setCustomerId(""); setOrderId(""); setContractId(""); }}><option value="">Chọn chi nhánh</option>{refs.data.branches.map((x) => <option key={x.id} value={x.id}>{x.branchName}</option>)}</select>
        <select className={fieldClass} value={customerId} onChange={(e) => { setCustomerId(e.target.value); setOrderId(""); setContractId(""); }}><option value="">Chọn khách hàng</option>{customers.map((x) => <option key={x.id} value={x.id}>{x.displayName}</option>)}</select>
        <select className={fieldClass} value={orderId} onChange={(e) => { setOrderId(e.target.value); setContractId(""); }}><option value="">Chọn đơn thuê</option>{orders.map((x) => <option key={x.id} value={x.id}>{x.orderCode}</option>)}</select>
        <select className={fieldClass} value={contractId} onChange={(e) => setContractId(e.target.value)}><option value="">Chọn hợp đồng</option>{contracts.map((x) => <option key={x.id} value={x.id}>{x.contractCode}</option>)}</select>
        <input className={fieldClass} type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
        <input className={fieldClass} placeholder="Mô tả dòng hóa đơn" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input className={fieldClass} type="number" min="0.01" step="0.01" placeholder="Số lượng" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <input className={fieldClass} type="number" min="0.01" step="1000" placeholder="Đơn giá" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} />
      </div>
      <div className="mt-6 flex justify-end gap-3"><button className="h-11 rounded-xl border px-4 text-sm font-semibold" onClick={onClose}>Hủy</button><button disabled={submitting || refs.loading} className="h-11 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white disabled:opacity-50" onClick={() => void submit()}>{submitting ? "Đang tạo..." : "Tạo hóa đơn"}</button></div>
    </div>
  </div>;
};
