"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, SignOut } from "@phosphor-icons/react";

import { useSession } from "@/components/SessionProvider";
import { IS_DEMO, api } from "@/lib/api";
import { CREDIT_RATE, TIER_MULTIPLIER } from "@/lib/credit";
import { formatCredits, formatDateTime, formatTokens } from "@/lib/format";

import styles from "./account.module.css";

export default function AccountPage() {
  const router = useRouter();
  const { session, account, logout, refreshAccount } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  const [improvement, setImprovement] = useState(false);
  const [savingImprovement, setSavingImprovement] = useState(false);

  useEffect(() => {
    if (IS_DEMO && api.readImprovementProgram) {
      setImprovement(api.readImprovementProgram());
    }
  }, []);

  const totals = useMemo(() => {
    if (!account) return { spent: 0, calls: 0 };
    return {
      spent: account.ledger.reduce((sum, item) => sum + item.creditsCharged, 0),
      calls: account.ledger.length,
    };
  }, [account]);

  async function handleLogout() {
    setSigningOut(true);
    try {
      await logout();
      router.replace("/");
    } finally {
      setSigningOut(false);
    }
  }

  async function toggleImprovement() {
    if (!api.writeImprovementProgram) return;
    setSavingImprovement(true);
    try {
      const next = !improvement;
      await api.writeImprovementProgram(next);
      setImprovement(next);
    } finally {
      setSavingImprovement(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p className="meta">账户</p>
        <h1 className="pageTitle">余额与消耗</h1>
        <p className="pageLede">
          credit 按 token 扣，每生成一份报告写一条记录，可追溯到报告和档位。
        </p>
      </header>

      <section className={styles.balance} aria-labelledby="balance-label">
        <div>
          <p className={styles.balanceLabel} id="balance-label">
            可用余额
          </p>
          <p className={styles.balanceValue}>
            {account ? formatCredits(account.credits) : "…"}
            <span className={styles.balanceUnit}>credit</span>
          </p>
          <p className={styles.balanceNote}>
            累计 {totals.calls} 次诊断，共扣 {formatCredits(totals.spent)} credit
          </p>
        </div>
        <Link href="/app" className="btn btnPrimary">
          继续诊断
          <ArrowRight size={16} weight="bold" aria-hidden="true" />
        </Link>
      </section>

      <section className={styles.block} aria-labelledby="ledger-title">
        <div className={styles.blockHead}>
          <h2 className={styles.blockTitle} id="ledger-title">
            消耗记录
          </h2>
          <button
            type="button"
            className="btn btnQuiet"
            onClick={() => void refreshAccount()}
          >
            刷新
          </button>
        </div>

        {account && account.ledger.length > 0 ? (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">时间</th>
                  <th scope="col">档位</th>
                  <th scope="col">输入 / 输出 token</th>
                  <th scope="col">倍率</th>
                  <th scope="col" className={styles.numeric}>
                    扣减
                  </th>
                  <th scope="col">报告</th>
                </tr>
              </thead>
              <tbody>
                {account.ledger.map((entry) => (
                  <tr key={entry.id}>
                    <td data-label="时间">{formatDateTime(entry.createdAt)}</td>
                    <td data-label="档位">
                      {entry.modelTier === "lite" ? "Lite" : entry.modelTier}
                    </td>
                    <td data-label="token">
                      {formatTokens(entry.inputTokens)} / {formatTokens(entry.outputTokens)}
                    </td>
                    <td data-label="倍率">
                      {TIER_MULTIPLIER[entry.modelTier]}x
                    </td>
                    <td data-label="扣减" className={styles.numeric}>
                      {entry.creditsCharged.toFixed(3)}
                    </td>
                    <td data-label="报告">
                      <Link
                        href={`/app/reports/${entry.reportId}`}
                        className={styles.reportLink}
                      >
                        打开
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="emptyState">
            <strong>还没有消耗记录</strong>
            <p>做一次诊断，这里会出现第一条扣减。</p>
          </div>
        )}

        <p className={styles.rateNote}>
          费率：Lite 每 1K 输入 {CREDIT_RATE.inputPer1k} credit、每 1K 输出{" "}
          {CREDIT_RATE.outputPer1k} credit，Pro 3x、Max 5x。费率表还在等最终确认，改价只改配置表。
        </p>
      </section>

      <section className={styles.block} aria-labelledby="session-title">
        <h2 className={styles.blockTitle} id="session-title">
          登录状态
        </h2>
        <dl className={styles.sessionGrid}>
          <div>
            <dt>账号</dt>
            <dd>{session?.user.email ?? "…"}</dd>
          </div>
          <div>
            <dt>session 到期</dt>
            <dd>{session ? formatDateTime(session.expiresAt) : "…"}</dd>
          </div>
          <div>
            <dt>权限</dt>
            <dd>个人账号 · 邀请制</dd>
          </div>
        </dl>
        <button
          type="button"
          className="btn btnGhost"
          onClick={handleLogout}
          disabled={signingOut}
        >
          <SignOut size={16} weight="regular" aria-hidden="true" />
          {signingOut ? "正在退出" : "退出登录"}
        </button>
      </section>

      <section className={styles.block} aria-labelledby="privacy-title">
        <h2 className={styles.blockTitle} id="privacy-title">
          数据与隐私
        </h2>
        <div className={styles.privacyRow}>
          <div>
            <p className={styles.privacyTitle}>参与用户体验改进计划</p>
            <p className={styles.privacyBody}>
              默认关闭。开启后允许团队使用脱敏后的对话与报告改进诊断质量，可随时关掉。
            </p>
          </div>
          {IS_DEMO ? (
            <button
              type="button"
              role="switch"
              aria-checked={improvement}
              aria-label="参与用户体验改进计划"
              className={`${styles.switch} ${improvement ? styles.switchOn : ""}`}
              onClick={toggleImprovement}
              disabled={savingImprovement}
            >
              <span className={styles.switchThumb} aria-hidden="true" />
            </button>
          ) : (
            <span className="tag tagLow">已关闭 · 本版不可改</span>
          )}
        </div>
        <p className={styles.privacyFoot}>
          提交的原文保存 30 天，报告长期保存。本版没有端到端加密，数据经我们的服务器转发给模型服务。
        </p>
      </section>
    </div>
  );
}
