"use client";

import { useEffect, useRef } from "react";
import styles from "./flowchart.module.css";

const steps = [
  { id: "A", label: "文档提交", type: "start" },
  { id: "B", label: "用户同意数据收集？", type: "diamond" },
  { id: "C", label: "数据脱敏化", type: "process" },
  { id: "D", label: "文档切分 Chunking", type: "process" },
  { id: "E", label: "向量化 Embedding", type: "process" },
  { id: "F", label: "ChromaDB 存储", type: "process" },
  { id: "G", label: "记忆知识库诊断", type: "process" },
  { id: "H", label: "Harness Engineering", type: "process" },
  { id: "I", label: "调用大语言模型", type: "process" },
  { id: "J", label: "生成诊断报告", type: "process" },
  { id: "K", label: "保存报告", type: "process" },
  { id: "L", label: "返回给用户", type: "process" },
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
              <div className={styles.stepNumber}>
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className={styles.stepLabel}>{step.label}</div>
            </div>
          </div>
        ))}

        <div className={styles.branchSection}>
          <div className={styles.branchDivider}>
            <span className={styles.branchLabel}>分支</span>
          </div>

          <div className={styles.branchRow}>
            <div className={styles.branchTop}>
              <div className={styles.branchConnector} />
              <div className={styles.branchStep}>
                <div className={styles.branchStepLabel}>通知人工审核</div>
              </div>
            </div>

            <div className={styles.branchBottom}>
              <div className={styles.branchConnector} />
              <div className={styles.branchStep}>
                <div className={styles.branchStepLabel}>用户主动联系客服</div>
              </div>
            </div>
          </div>

          <div className={styles.mergeConnectors}>
            <div className={styles.mergeLine} />
            <div className={styles.mergeLine} />
          </div>

          <div className={styles.endNode}>
            <div className={styles.endIcon}>✓</div>
            <div className={styles.endLabel}>完成</div>
          </div>
        </div>
      </div>
    </div>
  );
}