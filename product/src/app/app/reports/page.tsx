"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, FileText } from "@phosphor-icons/react";

import { useSession } from "@/components/SessionProvider";
import { api } from "@/lib/api";
import { SEVERITY_LABEL, formatDateTime } from "@/lib/format";
import { ApiError, type ReportListItem } from "@/lib/types";

import styles from "./reports.module.css";

export default function ReportsPage() {
  const { session } = useSession();
  const [reports, setReports] = useState<ReportListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    api
      .listReports()
      .then((items) => {
        if (!cancelled) setReports(items);
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(caught instanceof ApiError ? caught.message : "报告列表没取到");
          setReports([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <div>
          <p className="meta">报告</p>
          <h1 className="pageTitle">已经诊断过的内容</h1>
          <p className="pageLede">
            每次诊断留一份报告。报告长期保存，提交的原文保存 30 天。
          </p>
        </div>
        <Link href="/app" className="btn btnPrimary">
          新建诊断
          <ArrowRight size={16} weight="bold" aria-hidden="true" />
        </Link>
      </header>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {reports === null ? (
        <ul className={styles.list} aria-busy="true" aria-label="正在载入报告">
          {[0, 1, 2].map((row) => (
            <li key={row} className={`${styles.row} ${styles.skeleton}`}>
              <span className={styles.skeletonBar} />
              <span className={styles.skeletonBarShort} />
            </li>
          ))}
        </ul>
      ) : reports.length === 0 ? (
        <div className="emptyState">
          <strong>还没有报告</strong>
          <p>先做一次诊断，报告会出现在这里。</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {reports.map((report) => (
            <li key={report.id}>
              <Link href={`/app/reports/${report.id}`} className={styles.row}>
                <span className={styles.rowIcon} aria-hidden="true">
                  <FileText size={18} weight="regular" />
                </span>
                <span className={styles.rowMain}>
                  <span className={styles.rowTitle}>{report.title}</span>
                  <span className={styles.rowPreview}>{report.preview}</span>
                  <span className={styles.rowMeta}>
                    <span>{formatDateTime(report.createdAt)}</span>
                    <span>{report.inputType === "url" ? "单页链接" : "粘贴文本"}</span>
                    <span>{report.modelTier === "lite" ? "Lite" : report.modelTier}</span>
                  </span>
                </span>
                <span className={styles.rowSide}>
                  <span
                    className={`tag ${
                      report.topSeverity === "high"
                        ? "tagHigh"
                        : report.topSeverity === "medium"
                          ? "tagMedium"
                          : "tagLow"
                    }`}
                  >
                    {report.topSeverity
                      ? `${SEVERITY_LABEL[report.topSeverity]}优先级`
                      : "无风险"}
                  </span>
                  <span className={styles.rowCount}>{report.riskCount} 条风险</span>
                  <ArrowUpRight
                    size={16}
                    weight="bold"
                    className={styles.rowArrow}
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
