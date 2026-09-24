import {
  ApiError,
} from "@/core/api/apiError";
import type {
  ApiClient,
  ApiRequestOptions,
  QueryParams,
} from "@/core/api/apiTypes";
import {
  env,
} from "@/core/config/env";

const HTTP_MESSAGES: Record<number, string> = {
  400: "Bad request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not found",
  409: "Conflict",
  422: "Unprocessable entity",
  500: "Internal server error",
};

const isRecord = (
  value: unknown,
): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const stringProperty = (
  value: unknown,
  key: string,
): string | undefined => {
  if (!isRecord(value)) {
    return undefined;
  }

  const property = value[key];

  return typeof property === "string"
    ? property
    : undefined;
};

const errorMessage = (
  status: number,
  body: unknown,
): string => {
  return (
    stringProperty(body, "message") ??
    stringProperty(body, "error") ??
    HTTP_MESSAGES[status] ??
    `Request failed with status ${status}`
  );
};

const parseBody = async (
  response: Response,
): Promise<unknown> => {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  const contentType =
    response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  return text;
};

export const buildApiUrl = (
  baseUrl: string,
  path: string,
  query?: QueryParams,
): string => {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  const normalizedPath = path.replace(/^\/+/, "");
  const url = new URL(
    `${normalizedBaseUrl}/${normalizedPath}`,
  );

  if (query) {
    Object.entries(query).forEach(([key, rawValue]) => {
      const values = Array.isArray(rawValue)
        ? rawValue
        : [rawValue];

      values.forEach((value) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    });
  }

  return url.toString();
};

const createHeaders = (
  options: ApiRequestOptions,
): Headers => {
  const headers = new Headers(options.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.accessToken) {
    headers.set(
      "Authorization",
      `Bearer ${options.accessToken}`,
    );
  }

  return headers;
};

const createApiClient = (
  baseUrl: string,
  defaultTimeoutMs: number,
): ApiClient => {
  const request = async <T = unknown>(
    method: string,
    path: string,
    options: ApiRequestOptions = {},
  ): Promise<T> => {
    const {
      accessToken: _accessToken,
      body,
      headers: _headers,
      query,
      signal,
      timeoutMs: requestedTimeoutMs,
      ...requestInit
    } = options;
    const url = buildApiUrl(baseUrl, path, query);
    const controller = new AbortController();
    const timeoutMs = requestedTimeoutMs ?? defaultTimeoutMs;
    let timedOut = false;

    const abortFromCaller = () => controller.abort();
    signal?.addEventListener("abort", abortFromCaller);

    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);

    try {
      const response = await fetch(url, {
        ...requestInit,
        body:
          body === undefined
            ? undefined
            : JSON.stringify(body),
        headers: createHeaders(options),
        method,
        signal: controller.signal,
      });
      const responseBody = await parseBody(response);

      if (!response.ok) {
        throw new ApiError(
          errorMessage(response.status, responseBody),
          {
            code: stringProperty(responseBody, "code"),
            details: responseBody,
            status: response.status,
            url,
          },
        );
      }

      return responseBody as T;
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (timedOut) {
        throw new ApiError(
          `Request timed out after ${timeoutMs}ms`,
          {
            cause: error,
            code: "REQUEST_TIMEOUT",
            url,
          },
        );
      }

      const callerAborted = signal?.aborted === true;

      throw new ApiError(
        callerAborted
          ? "Request was aborted"
          : "Network request failed",
        {
          cause: error,
          code: callerAborted
            ? "REQUEST_ABORTED"
            : "NETWORK_ERROR",
          url,
        },
      );
    } finally {
      window.clearTimeout(timeoutId);
      signal?.removeEventListener(
        "abort",
        abortFromCaller,
      );
    }
  };

  return {
    request,
    delete: (path, options) => request("DELETE", path, options),
    get: (path, options) => request("GET", path, options),
    patch: (path, options) => request("PATCH", path, options),
    post: (path, options) => request("POST", path, options),
    put: (path, options) => request("PUT", path, options),
  };
};

export const apiClient = createApiClient(
  env.apiBaseUrl,
  env.apiTimeout,
);
