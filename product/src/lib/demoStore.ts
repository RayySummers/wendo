import { creditsFor, estimateTokens, roundCredits } from "@/lib/credit";
import { bearMalaysiaReport } from "@/lib/fixtures/bear-malaysia";
import { clampText } from "@/lib/format";
import {
  ApiError,
  type AccountSnapshot,
  type CreateDiagnosisPayload,
  type CreateDiagnosisResult,
  type DiagnosisReport,
  type LedgerEntry,
  type LoginPayload,
  type RegisterPayload,
  type ReportInput,
  type RiskSeverity,
  type ReportListItem,
  type Session,
} from "@/lib/types";

/**
 * 演示数据源。只在浏览器里跑，数据存在 localStorage，用来在没有后端的情况下
 * 走通全部前端流程（登录 / 诊断 / 报告 / 账本 / 退出）。
 *
 * 它不是后端实现，也不该被当成后端：真实数据请用 NEXT_PUBLIC_DATA_SOURCE=api
 * 接 RAY-656 / RAY-657 的接口。所有页面在演示模式下都会显示「演示数据」标记。
 */

const STORAGE_KEY = ["wendo", "demo", "state", "v1"].join("-");

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface DemoUser {
  id: string;
  email: string;
  secret: string;
  displayName: string;
}

interface DemoState {
  session: { userId: string; expiresAt: string } | null;
  users: DemoUser[];
  credits: number;
  ledger: LedgerEntry[];
  reports: DiagnosisReport[];
  invite: { code: string; maxUses: number; usedBy: string[]; expiresAt: string };
  improvementProgram: boolean;
}

const DEMO_SECRET = ["wendo", "2026"].join("-");

function seed(): DemoState {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const user: DemoUser = {
    id: "usr_ray",
    email: "ray@wendo.cn",
    secret: DEMO_SECRET,
    displayName: "Ray",
  };

  const ledger: LedgerEntry[] = [
    {
      id: "led_seed_1",
      createdAt: new Date(now - 2 * day).toISOString(),
      reportId: "rep_bear_my_20261112",
      modelTier: "lite",
      multiplier: 1,
      inputTokens: 1180,
      outputTokens: 960,
      creditsCharged: 0.203,
      inputType: "url",
    },
    {
      id: "led_seed_2",
      createdAt: new Date(now - 6 * day).toISOString(),
      reportId: bearMalaysiaReport.id,
      modelTier: "lite",
      multiplier: 1,
      inputTokens: 640,
      outputTokens: 520,
      creditsCharged: 0.11,
      inputType: "text",
    },
    {
      id: "led_seed_3",
      createdAt: new Date(now - 9 * day).toISOString(),
      reportId: bearMalaysiaReport.id,
      modelTier: "lite",
      multiplier: 1,
      inputTokens: 1420,
      outputTokens: 1010,
      creditsCharged: 0.223,
      inputType: "text",
    },
  ];

  return {
    session: null,
    users: [user],
    credits: 12.4,
    ledger,
    reports: [bearMalaysiaReport],
    invite: {
      code: "WENDO-DEMO",
      maxUses: 1,
      usedBy: [],
      expiresAt: new Date(now + 30 * day).toISOString(),
    },
    improvementProgram: false,
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function summarize(report: DiagnosisReport): ReportListItem {
  const rank: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const top = [...report.risks].sort(
    (a, b) => rank[a.severity] - rank[b.severity],
  )[0];
  return {
    id: report.id,
    createdAt: report.createdAt,
    inputType: report.input.type,
    title:
      report.input.title ||
      report.input.url ||
      clampText(report.input.text ?? "", 48) ||
      "未命名诊断",
    preview: clampText(report.summary, 96),
    riskCount: report.risks.length,
    topSeverity: (top?.severity ?? null) as RiskSeverity | null,
    modelTier: report.modelTier,
    status: "ready",
  };
}

export interface DemoStoreOptions {
  /** 模拟网络延迟，测试里置 0 */
  latencyMs?: number;
}

export function createDemoStore(
  storage: StorageLike,
  options: DemoStoreOptions = {},
) {
  const latency = options.latencyMs ?? 700;

  function wait(ms = latency): Promise<void> {
    if (ms <= 0) return Promise.resolve();
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function read(): DemoState {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = seed();
      storage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    try {
      const parsed = JSON.parse(raw) as DemoState;
      if (!parsed.users?.length) throw new Error("bad seed");
      return parsed;
    } catch {
      const fresh = seed();
      storage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      return fresh;
    }
  }

  function write(state: DemoState): void {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function currentSession(state: DemoState): Session | null {
    if (!state.session) return null;
    if (new Date(state.session.expiresAt).getTime() < Date.now()) return null;
    const user = state.users.find((u) => u.id === state.session?.userId);
    if (!user) return null;
    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      },
      expiresAt: state.session.expiresAt,
    };
  }

  function requireSession(state: DemoState): Session {
    const session = currentSession(state);
    if (!session) {
      throw new ApiError("unauthorized", "登录状态已失效，请重新登录", 401);
    }
    return session;
  }

  function startSession(state: DemoState, user: DemoUser): Session {
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();
    state.session = { userId: user.id, expiresAt };
    write(state);
    return {
      user: { id: user.id, email: user.email, displayName: user.displayName },
      expiresAt,
    };
  }

  return {
    async getSession(): Promise<Session | null> {
      await wait(120);
      return currentSession(read());
    },

    async login(payload: LoginPayload): Promise<Session> {
      await wait();
      const state = read();
      const email = payload.email.trim().toLowerCase();
      const user = state.users.find((u) => u.email.toLowerCase() === email);
      if (!user || user.secret !== payload.secret) {
        throw new ApiError(
          "invalid_credentials",
          "邮箱或密码不正确",
          401,
        );
      }
      return startSession(state, user);
    },

    async register(payload: RegisterPayload): Promise<Session> {
      await wait();
      const state = read();
      const email = payload.email.trim().toLowerCase();
      if (state.users.some((u) => u.email.toLowerCase() === email)) {
        throw new ApiError("email_taken", "这个邮箱已经注册过了", 409);
      }
      const code = payload.inviteCode.trim().toUpperCase();
      if (!code || code !== state.invite.code) {
        throw new ApiError("invalid_invite", "邀请码无效", 422);
      }
      if (new Date(state.invite.expiresAt).getTime() < Date.now()) {
        throw new ApiError("invalid_invite", "邀请码已过期", 422);
      }
      if (state.invite.usedBy.length >= state.invite.maxUses) {
        throw new ApiError("invite_exhausted", "这个邀请码的名额已经用完", 422);
      }
      const user: DemoUser = {
        id: `usr_${Date.now().toString(36)}`,
        email,
        secret: payload.secret,
        displayName: email.split("@")[0],
      };
      state.users.push(user);
      state.invite.usedBy.push(email);
      return startSession(state, user);
    },

    async logout(): Promise<void> {
      await wait(120);
      const state = read();
      state.session = null;
      write(state);
    },

    async getAccount(): Promise<AccountSnapshot> {
      await wait(160);
      const state = read();
      requireSession(state);
      return {
        credits: state.credits,
        ledger: [...state.ledger].sort((a, b) =>
          a.createdAt < b.createdAt ? 1 : -1,
        ),
      };
    },

    async listReports(): Promise<ReportListItem[]> {
      await wait(220);
      const state = read();
      requireSession(state);
      return [...state.reports]
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
        .map(summarize);
    },

    async getReport(id: string): Promise<DiagnosisReport> {
      await wait(220);
      const state = read();
      requireSession(state);
      const report = state.reports.find((r) => r.id === id);
      if (!report) {
        throw new ApiError("unknown", "找不到这份报告", 404);
      }
      return clone(report);
    },

    async createDiagnosis(
      payload: CreateDiagnosisPayload,
    ): Promise<CreateDiagnosisResult> {
      await wait(1500);
      const state = read();
      requireSession(state);
      if (payload.modelTier !== "lite") {
        throw new ApiError("unknown", "Pro / Max 还没开放", 422);
      }
      const input = normalizeInput(payload.input);
      const inputTokens = estimateTokens(
        input.type === "url" ? input.url ?? "" : input.text ?? "",
      );
      const outputTokens = 940;
      const credits = creditsFor("lite", inputTokens, outputTokens);
      if (state.credits < credits) {
        throw new ApiError(
          "insufficient_credit",
          "credit 余额不足，联系 Ray 充值后再试",
          402,
        );
      }

      const report: DiagnosisReport = {
        ...clone(bearMalaysiaReport),
        id: `rep_${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
        input,
      };
      const ledger: LedgerEntry = {
        id: `led_${Date.now().toString(36)}`,
        createdAt: report.createdAt,
        reportId: report.id,
        modelTier: "lite",
        multiplier: 1,
        inputTokens,
        outputTokens,
        creditsCharged: credits,
        inputType: input.type,
      };

      state.reports.unshift(report);
      state.ledger.unshift(ledger);
      state.credits = roundCredits(state.credits - credits);
      write(state);

      return { reportId: report.id, report, ledger };
    },

    pdfUrl(): string | null {
      return null;
    },

    /** 仅演示数据源需要的辅助方法，真实接口没有 */
    async reset(): Promise<void> {
      storage.setItem(STORAGE_KEY, JSON.stringify(seed()));
    },

    async setImprovementProgram(value: boolean): Promise<boolean> {
      await wait(120);
      const state = read();
      requireSession(state);
      state.improvementProgram = value;
      write(state);
      return value;
    },

    getImprovementProgram(): boolean {
      return read().improvementProgram;
    },
  };
}

export function normalizeInput(input: ReportInput): ReportInput {
  if (input.type === "url") {
    const url = (input.url ?? "").trim();
    if (!/^https?:\/\//i.test(url)) {
      throw new ApiError("scrape_failed", "链接需要以 http:// 或 https:// 开头", 422);
    }
    return { type: "url", url };
  }
  const text = (input.text ?? "").trim();
  if (text.length < 40) {
    throw new ApiError(
      "diagnosis_failed",
      "至少贴 40 个字符，太短的内容没法给出可核对的风险",
      422,
    );
  }
  return { type: "text", text };
}
