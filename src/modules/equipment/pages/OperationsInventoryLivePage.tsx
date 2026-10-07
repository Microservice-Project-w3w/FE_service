import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import {
  operationsInventoryApi as api,
  type InventoryDocumentKind,
  type InventoryEquipment,
  type InventoryWarehouse,
} from "@/modules/equipment/api/operations-inventory.api";
import { useLiveData } from "@/shared/hooks/useLiveData";
import {
  LiveAction,
  LivePage,
  LiveTable,
} from "@/shared/components/data-display/LiveDataView";
import { liveInputClass, liveButtonClass } from "@/shared/utils/liveFormat";

const tabs = [
  "equipment",
  "warehouses",
  "stock-in",
  "stock-out",
  "transfers",
  "stock-audits",
] as const;
type Tab = (typeof tabs)[number];
const tabLabels: Record<Tab, string> = {
  equipment: "Thiết bị",
  warehouses: "Kho",
  "stock-in": "Nhập kho",
  "stock-out": "Xuất kho",
  transfers: "Chuyển kho",
  "stock-audits": "Kiểm kê",
};
const statuses = [
  "AVAILABLE",
  "RESERVED",
  "CHECKED_OUT",
  "IN_TRANSIT",
  "INSPECTION",
  "MAINTENANCE",
  "LOST",
  "DAMAGED",
  "RETIRED",
];
const documentPermissions = {
  "stock-in": "inventory.stock.in",
  "stock-out": "inventory.stock.out",
  transfers: "inventory.stock.transfer",
  "stock-audits": "inventory.stock.audit",
};

export function OperationsInventoryLivePage() {
  const user = useAuthStore((s) => s.user);
  const organizationId = user?.organizationId;
  const [branch, setBranch] = useState(String(user?.branchIds[0] ?? ""));
  const [tab, setTab] = useState<Tab>("equipment");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [editingEquipment, setEditingEquipment] =
    useState<InventoryEquipment | null>(null);
  const [equipmentForm, setEquipmentForm] = useState(false);
  const [editingWarehouse, setEditingWarehouse] =
    useState<InventoryWarehouse | null>(null);
  const [warehouseForm, setWarehouseForm] = useState(false);
  const can = (permission: string) =>
    user?.permissions.includes(permission) ?? false;
  const loader = useCallback(async () => {
    if (!organizationId || !branch)
      throw new Error("Tài khoản cần được gán organization và chi nhánh.");
    const [equipment, warehouses, models, documents] = await Promise.all([
      api.loadEquipment(organizationId, Number(branch)),
      api.loadWarehouses(organizationId),
      api.loadModels(organizationId),
      tab === "equipment" || tab === "warehouses"
        ? Promise.resolve([])
        : api.documents(tab, organizationId, Number(branch)),
    ]);
    return { equipment, warehouses, models, documents };
  }, [organizationId, branch, tab]);
  const state = useLiveData(loader);
  const data = state.data;
  useEffect(() => {
    setSelected([]);
    setEquipmentForm(false);
    setWarehouseForm(false);
  }, [branch, tab]);
  return (
    <LivePage
      title="Thiết bị và kho"
      loading={state.isLoading}
      error={state.error}
    >
      <div className="flex flex-wrap gap-3">
        <label>
          Chi nhánh
          <select
            className={liveInputClass}
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            {user?.branchIds.map((id) => (
              <option key={id} value={id}>
                Chi nhánh #{id}
              </option>
            ))}
          </select>
        </label>
        {tabs
          .filter(
            (t) =>
              t === "equipment" ||
              t === "warehouses" ||
              can(documentPermissions[t]),
          )
          .map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tab === t}
              onClick={() => setTab(t)}
              className={
                tab === t
                  ? liveButtonClass
                  : "rounded-xl border px-4 py-2 text-sm"
              }
            >
              {tabLabels[t]}
            </button>
          ))}
      </div>
      {data && organizationId && (
        <>
          {tab === "equipment" && (
            <>
              <div className="flex gap-3">
                <input
                  aria-label="Tìm thiết bị"
                  className={liveInputClass}
                  value={search}
                  placeholder="Mã tài sản hoặc serial"
                  onChange={(e) => setSearch(e.target.value)}
                />
                {can("inventory.equipment.create") && (
                  <button
                    className={liveButtonClass}
                    onClick={() => {
                      setEditingEquipment(null);
                      setEquipmentForm(true);
                    }}
                  >
                    Thêm thiết bị
                  </button>
                )}
              </div>
              <LiveTable
                headers={[
                  "Mã tài sản",
                  "Model",
                  "Kho",
                  "Serial",
                  "Trạng thái",
                  "Thao tác",
                ]}
                rows={data.equipment
                  .filter((e) =>
                    `${e.assetCode} ${e.serialNumber ?? ""}`
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                  )
                  .map((equipment) => [
                    equipment.assetCode,
                    data.models.find((m) => m.id === equipment.modelId)?.name ??
                      `#${equipment.modelId}`,
                    data.warehouses.find((w) => w.id === equipment.warehouseId)
                      ?.name ?? "Chưa nhập kho",
                    equipment.serialNumber ?? "—",
                    equipment.status,
                    <div key="actions" className="flex flex-wrap gap-2">
                      {can("inventory.equipment.update") && (
                        <button
                          className="text-blue-600"
                          onClick={() => {
                            setEditingEquipment(equipment);
                            setEquipmentForm(true);
                          }}
                        >
                          Sửa
                        </button>
                      )}
                      {can("inventory.equipment.change-status") && (
                        <select
                          aria-label={`Trạng thái ${equipment.assetCode}`}
                          className={liveInputClass}
                          value={equipment.status}
                          onChange={async (e) => {
                            const status = e.target.value;
                            setStatusError(null);
                            try {
                              await api.changeStatus(
                                equipment.id,
                                organizationId,
                                status,
                              );
                              await state.reload();
                            } catch (reason) {
                              setStatusError(
                                reason instanceof Error
                                  ? reason.message
                                  : "Không thể đổi trạng thái.",
                              );
                            }
                          }}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>,
                  ])}
              />
              {statusError && (
                <p role="alert" className="text-red-700">
                  {statusError}
                </p>
              )}
              {equipmentForm && (
                <InventoryForm
                  title={editingEquipment ? "Sửa thiết bị" : "Thêm thiết bị"}
                  close={() => setEquipmentForm(false)}
                  submit={async (form) => {
                    await api.saveEquipment(
                      {
                        ...editingEquipment,
                        organizationId,
                        branchId: Number(branch),
                        modelId: Number(form.get("modelId")),
                        warehouseId: form.get("warehouseId")
                          ? Number(form.get("warehouseId"))
                          : null,
                        assetCode: String(form.get("assetCode")),
                        serialNumber:
                          String(form.get("serialNumber") || "") || null,
                        conditionStatus: String(form.get("conditionStatus")),
                        note: String(form.get("note") || "") || null,
                      },
                      editingEquipment?.id,
                    );
                    setEquipmentForm(false);
                    await state.reload();
                  }}
                >
                  <label>
                    Mã tài sản
                    <input
                      name="assetCode"
                      required
                      className={liveInputClass}
                      defaultValue={editingEquipment?.assetCode ?? ""}
                    />
                  </label>
                  <label>
                    Model
                    <select
                      name="modelId"
                      required
                      className={liveInputClass}
                      defaultValue={editingEquipment?.modelId ?? ""}
                    >
                      <option value="">Chọn model</option>
                      {data.models.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} ({m.code})
                        </option>
                      ))}
                    </select>
                  </label>
                  <WarehouseSelect
                    warehouses={data.warehouses.filter(
                      (w) => w.branchId === Number(branch) && w.active,
                    )}
                    name="warehouseId"
                    value={editingEquipment?.warehouseId ?? ""}
                    optional
                  />
                  <label>
                    Serial
                    <input
                      name="serialNumber"
                      className={liveInputClass}
                      defaultValue={editingEquipment?.serialNumber ?? ""}
                    />
                  </label>
                  <label>
                    Tình trạng
                    <select
                      name="conditionStatus"
                      className={liveInputClass}
                      defaultValue={editingEquipment?.conditionStatus ?? "GOOD"}
                    >
                      {["NEW", "GOOD", "FAIR", "POOR", "DAMAGED"].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Ghi chú
                    <textarea
                      name="note"
                      className={liveInputClass}
                      defaultValue={editingEquipment?.note ?? ""}
                    />
                  </label>
                </InventoryForm>
              )}
            </>
          )}
          {tab === "warehouses" && (
            <>
              {can("inventory.warehouse.manage") && (
                <button
                  className={liveButtonClass}
                  onClick={() => {
                    setEditingWarehouse(null);
                    setWarehouseForm(true);
                  }}
                >
                  Thêm kho
                </button>
              )}
              <LiveTable
                headers={[
                  "Mã kho",
                  "Tên kho",
                  "Địa chỉ",
                  "Trạng thái",
                  "Thao tác",
                ]}
                rows={data.warehouses
                  .filter((w) => w.branchId === Number(branch))
                  .map((w) => [
                    w.code,
                    w.name,
                    w.address,
                    w.active ? "Hoạt động" : "Ngừng hoạt động",
                    can("inventory.warehouse.manage") && (
                      <div key="actions" className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditingWarehouse(w);
                            setWarehouseForm(true);
                          }}
                        >
                          Sửa
                        </button>
                        <LiveAction
                          run={() => api.setWarehouseActive(w.id, !w.active)}
                          after={state.reload}
                        >
                          {w.active ? "Ngừng hoạt động" : "Mở lại"}
                        </LiveAction>
                      </div>
                    ),
                  ])}
              />
              {warehouseForm && (
                <InventoryForm
                  title={editingWarehouse ? "Sửa kho" : "Thêm kho"}
                  close={() => setWarehouseForm(false)}
                  submit={async (form) => {
                    await api.saveWarehouse(
                      {
                        organizationId,
                        branchId: Number(branch),
                        code: String(form.get("code")),
                        name: String(form.get("name")),
                        address: String(form.get("address")),
                      },
                      editingWarehouse?.id,
                    );
                    setWarehouseForm(false);
                    await state.reload();
                  }}
                >
                  <label>
                    Mã kho
                    <input
                      required
                      name="code"
                      className={liveInputClass}
                      defaultValue={editingWarehouse?.code ?? ""}
                    />
                  </label>
                  <label>
                    Tên kho
                    <input
                      required
                      name="name"
                      className={liveInputClass}
                      defaultValue={editingWarehouse?.name ?? ""}
                    />
                  </label>
                  <label>
                    Địa chỉ
                    <input
                      name="address"
                      className={liveInputClass}
                      defaultValue={editingWarehouse?.address ?? ""}
                    />
                  </label>
                </InventoryForm>
              )}
            </>
          )}
          {tab !== "equipment" && tab !== "warehouses" && (
            <>
              <InventoryForm
                key={tab}
                title={`Tạo phiếu ${tabLabels[tab].toLowerCase()}`}
                submit={async (form) => {
                  if (tab !== "stock-audits" && !selected.length)
                    throw new Error("Cần chọn ít nhất một thiết bị.");
                  const warehouseId = Number(form.get("warehouseId"));
                  const code = String(form.get("code"));
                  const common = {
                    organizationId,
                    branchId: Number(branch),
                    warehouseId,
                    note: String(form.get("note")),
                    createdBy: Number(user?.id),
                  };
                  const body =
                    tab === "transfers"
                      ? {
                          organizationId,
                          sourceWarehouseId: warehouseId,
                          destinationWarehouseId: Number(
                            form.get("destinationWarehouseId"),
                          ),
                          transferCode: code,
                          createdBy: Number(user?.id),
                          note: common.note,
                          items: selected.map((equipmentId) => ({
                            equipmentId,
                          })),
                        }
                      : {
                          ...common,
                          [tab === "stock-in"
                            ? "stockInCode"
                            : tab === "stock-out"
                              ? "stockOutCode"
                              : "auditCode"]: code,
                          items: selected.map((equipmentId) => ({
                            equipmentId,
                          })),
                        };
                  await api.createDocument(tab, body);
                  setSelected([]);
                  await state.reload();
                }}
              >
                <label>
                  Mã phiếu
                  <input name="code" required className={liveInputClass} />
                </label>
                <WarehouseSelect
                  warehouses={data.warehouses.filter(
                    (w) => w.branchId === Number(branch) && w.active,
                  )}
                  name="warehouseId"
                />
                {tab === "transfers" && (
                  <WarehouseSelect
                    label="Kho nhận"
                    warehouses={data.warehouses.filter((w) => w.active)}
                    name="destinationWarehouseId"
                  />
                )}
                <label>
                  Ghi chú
                  <input name="note" className={liveInputClass} />
                </label>
                {tab !== "stock-audits" && (
                  <fieldset className="max-h-60 overflow-auto">
                    <legend>Thiết bị thuộc chi nhánh đang chọn</legend>
                    {data.equipment.map((e) => (
                      <label key={e.id} className="block">
                        <input
                          type="checkbox"
                          checked={selected.includes(e.id)}
                          onChange={(event) =>
                            setSelected((ids) =>
                              event.target.checked
                                ? [...ids, e.id]
                                : ids.filter((id) => id !== e.id),
                            )
                          }
                        />{" "}
                        {e.assetCode} — {e.status}
                      </label>
                    ))}
                  </fieldset>
                )}
              </InventoryForm>
              <LiveTable
                headers={["Mã phiếu", "Trạng thái", "Thao tác"]}
                rows={data.documents.map((doc) => [
                  doc.stockInCode ??
                    doc.stockOutCode ??
                    doc.transferCode ??
                    doc.auditCode ??
                    `#${doc.id}`,
                  doc.status,
                  <div key="actions" className="flex flex-wrap gap-2">
                    {(tab === "stock-in" || tab === "stock-out") &&
                      doc.status === "DRAFT" && (
                        <LiveAction
                          run={() =>
                            api.documentAction(tab, doc.id, "confirm", {
                              confirmedBy: Number(user?.id),
                            })
                          }
                          after={state.reload}
                        >
                          Xác nhận
                        </LiveAction>
                      )}
                    {tab === "transfers" && doc.status === "DRAFT" && (
                      <LiveAction
                        run={() =>
                          api.documentAction("transfers", doc.id, "approve", {
                            approvedBy: Number(user?.id),
                          })
                        }
                        after={state.reload}
                      >
                        Duyệt chuyển
                      </LiveAction>
                    )}
                    {tab === "transfers" && doc.status === "APPROVED" && (
                      <LiveAction
                        run={() =>
                          api.documentAction("transfers", doc.id, "dispatch")
                        }
                        after={state.reload}
                      >
                        Xuất chuyển
                      </LiveAction>
                    )}
                    {tab === "transfers" && doc.status === "IN_TRANSIT" && (
                      <LiveAction
                        run={() =>
                          api.documentAction("transfers", doc.id, "receive", {
                            receivedBy: Number(user?.id),
                          })
                        }
                        after={state.reload}
                      >
                        Nhận chuyển
                      </LiveAction>
                    )}
                    {tab === "stock-audits" && doc.status === "DRAFT" && (
                      <LiveAction
                        run={() =>
                          api.documentAction("stock-audits", doc.id, "start", {
                            startedBy: Number(user?.id),
                          })
                        }
                        after={state.reload}
                      >
                        Bắt đầu kiểm kê
                      </LiveAction>
                    )}
                    {tab === "stock-audits" && doc.status === "IN_PROGRESS" && (
                      <>
                        <LiveAction
                          run={() =>
                            api.documentAction(
                              "stock-audits",
                              doc.id,
                              "complete",
                              { completedBy: Number(user?.id) },
                            )
                          }
                          after={state.reload}
                        >
                          Hoàn tất kiểm kê
                        </LiveAction>
                        <p className="text-xs">
                          Ghi kết quả từng thiết bị bên dưới trước khi hoàn tất.
                        </p>
                      </>
                    )}
                    {["DRAFT", "APPROVED"].includes(doc.status) && (
                      <LiveAction
                        run={() =>
                          api.documentAction(
                            tab as InventoryDocumentKind,
                            doc.id,
                            "cancel",
                          )
                        }
                        after={state.reload}
                      >
                        Hủy phiếu
                      </LiveAction>
                    )}
                  </div>,
                ])}
              />
              {tab === "stock-audits" &&
                data.documents
                  .filter((d) => d.status === "IN_PROGRESS")
                  .map((audit) => (
                    <div
                      key={audit.id}
                      className="space-y-3 rounded-2xl border bg-white p-5"
                    >
                      <h2 className="font-semibold">
                        Kết quả {audit.auditCode}
                      </h2>
                      {audit.items.map((item) => (
                        <AuditItemForm
                          key={item.equipmentId}
                          equipmentName={
                            data.equipment.find(
                              (e) => e.id === item.equipmentId,
                            )?.assetCode ?? `#${item.equipmentId}`
                          }
                          current={item.result}
                          warehouses={data.warehouses.filter((w) => w.active)}
                          save={async (result, actualWarehouseId) => {
                            await api.documentAction(
                              "stock-audits",
                              audit.id,
                              "items",
                              {
                                equipmentId: item.equipmentId,
                                result,
                                actualWarehouseId:
                                  result === "FOUND"
                                    ? audit.warehouseId
                                    : actualWarehouseId,
                                checkedBy: Number(user?.id),
                              },
                            );
                            await state.reload();
                          }}
                        />
                      ))}
                    </div>
                  ))}
            </>
          )}
        </>
      )}
    </LivePage>
  );
}

function InventoryForm({
  title,
  children,
  submit,
  close,
}: {
  title: string;
  children: ReactNode;
  submit: (form: FormData) => Promise<void>;
  close?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await submit(form);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Không thể lưu.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <form
      onSubmit={handle}
      className="grid gap-3 rounded-2xl border bg-white p-5 sm:grid-cols-2"
    >
      <h2 className="font-semibold sm:col-span-2">{title}</h2>
      {children}
      {error && (
        <p role="alert" className="text-red-700 sm:col-span-2">
          {error}
        </p>
      )}
      <div className="space-x-3 sm:col-span-2">
        <button className={liveButtonClass} disabled={busy}>
          {busy ? "Đang lưu…" : "Lưu"}
        </button>
        {close && (
          <button type="button" onClick={close} disabled={busy}>
            Đóng
          </button>
        )}
      </div>
    </form>
  );
}
function WarehouseSelect({
  warehouses,
  name,
  label = "Kho",
  value = "",
  optional = false,
}: {
  warehouses: InventoryWarehouse[];
  name: string;
  label?: string;
  value?: string | number;
  optional?: boolean;
}) {
  return (
    <label>
      {label}
      <select
        name={name}
        className={liveInputClass}
        required={!optional}
        defaultValue={value}
      >
        <option value="">{optional ? "Chưa nhập kho" : "Chọn kho"}</option>
        {warehouses.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name} (chi nhánh #{w.branchId})
          </option>
        ))}
      </select>
    </label>
  );
}
function AuditItemForm({
  equipmentName,
  current,
  warehouses,
  save,
}: {
  equipmentName: string;
  current: string | null;
  warehouses: InventoryWarehouse[];
  save: (result: string, actualWarehouseId: number | null) => Promise<void>;
}) {
  const [result, setResult] = useState(current ?? "FOUND");
  const [actualWarehouse, setActualWarehouse] = useState("");
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span>{equipmentName}</span>
      <select
        aria-label={`Kết quả ${equipmentName}`}
        className={liveInputClass}
        value={result}
        onChange={(e) => setResult(e.target.value)}
      >
        {["FOUND", "MISSING", "DAMAGED", "WRONG_LOCATION"].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {result === "WRONG_LOCATION" && (
        <select
          aria-label={`Kho thực tế ${equipmentName}`}
          className={liveInputClass}
          value={actualWarehouse}
          onChange={(e) => setActualWarehouse(e.target.value)}
        >
          <option value="">Chọn kho thực tế</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      )}
      <LiveAction
        run={() => {
          if (result === "WRONG_LOCATION" && !actualWarehouse)
            throw new Error("Cần chọn kho thực tế khi thiết bị sai vị trí.");
          return save(
            result,
            result === "WRONG_LOCATION" ? Number(actualWarehouse) : null,
          );
        }}
      >
        Lưu kết quả
      </LiveAction>
    </div>
  );
}
