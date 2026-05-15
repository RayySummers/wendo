import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "联系我们 — Wendo 文渡",
  description: "联系 Wendo 文渡团队，获取跨文化诊断服务咨询、商务合作或技术支持。我们期待与您建立连接。",
  openGraph: {
    title: "联系我们 — Wendo 文渡",
    description: "获取跨文化诊断服务咨询、商务合作或技术支持。",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
