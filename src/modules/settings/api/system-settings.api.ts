import type {
  SystemSettings,
  UpdateSystemSettingsInput,
} from "@/modules/settings/types/system-settings.types";

const unsupported = (): never => {
  throw new Error(
    "Backend chưa có API cấu hình hệ thống, chính sách thuê, thông báo và mẫu chứng từ.",
  );
};

export const systemSettingsApi = {
  async get(): Promise<SystemSettings> { return unsupported(); },
  async update(_input: UpdateSystemSettingsInput): Promise<SystemSettings> {
    return unsupported();
  },
  async resetMockData(): Promise<SystemSettings> { return unsupported(); },
};
