import type { Metadata } from "next";
import { listScans } from "@/lib/db/scans.service";
import { ScanHistoryClient } from "@/components/dashboard/scan-history-client";
import type { ScanType } from "@/lib/db/types";

export const metadata: Metadata = {
  title: "Scan History — TruScan AI",
  description: "Search, filter, and review all your past TruScan AI analysis results.",
};

interface PageProps {
  searchParams: Promise<{ page?: string; type?: string; sort?: string }>;
}

export default async function ScanHistoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page   = Math.max(1, parseInt(params.page ?? "1", 10));
  const type   = (params.type as ScanType | undefined) || undefined;
  const sort   = (params.sort === "oldest" ? "oldest" : "newest") as "newest" | "oldest";
  const limit  = 10;
  const offset = (page - 1) * limit;

  const { scans, total } = await listScans({ limit, offset, orderBy: sort, scanType: type });

  return (
    <ScanHistoryClient
      initialScans={scans}
      total={total}
      page={page}
      limit={limit}
      currentType={type ?? null}
      currentSort={sort}
    />
  );
}
