import {
  Navigate,
} from "react-router";

import {
  getRoleHomePath,
} from "@/core/auth/roleHome";

import {
  useAuthStore,
} from "@/modules/auth/store/auth.store";

export const RoleHomeRedirect = () => {
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
      />
    );
  }

  return (
    <Navigate
      to={getRoleHomePath(user.role)}
      replace
    />
  );
};
