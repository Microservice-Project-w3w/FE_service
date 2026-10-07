import {
  useState,
} from "react";
import {
  Outlet,
  useLocation,
} from "react-router";

import { AppHeader } from "@/app/components/header";
import { PageErrorBoundary } from "@/shared/components/feedback/PageErrorBoundary";

import {
  ROLE_HOME_PATHS,
} from "@/core/auth/roleHome";

import type {
  UserRole,
} from "@/modules/auth/types/auth.types";

import {
  Sidebar,
} from "@/shared/components/navigation";

import {
  ROLE_NAVIGATION,
} from "@/shared/constants/roleNavigation";

interface RoleBasedLayoutProps {
  role: UserRole;
}

export const RoleBasedLayout = ({
  role,
}: RoleBasedLayoutProps) => {
  const location = useLocation();
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const navigationGroups =
    ROLE_NAVIGATION[role];

  const homePath =
    ROLE_HOME_PATHS[role];

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <Sidebar
        groups={navigationGroups}
        homePath={homePath}
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="min-h-screen lg:pl-72">
        <AppHeader
          onOpenSidebar={() =>
            setSidebarOpen(true)
          }
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <PageErrorBoundary key={location.pathname}>
            <Outlet />
          </PageErrorBoundary>
        </main>
      </div>
    </div>
  );
};
