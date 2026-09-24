import { ApiError, apiClient } from "@/core/api";
import { assertBackendAuthData, authDataToSession } from "@/modules/auth/api/auth.api.helpers";
import { authStorage } from "@/modules/auth/api/auth.storage";
import type {
  ApiEnvelope, AuthSession, BackendAuthData,
} from "@/modules/auth/types/auth.types";
import type { ApiRequestOptions } from "@/core/api";

type SessionListener = (session: AuthSession | null) => void;
let sessionListener: SessionListener = () => undefined;
let refreshPromise: Promise<AuthSession> | null = null;

export const setAuthSessionListener = (listener: SessionListener): void => {
  sessionListener = listener;
};

const refreshSession = async (): Promise<AuthSession> => {
  const current = authStorage.getSession();
  if (!current) {
    throw new ApiError("Authentication session is unavailable", {
      code: "AUTH_SESSION_MISSING", status: 401,
    });
  }
  try {
    const response = await apiClient.post<ApiEnvelope<BackendAuthData>>(
      "/api/v1/auth/refresh",
      { body: { refreshToken: current.refreshToken } },
    );
    const session = authDataToSession(
      assertBackendAuthData(response.data), current.rememberMe, current.user,
    );
    authStorage.saveSession(session);
    sessionListener(session);
    return session;
  } catch (error: unknown) {
    authStorage.clearSession();
    sessionListener(null);
    throw error;
  }
};

export const refreshAuthSession = (): Promise<AuthSession> => {
  if (!refreshPromise) {
    refreshPromise = refreshSession().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
};

export const authenticatedRequest = async <T>(
  method: string,
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> => {
  const session = authStorage.getSession();
  if (!session) {
    throw new ApiError("Authentication is required", {
      code: "AUTH_SESSION_MISSING", status: 401, url: path,
    });
  }
  try {
    return await apiClient.request<T>(method, path, {
      ...options, accessToken: session.accessToken,
    });
  } catch (error: unknown) {
    if (!(error instanceof ApiError) || error.status !== 401) throw error;
    const refreshed = await refreshAuthSession();
    return apiClient.request<T>(method, path, {
      ...options, accessToken: refreshed.accessToken,
    });
  }
};
