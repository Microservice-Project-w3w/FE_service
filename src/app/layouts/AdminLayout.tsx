import {
  useState,
} from "react";
import {
  Outlet,
} from "react-router";

import { AppHeader } from "@/app/components/header";

import { Sidebar } from "@/shared/components/navigation";

export const AdminLayout = () => {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <Sidebar
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
          <Outlet />
        </main>
      </div>
    </div>
  );
};
