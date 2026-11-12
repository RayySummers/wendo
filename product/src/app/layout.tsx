import type { Metadata } from "next";

import { SessionProvider } from "@/components/SessionProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "文渡 Wendo · 出海文化适配诊断",
    template: "%s · 文渡 Wendo",
  },
  description:
    "面向粤港澳大湾区中小型轻工企业的出海文化适配诊断。提交文案或单页链接，拿到带原文引用与改法的风险清单。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <link rel="preconnect" href="https://fonts.font.im" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.font.im/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Noto+Sans+SC:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
