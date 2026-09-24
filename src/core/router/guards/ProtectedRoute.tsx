import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router";

import { useAuthStore } from "@/modules/auth/store/auth.store";

export const ProtectedRoute = () => {
  const location = useLocation();

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated,
    );

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  return <Outlet />;
};
