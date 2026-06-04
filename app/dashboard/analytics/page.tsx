import type { Metadata } from "next";
import { getScanAnalytics } from "@/lib/db/scans.service";
import { getProfile } from "@/lib/db/profile.service";
import { listScans } from "@/lib/db/scans.service";
import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";

export const metadata: Metadata = {
  title: "Analytics — TruScan AI",
  description: "Visual insights, scan trends, and threat analytics for your TruScan AI account.",
};

export default async function AnalyticsPage() {
  const [profile, analytics, recentScans] = await Promise.all([
    getProfile(),
    getScanAnalytics(),
    listScans({ limit: 50, orderBy: "newest" }),
  ]);

  return (
    <AnalyticsDashboard
      analytics={analytics}
      plan={profile?.plan ?? "free"}
      credits={profile?.credits ?? 100}
      recentScans={recentScans.scans}
    />
  );
}
