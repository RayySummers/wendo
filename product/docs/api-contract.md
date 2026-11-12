# 前端接口契约（11/15 演示版）

前端只通过 `src/lib/api.ts` 里的 `WendoApi` 取数据，页面不直接 `fetch`。
`src/lib/types.ts` 是字段名的唯一来源；改字段名要两侧一起改。

- 演示模式（默认）：`NEXT_PUBLIC_DATA_SOURCE=mock`，数据在浏览器 localStorage，不连后端。
- 真实接口：`NEXT_PUBLIC_DATA_SOURCE=api` + `NEXT_PUBLIC_API_BASE=https://api.example.com`。

后端（RAY-656 账号/credit、RAY-657 诊断/PDF）按下面实现即可；路径和字段是本版前端已经写死的形状。

## 约定

- 全部 `application/json`，session 用 HttpOnly cookie（`credentials: "include"`）。
- 成功：`200` / `204`。
- 失败：非 2xx，body 为 `{ "code": "...", "message": "给人看的中文" }`。
  前端认识的 code：`invalid_credentials` / `email_taken` / `invalid_invite` /
  `invite_exhausted` / `insufficient_credit` / `scrape_failed` /
  `diagnosis_failed` / `unauthorized` / `network` / `unknown`。
- 时间一律 ISO 8601 字符串（UTC）。

## 1. 账号

### `POST /api/auth/login`

```json
{ "email": "ray@wendo.cn", "secret": "******" }
```

200 → `Session`。401 `invalid_credentials`。

### `POST /api/auth/register`

```json
{ "email": "ray@wendo.cn", "secret": "******", "inviteCode": "WENDO-DEMO" }
```

200 → `Session`。409 `email_taken`；422 `invalid_invite` / `invite_exhausted`。
注册记录要能追溯 `code / account_id / used_at`。

### `POST /api/auth/logout`

204，清 cookie。

### `GET /api/auth/session`

200 → `Session`；401 → 前端当作未登录。

```ts
type Session = {
  user: { id: string; email: string; displayName: string };
  expiresAt: string; // 7 天后
};
```

## 2. credit

### `GET /api/account`

200 →

```ts
type AccountSnapshot = {
  credits: number;          // 允许小数
  ledger: LedgerEntry[];    // 新的在前
};

type LedgerEntry = {
  id: string;
  createdAt: string;
  reportId: string;
  modelTier: "lite" | "pro" | "max";
  multiplier: number;       // lite 1 / pro 3 / max 5
  inputTokens: number;
  outputTokens: number;
  creditsCharged: number;
  inputType: "text" | "url";
};
```

## 3. 诊断

### `POST /api/diagnosis`

```json
{ "modelTier": "lite", "input": { "type": "url", "url": "https://bears.com.my/" } }
```

或

```json
{ "modelTier": "lite", "input": { "type": "text", "text": "..." } }
```

200 →

```ts
type CreateDiagnosisResult = {
  reportId: string;
  report: DiagnosisReport;   // 见第 4 节
  ledger: LedgerEntry;       // 本次扣减，前端用它刷新余额
};
```

失败：402 `insufficient_credit`；422 `scrape_failed` / `diagnosis_failed`。

本版只接受 `modelTier: "lite"`，Pro / Max 应返回 422。

## 4. 报告

### `GET /api/reports`

200 → `ReportListItem[]`（新的在前）

```ts
type ReportListItem = {
  id: string;
  createdAt: string;
  inputType: "text" | "url";
  title: string;          // 页面 title，或文本前 48 字
  preview: string;        // summary 前 96 字
  riskCount: number;
  topSeverity: "high" | "medium" | "low" | null;
  modelTier: "lite" | "pro" | "max";
  status: "ready" | "failed";
};
```

### `GET /api/reports/:id`

200 → `DiagnosisReport`；404。

```ts
type DiagnosisReport = {
  id: string;
  createdAt: string;
  market: string;          // "malaysia"
  marketLabel: string;     // "马来西亚"
  category: string;        // "小家电"
  modelTier: "lite" | "pro" | "max";
  input: { type: "text" | "url"; text?: string; url?: string; title?: string };
  summary: string;
  risks: Risk[];
  strengths: string[];
  notAssessable: string[];
  dims?: Record<string, number>;  // 后台四维分数，前端一律不渲染
  disclaimer: string;
};

type Risk = {
  id: string;
  severity: "high" | "medium" | "low";
  dimension:
    | "language_compliance"
    | "expression_naturalness"
    | "cultural_adaptation"
    | "communication_effectiveness";
  quote: string;      // 原文逐字引用，可回页面核对
  location?: string;  // "首页 Bestsellers 第 2 个商品"
  why: string;
  fix: string;
};
```

**报告里不要给前端分数。** `dims` 只用于后台统计，网页与 PDF 都不显示。

### `GET /api/reports/:id/pdf`

200 → `application/pdf`（Typst 生成，按需）。前端用 `<a href>` 直接打开，
所以这个地址要能接受 cookie 鉴权；如果是签名 URL，返回 302 也行。

## 5. 前端页面对应关系

| 页面 | 用到的接口 |
| --- | --- |
| `/login` `/register` | `auth/*` |
| `/app` 诊断台 | `POST /api/diagnosis`、`GET /api/account` |
| `/app/reports` | `GET /api/reports` |
| `/app/reports/[id]` | `GET /api/reports/:id`、`GET /api/reports/:id/pdf` |
| `/app/account` | `GET /api/account`、`POST /api/auth/logout` |
| `/sample` | 无（打包在示例数据里，未登录可看） |

## 6. 还没接的能力

- 邀请码管理界面（Ray 手动建码，本版不做 UI）。
- 用户体验改进计划开关（接口未定，演示模式下存在 localStorage）。
- 报告分享链接、删除报告。
