# Full Backend Integration Audit

Audit date: 2026-09-16 (Asia/Saigon)  
Audit mode: source/read-only; no business source was changed.  
Frontend: `E:\FE_Service`, branch `feature/backend-integration`, HEAD `d3688a1`.  
Frontend baseline: `origin/dev` at `ee9473f`; audited branch is 0 behind / 26 ahead after `git fetch --all --prune`.  
Backend source of truth: `E:\backend-api-gateway`, detached HEAD `6bd8081`, exactly equal to `origin/api-gateway` after fetch.

## Phase 1 Auth runtime checkpoint (2026-09-16, superseded below)

- Infrastructure runtime: MySQL, Redis and RabbitMQ are healthy using `infra/docker-compose.yml` and persistent named volumes.
- Identity runtime: PASS on port 8081; `GET /health` returned HTTP 200 and `status=UP`.
- API Gateway runtime: PASS on port 8080; `GET /health` returned HTTP 200. `GET /gateway/health/identity` through port 8080 returned the Identity health response, proving Gateway routing to Identity.
- Frontend runtime: Vite served `/login` at `http://localhost:5173` with HTTP 200. Gateway CORS preflight for that exact origin returned HTTP 200. The `127.0.0.1` origin alias is not in `allowedOrigins` and returned 403; use the configured localhost origin.
- Negative login through Gateway: PASS, invalid credentials returned HTTP 401.
- Unauthorized `/me` through Gateway: PASS, both missing and invalid bearer tokens returned HTTP 401.
- Historical result at this checkpoint: positive login, `/me`, refresh, logout and UI redirect were **BLOCKED** because the fresh database had no user. This was resolved by the official public registration flow documented below.
- Historical result at this checkpoint: Change Password was static-only. It was subsequently executed and passed as documented below.
- This was the initial no-credential checkpoint. The completed verification below supersedes its blocked/count conclusion.
- Auth source trace: `LoginPage.onSubmit` -> `auth.store.login` -> `authApi.login` -> `apiClient.post` -> `http://localhost:8080/api/v1/auth/login`; browser execution verified login, `/me`, Bearer injection, CUSTOMER redirect and session persistence.

## Phase 1A/1B Auth runtime completion (2026-09-16)

- Safe account path: no seeded/demo user existed, so the official public Gateway registration endpoint created disposable active CUSTOMER `tes***@gmail.com`. No SQL write, seed change, manual role assignment, backend edit, shared-account mutation, token or plaintext password was recorded.
- Direct Gateway verification: register 201; invalid login 401; valid login 200; `/me` 200; refresh 200 and renewed access accepted; CUSTOMER request to `/api/v1/users` 403; password change 200, old password 401, new password 200; logout 200 and revoked refresh 401.
- Browser verification at `http://localhost:5173`: login 200, `/me` 200 with Bearer, redirect to `/customer/equipment`, CUSTOMER identity rendered, session saved to `localStorage`, and authenticated route retained after reload.
- Browser logout: the account-menu confirmation flow cleared Auth storage and returned to `/login`.
- Logout caveat: an already-issued stateless access JWT remains valid until its expiry, while the refresh session is revoked immediately.
- Capability transition: Login, Me, Refresh, Logout and Change Password moved to `RUNTIME VERIFIED`. Global primary-status counts remain mutually exclusive and total 128.

## Verdict

## Phase 3A/3B environment readiness (2026-09-16)

### Auth audit reconciliation

| ID | Capability | Before | Runtime evidence | Decision | After |
|---|---|---|---|---|---|
| AUTH-AUDIT-001 | session persistence and Bearer attachment | CODE WIRED | browser session persisted in localStorage, survived reload, `/me` used Bearer and returned 200, logout cleared storage | evidence is complete | RUNTIME VERIFIED |
| AUTH-AUDIT-002 | protected/role routing and authenticated reload | CODE WIRED | CUSTOMER redirected to `/customer/equipment`, protected reload passed, negative 401 and insufficient-authority 403 were verified | evidence is complete | RUNTIME VERIFIED |

These were the two implicit Auth capabilities present in the module roll-up but absent as separate detailed rows. Documentation-only transition: CODE WIRED 47 → 45 and RUNTIME VERIFIED 5 → 7. Total remains 128.

### Runtime recovery

- Exact previous failure: Docker Desktop frontend/backend processes were running, while the WSL2 `docker-desktop` distro and `com.docker.service` were stopped. Docker CLI calls hung or returned HTTP 500 on the `dockerDesktopLinuxEngine` pipe.
- Root cause classification: `WSL_BACKEND / DOCKER_DESKTOP_ENGINE`; active context `desktop-linux` was correct.
- Repair: graceful Docker CLI shutdown was ineffective, so only the stuck Docker Desktop processes were stopped and Docker Desktop was reopened. No `wsl --shutdown`, factory reset, prune, database-container removal or volume removal was used.
- Docker Desktop 4.80.0 / Engine 29.6.1 API 1.55 recovered. Existing MySQL, Redis and RabbitMQ containers returned healthy and retained all schemas/data.
- Identity container was reused. Organization, Inventory, Rental, Logistics, Billing and Maintenance were started one at a time from the existing backend runtime image and existing databases. Gateway was recreated as a stateless container with downstream URLs on the existing project network.
- Gateway health and all seven Gateway-to-service health routes returned HTTP 200.
- Direct host health returned 200 on 8080, 8081, 8082, 8083, 8085, 8086 and 8087. Rental returned HTTP 200 internally and through Gateway, but Docker did not materialize its requested host binding on 8084; direct `localhost:8084` remains unavailable.
- Host Java is 23.0.1; backend requires Java 21. The runtime image supplies Java 21 and Maven 3.9, so native Maven installation is not required.

### Bootstrap audit

`BOOTSTRAP-GAP-001` is confirmed:

- Only ADMIN has `identity.user.create` and `organization.profile.update` in the seeded role-permission matrix.
- The persisted identity database contains only the masked disposable CUSTOMER; it has null organization and no branches.
- The organization database contains zero organizations and zero branches.
- Public registration always assigns CUSTOMER. Official user creation, role assignment and scope assignment require an already privileged identity.
- No default admin, privileged user seed, initial-setup endpoint, migration-created admin or documented privileged credential exists.

Therefore the official chain first admin → test organization → test branch → scoped ADMIN/MANAGER/SALES_STAFF/ACCOUNTANT users cannot begin. No direct database modification, JWT manipulation or security bypass was performed. Business testing remains blocked pending an explicitly approved first-admin provisioning mechanism. Operations has zero CODE WIRED capabilities, so no OPERATIONS_STAFF identity is currently needed.

## Phase 3 code-wired runtime verification checkpoint (2026-09-16)

Phase 3 did not transition any capability. Runtime prerequisites failed before business testing, and the required privileged/scoped identities cannot be created through an authorized official flow with the available CUSTOMER account.

### Runtime queue (pre-reconciliation snapshot; superseded by Phase 3A above)

| Module | CODE WIRED at checkpoint | Phase 3 disposition |
|---|---:|---|
| Auth | 2 | Excluded by phase instruction; five core Auth capabilities are already runtime verified |
| Admin | 10 | Pending runtime; blocked |
| Manager | 12 | Pending runtime; blocked |
| Sales | 10 | Pending runtime; blocked; protected WIP untouched |
| Operations | 0 | Skip |
| Accounting | 13 | Pending runtime; blocked |
| Customer | 0 | Skip |
| Common | 0 | Skip |
| **Total CODE WIRED at checkpoint** | **47** | **45 non-Auth capabilities in executable business queue; now reconciled to current CODE WIRED 45** |

Audit gap: the phase brief says both to exclude Auth and to test 47 CODE WIRED capabilities. The module roll-up makes those requirements incompatible: excluding Auth's two CODE WIRED entries leaves 45. The detailed matrix also groups multiple action-level capabilities in single rows, so it is not a one-row-per-capability runtime ledger. Counts were not changed speculatively.

### Runtime bootstrap

| Component | Result | Evidence |
|---|---|---|
| MySQL | PASS | TCP 3306 open |
| Redis | PASS | TCP 6379 open |
| RabbitMQ | PASS | TCP 5672 and management 15672 open |
| Gateway 8080 | DOWN | health request timed out |
| Identity 8081 | DOWN | health request timed out |
| Organization 8082 | DOWN | health request timed out |
| Inventory 8083 | DOWN | health request timed out |
| Rental 8084 | DOWN | health request timed out |
| Logistics 8085 | DOWN | health request timed out |
| Billing 8086 | DOWN | health request timed out |
| Maintenance 8087 | DOWN | health request timed out |
| Frontend 5173 | PASS | HTTP 200 |

Docker-backed infrastructure ports remained open, but Docker Engine API requests returned HTTP 500 for both default and downgraded API versions. Maven is not installed and no Maven wrapper or built service JAR exists in the backend worktree. No container, volume, database or Windows service was reset/stopped.

### Test identities and scope

| Role | Available | Scope | Safe creation path available now |
|---|---|---|---|
| ADMIN | No | none | No; official user creation requires `identity.user.create` |
| MANAGER | No | none | No; same privileged endpoint |
| SALES_STAFF | No | none | No; same privileged endpoint |
| OPERATIONS_STAFF | No | none | No; same privileged endpoint |
| ACCOUNTANT | No | none | No; same privileged endpoint |
| CUSTOMER | Yes | organization null; no branches | Existing disposable account, suitable for Auth only |

Identity source seeds roles/permissions but no users. Public registration always assigns CUSTOMER. No SQL role assignment, JWT modification, security bypass or backend modification was used.

### Module results

| Module | Queue | Tested | Verified | Failed | Blocked | Root cause |
|---|---:|---:|---:|---:|---:|---|
| Admin | 10 | 0 | 0 | 0 | 10 | SERVICE DOWN; AUTH/ROLE; ORGANIZATION/BRANCH SCOPE |
| Manager | 12 | 0 | 0 | 0 | 12 | SERVICE DOWN; AUTH/ROLE; ORGANIZATION/BRANCH SCOPE; missing safe business data |
| Sales | 10 | 0 | 0 | 0 | 10 | SERVICE DOWN; AUTH/ROLE; ORGANIZATION/BRANCH SCOPE; protected WIP not implicated |
| Operations | 0 | 0 | 0 | 0 | 0 | skipped |
| Accounting | 13 | 0 | 0 | 0 | 13 | SERVICE DOWN; AUTH/ROLE; ORGANIZATION/BRANCH SCOPE; no disposable finance chain |
| Customer | 0 | 0 | 0 | 0 | 0 | skipped |
| Common | 0 | 0 | 0 | 0 | 0 | skipped |

No direct business API was sent because the Gateway and required service for every queued module failed the mandatory health checkpoint. Consequently no frontend runtime test was eligible, no frontend/backend bug was inferred, and all project counts remain unchanged.

## Phase 2 contract mismatch resolution (2026-09-16)

Exactly the five capabilities previously marked `CONTRACT MISMATCH` were re-checked against current frontend source, Gateway routes, downstream controllers, DTOs, enums and response shapes. All five were false positives from the earlier risk-based audit; no frontend or backend source fix was required.

| ID | Module | Route | Feature / capability | Frontend file / function | Method and frontend path | Backend service / endpoint | Mismatch type reviewed | Protected WIP? | Runtime testable? | Result |
|---|---|---|---|---|---|---|---|---|---|---|
| CM-001 | Manager | `/manager/quotation-approvals` | quotation approval list | `manager-quotation-approvals.api.ts` / `getList` | GET `/api/v1/quotations?organizationId&branchId` | rental / `RentalWorkflowController.quotations` | response envelope, pagination | No | No: services unavailable and CUSTOMER lacks role | FALSE POSITIVE → CODE WIRED |
| CM-002 | Manager | `/manager/rentals` | rental-order list | `manager-rentals.api.ts` / `getList` | GET `/api/v1/rental-orders?organizationId&branchId` | rental / `RentalWorkflowController.orders` | response envelope, pagination, enum | No | No: services unavailable and CUSTOMER lacks role | FALSE POSITIVE → CODE WIRED |
| CM-003 | Sales | rental-request routes | list/detail/create request | `sales-rental-workflow.api.ts` / `getRequests`, `getRequest`, `createRequest` | GET/POST `/api/v1/rental-requests` | rental / request mappings | request/response DTO, envelope, enum, date | Yes | No: services unavailable and account lacks scope | FALSE POSITIVE → CODE WIRED |
| CM-004 | Sales | `/sales/quotations` | quotation list | protected page/hook/API / `getQuotations` | GET `/api/v1/quotations?organizationId&branchId` | rental / `RentalWorkflowController.quotations` | response DTO and envelope | Yes | No: services unavailable and account lacks scope | FALSE POSITIVE → CODE WIRED |
| CM-005 | Accounting | `/accounting/receivables` | debt list/detail/aging | `accountant-receivables.api.ts` / `getList`, `getById`, `getAging` | GET `/api/v1/billing/debts[/{id}]` | billing / `BillingController` debt reads | path and raw response | No | No: services unavailable and CUSTOMER lacks role | FALSE POSITIVE → CODE WIRED |

Contract findings:

- CM-001/CM-002: backend list methods return `ApiResponse<List<...>>`; frontend correctly reads `ApiEnvelope<T[]>.data`. No Spring Page is involved.
- CM-003: `RentalRequestCreate`, item validation, `RentalRequestResponse`, `RequestStatus`, `LocalDateTime` strings and nullable fields match the frontend contract.
- CM-004: `QuotationResponse` fields, money values, enum and `LocalDateTime` match the protected implementation. No protected file was edited.
- CM-005: `/api/v1/billing/debts` is the canonical read API and returns raw debt DTOs. `/api/v1/debts` belongs to a separate admin add/reduce controller, so the two Gateway predicates are not conflicting read contracts.
- Direct API and UI runtime were blocked by unavailable services and insufficient CUSTOMER role/scope. These are runtime prerequisites, not contract mismatches.
- Count correction: the previous module roll-up assigned the two Sales and one Accounting mismatch rows inconsistently. The corrected post-resolution module allocation preserves the authoritative global starting totals and final total of 128.

**FULLY INTEGRATED: NO**

The frontend has runtime-verified Auth plus real HTTP wiring in parts of Admin, Manager approvals/rentals/equipment/receivables, Sales customer/rental workflow, and Accounting. It is not complete: whole Customer, Operations, Notifications, Settings, Accounts, most Sales legacy screens, dashboards/reports, and several mutations remain mock, browser-only, unsupported, or UI-only. **RUNTIME VERIFIED = 18** and is limited to Auth.

## Git and safety evidence

- Frontend status before audit: `feature/backend-integration`; protected dirty files were present and only read:
  - `src/modules/quotations/pages/SalesQuotationsPage.tsx` (modified)
  - `src/modules/rentals/api/sales-rental-workflow.api.ts` (modified)
  - `src/modules/rentals/hooks/useSalesRentalWorkflow.ts` (untracked)
- Pre-existing untracked file: `docs/backend-integration/API_INTEGRATION_MATRIX.md`.
- `feat/tu_tran` was not checked out, merged, or used as baseline.
- Backend worktree is clean and detached at the exact `origin/api-gateway` commit.
- Build: PASS (`npm.cmd run build`); Vite emitted only a large-chunk warning.
- Lint: PASS (`npm.cmd run lint`).
- Runtime baseline was initially closed. For Phase 1A/1B, the existing Docker infrastructure plus Identity (8081), Gateway (8080), and Vite (5173) were started without volume reset; health/routing/CORS checks passed.

## Counting method and totals

Counts are derived again from current source, not copied from the old matrix. A capability is one business action or backend-dependent data surface. Search/filter/sort/pagination implemented wholly over an already loaded array are recorded with the parent list capability and are not falsely counted as independent backend integration. Statuses below are mutually exclusive primary statuses; a contract defect takes precedence over `CODE WIRED`.

| Metric | Count | Evidence/method |
|---|---:|---|
| Total route path declarations | 76 | `path=` declarations in `src/app/router/AppRouter.tsx` (includes layout/index targets, `/`, unauthorized and `*`) |
| Routed page instances | 69 | 68 distinct page components; `CustomerRentalRequestCreatePage` is used by two routes |
| Total page source files | 68 | 66 module `*Page.tsx` plus two shared pages |
| Total features | 22 | Routed domain modules, listed in module table |
| Total capabilities | 128 | Action-level ledger and module roll-up below |
| Frontend API files | 23 | `src/**/*.api.ts` |
| Frontend public API functions/methods | 105 | exported function plus callable members of exported API objects |
| Backend public gateway endpoints | 307 | method mappings in service controllers rooted at `/api/v1`; excludes 13 internal, 7 service health, and gateway health |
| Backend REST controllers | 63 | main source only; tests excluded |
| Backend DTO/request/response classes | 229 | backend files ending Request/Response/Dto |

### Primary capability status counts

| Status | Count |
|---|---:|
| ✅ CODE WIRED | 45 |
| ✅ RUNTIME VERIFIED | 7 |
| 🟡 PARTIAL | 16 |
| 🔴 MOCK | 37 |
| 🟠 LOCAL BACKEND STORAGE | 4 |
| ⚪ NOT WIRED | 17 |
| ❌ BACKEND MISSING | 2 |
| ⚠️ CONTRACT MISMATCH | 0 |
| ⚠️ CONFIG ISSUE | 0 |
| ❓ UNKNOWN | 0 |
| **TOTAL** | **128** |

API usage review found **18 unused/orphan public API methods**. These include explicit `unsupported()` members and reset/mock compatibility members; they are not counted as integrated. The most important examples are Accounts (all 8), Settings (3), branch manager assignment/reset, category delete/reset, invoice payment compatibility methods, manager contract reject/reset, manager rental extend/reset, and manager quotation detail/reset.

## Route inventory

All routes are guarded first by `ProtectedRoute`, except login/register and `*`. Role sections also use `RoleRoute`; common routes have authentication but no role restriction.

| Role | Routes | Pages / feature | Guard | Data source/API status |
|---|---|---|---|---|
| Public | `/login`, `/register` | Login, Register / Auth | `GuestRoute` | Login wired; register not wired |
| Common | `/`, `/unauthorized`, `/profile`, `/notifications`, `/settings`, `*` | redirect, error, Profile, Notifications, Account Settings | protected except `*` | Profile/account password partial; notifications mock/store |
| Admin | `/admin`, `/admin/dashboard`, `/admin/accounts`, `/admin/employees`, `/admin/branches`, `/admin/categories`, `/admin/settings`, `/admin/reports` | 7 domain pages plus index redirect | ADMIN | mixed real API, unsupported, mock/local |
| Manager | `/manager`, `/manager/dashboard`, `/manager/quotation-approvals`, `/manager/contract-approvals`, `/manager/rentals`, `/manager/deliveries`, `/manager/receivables`, `/manager/equipment` | 7 pages plus index | MANAGER | partial; deliveries/dashboard retain mock data |
| Sales | `/sales`, `/sales/dashboard`, `/sales/customers`, `/sales/customers/:customerId`, `/sales/rental-requests`, `/sales/rental-requests/create`, `/sales/rental-requests/all`, `/sales/rental-requests/equipment`, `/sales/rental-requests/:requestId`, `/sales/quotations`, `/sales/quotations/create`, `/sales/quotations/activities`, `/sales/quotations/:quotationId`, `/sales/rentals`, `/sales/rentals/create`, `/sales/rentals/activities`, `/sales/rentals/:rentalId`, `/sales/contracts`, `/sales/contracts/create`, `/sales/contracts/activities`, `/sales/contracts/:contractId` | 20 pages plus index | SALES_STAFF | new workflow partly wired; legacy screens largely static/UI-only |
| Operations | `/operations`, `/operations/equipment`, `/operations/deliveries`, `/operations/returns`, `/operations/maintenance` | 4 pages plus index | OPERATIONS_STAFF | mock/static, no operations API layer |
| Accounting | `/accounting`, `/accounting/invoices`, `/accounting/payments`, `/accounting/deposits`, `/accounting/receivables`, `/accounting/reconciliation`, `/accounting/revenue-reports` | 6 pages plus index | ACCOUNTANT | strongest real wiring; reconciliation remains client-derived |
| Customer | `/customer`, `/customer/equipment`, `/customer/equipment/:equipmentId`, `/customer/equipment/:equipmentId/rental-request`, `/customer/rental-requests`, `/customer/rental-requests/create`, `/customer/rental-requests/:requestId`, `/customer/quotations`, `/customer/quotations/:quotationId`, `/customer/contracts`, `/customer/contracts/:contractId`, `/customer/invoices`, `/customer/invoices/:invoiceId`, `/customer/return-requests`, `/customer/return-requests/create`, `/customer/return-requests/:returnRequestId`, `/customer/incidents`, `/customer/incidents/create`, `/customer/incidents/:incidentId` | 18 route patterns / 17 distinct pages | CUSTOMER | mock imports and UI-only mutations throughout |

## Capability/action matrix

`—` means the chain ends before that layer. Gateway path is identical to frontend path unless explicitly noted. This ledger gives evidence at action level; repetitive client-only filters are described in notes rather than mislabeled as backend actions.

| Role | Route | Page | Feature | Capability / user action | UI handler / hook | Frontend API function | Method / frontend path | Gateway/backend evidence | Data source | Wired / contract / coverage / runtime | Status / notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Public | `/login` | LoginPage | Auth | login | auth store | `authApi.login` | POST `/api/v1/auth/login` | identity `AuthController` | HTTP | yes / runtime match / exists / yes | ✅ RUNTIME VERIFIED |
| Public | `/register` | RegisterPage | Auth | register | auth store | `authApi.register` | — | no call from implementation | none | no / n/a / endpoint exists / no | ⚪ NOT WIRED |
| Common | `/profile` | ProfilePage | Profile | view current user | store / `getMe` | `authApi.getMe` | GET `/api/v1/auth/me` | identity `AuthController` | HTTP/store | yes / runtime match / exists / yes | ✅ RUNTIME VERIFIED |
| Common | `/profile` | ProfilePage | Profile | update profile | edit dialog | `authApi.updateProfile` | PUT `/api/v1/auth/me` | identity `AuthController` | HTTP | yes / unverified DTO / exists / no | 🟡 PARTIAL |
| Common | `/settings` | AccountSettingsPage | Account settings | change password | ChangePasswordForm | `authApi.changePassword` | PUT `/api/v1/auth/password` | identity `AuthController` | HTTP | yes / runtime match / exists / yes | ✅ RUNTIME VERIFIED |
| Common | header/store | AppHeader | Auth | refresh token | authenticated client | `authApi.refresh` | POST `/api/v1/auth/refresh` | identity `AuthController` | HTTP/token storage | yes / runtime match / exists / yes | ✅ RUNTIME VERIFIED |
| Common | header | AccountMenu | Auth | logout | store | `authApi.logout` | POST `/api/v1/auth/logout` | identity `AuthController` | HTTP/token storage | yes / runtime match / exists / yes | ✅ RUNTIME VERIFIED |
| Common | `/notifications` | NotificationsPage | Notifications | list/unread/filter | notification store | — | — | no notification controller found | mock + Zustand | no / n/a / missing / no | 🔴 MOCK |
| Common | `/notifications` | NotificationsPage | Notifications | mark one read | store action | — | — | missing | Zustand memory | no / n/a / missing / no | ❌ BACKEND MISSING |
| Common | `/notifications` | NotificationsPage | Notifications | mark all read/delete/preferences/polling | store actions | — | — | missing | Zustand/mock | no / n/a / missing / no | 🟡 PARTIAL (four UI actions, no persistence/realtime) |
| Admin | `/admin/dashboard` | DashboardPage | Dashboard | KPI cards/charts/recent | inline/static | — | — | many possible endpoints but none called | hard-coded | no / n/a / n/a / no | 🔴 MOCK |
| Admin | `/admin/accounts` | AccountsPage | Accounts | list/detail | query handlers | `accountsApi.getAll/getById` | — (`unsupported`) | identity users endpoints exist | none | no / n/a / exists / no | ⚪ NOT WIRED |
| Admin | `/admin/accounts` | AccountsPage | Accounts | create/update/lock/reset password/delete | modal/actions | five `accountsApi` members | — (`unsupported`) | identity user endpoints partially exist | none | no / n/a / partial / no | ⚪ NOT WIRED |
| Admin | `/admin/employees` | EmployeesPage | Employees | list/detail | page handlers | `employeesApi.list/getById` | GET organization employee/assignment paths | organization-customer controllers | HTTP | yes / match risk / exists / no | ✅ CODE WIRED |
| Admin | `/admin/employees` | EmployeesPage | Employees | create/update/delete | form/actions | `create/update/remove` | POST/PUT/DELETE org employee paths | `EmployeeController` | HTTP | yes / partial DTO / exists / no | 🟡 PARTIAL |
| Admin | `/admin/employees` | EmployeesPage | Employees | transfer branch/status | dialogs | `transferBranch/updateStatus` | assignment POST/PATCH | assignment controller | HTTP | yes / risk / exists / no | 🟡 PARTIAL |
| Admin | `/admin/branches` | BranchesPage | Branches | list/detail | page handlers | `list/getById` | GET organizations + branches | `OrganizationController`, `BranchController` | HTTP | yes / match / exists / no | ✅ CODE WIRED |
| Admin | `/admin/branches` | BranchesPage | Branches | create/update/status/delete | dialogs/actions | API object methods | POST/PUT/PATCH/DELETE branch path | `BranchController` | HTTP | yes / partial / exists / no | 🟡 PARTIAL |
| Admin | `/admin/branches` | BranchesPage | Branches | assign manager/reset sample | dialogs | `assignManager/resetMockData` | — unsupported | backend coverage differs | stale local-storage copy/UI | no / n/a / partial / no | 🟠 LOCAL BACKEND STORAGE |
| Admin | `/admin/categories` | EquipmentCategoriesPage | Categories | list/detail/create/update/status | handlers | category API methods | GET/POST/PUT/PATCH `/api/v1/inventory/categories` | inventory `EquipmentCategoryController` | HTTP | yes / match risk / exists / no | ✅ CODE WIRED |
| Admin | `/admin/categories` | EquipmentCategoriesPage | Categories | hierarchy/delete/reset | modal/actions | unsupported methods | — | delete/hierarchy contract not provided as UI expects | stale storage/mock | no / n/a / partial / no | 🟠 LOCAL BACKEND STORAGE |
| Admin | `/admin/settings` | SystemSettingsPage | Settings | load/update/reset settings | page handlers | `systemSettingsApi.*` | — (`unsupported`) | no settings endpoint found | legacy localStorage file | no / n/a / missing / no | ❌ BACKEND MISSING |
| Admin | `/admin/reports` | AdminReportsPage | Reports | cards/charts/date/org filters | API wrapper | `adminReportsApi.getOverview` | — delayed cloned mock | no matching aggregate endpoint | mock | no / n/a / partial / no | 🔴 MOCK |
| Admin | `/admin/reports` | AdminReportsPage | Reports | export | client action | — | client-generated | — | mock-derived download | no / n/a / n/a / no | 🔴 MOCK |
| Manager | `/manager/dashboard` | ManagerDashboardPage | Dashboard | all cards/charts/tasks/recent rentals | page query | `managerDashboardApi.getOverview` | — aggregates `manager-dashboard.mock` | no HTTP call | mock | no / n/a / endpoints fragmented / no | 🔴 MOCK |
| Manager | `/manager/quotation-approvals` | ManagerQuotationApprovalsPage | Quotations | list | page query | `getList` | GET `/api/v1/quotations?...` | rental `RentalWorkflowController` | HTTP | yes / list envelope matches / exists / role-blocked | ✅ CODE WIRED |
| Manager | same | same | Quotations | approve/reject | decision handler | `approve/reject` | PATCH approve/reject | same controller | HTTP | yes / match / exists / no | ✅ CODE WIRED |
| Manager | same | same | Quotations | detail | drawer | `getById` | — unsupported | GET quotation by id is absent in controller | none | no / n/a / missing operation / no | ⚪ NOT WIRED |
| Manager | `/manager/contract-approvals` | ManagerContractApprovalsPage | Contracts | list/detail/approve | query/actions | manager contract API | GET/PATCH `/api/v1/rental-contracts` | rental `ContractController` | HTTP | yes / partial / exists / no | ✅ CODE WIRED |
| Manager | same | same | Contracts | reject | decision handler | `reject` | — unsupported | controller has approve/sign/cancel/liquidate, no reject | none | no / n/a / missing operation / no | ⚪ NOT WIRED |
| Manager | `/manager/rentals` | ManagerRentalsPage | Rentals | list | query | `getList` | GET `/api/v1/rental-orders` | rental workflow | HTTP | yes / list envelope matches / exists / role-blocked | ✅ CODE WIRED |
| Manager | same | same | Rentals | confirm/cancel | action handlers | `confirmReservation/cancel` | PATCH confirm/cancel | rental workflow | HTTP | yes / match / exists / no | ✅ CODE WIRED |
| Manager | same | same | Rentals | detail/extend | drawer/dialog | `getById/extend` | — unsupported | detail/extend coverage not exposed as UI expects | none | no / n/a / partial / no | ⚪ NOT WIRED |
| Manager | `/manager/deliveries` | ManagerDeliveriesPage | Deliveries | list/detail/status/reset | page handlers | manager deliveries API | — delayed cloned mock | logistics endpoints exist but unused | mock | no / n/a / exists / no | 🔴 MOCK |
| Manager | `/manager/receivables` | ManagerReceivablesPage | Receivables | list/detail/summary | page handlers | manager -> accountant receivable API | GET `/api/v1/billing/debts` | billing `DebtController` | HTTP + client aggregation | yes / path risk / exists / no | 🟡 PARTIAL |
| Manager | `/manager/equipment` | ManagerEquipmentPage | Equipment | scoped list/detail | query/drawer | manager equipment API | GET `/api/v1/inventory/equipment` | inventory `EquipmentController` | HTTP | yes / match risk / exists / no | ✅ CODE WIRED |
| Sales | `/sales/dashboard` | SalesDashboardPage | Dashboard | all widgets | inline arrays | — | — | endpoints not called | hard-coded | no / n/a / partial / no | 🔴 MOCK |
| Sales | `/sales/customers` | SalesCustomersPage | Customers | list/filter | `useSalesCustomers` | `salesCustomersApi.list` | GET branches + customers | org-customer controllers | HTTP | yes / query risk / exists / no | ✅ CODE WIRED |
| Sales | `/sales/customers/:customerId` | SalesCustomerDetailPage | Customers | detail/edit/action menu | page handlers | — | — | customer detail endpoint exists but unused | static/navigation | no / n/a / exists / no | ⚪ NOT WIRED |
| Sales | rental-request routes | Sales rental pages | Rental requests | list/all/detail/create | sales request hooks/form | workflow API request methods | GET/POST `/api/v1/rental-requests` | `RentalWorkflowController` | HTTP | yes / DTO and list envelope match / exists / scope-blocked | ✅ CODE WIRED (protected WIP untouched) |
| Sales | `/sales/rental-requests/equipment` | SalesRequestedEquipmentPage | Availability | browse requested equipment | local page data | — | — | `/api/v1/equipment/search` exists | static | no / n/a / exists / no | 🔴 MOCK |
| Sales | `/sales/quotations` | SalesQuotationsPage | Quotations | list | `useSalesRentalWorkflow` | `getQuotations` | GET `/api/v1/quotations` | rental workflow | HTTP | yes / DTO and list envelope match / exists / scope-blocked | ✅ CODE WIRED (protected WIP untouched) |
| Sales | same | same | Quotations | create/send/convert | hook handlers | workflow API methods | POST/PATCH/POST quotation paths | rental workflow | HTTP | yes / DTO risk / exists / no | 🟡 PARTIAL (protected WIP) |
| Sales | quotation create/detail/activity routes | three legacy pages | Quotations | create/detail/edit/history | alerts/static handlers | — | — | backend operations exist partly | hard-coded/UI-only | no / n/a / partial / no | 🔴 MOCK |
| Sales | rental order routes | four pages | Rental orders | list/create/detail/reserve/confirm/cancel/history | static/alert handlers | workflow API only used elsewhere | — on these pages | rental endpoints exist | hard-coded/UI-only | no / n/a / exists / no | 🔴 MOCK |
| Sales | contract routes | four pages | Contracts | list/detail/create/extend/download/history | static/alert handlers | workflow API only partially used elsewhere | — on these pages | contract endpoints exist | hard-coded/UI-only | no / n/a / exists / no | 🔴 MOCK |
| Operations | `/operations/equipment` | OperationsEquipmentPage | Equipment | list/filter/detail/status | inline data/handlers | — | — | inventory endpoints exist | static | no / n/a / exists / no | 🔴 MOCK |
| Operations | `/operations/deliveries` | OperationsDeliveriesPage | Delivery | list/assign/start/complete | UI handlers | — | — | logistics delivery endpoints exist | static | no / n/a / exists / no | 🔴 MOCK |
| Operations | `/operations/returns` | OperationsReturnsPage | Returns | list/inspect/confirm return | UI handlers | — | — | logistics return endpoints exist | static | no / n/a / exists / no | 🔴 MOCK |
| Operations | `/operations/maintenance` | OperationsMaintenancePage | Maintenance | list/detail/assign/start/complete | UI handlers | — | — | maintenance endpoints exist | static | no / n/a / exists / no | 🔴 MOCK |
| Accounting | `/accounting/invoices` | AccountantInvoicesPage | Invoices | list/detail/create/issue/cancel | invoice hooks/dialogs | accountant invoice API | GET/POST billing invoice paths | billing invoice controller | HTTP | yes / mapped DTO / exists / no | ✅ CODE WIRED |
| Accounting | same | same | Invoices | edit invoice/payment compatibility actions | dialogs | unsupported API members | — | backend shape differs | none | no / n/a / partial / no | 🟡 PARTIAL |
| Accounting | `/accounting/payments` | AccountantPaymentsPage | Payments | list/detail/record/confirm/cancel | payment hook/dialog | accountant payments API | GET/POST payment paths | billing payment controller | HTTP | yes / partial mapping / exists / no | ✅ CODE WIRED |
| Accounting | same | same | Payments | edit payment | dialog | `update` | — explicit unsupported | no edit endpoint | none | no / n/a / missing operation / no | ⚪ NOT WIRED |
| Accounting | `/accounting/deposits` | AccountantDepositsPage | Deposits | list/detail/create/deduct/refund/history | deposit hook/dialogs | payment API deposit methods | GET/POST deposit paths | billing deposit controller | HTTP | yes / partial DTO / exists / no | ✅ CODE WIRED |
| Accounting | `/accounting/receivables` | AccountantReceivablesPage | Receivables | list/detail/aging | receivable hook | accountant receivable API | GET `/api/v1/billing/debts` | billing `BillingController` | HTTP + client aging | yes / canonical path and raw list match / exists / role-blocked | ✅ CODE WIRED |
| Accounting | same | same | Receivables | update note | dialog | `updateNote` | — throws unsupported | no matching mutation | none | no / n/a / missing operation / no | ⚪ NOT WIRED |
| Accounting | `/accounting/reconciliation` | AccountantReconciliationPage | Reconciliation | list/detail/confirm | hook | reconciliation API | no reconciliation HTTP; derived from payments | no controller used | in-memory overrides | no / n/a / partial / no | 🟠 LOCAL BACKEND STORAGE |
| Accounting | `/accounting/revenue-reports` | AccountantRevenueReportsPage | Reports | revenue/payment/debt/deposit reports | effect/API | billing report API | GET `/api/v1/billing/reports/*` | billing report controller | HTTP | yes / match risk / exists / no | ✅ CODE WIRED |
| Accounting | same | same | Reports | date/branch/org filters and export | UI/client | API fixes current month; export client-side | partial | report endpoints exist | mixed HTTP/client | partial / partial / exists / no | 🟡 PARTIAL |
| Customer | all customer list/detail routes | Customer pages | Equipment, requests, quotations, contracts, invoices, returns, incidents | list/detail/search/filter/pagination | local handlers | — | — | relevant backend endpoints often exist but are unused | imported `customer*.mock.ts` | no / n/a / mixed / no | 🔴 MOCK (17 pages) |
| Customer | create/action routes | Customer pages | same | create request/return/incident, cancel, accept/reject, pay, extend | `console.log`, `window.alert`, local modal state | — | — | backend coverage mixed | UI-only | no / n/a / mixed / no | ⚪ NOT WIRED (12 mutations) |

The grouped Customer/Operations/Sales rows expand to the per-action counts in the status total: 37 mock read surfaces and 17 not-wired mutations overall. File-level evidence is in the named pages and mock files; no grouped row is counted as one capability.

## Sales protected-WIP result

| Capability | Result | Evidence |
|---|---|---|
| LIST rental requests | ✅ CODE WIRED | `useSalesRentalRequests.ts` -> `salesRentalWorkflowApi.getRequests`; source re-check confirms `ApiResponse<List<RentalRequestResponse>>` |
| CREATE rental request | 🟡 PARTIAL | create page calls POST `/api/v1/rental-requests`; request fields and organization/branch scoping need contract/runtime validation |
| LIST quotations | ✅ CODE WIRED | protected page/hook/API left untouched; source re-check confirms list envelope and `QuotationResponse` fields |
| CREATE quotation | 🟡 PARTIAL | API call exists but legacy create route remains alert/static |
| SEND quotation | ✅ CODE WIRED | hook -> PATCH `/api/v1/quotations/{id}/send` -> `RentalWorkflowController` |
| CONVERT quotation | ✅ CODE WIRED | hook -> POST `/api/v1/quotations/{id}/convert-to-order` |
| ORDER LIST | ✅ CODE WIRED (API), UI partial | `getOrders` exists; legacy rental-order pages do not consistently use it |
| CONTRACT LIST | ✅ CODE WIRED (API), UI partial | `getContracts` exists; legacy contract list page does not consistently use it |
| CONTRACT CREATE | ✅ CODE WIRED (API), UI partial | POST `/api/v1/rental-contracts`; legacy create page still uses alert |

## Frontend API inventory summary

| Module/API file | Main public functions | Used by | Status |
|---|---|---|---|
| auth | login, me, refresh, register, profile, password, logout | auth store/pages | mixed USED/PARTIAL; register orphan/unsupported |
| accounts | 8 CRUD/account actions | AccountsPage | ORPHAN/unsupported |
| branches | 8 | BranchesPage | 6 USED, 2 unsupported/orphan |
| employees | 8 | EmployeesPage | USED; contract/runtime unverified |
| equipment categories | 7 | CategoriesPage | 5 USED, 2 unsupported/orphan |
| manager context | 1 | manager layouts/pages | USED |
| manager dashboard | overview/reset | ManagerDashboard | USED but MOCK |
| manager equipment | list/detail | ManagerEquipment | USED |
| manager deliveries | list/detail/reset | ManagerDeliveries | USED but MOCK |
| manager quotations | 5 | ManagerQuotationApprovals | 3 USED HTTP, detail/reset orphan |
| manager contracts | 5 | ManagerContractApprovals | 3 USED HTTP, reject/reset orphan |
| manager rentals | 6 | ManagerRentals | 3 USED HTTP, detail/extend/reset unsupported |
| sales customers | list | SalesCustomers | USED |
| sales rental workflow | 12 | Sales request/quotation WIP hooks/pages | USED/PARTIAL |
| invoices + references | 11 | invoice hooks/pages | USED/PARTIAL |
| payments/deposits | 9 | payment/deposit hooks | USED; update unsupported |
| receivables (accountant/manager) | 8 | receivable pages | USED/PARTIAL; note unsupported |
| reconciliation | 3 | reconciliation hook | USED but browser-memory derived |
| billing reports | 1 | revenue reports | USED |
| admin reports | 2 | AdminReports | MOCK |
| system settings | 3 | SystemSettings | unsupported/orphan |

## Backend endpoint inventory

Gateway `application.yml` routes public paths without a rewrite for these services. Counts are controller method mappings under `/api/v1`, not guessed from frontend strings.

| Service | Public mappings | Gateway path families | Representative controllers |
|---|---:|---|---|
| identity-service | 28 | auth, users, roles, permissions, sessions | `AuthController`, `UserController`, `RoleController`, `SessionController` |
| organization-customer-service | 36 | organizations and nested branches/employees/customers | `OrganizationController`, `BranchController`, `EmployeeController`, `CustomerController` |
| inventory-service | 75 | `/api/v1/inventory/**` | `EquipmentController`, `EquipmentCategoryController`, `WarehouseController` |
| rental-service | 39 | availability, equipment search, requests, quotations, orders, contracts, pricing | `RentalWorkflowController`, `ContractController`, `PricingController` |
| logistics-service | 32 | `/api/v1/logistics/**` | delivery/return controllers |
| billing-service | 41 | `/api/v1/billing/**`, `/api/v1/debts/**` | invoice/payment/deposit/debt/report controllers |
| maintenance-service | 56 | `/api/v1/maintenance/**` | `WorkOrderController`, plan/part/report controllers |
| **Total** | **307** | | |

There are also 13 internal service mappings, 7 service health mappings and one gateway health mapping; these are deliberately excluded from the public business endpoint count.

## Contract and configuration findings

1. **Envelope inconsistency:** Sales and manager rental APIs request `ApiEnvelope<T>` then use `.data`, while many backend controllers return DTOs through differing response conventions. This cannot be accepted without runtime response evidence. Files: `sales-rental-workflow.api.ts`, `manager-rentals.api.ts`, `manager-quotation-approvals.api.ts`, `manager-contract-approvals.api.ts` and the backend rental controllers.
2. **Quotation detail gap:** manager UI has detail behavior but API explicitly throws unsupported; `RentalWorkflowController` exposes list and mutations but no `GET /quotations/{id}`.
3. **Debt path ambiguity/mismatch:** frontend accountant code uses `/api/v1/billing/debts`, while gateway declares both billing and `/api/v1/debts/**` families. DTO/path behavior requires correction or runtime confirmation.
4. **Pagination risk:** frontend frequently aggregates raw arrays and applies client pagination; backend controllers commonly accept Spring-style pagination. Page origin and wrapper (`content` versus array/envelope `data`) are not consistently mapped.
5. **Role/security risk:** frontend guards coarse roles, backend protects capabilities with granular authorities (for example `rental.quotation.send`, `rental.order.create`, `inventory.reservation.confirm`). Menu visibility does not prove the logged-in role owns every authority.
6. **Auth token risk:** storage/header/refresh chain exists, but refresh expiry and response fields were not runtime validated.
7. **URL composition:** default base is `http://localhost:8080` and paths start `/api/v1`, so no duplicate `/api/api` under the default. A deployment value ending in `/api` would create `/api/api/v1`; normalization removes trailing slash only. This is a deployment risk, not a current proven config issue.
8. **`VITE_USE_MOCK_API`:** DEFINED in `vite-env.d.ts`, READ in `core/config/env.ts`, USED BY no module, CONTROLS DATA SOURCE = NO. It is DEAD CONFIG. Default value is `true`, but that value has no switching effect.

## Mock, storage and hard-coded evidence

- Business local-storage implementations remain for accounts, branches, employees, equipment categories and system settings. Current API code no longer imports some of them, but reset UI text and compatibility methods remain; stale files are not evidence of integration.
- Authentication storage is token/session storage and is **not** classified as fake backend.
- Notifications import `notifications.mock.ts` and use a Zustand store; there is no server persistence.
- Customer pages directly import seven `customer*.mock.ts` datasets.
- Manager dashboard, deliveries and admin reports use mock-cloning/delay APIs.
- Operations pages and many Sales pages have direct/static data and mutation handlers ending in `window.alert` or `console.log`.
- Reconciliation builds records from payment data plus in-memory override maps; confirmation is not persisted to a reconciliation endpoint.

## Module completion table

Formula if a percentage is needed: `CODE WIRED / TOTAL CAPABILITIES`; this is static wiring only and must not be read as runtime completion.

| Module | Total | Code wired | Runtime | Partial | Not wired | Mock/storage | Backend missing | Contract | Completion status |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Auth | 9 | 0 | 7 | 0 | 1 | 0 | 1 | 0 | COMPLETE (BLOCKED BY BACKEND GAP) |
| Admin | 24 | 5 | 5 | 4 | 2 | 6 | 2 | 0 | PARTIAL |
| Manager | 19 | 12 | 0 | 2 | 3 | 2 | 0 | 0 | PARTIAL |
| Sales | 26 | 10 | 0 | 5 | 4 | 7 | 0 | 0 | PARTIAL / protected WIP |
| Operations | 14 | 0 | 0 | 0 | 2 | 12 | 0 | 0 | MOCK/NOT WIRED |
| Accounting | 20 | 13 | 0 | 3 | 2 | 2 | 0 | 0 | PARTIAL |
| Customer | 12 | 0 | 0 | 0 | 2 | 10 | 0 | 0 | MOCK/NOT WIRED |
| Common | 4 | 0 | 0 | 1 | 0 | 2 | 1 | 0 | MOCK/MISSING |
| **Total** | **128** | **45** | **7** | **16** | **17** | **41** | **2** | **0** | **NO** |

`Mock/storage = 37 mock + 4 local backend storage`. The two globally missing capabilities are Notifications persistence and System Settings.

## Remaining work (complete grouped backlog)

| Priority / ID | Module / route / capability | Frontend evidence | Backend endpoint | Problem | Remains |
|---|---|---|---|---|---|
| BLOCKER B01 | Non-Auth runtime verification | business API modules | business services | Auth stack is available; business services/flows remain unverified | Run representative non-Auth flows; validate response bodies, status codes, roles and persistence |
| HIGH H01 | Customer all routes | `src/modules/customers/pages`, `mocks` | multiple existing APIs | whole portal mock/UI-only | Build customer API/hooks and wire every read/mutation |
| HIGH H02 | Operations all routes | operations pages | inventory/logistics/maintenance | static/UI-only | Wire list/detail/status/assign/complete/return/maintenance actions |
| HIGH H03 | Notifications | notification pages/store/mock | none found | no persistence | Backend capability or approved alternative, then list/count/read/read-all/polling |
| HIGH H04 | Admin accounts | `accounts.api.ts` | identity users | every method unsupported | Implement mappings and validate DTO/security |
| HIGH H05 | Settings | `system-settings.api.ts` | missing | unsupported/local legacy | Define backend ownership/contract and wire load/update/reset |
| HIGH H06 | Sales legacy quotation/order/contract pages | sales pages | rental endpoints | new API exists but pages remain static/alerts | Consolidate routes onto workflow hooks and remove mock production flow |
| HIGH H07 | Manager deliveries | `manager-deliveries.api.ts` | logistics | cloned mock | Wire list/detail/status/reset semantics |
| HIGH H08 | Dashboards | three dashboard pages/API/mock | fragmented | hard-coded/mock widgets | Define and wire each card/chart/table/recent item |
| HIGH H09 | Accounting reconciliation | reconciliation API | no used endpoint | in-memory confirmation | Backend reconciliation persistence and contract |
| HIGH H10 | Contract/quotation/rental missing actions | manager APIs | rental controllers | detail/reject/extend gaps | Align UI capability or add backend endpoint; then wire/test |
| MEDIUM M01 | Reports | admin and accounting report pages | billing reports only | admin mock; filters/export partial | Server-backed data and correct date/branch/org filters/export |
| MEDIUM M02 | Branch/category advanced actions | APIs and stale storage | org/inventory | manager assignment/hierarchy/delete/reset unsupported | Decide supported UX and wire exact endpoint contracts |
| MEDIUM M03 | Employees | employees API | org-customer | multi-request mapping/assignment risks | Contract and authority tests for create/update/transfer/status/delete |
| MEDIUM M04 | Receivables | accountant/manager APIs | billing debts | path/wrapper and client-aging risk | Canonicalize path and validate debt/payment-status DTOs |
| MEDIUM M05 | Invoice/payment/deposit writes | accounting APIs | billing | several hand-built bodies | DTO tests, validation/error behavior, authorization and persistence tests |
| MEDIUM M06 | API orphans | 18 public methods | mixed | unused/unsupported compatibility surface | Remove from UX or implement; do not count them as coverage |
| LOW L01 | Dead mock switch | `env.ts`, `vite-env.d.ts` | n/a | dead config | Remove or intentionally connect after production data strategy is settled |
| LOW L02 | URL base hardening | `env.ts`, `apiClient.ts` | gateway | possible duplicate `/api` deployment value | Validate deployment env and add URL composition test |
| LOW L03 | Client-only export/pagination/filtering | many pages | mixed | can diverge from server truth | Define server/client ownership and test large datasets |

## Final required summary

```text
=============================================
FULL BACKEND INTEGRATION AUDIT
=============================================

FULLY INTEGRATED:
NO

STATIC CODE COVERAGE:
45 / 128 capabilities are CODE WIRED (35.2%). Another 16 are PARTIAL; 7 Auth capabilities are RUNTIME VERIFIED.

RUNTIME VERIFICATION:
7 / 128. Five core Auth API capabilities plus session/Bearer persistence and protected role routing were runtime verified; business modules remain runtime-unverified.

TOTAL ROUTES:
76 path declarations (69 routed page instances, 68 distinct page components)

TOTAL CAPABILITIES:
128

CODE WIRED:
45

RUNTIME VERIFIED:
7

PARTIAL:
16

MOCK:
37

LOCAL BACKEND STORAGE:
4

NOT WIRED:
17

BACKEND MISSING:
2

CONTRACT MISMATCH:
0

CONFIG ISSUES:
0 (one deployment URL risk and one dead config noted)

TOP 10 REMAINING ITEMS:
1. Runtime-verify representative end-to-end business flows outside Auth.
2. Runtime-verify the now source-confirmed Sales workflow contracts with an authorized scoped account.
3. Replace the entire Customer mock portal with real APIs.
4. Wire Operations equipment/delivery/return/maintenance pages.
5. Provide and wire Notifications persistence/read APIs.
6. Replace unsupported Admin Accounts and System Settings APIs.
7. Move legacy Sales quotation/order/contract screens to the real workflow API.
8. Replace Manager deliveries and all dashboard mock/static widgets.
9. Persist Accounting reconciliation and finish unsupported payment/receivable actions.
10. Resolve manager quotation/contract/rental detail/reject/extend gaps and debt path contracts.

MODULE STATUS:
AUTH: COMPLETE (REGISTER/PROFILE MISSING BACKEND SUPPORT)
ADMIN: PARTIAL
MANAGER: PARTIAL
SALES: PARTIAL / PROTECTED WIP; NO CONFIRMED CONTRACT MISMATCH
OPERATIONS: MOCK / NOT WIRED
ACCOUNTING: PARTIAL (most real HTTP coverage)
CUSTOMER: MOCK / NOT WIRED
COMMON: PARTIAL; NOTIFICATIONS MOCK/MISSING

SAFE CONCLUSION:
Backend chưa được tích hợp hết vào frontend. Bảy capability Auth đã được runtime verified sau khi reconciliation; 5 contract mismatch cũ đều là false positive sau khi đối chiếu source hiện tại. Toàn dự án hiện có 45 code-wired, 16 partial, 37 mock, 4 browser-storage, 17 not wired, 2 backend-missing và 0 contract mismatch. Các module ngoài Auth chưa được runtime xác minh đầy đủ nên hệ thống chưa thể gọi là fully integrated.

FILES CHANGED:
docs/backend-integration/FULL_INTEGRATION_AUDIT.md
docs/backend-integration/API_TEST_LOG.md

SOURCE FILES CHANGED:
NONE

=============================================

AUDIT COMPLETE — NO SOURCE CODE MODIFIED
```

