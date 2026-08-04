const parseBoolean = (
  value: string | undefined,
  defaultValue: boolean,
): boolean => {
  if (value === undefined) {
    return defaultValue;
  }

  return value.toLowerCase() === "true";
};

const timeout = Number(
  import.meta.env.VITE_API_TIMEOUT ?? 15000,
);

export const env = {
  appName:
    import.meta.env.VITE_APP_NAME ??
    "Hệ thống quản lý cho thuê máy móc và thiết bị sự kiện",

  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ??
    "http://localhost:8080/api",

  apiTimeout:
    Number.isFinite(timeout) ? timeout : 15000,

  useMockApi: parseBoolean(
    import.meta.env.VITE_USE_MOCK_API,
    true,
  ),
} as const;
