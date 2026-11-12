"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  FileText,
  MagnifyingGlass,
  SignOut,
  UserCircle,
  Wallet,
} from "@phosphor-icons/react";

import { useSession } from "@/components/SessionProvider";
import { IS_DEMO } from "@/lib/api";
import { formatCredits } from "@/lib/format";

import styles from "./appShell.module.css";

const NAV = [
  { href: "/app", label: "诊断", icon: MagnifyingGlass, exact: true },
  { href: "/app/reports", label: "报告", icon: FileText, exact: false },
  { href: "/app/account", label: "账户", icon: UserCircle, exact: false },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, account, loading, loggingOut, logout } = useSession();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!loading && !session && !loggingOut) {
      router.replace("/login");
    }
  }, [loading, loggingOut, router, session]);

  async function handleLogout() {
    setSigningOut(true);
    try {
      await logout();
      router.replace("/");
    } finally {
      setSigningOut(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.boot} role="status" aria-live="polite">
        <span className={styles.bootDot} aria-hidden="true" />
        正在载入工作台
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className={styles.shell}>
      <aside className={styles.rail}>
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">
            文
          </span>
          <span className={styles.brandName}>文渡 Wendo</span>
        </Link>

        <nav className={styles.nav} aria-label="工作台">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={17} weight={active ? "fill" : "regular"} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.railFoot}>
          <div className={styles.creditBox}>
            <span className={styles.creditLabel}>
              <Wallet size={14} weight="regular" aria-hidden="true" />
              credit 余额
            </span>
            <strong className={styles.creditValue}>
              {account ? formatCredits(account.credits) : "…"}
            </strong>
            <Link href="/app/account" className={styles.creditLink}>
              看消耗记录
            </Link>
          </div>
          <div className={styles.user}>
            <span className={styles.userEmail} title={session.user.email}>
              {session.user.email}
            </span>
            <button
              type="button"
              className={`btn btnQuiet ${styles.signOut}`}
              onClick={handleLogout}
              disabled={signingOut}
            >
              <SignOut size={15} weight="regular" aria-hidden="true" />
              {signingOut ? "退出中" : "退出"}
            </button>
          </div>
        </div>
      </aside>

      <div className={styles.body}>
        {IS_DEMO ? (
          <p className={styles.demoBar}>
            演示数据：账号、credit 与报告都存在本机浏览器里，报告内容取自小熊电器样本
          </p>
        ) : null}
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
