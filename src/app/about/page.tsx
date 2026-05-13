import styles from "./page.module.css";

const team = [
  {
    name: "李明远",
    nameEn: "Mingyuan Li",
    role: "创始人 & CEO",
    bio: "前谷歌翻译团队成员，10年跨文化商务咨询经验，坚信语言是文化的载体，而非障碍。",
    color: "#1943c1",
  },
  {
    name: "陈思韵",
    nameEn: "Siyun Chen",
    role: "产品负责人",
    bio: "曾主导多个跨境电商平台本地化项目，擅长将复杂的文化概念转化为可量化的产品指标。",
    color: "#7c3aed",
  },
  {
    name: "王志浩",
    nameEn: "Zhihao Wang",
    role: "AI 研发负责人",
    bio: "NLP 领域博士，专注跨文化语料库建设与文化敏感度建模，致力于让人工智能理解「温暖」。",
    color: "#0891b2",
  },
  {
    name: "张晓彤",
    nameEn: "Xiaotong Zhang",
    role: "商务拓展负责人",
    bio: "服务过50+中国出海品牌，深谙制造业与跨境电商的本地化痛点，坚信好产品自己会说话。",
    color: "#c2410c",
  },
];

const values = [
  {
    icon: "💛",
    title: "本地化即共情",
    desc: "翻译是文字的搬运，文化适配是情感的传递。我们相信每一次触达，都应让用户感受到被理解。",
  },
  {
    icon: "🌍",
    title: "文化智能 > 字面准确",
    desc: "字对字的翻译可能完美却冰冷，我们追求的是目标市场用户真正认可、喜欢、信任的沟通方式。",
  },
  {
    icon: "🔥",
    title: "温暖可跨越边界",
    desc: "好的品牌温度，不会因语言而流失。文渡让中国品牌的温度，跨越语言，触达每一个海外用户的心灵。",
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>关于文渡</p>
          <h1 className={`${styles.heroTitle} font-serif-en`}>
            Where Words Warm<br />the World
          </h1>
          <p className={styles.heroSubtitle}>
            文渡诞生于一个朴素的信念：语言是文化的载体，每一个出海的中国品牌，都值得被全球用户真正理解与喜爱。
          </p>
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.storyContent}>
          <h2 className={`${styles.sectionTitle} font-serif-en`}>Our Story</h2>
          <div className={styles.storyText}>
            <p>
              2023年，我们为一家中国智能家居品牌做海外市场调研时发现，他们投入了大量广告预算，却因为官网英文文案"太翻译腔"而在社交媒体上遭受嘲笑。
            </p>
            <p>
              这让我们意识到，中国品牌出海的真正瓶颈不是产品质量，而是"文化温度"的传递。当一个品牌的英文官网让西方用户觉得"冷冰冰"时，再好的产品也会失去竞争力。
            </p>
            <p>
              于是文渡诞生了——我们不只是一个翻译工具，而是一个跨文化商务智能平台，帮助中国品牌发现并修复那些让海外用户"感觉不对"的细微之处。
            </p>
          </div>
        </div>
        <div className={styles.storyDecor} aria-hidden="true">
          <div className={styles.storyCircle} />
        </div>
      </section>

      <section className={styles.team}>
        <div className={styles.teamHeader}>
          <h2 className={`${styles.sectionTitle} font-serif-en`}>Our Team</h2>
          <p className={styles.sectionSubtitle}>我们是一支专注跨文化商务智能的小团队</p>
        </div>
        <div className={styles.teamGrid}>
          {team.map((member) => (
            <div key={member.name} className={styles.memberCard}>
              <div
                className={styles.memberAvatar}
                style={{ background: member.color }}
              >
                {member.name[0]}
              </div>
              <div className={styles.memberInfo}>
                <p className={styles.memberName}>{member.name}</p>
                <p className={styles.memberNameEn}>{member.nameEn}</p>
                <p className={styles.memberRole}>{member.role}</p>
                <p className={styles.memberBio}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.values}>
        <div className={styles.valuesHeader}>
          <h2 className={`${styles.sectionTitle} font-serif-en`}>Our Values</h2>
        </div>
        <div className={styles.valuesGrid}>
          {values.map((v) => (
            <div key={v.title} className={styles.valueCard}>
              <span className={styles.valueIcon}>{v.icon}</span>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueDesc}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta}>
        <a href="/contact" className={styles.ctaBtn}>
          加入体验计划，与我们同行
        </a>
      </section>
    </div>
  );
}
