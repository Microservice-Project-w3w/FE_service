import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router";

import { DashboardPage } from "@/modules/dashboard";
import { NotFoundPage } from "@/shared/pages/NotFoundPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<DashboardPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};
