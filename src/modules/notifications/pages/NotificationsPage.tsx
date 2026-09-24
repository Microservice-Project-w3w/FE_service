import {
    Bell,
    CheckCheck,
} from "lucide-react";

import {
    useMemo,
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
} from "@/modules/notifications/components/NotificationItem";

import {
    defaultNotifications,
} from "@/modules/notifications/mocks/notifications.mock";

import {
    getNotificationReadStatus,
    useNotificationStore,
} from "@/modules/notifications/store/notification.store";

type NotificationFilter =
    | "ALL"
    | "UNREAD"
    | "READ";

export const NotificationsPage = () => {
    const navigate =
        useNavigate();

    const [
        filter,
        setFilter,
    ] =
        useState<NotificationFilter>(
            "ALL",
        );

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
                .sort(
                    (a, b) =>
                        new Date(
                            b.createdAt,
                        ).getTime() -
                        new Date(
                            a.createdAt,
                        ).getTime(),
                );
        }, [user]);

    const unreadCount =
        user
            ? notifications.filter(
                (notification) =>
                    !getNotificationReadStatus(
                        user.id,
                        notification.id,
                        notification.isRead,
                        readState,
                    ),
            ).length
            : 0;

    const filteredNotifications =
        notifications.filter(
            (notification) => {
                if (!user) {
                    return false;
                }

                const isRead =
                    getNotificationReadStatus(
                        user.id,
                        notification.id,
                        notification.isRead,
                        readState,
                    );

                if (
                    filter === "UNREAD"
                ) {
                    return !isRead;
                }

                if (
                    filter === "READ"
                ) {
                    return isRead;
                }

                return true;
            },
        );

    if (!user) {
        return null;
    }

    return (
        <main className="space-y-4">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-[26px] font-bold tracking-tight text-slate-950">
                        Thông báo
                    </h1>

                    <p className="mt-1 text-xs text-slate-500">
                        Theo dõi các cập nhật và hoạt động liên quan đến tài khoản của bạn.
                    </p>
                </div>

                {unreadCount > 0 ? (
                    <button
                        type="button"
                        onClick={() =>
                            markAllAsRead(
                                user.id,
                                user.role,
                            )
                        }
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-3 text-xs font-bold text-blue-600 hover:bg-blue-50"
                    >
                        <CheckCheck
                            size={14}
                        />
                        Đánh dấu tất cả đã đọc
                    </button>
                ) : null}
            </header>

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 p-3">
                    <FilterButton
                        active={
                            filter === "ALL"
                        }
                        onClick={() =>
                            setFilter("ALL")
                        }
                    >
                        Tất cả
                    </FilterButton>

                    <FilterButton
                        active={
                            filter ===
                            "UNREAD"
                        }
                        onClick={() =>
                            setFilter(
                                "UNREAD",
                            )
                        }
                    >
                        Chưa đọc ({unreadCount})
                    </FilterButton>

                    <FilterButton
                        active={
                            filter === "READ"
                        }
                        onClick={() =>
                            setFilter("READ")
                        }
                    >
                        Đã đọc
                    </FilterButton>
                </div>

                {filteredNotifications.length >
                0 ? (
                    filteredNotifications.map(
                        (notification) => {
                            const isRead =
                                getNotificationReadStatus(
                                    user.id,
                                    notification.id,
                                    notification.isRead,
                                    readState,
                                );

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
                                    onClick={() => {
                                        markAsRead(
                                            user.id,
                                            notification.id,
                                        );

                                        if (
                                            notification.actionPath
                                        ) {
                                            navigate(
                                                notification.actionPath,
                                            );
                                        }
                                    }}
                                />
                            );
                        },
                    )
                ) : (
                    <div className="px-5 py-16 text-center">
                        <Bell
                            size={34}
                            className="mx-auto text-slate-300"
                        />

                        <h2 className="mt-3 text-sm font-bold text-slate-700">
                            Không có thông báo
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Không có thông báo phù hợp với bộ lọc hiện tại.
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
};

const FilterButton = ({
                          active,
                          onClick,
                          children,
                      }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={
            active
                ? "h-8 rounded-lg bg-blue-600 px-3 text-[11px] font-bold !text-white"
                : "h-8 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
        }
    >
        {children}
    </button>
);