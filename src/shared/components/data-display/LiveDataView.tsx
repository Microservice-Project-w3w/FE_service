import { type ReactNode, useState } from "react";
import { liveButtonClass } from "@/shared/utils/liveFormat";
export function LivePage({
  title,
  loading,
  error,
  children,
}: {
  title: string;
  loading?: boolean;
  error?: string | null;
  children?: ReactNode;
}) {
  return (
    <section className="space-y-5">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {loading && <p role="status">Đang tải dữ liệu…</p>}
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
        >
          {error}
        </p>
      )}
      {!loading && !error && children}
    </section>
  );
}
export function LiveFields({ fields }: { fields: [string, ReactNode][] }) {
  return (
    <dl className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
      {fields.map(([label, value]) => (
        <div key={label}>
          <dt className="text-sm text-slate-500">{label}</dt>
          <dd className="mt-1 break-words font-medium text-slate-900">
            {value ?? "Chưa có thông tin"}
          </dd>
        </div>
      ))}
    </dl>
  );
}
export function LiveTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header) => (
              <th key={header} className="p-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-100">
              {row.map((cell, j) => (
                <td key={j} className="p-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!rows.length && <p className="p-5 text-slate-500">Chưa có dữ liệu.</p>}
    </div>
  );
}
export function LiveAction({
  children,
  run,
  after,
  disabled,
}: {
  children: ReactNode;
  run: () => Promise<unknown>;
  after?: () => Promise<unknown>;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  return (
    <span className="inline-flex flex-col gap-1">
      <button
        type="button"
        className={liveButtonClass}
        disabled={disabled || busy}
        onClick={async () => {
          setBusy(true);
          setError(null);
          setDone(false);
          try {
            await run();
            setDone(true);
            await after?.();
          } catch (e) {
            setError(e instanceof Error ? e.message : "Thao tác thất bại.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Đang xử lý…" : children}
      </button>
      {error && (
        <span role="alert" className="text-xs text-red-700">
          {error}
        </span>
      )}
      {done && (
        <span role="status" className="text-xs text-green-700">
          Đã lưu trên hệ thống.
        </span>
      )}
    </span>
  );
}
