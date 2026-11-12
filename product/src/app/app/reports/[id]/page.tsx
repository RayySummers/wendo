"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ReportView } from "@/components/ReportView";
import { useSession } from "@/components/SessionProvider";
import { api } from "@/lib/api";
import { ApiError, type DiagnosisReport } from "@/lib/types";

import styles from "./detail.module.css";

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : "";
  const { session } = useSession();
  const [report, setReport] = useState<DiagnosisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session || !id) return;
    let cancelled = false;
    api
      .getReport(id)
      .then((next) => {
        if (!cancelled) setReport(next);
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(caught instanceof ApiError ? caught.message : "报告没取到");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [id, session]);

  if (error) {
    return (
      <div className={styles.state}>
        <h1 className={styles.stateTitle}>这份报告打不开</h1>
        <p className={styles.stateBody}>{error}</p>
        <Link href="/app/reports" className="btn btnGhost">
          回到报告列表
        </Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div className={styles.skeleton} aria-busy="true" aria-label="正在载入报告">
        <span className={styles.skeletonLine} />
        <span className={styles.skeletonTitle} />
        <span className={styles.skeletonLine} />
        <span className={styles.skeletonBlock} />
        <span className={styles.skeletonBlock} />
      </div>
    );
  }

  return <ReportView report={report} onPrint={() => window.print()} />;
}
