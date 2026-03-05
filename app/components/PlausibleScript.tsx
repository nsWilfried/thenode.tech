/**
 * Plausible analytics script tag.
 * Renders as a Server Component — no "use client" needed.
 * Place this once in the root layout inside <head>.
 */
export default function PlausibleScript() {
  return (
    <script
      defer
      data-domain="thenode.tech"
      src="https://plausible.io/js/script.tagged-events.js"
    />
  );
}
