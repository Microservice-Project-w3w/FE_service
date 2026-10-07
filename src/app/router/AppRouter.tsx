import {
    BranchesPage,
} from "@/modules/branches";

import {
    EquipmentCategoriesPage,
} from "@/modules/equipment-categories";

import {
    EmployeesPage,
} from "@/modules/employees";

import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router";

import {
    AdminLayout,
} from "@/app/layouts/AdminLayout";

import {
    AuthLayout,
} from "@/app/layouts/AuthLayout";

import {
    ManagerLayout,
} from "@/app/layouts/ManagerLayout";

import {
    OperationsLayout,
} from "@/app/layouts/OperationsLayout";

import {
    SalesLayout,
} from "@/app/layouts/SalesLayout";

import {
    RoleHomeRedirect,
} from "@/core/router/RoleHomeRedirect";

import {
    GuestRoute,
} from "@/core/router/guards/GuestRoute";

import {
    ProtectedRoute,
} from "@/core/router/guards/ProtectedRoute";

import {
    RoleRoute,
} from "@/core/router/guards/RoleRoute";

import {
    AccountSettingsPage,
    AccountSettingsRoleLayout,
} from "@/modules/account-settings";

import {
    AccountsPage,
} from "@/modules/accounts";

import {
    LoginPage,
    RegisterPage,
} from "@/modules/auth";

import {
    AssistantPage,
} from "@/modules/assistant";

import {
    SalesCustomerDetailPage,
    SalesCustomersPage,
} from "@/modules/customers";

/*
 * QUOTATIONS
 *
 * Import trực tiếp để tránh lỗi barrel export
 * từng gặp trước đó.
 */
import {
    ManagerQuotationApprovalsPage,
} from "@/modules/quotations/pages/ManagerQuotationApprovalsPage";

import {
    SalesQuotationCreatePage,
} from "@/modules/quotations/pages/SalesQuotationCreatePage";

import {
    SalesQuotationDetailPage,
} from "@/modules/quotations/pages/SalesQuotationDetailPage";

import {
    SalesQuotationsPage,
} from "@/modules/quotations/pages/SalesQuotationsPage";

/*
 * CONTRACTS
 */
import {
    ManagerContractApprovalsPage,
    SalesContractCreatePage,
    SalesContractDetailPage,
    SalesContractsPage,
} from "@/modules/contracts";
import { ContractDetailLivePage } from "@/modules/rentals/pages/LiveRentalWorkflowPages";

/*
 * RENTALS
 */
import {
    ManagerRentalsPage,
    SalesAllRentalRequestsPage,
    SalesRentalCreatePage,
    SalesRentalDetailPage,
    SalesRentalRequestCreatePage,
    SalesRentalRequestDetailPage,
    SalesRentalRequestsPage,
    SalesRentalsPage,
} from "@/modules/rentals";

import {
    ManagerEquipmentPage,
    OperationsEquipmentPage,
} from "@/modules/equipment";

import {
    ProfilePage,
    ProfileRoleLayout,
} from "@/modules/profile";

import {
    NotFoundPage,
} from "@/shared/pages/NotFoundPage";

import {
    UnauthorizedPage,
} from "@/shared/pages/UnauthorizedPage";

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* ==================== GUEST ==================== */}
                <Route
                    element={
                        <GuestRoute />
                    }
                >
                    <Route
                        element={
                            <AuthLayout />
                        }
                    >
                        <Route
                            path="login"
                            element={
                                <LoginPage />
                            }
                        />

                        <Route
                            path="register"
                            element={
                                <RegisterPage />
                            }
                        />
                    </Route>
                </Route>

                {/* ==================== PROTECTED ==================== */}
                <Route
                    element={
                        <ProtectedRoute />
                    }
                >
                    <Route
                        path="/"
                        element={
                            <RoleHomeRedirect />
                        }
                    />

                    <Route
                        path="unauthorized"
                        element={
                            <UnauthorizedPage />
                        }
                    />

                    {/* ==================== PROFILE ==================== */}
                    <Route
                        path="profile"
                        element={
                            <ProfileRoleLayout />
                        }
                    >
                        <Route
                            index
                            element={
                                <ProfilePage />
                            }
                        />
                    </Route>

                    {/* ==================== ACCOUNT SETTINGS ==================== */}
                    <Route
                        path="settings"
                        element={
                            <AccountSettingsRoleLayout />
                        }
                    >
                        <Route
                            index
                            element={
                                <AccountSettingsPage />
                            }
                        />
                    </Route>

                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "ADMIN",
                                    "MANAGER",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="assistant"
                            element={
                                <ProfileRoleLayout />
                            }
                        >
                            <Route
                                index
                                element={
                                    <AssistantPage />
                                }
                            />
                        </Route>
                    </Route>

                    {/* ==================== ADMIN ==================== */}
                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "ADMIN",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="admin"
                            element={
                                <AdminLayout />
                            }
                        >
                            <Route
                                index
                                element={
                                    <Navigate
                                        to="accounts"
                                        replace
                                    />
                                }
                            />

                            <Route
                                path="accounts"
                                element={
                                    <AccountsPage />
                                }
                            />

                            <Route
                                path="employees"
                                element={
                                    <EmployeesPage />
                                }
                            />

                            <Route
                                path="branches"
                                element={
                                    <BranchesPage />
                                }
                            />

                            <Route
                                path="categories"
                                element={
                                    <EquipmentCategoriesPage />
                                }
                            />

                        </Route>
                    </Route>

                    {/* ==================== MANAGER ==================== */}
                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "MANAGER",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="manager"
                            element={
                                <ManagerLayout />
                            }
                        >
                            <Route
                                index
                                element={
                                    <Navigate
                                        to="quotation-approvals"
                                        replace
                                    />
                                }
                            />

                            <Route
                                path="quotation-approvals"
                                element={
                                    <ManagerQuotationApprovalsPage />
                                }
                            />

                            <Route
                                path="contract-approvals"
                                element={
                                    <ManagerContractApprovalsPage />
                                }
                            />

                            <Route
                                path="contracts/:contractId"
                                element={<ContractDetailLivePage />}
                            />
                            <Route
                                path="rentals"
                                element={
                                    <ManagerRentalsPage />
                                }
                            />

                            <Route
                                path="equipment"
                                element={
                                    <ManagerEquipmentPage />
                                }
                            />
                        </Route>
                    </Route>

                    {/* ==================== SALES ==================== */}
                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "SALES_STAFF",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="sales"
                            element={
                                <SalesLayout />
                            }
                        >
                            <Route
                                index
                                element={
                                    <Navigate
                                        to="rental-requests"
                                        replace
                                    />
                                }
                            />

                            {/* ==================== KHÁCH HÀNG ==================== */}
                            <Route
                                path="customers"
                                element={
                                    <SalesCustomersPage />
                                }
                            />

                            <Route
                                path="customers/:customerId"
                                element={
                                    <SalesCustomerDetailPage />
                                }
                            />

                            {/* ==================== YÊU CẦU THUÊ ==================== */}
                            <Route
                                path="rental-requests"
                                element={
                                    <SalesRentalRequestsPage />
                                }
                            />

                            <Route
                                path="rental-requests/create"
                                element={
                                    <SalesRentalRequestCreatePage />
                                }
                            />

                            <Route
                                path="rental-requests/all"
                                element={
                                    <SalesAllRentalRequestsPage />
                                }
                            />

                            <Route
                                path="rental-requests/:requestId"
                                element={
                                    <SalesRentalRequestDetailPage />
                                }
                            />

                            {/* ==================== BÁO GIÁ ==================== */}
                            <Route
                                path="quotations"
                                element={
                                    <SalesQuotationsPage />
                                }
                            />

                            <Route
                                path="quotations/create"
                                element={
                                    <SalesQuotationCreatePage />
                                }
                            />

                            <Route
                                path="quotations/:quotationId"
                                element={
                                    <SalesQuotationDetailPage />
                                }
                            />

                            {/* ==================== ĐƠN THUÊ ==================== */}
                            <Route
                                path="rentals"
                                element={
                                    <SalesRentalsPage />
                                }
                            />

                            <Route
                                path="rentals/create"
                                element={
                                    <SalesRentalCreatePage />
                                }
                            />

                            <Route
                                path="rentals/:rentalId"
                                element={
                                    <SalesRentalDetailPage />
                                }
                            />

                            {/* ==================== HỢP ĐỒNG ==================== */}
                            <Route
                                path="contracts"
                                element={
                                    <SalesContractsPage />
                                }
                            />

                            <Route
                                path="contracts/create"
                                element={
                                    <SalesContractCreatePage />
                                }
                            />

                            <Route
                                path="contracts/:contractId"
                                element={
                                    <SalesContractDetailPage />
                                }
                            />
                        </Route>
                    </Route>

                    {/* ==================== OPERATIONS ==================== */}
                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "OPERATIONS_STAFF",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="operations"
                            element={
                                <OperationsLayout />
                            }
                        >
                            <Route
                                index
                                element={
                                    <Navigate
                                        to="equipment"
                                        replace
                                    />
                                }
                            />

                            <Route
                                path="equipment"
                                element={
                                    <OperationsEquipmentPage />
                                }
                            />

                        </Route>
                    </Route>
                </Route>

                {/* ==================== NOT FOUND ==================== */}
                <Route
                    path="*"
                    element={
                        <NotFoundPage />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};
