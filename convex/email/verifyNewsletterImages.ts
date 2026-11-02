/**
 * Pre-flight checks for remote image URLs used in category newsletter HTML.
 * Removes imageUrl fields when the asset is not reachable or not an image, so
 * email clients do not load broken <img> tags (often hurts deliverability).
 */

import type { NewsletterData } from "./categoryNewsletterHtml";

const DEFAULT_TIMEOUT_MS = 8_000;

const IMAGE_TYPE_RE = /^image\//i;

function isHttpUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function looksLikeImagePath(pathname: string): boolean {
  return /\.(jpe?g|png|gif|webp|avif|svg|heic|heif|bmp|ico)(\?|#|$)/i.test(
    pathname
  );
}

function contentTypeIsImage(ct: string, pathname: string): boolean {
  const lower = ct.toLowerCase();
  if (IMAGE_TYPE_RE.test(lower)) return true;
  if (lower.includes("application/octet-stream") && looksLikeImagePath(pathname))
    return true;
  return false;
}

async function cancelBodyAfterPeek(res: Response): Promise<void> {
  if (!res.body) return;
  const reader = res.body.getReader();
  try {
    await reader.read();
  } finally {
    try {
      await reader.cancel();
    } catch {
      // ignore
    }
  }
}

/**
 * True when the URL responds with 2xx/206, appears to be an image, and the
 * connection succeeds within the timeout. Does not download the full resource.
 */
export async function verifyImageUrlIsReachable(
  url: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<boolean> {
  if (!url || !isHttpUrl(url)) return false;

  const parsed = new URL(url);
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);

  const run = async (useRange: boolean): Promise<boolean> => {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: ac.signal,
      headers: {
        "User-Agent": "TheNode-Newsletter-ImageCheck/1.0",
        Accept: "image/*,application/octet-stream;q=0.8",
        ...(useRange ? { Range: "bytes=0-4095" } : {}),
      },
    });
    if (res.status === 416 && useRange) {
      await cancelBodyAfterPeek(res);
      return run(false);
    }
    if (!(res.status >= 200 && res.status < 300) && res.status !== 206) {
      await cancelBodyAfterPeek(res);
      return false;
    }
    const ct = res.headers.get("content-type") || "";
    if (contentTypeIsImage(ct, parsed.pathname)) {
      await cancelBodyAfterPeek(res);
      return true;
    }
    if (!ct && res.ok) {
      // Rare: some CDNs omit Content-Type; accept only if path looks like an image
      if (looksLikeImagePath(parsed.pathname)) {
        await cancelBodyAfterPeek(res);
        return true;
      }
    }
    await cancelBodyAfterPeek(res);
    return false;
  };

  try {
    return await run(true);
  } catch {
    return false;
  } finally {
    clearTimeout(t);
  }
}

/**
 * Returns a shallow copy of the newsletter with `imageUrl` cleared anywhere
 * the URL failed verification. Editorial captions stay when the image is
 * dropped (caption alone is still optional in the template).
 */
export async function filterNewsletterImages(
  newsletter: NewsletterData,
  options?: { timeoutPerUrlMs?: number }
): Promise<NewsletterData> {
  const timeout = options?.timeoutPerUrlMs ?? DEFAULT_TIMEOUT_MS;
  const unique = new Set<string>();
  for (const s of newsletter.editorialContent || []) {
    if (s.imageUrl) unique.add(s.imageUrl);
  }
  for (const d of newsletter.deepDives || []) {
    if (d.imageUrl) unique.add(d.imageUrl);
  }
  if (unique.size === 0) return newsletter;

  const ok = new Map<string, boolean>();
  await Promise.all(
    [...unique].map(async (u) => {
      ok.set(u, await verifyImageUrlIsReachable(u, timeout));
    })
  );

  const failed = [...unique].filter((u) => !ok.get(u));
  if (failed.length > 0) {
    console.log(
      `[filterNewsletterImages] category=${newsletter.category} dropped ${failed.length} unreachable image(s)`
    );
  }

  return {
    ...newsletter,
    editorialContent: (newsletter.editorialContent || []).map((s) => {
      if (!s.imageUrl) return s;
      return ok.get(s.imageUrl)
        ? s
        : { ...s, imageUrl: undefined, imageCaption: s.imageCaption };
    }),
    deepDives: (newsletter.deepDives || []).map((d) => {
      if (!d.imageUrl) return d;
      return ok.get(d.imageUrl) ? d : { ...d, imageUrl: undefined };
    }),
  };
}
