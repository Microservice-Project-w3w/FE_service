import {
    Navigate,
} from "react-router";

import {
    RoleBasedLayout,
} from "@/app/layouts/RoleBasedLayout";

import {
    useAuthStore,
} from "@/modules/auth";

export const AccountSettingsRoleLayout = () => {
    const user =
        useAuthStore(
            (state) => state.user,
        );

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return (
        <RoleBasedLayout
            role={user.role}
        />
    );
};