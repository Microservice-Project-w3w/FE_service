import { storageKeys } from "@/core/storage/storageKeys";
import { isAuthSession, parseJson } from "@/modules/auth/api/auth.storage.helpers";
import type { AuthSession, AuthUser } from "@/modules/auth/types/auth.types";

const readSession = (storage: Storage): AuthSession | null => {
  const value = parseJson(storage.getItem(storageKeys.authSession));
  if (isAuthSession(value)) return value;
  if (value !== null) storage.removeItem(storageKeys.authSession);
  return null;
};

export const authStorage = {
  getSession(): AuthSession | null {
    const localSession = readSession(localStorage);
    if (localSession) {
      sessionStorage.removeItem(storageKeys.authSession);
      return localSession;
    }
    return readSession(sessionStorage);
  },
  saveSession(session: AuthSession): void {
    this.clearSession();
    const storage = session.rememberMe ? localStorage : sessionStorage;
    storage.setItem(storageKeys.authSession, JSON.stringify(session));
  },
  updateSessionUser(user: AuthUser): void {
    const session = this.getSession();
    if (session) this.saveSession({ ...session, user });
  },
  clearSession(): void {
    localStorage.removeItem(storageKeys.authSession);
    sessionStorage.removeItem(storageKeys.authSession);
  },
};
