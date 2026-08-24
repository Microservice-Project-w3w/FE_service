import {
    Bell,
    CheckCheck,
    ChevronRight,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router";

import {
    useAuthStore,
} from "@/modules/auth";

import {
    NotificationItem,
} from "./NotificationItem";

import {
    defaultNotifications,
} from "@/modules/notifications/mocks/notifications.mock";

import {
    getNotificationReadStatus,
    useNotificationStore,
} from "@/modules/notifications/store/notification.store";

export const NotificationDropdown = () => {
    const navigate =
        useNavigate();

    const containerRef =
        useRef<HTMLDivElement>(
            null,
        );

    const [
        open,
        setOpen,
    ] = useState(false);

    const user = useAuthStore(
        (state) => state.user,
    );

    const readState =
        useNotificationStore(
            (state) =>
                state.readState,
        );

    const markAsRead =
        useNotificationStore(
            (state) =>
                state.markAsRead,
        );

    const markAllAsRead =
        useNotificationStore(
            (state) =>
                state.markAllAsRead,
        );

    const notifications =
        useMemo(() => {
            if (!user) {
                return [];
            }

            return defaultNotifications
                .filter(
                    (notification) =>
                        notification.role ===
                        user.role,
                )
                .sort((a, b) => {
                    return (
                        new Date(
                            b.createdAt,
                        ).getTime() -
                        new Date(
                            a.createdAt,
                        ).getTime()
                    );
                });
        }, [user]);

    const unreadCount =
        useMemo(() => {
            if (!user) {
                return 0;
            }

            return notifications.filter(
                (notification) => {
                    return !getNotificationReadStatus(
                        user.id,
                        notification.id,
                        notification.isRead,
                        readState,
                    );
                },
            ).length;
        }, [
            notifications,
            readState,
            user,
        ]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleMouseDown = (
            event: MouseEvent,
        ): void => {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node,
                )
            ) {
                setOpen(false);
            }
        };

        const handleKeyDown = (
            event: KeyboardEvent,
        ): void => {
            if (
                event.key === "Escape"
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleMouseDown,
        );

        window.addEventListener(
            "keydown",
            handleKeyDown,
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleMouseDown,
            );

            window.removeEventListener(
                "keydown",
                handleKeyDown,
            );
        };
    }, [open]);

    const handleNotificationClick = (
        notificationId: string,
        actionPath?: string,
    ): void => {
        if (!user) {
            return;
        }

        markAsRead(
            user.id,
            notificationId,
        );

        setOpen(false);

        if (actionPath) {
            navigate(actionPath);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative"
        >
            <button
                type="button"
                aria-label="Thông báo"
                aria-expanded={open}
                onClick={() =>
                    setOpen(
                        (current) =>
                            !current,
                    )
                }
                className={[
                    "group relative flex size-11 items-center justify-center rounded-2xl border transition",
                    open
                        ? "border-blue-200 bg-blue-50 text-blue-600"
                        : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50",
                ].join(" ")}
            >
                <Bell
                    size={20}
                    className="transition group-hover:rotate-6"
                />

                {unreadCount > 0 ? (
                    <span className="absolute right-1.5 top-1 flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-4 text-white">
            {unreadCount > 9
                ? "9+"
                : unreadCount}
          </span>
                ) : null}
            </button>

            {open ? (
                <div className="absolute right-0 top-[calc(100%+12px)] z-50 w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
                    <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3.5">
                        <div>
                            <h2 className="text-sm font-bold text-slate-950">
                                Thông báo
                            </h2>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                                {unreadCount} thông báo chưa đọc
                            </p>
                        </div>

                        {user &&
                        unreadCount > 0 ? (
                            <button
                                type="button"
                                onClick={() =>
                                    markAllAsRead(
                                        user.id,
                                        user.role,
                                    )
                                }
                                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:text-blue-700"
                            >
                                <CheckCheck
                                    size={14}
                                />
                                Đọc tất cả
                            </button>
                        ) : null}
                    </header>

                    <div className="max-h-[380px] overflow-y-auto">
                        {notifications.length >
                        0 ? (
                            notifications
                                .slice(0, 5)
                                .map(
                                    (
                                        notification,
                                    ) => {
                                        const isRead =
                                            user
                                                ? getNotificationReadStatus(
                                                    user.id,
                                                    notification.id,
                                                    notification.isRead,
                                                    readState,
                                                )
                                                : true;

                                        return (
                                            <NotificationItem
                                                key={
                                                    notification.id
                                                }
                                                notification={
                                                    notification
                                                }
                                                isRead={
                                                    isRead
                                                }
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification.id,
                                                        notification.actionPath,
                                                    )
                                                }
                                            />
                                        );
                                    },
                                )
                        ) : (
                            <div className="px-5 py-10 text-center">
                                <Bell
                                    size={28}
                                    className="mx-auto text-slate-300"
                                />

                                <p className="mt-3 text-xs font-semibold text-slate-600">
                                    Chưa có thông báo
                                </p>
                            </div>
                        )}
                    </div>

                    <footer className="border-t border-slate-100 bg-slate-50/50 p-2.5">
                        <button
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                navigate(
                                    "/notifications",
                                );
                            }}
                            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-blue-600 transition hover:bg-blue-50"
                        >
                            Xem tất cả thông báo
                            <ChevronRight
                                size={14}
                            />
                        </button>
                    </footer>
                </div>
            ) : null}
        </div>
    );
};