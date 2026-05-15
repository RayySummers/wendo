"use client";

import { motion } from "motion/react";
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
  return (
    <div className={styles.container}>
      <div className={styles.timeline}>
        {steps.map((step, index) => (
          <div key={step.id} className={styles.stepWrapper}>
            {index > 0 && <motion.div
              className={styles.connector}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              style={{ transformOrigin: "top" }}
            />}
            <motion.div
              className={`${styles.step} ${styles[step.type.replace("-", "")]}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.07,
                type: "spring",
                stiffness: 120,
                damping: 14,
              }}
              whileHover={{ x: 6 }}
              viewport={{ once: true, margin: "-40px" }}
            >
              <motion.div
                className={styles.stepNumber}
                whileInView={{ scale: [1, 1.1, 1] }}
                transition={{ delay: index * 0.07 + 0.2, duration: 0.3 }}
                viewport={{ once: true }}
              >
                {step.id}
              </motion.div>
              <div className={styles.stepLabel}>{step.label}</div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}