import {
  Navigate,
  Outlet,
} from "react-router";

import { useAuthStore } from "@/modules/auth/store/auth.store";

export const GuestRoute = () => {
  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated,
    );

  if (isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
};
