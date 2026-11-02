import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import ConvexShell, { track } from "./ConvexShell";

type Channel = { slug: string; name: string; blurb: string; icon: string };

export interface OnboardingProps {
  locale: string;
  channels: Channel[];
  title: string;
  subtitle: string;
  selectAll: string;
  deselectAll: string;
  continueLabel: string;
  selectAtLeastOne: string;
  errorText: string;
  loading: string;
}

function Inner(p: OnboardingProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.queries.users.currentUser, isAuthenticated ? {} : "skip");
  const complete = useMutation(api.mutations.users.completeOnboarding);
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) window.location.replace(`/${p.locale}/signin`);
  }, [isLoading, isAuthenticated, p.locale]);

  useEffect(() => {
    if (user?.onboardingComplete) window.location.replace(`/${p.locale}/settings`);
  }, [user, p.locale]);

  useEffect(() => {
    try {
      const pending = localStorage.getItem("thenode:pendingChannel");
      if (pending && p.channels.some((c) => c.slug === pending)) setSelected([pending]);
    } catch {}
  }, [p.channels]);

  if (!user || user.onboardingComplete) return <p className="muted" role="status">{p.loading}</p>;

  const toggle = (slug: string) => {
    setSelected((prev) => (prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]));
    setError("");
  };
  const all = selected.length === p.channels.length;

  const submit = async () => {
    if (selected.length === 0) return setError(p.selectAtLeastOne);
    setSaving(true);
    try {
      const res = await complete({ categories: selected as never });
      if (res && "success" in res && res.success === false) throw new Error(res.message);
      try {
        localStorage.removeItem("thenode:pendingChannel");
      } catch {}
      track("onboarding_complete", { channels: selected.length });
      window.location.assign(`/${p.locale}/settings?welcome=1`);
    } catch {
      setError(p.errorText);
      setSaving(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h1 style={{ margin: 0, fontWeight: 700, fontSize: "clamp(34px, 5vw, 52px)", letterSpacing: "-0.035em", lineHeight: 1.02 }}>{p.title}</h1>
        <p style={{ margin: 0, fontSize: 18, lineHeight: 1.55, color: "var(--ink-2)" }}>{p.subtitle}</p>
      </div>
      <div>
        <button type="button" className="btn ghost sm" onClick={() => setSelected(all ? [] : p.channels.map((c) => c.slug))}>
          {all ? p.deselectAll : p.selectAll}
        </button>
      </div>
      <div className="checks">
        {p.channels.map((c) => {
          const on = selected.includes(c.slug);
          return (
            <label key={c.slug} className={`check${on ? " on" : ""}`}>
              <input type="checkbox" checked={on} onChange={() => toggle(c.slug)} />
              <span className="ico"><img src={c.icon} alt="" width={16} height={16} className="icon-dark" /></span>
              <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 600 }}>{c.name}</span>
                <span style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>{c.blurb}</span>
              </span>
            </label>
          );
        })}
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <div>
        <button type="button" className="btn" onClick={submit} disabled={saving}>
          {saving ? "…" : p.continueLabel}
          <img src="/icons/arrow-right.svg" alt="" width={18} height={18} />
        </button>
      </div>
    </div>
  );
}

export default function Onboarding(props: OnboardingProps) {
  return (
    <ConvexShell>
      <Inner {...props} />
    </ConvexShell>
  );
}
