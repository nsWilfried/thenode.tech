import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "../../convex/_generated/api";
import ConvexShell, { track } from "./ConvexShell";

export interface SubscribeProps {
  locale: string;
  label: string;
  placeholder: string;
  sending: string;
  successNote: string;
  errorText: string;
  /** Channel to pre-select in onboarding when subscribing from a channel page. */
  channel?: string;
  size?: "lg" | "sm";
  showArrow?: boolean;
}

/** Sends users who land here signed-in but not onboarded (e.g. old magic links) to onboarding. */
function OnboardingRedirect({ locale }: { locale: string }) {
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.queries.users.currentUser, isAuthenticated ? {} : "skip");
  useEffect(() => {
    if (user && user.onboardingComplete === false) window.location.assign(`/${locale}/onboarding`);
  }, [user, locale]);
  return null;
}

function Form(p: SubscribeProps) {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("sending");
    try {
      if (p.channel) {
        try {
          localStorage.setItem("thenode:pendingChannel", p.channel);
        } catch {}
      }
      await signIn("resend", { email, redirectTo: `/${p.locale}/signin` });
      setState("sent");
      track("newsletter_signup", p.channel ? { channel: p.channel } : undefined);
    } catch {
      setState("error");
    }
  };

  const sm = p.size === "sm";
  if (state === "sent") {
    return (
      <p role="status" style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: "var(--orange-deep)" }}>
        {p.successNote}
      </p>
    );
  }
  return (
    <>
      <form className="subscribe" onSubmit={submit}>
        <label className="sr-only" htmlFor={`email-${p.channel ?? "home"}`}>Email</label>
        <input
          id={`email-${p.channel ?? "home"}`}
          className={`input${sm ? " sm" : ""}`}
          type="email"
          required
          autoComplete="email"
          placeholder={p.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className={`btn${sm ? " sm" : ""}`} type="submit" disabled={state === "sending"}>
          {state === "sending" ? p.sending : p.label}
          {p.showArrow && state !== "sending" && <img src="/icons/arrow-right.svg" alt="" width={18} height={18} />}
        </button>
      </form>
      {state === "error" && <p className="error" role="alert">{p.errorText}</p>}
    </>
  );
}

export default function Subscribe(props: SubscribeProps) {
  return (
    <ConvexShell>
      <OnboardingRedirect locale={props.locale} />
      <Form {...props} />
    </ConvexShell>
  );
}
