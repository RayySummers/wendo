"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";

import { ReportView } from "@/components/ReportView";
import { bearMalaysiaReport } from "@/lib/fixtures/bear-malaysia";

import styles from "./sample.module.css";

export function SampleReport() {
  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <Link href="/" className={styles.brand}>
          <span className={styles.mark} aria-hidden="true">
            文
          </span>
          文渡 Wendo
        </Link>
        <div className={styles.actions}>
          <span className={styles.note}>未登录也能看的样本</span>
          <Link href="/login" className="btn btnGhost">
            登录
          </Link>
          <Link href="/app" className="btn btnPrimary">
            诊断我的内容
            <ArrowRight size={16} weight="bold" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <ReportView
        report={bearMalaysiaReport}
        onPrint={() => window.print()}
        backHref="/"
        backLabel="回到首页"
      />

      <footer className={styles.footer}>
        <p>
          这份样本来自 2026-11-12 对 bears.com.my 首页的真实诊断，使用 Lite 档位与马来西亚小家电知识库。
        </p>
        <Link href="/app" className="btn btnPrimary">
          用我自己的文案试一次
        </Link>
      </footer>
    </div>
  );
}
