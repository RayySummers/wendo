"use client";

import { useRef, useCallback } from "react";
import styles from "./page.module.css";

const dimensions = [
  {
    icon: "✅",
    title: "语言合规性",
    desc: "拼写正确性、语法正确性、词汇搭配合理性",
    maxScore: "25",
  },
  {
    icon: "💬",
    title: "表达自然性",
    desc: "流畅度可读性、习语用法正确性、句子节奏多样性",
    maxScore: "25",
  },
  {
    icon: "🌍",
    title: "文化适配性",
    desc: "文化禁忌规避、本地化表达习惯、价值观适配",
    maxScore: "25",
  },
  {
    icon: "🎯",
    title: "沟通效果",
    desc: "信息清晰度、行动召唤有效性、品牌调性一致性",
    maxScore: "25",
  },
];

const faq = [
  {
    q: "文渡支持哪些语言的本地化？",
    a: "目前主打英文本地化（美国、英国、澳大利亚等英语市场），后续将陆续支持日语、韩语、德语、法语等多语言版本。",
  },
  {
    q: "诊断需要多长时间？",
    a: "一般文档（5000字以内）可在5分钟内完成诊断并生成报告。大型文档建议分批次提交，或联系商务定制方案。",
  },
  {
    q: "文渡与普通翻译平台有什么区别？",
    a: "普通翻译工具只做语言转换，文渡专注文化适配——判断文案在目标市场是否'有效'、'得体'、'温暖'，而不仅仅是'正确'。",
  },
  {
    q: "如何联系商务合作？",
    a: "您可以通过页面表单或商务邮箱 contact@wendo.ai 联系我们，一般会在24小时内回复。",
  },
];

export default function ProductPage() {
  const animatingRef = useRef(false);

  const toggleFaq = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const summary = e.currentTarget;
    const details = summary.parentElement as HTMLDetailsElement;
    const answer = summary.nextElementSibling as HTMLElement;

    if (animatingRef.current) return;
    animatingRef.current = true;

    const isOpen = details.hasAttribute("open");

    if (isOpen) {
      const height = answer.scrollHeight;
      const animation = answer.animate(
        [
          { maxHeight: height + "px", opacity: 1 },
          { maxHeight: "0px", opacity: 0 },
        ],
        { duration: 400, easing: "ease-in-out" }
      );
      animation.onfinish = () => {
        details.removeAttribute("open");
        answer.style.maxHeight = "";
        answer.style.opacity = "";
        animatingRef.current = false;
      };
    } else {
      details.setAttribute("open", "");
      const height = answer.scrollHeight;
      answer.style.maxHeight = "0px";
      answer.style.opacity = "0";
      const animation = answer.animate(
        [
          { maxHeight: "0px", opacity: 0 },
          { maxHeight: height + "px", opacity: 1 },
        ],
        { duration: 400, easing: "ease-in-out" }
      );
      animation.onfinish = () => {
        answer.style.maxHeight = height + "px";
        answer.style.opacity = "1";
        animatingRef.current = false;
      };
    }
  }, []);
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>产品介绍</p>
          <h1 className={`${styles.heroTitle} font-serif-en`}>
            让全球用户<br />感受品牌的温度
          </h1>
          <p className={styles.heroSubtitle}>
            文渡将 AI 与跨文化商务智能结合，通过对话式交互帮助中国出海企业打造真正"入乡随俗"的英文品牌网站——不只是准确，更是温暖触达。
          </p>
          <a href="/contact" className={styles.primaryBtn}>
            立即体验 →
          </a>
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
      </section>

      <section className={styles.dimensions}>
        <div className={styles.dimensionsHeader}>
          <h2 className={`${styles.sectionTitle} font-serif-en`}>Four Diagnostic Dimensions</h2>
          <p className={styles.sectionSubtitle}>标准化分维度量化评分机制，每个维度独立评分，最终汇总生成总分</p>
        </div>
        <div className={styles.dimensionsGrid}>
          {dimensions.map((d) => (
            <div key={d.title} className={styles.dimensionCard}>
              <span className={styles.dimensionIcon}>{d.icon}</span>
              <div className={styles.dimensionScore}>
                <span className={styles.dimensionScoreValue}>{d.maxScore}</span>
                <span className={styles.dimensionScoreMax}>分</span>
              </div>
              <h3 className={styles.dimensionTitle}>{d.title}</h3>
              <p className={styles.dimensionDesc}>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.process}>
        <div className={styles.processHeader}>
          <h2 className={`${styles.sectionTitle} font-serif-en`}>How It Works</h2>
          <p className={styles.sectionSubtitle}>系统通过 RAG 检索专业知识库，Subagent 逐段完成问题识别与评分</p>
        </div>
        <div className={styles.processFlow}>
          <div className={styles.processStep}>
            <div className={styles.processStepNum}>01</div>
            <div className={styles.processStepContent}>
              <h3>文档切分</h3>
              <p>系统将源文档切分为文本片段，为逐段分析做准备。</p>
            </div>
          </div>
          <div className={styles.processArrow}>→</div>
          <div className={styles.processStep}>
            <div className={styles.processStepNum}>02</div>
            <div className={styles.processStepContent}>
              <h3>RAG 检索</h3>
              <p>通过 RAG 检索专业知识库，获取相关规范和案例参考。</p>
            </div>
          </div>
          <div className={styles.processArrow}>→</div>
          <div className={styles.processStep}>
            <div className={styles.processStepNum}>03</div>
            <div className={styles.processStepContent}>
              <h3>Subagent 评分</h3>
              <p>由 Subagent 逐段完成问题识别和四大维度独立评分。</p>
            </div>
          </div>
          <div className={styles.processArrow}>→</div>
          <div className={styles.processStep}>
            <div className={styles.processStepNum}>04</div>
            <div className={styles.processStepContent}>
              <h3>报告生成</h3>
              <p>汇总所有问题，生成结构化诊断报告与 before & after 对比分析。</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.faq}>
        <div className={styles.faqHeader}>
          <h2 className={`${styles.sectionTitle} font-serif-en`}>FAQ</h2>
        </div>
        <div className={styles.faqList}>
          {faq.map((item) => (
            <details key={item.q} className={styles.faqItem}>
              <summary className={styles.faqQuestion} onClick={toggleFaq}>{item.q}</summary>
              <div className={styles.faqAnswer}>{item.a}</div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
