import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import { AccountMenu } from "@/app/components/header/AccountMenu";

interface AppHeaderProps {
  onOpenSidebar: () => void;
}

export const AppHeader = ({
  onOpenSidebar,
}: AppHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b border-slate-200/80 bg-white/90 px-4 shadow-[0_1px_12px_rgba(15,23,42,0.03)] backdrop-blur-xl sm:px-6">
      <button
        type="button"
        aria-label="Mở thanh điều hướng"
        onClick={onOpenSidebar}
        className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 lg:hidden"
      >
        <Menu size={21} />
      </button>

      <div className="relative hidden w-full max-w-lg md:block">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          placeholder="Tìm thiết bị, khách hàng, đơn thuê..."
          className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Thông báo"
          className="group relative flex size-11 items-center justify-center rounded-2xl border border-transparent text-slate-600 transition hover:border-slate-200 hover:bg-slate-50"
        >
          <Bell
            size={20}
            className="transition group-hover:rotate-6"
          />

          <span className="absolute right-2.5 top-2.5 size-2.5 rounded-full border-2 border-white bg-red-500" />
        </button>

        <AccountMenu />
      </div>
    </header>
  );
};
