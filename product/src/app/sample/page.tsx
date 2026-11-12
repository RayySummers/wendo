import type { Metadata } from "next";

import { SampleReport } from "./SampleReport";

export const metadata: Metadata = {
  title: "小熊电器马来西亚站首页 · 诊断样本",
};

export default function SamplePage() {
  return <SampleReport />;
}
