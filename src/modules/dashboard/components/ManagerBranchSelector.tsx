import type {
  ManagerBranchAccess,
  ManagerScopeId,
} from "@/modules/manager-context/types/manager-context.types";

interface ManagerBranchSelectorProps {
  branches: ManagerBranchAccess[];
  selectedScopeId: ManagerScopeId;
  disabled?: boolean;
  onChange: (
    scopeId: ManagerScopeId,
  ) => void;
}

export const ManagerBranchSelector = ({
  branches,
  selectedScopeId,
  disabled = false,
  onChange,
}: ManagerBranchSelectorProps) => {
  return (
    <label className="block w-full text-sm font-semibold text-slate-700 sm:w-80">
      <span className="block">
        Chi nhánh đang xem
      </span>

      <select
        value={selectedScopeId}
        disabled={disabled}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        className="mt-2 block h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
      >
        <option value="ALL">
          Tất cả chi nhánh được phân công
        </option>

        {branches.map((branch) => (
          <option
            key={branch.id}
            value={branch.id}
          >
            {branch.name} — {branch.code}
          </option>
        ))}
      </select>

      <span className="mt-1 block text-xs font-normal text-slate-400">
        {branches.length} chi nhánh đang hoạt động
      </span>
    </label>
  );
};
