"use client";

import Link from "next/link";
import { ArrowLeft, Printer, FilePdf } from "@phosphor-icons/react";

import { api } from "@/lib/api";
import {
  DIMENSION_LABEL,
  SEVERITY_LABEL,
  SEVERITY_ORDER,
  clampText,
  formatDateTime,
  hostOf,
} from "@/lib/format";
import type { DiagnosisReport } from "@/lib/types";

import styles from "./report.module.css";

type Props = {
  report: DiagnosisReport;
  onPrint: () => void;
  backHref?: string;
  backLabel?: string;
};

export function ReportView({
  report,
  onPrint,
  backHref = "/app/reports",
  backLabel = "所有报告",
}: Props) {
  const pdfHref = api.pdfUrl(report.id);
  const prioritized = [...report.risks]
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
    .slice(0, 3);

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <Link href={backHref} className={`btn btnQuiet ${styles.back}`}>
          <ArrowLeft size={15} weight="bold" aria-hidden="true" />
          {backLabel}
        </Link>
        <div className={styles.toolbarActions}>
          {pdfHref ? (
            <a className="btn btnGhost" href={pdfHref} target="_blank" rel="noreferrer">
              <FilePdf size={16} weight="regular" aria-hidden="true" />
              导出 PDF
            </a>
          ) : (
            <button type="button" className="btn btnGhost" onClick={onPrint}>
              <Printer size={16} weight="regular" aria-hidden="true" />
              打印或存为 PDF
            </button>
          )}
        </div>
      </div>

      <article className={styles.sheet} id="report-sheet">
        <header className={styles.head}>
          <p className="meta">诊断报告</p>
          <h1 className={styles.title}>
            {report.input.type === "url"
              ? report.input.title || report.input.url
              : "粘贴文本诊断"}
          </h1>
          {report.input.type === "text" && report.input.text ? (
            <p className={styles.excerpt}>{clampText(report.input.text, 180)}</p>
          ) : null}
          {report.input.url ? (
            <a
              className={styles.source}
              href={report.input.url}
              target="_blank"
              rel="noreferrer"
            >
              {hostOf(report.input.url)}
            </a>
          ) : null}
          <dl className={styles.metaGrid}>
            <div>
              <dt>市场</dt>
              <dd>{report.marketLabel}</dd>
            </div>
            <div>
              <dt>品类</dt>
              <dd>{report.category}</dd>
            </div>
            <div>
              <dt>输入</dt>
              <dd>{report.input.type === "url" ? "单页链接" : "粘贴文本"}</dd>
            </div>
            <div>
              <dt>档位</dt>
              <dd>{report.modelTier === "lite" ? "Lite" : report.modelTier}</dd>
            </div>
            <div>
              <dt>生成</dt>
              <dd>{formatDateTime(report.createdAt)}</dd>
            </div>
          </dl>
        </header>

        <section className={styles.block} aria-labelledby="report-summary">
          <h2 id="report-summary" className={styles.blockTitle}>
            概览
          </h2>
          <p className={styles.summary}>{report.summary}</p>
        </section>

        <section className={styles.block} aria-labelledby="report-priority">
          <h2 id="report-priority" className={styles.blockTitle}>
            优先修改顺序
          </h2>
          <p className={styles.blockNote}>
            按影响面排序，先改前三条，其余可以排进下一次迭代。
          </p>
          <ol className={styles.priorityList}>
            {prioritized.map((risk, index) => {
              const fullRank =
                [...report.risks]
                  .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
                  .findIndex((item) => item.id === risk.id) + 1;
              return (
                <li key={risk.id} className={styles.priorityItem}>
                  <span className={styles.priorityNum}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className={styles.priorityBody}>
                    <span className={`tag ${severityClass(risk.severity)}`}>
                      {SEVERITY_LABEL[risk.severity]}优先级
                    </span>
                    <a href={`#risk-${risk.id}`} className={styles.priorityQuote}>
                      {risk.quote}
                    </a>
                    <p className={styles.priorityFix}>{risk.fix}</p>
                  </div>
                  <span className={styles.priorityIndex}>#{fullRank}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className={styles.block} aria-labelledby="report-risks">
          <h2 id="report-risks" className={styles.blockTitle}>
            风险清单
          </h2>
          <p className={styles.blockNote}>
            共 {report.risks.length} 条。原文逐字引用，方便直接回页面核对。
          </p>
          <ol className={styles.riskList}>
            {report.risks.map((risk, index) => (
              <li key={risk.id} id={`risk-${risk.id}`} className={styles.risk}>
                <div className={styles.riskGutter}>
                  <span className={styles.riskNum}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className={styles.riskBody}>
                  <div className={styles.riskTop}>
                    <span className={`tag ${severityClass(risk.severity)}`}>
                      {SEVERITY_LABEL[risk.severity]}优先级
                    </span>
                    <span className={styles.riskDimension}>
                      {DIMENSION_LABEL[risk.dimension]}
                    </span>
                    {risk.location ? (
                      <span className={styles.riskLocation}>{risk.location}</span>
                    ) : null}
                  </div>

                  <blockquote className={styles.quote}>{risk.quote}</blockquote>

                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>为什么有问题</span>
                    <p>{risk.why}</p>
                  </div>
                  <div className={styles.field}>
                    <span className={styles.fieldLabel}>改成什么</span>
                    <p>{risk.fix}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.block} aria-labelledby="report-strengths">
          <h2 id="report-strengths" className={styles.blockTitle}>
            已经做得好的地方
          </h2>
          <ul className={styles.bulletList}>
            {report.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.block} aria-labelledby="report-gaps">
          <h2 id="report-gaps" className={styles.blockTitle}>
            这次没能评估的部分
          </h2>
          <ul className={`${styles.bulletList} ${styles.bulletMuted}`}>
            {report.notAssessable.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <footer className={styles.foot}>
          <p className="meta">免责声明</p>
          <p className={styles.disclaimer}>{report.disclaimer}</p>
        </footer>
      </article>
    </div>
  );
}

function severityClass(severity: keyof typeof SEVERITY_LABEL): string {
  if (severity === "high") return "tagHigh";
  if (severity === "medium") return "tagMedium";
  return "tagLow";
}
