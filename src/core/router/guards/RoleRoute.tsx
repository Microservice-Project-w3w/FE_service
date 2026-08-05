import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router";

import {
  useAuthStore,
} from "@/modules/auth/store/auth.store";

import type {
  UserRole,
} from "@/modules/auth/types/auth.types";

interface RoleRouteProps {
  allowedRoles: UserRole[];
}

export const RoleRoute = ({
  allowedRoles,
}: RoleRouteProps) => {
  const location = useLocation();

  const user = useAuthStore(
    (state) => state.user,
  );

  const isAuthenticated =
    useAuthStore(
      (state) =>
        state.isAuthenticated,
    );

  if (
    !isAuthenticated ||
    !user
  ) {
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

  if (
    !allowedRoles.includes(
      user.role,
    )
  ) {
    return (
      <Navigate
        to="/unauthorized"
        replace
      />
    );
  }

  return <Outlet />;
};
