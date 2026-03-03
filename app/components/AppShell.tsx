"use client";

import { ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-dark-bg dark:text-zinc-100">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

