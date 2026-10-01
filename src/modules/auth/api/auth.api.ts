import { ApiError, apiClient } from "@/core/api";
import {
  assertBackendAuthData, authDataToSession, mergeMeIntoUser,
} from "@/modules/auth/api/auth.api.helpers";
import { authStorage } from "@/modules/auth/api/auth.storage";
import { authenticatedRequest, refreshAuthSession } from "@/modules/auth/api/authenticatedClient";
import type {
  ApiEnvelope, AuthSession, AuthUser, BackendAuthData, BackendMeData,
  ChangePasswordPayload, LoginPayload, RegisterPayload, UpdateProfilePayload,
} from "@/modules/auth/types/auth.types";

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthSession> {
    const response = await apiClient.post<ApiEnvelope<BackendAuthData>>(
      "/api/v1/auth/login",
      { body: { email: payload.identifier.trim(), password: payload.password } },
    );
    let session = authDataToSession(
      assertBackendAuthData(response.data), payload.rememberMe,
    );
    authStorage.saveSession(session);
    try {
      const user = await this.getMe(session.user);
      session = { ...session, user };
      authStorage.saveSession(session);
    } catch (error: unknown) {
      authStorage.clearSession();
      throw error;
    }
    return session;
  },

  async getMe(currentUser: AuthUser): Promise<AuthUser> {
    const response = await authenticatedRequest<ApiEnvelope<BackendMeData>>(
      "GET", "/api/v1/auth/me",
    );
    return mergeMeIntoUser(currentUser, response.data);
  },

  async refresh(): Promise<AuthSession> { return refreshAuthSession(); },

  async register(payload: RegisterPayload): Promise<void> {
    await apiClient.post<ApiEnvelope<unknown>>(
      "/api/v1/auth/register",
      {
        body: {
          fullName: payload.fullName.trim(),
          email: payload.email.trim(),
          password: payload.password,
        },
      },
    );
  },

  async updateProfile(
    _userId: string,
    payload: UpdateProfilePayload,
  ): Promise<AuthUser> {
    const response = await authenticatedRequest<ApiEnvelope<BackendMeData>>(
      "PUT",
      "/api/v1/auth/me",
      { body: payload },
    );
    const session = authStorage.getSession();
    if (!session) {
      throw new ApiError("Authentication session is unavailable", {
        code: "AUTH_SESSION_MISSING",
      });
    }
    const user = mergeMeIntoUser(session.user, response.data);
    authStorage.saveSession({ ...session, user });
    return user;
  },

  async changePassword(
    _userId: string,
    payload: ChangePasswordPayload,
  ): Promise<void> {
    await authenticatedRequest<ApiEnvelope<null>>(
      "PUT", "/api/v1/auth/password", { body: payload },
    );
  },

  async logout(): Promise<void> {
    const session = authStorage.getSession();
    try {
      if (session) {
        await apiClient.post<ApiEnvelope<null>>(
          "/api/v1/auth/logout", { accessToken: session.accessToken },
        );
      }
    } finally {
      authStorage.clearSession();
    }
  },
};
