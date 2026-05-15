import styles from "./page.module.css";

const plans = [
  {
    name: "Basic",
    nameCn: "基础版",
    price: "免费",
    priceNote: "",
    tag: "FREE",
    tagColor: "#16a34a",
    desc: "适合初次体验文渡诊断服务的用户",
    features: [
      "每月 2 次诊断",
      { text: "允许文渡收集脱敏数据以提升服务质量", icon: "minus" },
      "基础诊断报告",
      "Email 支持",
    ],
    cta: "开始免费体验",
    ctaHref: "/contact",
    highlight: false,
  },
  {
    name: "Plus",
    nameCn: "高级版",
    price: "288",
    priceNote: "元 / 月",
    tag: "推荐",
    tagColor: "#7096EC",
    desc: "适合有常规诊断需求的小型企业",
    features: [
      "每月 25 次诊断（每天 1 次）",
      "完整诊断报告",
      "before & after 对比分析",
      "Email 支持",
      "可上传文档",
    ],
    cta: "立即订阅",
    ctaHref: "/contact",
    highlight: true,
  },
  {
    name: "Pro",
    nameCn: "专业版",
    price: "588",
    priceNote: "元 / 月",
    tag: "",
    tagColor: "",
    desc: "适合诊断需求频繁的中型企业",
    features: [
      "每月 75 次诊断（每天 2 次）",
      "完整诊断报告",
      "before & after 对比分析",
      "优先 Email 支持",
      "可上传多份文档",
      "品牌调性配置与记忆",
    ],
    cta: "立即订阅",
    ctaHref: "/contact",
    highlight: false,
  },
  {
    name: "Max",
    nameCn: "旗舰版",
    price: "888",
    priceNote: "元 / 月",
    tag: "",
    tagColor: "",
    desc: "适合诊断需求高的中大型企业",
    features: [
      "每月 125 次诊断（每天 4 次）",
      "完整诊断报告",
      "before & after 对比分析",
      "优先 Email + 微信支持",
      "可上传多份文档",
      "品牌调性配置与记忆",
      "多成员协作（3席）",
    ],
    cta: "立即订阅",
    ctaHref: "/contact",
    highlight: false,
  },
  {
    name: "Enterprise",
    nameCn: "企业版",
    price: "定制",
    priceNote: "定价",
    tag: "",
    tagColor: "",
    desc: "适用于大型企业或有特殊需求的客户",
    features: [
      "根据企业具体需求定制",
      "多语种支持",
      "多品类材料",
      "人工深度审核",
      "专属客户成功经理",
      "多成员协作（无限席）",
      "SLA 服务保障",
    ],
    cta: "联系商务",
    ctaHref: "mailto:wendocn@protonmail.com",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle} style={{ fontFamily: 'var(--font-body)', textAlign: 'center' }}>
            定价
          </h1>
        </div>
      </section>

      <section className={styles.plans}>
        <div className={styles.plansGrid}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`${styles.planCard} ${plan.highlight ? styles.highlighted : ""}`}
            >
              <p className={styles.planNameEn}>{plan.name}</p>
              {plan.tag && (
                <div
                  className={styles.planTag}
                  style={{ background: plan.tagColor }}
                >
                  {plan.tag}
                </div>
              )}
              <div className={styles.planHeader}>
                <p className={styles.planName}>{plan.nameCn}</p>
                <div className={styles.planPrice}>
                  <span className={styles.planPriceValue}>{plan.price}</span>
                  <span className={styles.planPriceNote}>{plan.priceNote}</span>
                </div>
                <p className={styles.planDesc}>{plan.desc}</p>
              </div>
              <ul className={styles.planFeatures}>
                {plan.features.map((f, i) => {
                  const isMinus = typeof f === "object" && f.icon === "minus";
                  const text = typeof f === "object" ? f.text : f;
                  return (
                    <li key={i} className={`${styles.planFeature} ${isMinus ? styles.planFeatureMinus : ""}`}>
                      {isMinus ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                      {text}
                    </li>
                  );
                })}
              </ul>
              {plan.name === "Enterprise" ? (
                <a
                  href={plan.ctaHref}
                  className={`${styles.planCta} ${plan.highlight ? styles.planCtaHighlighted : ""}`}
                >
                  {plan.cta}
                </a>
              ) : (
                <span className={styles.planCtaDisabled}>
                  敬请期待
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.note}>
        <div className={styles.noteContent}>
          <h2 className={`${styles.noteTitle} font-serif-en`}>常见问题</h2>
          <div className={styles.noteGrid}>
            {[
              {
                q: "如何计费？",
                a: "按月订阅，次月自动续费，支持信用卡和银行转账。随时可取消，不收取取消费用。",
              },
              {
                q: "诊断次数如何计算？",
                a: "每次诊断针对一份文档或一次对话会话进行。文档字数不限，系统按诊断轮次计次。",
              },
              {
                q: "基础版的脱敏数据是什么？",
                a: "仅收集经过脱敏处理的文本片段（不含公司名称、联系方式等敏感信息），用于提升文渡的诊断模型质量。所有数据均经匿名化处理。",
              },
              {
                q: "可以企业发票吗？",
                a: "可以支持开具增值税普通发票或专用发票，请通过商务邮箱联系我们的财务团队。",
              },
            ].map((item) => (
              <div key={item.q} className={styles.noteItem}>
                <h3 className={styles.noteQuestion}>{item.q}</h3>
                <p className={styles.noteAnswer}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
