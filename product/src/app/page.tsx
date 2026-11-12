import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";

import { bearMalaysiaReport } from "@/lib/fixtures/bear-malaysia";
import { SEVERITY_LABEL, formatDateTime } from "@/lib/format";

import styles from "./page.module.css";

const steps = [
  {
    num: "01",
    title: "提交",
    body: "粘贴需要诊断的英文文案，或填入一个页面链接。单页抓取，不爬全站。",
  },
  {
    num: "02",
    title: "对照",
    body: "固定工具链抓页面、检索马来西亚小家电知识库，再由 Lite 模型逐条找问题。",
  },
  {
    num: "03",
    title: "落成清单",
    body: "每条风险都带原文引用、为什么有问题、改成什么。不给分数，只给能直接改的建议。",
  },
];

export default function LandingPage() {
  const sample = bearMalaysiaReport;

  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <Link href="/" className={styles.brand} aria-label="文渡 Wendo 首页">
          <span className={styles.brandMark} aria-hidden="true">
            文
          </span>
          <span className={styles.brandName}>
            文渡 <em>Wendo</em>
          </span>
        </Link>
        <nav className={styles.navLinks} aria-label="主要">
          <Link href="/login">登录</Link>
          <Link href="/register">用邀请码注册</Link>
          <Link href="/app" className={`btn btnPrimary ${styles.navCta}`}>
            进入诊断台
          </Link>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>马来西亚 · 小家电 · 演示版</p>
            <h1 className={styles.headline}>
              你的首页，
              <br />
              在当地人眼里是什么样
            </h1>
            <p className={styles.lede}>
              提交一段文案或一个页面，拿到逐条可核对的风险清单：原文、原因、改法。
            </p>
            <div className={styles.heroActions}>
              <Link href="/app" className="btn btnPrimary">
                开始一次诊断
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </Link>
              <Link href="/sample" className="btn btnGhost">
                看小熊电器的样本
                <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
              </Link>
            </div>
            <p className={styles.heroNote}>
              本版只开放 Lite 模型，报告不显示分数。
            </p>
          </div>

          <aside className={styles.sheet} aria-label="诊断报告示例">
            <div className={styles.sheetHead}>
              <span className="meta">诊断报告 / 样本</span>
              <span className={styles.sheetMarket}>{sample.marketLabel}</span>
            </div>
            <h2 className={styles.sheetTitle}>{sample.input.title}</h2>
            <p className={styles.sheetMeta}>
              {sample.input.url} · {formatDateTime(sample.createdAt)}
            </p>
            <p className={styles.sheetSummary}>{sample.summary}</p>
            <div className={styles.sheetRisks}>
              {sample.risks.slice(0, 3).map((risk, index) => (
                <div key={risk.id} className={styles.sheetRisk}>
                  <span className={styles.sheetIndex}>0{index + 1}</span>
                  <div>
                    <span
                      className={`tag ${
                        risk.severity === "high" ? "tagHigh" : "tagMedium"
                      }`}
                    >
                      {SEVERITY_LABEL[risk.severity]}优先级
                    </span>
                    <p className={styles.sheetQuote}>{risk.quote}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.sheetFoot}>
              <span>共 {sample.risks.length} 条风险</span>
              <span>Lite</span>
            </div>
          </aside>
        </section>

        <section className={styles.steps} aria-labelledby="how-it-works">
          <h2 id="how-it-works" className={styles.sectionTitle}>
            一次诊断发生什么
          </h2>
          <ol className={styles.stepList}>
            {steps.map((step) => (
              <li key={step.num} className={styles.step}>
                <span className={styles.stepNum}>{step.num}</span>
                <div className={styles.stepBody}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.scope} aria-labelledby="scope">
          <h2 id="scope" className={styles.sectionTitle}>
            本版做到哪
          </h2>
          <div className={styles.scopeGrid}>
            <div className={styles.scopeCol}>
              <h3 className={styles.scopeHeading}>
                <CheckCircle size={18} weight="regular" aria-hidden="true" />
                已经能用的
              </h3>
              <ul className={styles.scopeList}>
                <li>邮箱登录，session 7 天</li>
                <li>credit 余额与每次消耗记录</li>
                <li>文本与单页链接两种输入</li>
                <li>网页报告，可导出 PDF</li>
              </ul>
            </div>
            <div className={styles.scopeCol}>
              <h3 className={styles.scopeHeading}>
                <WarningCircle size={18} weight="regular" aria-hidden="true" />
                还没做的
              </h3>
              <ul className={styles.scopeList}>
                <li>Pro / Max 档位与多页诊断</li>
                <li>真实支付与自助充值</li>
                <li>马来西亚以外的市场知识库</li>
                <li>企业组织与多席位</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>文渡 Wendo</span>
        <span>出海文化适配诊断 · 2026</span>
      </footer>
    </div>
  );
}
