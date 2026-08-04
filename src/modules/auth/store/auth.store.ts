import { create } from "zustand";

import { authApi } from "@/modules/auth/api/auth.api";
import { authStorage } from "@/modules/auth/api/auth.storage";

import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
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

  logout: () => Promise<void>;
}

const savedSession =
  authStorage.getSession();

export const useAuthStore =
  create<AuthState>((set) => ({
    user:
      savedSession?.user ?? null,

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
        await authApi.login(payload);

      set({
        user: session.user,
        accessToken:
          session.accessToken,
        isAuthenticated: true,
      });
    },

    registerAccount: async (
      payload,
    ): Promise<void> => {
      await authApi.register(
        payload,
      );
    },

    logout: async (): Promise<void> => {
      set({
        isLoggingOut: true,
      });

      try {
        await authApi.logout();
      } finally {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoggingOut: false,
        });
      }
    },
  }));
