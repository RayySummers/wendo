/**
 * 领域类型。这份文件是前端与后端（RAY-656 账号/credit、RAY-657 Pi 诊断与 PDF）
 * 之间唯一的形状来源。字段名改动需要两侧同步，契约说明见 docs/api-contract.md。
 */

export type ModelTier = "lite" | "pro" | "max";

export type RiskSeverity = "high" | "medium" | "low";

export type RiskDimension =
  | "language_compliance"
  | "expression_naturalness"
  | "cultural_adaptation"
  | "communication_effectiveness";

export type InputType = "text" | "url";

export interface ReportInput {
  type: InputType;
  /** type === "text" 时的用户原文 */
  text?: string;
  /** type === "url" 时被抓取的单个页面 */
  url?: string;
  /** 页面 <title> 或用户自定义标题 */
  title?: string;
}

export interface Risk {
  id: string;
  severity: RiskSeverity;
  dimension: RiskDimension;
  /** 原文引用，逐字可核对，不做改写 */
  quote: string;
  /** 引用出现的位置，例如「首页 Bestsellers 第 2 个商品」 */
  location?: string;
  /** 为什么这样表达在马来西亚市场有问题 */
  why: string;
  /** 改成什么、怎么改 */
  fix: string;
}

export interface DiagnosisReport {
  id: string;
  createdAt: string;
  /** 目标市场代码，本版固定 malaysia */
  market: string;
  marketLabel: string;
  /** 品类，本版固定 小家电 */
  category: string;
  modelTier: ModelTier;
  input: ReportInput;
  summary: string;
  risks: Risk[];
  strengths: string[];
  notAssessable: string[];
  /** 四维后台分数。仅用于后台排序与统计，网页与 PDF 一律不渲染 */
  dims?: Record<string, number>;
  disclaimer: string;
}

export interface ReportListItem {
  id: string;
  createdAt: string;
  inputType: InputType;
  title: string;
  preview: string;
  riskCount: number;
  topSeverity: RiskSeverity | null;
  modelTier: ModelTier;
  status: "ready" | "failed";
}

export interface LedgerEntry {
  id: string;
  createdAt: string;
  reportId: string;
  modelTier: ModelTier;
  multiplier: number;
  inputTokens: number;
  outputTokens: number;
  creditsCharged: number;
  inputType: InputType;
}

export interface AccountSnapshot {
  /** 余额，credit 允许小数 */
  credits: number;
  ledger: LedgerEntry[];
}

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
}

export interface Session {
  user: SessionUser;
  /** ISO 时间；session 7 天 */
  expiresAt: string;
}

export interface LoginPayload {
  email: string;
  secret: string;
}

export interface RegisterPayload {
  email: string;
  secret: string;
  inviteCode: string;
}

export interface CreateDiagnosisPayload {
  input: ReportInput;
  modelTier: ModelTier;
}

export interface CreateDiagnosisResult {
  reportId: string;
  report: DiagnosisReport;
  ledger: LedgerEntry;
}

/** 前端认识的后端错误码。其它一律归到 unknown。 */
export type ApiErrorCode =
  | "invalid_credentials"
  | "email_taken"
  | "invalid_invite"
  | "invite_exhausted"
  | "insufficient_credit"
  | "scrape_failed"
  | "diagnosis_failed"
  | "unauthorized"
  | "network"
  | "unknown";

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;

  constructor(code: ApiErrorCode, message: string, status = 0) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}
