import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "产品功能 — Wendo 文渡跨文化诊断平台",
  description: "了解 Wendo 文渡的产品功能、四大诊断维度、工作原理与常见问题。AI 驱动的跨文化商务智能诊断，让品牌温暖触达全球。",
  openGraph: {
    title: "产品功能 — Wendo 文渡跨文化诊断平台",
    description: "四大维度诊断、AI 驱动分析、结构化报告，全面了解文渡的产品能力。",
  },
};

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
