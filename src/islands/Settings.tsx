import { useAuthActions } from "@convex-dev/auth/react";
import { CustomerPortalLink } from "@convex-dev/polar/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useState, type ReactNode } from "react";
import { api } from "../../convex/_generated/api";
import type { TranslationDict } from "../../lib/i18n/translations";
import type { SiteStrings } from "../../lib/i18n/siteStrings";
import { getTimeZoneOptions, formatTimeZoneLabel } from "../../lib/timezones";
import ConvexShell, { track } from "./ConvexShell";

type Channel = { slug: string; name: string; icon: string; hue: string };

export interface SettingsProps {
  locale: string;
  t: Pick<TranslationDict, "settings" | "nav" | "common" | "onboarding">;
  s: SiteStrings["settings"];
  channels: Channel[];
  languages: { code: string; name: string }[];
}

const DEFAULT_HOUR = 8;
const DEFAULT_DIGEST_DAY = 1;

function hourLabel(h: number, locale: string) {
  return new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(new Date(2000, 0, 1, h, 0));
}

function Panel({ id, title, desc, children }: { id?: string; title: string; desc?: ReactNode; children?: ReactNode }) {
  return (
    <section id={id} className="panel" style={{ display: "flex", flexDirection: "column", gap: 14, scrollMarginTop: 88 }}>
      <div>
        <h2>{title}</h2>
        {desc && <p className="muted" style={{ fontSize: 15, lineHeight: 1.5 }}>{desc}</p>}
      </div>
      {children}
    </section>
  );
}

function Inner({ locale, t, s, channels, languages }: SettingsProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const user = useQuery(api.queries.users.currentUser, isAuthenticated ? {} : "skip");
  const updatePreferences = useMutation(api.mutations.users.updatePreferences);
  const setUnsubscribed = useMutation(api.mutations.users.setUnsubscribed);
  const { signOut } = useAuthActions();

  const [language, setLanguage] = useState("en");
  const [categories, setCategories] = useState<string[]>([]);
  const [timezone, setTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "UTC";
    }
  });
  const [hour, setHour] = useState(DEFAULT_HOUR);
  const [digest, setDigest] = useState(false);
  const [digestDay, setDigestDay] = useState(DEFAULT_DIGEST_DAY);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [unsubBusy, setUnsubBusy] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) window.location.replace(`/${locale}/signin?next=${encodeURIComponent(`/${locale}/settings`)}`);
  }, [isLoading, isAuthenticated, locale]);

  useEffect(() => {
    if (user?.onboardingComplete === false) window.location.replace(`/${locale}/onboarding`);
  }, [user, locale]);

  useEffect(() => {
    if (!user || ready) return;
    const prefs = user.preferences ?? {};
    if (user.language) setLanguage(user.language);
    if (user.timezone) setTimezone(user.timezone);
    setCategories(prefs.categories ?? []);
    if (typeof prefs.preferredDeliveryHour === "number") setHour(prefs.preferredDeliveryHour);
    if (typeof prefs.weeklyDigestEnabled === "boolean") setDigest(prefs.weeklyDigestEnabled);
    if (typeof prefs.preferredDigestDay === "number") setDigestDay(prefs.preferredDigestDay);
    setReady(true);
  }, [user, ready]);

  useEffect(() => {
    if (ready && window.location.hash) document.querySelector(window.location.hash)?.scrollIntoView();
  }, [ready]);

  if (!user || !ready) return <p className="muted" role="status">{t.common.loading}</p>;

  const isPremium = user.isPremium ?? false;
  const unsubscribed = user.preferences?.unsubscribed === true;
  const pricing = `/${locale}/pricing`;
  const tzOptions = (() => {
    const list = getTimeZoneOptions();
    return list.includes(timezone) ? list : [timezone, ...list].sort();
  })();

  const toggle = (slug: string) => {
    setCategories((prev) => (prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug]));
    setStatus("idle");
  };

  const save = async () => {
    if (categories.length === 0) return setStatus("error");
    setStatus("saving");
    try {
      const res = await updatePreferences({
        categories: categories as never,
        ...(isPremium && {
          language,
          timezone,
          preferredDeliveryHour: hour,
          weeklyDigestEnabled: digest,
          preferredDigestDay: digestDay,
        }),
      });
      if (res && res.success === false) throw new Error(res.message);
      setStatus("saved");
      track("settings_saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  };

  const toggleUnsubscribe = async () => {
    setUnsubBusy(true);
    try {
      await setUnsubscribed({ unsubscribed: !unsubscribed });
      track(unsubscribed ? "resubscribe" : "unsubscribe");
    } finally {
      setUnsubBusy(false);
    }
  };

  const upgrade = (
    <a href={pricing} style={{ color: "var(--orange-deep)", fontWeight: 600 }}>{s.upgradeLink}</a>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <Panel id="account" title={t.settings.account}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>{user.email}</span>
          <span className={`badge${isPremium ? " premium" : ""}`}>{isPremium ? t.settings.premiumBadge : t.settings.freeBadge}</span>
          {!isPremium && upgrade}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {isPremium && (
            <CustomerPortalLink polarApi={api.polar} className="btn ghost sm">
              {t.settings.manageSubscription}
            </CustomerPortalLink>
          )}
          <button
            type="button"
            className="btn ghost sm"
            onClick={async () => {
              await signOut();
              window.location.assign(`/${locale}`);
            }}
          >
            <img src="/icons/log-out.svg" alt="" width={16} height={16} style={{ filter: "none" }} />
            {t.nav.signOut}
          </button>
        </div>
      </Panel>

      <Panel title={t.settings.categoriesTitle} desc={s.channelsHint}>
        <div className="checks">
          {channels.map((c) => {
            const on = categories.includes(c.slug);
            return (
              <label key={c.slug} className={`check${on ? " on" : ""}`}>
                <input type="checkbox" checked={on} onChange={() => toggle(c.slug)} />
                <span className="disc" style={{ background: c.hue }}><img src={c.icon} alt="" width={16} height={16} /></span>
                <span style={{ fontWeight: 500 }}>{c.name}</span>
              </label>
            );
          })}
        </div>
      </Panel>

      <Panel title={t.settings.language} desc={isPremium ? t.settings.languageDescPremium : t.settings.languageDescFree}>
        <select className="select" value={language} disabled={!isPremium} onChange={(e) => setLanguage(e.target.value)}>
          {languages.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
        {!isPremium && <div>{upgrade}</div>}
      </Panel>

      <Panel title={t.settings.deliveryTime} desc={isPremium ? t.settings.deliveryTimeDescPremium : t.settings.deliveryTimeDescFree}>
        {isPremium ? (
          <select className="select" value={hour} onChange={(e) => setHour(Number(e.target.value))}>
            {Array.from({ length: 24 }, (_, h) => (
              <option key={h} value={h}>{hourLabel(h, locale)}{h === DEFAULT_HOUR ? ` ${s.defaultSuffix}` : ""}</option>
            ))}
          </select>
        ) : (
          <p className="muted" style={{ fontSize: 15 }}>{s.freeDeliveryNote} {upgrade}</p>
        )}
      </Panel>

      <Panel title={t.settings.timezone} desc={t.settings.timezoneDesc}>
        {isPremium ? (
          <select className="select" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {tzOptions.map((tz) => (
              <option key={tz} value={tz}>{formatTimeZoneLabel(tz)}</option>
            ))}
          </select>
        ) : (
          <p className="muted" style={{ fontSize: 15 }}>
            {s.detectedTimezone.replace("{tz}", user.timezone ? formatTimeZoneLabel(user.timezone) : timezone)} {upgrade}
          </p>
        )}
      </Panel>

      <Panel title={s.weeklyDigestTitle} desc={isPremium ? s.weeklyDigestDescPremium : s.weeklyDigestDescFree}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: 14, border: "1px solid var(--line)", borderRadius: 12 }}>
          <span style={{ fontWeight: 500 }}>{s.enableWeeklyDigest}</span>
          <button type="button" role="switch" aria-checked={digest} aria-label={s.enableWeeklyDigest} className="switch" disabled={!isPremium} onClick={() => setDigest((d) => !d)} />
        </div>
        {digest && isPremium && (
          <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontWeight: 500, fontSize: 15 }}>{s.deliveryDay}</span>
            <select className="select" value={digestDay} onChange={(e) => setDigestDay(Number(e.target.value))}>
              {s.days.map((d, i) => (
                <option key={i} value={i}>{d}{i === DEFAULT_DIGEST_DAY ? ` ${s.defaultSuffix}` : ""}</option>
              ))}
            </select>
            <span className="note">{s.deliveredAtPreferredHour}</span>
          </label>
        )}
        {!isPremium && <div>{upgrade}</div>}
      </Panel>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, position: "sticky", bottom: 0, padding: "14px 0", background: "var(--paper)" }}>
        <button type="button" className="btn" onClick={save} disabled={status === "saving"}>
          {status === "saving" ? t.settings.saving : status === "saved" ? t.settings.saved : t.settings.savePreferences}
        </button>
        {status === "error" && (
          <p className="error" role="alert" style={{ margin: 0 }}>
            {categories.length === 0 ? t.onboarding.selectAtLeastOne : t.common.somethingWentWrong}
          </p>
        )}
      </div>

      <Panel id="unsubscribe" title={s.unsubscribeTitle} desc={unsubscribed ? s.pausedDesc : s.unsubscribeDesc}>
        <div>
          <button type="button" className={unsubscribed ? "btn sm" : "btn ghost sm"} onClick={toggleUnsubscribe} disabled={unsubBusy}>
            {unsubscribed ? s.resubscribeButton : s.unsubscribeButton}
          </button>
        </div>
      </Panel>
    </div>
  );
}

export default function Settings(props: SettingsProps) {
  return (
    <ConvexShell>
      <Inner {...props} />
    </ConvexShell>
  );
}
