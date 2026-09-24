import {
  RoleBasedLayout,
} from "@/app/layouts/RoleBasedLayout";

export const AdminLayout = () => {
  return (
    <RoleBasedLayout role="ADMIN" />
  );
};
