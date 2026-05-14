"use client";

import { useState, useRef } from "react";
import styles from "./page.module.css";

const diagnosticSteps = [
  {
    num: "01",
    title: "提交文档",
    desc: "将需要诊断的英文文本粘贴至对话窗口，或直接上传文档。",
  },
  {
    num: "02",
    title: "AI 分析诊断",
    desc: "系统通过 RAG 检索知识库，由 Subagent 逐段完成四大维度的问题识别与独立评分。",
  },
  {
    num: "03",
    title: "获取诊断报告",
    desc: "接收结构化诊断报告，包含各维度评分、问题定位，以及 before & after 对比分析。",
  },
];

export default function HomePage() {
  const [formState, setFormState] = useState<"idle" | "success">("idle");
  const [formData, setFormData] = useState({ name: "", company: "", email: "", area: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.company) return;
    setFormState("success");
  };

  if (formState === "success") {
    return (
      <div className={styles.successScreen}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l2.5 2.5L16 10" />
            </svg>
          </div>
          <h2 className={`${styles.successTitle} font-serif-en`}>Thank You!</h2>
          <p className={styles.successText}>
            谢谢 {formData.name}！稍后会有工作人员联系您。
          </p>
          <p className={styles.successSub}>
            我们会在正式发布前第一时间通知您。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <p className={styles.heroEyebrow}>跨境外贸网站本地化专家</p>
            <h1 className={`${styles.heroTitle} font-serif-en`}>
              让出海有温度
            </h1>
            <p className={styles.heroSubtitle}>
              让全球用户感受品牌的温度——文渡帮助中国出海企业将英文网站从"准确翻译"升级为"温暖触达"。
            </p>
            <div className={styles.heroCtas}>
              <a href="/contact" className={styles.primaryBtn}>
                报名抢先体验计划
              </a>
              <a href="/product" className={styles.secondaryBtn}>
                了解产品 →
              </a>
            </div>
          </div>
          <div className={styles.heroLogo}>
            <img
              src="/wendo_logo_vectorized.svg"
              alt="文渡 Wendo"
              width={400}
              height={400}
              className={styles.heroLogoImg}
            />
          </div>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statIcon}>🌏</span>
            <span className={styles.statValue}>30+</span>
            <span className={styles.statLabel}>覆盖国家和地区</span>
          </div>
        </div>
      </section>

      <section className={styles.steps}>
        <div className={styles.stepsHeader}>
          <h2 className={`${styles.sectionTitle} font-serif-en`}>工作原理</h2>
          <p className={styles.sectionSubtitle}>像和 ChatGPT 对话一样简单，获得专业的文化适配诊断报告</p>
        </div>
        <div className={styles.stepsGrid}>
          {diagnosticSteps.map((step) => (
            <div key={step.num} className={styles.stepCard}>
              <span className={styles.stepNum}>{step.num}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaContent}>
            <h2 className={`${styles.ctaTitle} font-serif-en`}>想要免费体验吗？</h2>
            <p className={styles.ctaText}>
              首批体验名额开放中，提交您的诊断需求，我们将尽快与您联系。
            </p>
          </div>
          <a href="/contact" className={styles.ctaBtn}>
            报名抢先体验计划
          </a>
        </div>
      </section>
    </div>
  );
}
