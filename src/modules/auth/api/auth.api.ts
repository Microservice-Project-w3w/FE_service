import {
  createAccessToken,
  createId,
  normalize,
  toAuthUser,
  wait,
} from "@/modules/auth/api/auth.api.helpers";

import {
  authStorage,
} from "@/modules/auth/api/auth.storage";

import type {
  AuthSession,
  AuthUser,
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  StoredAuthUser,
  UpdateProfilePayload,
} from "@/modules/auth/types/auth.types";

export const authApi = {
  async login(
      payload: LoginPayload,
  ): Promise<AuthSession> {
    await wait(650);

    const identifier =
        normalize(
            payload.identifier,
        );

    const user =
        authStorage
            .getUsers()
            .find((item) => {
              return (
                  normalize(
                      item.email,
                  ) === identifier ||
                  normalize(
                      item.phone,
                  ) === identifier
              );
            });

    if (!user) {
      throw new Error(
          "Tài khoản không tồn tại.",
      );
    }

    if (
        user.password !==
        payload.password
    ) {
      throw new Error(
          "Mật khẩu không chính xác.",
      );
    }

    const session: AuthSession = {
      accessToken:
          createAccessToken(),

      user:
          toAuthUser(user),
    };

    authStorage.saveSession(
        session,
        payload.rememberMe,
    );

    return session;
  },

  async register(
      payload: RegisterPayload,
  ): Promise<void> {
    await wait(750);

    const users =
        authStorage.getUsers();

    const normalizedEmail =
        normalize(
            payload.email,
        );

    const normalizedPhone =
        normalize(
            payload.phone,
        );

    const duplicatedEmail =
        users.some((user) => {
          return (
              normalize(
                  user.email,
              ) === normalizedEmail
          );
        });

    if (duplicatedEmail) {
      throw new Error(
          "Email đã được sử dụng.",
      );
    }

    const duplicatedPhone =
        users.some((user) => {
          return (
              normalize(
                  user.phone,
              ) === normalizedPhone
          );
        });

    if (duplicatedPhone) {
      throw new Error(
          "Số điện thoại đã được sử dụng.",
      );
    }

    const newUser:
        StoredAuthUser = {
      id: createId(),

      fullName:
          payload.fullName.trim(),

      email:
          payload.email.trim(),

      phone:
          payload.phone.trim(),

      password:
      payload.password,

      accountType:
      payload.accountType,

      role: "CUSTOMER",

      companyName:
          payload.accountType ===
          "business"
              ? payload.companyName?.trim()
              : undefined,

      taxCode:
          payload.accountType ===
          "business"
              ? payload.taxCode?.trim()
              : undefined,
    };

    authStorage.saveUsers([
      ...users,
      newUser,
    ]);
  },

  async updateProfile(
      userId: string,
      payload:
      UpdateProfilePayload,
  ): Promise<AuthUser> {
    await wait(450);

    const users =
        authStorage.getUsers();

    const userIndex =
        users.findIndex(
            (user) =>
                user.id === userId,
        );

    if (userIndex < 0) {
      throw new Error(
          "Không tìm thấy tài khoản.",
      );
    }

    const fullName =
        payload.fullName.trim();

    const phone =
        payload.phone.trim();

    if (!fullName) {
      throw new Error(
          "Họ và tên không được để trống.",
      );
    }

    if (!phone) {
      throw new Error(
          "Số điện thoại không được để trống.",
      );
    }

    const duplicatedPhone =
        users.some((user) => {
          return (
              user.id !== userId &&
              normalize(
                  user.phone,
              ) ===
              normalize(phone)
          );
        });

    if (duplicatedPhone) {
      throw new Error(
          "Số điện thoại đã được sử dụng.",
      );
    }

    const currentUser =
        users[userIndex];

    const updatedUser:
        StoredAuthUser = {
      ...currentUser,

      fullName,

      phone,

      companyName:
          currentUser.accountType ===
          "business"
              ? (
                  payload.companyName ??
                  ""
              ).trim()
              : undefined,

      taxCode:
          currentUser.accountType ===
          "business"
              ? (
                  payload.taxCode ??
                  ""
              ).trim()
              : undefined,
    };

    const updatedUsers = [
      ...users,
    ];

    updatedUsers[userIndex] =
        updatedUser;

    authStorage.saveUsers(
        updatedUsers,
    );

    const safeUser =
        toAuthUser(
            updatedUser,
        );

    authStorage.updateSessionUser(
        safeUser,
    );

    return safeUser;
  },

  async changePassword(
      userId: string,
      payload:
      ChangePasswordPayload,
  ): Promise<void> {
    await wait(450);

    const users =
        authStorage.getUsers();

    const userIndex =
        users.findIndex(
            (user) =>
                user.id === userId,
        );

    if (userIndex < 0) {
      throw new Error(
          "Không tìm thấy tài khoản.",
      );
    }

    const currentUser =
        users[userIndex];

    if (
        currentUser.password !==
        payload.currentPassword
    ) {
      throw new Error(
          "Mật khẩu hiện tại không chính xác.",
      );
    }

    if (
        payload.newPassword.length <
        8
    ) {
      throw new Error(
          "Mật khẩu mới phải có ít nhất 8 ký tự.",
      );
    }

    if (
        payload.currentPassword ===
        payload.newPassword
    ) {
      throw new Error(
          "Mật khẩu mới phải khác mật khẩu hiện tại.",
      );
    }

    const updatedUsers = [
      ...users,
    ];

    updatedUsers[userIndex] = {
      ...currentUser,

      password:
      payload.newPassword,
    };

    authStorage.saveUsers(
        updatedUsers,
    );
  },

  async logout(): Promise<void> {
    await wait(250);

    authStorage.clearSession();
  },
};