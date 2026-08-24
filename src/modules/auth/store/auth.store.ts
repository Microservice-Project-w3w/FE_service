import {
    create,
} from "zustand";

import {
    authApi,
} from "@/modules/auth/api/auth.api";

import {
    authStorage,
} from "@/modules/auth/api/auth.storage";

import type {
    AuthUser,
    ChangePasswordPayload,
    LoginPayload,
    RegisterPayload,
    UpdateProfilePayload,
} from "@/modules/auth/types/auth.types";

interface AuthState {
    user: AuthUser | null;

    accessToken: string | null;

    isAuthenticated: boolean;

    isLoggingOut: boolean;

    login: (
        payload: LoginPayload,
    ) => Promise<void>;

    registerAccount: (
        payload: RegisterPayload,
    ) => Promise<void>;

    updateProfile: (
        payload: UpdateProfilePayload,
    ) => Promise<void>;

    changePassword: (
        payload: ChangePasswordPayload,
    ) => Promise<void>;

    logout: () => Promise<void>;
}

const savedSession =
    authStorage.getSession();

export const useAuthStore =
    create<AuthState>(
        (set, get) => ({
            user:
                savedSession?.user ??
                null,

            accessToken:
                savedSession?.accessToken ??
                null,

            isAuthenticated:
                Boolean(
                    savedSession?.accessToken,
                ),

            isLoggingOut: false,

            login: async (
                payload,
            ): Promise<void> => {
                const session =
                    await authApi.login(
                        payload,
                    );

                set({
                    user:
                    session.user,

                    accessToken:
                    session.accessToken,

                    isAuthenticated:
                        true,
                });
            },

            registerAccount: async (
                payload,
            ): Promise<void> => {
                await authApi.register(
                    payload,
                );
            },

            updateProfile: async (
                payload,
            ): Promise<void> => {
                const currentUser =
                    get().user;

                if (!currentUser) {
                    throw new Error(
                        "Bạn chưa đăng nhập.",
                    );
                }

                const updatedUser =
                    await authApi.updateProfile(
                        currentUser.id,
                        payload,
                    );

                set({
                    user:
                    updatedUser,
                });
            },

            changePassword: async (
                payload,
            ): Promise<void> => {
                const currentUser =
                    get().user;

                if (!currentUser) {
                    throw new Error(
                        "Bạn chưa đăng nhập.",
                    );
                }

                await authApi.changePassword(
                    currentUser.id,
                    payload,
                );
            },

            logout:
                async (): Promise<void> => {
                    set({
                        isLoggingOut:
                            true,
                    });

                    try {
                        await authApi.logout();
                    } finally {
                        set({
                            user: null,

                            accessToken:
                                null,

                            isAuthenticated:
                                false,

                            isLoggingOut:
                                false,
                        });
                    }
                },
        }),
    );