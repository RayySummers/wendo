"use client";

import { useEffect, useRef } from "react";
import styles from "./flowchart.module.css";

const steps = [
  { id: "01", label: "文档提交", type: "start" },
  { id: "02", label: "数据脱敏化", type: "process" },
  { id: "03", label: "文档切分 Chunking", type: "process" },
  { id: "04", label: "向量化 Embedding", type: "process" },
  { id: "05", label: "ChromaDB 存储", type: "process" },
  { id: "06", label: "Harness Engineering", type: "process" },
  { id: "07", label: "调用大语言模型", type: "process" },
  { id: "08", label: "生成诊断报告", type: "process" },
  { id: "09", label: "返回给用户", type: "process" },
  { id: "10", label: "用户收到人工复核报告", type: "process" },
  { id: "11", label: "服务结束", type: "end" },
];

export default function Flowchart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          container.classList.add(styles.visible);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.timeline}>
        {steps.map((step, index) => (
          <div key={step.id} className={styles.stepWrapper}>
            {index > 0 && <div className={styles.connector} />}
            <div
              className={`${styles.step} ${styles[step.type.replace("-", "")]}`}
            >
              <div className={styles.stepNumber}>{step.id}</div>
              <div className={styles.stepLabel}>{step.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}