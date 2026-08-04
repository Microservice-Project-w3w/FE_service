import { authStorage } from "@/modules/auth/api/auth.storage";

import type {
  AuthSession,
  LoginPayload,
  RegisterPayload,
  StoredAuthUser,
} from "@/modules/auth/types/auth.types";

const wait = async (
  milliseconds: number,
): Promise<void> => {
  await new Promise((resolve) => {
    window.setTimeout(
      resolve,
      milliseconds,
    );
  });
};

const normalize = (
  value: string,
): string => {
  return value.trim().toLowerCase();
};

const createId = (): string => {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `user-${Date.now()}`;
};

const createAccessToken = (): string => {
  return [
    "mock",
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2),
  ].join("-");
};

export const authApi = {
  async login(
    payload: LoginPayload,
  ): Promise<AuthSession> {
    await wait(650);

    const identifier =
      normalize(payload.identifier);

    const user =
      authStorage
        .getUsers()
        .find((item) => {
          return (
            normalize(item.email) ===
              identifier ||
            normalize(item.phone) ===
              identifier
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

    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      accountType: user.accountType,
      role: user.role,
      companyName: user.companyName,
      taxCode: user.taxCode,
    };

    const session: AuthSession = {
      accessToken:
        createAccessToken(),
      user: safeUser,
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
      normalize(payload.email);

    const normalizedPhone =
      normalize(payload.phone);

    const duplicatedEmail =
      users.some((user) => {
        return (
          normalize(user.email) ===
          normalizedEmail
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
          normalize(user.phone) ===
          normalizedPhone
        );
      });

    if (duplicatedPhone) {
      throw new Error(
        "Số điện thoại đã được sử dụng.",
      );
    }

    const newUser: StoredAuthUser = {
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

  async logout(): Promise<void> {
    await wait(250);
    authStorage.clearSession();
  },
};
