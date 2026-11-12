"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, LinkSimple, TextT, WarningCircle } from "@phosphor-icons/react";

import { useSession } from "@/components/SessionProvider";
import { api } from "@/lib/api";
import { CREDIT_RATE, creditsFor, estimateTokens } from "@/lib/credit";
import { TIER_HINT, TIER_LABEL } from "@/lib/format";
import { ApiError, type ModelTier } from "@/lib/types";

import styles from "./workspace.module.css";

const TIERS: ModelTier[] = ["lite", "pro", "max"];
const RUN_STEPS = ["读取提交内容", "检索马来西亚知识库", "逐条生成风险与改法"];

export default function WorkspacePage() {
  const router = useRouter();
  const { account, refreshAccount } = useSession();
  const [inputType, setInputType] = useState<"text" | "url">("text");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("https://bears.com.my/");
  const [tier, setTier] = useState<ModelTier>("lite");
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const payloadText = inputType === "url" ? url : text;
  const estimatedTokens = estimateTokens(payloadText);
  const estimate = creditsFor(tier, estimatedTokens, 940);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (inputType === "url") {
      if (!/^https?:\/\/\S+$/i.test(url.trim())) {
        setError("链接要以 http:// 或 https:// 开头，只抓这一个页面");
        return;
      }
    } else if (text.trim().length < 40) {
      setError("至少贴 40 个字符，太短的内容没法给出可核对的风险");
      return;
    }

    setRunning(true);
    setStepIndex(0);
    timerRef.current = setInterval(() => {
      setStepIndex((current) => (current + 1 < RUN_STEPS.length ? current + 1 : current));
    }, 900);

    try {
      const result = await api.createDiagnosis({
        modelTier: tier,
        input:
          inputType === "url"
            ? { type: "url", url: url.trim() }
            : { type: "text", text: text.trim() },
      });
      await refreshAccount();
      router.push(`/app/reports/${result.reportId}`);
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : "诊断失败，请稍后再试",
      );
      setRunning(false);
    } finally {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p className="meta">新建诊断</p>
        <h1 className={styles.title}>这次看哪段内容</h1>
        <p className={styles.lede}>
          一次只看一份：一段文案，或者一个页面的首屏。市场固定马来西亚，品类固定小家电。
        </p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.modeRow}>
          <div className={styles.segmented} role="tablist" aria-label="输入方式">
            <button
              type="button"
              role="tab"
              aria-selected={inputType === "text"}
              className={`${styles.segment} ${inputType === "text" ? styles.segmentActive : ""}`}
              onClick={() => setInputType("text")}
              disabled={running}
            >
              <TextT size={15} weight="regular" aria-hidden="true" />
              粘贴文本
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={inputType === "url"}
              className={`${styles.segment} ${inputType === "url" ? styles.segmentActive : ""}`}
              onClick={() => setInputType("url")}
              disabled={running}
            >
              <LinkSimple size={15} weight="regular" aria-hidden="true" />
              填一个链接
            </button>
          </div>
          <p className={styles.modeHint}>
            {inputType === "text"
              ? "贴首页标题、商品名或一段介绍文字"
              : "只抓这个页面本身，不跟站内链接"}
          </p>
        </div>

        {inputType === "text" ? (
          <div className="field">
            <label className="fieldLabel" htmlFor="diagnosis-text">
              要诊断的文案
            </label>
            <textarea
              id="diagnosis-text"
              className="textarea"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="把首页上出现的英文标题、卖点或产品名原样贴进来"
              disabled={running}
              aria-describedby="diagnosis-text-hint"
            />
            <p className="fieldHint" id="diagnosis-text-hint">
              {text.trim().length} 个字符，建议 200 字以上，太短看不出问题。
            </p>
          </div>
        ) : (
          <div className="field">
            <label className="fieldLabel" htmlFor="diagnosis-url">
              页面链接
            </label>
            <input
              id="diagnosis-url"
              className="input"
              type="url"
              inputMode="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/"
              disabled={running}
              aria-describedby="diagnosis-url-hint"
            />
            <p className="fieldHint" id="diagnosis-url-hint">
              要能公开访问。需要登录或靠 JS 渲染的页面可能抓不到内容。
            </p>
          </div>
        )}

        <fieldset className={styles.models} disabled={running}>
          <legend className="fieldLabel">模型档位</legend>
          <div className={styles.modelGrid}>
            {TIERS.map((item) => {
              const locked = item !== "lite";
              return (
                <label
                  key={item}
                  className={`${styles.model} ${tier === item ? styles.modelActive : ""} ${
                    locked ? styles.modelLocked : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="tier"
                    value={item}
                    checked={tier === item}
                    onChange={() => setTier(item)}
                    disabled={locked || running}
                    className="srOnly"
                  />
                  <span className={styles.modelHead}>
                    <span className={styles.modelName}>{TIER_LABEL[item]}</span>
                    <span className={styles.modelCost}>
                      {item === "lite" ? "1x" : item === "pro" ? "3x" : "5x"}
                    </span>
                  </span>
                  <span className={styles.modelHint}>{TIER_HINT[item]}</span>
                  {locked ? (
                    <span className={styles.modelLock}>11/15 后开放</span>
                  ) : null}
                </label>
              );
            })}
          </div>
        </fieldset>

        {error ? (
          <p className={styles.formError} role="alert">
            <WarningCircle size={16} weight="fill" aria-hidden="true" />
            {error}
          </p>
        ) : null}

        <div className={styles.submitRow}>
          <div className={styles.cost}>
            <span className={styles.costLabel}>本次预计消耗</span>
            <span className={styles.costValue}>{estimate.toFixed(3)} credit</span>
            <span className={styles.costNote}>
              余额 {account ? account.credits.toFixed(2) : "…"} · Lite{" "}
              {CREDIT_RATE.inputPer1k}/1K 输入 · {CREDIT_RATE.outputPer1k}/1K 输出
            </span>
          </div>
          <button type="submit" className="btn btnPrimary" disabled={running}>
            {running ? "正在诊断" : "开始诊断"}
            {running ? null : <ArrowRight size={16} weight="bold" aria-hidden="true" />}
          </button>
        </div>

        {running ? (
          <div className={styles.progress} role="status" aria-live="polite">
            <ol className={styles.progressList}>
              {RUN_STEPS.map((step, index) => (
                <li
                  key={step}
                  className={`${styles.progressStep} ${
                    index < stepIndex
                      ? styles.progressDone
                      : index === stepIndex
                        ? styles.progressActive
                        : ""
                  }`}
                >
                  <span className={styles.progressDot} aria-hidden="true" />
                  {step}
                </li>
              ))}
            </ol>
            <p className={styles.progressNote}>通常 20 到 50 秒，页面别关。</p>
          </div>
        ) : null}
      </form>
    </div>
  );
}
