"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { api } from "@/lib/api";
import type { AccountSnapshot, LoginPayload, RegisterPayload, Session } from "@/lib/types";

interface SessionContextValue {
  session: Session | null;
  account: AccountSnapshot | null;
  loading: boolean;
  loggingOut: boolean;
  bootError: string | null;
  login: (payload: LoginPayload) => Promise<Session>;
  register: (payload: RegisterPayload) => Promise<Session>;
  logout: () => Promise<void>;
  refreshAccount: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [account, setAccount] = useState<AccountSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);

  const loadAccount = useCallback(async (hasSession: boolean) => {
    if (!hasSession) {
      setAccount(null);
      return;
    }
    try {
      setAccount(await api.getAccount());
    } catch {
      setAccount(null);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const next = await api.getSession();
      setSession(next);
      setBootError(null);
      await loadAccount(Boolean(next));
    } catch (error) {
      setBootError(error instanceof Error ? error.message : "无法连接诊断服务");
    } finally {
      setLoading(false);
    }
  }, [loadAccount]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const next = await api.login(payload);
      setLoggingOut(false);
      setSession(next);
      await loadAccount(true);
      return next;
    },
    [loadAccount],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const next = await api.register(payload);
      setLoggingOut(false);
      setSession(next);
      await loadAccount(true);
      return next;
    },
    [loadAccount],
  );

  const logout = useCallback(async () => {
    setLoggingOut(true);
    await api.logout();
    setSession(null);
    setAccount(null);
    // 让退出后的跳转先走完，再把守卫交还给 /app
    window.setTimeout(() => setLoggingOut(false), 1500);
  }, []);

  const refreshAccount = useCallback(async () => {
    if (!session) return;
    await loadAccount(true);
  }, [loadAccount, session]);

  const value = useMemo(
    () => ({
      session,
      account,
      loading,
      loggingOut,
      bootError,
      login,
      register,
      logout,
      refreshAccount,
      refreshSession,
    }),
    [
      session,
      account,
      loading,
      loggingOut,
      bootError,
      login,
      register,
      logout,
      refreshAccount,
      refreshSession,
    ],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession 必须在 SessionProvider 内使用");
  }
  return ctx;
}
