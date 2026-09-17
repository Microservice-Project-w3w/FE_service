# API Test Log

Date: 2026-09-16 (Asia/Saigon)  
Scope: Phase 1 runtime and Authentication only. Tokens and secrets are not recorded.

## Runtime checkpoints

| Feature | Method | Endpoint | Expected | Actual | HTTP | Result |
|---|---|---|---|---:|---:|---|
| Identity health | GET | `http://localhost:8081/health` | Identity UP | `service=identity-service`, `status=UP` | 200 | PASS |
| Gateway health | GET | `http://localhost:8080/health` | Gateway UP | `service=api-gateway`, `status=UP` | 200 | PASS |
| Gateway -> Identity routing | GET | `http://localhost:8080/gateway/health/identity` | Identity response through Gateway | Identity health envelope returned | 200 | PASS |
| Frontend | GET | `http://localhost:5173/login` | Vite serves app | HTML returned | 200 | PASS |
| Gateway CORS | OPTIONS | `http://localhost:8080/api/v1/auth/login`, Origin `http://localhost:5173` | configured origin allowed | allow-origin and methods returned | 200 | PASS |
| Gateway CORS alias | OPTIONS | same endpoint, Origin `http://127.0.0.1:5173` | not configured | rejected | 403 | EXPECTED CONFIG BEHAVIOR |

## Authentication API contract

| Capability | Method | Gateway URL | Request DTO | Response DTO | Auth | Expected status |
|---|---|---|---|---|---|---|
| Login | POST | `/api/v1/auth/login` | `LoginRequest { email, password }` | `ApiResponse<AuthResponse>`; data has accessToken, tokenType, expiresIn, refreshToken, userId, email, fullName, role | No | 200 |
| Current user | GET | `/api/v1/auth/me` | none | `ApiResponse<{email,userId,roles}>` | Bearer | 200 |
| Refresh | POST | `/api/v1/auth/refresh` | `RefreshTokenRequest { refreshToken }` | `ApiResponse<AuthResponse>` | No access token required | 200 |
| Logout | POST | `/api/v1/auth/logout` | none | `ApiResponse<Void>` | Bearer | 200 |
| Change password | PUT | `/api/v1/auth/password` | `ChangePasswordRequest { currentPassword, newPassword }` | `ApiResponse<Void>` | Bearer | 200 |

Source: backend `AuthController.java` and auth DTO records in `services/identity-service`; frontend `auth.api.ts`, `authenticatedClient.ts`, `auth.api.helpers.ts`, and `apiClient.ts`.

## Executed Auth tests

| Feature | Method | Endpoint | Expected | Actual | HTTP | Result |
|---|---|---|---|---:|---:|---|
| Login negative | POST | `/api/v1/auth/login` through Gateway | invalid credentials rejected | rejected | 401 | PASS |
| Me without token | GET | `/api/v1/auth/me` through Gateway | unauthorized | unauthorized | 401 | PASS |
| Me invalid token | GET | `/api/v1/auth/me` through Gateway | unauthorized | unauthorized | 401 | PASS |
| Register disposable test account | POST | `/api/v1/auth/register` through Gateway | active CUSTOMER created by public flow | account `tes***@gmail.com`, role CUSTOMER; no SQL/manual role assignment | 201 | PASS |
| Login positive | POST | `/api/v1/auth/login` through Gateway | AuthResponse | access/refresh tokens, Bearer type, 900-second expiry and CUSTOMER identity returned | 200 | PASS |
| Me positive | GET | `/api/v1/auth/me` through Gateway | current user | userId, email and CUSTOMER role returned | 200 | PASS |
| Refresh | POST | `/api/v1/auth/refresh` through Gateway | renewed AuthResponse | new token pair returned; renewed access accepted by `/me` | 200 | PASS |
| Logout | POST | `/api/v1/auth/logout` through Gateway | refresh session revoked | logout succeeded; session refresh token rejected afterward | 200 / 401 | PASS |
| Change password | PUT | `/api/v1/auth/password` through Gateway | password changed | old password rejected and new password accepted | 200 / 401 / 200 | PASS |
| Frontend login UI | POST/GET | UI -> `/api/v1/auth/login`, `/api/v1/auth/me` | network success, store update, role redirect | login 200, me 200 with Bearer; session persisted in localStorage | 200 | PASS |
| Role routing | UI | `/login` -> role home | CUSTOMER role redirect/guard | redirected to `/customer/equipment`; authenticated route survived reload | — | PASS |
| Frontend logout UI | UI/POST | Account menu -> `/api/v1/auth/logout` | clear session and return to login | confirmation flow cleared browser session and returned to `/login` | 200 API verified | PASS |
| 403 behavior | GET | `/api/v1/users` with CUSTOMER token | forbidden for insufficient authority | forbidden | 403 | PASS |

## Contract and frontend trace findings

- Login request path/method/body and AuthResponse envelope match statically between frontend and backend.
- `/me` frontend expects `userId` as a string; backend obtains JWT subject and returns it as a string, so the static contract matches.
- Refresh body `{refreshToken}` and response envelope match statically.
- Logout uses the bearer access token and matches backend authentication requirements.
- Change password matches exactly: frontend and backend use `PUT /api/v1/auth/password` with `currentPassword` and `newPassword`.
- `apiClient` attaches `Authorization: Bearer <token>` when an access token is provided.
- `authenticatedRequest` retries once after HTTP 401 using a single shared refresh promise, then persists the renewed session.
- `ProtectedRoute`, `RoleRoute`, and `RoleHomeRedirect` were runtime verified for the CUSTOMER home redirect and authenticated reload.
- Logout revokes the refresh session. The already-issued stateless access JWT remains valid until expiry; this is backend behavior, not a frontend storage failure.
- No frontend or backend source change was made. No token value or credential is stored in this log.

## Credential resolution

The repository had no seeded/demo user. Testing used the official public registration endpoint to create one disposable active CUSTOMER account (`tes***@gmail.com`). No SQL write, seed modification, manual role assignment, backend source edit, token, or plaintext password was recorded. This removed the Auth runtime blocker.

## Phase 2 — Contract mismatch resolution

Runtime prerequisite check: Gateway, Identity, Rental and Billing health endpoints were unavailable during this phase. The reusable account is CUSTOMER and lacks the manager/accounting authorities and organization/branch scope required by these endpoints. Therefore direct and frontend runtime results are recorded as blocked by runtime/role, not as contract failures.

| ID | Before | Root cause | Change | Direct API result | Frontend result | After |
|---|---|---|---|---|---|---|
| CM-001 Manager quotation list | CONTRACT MISMATCH | old audit assumed pagination/envelope risk; current controller returns `ApiResponse<List<QuotationResponse>>` and frontend reads `.data` as an array | documentation only | BLOCKED: services unavailable; CUSTOMER lacks `rental.quotation.read` | BLOCKED BY ROLE | CODE WIRED |
| CM-002 Manager rental-order list | CONTRACT MISMATCH | old audit assumed envelope risk; backend returns `ApiResponse<List<RentalOrderResponse>>`; frontend DTO and explicit enum map match | documentation only | BLOCKED: services unavailable; CUSTOMER lacks `rental.order.read` | BLOCKED BY ROLE | CODE WIRED |
| CM-003 Sales rental requests | CONTRACT MISMATCH | request DTO, item validation, response DTO, enum, dates, nullability and list envelope match current backend | documentation only; protected API untouched | BLOCKED: services unavailable and account has no business scope | BLOCKED BY ROLE/SCOPE | CODE WIRED |
| CM-004 Sales quotation list | CONTRACT MISMATCH | protected implementation matches `ApiResponse<List<QuotationResponse>>`; no Spring pagination | documentation only; protected page/hook/API untouched | BLOCKED: services unavailable and account has no business scope | BLOCKED BY ROLE/SCOPE | CODE WIRED |
| CM-005 Accounting receivables | CONTRACT MISMATCH | `/api/v1/billing/debts` is the canonical raw-list/read endpoint; `/api/v1/debts` is a separate admin add/reduce controller | documentation only | BLOCKED: services unavailable; CUSTOMER lacks `billing.debt.read` | BLOCKED BY ROLE | CODE WIRED |

No request body containing test data was sent, no destructive action was executed, and no source file was changed. Phase result: 5 false positives resolved; `CONTRACT MISMATCH` moved from 5 to 0 and `CODE WIRED` moved from 42 to 47. Total remains 128.

## Phase 3 — Code-wired runtime verification

### Bootstrap tests

| ID | Module | Capability | Role | Method | Endpoint | Test data | Expected | Actual | HTTP | Frontend result | Final status |
|---|---|---|---|---|---|---|---|---|---:|---|---|
| P3-BOOT-01 | Runtime | MySQL | n/a | TCP | `localhost:3306` | none | reachable | reachable | n/a | n/a | PASS |
| P3-BOOT-02 | Runtime | Redis | n/a | TCP | `localhost:6379` | none | reachable | reachable | n/a | n/a | PASS |
| P3-BOOT-03 | Runtime | RabbitMQ | n/a | TCP | `localhost:5672`, `:15672` | none | reachable | reachable | n/a | n/a | PASS |
| P3-BOOT-04 | Runtime | Gateway | n/a | GET | `http://localhost:8080/health` | none | 200 | timeout | — | blocked | SERVICE DOWN |
| P3-BOOT-05 | Runtime | Identity | n/a | GET | `http://localhost:8081/health` | none | 200 | timeout | — | blocked | SERVICE DOWN |
| P3-BOOT-06 | Runtime | Organization | n/a | GET | `http://localhost:8082/health` | none | 200 | timeout | — | blocked | SERVICE DOWN |
| P3-BOOT-07 | Runtime | Inventory | n/a | GET | `http://localhost:8083/health` | none | 200 | timeout | — | blocked | SERVICE DOWN |
| P3-BOOT-08 | Runtime | Rental | n/a | GET | `http://localhost:8084/health` | none | 200 | timeout | — | blocked | SERVICE DOWN |
| P3-BOOT-09 | Runtime | Logistics | n/a | GET | `http://localhost:8085/health` | none | 200 | timeout | — | blocked | SERVICE DOWN |
| P3-BOOT-10 | Runtime | Billing | n/a | GET | `http://localhost:8086/health` | none | 200 | timeout | — | blocked | SERVICE DOWN |
| P3-BOOT-11 | Runtime | Maintenance | n/a | GET | `http://localhost:8087/health` | none | 200 | timeout | — | blocked | SERVICE DOWN |
| P3-BOOT-12 | Runtime | Frontend | n/a | GET | `http://localhost:5173/` | none | 200 | served | 200 | PASS | PASS |

Docker Engine API returned HTTP 500 while infrastructure TCP ports remained reachable. Maven is unavailable and the backend contains neither a Maven wrapper nor built service JARs, so the verified service startup procedure could not proceed without an external environment repair/change.

### Business queue outcome

| Module | Current CODE WIRED | Tested | Verified | Failed | Blocked | Final status |
|---|---:|---:|---:|---:|---:|---|
| Admin | 10 | 0 | 0 | 0 | 10 | CODE WIRED; runtime blocked |
| Manager | 12 | 0 | 0 | 0 | 12 | CODE WIRED; runtime blocked |
| Sales | 10 | 0 | 0 | 0 | 10 | CODE WIRED; runtime blocked; protected WIP untouched |
| Operations | 0 | 0 | 0 | 0 | 0 | skipped |
| Accounting | 13 | 0 | 0 | 0 | 13 | CODE WIRED; runtime blocked |
| Customer | 0 | 0 | 0 | 0 | 0 | skipped |
| Common | 0 | 0 | 0 | 0 | 0 | skipped |

The available disposable CUSTOMER has no organization or branch scope. ADMIN, MANAGER, SALES_STAFF, OPERATIONS_STAFF and ACCOUNTANT accounts are unavailable; their official creation endpoint requires `identity.user.create`. No SQL write, JWT manipulation, security bypass, mutating business call or shared-data action was performed. At this pre-reconciliation checkpoint there were no transitions: CODE WIRED 47 and RUNTIME VERIFIED 5. Phase 3A later reconciled two evidenced Auth capabilities, producing current counts CODE WIRED 45 and RUNTIME VERIFIED 7; total remains 128.

## Phase 3A/3B — Runtime recovery and identity bootstrap

### Docker diagnosis and repair

| Check | Before | Root cause / action | After |
|---|---|---|---|
| Docker Engine | CLI hung or returned HTTP 500 | Docker Desktop processes existed but WSL2 `docker-desktop` was stopped; graceful shutdown failed, so stuck Docker-only processes were stopped and Desktop reopened | Engine 29.6.1 / API 1.55 PASS |
| Docker context | not queryable while pipe hung | active context inspected after recovery | `desktop-linux`, correct |
| WSL | `docker-desktop` stopped; other distros stopped | no `wsl --shutdown` used | `docker-desktop` running |
| Data safety | persistent infrastructure ports still reachable | no prune/reset/down-v/delete | MySQL/Redis/RabbitMQ healthy; schemas preserved |

### Service readiness

| ID | Service | Direct health | Gateway health | Result |
|---|---|---|---|---|
| P3A-01 | Identity 8081 | 200 | 200 | PASS |
| P3A-02 | Organization 8082 | 200 | 200 | PASS |
| P3A-03 | Inventory 8083 | 200 | 200 | PASS |
| P3A-04 | Rental 8084 | host binding unavailable; internal 200 | 200 | PARTIAL: Docker host-forward issue |
| P3A-05 | Logistics 8085 | 200 | 200 | PASS |
| P3A-06 | Billing 8086 | 200 | 200 | PASS |
| P3A-07 | Maintenance 8087 | 200 | 200 | PASS |
| P3A-08 | Gateway 8080 | 200 | n/a | PASS |
| P3A-09 | Frontend 5173 | 200 | n/a | PASS |

All application services connected to their existing databases. Rental itself is healthy and routable through Gateway; only its direct Docker host port publication is missing. Host Java is 23.0.1, backend target is Java 21, and the reused runtime image supplies Java 21 plus Maven 3.9. Native Maven is not required.

### Auth reconciliation and bootstrap result

| ID | Capability | Evidence | Transition |
|---|---|---|---|
| AUTH-AUDIT-001 | session persistence and Bearer attachment | localStorage persistence/reload, authenticated `/me`, logout cleanup | CODE WIRED → RUNTIME VERIFIED |
| AUTH-AUDIT-002 | protected/role routing | CUSTOMER role redirect, authenticated reload, 401 and 403 behavior | CODE WIRED → RUNTIME VERIFIED |

Current counts: CODE WIRED 45, RUNTIME VERIFIED 7, PARTIAL 16, MOCK 37, LOCAL BACKEND STORAGE 4, NOT WIRED 17, BACKEND MISSING 2, CONTRACT MISMATCH 0; total 128.

`BOOTSTRAP-GAP-001`: only ADMIN owns `identity.user.create` and organization creation authority, but no ADMIN/default privileged user/seed/setup endpoint exists. The database contains only masked CUSTOMER `tes***@gmail.com`, with organization null and no branches; organization and branch counts are zero. Direct DB changes are forbidden and were not performed. ADMIN, MANAGER, SALES_STAFF and ACCOUNTANT test identities remain blocked. No business capability was tested.

## Phase 3D - Organization & Identity Provisioning (Step 6-9)
| ID | Capability | Status | HTTP | Details |
|---|---|---|---|---|
| P3D-01 | Create Organization (POST /api/v1/organizations) | PASS | 201 | Organization TEST_RT_ORG_... (ID: 1) created |
| P3D-02 | Create Branch (POST /api/v1/organizations/1/branches) | PASS | 201 | Branch TEST_RT_BRANCH_... (ID: 1) created |
| P3D-03 | Create MANAGER User (POST /api/v1/users) | PASS | 200 | User created, /me verified role MANAGER |
| P3D-04 | Create SALES_STAFF User (POST /api/v1/users) | PASS | 200 | User created, /me verified role SALES_STAFF |
| P3D-05 | Create ACCOUNTANT User (POST /api/v1/users) | PASS | 200 | User created, /me verified role ACCOUNTANT |
