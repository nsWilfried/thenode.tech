import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient, useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useRef, type ReactNode } from "react";
import { api } from "../../convex/_generated/api";

const url: string = import.meta.env.PUBLIC_CONVEX_URL ?? import.meta.env.NEXT_PUBLIC_CONVEX_URL;

// One client per browser tab, shared by every island on the page.
let client: ConvexReactClient | null = null;
function getClient() {
  client ??= new ConvexReactClient(url);
  return client;
}

/** Reports the browser timezone once, only when the user has none yet. */
function TimezoneReporter() {
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.queries.users.currentUser, isAuthenticated ? {} : "skip");
  const report = useMutation(api.mutations.users.reportTimezone);
  const done = useRef(false);
  useEffect(() => {
    if (!user || done.current) return;
    if (user.timezone) return;
    let tz: string | undefined;
    try {
      tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return;
    }
    if (!tz) return;
    done.current = true;
    report({ timezone: tz }).catch(() => {
      done.current = false;
    });
  }, [user, report]);
  return null;
}

/**
 * Wrap exactly ONE island per page with this. The auth provider consumes the
 * magic-link `?code=` from the URL; two providers on one page would race for it.
 */
export default function ConvexShell({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthProvider client={getClient()}>
      <TimezoneReporter />
      {children}
    </ConvexAuthProvider>
  );
}

export function track(event: string, props?: Record<string, string | number | boolean>) {
  const w = window as unknown as { plausible?: (e: string, o?: { props?: typeof props }) => void };
  w.plausible?.(event, props ? { props } : undefined);
}
