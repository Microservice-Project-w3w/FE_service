import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router";

import { AdminLayout } from "@/app/layouts/AdminLayout";
import { AuthLayout } from "@/app/layouts/AuthLayout";

import { GuestRoute } from "@/core/router/guards/GuestRoute";
import { ProtectedRoute } from "@/core/router/guards/ProtectedRoute";

import {
  LoginPage,
  RegisterPage,
} from "@/modules/auth";

import { DashboardPage } from "@/modules/dashboard";

import { ModulePlaceholderPage } from "@/shared/pages/ModulePlaceholderPage";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";

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
          <Route element={<AdminLayout />}>
            <Route
              index
              element={<DashboardPage />}
            />

            <Route
              path="profile"
              element={
                <ModulePlaceholderPage
                  title="Hồ sơ cá nhân"
                  description="Xem và cập nhật thông tin tài khoản."
                />
              }
            />

            <Route
              path="equipment"
              element={
                <ModulePlaceholderPage
                  title="Quản lý thiết bị"
                  description="Theo dõi toàn bộ máy móc và thiết bị sự kiện."
                />
              }
            />

            <Route
              path="inventory"
              element={
                <ModulePlaceholderPage
                  title="Kho thiết bị"
                  description="Quản lý tồn kho và tình trạng sẵn sàng."
                />
              }
            />

            <Route
              path="rentals"
              element={
                <ModulePlaceholderPage
                  title="Đơn thuê"
                  description="Quản lý quy trình thuê và trả thiết bị."
                />
              }
            />

            <Route
              path="deliveries"
              element={
                <ModulePlaceholderPage
                  title="Giao và nhận"
                  description="Quản lý lịch giao, nhận và thu hồi thiết bị."
                />
              }
            />

            <Route
              path="maintenance"
              element={
                <ModulePlaceholderPage
                  title="Bảo trì"
                  description="Theo dõi lịch bảo trì và sửa chữa."
                />
              }
            />

            <Route
              path="customers"
              element={
                <ModulePlaceholderPage
                  title="Khách hàng"
                  description="Quản lý hồ sơ và lịch sử thuê của khách hàng."
                />
              }
            />

            <Route
              path="employees"
              element={
                <ModulePlaceholderPage
                  title="Nhân viên"
                  description="Quản lý nhân viên và phân công công việc."
                />
              }
            />

            <Route
              path="approvals"
              element={
                <ModulePlaceholderPage
                  title="Phê duyệt"
                  description="Theo dõi các yêu cầu đang chờ phê duyệt."
                />
              }
            />

            <Route
              path="reports"
              element={
                <ModulePlaceholderPage
                  title="Báo cáo"
                  description="Theo dõi số liệu kinh doanh và vận hành."
                />
              }
            />

            <Route
              path="settings"
              element={
                <ModulePlaceholderPage
                  title="Cài đặt"
                  description="Thiết lập thông tin và cấu hình hệ thống."
                />
              }
            />
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
