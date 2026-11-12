import type { ModelTier } from "@/lib/types";

/**
 * 计费配置表（占位费率，等 Ray 确认后替换；数值只改这一个文件）。
 *
 * 口径：credit 按 token 计，档位倍率 Lite 1x / Pro 3x / Max 5x。
 * 本版只开放 Lite，Pro / Max 在 UI 上置灰。
 */
export const TIER_MULTIPLIER: Record<ModelTier, number> = {
  lite: 1,
  pro: 3,
  max: 5,
};

/** 每 1K token 的 credit 单价（Lite 基准，未乘倍率） */
export const CREDIT_RATE = {
  inputPer1k: 0.05,
  outputPer1k: 0.15,
};

export function roundCredits(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function creditsFor(
  tier: ModelTier,
  inputTokens: number,
  outputTokens: number,
): number {
  const raw =
    (inputTokens / 1000) * CREDIT_RATE.inputPer1k +
    (outputTokens / 1000) * CREDIT_RATE.outputPer1k;
  return roundCredits(raw * TIER_MULTIPLIER[tier]);
}

/** 粗略 token 估算，仅用于演示模式生成 ledger；真实数值以后端 usage 为准 */
export function estimateTokens(text: string): number {
  let cjk = 0;
  let other = 0;
  for (const ch of text) {
    if (/[\u3400-\u9fff]/.test(ch)) cjk += 1;
    else other += 1;
  }
  return Math.max(1, Math.round(cjk / 1.6 + other / 4));
}
