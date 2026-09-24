import {
    create,
} from "zustand";

import {
    storageKeys,
} from "@/core/storage/storageKeys";

import {
    defaultNotifications,
} from "@/modules/notifications/mocks/notifications.mock";

import type {
    UserRole,
} from "@/modules/auth";

interface ReadState {
    [userId: string]:
        | Record<string, boolean>
        | undefined;
}

interface NotificationState {
    readState: ReadState;

    markAsRead: (
        userId: string,
        notificationId: string,
    ) => void;

    markAllAsRead: (
        userId: string,
        role: UserRole,
    ) => void;
}

const loadReadState = (): ReadState => {
    const rawValue =
        localStorage.getItem(
            storageKeys.notificationReadState,
        );

    if (!rawValue) {
        return {};
    }

    try {
        const parsed =
            JSON.parse(rawValue);

        if (
            typeof parsed === "object" &&
            parsed !== null
        ) {
            return parsed as ReadState;
        }
    } catch {
        return {};
    }

    return {};
};

const saveReadState = (
    state: ReadState,
): void => {
    localStorage.setItem(
        storageKeys.notificationReadState,
        JSON.stringify(state),
    );
};

export const useNotificationStore =
    create<NotificationState>(
        (set) => ({
            readState:
                loadReadState(),

            markAsRead: (
                userId,
                notificationId,
            ): void => {
                set((state) => {
                    const nextState: ReadState = {
                        ...state.readState,

                        [userId]: {
                            ...state.readState[
                                userId
                                ],

                            [notificationId]:
                                true,
                        },
                    };

                    saveReadState(
                        nextState,
                    );

                    return {
                        readState:
                        nextState,
                    };
                });
            },

            markAllAsRead: (
                userId,
                role,
            ): void => {
                set((state) => {
                    const userState = {
                        ...state.readState[
                            userId
                            ],
                    };

                    defaultNotifications
                        .filter(
                            (notification) =>
                                notification.role ===
                                role,
                        )
                        .forEach(
                            (notification) => {
                                userState[
                                    notification.id
                                    ] = true;
                            },
                        );

                    const nextState: ReadState = {
                        ...state.readState,
                        [userId]:
                        userState,
                    };

                    saveReadState(
                        nextState,
                    );

                    return {
                        readState:
                        nextState,
                    };
                });
            },
        }),
    );

export const getNotificationReadStatus = (
    userId: string,
    notificationId: string,
    defaultRead: boolean,
    readState: ReadState,
): boolean => {
    return (
        readState[userId]?.[
            notificationId
            ] ??
        defaultRead
    );
};