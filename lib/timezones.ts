const FALLBACK_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
] as const;

function getSupportedTimeZones(): string[] {
  try {
    const fn = (Intl as { supportedValuesOf?(key: "timeZone"): string[] }).supportedValuesOf;
    if (typeof fn === "function") {
      return fn.call(Intl, "timeZone").slice().sort();
    }
  } catch {
    // use fallback
  }
  return [...FALLBACK_TIMEZONES].sort();
}

let cachedOptions: string[] | null = null;

/** IANA timezone identifiers for use in a select. Uses Intl when available. */
export function getTimeZoneOptions(): string[] {
  if (cachedOptions === null) {
    cachedOptions = getSupportedTimeZones();
  }
  return cachedOptions;
}

const TIMEZONE_NAME_PART_TYPE = "timeZoneName";

/** Format timezone for display, e.g. "America/New_York (GMT-5)". */
export function formatTimeZoneLabel(tz: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    }).formatToParts(new Date());
    const offset = parts.find((p) => p.type === TIMEZONE_NAME_PART_TYPE)?.value ?? "";
    return offset ? `${tz} (${offset})` : tz;
  } catch {
    return tz;
  }
}
