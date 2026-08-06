import {
  initialSystemSettings,
} from "@/modules/settings/mocks/system-settings.mock";

import type {
  SystemSettings,
} from "@/modules/settings/types/system-settings.types";

export const SYSTEM_SETTINGS_STORAGE_KEY =
  "rentai_mock_system_settings_v1";

const cloneSettings = (
  settings: SystemSettings,
): SystemSettings => {
  return structuredClone(settings);
};

const isSystemSettings = (
  value: unknown,
): value is SystemSettings => {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const settings =
    value as Record<string, unknown>;

  return (
    typeof settings.id === "string" &&
    typeof settings.organizationId ===
      "string" &&
    typeof settings.organization ===
      "object" &&
    settings.organization !== null &&
    typeof settings.preferences ===
      "object" &&
    settings.preferences !== null &&
    typeof settings.rentalPolicy ===
      "object" &&
    settings.rentalPolicy !== null &&
    typeof settings.notifications ===
      "object" &&
    settings.notifications !== null &&
    typeof settings.documentTemplates ===
      "object" &&
    settings.documentTemplates !== null &&
    typeof settings.updatedAt === "string"
  );
};

export const readSystemSettings =
  (): SystemSettings => {
    try {
      const storedValue =
        localStorage.getItem(
          SYSTEM_SETTINGS_STORAGE_KEY,
        );

      if (!storedValue) {
        const defaultSettings =
          cloneSettings(
            initialSystemSettings,
          );

        localStorage.setItem(
          SYSTEM_SETTINGS_STORAGE_KEY,
          JSON.stringify(
            defaultSettings,
          ),
        );

        return defaultSettings;
      }

      const parsedValue: unknown =
        JSON.parse(storedValue);

      if (!isSystemSettings(parsedValue)) {
        throw new Error(
          "Dữ liệu cấu hình không hợp lệ.",
        );
      }

      return cloneSettings(
        parsedValue,
      );
    } catch {
      const defaultSettings =
        cloneSettings(
          initialSystemSettings,
        );

      localStorage.setItem(
        SYSTEM_SETTINGS_STORAGE_KEY,
        JSON.stringify(
          defaultSettings,
        ),
      );

      return defaultSettings;
    }
  };

export const writeSystemSettings = (
  settings: SystemSettings,
): void => {
  localStorage.setItem(
    SYSTEM_SETTINGS_STORAGE_KEY,
    JSON.stringify(settings),
  );
};

export const resetSystemSettings =
  (): SystemSettings => {
    const defaultSettings =
      cloneSettings(
        initialSystemSettings,
      );

    writeSystemSettings(
      defaultSettings,
    );

    return defaultSettings;
  };
