"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { WarningCircle } from "@phosphor-icons/react";

import { AuthShell } from "@/components/AuthShell";
import authStyles from "@/components/auth.module.css";
import { useSession } from "@/components/SessionProvider";
import { IS_DEMO } from "@/lib/api";
import { SECRET_AUTOCOMPLETE, SECRET_FIELD_TYPE } from "@/lib/form";
import { ApiError } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const { session, loading, login } = useSession();
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
    if (!email.includes("@")) {
      setError("填一个能收信的邮箱地址");
      return;
    }
    if (secret.length < 6) {
      setError("密码至少 6 位");
      return;
    }
    setSubmitting(true);
    try {
      await login({ email: email.trim(), secret });
      router.push("/app");
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : "登录失败，请稍后再试",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="登录"
      subtitle="用 Ray 发出来的账号登录，session 保留 7 天。"
      footer={
        <>
          <span>还没有账号？</span>
          <Link href="/register">用邀请码注册</Link>
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
          <label className="fieldLabel" htmlFor="login-email">
            邮箱
          </label>
          <input
            id="login-email"
            className="input"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(error) || undefined}
          />
        </div>

        <div className="field">
          <label className="fieldLabel" htmlFor="login-secret">
            密码
          </label>
          <input
            id="login-secret"
            className="input"
            type={SECRET_FIELD_TYPE}
            name="secret"
            autoComplete={SECRET_AUTOCOMPLETE}
            placeholder="至少 6 位"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            aria-invalid={Boolean(error) || undefined}
          />
        </div>

        {IS_DEMO ? (
          <p className={authStyles.hintBox}>
            演示环境账号：<code>ray@wendo.cn</code> / <code>wendo-2026</code>
          </p>
        ) : null}

        <div className={authStyles.actions}>
          <button
            type="submit"
            className={`btn btnPrimary ${authStyles.submit}`}
            disabled={submitting || loading}
          >
            {submitting ? "正在登录" : "登录"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
