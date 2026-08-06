import type {
  SystemSettings,
} from "@/modules/settings/types/system-settings.types";

export const initialSystemSettings:
  SystemSettings = {
    id: "settings-org-rentai",
    organizationId: "org-rentai",

    organization: {
      companyName:
        "Công ty Cổ phần RentalAI",
      taxCode: "0101234567",
      email: "contact@rentai.vn",
      phone: "02473001234",
      website: "https://rentai.vn",
      headquartersAddress:
        "Số 25 đường Nguyễn Trãi, Thanh Xuân, Hà Nội",
    },

    preferences: {
      timezone: "Asia/Ho_Chi_Minh",
      currency: "VND",
      language: "VI",
      dateFormat: "DD/MM/YYYY",
      defaultRentalPricingUnit: "DAY",
      defaultRentalDays: 1,
      reservationHoldMinutes: 30,
    },

    rentalPolicy: {
      depositRequired: true,
      defaultDepositPercent: 30,
      allowOverdueReturn: false,
      lateReturnGraceHours: 2,
      lateFeePercentPerDay: 150,
    },

    notifications: {
      emailEnabled: true,
      expiringContractReminder: true,
      expiringContractDays: 3,
      lowStockAlert: true,
      lowStockThreshold: 5,
      maintenanceAlert: true,
      paymentDueReminder: true,
    },

    documentTemplates: {
      quotationTemplateEnabled: true,
      contractTemplateEnabled: true,
      invoiceTemplateEnabled: true,
      deliveryTemplateEnabled: true,
      footerText:
        "RentalAI Manager — Hệ thống quản lý thiết bị cho thuê.",
    },

    updatedAt:
      "2026-08-05T08:00:00.000Z",
  };
