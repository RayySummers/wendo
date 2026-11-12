import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./auth.module.css";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className={styles.page}>
      <section className={styles.aside} aria-hidden="true">
        <Link href="/" className={styles.asideBrand}>
          <span className={styles.asideMark}>文</span>
          <span>文渡 Wendo</span>
        </Link>
        <div className={styles.asideBody}>
          <p className={styles.asideQuote}>
            出海的表达，
            <br />
            先交给当地人看一遍。
          </p>
          <p className={styles.asideMeta}>
            马来西亚 · 小家电 · 单页诊断
          </p>
        </div>
        <p className={styles.asideFoot}>
          出海文化适配诊断
        </p>
      </section>

      <main className={styles.main}>
        <div className={styles.card}>
          <header className={styles.head}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
          </header>
          {children}
          <footer className={styles.foot}>{footer}</footer>
        </div>
      </main>
    </div>
  );
}
