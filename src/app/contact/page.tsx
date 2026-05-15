"use client";

import { useForm, ValidationError } from "@formspree/react";
import styles from "./page.module.css";
import HeroFadeIn from "@/components/HeroFadeIn";

export default function ContactPage() {
  const [state, handleSubmit] = useForm("mzdoldej");

  if (state.succeeded) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroContent} style={{ gap: 0 }}>
            <h1 className={styles.heroTitle} style={{ fontFamily: 'var(--font-body)', textAlign: 'center' }}>
              联系我们
            </h1>
          </div>
        </section>
        <section className={styles.main}>
          <div className={styles.formSection}>
            <div className={styles.successCard}>
              <div className={styles.successIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12l2.5 2.5L16 10" />
                </svg>
              </div>
              <h3 className={styles.successTitle}>消息已发送！</h3>
              <p className={styles.successText}>
                我们会尽快在 24 小时内回复您。
              </p>
              <p className={styles.successSub}>
                期待与您建立连接 🫡
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <HeroFadeIn
        title="联系我们"
        align="center"
      />

      <section className={styles.main}>
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>发送消息</h2>
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>姓名 *</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className={styles.input}
                  placeholder="请输入您的姓名"
                  required
                />
                <ValidationError prefix="姓名" field="name" errors={state.errors} />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>邮箱 *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className={styles.input}
                  placeholder="your@company.com"
                  required
                />
                <ValidationError prefix="邮箱" field="email" errors={state.errors} />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="company" className={styles.label}>公司名称</label>
              <input
                id="company"
                type="text"
                name="company"
                className={styles.input}
                placeholder="贵公司名称（可选）"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>留言内容 *</label>
              <textarea
                id="message"
                name="message"
                className={styles.textarea}
                placeholder="请描述您的问题或需求..."
                rows={5}
                required
              />
              <ValidationError prefix="留言" field="message" errors={state.errors} />
            </div>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={state.submitting}
            >
              {state.submitting ? "发送中..." : "发送消息"}
            </button>
          </form>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <h3 className={styles.sideTitle}>商务邮箱</h3>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon}>✉️</span>
              <div>
                <p className={styles.contactLabel}>联系邮箱</p>
                <a href="mailto:wendocn@protonmail.com" className={styles.contactValue}>
                  wendocn@protonmail.com
                </a>
              </div>
            </div>
            <p className={styles.sideNote}>
              一般情况下，我们会在 24 小时内回复您。如有紧急事项，欢迎直接发送邮件。
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}