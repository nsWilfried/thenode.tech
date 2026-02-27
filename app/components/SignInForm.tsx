"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useTranslation } from "../LanguageProvider";

export default function SignInForm({
  onSuccess,
  submitLabel,
}: {
  onSuccess?: () => void;
  /** Override button text (e.g. "Send magic link" on sign-in page). Defaults to "Subscribe". */
  submitLabel?: string;
}) {
  const { signIn } = useAuthActions();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "sent">("email");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSending(true);
    setError("");
    try {
      await signIn("resend", { email });
      setStep("sent");
      onSuccess?.();
    } catch {
      setError(t.common.somethingWentWrong);
    } finally {
      setSending(false);
    }
  };

  if (step === "sent") {
    return (
      <div className="text-center">
        <div className="mb-3 text-4xl">✉️</div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          {t.auth.checkEmail}
        </h3>
        <p className="mt-2 text-sm text-zinc-500">
          {t.auth.checkEmailDescription}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="mx-auto flex w-full max-w-md gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          placeholder={t.auth.emailPlaceholder}
          required
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-dark-surface dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-400"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {sending ? t.auth.sending : (submitLabel ?? t.auth.subscribe)}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </form>
  );
}
