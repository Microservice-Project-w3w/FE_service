export type QueryParamValue =
  | string
  | number
  | boolean
  | null
  | undefined;

export type QueryParams = Record<
  string,
  QueryParamValue | QueryParamValue[]
>;

export interface ApiRequestOptions
  extends Omit<
    RequestInit,
    "body" | "headers" | "method" | "signal"
  > {
  accessToken?: string;
  body?: unknown;
  headers?: HeadersInit;
  query?: QueryParams;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface ApiClient {
  delete<T = unknown>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<T>;
  get<T = unknown>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<T>;
  patch<T = unknown>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<T>;
  post<T = unknown>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<T>;
  put<T = unknown>(
    path: string,
    options?: ApiRequestOptions,
  ): Promise<T>;
  request<T = unknown>(
    method: string,
    path: string,
    options?: ApiRequestOptions,
  ): Promise<T>;
}
