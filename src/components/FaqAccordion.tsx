"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import styles from "./FaqAccordion.module.css";

const faqItems = [
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
    a: `普通翻译工具只做语言转换，文渡专注文化适配——判断文案在目标市场是否"有效"、"得体"、"温暖"，而不仅仅是"正确"。`,
  },
  {
    q: "如何联系商务合作？",
    a: "您可以通过页面表单或商务邮箱 wendocn@protonmail.com 联系我们，一般会在24小时内回复。",
  },
  {
    q: "提交的文档或网站内容是否会泄露？",
    a: "我们高度重视数据安全。所有诊断内容在传输和存储过程中均采用加密处理，不会向任何第三方披露原始内容。如有需要，可签署独立保密协议。",
  },
  {
    q: "AI初筛之后，人工终审主要审核哪些内容？",
    a: "人工终审重点识别AI难以捕捉的微妙文化差异：包括但不限于语用潜台词、文化禁忌、地区性俚语、审美偏好及价值观冲突。我们的跨文化专业团队会逐条复核AI标记的问题，并给出可操作的修改建议。",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.item}>
      <button
        className={styles.question}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{q}</span>
        <motion.span
          className={styles.arrow}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          ▶
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.answer}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className={styles.answerContent}>{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqAccordion() {
  return (
    <div className={styles.list}>
      {faqItems.map((item) => (
        <FaqItem key={item.q} q={item.q} a={item.a} />
      ))}
    </div>
  );
}