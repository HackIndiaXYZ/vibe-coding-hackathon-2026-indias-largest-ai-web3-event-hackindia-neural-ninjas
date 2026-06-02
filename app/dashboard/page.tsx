import type { Metadata } from "next";
// Layout handles auth + DashboardShell wrapper.
// This page renders as children → shell shows overview (no children prop).

export const metadata: Metadata = {
  title: "Dashboard — TruScan AI",
  description: "Your TruScan AI protection dashboard.",
};

/**
 * /dashboard — Overview page.
 * The DashboardShell layout wraps this page. When children is undefined/null
 * the shell renders its built-in overview content.
 * We return null here so the shell falls back to the overview.
 */
export default function DashboardPage() {
  return null;
}
