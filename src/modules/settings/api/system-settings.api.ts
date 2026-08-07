import {
  readSystemSettings,
  resetSystemSettings,
  writeSystemSettings,
} from "@/modules/settings/api/system-settings.storage";

import type {
  SystemSettings,
  UpdateSystemSettingsInput,
} from "@/modules/settings/types/system-settings.types";

const delay = async (
  milliseconds = 180,
): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(
      resolve,
      milliseconds,
    );
  });
};

const validateSettings = (
  input: UpdateSystemSettingsInput,
): void => {
  if (
    !input.organization.companyName.trim()
  ) {
    throw new Error(
      "Tên doanh nghiệp không được để trống.",
    );
  }

  if (
    !input.organization.taxCode.trim()
  ) {
    throw new Error(
      "Mã số thuế không được để trống.",
    );
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      input.organization.email.trim(),
    )
  ) {
    throw new Error(
      "Email doanh nghiệp không đúng định dạng.",
    );
  }

  if (
    !/^[0-9]{9,15}$/.test(
      input.organization.phone.replace(
        /\s+/g,
        "",
      ),
    )
  ) {
    throw new Error(
      "Số điện thoại phải có từ 9 đến 15 chữ số.",
    );
  }

  if (
    input.preferences.defaultRentalDays <
    1
  ) {
    throw new Error(
      "Số ngày thuê mặc định phải lớn hơn 0.",
    );
  }

  if (
    input.preferences
      .reservationHoldMinutes < 1
  ) {
    throw new Error(
      "Thời gian giữ thiết bị phải lớn hơn 0 phút.",
    );
  }

  if (
    input.rentalPolicy
      .defaultDepositPercent < 0 ||
    input.rentalPolicy
      .defaultDepositPercent > 100
  ) {
    throw new Error(
      "Tỷ lệ đặt cọc phải từ 0 đến 100%.",
    );
  }

  if (
    input.notifications
      .expiringContractDays < 1
  ) {
    throw new Error(
      "Số ngày nhắc hợp đồng phải lớn hơn 0.",
    );
  }
};

export const systemSettingsApi = {
  async get(): Promise<SystemSettings> {
    await delay();

    return readSystemSettings();
  },

  async update(
    input: UpdateSystemSettingsInput,
  ): Promise<SystemSettings> {
    await delay();

    validateSettings(input);

    const currentSettings =
      readSystemSettings();

    const updatedSettings:
      SystemSettings = {
        ...currentSettings,

        organization: {
          ...input.organization,
          companyName:
            input.organization
              .companyName.trim(),
          taxCode:
            input.organization
              .taxCode.trim(),
          email:
            input.organization
              .email.trim(),
          phone:
            input.organization
              .phone.trim(),
          website:
            input.organization
              .website.trim(),
          headquartersAddress:
            input.organization
              .headquartersAddress.trim(),
        },

        preferences: {
          ...input.preferences,
        },

        rentalPolicy: {
          ...input.rentalPolicy,
        },

        notifications: {
          ...input.notifications,
        },

        documentTemplates: {
          ...input.documentTemplates,
          footerText:
            input.documentTemplates
              .footerText.trim(),
        },

        updatedAt:
          new Date().toISOString(),
      };

    writeSystemSettings(
      updatedSettings,
    );

    return updatedSettings;
  },

  async resetMockData(): Promise<
    SystemSettings
  > {
    await delay();

    return resetSystemSettings();
  },
};
