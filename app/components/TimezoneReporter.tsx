"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useRef } from "react";

function getBrowserTimezone(): string | null {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return null;
  }
}

/**
 * Reports browser timezone once per session when authenticated.
 * Free: always report. Premium: only when timezone not yet set (avoids overwriting Settings).
 */
export default function TimezoneReporter() {
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.queries.users.currentUser);
  const reportTimezone = useMutation(api.mutations.users.reportTimezone);
  const hasReportedRef = useRef(false);

  useEffect(() => {
    const isReady = isAuthenticated && user != null && user !== undefined;
    if (!isReady || hasReportedRef.current) return;
    if (user.isPremium && user.timezone) return;

    const tz = getBrowserTimezone();
    if (!tz) return;

    hasReportedRef.current = true;
    reportTimezone({ timezone: tz }).catch(() => {
      hasReportedRef.current = false;
    });
  }, [isAuthenticated, user, reportTimezone]);

  return null;
}
