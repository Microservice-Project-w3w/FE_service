# API Integration Matrix

## Overview
This document maps frontend features and routes to backend public endpoints across the microservices architecture.

## Coverage Matrix

| Role | Frontend Route | Feature | Frontend API Function | Gateway Public Endpoint | Backend Service | Controller | Backend Coverage | Integration Status |
|---|---|---|---|---|---|---|---|---|
| Sales | `/sales/dashboard` | Dashboard | `manager-dashboard.api.ts` | `/api/v1/dashboard/summary` | Maintenance (??) | `MaintenanceReportController` | UNKNOWN | ⚪ NOT WIRED |
| Sales | `/sales/customers` | Customers | `sales-customers.api.ts` | `/api/v1/customers` | Org-Customer | `CustomerController` | EXISTS | ✅ CODE WIRED |
| Sales | `/sales/rental-requests/create` | Rental Req | `sales-rental-workflow.api.ts` | `/api/v1/rental-requests` | Rental | `RentalWorkflowController` | EXISTS | ✅ CODE WIRED |
| Sales | `/sales/quotations` | Quotations | `sales-rental-workflow.api.ts` | `/api/v1/quotations` | Rental | `RentalWorkflowController` | EXISTS | ✅ CODE WIRED |
| Manager | `/operations/equipment` | Equipment | `manager-equipment.api.ts` | `/api/v1/inventory/equipment` | Inventory | `EquipmentController` | EXISTS | ✅ CODE WIRED |
| Admin | `/admin/employees` | Employees | `employees.api.ts` | `/api/v1/employees` | Org-Customer | `EmployeeController` | EXISTS | ✅ CODE WIRED |
| Admin | `/admin/branches` | Branches | `branches.api.ts` | `/api/v1/organizations/{id}/branches` | Org-Customer | `BranchController` | EXISTS | ✅ CODE WIRED |
| Accounting | `/accounting/invoices` | Invoices | `accountant-invoices.api.ts` | `/api/v1/billing` | Billing | `BillingController` | EXISTS | ✅ CODE WIRED |
| Accounting | `/accounting/receivables` | Receivables | `accountant-receivables.api.ts` | `/api/v1/debts` | Billing | `DebtController` | EXISTS | ✅ CODE WIRED |

## Mock Inventory
| ID | Feature | File | Mock Type | Backend Replacement Exists? | Status |
|---|---|---|---|---|---|
| 1 | Branches | `branches.storage.ts` | LOCAL BACKEND STORAGE | YES (`BranchController`) | 🔴 MOCK |
| 2 | Employees | `employees.storage.ts` | LOCAL BACKEND STORAGE | YES (`EmployeeController`) | 🔴 MOCK |
| 3 | Equipment Categories | `equipment-categories.storage.ts` | LOCAL BACKEND STORAGE | YES (`EquipmentCategoryController`) | 🔴 MOCK |
| 4 | Settings | `system-settings.storage.ts` | LOCAL BACKEND STORAGE | NO | ❌ MISSING BACKEND |
| 5 | Notifications | `notification.store.ts` | LOCAL BACKEND STORAGE | NO | ❌ MISSING BACKEND |

## Pre-Runtime Contract Mismatches
| CM-ID | Feature | Mismatch | Severity | Suggested Direction |
|---|---|---|---|---|
| CM-001 | Quotations | Frontend uses `QUOTATION_MOCKS` schema which might differ from `SalesQuotationDto` | HIGH | Map explicitly in `SalesQuotationsPage.tsx` |

## Backend Coverage Gaps
| Feature | Frontend Route | Expected Capability | Backend Evidence | Status |
|---|---|---|---|---|
| Notifications | All | Polling or WebSocket for alerts | Not found in controllers | UNKNOWN |
| System Settings | `/admin/settings` | Global configs | Not found in controllers | MISSING |
