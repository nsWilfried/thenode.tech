import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../convex/_generated/api";
import ConvexShell, { track } from "./ConvexShell";

export interface SignInProps {
  locale: string;
  placeholder: string;
  sendLink: string;
  sending: string;
  linkSent: string;
  loading: string;
  errorText: string;
}

const NEXT_KEY = "thenode:next";

function safeNext(locale: string): string | null {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("next");
    if (fromUrl) localStorage.setItem(NEXT_KEY, fromUrl);
    const next = fromUrl ?? localStorage.getItem(NEXT_KEY);
    // Only same-site paths in a locale, never "//evil.com".
    if (next && /^\/[a-z]{2}(\/[\w\-/#?=&.]*)?$/.test(next)) return next;
  } catch {}
  void locale;
  return null;
}

function Inner(p: SignInProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.queries.users.currentUser, isAuthenticated ? {} : "skip");
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    safeNext(p.locale); // capture ?next= before the magic-link round-trip
  }, [p.locale]);

  useEffect(() => {
    if (!user) return;
    const next = safeNext(p.locale);
    try {
      localStorage.removeItem(NEXT_KEY);
    } catch {}
    if (user.onboardingComplete === false) window.location.replace(`/${p.locale}/onboarding`);
    else window.location.replace(next ?? `/${p.locale}/settings`);
  }, [user, p.locale]);

  if (isLoading || (isAuthenticated && user !== null)) {
    return <p className="muted" role="status">{p.loading}</p>;
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      await signIn("resend", { email, redirectTo: `/${p.locale}/signin` });
      setState("sent");
      track("signin_link_sent");
    } catch {
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div role="status" style={{ padding: 20, borderRadius: 10, background: "var(--paper-2)", border: "1px solid var(--line-strong)", fontSize: 15, lineHeight: 1.5 }}>
        {p.linkSent}
      </div>
    );
  }
  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <label className="sr-only" htmlFor="signin-email">Email</label>
      <input id="signin-email" className="input" type="email" required autoComplete="email" placeholder={p.placeholder} value={email} onChange={(e) => setEmail(e.target.value)} />
      <button className="btn" type="submit" disabled={state === "sending"}>
        <img src="/icons/mail.svg" alt="" width={18} height={18} />
        {state === "sending" ? p.sending : p.sendLink}
      </button>
      {state === "error" && <p className="error" role="alert">{p.errorText}</p>}
    </form>
  );
}

export default function SignIn(props: SignInProps) {
  return (
    <ConvexShell>
      <Inner {...props} />
    </ConvexShell>
  );
}
