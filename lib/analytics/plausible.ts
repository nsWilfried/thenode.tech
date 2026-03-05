/**
 * Lightweight Plausible analytics helpers.
 * Plausible's script exposes `window.plausible` for custom events.
 */

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string | number | boolean> }
    ) => void;
  }
}

/** Fire a Plausible custom event if the script has loaded. Safe to call anywhere. */
export function trackEvent(
  eventName: string,
  props?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && typeof window.plausible === "function") {
    window.plausible(eventName, props ? { props } : undefined);
  }
}

/** React hook that returns a `trackEvent`-compatible function for use in client components. */
export function usePlausible() {
  return trackEvent;
}
