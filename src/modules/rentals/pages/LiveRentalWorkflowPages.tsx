import { useCallback, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { salesRentalWorkflowApi as api } from "@/modules/rentals/api/sales-rental-workflow.api";
import { useSalesRentalWorkflow } from "@/modules/rentals/hooks/useSalesRentalWorkflow";
import { useSalesRentalRequests } from "@/modules/rentals/hooks/useSalesRentalRequests";
import { useLiveData } from "@/shared/hooks/useLiveData";
import {
  LiveAction,
  LiveFields,
  LivePage,
  LiveTable,
} from "@/shared/components/data-display/LiveDataView";
import {
  formatLiveDate,
  formatLiveMoney,
  liveButtonClass,
  liveInputClass,
} from "@/shared/utils/liveFormat";

const labels: Record<string, string> = {
  DRAFT: "Bản nháp",
  SENT: "Chờ quản lý duyệt",
  PENDING_APPROVAL: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  ACCEPTED: "Khách đã chấp nhận",
  CONVERTED: "Đã tạo đơn",
  REJECTED: "Đã từ chối",
  EXPIRED: "Hết hạn",
  CANCELLED: "Đã hủy",
  PENDING: "Chờ giữ chỗ",
  RESERVED: "Đã giữ chỗ",
  CONFIRMED: "Đã xác nhận",
  SIGNED: "Đã ký",
  ACTIVE: "Đang hiệu lực",
  EXTENDED: "Đã gia hạn",
  LIQUIDATED: "Đã thanh lý",
};
const workflowStatusLabel = (status: string) => labels[status] ?? status;
function usePermissions() {
  const user = useAuthStore((s) => s.user);
  return {
    user,
    can: (permission: string) =>
      user?.permissions.includes(permission) ?? false,
  };
}
const errorMessage = (e: unknown) =>
  e instanceof Error ? e.message : "Thao tác thất bại.";

export function SalesRequestsLivePage() {
  const state = useSalesRentalRequests();
  const [search, setSearch] = useState("");
  return (
    <LivePage
      title="Yêu cầu thuê"
      loading={state.isLoading}
      error={state.error}
    >
      <div className="flex flex-wrap gap-3">
        <Link className={liveButtonClass} to="/sales/rental-requests/create">
          Tạo yêu cầu thuê
        </Link>
        <input
          aria-label="Tìm yêu cầu thuê"
          className={liveInputClass}
          placeholder="Tìm mã yêu cầu"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <LiveTable
        headers={[
          "Mã yêu cầu",
          "Khách hàng",
          "Thời gian thuê",
          "Chi nhánh",
          "Trạng thái",
        ]}
        rows={state.requests
          .filter((r) =>
            r.requestCode.toLowerCase().includes(search.toLowerCase()),
          )
          .map((r) => [
            <Link
              key="detail"
              className="text-blue-600"
              to={`/sales/rental-requests/${r.id}`}
            >
              {r.requestCode}
            </Link>,
            <Link key="detail" to={`/sales/customers/${r.customerId}`}>
              #{r.customerId}
            </Link>,
            `${formatLiveDate(r.startAt)} → ${formatLiveDate(r.endAt)}`,
            `#${r.branchId}`,
            workflowStatusLabel(r.status),
          ])}
      />
    </LivePage>
  );
}

export function SalesQuotationsLivePage() {
  const state = useSalesRentalWorkflow();
  const [search, setSearch] = useState("");
  return (
    <LivePage
      title="Báo giá thuê"
      loading={state.isLoading}
      error={state.error}
    >
      <Link className={liveButtonClass} to="/sales/quotations/create">
        Tạo báo giá
      </Link>
      <input
        aria-label="Tìm báo giá"
        className={liveInputClass}
        placeholder="Tìm mã báo giá"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <LiveTable
        headers={["Mã", "Khách hàng", "Hạn báo giá", "Tổng tiền", "Trạng thái"]}
        rows={state.quotations
          .filter((q) =>
            q.quotationCode.toLowerCase().includes(search.toLowerCase()),
          )
          .map((q) => [
            <Link
              key="detail"
              className="text-blue-600"
              to={`/sales/quotations/${q.id}`}
            >
              {q.quotationCode}
            </Link>,
            <Link key="detail" to={`/sales/customers/${q.customerId}`}>
              #{q.customerId}
            </Link>,
            formatLiveDate(q.validUntil),
            formatLiveMoney(q.totalAmount),
            workflowStatusLabel(q.status),
          ])}
      />
    </LivePage>
  );
}

export function SalesQuotationCreateLivePage() {
  const state = useSalesRentalRequests();
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();
  const [amount, setAmount] = useState("0");
  const [deposit, setDeposit] = useState("0");
  const [fee, setFee] = useState("0");
  const [validUntil, setValidUntil] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [terms, setTerms] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requests = state.requests.filter((r) =>
    ["SUBMITTED", "PROCESSING"].includes(r.status),
  );
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (!selected || !requests.some((r) => r.id === Number(selected)))
        throw new Error("Chọn yêu cầu thuê hợp lệ.");
      const quotation = await api.createQuotation({
        rentalRequestId: Number(selected),
        rentalAmount: Number(amount),
        depositAmount: Number(deposit),
        deliveryFee: Number(fee),
        validUntil,
        discountCode: discountCode.trim() || undefined,
        specialTerms: terms.trim() || undefined,
      });
      navigate(`/sales/quotations/${quotation.id}`);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  const request = requests.find((r) => r.id === Number(selected));
  return (
    <LivePage
      title="Tạo báo giá từ yêu cầu thuê"
      loading={state.isLoading}
      error={state.error}
    >
      <Link to="/sales/quotations">← Danh sách báo giá</Link>
      <form
        onSubmit={submit}
        className="max-w-2xl space-y-4 rounded-2xl border bg-white p-5"
      >
        <label className="block">
          Yêu cầu thuê
          <select
            required
            className={liveInputClass}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Chọn yêu cầu</option>
            {requests.map((r) => (
              <option key={r.id} value={r.id}>
                {r.requestCode}
              </option>
            ))}
          </select>
        </label>
        {request && (
          <LiveTable
            headers={["Loại thiết bị", "Số lượng"]}
            rows={request.items.map((i) => [
              `#${i.equipmentTypeId}`,
              i.quantity,
            ])}
          />
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          <label>
            Tiền thuê
            <input
              required
              min="0"
              type="number"
              className={liveInputClass}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <label>
            Tiền cọc
            <input
              required
              min="0"
              type="number"
              className={liveInputClass}
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
            />
          </label>
          <label>
            Phí giao hàng
            <input
              required
              min="0"
              type="number"
              className={liveInputClass}
              value={fee}
              onChange={(e) => setFee(e.target.value)}
            />
          </label>
        </div>
        <label className="block">
          Hạn báo giá
          <input
            required
            type="datetime-local"
            className={liveInputClass}
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
          />
        </label>
        <label className="block">
          Mã giảm giá
          <input
            className={liveInputClass}
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
        </label>
        <label className="block">
          Điều khoản
          <textarea
            className={liveInputClass}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
        </label>
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        <button disabled={busy || !selected} className={liveButtonClass}>
          {busy ? "Đang lưu…" : "Lưu báo giá nháp"}
        </button>
        <p className="text-sm text-slate-500">
          Sau khi lưu, gửi báo giá để Manager duyệt. Tổng tiền do backend tính,
          không dùng bảng giá mẫu.
        </p>
      </form>
    </LivePage>
  );
}

export function SalesRentalsLivePage() {
  const state = useSalesRentalWorkflow();
  const [search, setSearch] = useState("");
  return (
    <LivePage title="Đơn thuê" loading={state.isLoading} error={state.error}>
      <Link className={liveButtonClass} to="/sales/rentals/create">
        Tạo đơn từ báo giá
      </Link>
      <input
        aria-label="Tìm đơn thuê"
        placeholder="Tìm mã đơn"
        className={liveInputClass}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <LiveTable
        headers={["Mã đơn", "Khách hàng", "Thời gian", "Giá trị", "Trạng thái"]}
        rows={state.orders
          .filter((o) =>
            o.orderCode.toLowerCase().includes(search.toLowerCase()),
          )
          .map((o) => [
            <Link
              key="detail"
              className="text-blue-600"
              to={`/sales/rentals/${o.id}`}
            >
              {o.orderCode}
            </Link>,
            <Link key="detail" to={`/sales/customers/${o.customerId}`}>
              #{o.customerId}
            </Link>,
            `${formatLiveDate(o.startAt)} → ${formatLiveDate(o.endAt)}`,
            formatLiveMoney(o.totalAmount),
            workflowStatusLabel(o.status),
          ])}
      />
    </LivePage>
  );
}

export function SalesQuotationDetailLivePage() {
  const { quotationId = "" } = useParams();
  const navigate = useNavigate();
  const { can } = usePermissions();
  const loader = useCallback(async () => {
    const quotation = await api.getQuotation(quotationId);
    const request = await api.getRequest(String(quotation.rentalRequestId));
    return { quotation, request };
  }, [quotationId]);
  const state = useLiveData(loader);
  const q = state.data?.quotation;
  const request = state.data?.request;
  const [customerConfirmed, setCustomerConfirmed] = useState(false);
  return (
    <LivePage
      title="Chi tiết báo giá"
      loading={state.isLoading}
      error={state.error}
    >
      <Link to="/sales/quotations">← Danh sách báo giá</Link>
      {q && request && (
        <>
          <LiveFields
            fields={[
              ["Mã báo giá", q.quotationCode],
              ["Trạng thái", workflowStatusLabel(q.status)],
              [
                "Khách hàng",
                <Link key="detail" to={`/sales/customers/${q.customerId}`}>
                  Khách hàng #{q.customerId}
                </Link>,
              ],
              [
                "Yêu cầu thuê",
                <Link
                  key="detail"
                  to={`/sales/rental-requests/${q.rentalRequestId}`}
                >
                  {request.requestCode}
                </Link>,
              ],
              ["Bắt đầu", formatLiveDate(request.startAt)],
              ["Kết thúc", formatLiveDate(request.endAt)],
              ["Hạn báo giá", formatLiveDate(q.validUntil)],
              ["Tiền thuê", formatLiveMoney(q.rentalAmount)],
              ["Tiền cọc", formatLiveMoney(q.depositAmount)],
              ["Vận chuyển", formatLiveMoney(q.deliveryFee)],
              ["Giảm giá", formatLiveMoney(q.discountAmount)],
              ["Tổng cộng", formatLiveMoney(q.totalAmount)],
              ["Điều khoản", q.specialTerms],
            ]}
          />
          <LiveTable
            headers={["Loại thiết bị", "Số lượng"]}
            rows={request.items.map((item) => [
              `Loại #${item.equipmentTypeId}`,
              item.quantity,
            ])}
          />
          <div className="flex flex-wrap gap-3">
            {q.status === "DRAFT" && can("rental.quotation.send") && (
              <LiveAction
                run={() => api.sendQuotation(q.id)}
                after={state.reload}
              >
                Gửi báo giá
              </LiveAction>
            )}
            {q.status === "APPROVED" && can("rental.quotation.accept") && (
              <LiveAction
                run={() => api.acceptQuotation(q.id)}
                after={state.reload}
              >
                Chấp nhận báo giá
              </LiveAction>
            )}
            {q.status === "ACCEPTED" && can("rental.order.create") && (
              <LiveAction
                run={async () => {
                  const order = await api.convertQuotationToOrder(q.id);
                  navigate(`/sales/rentals/${order.id}`);
                }}
              >
                Tạo đơn thuê
              </LiveAction>
            )}
          </div>
          {q.status === "APPROVED" && can("rental.quotation.update") && (
            <div className="space-y-3 rounded-2xl border bg-white p-5">
              <label className="block">
                <input
                  type="checkbox"
                  checked={customerConfirmed}
                  onChange={(e) => setCustomerConfirmed(e.target.checked)}
                />{" "}
                Khách hàng đã đồng ý báo giá; tôi ghi nhận xác nhận này.
              </label>
              <LiveAction
                disabled={!customerConfirmed}
                run={() => api.recordAcceptance(q.id)}
                after={state.reload}
              >
                Ghi nhận khách chấp nhận
              </LiveAction>
            </div>
          )}
          {q.status === "APPROVED" &&
            !can("rental.quotation.accept") &&
            !can("rental.quotation.update") && (
              <p className="text-sm text-slate-600">
                Chờ khách hàng chấp nhận báo giá trước khi tạo đơn thuê.
              </p>
            )}
        </>
      )}
    </LivePage>
  );
}

export function SalesRentalCreateLivePage() {
  const workflow = useSalesRentalWorkflow();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const quotations = workflow.quotations.filter((q) => q.status === "ACCEPTED");
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      const order = await api.convertQuotationToOrder(Number(selected));
      navigate(`/sales/rentals/${order.id}`);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <LivePage
      title="Tạo đơn thuê từ báo giá"
      loading={workflow.isLoading}
      error={workflow.error}
    >
      <Link to="/sales/rentals">← Danh sách đơn thuê</Link>
      <form
        onSubmit={submit}
        className="max-w-xl space-y-4 rounded-2xl border border-slate-200 bg-white p-5"
      >
        <label className="block">
          Báo giá khách đã chấp nhận
          <select
            required
            className={liveInputClass}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Chọn báo giá</option>
            {quotations.map((q) => (
              <option key={q.id} value={q.id}>
                {q.quotationCode} — {formatLiveMoney(q.totalAmount)}
              </option>
            ))}
          </select>
        </label>
        {!quotations.length && (
          <p>
            Chưa có báo giá được khách hàng chấp nhận. Cần gửi, duyệt và nhận
            chấp nhận trước.
          </p>
        )}
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        <button className={liveButtonClass} disabled={busy || !selected}>
          {busy ? "Đang tạo…" : "Tạo đơn thuê"}
        </button>
      </form>
    </LivePage>
  );
}

export function SalesRentalDetailLivePage() {
  const { rentalId = "" } = useParams();
  const { can } = usePermissions();
  const loader = useCallback(() => api.getOrder(rentalId), [rentalId]);
  const state = useLiveData(loader);
  const order = state.data;
  const [reason, setReason] = useState("");
  return (
    <LivePage
      title="Chi tiết đơn thuê"
      loading={state.isLoading}
      error={state.error}
    >
      <Link to="/sales/rentals">← Danh sách đơn thuê</Link>
      {order && (
        <>
          <LiveFields
            fields={[
              ["Mã đơn", order.orderCode],
              ["Trạng thái", workflowStatusLabel(order.status)],
              ["Chi nhánh", `#${order.branchId}`],
              [
                "Khách hàng",
                <Link key="detail" to={`/sales/customers/${order.customerId}`}>
                  #{order.customerId}
                </Link>,
              ],
              [
                "Báo giá",
                <Link
                  key="detail"
                  to={`/sales/quotations/${order.quotationId}`}
                >
                  #{order.quotationId}
                </Link>,
              ],
              ["Bắt đầu", formatLiveDate(order.startAt)],
              ["Kết thúc", formatLiveDate(order.endAt)],
              ["Tổng tiền", formatLiveMoney(order.totalAmount)],
              ["Giữ chỗ Inventory", order.inventoryReservationId],
              ["Hạn giữ chỗ", formatLiveDate(order.reservedUntil)],
              ["Lý do hủy", order.cancelReason],
            ]}
          />
          {order.status === "CONFIRMED" && can("rental.contract.create") && (
            <Link
              className={liveButtonClass}
              to={`/sales/contracts/create?rentalOrderId=${order.id}`}
            >
              Lập hợp đồng
            </Link>
          )}
          {["PENDING", "RESERVED", "CONFIRMED"].includes(order.status) &&
            can("rental.order.cancel") && (
              <div className="max-w-lg space-y-3">
                <label>
                  Lý do hủy
                  <input
                    className={liveInputClass}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </label>
                <LiveAction
                  disabled={!reason.trim()}
                  run={() => api.cancelOrder(order.id, reason)}
                  after={state.reload}
                >
                  Hủy đơn thuê
                </LiveAction>
              </div>
            )}
        </>
      )}
    </LivePage>
  );
}

export function SalesContractsLivePage() {
  const workflow = useSalesRentalWorkflow();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const contracts = workflow.contracts.filter(
    (c) =>
      c.contractCode.toLowerCase().includes(search.toLowerCase()) &&
      (status === "ALL" || c.status === status),
  );
  return (
    <LivePage
      title="Hợp đồng thuê"
      loading={workflow.isLoading}
      error={workflow.error}
    >
      <div className="flex flex-wrap gap-3">
        <Link className={liveButtonClass} to="/sales/contracts/create">
          Tạo hợp đồng
        </Link>
        <input
          aria-label="Tìm hợp đồng"
          placeholder="Tìm mã hợp đồng"
          className={liveInputClass}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Trạng thái hợp đồng"
          className={liveInputClass}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ALL">Tất cả trạng thái</option>
          {[...new Set(workflow.contracts.map((c) => c.status))].map((s) => (
            <option key={s} value={s}>
              {workflowStatusLabel(s)}
            </option>
          ))}
        </select>
      </div>
      <LiveTable
        headers={["Hợp đồng", "Đơn thuê", "Thời gian", "Giá trị", "Trạng thái"]}
        rows={contracts.map((c) => [
          <Link
            key="detail"
            className="text-blue-600"
            to={`/sales/contracts/${c.id}`}
          >
            {c.contractCode}
          </Link>,
          <Link key="detail" to={`/sales/rentals/${c.rentalOrderId}`}>
            #{c.rentalOrderId}
          </Link>,
          `${formatLiveDate(c.startAt)} → ${formatLiveDate(c.endAt)}`,
          formatLiveMoney(c.totalAmount),
          workflowStatusLabel(c.status),
        ])}
      />
    </LivePage>
  );
}

export function SalesContractCreateLivePage() {
  const workflow = useSalesRentalWorkflow();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(
    new URLSearchParams(window.location.search).get("rentalOrderId") ?? "",
  );
  const [terms, setTerms] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const orders = workflow.orders.filter(
    (order) =>
      order.status === "CONFIRMED" &&
      !workflow.contracts.some((c) => c.rentalOrderId === order.id),
  );
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (!orders.some((o) => o.id === Number(selected)))
        throw new Error("Chọn đơn đã xác nhận và chưa có hợp đồng.");
      const contract = await api.createContract(Number(selected), terms);
      navigate(`/sales/contracts/${contract.id}`);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <LivePage
      title="Tạo hợp đồng thuê"
      loading={workflow.isLoading}
      error={workflow.error}
    >
      <Link to="/sales/contracts">← Danh sách hợp đồng</Link>
      <form
        onSubmit={submit}
        className="max-w-xl space-y-4 rounded-2xl border bg-white p-5"
      >
        <label className="block">
          Đơn thuê đã xác nhận
          <select
            className={liveInputClass}
            required
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Chọn đơn thuê</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                {o.orderCode} — {formatLiveMoney(o.totalAmount)}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          Điều khoản
          <textarea
            className={liveInputClass}
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
          />
        </label>
        {!orders.length && <p>Chưa có đơn đã xác nhận và chưa có hợp đồng.</p>}
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        <button className={liveButtonClass} disabled={busy || !selected}>
          {busy ? "Đang lưu…" : "Tạo hợp đồng chờ duyệt"}
        </button>
      </form>
    </LivePage>
  );
}

export function ContractDetailLivePage() {
  const { contractId = "" } = useParams();
  const { user, can } = usePermissions();
  const isManager = user?.role === "MANAGER";
  const loader = useCallback(
    async () => ({
      contract: await api.getContract(Number(contractId)),
      appendices: await api.getAppendices(Number(contractId)),
    }),
    [contractId],
  );
  const state = useLiveData(loader);
  const contract = state.data?.contract;
  const [newEnd, setNewEnd] = useState("");
  const [signatureConfirmed, setSignatureConfirmed] = useState(false);
  const [terms, setTerms] = useState("");
  return (
    <LivePage
      title="Chi tiết hợp đồng"
      loading={state.isLoading}
      error={state.error}
    >
      <Link to={isManager ? "/manager/rentals" : "/sales/contracts"}>
        ← Quay lại danh sách
      </Link>
      {contract && (
        <>
          <LiveFields
            fields={[
              ["Mã hợp đồng", contract.contractCode],
              ["Trạng thái", workflowStatusLabel(contract.status)],
              ["Đơn thuê", `#${contract.rentalOrderId}`],
              ["Khách hàng", `#${contract.customerId}`],
              ["Bắt đầu", formatLiveDate(contract.startAt)],
              ["Kết thúc", formatLiveDate(contract.endAt)],
              ["Giá trị", formatLiveMoney(contract.totalAmount)],
              ["Điều khoản", contract.terms],
              ["Ngày duyệt", formatLiveDate(contract.approvedAt)],
              ["Ngày ký", formatLiveDate(contract.signedAt)],
            ]}
          />
          {contract.status === "APPROVED" && can("rental.contract.sign") && (
            <LiveAction
              run={() => api.signContract(contract.id)}
              after={state.reload}
            >
              Ký hợp đồng
            </LiveAction>
          )}
          {can("rental.contract.update") && (
            <div className="space-y-3 rounded-2xl border bg-white p-5">
              <label>
                <input
                  type="checkbox"
                  checked={signatureConfirmed}
                  onChange={(e) => setSignatureConfirmed(e.target.checked)}
                />{" "}
                Khách hàng đã ký hợp đồng/phụ lục; tôi ghi nhận chữ ký đã có.
              </label>
              {contract.status === "APPROVED" && (
                <LiveAction
                  disabled={!signatureConfirmed}
                  run={() => api.recordSignature(contract.id)}
                  after={state.reload}
                >
                  Ghi nhận hợp đồng đã ký
                </LiveAction>
              )}
            </div>
          )}
          {["SIGNED", "ACTIVE", "EXTENDED"].includes(contract.status) &&
            can("rental.contract.extend") && (
              <div className="max-w-xl space-y-3 rounded-2xl border bg-white p-5">
                <h2 className="font-semibold">Lập phụ lục gia hạn</h2>
                <label className="block">
                  Ngày kết thúc mới
                  <input
                    type="datetime-local"
                    className={liveInputClass}
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                  />
                </label>
                <label className="block">
                  Điều khoản gia hạn
                  <textarea
                    className={liveInputClass}
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                  />
                </label>
                <LiveAction
                  disabled={
                    !newEnd ||
                    !terms.trim() ||
                    Date.parse(newEnd) <= Date.parse(contract.endAt)
                  }
                  run={() => api.extendContract(contract.id, newEnd, terms)}
                  after={state.reload}
                >
                  Gửi phụ lục gia hạn
                </LiveAction>
                <p className="text-sm text-slate-500">
                  Gia hạn chỉ có hiệu lực sau khi phụ lục được duyệt và ký.
                </p>
              </div>
            )}
          <h2 className="font-semibold">Phụ lục hợp đồng</h2>
          <LiveTable
            headers={[
              "Mã",
              "Ngày kết thúc",
              "Điều khoản",
              "Trạng thái",
              "Thao tác",
            ]}
            rows={(state.data?.appendices ?? []).map((a) => [
              a.appendixCode,
              formatLiveDate(a.newEndAt),
              a.terms,
              workflowStatusLabel(a.status),
              <div key="actions" className="flex gap-2">
                {a.status === "PENDING_APPROVAL" &&
                  ["SIGNED", "ACTIVE", "EXTENDED"].includes(contract.status) &&
                  can("rental.contract.approve") && (
                    <LiveAction
                      run={() => api.appendixAction(a.id, "approve")}
                      after={state.reload}
                    >
                      Duyệt
                    </LiveAction>
                  )}
                {a.status === "APPROVED" &&
                  ["SIGNED", "ACTIVE", "EXTENDED"].includes(contract.status) &&
                  can("rental.contract.sign") && (
                    <LiveAction
                      run={() => api.appendixAction(a.id, "sign")}
                      after={state.reload}
                    >
                      Ký phụ lục
                    </LiveAction>
                  )}
                {a.status === "APPROVED" &&
                  ["SIGNED", "ACTIVE", "EXTENDED"].includes(contract.status) &&
                  can("rental.contract.update") && (
                    <LiveAction
                      disabled={!signatureConfirmed}
                      run={() => api.recordSignature(a.id, true)}
                      after={state.reload}
                    >
                      Ghi nhận phụ lục đã ký
                    </LiveAction>
                  )}
              </div>,
            ])}
          />
        </>
      )}
    </LivePage>
  );
}

export function ManagerRentalsLivePage() {
  const workflow = useSalesRentalWorkflow();
  const { user, can } = usePermissions();
  const [branch, setBranch] = useState("ALL");
  const [search, setSearch] = useState("");
  const [reason, setReason] = useState("");
  const [cancelId, setCancelId] = useState<number | null>(null);
  const orders = workflow.orders.filter(
    (o) =>
      (branch === "ALL" || o.branchId === Number(branch)) &&
      o.orderCode.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <LivePage
      title="Quản lý đơn thuê"
      loading={workflow.isLoading}
      error={workflow.error}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          Chi nhánh
          <select
            className={liveInputClass}
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="ALL">Tất cả chi nhánh được gán</option>
            {user?.branchIds.map((id) => (
              <option key={id} value={id}>
                Chi nhánh #{id}
              </option>
            ))}
          </select>
        </label>
        <label>
          Tìm đơn thuê
          <input
            className={liveInputClass}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <LiveTable
        headers={[
          "Đơn thuê",
          "Chi nhánh",
          "Thời gian",
          "Giá trị",
          "Trạng thái",
          "Thao tác",
        ]}
        rows={orders.map((o) => {
          const contract = workflow.contracts.find(
            (c) => c.rentalOrderId === o.id,
          );
          return [
            o.orderCode,
            `#${o.branchId}`,
            `${formatLiveDate(o.startAt)} → ${formatLiveDate(o.endAt)}`,
            formatLiveMoney(o.totalAmount),
            workflowStatusLabel(o.status),
            <div key="actions" className="flex flex-wrap gap-2">
              {o.status === "PENDING" &&
                can("inventory.reservation.create") && (
                  <LiveAction
                    run={() => api.reserveOrder(o.id)}
                    after={workflow.reload}
                  >
                    Giữ chỗ thiết bị
                  </LiveAction>
                )}
              {o.status === "RESERVED" &&
                can("inventory.reservation.confirm") && (
                  <LiveAction
                    run={() => api.confirmOrder(o.id)}
                    after={workflow.reload}
                  >
                    Xác nhận giữ chỗ
                  </LiveAction>
                )}
              {contract && (
                <Link
                  className="text-blue-600"
                  to={`/manager/contracts/${contract.id}`}
                >
                  Hợp đồng / gia hạn
                </Link>
              )}
              {["PENDING", "RESERVED", "CONFIRMED"].includes(o.status) &&
                (!contract ||
                  ["CANCELLED", "REJECTED"].includes(contract.status)) &&
                can("rental.order.cancel") && (
                  <button
                    className="text-red-700"
                    onClick={() => {
                      setCancelId(o.id);
                      setReason("");
                    }}
                  >
                    Hủy đơn
                  </button>
                )}
            </div>,
          ];
        })}
      />
      {cancelId !== null && (
        <div
          role="dialog"
          aria-label="Hủy đơn thuê"
          className="space-y-3 rounded-2xl border bg-white p-5"
        >
          <label>
            Lý do hủy
            <input
              className={liveInputClass}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <LiveAction
            disabled={!reason.trim()}
            run={async () => {
              await api.cancelOrder(cancelId, reason);
              setCancelId(null);
            }}
            after={workflow.reload}
          >
            Xác nhận hủy
          </LiveAction>
          <button className="ml-3" onClick={() => setCancelId(null)}>
            Đóng
          </button>
        </div>
      )}
    </LivePage>
  );
}
