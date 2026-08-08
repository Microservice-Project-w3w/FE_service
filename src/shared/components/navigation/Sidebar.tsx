import {
    PackageOpen,
    X,
} from "lucide-react";
import {
    NavLink,
} from "react-router";

import type {
    RoleNavigationGroup,
} from "@/shared/constants/roleNavigation";

interface SidebarProps {
    groups: RoleNavigationGroup[];
    homePath: string;
    open: boolean;
    onClose: () => void;
}

export const Sidebar = ({
                            groups,
                            homePath,
                            open,
                            onClose,
                        }: SidebarProps) => {
    return (
        <>
            {open && (
                <button
                    type="button"
                    aria-label="Đóng thanh điều hướng"
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px] lg:hidden"
                />
            )}

            <aside
                className={[
                    "fixed inset-y-0 left-0 z-50 flex w-72 flex-col",
                    "border-r border-gray-200 bg-white",
                    "transition-transform duration-200 lg:translate-x-0",
                    open
                        ? "translate-x-0"
                        : "-translate-x-full",
                ].join(" ")}
            >
                <header className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
                    <NavLink
                        to={homePath}
                        onClick={onClose}
                        className="flex min-w-0 items-center gap-3"
                    >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <PackageOpen
                                size={21}
                                aria-hidden="true"
                            />
                        </span>

                        <span className="min-w-0">
                            <strong className="block truncate text-sm text-gray-950">
                                RentAI Manager
                            </strong>

                            <span className="block truncate text-xs text-gray-500">
                                Quản lý thiết bị cho thuê
                            </span>
                        </span>
                    </NavLink>

                    <button
                        type="button"
                        aria-label="Đóng thanh điều hướng"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 lg:hidden"
                    >
                        <X
                            size={20}
                            aria-hidden="true"
                        />
                    </button>
                </header>

                <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
                    {groups.map((group) => (
                        <section key={group.label}>
                            <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                                {group.label}
                            </h2>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            onClick={onClose}
                                            className={({
                                                            isActive,
                                                        }) =>
                                                [
                                                    "flex items-center gap-3 rounded-xl px-3 py-2.5",
                                                    "text-sm font-medium transition-colors",
                                                    isActive
                                                        ? "bg-blue-600 text-white shadow-sm"
                                                        : "text-gray-900 hover:bg-gray-100",
                                                ].join(" ")
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <Icon
                                                        size={19}
                                                        aria-hidden="true"
                                                        className={
                                                            isActive
                                                                ? "text-white"
                                                                : "text-gray-900"
                                                        }
                                                    />

                                                    <span
                                                        className={
                                                            isActive
                                                                ? "text-white"
                                                                : "text-gray-900"
                                                        }
                                                    >
                                                        {item.label}
                                                    </span>
                                                </>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </nav>

                <footer className="border-t border-gray-200 p-4">
                    <div className="rounded-xl bg-blue-50 p-3">
                        <p className="text-sm font-semibold text-blue-900">
                            RentAI Manager
                        </p>

                        <p className="mt-1 text-xs leading-5 text-blue-700">
                            Hệ thống quản lý cho thuê thiết bị.
                        </p>
                    </div>
                </footer>
            </aside>
        </>
    );
};