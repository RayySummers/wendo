"use client";

import { motion } from "motion/react";
import styles from "./HeroFadeIn.module.css";

interface HeroFadeInProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  cta?: React.ReactNode;
  align?: "left" | "center";
}

export default function HeroFadeIn({
  eyebrow,
  title,
  subtitle,
  cta,
  align = "left",
}: HeroFadeInProps) {
  const contentAlign = align === "center" ? styles.center : styles.left;

  return (
    <section className={styles.hero}>
      <div className={`${styles.heroContent} ${contentAlign}`}>
        {eyebrow && (
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {subtitle}
          </motion.p>
        )}
        {cta && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            {cta}
          </motion.div>
        )}
      </div>
    </section>
  );
}