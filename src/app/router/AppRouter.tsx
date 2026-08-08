import { BranchesPage } from "@/modules/branches";
import { EquipmentCategoriesPage } from "@/modules/equipment-categories";
import { SystemSettingsPage } from "@/modules/settings";
import { AdminReportsPage } from "@/modules/reports";
import { EmployeesPage } from "@/modules/employees";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router";

import {
    AccountingLayout,
} from "@/app/layouts/AccountingLayout";

import {
    AdminLayout,
} from "@/app/layouts/AdminLayout";

import {
    AuthLayout,
} from "@/app/layouts/AuthLayout";

import {
    CustomerLayout,
} from "@/app/layouts/CustomerLayout";

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
    AccountsPage,
} from "@/modules/accounts";

import {
    LoginPage,
    RegisterPage,
} from "@/modules/auth";

import {
    CustomerContractDetailPage,
    CustomerContractsPage,
    CustomerEquipmentDetailPage,
    CustomerEquipmentPage,
    CustomerIncidentCreatePage,
    CustomerIncidentDetailPage,
    CustomerIncidentsPage,
    CustomerInvoiceDetailPage,
    CustomerInvoicesPage,
    CustomerQuotationDetailPage,
    CustomerQuotationsPage,
    CustomerRentalRequestCreatePage,
    CustomerRentalRequestDetailPage,
    CustomerRentalRequestsPage,
    CustomerReturnRequestCreatePage,
    CustomerReturnRequestDetailPage,
    CustomerReturnRequestsPage,
} from "@/modules/customers";

import {
    DashboardPage,
    ManagerDashboardPage,
} from "@/modules/dashboard";

import {
    ManagerQuotationApprovalsPage,
} from "@/modules/quotations";

import {
    ManagerContractApprovalsPage,
} from "@/modules/contracts";

import {
    ManagerRentalsPage,
} from "@/modules/rentals";

import {
    ManagerDeliveriesPage,
} from "@/modules/deliveries";

import {
    ManagerReceivablesPage,
} from "@/modules/receivables";

import {
    ManagerEquipmentPage,
} from "@/modules/equipment";

import {
    ModulePlaceholderPage,

} from "@/shared/pages/ModulePlaceholderPage";

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
                <Route element={<GuestRoute />}>
                    <Route element={<AuthLayout />}>
                        <Route
                            path="login"
                            element={<LoginPage />}
                        />

                        <Route
                            path="register"
                            element={<RegisterPage />}
                        />
                    </Route>
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/"
                        element={<RoleHomeRedirect />}
                    />

                    <Route
                        path="unauthorized"
                        element={<UnauthorizedPage />}
                    />

                    {/* ADMIN */}
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
                            element={<AdminLayout />}
                        >
                            <Route
                                index
                                element={
                                    <Navigate
                                        to="dashboard"
                                        replace
                                    />
                                }
                            />

                            <Route
                                path="dashboard"
                                element={<DashboardPage />}
                            />

              <Route
                path="accounts"
                element={<AccountsPage />}
              />

              <Route
                path="employees"
                element={<EmployeesPage />}
              />

              <Route
                path="branches"
                element={<BranchesPage />}
              />

              <Route
                path="categories"
                element={<EquipmentCategoriesPage />}
              />

              <Route
                path="settings"
                element={<SystemSettingsPage />}
              />

              <Route
                path="reports"
                element={<AdminReportsPage />}
              />
            </Route>
          </Route>


                    {/* MANAGER */}
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
                            element={<ManagerLayout />}
                        >
                            <Route
                                index
                                element={
                                    <Navigate
                                        to="dashboard"
                                        replace
                                    />
                                }
                            />

              <Route
                path="dashboard"
                element={<ManagerDashboardPage />}
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
                path="rentals"
                element={
                  <ManagerRentalsPage />
                }
              />

              <Route
                path="deliveries"
                element={
                  <ManagerDeliveriesPage />
                }
              />

              <Route
                path="receivables"
                element={
                  <ManagerReceivablesPage />
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


                    {/* SALES */}
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
                            element={<SalesLayout />}
                        >
                            <Route
                                index
                                element={
                                    <Navigate
                                        to="customers"
                                        replace
                                    />
                                }
                            />

                            <Route
                                path="customers"
                                element={
                                    <ModulePlaceholderPage
                                        title="Khách hàng"
                                        description="Quản lý thông tin và lịch sử giao dịch của khách hàng."
                                    />
                                }
                            />

                            <Route
                                path="rental-requests"
                                element={
                                    <ModulePlaceholderPage
                                        title="Yêu cầu thuê"
                                        description="Tạo và quản lý các yêu cầu thuê thiết bị."
                                    />
                                }
                            />

                            <Route
                                path="quotations"
                                element={
                                    <ModulePlaceholderPage
                                        title="Báo giá"
                                        description="Tạo báo giá và gửi quản lý phê duyệt."
                                    />
                                }
                            />

                            <Route
                                path="rentals"
                                element={
                                    <ModulePlaceholderPage
                                        title="Đơn thuê"
                                        description="Tạo và theo dõi trạng thái đơn thuê."
                                    />
                                }
                            />

                            <Route
                                path="contracts"
                                element={
                                    <ModulePlaceholderPage
                                        title="Hợp đồng"
                                        description="Tạo và theo dõi hợp đồng thuê thiết bị."
                                    />
                                }
                            />
                        </Route>
                    </Route>

                    {/* OPERATIONS */}
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
                            element={<OperationsLayout />}
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
                                    <ModulePlaceholderPage
                                        title="Thiết bị và kho"
                                        description="Quản lý thiết bị, kho, nhập xuất, điều chuyển và kiểm kê."
                                    />
                                }
                            />

                            <Route
                                path="deliveries"
                                element={
                                    <ModulePlaceholderPage
                                        title="Giao thiết bị"
                                        description="Chuẩn bị thiết bị và thực hiện quy trình giao nhận."
                                    />
                                }
                            />

                            <Route
                                path="returns"
                                element={
                                    <ModulePlaceholderPage
                                        title="Nhận trả thiết bị"
                                        description="Tiếp nhận thiết bị trả và đánh giá tình trạng."
                                    />
                                }
                            />

                            <Route
                                path="maintenance"
                                element={
                                    <ModulePlaceholderPage
                                        title="Bảo trì và sửa chữa"
                                        description="Quản lý phiếu bảo trì, sửa chữa và cập nhật trạng thái thiết bị."
                                    />
                                }
                            />
                        </Route>
                    </Route>

                    {/* ACCOUNTANT */}
                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "ACCOUNTANT",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="accounting"
                            element={<AccountingLayout />}
                        >
                            <Route
                                index
                                element={
                                    <Navigate
                                        to="invoices"
                                        replace
                                    />
                                }
                            />

                            <Route
                                path="invoices"
                                element={
                                    <ModulePlaceholderPage
                                        title="Hóa đơn"
                                        description="Tạo và quản lý hóa đơn cho các hợp đồng thuê."
                                    />
                                }
                            />

                            <Route
                                path="payments"
                                element={
                                    <ModulePlaceholderPage
                                        title="Thanh toán"
                                        description="Ghi nhận và xác nhận các khoản thanh toán."
                                    />
                                }
                            />

                            <Route
                                path="deposits"
                                element={
                                    <ModulePlaceholderPage
                                        title="Tiền đặt cọc"
                                        description="Quản lý thu cọc, hoàn cọc và khấu trừ tiền cọc."
                                    />
                                }
                            />

                            <Route
                                path="receivables"
                                element={
                                    <ModulePlaceholderPage
                                        title="Công nợ"
                                        description="Theo dõi các khoản phải thu và thanh toán quá hạn."
                                    />
                                }
                            />

                            <Route
                                path="revenue-reports"
                                element={
                                    <ModulePlaceholderPage
                                        title="Báo cáo doanh thu"
                                        description="Theo dõi và tổng hợp số liệu doanh thu."
                                    />
                                }
                            />
                        </Route>
                    </Route>

                    {/* CUSTOMER */}
                    <Route
                        element={
                            <RoleRoute
                                allowedRoles={[
                                    "CUSTOMER",
                                ]}
                            />
                        }
                    >
                        <Route
                            path="customer"
                            element={<CustomerLayout />}
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

                            {/* Thiết bị */}
                            <Route
                                path="equipment"
                                element={
                                    <CustomerEquipmentPage />
                                }
                            />

                            <Route
                                path="equipment/:equipmentId"
                                element={
                                    <CustomerEquipmentDetailPage />
                                }
                            />

                            {/* Tạo yêu cầu thuê từ thiết bị */}
                            <Route
                                path="equipment/:equipmentId/rental-request"
                                element={
                                    <CustomerRentalRequestCreatePage />
                                }
                            />

                            {/* Yêu cầu thuê của tôi */}
                            <Route
                                path="rental-requests"
                                element={
                                    <CustomerRentalRequestsPage />
                                }
                            />

                            {/* Tạo yêu cầu thuê mới */}
                            <Route
                                path="rental-requests/create"
                                element={
                                    <CustomerRentalRequestCreatePage />
                                }
                            />

                            {/* Chi tiết yêu cầu thuê */}
                            <Route
                                path="rental-requests/:requestId"
                                element={
                                    <CustomerRentalRequestDetailPage />
                                }
                            />

                            {/* Báo giá của tôi */}
                            <Route
                                path="quotations"
                                element={
                                    <CustomerQuotationsPage />
                                }
                            />

                            {/* Chi tiết báo giá */}
                            <Route
                                path="quotations/:quotationId"
                                element={
                                    <CustomerQuotationDetailPage />
                                }
                            />

                            {/* Hợp đồng của tôi */}
                            <Route
                                path="contracts"
                                element={
                                    <CustomerContractsPage />
                                }
                            />

                            {/* Chi tiết hợp đồng */}
                            <Route
                                path="contracts/:contractId"
                                element={
                                    <CustomerContractDetailPage />
                                }
                            />

                            {/* Hóa đơn */}
                            <Route
                                path="invoices"
                                element={
                                    <CustomerInvoicesPage />
                                }
                            />

                            {/* Chi tiết hóa đơn */}
                            <Route
                                path="invoices/:invoiceId"
                                element={
                                    <CustomerInvoiceDetailPage />
                                }
                            />

                            {/* Yêu cầu trả */}
                            <Route
                                path="return-requests"
                                element={
                                    <CustomerReturnRequestsPage />
                                }
                            />

                            {/* Tạo yêu cầu trả */}
                            <Route
                                path="return-requests/create"
                                element={
                                    <CustomerReturnRequestCreatePage />
                                }
                            />

                            {/* Chi tiết yêu cầu trả */}
                            <Route
                                path="return-requests/:returnRequestId"
                                element={
                                    <CustomerReturnRequestDetailPage />
                                }
                            />

                            {/* Báo cáo sự cố */}
                            <Route
                                path="incidents"
                                element={
                                    <CustomerIncidentsPage />
                                }
                            />

                            {/* Tạo báo cáo sự cố */}
                            <Route
                                path="incidents/create"
                                element={
                                    <CustomerIncidentCreatePage />
                                }
                            />

                            {/* Chi tiết báo cáo sự cố */}
                            <Route
                                path="incidents/:incidentId"
                                element={
                                    <CustomerIncidentDetailPage />
                                }
                            />
                        </Route>
                    </Route>
                </Route>

                <Route
                    path="*"
                    element={<NotFoundPage />}
                />
            </Routes>
        </BrowserRouter>
    );
};
