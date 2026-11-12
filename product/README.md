# Wendo 产品前端（11/15 演示版）

文渡 Wendo 的诊断产品界面。Next.js 14 App Router + React 18，独立于仓库根目录的官网（官网是 Next 16 静态导出，两者互不影响）。

## 跑起来

```bash
cd product
npm install
npm run dev          # http://localhost:3100
```

生产构建：

```bash
npm run build && npm start
```

## 数据源

默认是**演示模式**：账号、credit、报告都存在浏览器 localStorage，不连后端。
界面顶部会有一条「演示数据」提示，登录页会显示演示账号。

| 模式 | 开关 | 用途 |
| --- | --- | --- |
| 演示 | `NEXT_PUBLIC_DATA_SOURCE=mock`（默认） | 没有后端时走通全部页面 |
| 真实 | `NEXT_PUBLIC_DATA_SOURCE=api` + `NEXT_PUBLIC_API_BASE=https://...` | 接 RAY-656 / RAY-657 的接口 |

```bash
NEXT_PUBLIC_DATA_SOURCE=api NEXT_PUBLIC_API_BASE=http://localhost:8000 npm run build
```

接口形状见 [`docs/api-contract.md`](docs/api-contract.md)。

## 页面

| 路由 | 内容 |
| --- | --- |
| `/` | 未登录首页：品牌、演示入口、样本预览 |
| `/login` | 邮箱 + 密码，session 7 天 |
| `/register` | 邀请码注册 |
| `/app` | 诊断台：文本 / 链接切换，Lite 可选，Pro / Max 置灰，提交后显示三步进度 |
| `/app/reports` | 历史报告列表 |
| `/app/reports/[id]` | 报告：概览、优先修改顺序、风险清单（原文 / 原因 / 改法）、做得好的、未评估、免责声明 |
| `/app/account` | credit 余额、消耗记录、session 状态、隐私开关、退出 |
| `/sample` | 小熊电器马来西亚站首页报告，未登录可看 |

报告不含任何分数：`dims` 字段只透传，不渲染。

## 目录

```
src/lib/types.ts        领域类型（与后端共用的字段名）
src/lib/api.ts          唯一数据入口，mock / http 两个适配器
src/lib/demoStore.ts    演示数据源（localStorage）
src/lib/fixtures/       小熊电器真实诊断结果
src/lib/credit.ts       计费配置表（倍率、单价）
src/components/         会话、外壳、报告视图
src/app/                路由
docs/api-contract.md    给后端 / PDF 的接口契约
scripts/smoke.py        Playwright 冒烟脚本（可选，需要 python playwright）
```

## 验证

```bash
npm run typecheck                # tsc --noEmit
npm run build                    # 生产构建
python3 scripts/smoke.py         # 需要先 npm start，跑 20 项浏览器断言
```

`scripts/smoke.py` 覆盖：未登录拦截、邀请码校验、登录、档位置灰、文本诊断到报告、
报告无分数、账本新增一条、历史样本打开、刷新保持 session、退出。

## 未完成 / 待接

- 真实接口（RAY-656 / RAY-657）接入后，用 `NEXT_PUBLIC_DATA_SOURCE=api` 切换。
- Typst PDF：前端只放按钮，链到 `GET /api/reports/:id/pdf`；演示模式下退化为浏览器打印。
- 邀请码管理界面、2FA、记忆管理、支持访问：11/15 不在范围内。
