"use client";

import { useRef, useCallback } from "react";
import styles from "./page.module.css";
import Flowchart from "@/components/Flowchart";

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
    a: `普通翻译工具只做语言转换，文渡专注文化适配——判断文案在目标市场是否"有效"、"得体"、"温暖"，而不仅仅是"正确"。`,
  },
  {
    q: "如何联系商务合作？",
    a: "您可以通过页面表单或商务邮箱 wendocn@protonmail.com 联系我们，一般会在24小时内回复。",
  },
  {
    q: "提交的文档或网站内容是否会泄露？",
    a: "我们高度重视数据安全。所有诊断内容在传输和存储过程中均采用加密处理。基础版用户提交的脱敏数据仅用于优化AI诊断模型，不会向任何第三方披露原始内容。企业版客户可签署独立保密协议。",
  },
  {
    q: "AI初筛之后，人工终审主要审核哪些内容？",
    a: "人工终审重点识别AI难以捕捉的微妙文化差异：包括但不限于语用潜台词、文化禁忌、地区性俚语、审美偏好及价值观冲突。我们的跨文化专业团队会逐条复核AI标记的问题，并给出可操作的修改建议。",
  },
];

const knowledgeBase = {
  categories: [
    {
      icon: "📁",
      title: "Cases",
      subtitle: "品牌案例库",
      count: "12+",
      regions: ["🇺🇸 美国", "🇬🇧 欧洲", "🇯🇵 日本", "🇸🇬 东南亚"],
    },
    {
      icon: "🌍",
      title: "Regions",
      subtitle: "地区知识库",
      count: "30+",
      regions: ["🇺🇸 美国", "🇬🇧 欧洲", "🇯🇵 日本", "🇸🇬 东南亚"],
    },
    {
      icon: "📋",
      title: "Standards",
      subtitle: "诊断标准",
      count: "4",
      regions: ["通用标准", "行业标准", "地区标准", "品牌标准"],
    },
    {
      icon: "📖",
      title: "Terminology",
      subtitle: "行业术语库",
      count: "4+",
      regions: ["科技", "金融", "医疗", "法律"],
    },
  ],
  tree: [
    {
      name: "references",
      label: "references/",
      children: [
        {
          name: "cases",
          label: "cases/",
          children: [
            { name: "light-industry", label: "light-industry/", children: [] },
            { name: "electronics", label: "electronics/", children: [] },
            { name: "fashion", label: "fashion/", children: [] },
          ],
        },
        {
          name: "regions",
          label: "regions/",
          children: [
            { name: "united-states", label: "united-states/", children: ["newyork.md", "california.md", "texas.md"] },
            { name: "europe", label: "europe/", children: ["uk.md", "germany.md", "france.md"] },
            { name: "asiapacific", label: "asiapacific/", children: ["japan.md", "korea.md", "singapore.md", "vietnam.md"] },
            { name: "africa", label: "africa/", children: [] },
            { name: "middleeast", label: "middleeast/", children: [] },
            { name: "latin-america", label: "latin-america/", children: [] },
            { name: "canada", label: "canada/", children: [] },
          ],
        },
        {
          name: "standards",
          label: "standards/",
          children: [{ name: "global", label: "global.md", children: [] }],
        },
        {
          name: "terminology",
          label: "terminology/",
          children: ["tech.md", "finance.md", "medical.md", "legal.md"].map(f => ({ name: f.replace('.md',''), label: f, children: [] })),
        },
      ],
    },
  ],
};

export default function ProductPage() {
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
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>产品介绍</p>
          <h1 className={`${styles.heroTitle} font-serif-en`}>
            让全球用户<br />感受品牌的温度
          </h1>
          <p className={styles.heroSubtitle}>
            文渡将 AI 与跨文化商务智能结合，通过对话式交互帮助中国出海企业打造真正"入乡随俗"的英文品牌网站——不只是准确，更是温暖触达。
          </p>
          <a href="/wendo/contact" className={styles.primaryBtn}>
            报名体验
          </a>
        </div>
      </section>

      <section className={styles.wendo}>
        <div className={styles.wendoHeader}>
          <h2 className={`${styles.sectionTitle} font-serif-en`}>W-E-N-D-O</h2>
          <p className={styles.sectionSubtitle}>文渡价值观</p>
        </div>
        <div className={styles.wendoList}>
          {[
            { letter: "W", cn: "Warm", desc: "传递温度" },
            { letter: "E", cn: "Empathy", desc: "共情为本" },
            { letter: "N", cn: "Navigate", desc: "导航出海" },
            { letter: "D", cn: "Diagnose", desc: "精准诊断" },
            { letter: "O", cn: "Optimize", desc: "优化赋能" },
          ].map((v) => (
            <div key={v.letter} className={styles.wendoItem}>
              <span className={styles.wendoLetter}>{v.letter}</span>
              <span className={styles.wendoCn}>{v.cn}</span>
              <span className={styles.wendoDesc}>{v.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.dimensions}>
        <div className={styles.dimensionsHeader}>
          <h2 className={`${styles.sectionTitle} font-serif-en`}>诊断维度</h2>
          <p className={styles.sectionSubtitle}>标准化分维度量化评分机制，每个维度独立评分，最终汇总生成总分</p>
        </div>
        <div className={styles.dimensionsGrid}>
          {dimensions.map((d) => (
            <div key={d.title} className={styles.dimensionCard}>
              <span className={styles.dimensionIcon}>{d.icon}</span>
              <h3 className={styles.dimensionTitle}>{d.title}</h3>
              <p className={styles.dimensionDesc}>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.process}>
        <div className={styles.processHeader}>
          <h2 className={`${styles.sectionTitle} font-serif-en`}>工作原理</h2>
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

      <section className={styles.flowchartSection}>
        <div className={styles.flowchartHeader}>
          <h2 className={`${styles.sectionTitle} font-serif-en`}>数据流程</h2>
          <p className={styles.sectionSubtitle}>从文档到诊断报告的完整路径</p>
        </div>
        <Flowchart />
      </section>

      <section className={styles.knowledge}>
        <div className={styles.knowledgeHeader}>
          <h2 className={`${styles.sectionTitle} font-serif-en`}>深度知识库</h2>
          <p className={styles.sectionSubtitle}>跨文化诊断的专业底气</p>
        </div>

        <div className={styles.knowledgeCards}>
          {knowledgeBase.categories.map((cat) => (
            <div key={cat.title} className={styles.knowledgeCard}>
              <div className={styles.knowledgeCardTop}>
                <span className={styles.knowledgeIcon}>{cat.icon}</span>
                <span className={styles.knowledgeCount}>{cat.count}</span>
              </div>
              <h3 className={styles.knowledgeTitle}>{cat.title}</h3>
              <p className={styles.knowledgeSubtitle}>{cat.subtitle}</p>
              <div className={styles.knowledgeRegions}>
                {cat.regions.map((r) => (
                  <span key={r} className={styles.knowledgeRegion}>{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.knowledgeTree}>
          <div className={styles.treeHeader}>
            <span className={styles.treeTitle}>知识库结构</span>
            <span className={styles.treeHint}>点击展开查看详情</span>
          </div>
          <div className={styles.treeList}>
            {knowledgeBase.tree[0].children.map((folder) => (
              <details key={folder.name} className={styles.treeItem}>
                <summary className={styles.treeSummary}>
                  <span className={styles.treeFolder}>{folder.label}</span>
                  <span className={styles.treeArrow}>▶</span>
                </summary>
                <div className={styles.treeChildren}>
                  {folder.children.map((child) => (
                    typeof child === 'string' ? (
                      <span key={child} className={styles.treeFile}>{child}</span>
                    ) : (
                      <details key={child.name} className={styles.treeSubItem}>
                        <summary className={styles.treeSubSummary}>
                          <span className={styles.treeFolder}>{child.label}</span>
                          {child.children && child.children.length > 0 && (
                            <span className={styles.treeArrow}>▶</span>
                          )}
                        </summary>
                        {child.children && child.children.length > 0 && (
                          <div className={styles.treeSubChildren}>
                            {child.children.map((file) => (
                              <span key={file} className={styles.treeFile}>{file}</span>
                            ))}
                          </div>
                        )}
                      </details>
                    )
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.faq}>
        <div className={styles.faqHeader}>
          <h2 className={`${styles.sectionTitle} font-serif-en`}>FAQ</h2>
          <p className={styles.sectionSubtitle}>常见问题解答</p>
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
