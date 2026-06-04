import type { Metadata } from "next";
import { getScanAnalytics, listScans } from "@/lib/db/scans.service";
import { getProfile } from "@/lib/db/profile.service";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard — TruScan AI",
  description: "Your TruScan AI security dashboard.",
};

export default async function DashboardPage() {
  const [profile, analytics, { scans: recentScans }] = await Promise.all([
    getProfile(),
    getScanAnalytics(),
    listScans({ limit: 5, orderBy: "newest" }),
  ]);

  return (
    <DashboardOverview
      credits={profile?.credits ?? 100}
      plan={profile?.plan ?? "free"}
      analytics={analytics}
      recentScans={recentScans}
    />
  );
}
