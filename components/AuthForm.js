"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function AuthForm({ mode }) {
  const t = useTranslations("auth");
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ type: null, message: null });
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: null });

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });

      if (error) {
        setStatus({ type: "error", message: t("error") });
      } else {
        // Mirror into `profiles` — safe to attempt even before email confirmation,
        // RLS policy allows a user to insert their own row.
        if (data.user) {
          await supabase.from("profiles").insert({
            id: data.user.id,
            full_name: fullName,
          });
        }
        setStatus({ type: "success", message: t("successSignup") });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setStatus({ type: "error", message: t("error") });
      } else {
        router.push("./");
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <h1 className="font-display-scoped text-3xl text-majorelleDeep">
        {isSignup ? t("signupTitle") : t("loginTitle")}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {isSignup && (
          <label className="flex flex-col gap-1 text-sm text-ink/70">
            {t("fullName")}
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-sm border border-majorelle/30 bg-white px-4 py-3 focus:outline-none focus:border-majorelle"
            />
          </label>
        )}

        <label className="flex flex-col gap-1 text-sm text-ink/70">
          {t("email")}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-sm border border-majorelle/30 bg-white px-4 py-3 focus:outline-none focus:border-majorelle"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink/70">
          {t("password")}
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-sm border border-majorelle/30 bg-white px-4 py-3 focus:outline-none focus:border-majorelle"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-clay px-6 py-3 font-medium text-sand transition-colors hover:bg-majorelleDeep disabled:opacity-50"
        >
          {isSignup ? t("signupCta") : t("loginCta")}
        </button>

        {status.message && (
          <p className={status.type === "error" ? "text-sm text-clay" : "text-sm text-mint"}>
            {status.message}
          </p>
        )}
      </form>

      <a
        href={isSignup ? "../login" : "../signup"}
        className="mt-6 inline-block text-sm text-majorelle underline underline-offset-4"
      >
        {isSignup ? t("switchToLogin") : t("switchToSignup")}
      </a>
    </div>
  );
}
