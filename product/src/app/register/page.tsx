"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { WarningCircle } from "@phosphor-icons/react";

import { AuthShell } from "@/components/AuthShell";
import authStyles from "@/components/auth.module.css";
import { useSession } from "@/components/SessionProvider";
import { IS_DEMO } from "@/lib/api";
import { NEW_SECRET_AUTOCOMPLETE, SECRET_FIELD_TYPE } from "@/lib/form";
import { ApiError } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const { session, loading, register } = useSession();
  const [inviteCode, setInviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      router.replace("/app");
    }
  }, [loading, router, session]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!inviteCode.trim()) {
      setError("没有邀请码就不能注册，找 Ray 要一个");
      return;
    }
    if (!email.includes("@")) {
      setError("填一个能收信的邮箱地址");
      return;
    }
    if (secret.length < 8) {
      setError("密码至少 8 位");
      return;
    }
    setSubmitting(true);
    try {
      await register({ email: email.trim(), secret, inviteCode: inviteCode.trim() });
      router.push("/app");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "注册失败，请稍后再试");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="用邀请码注册"
      subtitle="第一版是邀请制。邀请码的有效期和可用人数由 Ray 设定。"
      footer={
        <>
          <span>已经有账号？</span>
          <Link href="/login">去登录</Link>
          <Link href="/">回到首页</Link>
        </>
      }
    >
      <form className={authStyles.form} onSubmit={handleSubmit} noValidate>
        {error ? (
          <p className={authStyles.formError} role="alert">
            <WarningCircle size={16} weight="fill" aria-hidden="true" />
            {error}
          </p>
        ) : null}

        <div className="field">
          <label className="fieldLabel" htmlFor="register-invite">
            邀请码
          </label>
          <input
            id="register-invite"
            className="input"
            type="text"
            name="inviteCode"
            autoComplete="off"
            spellCheck={false}
            placeholder="例如 WENDO-DEMO"
            value={inviteCode}
            onChange={(event) => setInviteCode(event.target.value.toUpperCase())}
            aria-describedby="register-invite-hint"
          />
          <span className="fieldHint" id="register-invite-hint">
            注册记录会留档：谁在用、什么时候用、用的哪个码。
          </span>
        </div>

        <div className="field">
          <label className="fieldLabel" htmlFor="register-email">
            邮箱
          </label>
          <input
            id="register-email"
            className="input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="field">
          <label className="fieldLabel" htmlFor="register-secret">
            密码
          </label>
          <input
            id="register-secret"
            className="input"
            type={SECRET_FIELD_TYPE}
            name="secret"
            autoComplete={NEW_SECRET_AUTOCOMPLETE}
            placeholder="至少 8 位"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            aria-describedby="register-secret-hint"
          />
          <span className="fieldHint" id="register-secret-hint">
            本版没有邮箱验证与密码重置，请自己记好。
          </span>
        </div>

        {IS_DEMO ? (
          <p className={authStyles.hintBox}>
            演示环境邀请码：<code>WENDO-DEMO</code>（只够 1 个名额）
          </p>
        ) : null}

        <div className={authStyles.actions}>
          <button
            type="submit"
            className={`btn btnPrimary ${authStyles.submit}`}
            disabled={submitting || loading}
          >
            {submitting ? "正在创建" : "创建账号"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
