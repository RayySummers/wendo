"use client";

import { useState, useRef, useCallback } from "react";
import styles from "./page.module.css";

const faqData = [
  {
    question: "文渡支持哪些语言的本地化？",
    answer:
      "目前主打英文本地化（美国、英国、澳大利亚等英语市场），后续将陆续支持日语、韩语、德语、法语等多语言版本。",
  },
  {
    question: "诊断需要多长时间？",
    answer:
      "一般文档（5000字以内）可在5分钟内完成诊断并生成报告。大型文档建议分批次提交，或联系商务定制方案。",
  },
  {
    question: "文渡与普通翻译平台有什么区别？",
    answer:
      "普通翻译工具只做语言转换，文渡专注文化适配——判断文案在目标市场是否'有效'、'得体'、'温暖'，而不仅仅是'正确'。",
  },
  {
    question: "如何联系商务合作？",
    answer:
      "您可以通过下方表单或邮件联系我们，一般会在24小时内回复。对于批量需求或定制方案，欢迎预约线上会议。",
  },
];

type FormState = "idle" | "success";

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormState("success");
  };

  const animatingRef = useRef(false);

  const toggleFaq = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const summary = e.currentTarget;
    const details = summary.parentElement as HTMLDetailsElement;
    const answer = details.querySelector("div") as HTMLElement;

    if (animatingRef.current) return;
    animatingRef.current = true;

    if (details.hasAttribute("open")) {
      const height = answer.scrollHeight;
      const animation = answer.animate(
        [
          { maxHeight: height + "px", opacity: 1 },
          { maxHeight: "0px", opacity: 0 },
        ],
        { duration: 350, easing: "ease-in-out" }
      );
      animation.onfinish = () => {
        details.removeAttribute("open");
        answer.style.maxHeight = "";
        answer.style.opacity = "";
        animatingRef.current = false;
      };
    } else {
      details.setAttribute("open", "");
      requestAnimationFrame(() => {
        const height = answer.scrollHeight;
        answer.style.maxHeight = "0px";
        answer.style.opacity = "0";
        requestAnimationFrame(() => {
          const animation = answer.animate(
            [
              { maxHeight: "0px", opacity: 0 },
              { maxHeight: height + "px", opacity: 1 },
            ],
            { duration: 350, easing: "ease-in-out" }
          );
          animation.onfinish = () => {
            answer.style.maxHeight = height + "px";
            answer.style.opacity = "1";
            animatingRef.current = false;
          };
        });
      });
    }
  }, []);

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
          <h2 className={styles.formTitle}>发送消息</h2>
          {formState === "success" ? (
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
          ) : (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>姓名 *</label>
                  <input
                    id="name"
                    type="text"
                    className={styles.input}
                    placeholder="请输入您的姓名"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.label}>邮箱 *</label>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    placeholder="your@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="company" className={styles.label}>公司名称</label>
                <input
                  id="company"
                  type="text"
                  className={styles.input}
                  placeholder="贵公司名称（可选）"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>留言内容 *</label>
                <textarea
                  id="message"
                  className={styles.textarea}
                  placeholder="请描述您的问题或需求..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className={styles.submitBtn}>
                发送消息
              </button>
            </form>
          )}
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

      <section className={styles.faq}>
        <h2 className={`${styles.sectionTitle} font-serif-en`}>FAQ</h2>
        <div className={styles.faqList}>
          {faqData.map((item) => (
            <details key={item.question} className={styles.faqItem}>
              <summary className={styles.faqQuestion} onClick={toggleFaq}>{item.question}</summary>
              <div className={styles.faqAnswer}>{item.answer}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
