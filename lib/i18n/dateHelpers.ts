/**
 * Format a newsletter date (ISO YYYY-MM-DD) for display:
 * "Today", "Yesterday", or a localized long date (e.g. "March 30, 2026").
 */
export function formatNewsletterDate(
  isoDate: string,
  options: {
    todayLabel: string;
    yesterdayLabel: string;
    locale?: string;
  }
): string {
  const today = toLocalDateString(new Date());
  const yesterday = toLocalDateString(
    new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

  if (isoDate === today) return options.todayLabel;
  if (isoDate === yesterday) return options.yesterdayLabel;

  const locale = options.locale ?? "en";
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
