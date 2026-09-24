import {
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";

interface AuthBrandProps {
  compact?: boolean;
}

export const AuthBrand = ({
  compact = false,
}: AuthBrandProps) => {
  return (
    <Link
      to="/login"
      className="group inline-flex items-center gap-3"
    >
      <span
        className={[
          "relative flex shrink-0 items-center justify-center overflow-hidden",
          "rounded-[14px] bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700",
          "font-black text-white shadow-[0_10px_24px_rgba(37,99,235,0.28)]",
          "transition duration-300 group-hover:-translate-y-0.5 group-hover:rotate-2",
          compact
            ? "size-10 text-xl"
            : "size-12 text-2xl",
        ].join(" ")}
      >
        <span className="absolute -right-3 -top-4 size-8 rounded-full bg-white/30 blur-md" />
        <span className="relative">R</span>
      </span>

      <span>
        <span
          className={[
            "flex items-center gap-2 font-extrabold tracking-tight text-slate-900",
            compact
              ? "text-lg"
              : "text-xl",
          ].join(" ")}
        >
          Rent<span className="text-blue-600">AI</span> Manager

          <Sparkles
            size={15}
            className="text-amber-500 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
          />
        </span>

        <span className="mt-0.5 block text-[11px] font-medium tracking-wide text-slate-400">
          NỀN TẢNG QUẢN LÝ THIẾT BỊ SỰ KIỆN
        </span>
      </span>
    </Link>
  );
};
