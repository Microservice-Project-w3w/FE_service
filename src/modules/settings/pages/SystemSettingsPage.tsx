import {
  Bell,
  Building2,
  FileText,
  RotateCcw,
  Save,
  Settings2,
} from "lucide-react";

import type {
  LucideIcon,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  systemSettingsApi,
} from "@/modules/settings/api/system-settings.api";

import {
  SettingsResetDialog,
} from "@/modules/settings/components/SettingsResetDialog";

import {
  SettingsToggle,
} from "@/modules/settings/components/SettingsToggle";

import type {
  DateFormat,
  DocumentTemplateSettings,
  NotificationSettings,
  OrganizationSettings,
  RentalPolicySettings,
  RentalPricingUnit,
  SettingsSection,
  SupportedCurrency,
  SupportedLanguage,
  SystemPreferences,
  SystemSettings,
  UpdateSystemSettingsInput,
} from "@/modules/settings/types/system-settings.types";

interface NavigationItem {
  value: SettingsSection;
  label: string;
  description: string;
  Icon: LucideIcon;
}

const navigationItems:
  NavigationItem[] = [
    {
      value: "ORGANIZATION",
      label: "Tổ chức",
      description:
        "Thông tin doanh nghiệp",
      Icon: Building2,
    },
    {
      value: "SYSTEM",
      label: "Cấu hình hệ thống",
      description:
        "Vận hành và chính sách thuê",
      Icon: Settings2,
    },
    {
      value: "NOTIFICATIONS",
      label: "Thông báo",
      description:
        "Email và cảnh báo nghiệp vụ",
      Icon: Bell,
    },
    {
      value: "DOCUMENTS",
      label: "Mẫu tài liệu",
      description:
        "Báo giá, hợp đồng và hóa đơn",
      Icon: FileText,
    },
  ];

const inputClassName =
  "mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const textareaClassName =
  "mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const createInput = (
  settings: SystemSettings,
): UpdateSystemSettingsInput => {
  return {
    organization: {
      ...settings.organization,
    },
    preferences: {
      ...settings.preferences,
    },
    rentalPolicy: {
      ...settings.rentalPolicy,
    },
    notifications: {
      ...settings.notifications,
    },
    documentTemplates: {
      ...settings.documentTemplates,
    },
  };
};

const dateTimeFormatter =
  new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

interface SettingsCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SettingsCard = ({
  title,
  description,
  children,
}: SettingsCardProps) => {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="border-b border-slate-200 pb-4">
        <h2 className="text-lg font-bold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </header>

      <div className="pt-5">
        {children}
      </div>
    </section>
  );
};

export const SystemSettingsPage = () => {
  const [
    settings,
    setSettings,
  ] = useState<SystemSettings | null>(
    null,
  );

  const [
    draft,
    setDraft,
  ] =
    useState<UpdateSystemSettingsInput | null>(
      null,
    );

  const [
    activeSection,
    setActiveSection,
  ] = useState<SettingsSection>(
    "ORGANIZATION",
  );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    resetOpen,
    setResetOpen,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null,
  );

  const [
    successMessage,
    setSuccessMessage,
  ] = useState<string | null>(
    null,
  );

  const loadSettings =
    useCallback(async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const data =
          await systemSettingsApi.get();

        setSettings(data);
        setDraft(createInput(data));
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải cấu hình hệ thống.",
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const isDirty = useMemo(() => {
    if (!settings || !draft) {
      return false;
    }

    return (
      JSON.stringify(
        createInput(settings),
      ) !== JSON.stringify(draft)
    );
  }, [
    draft,
    settings,
  ]);

  const updateOrganization = <
    Key extends keyof OrganizationSettings,
  >(
    key: Key,
    value: OrganizationSettings[Key],
  ) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        organization: {
          ...current.organization,
          [key]: value,
        },
      };
    });
  };

  const updatePreferences = <
    Key extends keyof SystemPreferences,
  >(
    key: Key,
    value: SystemPreferences[Key],
  ) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        preferences: {
          ...current.preferences,
          [key]: value,
        },
      };
    });
  };

  const updateRentalPolicy = <
    Key extends keyof RentalPolicySettings,
  >(
    key: Key,
    value: RentalPolicySettings[Key],
  ) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        rentalPolicy: {
          ...current.rentalPolicy,
          [key]: value,
        },
      };
    });
  };

  const updateNotifications = <
    Key extends keyof NotificationSettings,
  >(
    key: Key,
    value: NotificationSettings[Key],
  ) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        notifications: {
          ...current.notifications,
          [key]: value,
        },
      };
    });
  };

  const updateDocuments = <
    Key extends keyof DocumentTemplateSettings,
  >(
    key: Key,
    value:
      DocumentTemplateSettings[Key],
  ) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        documentTemplates: {
          ...current.documentTemplates,
          [key]: value,
        },
      };
    });
  };

  const handleSave = async () => {
    if (!draft) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updated =
        await systemSettingsApi.update(
          draft,
        );

      setSettings(updated);
      setDraft(createInput(updated));
      setSuccessMessage(
        "Đã lưu cấu hình hệ thống.",
      );

      window.setTimeout(() => {
        setSuccessMessage(null);
      }, 2500);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể lưu cấu hình hệ thống.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const restored =
        await systemSettingsApi
          .resetMockData();

      setSettings(restored);
      setDraft(createInput(restored));
      setResetOpen(false);

      setSuccessMessage(
        "Đã khôi phục cấu hình mặc định.",
      );

      window.setTimeout(() => {
        setSuccessMessage(null);
      }, 2500);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Không thể khôi phục cấu hình.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center text-sm text-slate-500">
        Đang tải cấu hình hệ thống...
      </div>
    );
  }

  if (!settings || !draft) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm font-semibold text-rose-700">
        {errorMessage ??
          "Không có dữ liệu cấu hình."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Quản trị hệ thống
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Cấu hình hệ thống
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Quản lý thông tin tổ chức, thiết
            lập vận hành, thông báo và mẫu tài
            liệu.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={() =>
              setResetOpen(true)
            }
            className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RotateCcw size={17} />
            Khôi phục dữ liệu
          </button>

          <button
            type="button"
            disabled={
              isSaving || !isDirty
            }
            onClick={() => {
              void handleSave();
            }}
            className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />

            {isSaving
              ? "Đang lưu..."
              : "Lưu thay đổi"}
          </button>
        </div>
      </header>

      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-2 shadow-sm lg:sticky lg:top-24">
          <nav className="space-y-1">
            {navigationItems.map(
              (item) => {
                const Icon = item.Icon;
                const isActive =
                  activeSection ===
                  item.value;

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() =>
                      setActiveSection(
                        item.value,
                      )
                    }
                    className={[
                      "flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")}
                  >
                    <Icon
                      size={19}
                      className="mt-0.5 shrink-0"
                    />

                    <span>
                      <span className="block text-sm font-semibold">
                        {item.label}
                      </span>

                      <span
                        className={[
                          "mt-0.5 block text-xs leading-5",
                          isActive
                            ? "text-blue-600"
                            : "text-slate-400",
                        ].join(" ")}
                      >
                        {item.description}
                      </span>
                    </span>
                  </button>
                );
              },
            )}
          </nav>
        </aside>

        <main className="space-y-6">
          {activeSection ===
            "ORGANIZATION" && (
            <SettingsCard
              title="Thông tin doanh nghiệp"
              description="Thông tin pháp lý và liên hệ được sử dụng trên toàn hệ thống."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <label className="text-sm font-semibold text-slate-700">
                  Tên doanh nghiệp
                  <input
                    value={
                      draft.organization
                        .companyName
                    }
                    onChange={(event) =>
                      updateOrganization(
                        "companyName",
                        event.target.value,
                      )
                    }
                    className={inputClassName}
                  />
                </label>

                <label className="text-sm font-semibold text-slate-700">
                  Mã số thuế
                  <input
                    value={
                      draft.organization
                        .taxCode
                    }
                    onChange={(event) =>
                      updateOrganization(
                        "taxCode",
                        event.target.value,
                      )
                    }
                    className={inputClassName}
                  />
                </label>

                <label className="text-sm font-semibold text-slate-700">
                  Email
                  <input
                    type="email"
                    value={
                      draft.organization
                        .email
                    }
                    onChange={(event) =>
                      updateOrganization(
                        "email",
                        event.target.value,
                      )
                    }
                    className={inputClassName}
                  />
                </label>

                <label className="text-sm font-semibold text-slate-700">
                  Số điện thoại
                  <input
                    value={
                      draft.organization
                        .phone
                    }
                    onChange={(event) =>
                      updateOrganization(
                        "phone",
                        event.target.value,
                      )
                    }
                    className={inputClassName}
                  />
                </label>

                <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                  Website
                  <input
                    value={
                      draft.organization
                        .website
                    }
                    onChange={(event) =>
                      updateOrganization(
                        "website",
                        event.target.value,
                      )
                    }
                    placeholder="https://..."
                    className={inputClassName}
                  />
                </label>

                <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                  Địa chỉ trụ sở
                  <textarea
                    value={
                      draft.organization
                        .headquartersAddress
                    }
                    onChange={(event) =>
                      updateOrganization(
                        "headquartersAddress",
                        event.target.value,
                      )
                    }
                    className={
                      textareaClassName
                    }
                  />
                </label>
              </div>

              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Thông tin từng chi nhánh được
                quản lý tại trang{" "}
                <strong>Chi nhánh</strong>.
              </div>
            </SettingsCard>
          )}

          {activeSection ===
            "SYSTEM" && (
            <>
              <SettingsCard
                title="Thiết lập chung"
                description="Định dạng và giá trị mặc định dùng trong quá trình vận hành."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Múi giờ
                    <select
                      value={
                        draft.preferences
                          .timezone
                      }
                      onChange={(event) =>
                        updatePreferences(
                          "timezone",
                          event.target.value,
                        )
                      }
                      className={
                        inputClassName
                      }
                    >
                      <option value="Asia/Ho_Chi_Minh">
                        Asia/Ho_Chi_Minh
                      </option>

                      <option value="Asia/Bangkok">
                        Asia/Bangkok
                      </option>

                      <option value="UTC">
                        UTC
                      </option>
                    </select>
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Tiền tệ
                    <select
                      value={
                        draft.preferences
                          .currency
                      }
                      onChange={(event) =>
                        updatePreferences(
                          "currency",
                          event.target
                            .value as SupportedCurrency,
                        )
                      }
                      className={
                        inputClassName
                      }
                    >
                      <option value="VND">
                        VND — Việt Nam đồng
                      </option>

                      <option value="USD">
                        USD — Đô la Mỹ
                      </option>
                    </select>
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Ngôn ngữ
                    <select
                      value={
                        draft.preferences
                          .language
                      }
                      onChange={(event) =>
                        updatePreferences(
                          "language",
                          event.target
                            .value as SupportedLanguage,
                        )
                      }
                      className={
                        inputClassName
                      }
                    >
                      <option value="VI">
                        Tiếng Việt
                      </option>

                      <option value="EN">
                        English
                      </option>
                    </select>
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Định dạng ngày
                    <select
                      value={
                        draft.preferences
                          .dateFormat
                      }
                      onChange={(event) =>
                        updatePreferences(
                          "dateFormat",
                          event.target
                            .value as DateFormat,
                        )
                      }
                      className={
                        inputClassName
                      }
                    >
                      <option value="DD/MM/YYYY">
                        DD/MM/YYYY
                      </option>

                      <option value="MM/DD/YYYY">
                        MM/DD/YYYY
                      </option>

                      <option value="YYYY-MM-DD">
                        YYYY-MM-DD
                      </option>
                    </select>
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Đơn vị giá thuê mặc định
                    <select
                      value={
                        draft.preferences
                          .defaultRentalPricingUnit
                      }
                      onChange={(event) =>
                        updatePreferences(
                          "defaultRentalPricingUnit",
                          event.target
                            .value as RentalPricingUnit,
                        )
                      }
                      className={
                        inputClassName
                      }
                    >
                      <option value="HOUR">
                        Theo giờ
                      </option>

                      <option value="DAY">
                        Theo ngày
                      </option>

                      <option value="WEEK">
                        Theo tuần
                      </option>

                      <option value="MONTH">
                        Theo tháng
                      </option>
                    </select>
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Số ngày thuê mặc định
                    <input
                      type="number"
                      min={1}
                      value={
                        draft.preferences
                          .defaultRentalDays
                      }
                      onChange={(event) =>
                        updatePreferences(
                          "defaultRentalDays",
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className={
                        inputClassName
                      }
                    />
                  </label>

                  <label className="text-sm font-semibold text-slate-700">
                    Thời gian giữ thiết bị
                    <div className="relative">
                      <input
                        type="number"
                        min={1}
                        value={
                          draft.preferences
                            .reservationHoldMinutes
                        }
                        onChange={(event) =>
                          updatePreferences(
                            "reservationHoldMinutes",
                            Number(
                              event.target
                                .value,
                            ),
                          )
                        }
                        className={`${inputClassName} pr-16`}
                      />

                      <span className="pointer-events-none absolute bottom-3 right-3 text-xs font-semibold text-slate-400">
                        phút
                      </span>
                    </div>
                  </label>
                </div>
              </SettingsCard>

              <SettingsCard
                title="Chính sách thuê"
                description="Các quy tắc mặc định áp dụng khi lập yêu cầu và hợp đồng thuê."
              >
                <div className="space-y-4">
                  <SettingsToggle
                    checked={
                      draft.rentalPolicy
                        .depositRequired
                    }
                    label="Yêu cầu đặt cọc"
                    description="Yêu cầu khách hàng đặt cọc khi xác nhận đơn thuê."
                    onChange={(checked) =>
                      updateRentalPolicy(
                        "depositRequired",
                        checked,
                      )
                    }
                  />

                  <label className="block text-sm font-semibold text-slate-700">
                    Tỷ lệ đặt cọc mặc định
                    <div className="relative max-w-xs">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        disabled={
                          !draft.rentalPolicy
                            .depositRequired
                        }
                        value={
                          draft.rentalPolicy
                            .defaultDepositPercent
                        }
                        onChange={(event) =>
                          updateRentalPolicy(
                            "defaultDepositPercent",
                            Number(
                              event.target
                                .value,
                            ),
                          )
                        }
                        className={`${inputClassName} pr-12 disabled:cursor-not-allowed disabled:bg-slate-100`}
                      />

                      <span className="pointer-events-none absolute bottom-3 right-4 text-sm text-slate-400">
                        %
                      </span>
                    </div>
                  </label>

                  <SettingsToggle
                    checked={
                      draft.rentalPolicy
                        .allowOverdueReturn
                    }
                    label="Cho phép trả thiết bị quá hạn"
                    description="Cho phép hoàn trả sau thời hạn hợp đồng và tự động áp dụng phí trễ."
                    onChange={(checked) =>
                      updateRentalPolicy(
                        "allowOverdueReturn",
                        checked,
                      )
                    }
                  />

                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="text-sm font-semibold text-slate-700">
                      Thời gian gia hạn miễn phí
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          value={
                            draft.rentalPolicy
                              .lateReturnGraceHours
                          }
                          onChange={(event) =>
                            updateRentalPolicy(
                              "lateReturnGraceHours",
                              Number(
                                event.target
                                  .value,
                              ),
                            )
                          }
                          className={`${inputClassName} pr-14`}
                        />

                        <span className="pointer-events-none absolute bottom-3 right-3 text-xs font-semibold text-slate-400">
                          giờ
                        </span>
                      </div>
                    </label>

                    <label className="text-sm font-semibold text-slate-700">
                      Phí trả trễ mỗi ngày
                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          value={
                            draft.rentalPolicy
                              .lateFeePercentPerDay
                          }
                          onChange={(event) =>
                            updateRentalPolicy(
                              "lateFeePercentPerDay",
                              Number(
                                event.target
                                  .value,
                              ),
                            )
                          }
                          className={`${inputClassName} pr-12`}
                        />

                        <span className="pointer-events-none absolute bottom-3 right-4 text-sm text-slate-400">
                          %
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </SettingsCard>
            </>
          )}

          {activeSection ===
            "NOTIFICATIONS" && (
            <SettingsCard
              title="Cấu hình thông báo"
              description="Lựa chọn các sự kiện cần gửi email hoặc cảnh báo trong hệ thống."
            >
              <div className="space-y-4">
                <SettingsToggle
                  checked={
                    draft.notifications
                      .emailEnabled
                  }
                  label="Bật thông báo email"
                  description="Cho phép hệ thống gửi email nghiệp vụ tới nhân viên và khách hàng."
                  onChange={(checked) =>
                    updateNotifications(
                      "emailEnabled",
                      checked,
                    )
                  }
                />

                <SettingsToggle
                  checked={
                    draft.notifications
                      .expiringContractReminder
                  }
                  label="Nhắc hợp đồng sắp hết hạn"
                  description="Gửi cảnh báo trước khi hợp đồng thuê kết thúc."
                  disabled={
                    !draft.notifications
                      .emailEnabled
                  }
                  onChange={(checked) =>
                    updateNotifications(
                      "expiringContractReminder",
                      checked,
                    )
                  }
                />

                <label className="block text-sm font-semibold text-slate-700">
                  Nhắc trước thời hạn
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      min={1}
                      disabled={
                        !draft.notifications
                          .emailEnabled ||
                        !draft.notifications
                          .expiringContractReminder
                      }
                      value={
                        draft.notifications
                          .expiringContractDays
                      }
                      onChange={(event) =>
                        updateNotifications(
                          "expiringContractDays",
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className={`${inputClassName} pr-14 disabled:cursor-not-allowed disabled:bg-slate-100`}
                    />

                    <span className="pointer-events-none absolute bottom-3 right-3 text-xs font-semibold text-slate-400">
                      ngày
                    </span>
                  </div>
                </label>

                <SettingsToggle
                  checked={
                    draft.notifications
                      .lowStockAlert
                  }
                  label="Cảnh báo tồn kho thấp"
                  description="Thông báo khi số thiết bị khả dụng thấp hơn ngưỡng cấu hình."
                  onChange={(checked) =>
                    updateNotifications(
                      "lowStockAlert",
                      checked,
                    )
                  }
                />

                <label className="block text-sm font-semibold text-slate-700">
                  Ngưỡng tồn kho thấp
                  <div className="relative max-w-xs">
                    <input
                      type="number"
                      min={0}
                      disabled={
                        !draft.notifications
                          .lowStockAlert
                      }
                      value={
                        draft.notifications
                          .lowStockThreshold
                      }
                      onChange={(event) =>
                        updateNotifications(
                          "lowStockThreshold",
                          Number(
                            event.target
                              .value,
                          ),
                        )
                      }
                      className={`${inputClassName} pr-20 disabled:cursor-not-allowed disabled:bg-slate-100`}
                    />

                    <span className="pointer-events-none absolute bottom-3 right-3 text-xs font-semibold text-slate-400">
                      thiết bị
                    </span>
                  </div>
                </label>

                <SettingsToggle
                  checked={
                    draft.notifications
                      .maintenanceAlert
                  }
                  label="Cảnh báo bảo trì"
                  description="Thông báo khi thiết bị đến hạn kiểm tra hoặc bảo trì."
                  onChange={(checked) =>
                    updateNotifications(
                      "maintenanceAlert",
                      checked,
                    )
                  }
                />

                <SettingsToggle
                  checked={
                    draft.notifications
                      .paymentDueReminder
                  }
                  label="Nhắc thanh toán"
                  description="Thông báo các hóa đơn và khoản phải thu sắp đến hạn."
                  onChange={(checked) =>
                    updateNotifications(
                      "paymentDueReminder",
                      checked,
                    )
                  }
                />
              </div>
            </SettingsCard>
          )}

          {activeSection ===
            "DOCUMENTS" && (
            <SettingsCard
              title="Mẫu tài liệu"
              description="Bật hoặc tắt các loại tài liệu được tạo trong quy trình cho thuê."
            >
              <div className="space-y-4">
                <SettingsToggle
                  checked={
                    draft.documentTemplates
                      .quotationTemplateEnabled
                  }
                  label="Mẫu báo giá"
                  description="Cho phép tạo và xuất báo giá cho khách hàng."
                  onChange={(checked) =>
                    updateDocuments(
                      "quotationTemplateEnabled",
                      checked,
                    )
                  }
                />

                <SettingsToggle
                  checked={
                    draft.documentTemplates
                      .contractTemplateEnabled
                  }
                  label="Mẫu hợp đồng"
                  description="Cho phép tạo hợp đồng thuê từ dữ liệu đơn thuê."
                  onChange={(checked) =>
                    updateDocuments(
                      "contractTemplateEnabled",
                      checked,
                    )
                  }
                />

                <SettingsToggle
                  checked={
                    draft.documentTemplates
                      .invoiceTemplateEnabled
                  }
                  label="Mẫu hóa đơn"
                  description="Cho phép xuất hóa đơn và chứng từ thanh toán."
                  onChange={(checked) =>
                    updateDocuments(
                      "invoiceTemplateEnabled",
                      checked,
                    )
                  }
                />

                <SettingsToggle
                  checked={
                    draft.documentTemplates
                      .deliveryTemplateEnabled
                  }
                  label="Biên bản giao nhận"
                  description="Cho phép tạo biên bản bàn giao và thu hồi thiết bị."
                  onChange={(checked) =>
                    updateDocuments(
                      "deliveryTemplateEnabled",
                      checked,
                    )
                  }
                />

                <label className="block text-sm font-semibold text-slate-700">
                  Nội dung chân trang tài liệu
                  <textarea
                    value={
                      draft.documentTemplates
                        .footerText
                    }
                    onChange={(event) =>
                      updateDocuments(
                        "footerText",
                        event.target.value,
                      )
                    }
                    className={
                      textareaClassName
                    }
                  />
                </label>
              </div>
            </SettingsCard>
          )}

          <footer className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Cập nhật gần nhất:{" "}
              <strong className="font-semibold text-slate-700">
                {dateTimeFormatter.format(
                  new Date(
                    settings.updatedAt,
                  ),
                )}
              </strong>
            </p>

            <button
              type="button"
              disabled={
                isSaving || !isDirty
              }
              onClick={() => {
                void handleSave();
              }}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {isSaving
                ? "Đang lưu..."
                : "Lưu thay đổi"}
            </button>
          </footer>
        </main>
      </div>

      <SettingsResetDialog
        isOpen={resetOpen}
        isSubmitting={isSaving}
        onClose={() => {
          if (!isSaving) {
            setResetOpen(false);
          }
        }}
        onConfirm={() => {
          void handleReset();
        }}
      />
    </div>
  );
};
