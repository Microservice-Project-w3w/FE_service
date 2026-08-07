export type SettingsSection =
  | "ORGANIZATION"
  | "SYSTEM"
  | "NOTIFICATIONS"
  | "DOCUMENTS";

export type SupportedCurrency =
  | "VND"
  | "USD";

export type RentalPricingUnit =
  | "HOUR"
  | "DAY"
  | "WEEK"
  | "MONTH";

export type SupportedLanguage =
  | "VI"
  | "EN";

export type DateFormat =
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "YYYY-MM-DD";

export interface OrganizationSettings {
  companyName: string;
  taxCode: string;
  email: string;
  phone: string;
  website: string;
  headquartersAddress: string;
}

export interface SystemPreferences {
  timezone: string;
  currency: SupportedCurrency;
  language: SupportedLanguage;
  dateFormat: DateFormat;
  defaultRentalPricingUnit:
    RentalPricingUnit;
  defaultRentalDays: number;
  reservationHoldMinutes: number;
}

export interface RentalPolicySettings {
  depositRequired: boolean;
  defaultDepositPercent: number;
  allowOverdueReturn: boolean;
  lateReturnGraceHours: number;
  lateFeePercentPerDay: number;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  expiringContractReminder: boolean;
  expiringContractDays: number;
  lowStockAlert: boolean;
  lowStockThreshold: number;
  maintenanceAlert: boolean;
  paymentDueReminder: boolean;
}

export interface DocumentTemplateSettings {
  quotationTemplateEnabled: boolean;
  contractTemplateEnabled: boolean;
  invoiceTemplateEnabled: boolean;
  deliveryTemplateEnabled: boolean;
  footerText: string;
}

export interface SystemSettings {
  id: string;
  organizationId: string;
  organization:
    OrganizationSettings;
  preferences:
    SystemPreferences;
  rentalPolicy:
    RentalPolicySettings;
  notifications:
    NotificationSettings;
  documentTemplates:
    DocumentTemplateSettings;
  updatedAt: string;
}

export interface UpdateSystemSettingsInput {
  organization:
    OrganizationSettings;
  preferences:
    SystemPreferences;
  rentalPolicy:
    RentalPolicySettings;
  notifications:
    NotificationSettings;
  documentTemplates:
    DocumentTemplateSettings;
}
