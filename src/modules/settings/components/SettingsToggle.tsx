interface SettingsToggleProps {
  checked: boolean;
  label: string;
  description: string;
  disabled?: boolean;
  onChange: (
    checked: boolean,
  ) => void;
}

export const SettingsToggle = ({
  checked,
  label,
  description,
  disabled = false,
  onChange,
}: SettingsToggleProps) => {
  return (
    <div className="flex items-start justify-between gap-5 rounded-xl border border-slate-200 bg-white px-4 py-4">
      <div>
        <p className="text-sm font-semibold text-slate-800">
          {label}
        </p>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() =>
          onChange(!checked)
        }
        className={[
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition",
          checked
            ? "bg-blue-600"
            : "bg-slate-300",
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer",
        ].join(" ")}
      >
        <span
          className={[
            "absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked
              ? "translate-x-5"
              : "translate-x-0",
          ].join(" ")}
        />
      </button>
    </div>
  );
};
