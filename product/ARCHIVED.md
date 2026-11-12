# 已归档：仅作视觉参考

从 RAY-659（2026-11-12）起，11/15 演示版的唯一前端是
`obsidian-vault-wendo/Wendo`（Next 14 App Router + Better Auth + Postgres + Pi agent）。

本目录 `product/` 是 RAY-655 早期并行做出的独立演示壳，保留它是因为页面结构、
文案与交互细节可以作为视觉参考，但：

- **不要再在这里加功能，也不要把它接到演示环境**；
- 账号、credit、诊断、报告、PDF 的真实链路都在 canonical 目录里；
- 本目录的 `docs/api-contract.md` 只是当时的接口设想，当前契约以
  `obsidian-vault-wendo/Wendo/docs/frontend-api-contract.md` 为准。

归档决定记录在 RAY-659 的交付评论里。需要恢复这套 UI 时，从本分支检出即可。
