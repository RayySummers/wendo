import type { ModelTier, RiskDimension, RiskSeverity } from "@/lib/types";

export const TIER_LABEL: Record<ModelTier, string> = {
  lite: "Lite",
  pro: "Pro",
  max: "Max",
};

export const TIER_HINT: Record<ModelTier, string> = {
  lite: "DeepSeek Flash，按 token 计费",
  pro: "更深一层的改写建议",
  max: "全站多页诊断",
};

export const SEVERITY_LABEL: Record<RiskSeverity, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

export const SEVERITY_ORDER: Record<RiskSeverity, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const DIMENSION_LABEL: Record<RiskDimension, string> = {
  language_compliance: "语言合规性",
  expression_naturalness: "表达地道性",
  cultural_adaptation: "文化适配性",
  communication_effectiveness: "沟通效果性",
};

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return dateFormatter.format(d).replace(/\//g, "-");
}

export function formatCredits(value: number): string {
  return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, ".0");
}

export function formatTokens(value: number): string {
  return value.toLocaleString("en-US");
}

export function clampText(value: string, max: number): string {
  const flat = value.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

export function hostOf(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
