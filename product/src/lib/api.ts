import { createDemoStore, type StorageLike } from "@/lib/demoStore";
import {
  ApiError,
  type AccountSnapshot,
  type ApiErrorCode,
  type CreateDiagnosisPayload,
  type CreateDiagnosisResult,
  type DiagnosisReport,
  type LoginPayload,
  type RegisterPayload,
  type ReportListItem,
  type Session,
} from "@/lib/types";

export const DATA_SOURCE: "mock" | "api" =
  process.env.NEXT_PUBLIC_DATA_SOURCE === "api" ? "api" : "mock";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

export const IS_DEMO = DATA_SOURCE === "mock";

/**
 * 前端唯一的数据入口。页面只依赖这个接口，不直接 fetch。
 * 契约见 docs/api-contract.md；切换真实后端：
 *   NEXT_PUBLIC_DATA_SOURCE=api NEXT_PUBLIC_API_BASE=https://... npm run build
 */
export interface WendoApi {
  getSession(): Promise<Session | null>;
  login(payload: LoginPayload): Promise<Session>;
  register(payload: RegisterPayload): Promise<Session>;
  logout(): Promise<void>;
  getAccount(): Promise<AccountSnapshot>;
  listReports(): Promise<ReportListItem[]>;
  getReport(id: string): Promise<DiagnosisReport>;
  createDiagnosis(payload: CreateDiagnosisPayload): Promise<CreateDiagnosisResult>;
  pdfUrl(id: string): string | null;
  /** 仅演示数据源实现 */
  reset?(): Promise<void>;
  readImprovementProgram?(): boolean;
  writeImprovementProgram?(value: boolean): Promise<boolean>;
}

const ERROR_CODES: ApiErrorCode[] = [
  "invalid_credentials",
  "email_taken",
  "invalid_invite",
  "invite_exhausted",
  "insufficient_credit",
  "scrape_failed",
  "diagnosis_failed",
  "unauthorized",
  "network",
  "unknown",
];

function toErrorCode(value: unknown): ApiErrorCode {
  if (typeof value === "string" && (ERROR_CODES as string[]).includes(value)) {
    return value as ApiErrorCode;
  }
  return "unknown";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      ...init,
    });
  } catch {
    throw new ApiError("network", "连不上诊断服务，请稍后再试", 0);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const body = text ? safeParse(text) : null;

  if (!response.ok) {
    const code = toErrorCode(
      (body as { code?: unknown; error?: { code?: unknown } } | null)?.code ??
        (body as { error?: { code?: unknown } } | null)?.error?.code,
    );
    const message =
      (body as { message?: string } | null)?.message ??
      (body as { error?: { message?: string } } | null)?.error?.message ??
      "请求失败";
    throw new ApiError(code, message, response.status);
  }

  return body as T;
}

function safeParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function createHttpApi(base: string): WendoApi {
  return {
    getSession: async () => {
      try {
        return await request<Session>("/api/auth/session");
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    login: (payload) =>
      request<Session>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    register: (payload) =>
      request<Session>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    logout: () => request<void>("/api/auth/logout", { method: "POST" }),
    getAccount: () => request<AccountSnapshot>("/api/account"),
    listReports: () => request<ReportListItem[]>("/api/reports"),
    getReport: (id) => request<DiagnosisReport>(`/api/reports/${id}`),
    createDiagnosis: (payload) =>
      request<CreateDiagnosisResult>("/api/diagnosis", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    pdfUrl: (id) => `${base}/api/reports/${id}/pdf`,
  };
}

const memoryStorage = (() => {
  const map = new Map<string, string>();
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    removeItem: (key: string) => void map.delete(key),
  } satisfies StorageLike;
})();

function browserStorage(): StorageLike {
  if (typeof window === "undefined") return memoryStorage;
  return window.localStorage;
}

const demoStore = createDemoStore(browserStorage());

export const api: WendoApi = IS_DEMO
  ? {
      getSession: demoStore.getSession,
      login: demoStore.login,
      register: demoStore.register,
      logout: demoStore.logout,
      getAccount: demoStore.getAccount,
      listReports: demoStore.listReports,
      getReport: demoStore.getReport,
      createDiagnosis: demoStore.createDiagnosis,
      pdfUrl: demoStore.pdfUrl,
      reset: demoStore.reset,
      readImprovementProgram: demoStore.getImprovementProgram,
      writeImprovementProgram: demoStore.setImprovementProgram,
    }
  : createHttpApi(API_BASE);

export { ApiError };
