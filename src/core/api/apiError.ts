interface ApiErrorOptions {
  cause?: unknown;
  code?: string;
  details?: unknown;
  status?: number | null;
  url?: string;
}

export class ApiError extends Error {
  readonly status: number | null;
  readonly code?: string;
  readonly details?: unknown;
  readonly url?: string;

  constructor(
    message: string,
    options: ApiErrorOptions = {},
  ) {
    super(message, {
      cause: options.cause,
    });

    this.name = "ApiError";
    this.status = options.status ?? null;
    this.code = options.code;
    this.details = options.details;
    this.url = options.url;
  }
}

export const isApiError = (
  value: unknown,
): value is ApiError => {
  return value instanceof ApiError;
};
