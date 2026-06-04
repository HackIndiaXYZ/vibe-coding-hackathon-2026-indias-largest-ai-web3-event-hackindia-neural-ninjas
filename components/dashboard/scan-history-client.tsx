"use client";

/**
 * components/dashboard/scan-history-client.tsx
 *
 * Rich scan history table with:
 * - Type filters (All / Voice / SMS / Call)
 * - Sort toggle (Newest / Oldest)
 * - Pagination (10 per page)
 * - Empty state
 * - Skeleton loaders
 * - Toast-style feedback
 */

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Activity, Mic, MessageSquare, Phone, AlertTriangle,
  CheckCircle, ChevronLeft, ChevronRight, Clock,
  Shield, Filter, ArrowUpDown, Zap,
} from "lucide-react";
import type { Scan, ScanType } from "@/lib/db/types";
import { SCAN_TYPE_LABELS } from "@/lib/db/types";

interface ScanHistoryClientProps {
  initialScans: Scan[];
  total:        number;
  page:         number;
  limit:        number;
  currentType:  ScanType | null;
  currentSort:  "newest" | "oldest";
}

const SCAN_ICON: Record<ScanType, React.ElementType> = {
  voice:   Mic,
  message: MessageSquare,
  call:    Phone,
};

const SCAN_COLOR: Record<ScanType, string> = {
  voice:   "var(--primary)",
  message: "var(--chart-2)",
  call:    "var(--chart-1)",
};

const RISK_COLOR: Record<string, string> = {
  High:   "var(--destructive)",
  Medium: "var(--chart-1)",
  Low:    "var(--chart-2)",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function ScanRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 animate-pulse">
      <div className="h-10 w-10 rounded-xl shrink-0" style={{ background: "var(--muted)" }} />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 rounded-full" style={{ background: "var(--muted)" }} />
        <div className="h-2 w-48 rounded-full" style={{ background: "var(--muted)" }} />
      </div>
      <div className="h-6 w-16 rounded-full" style={{ background: "var(--muted)" }} />
      <div className="h-6 w-12 rounded-full" style={{ background: "var(--muted)" }} />
      <div className="h-4 w-20 rounded-full" style={{ background: "var(--muted)" }} />
    </div>
  );
}

export function ScanHistoryClient({
  initialScans,
  total,
  page,
  limit,
  currentType,
  currentSort,
}: ScanHistoryClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const totalPages = Math.ceil(total / limit);

  function navigate(params: Record<string, string | undefined>) {
    const sp = new URLSearchParams();
    const merged = {
      page: String(page),
      type: currentType ?? undefined,
      sort: currentSort,
      ...params,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v !== "null" && v !== "undefined") sp.set(k, v);
    });
    startTransition(() => {
      router.push(`/dashboard/history?${sp.toString()}`);
    });
  }

  const filterTabs: { label: string; value: ScanType | null }[] = [
    { label: "All",           value: null      },
    { label: "Voice",         value: "voice"   },
    { label: "SMS / Message", value: "message" },
    { label: "Call",          value: "call"    },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* ── Page header ── */}
      <div
        className="relative rounded-2xl p-6 overflow-hidden"
        style={{
          background: "color-mix(in oklch, var(--primary) 10%, var(--card))",
          border: "1px solid color-mix(in oklch, var(--primary) 25%, var(--border))",
        }}
      >
        <div
          className="absolute -top-8 -right-8 h-32 w-32 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "var(--primary)" }}
        />
        <div className="relative z-10 flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background: "color-mix(in oklch, var(--primary) 20%, transparent)",
              border: "1px solid color-mix(in oklch, var(--primary) 35%, transparent)",
            }}
          >
            <Activity className="h-6 w-6" style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight" style={{ color: "var(--card-foreground)" }}>
              Scan History
            </h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              {total > 0
                ? `${total} total scans · Supabase-powered real-time history`
                : "No scans yet. Run your first scan to see history here."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Filters + Sort ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        {/* Type filter tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--muted-foreground)" }} />
          {filterTabs.map(({ label, value }) => {
            const active = currentType === value;
            return (
              <button
                key={label}
                onClick={() => navigate({ type: value ?? undefined, page: "1" })}
                disabled={isPending}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50"
                style={
                  active
                    ? {
                        background: "color-mix(in oklch, var(--primary) 15%, transparent)",
                        color: "var(--primary)",
                        border: "1px solid color-mix(in oklch, var(--primary) 35%, transparent)",
                      }
                    : {
                        background: "var(--muted)",
                        color: "var(--muted-foreground)",
                        border: "1px solid var(--border)",
                      }
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Sort toggle */}
        <button
          onClick={() => navigate({ sort: currentSort === "newest" ? "oldest" : "newest", page: "1" })}
          disabled={isPending}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:scale-105 disabled:opacity-50"
          style={{
            background: "var(--muted)",
            color: "var(--muted-foreground)",
            border: "1px solid var(--border)",
          }}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
          {currentSort === "newest" ? "Newest First" : "Oldest First"}
        </button>
      </div>

      {/* ── Table ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        {/* Header row */}
        <div
          className="hidden sm:grid px-5 py-3 text-[10px] font-bold uppercase tracking-widest"
          style={{
            gridTemplateColumns: "1fr 1fr auto auto auto",
            borderBottom: "1px solid var(--border)",
            color: "var(--muted-foreground)",
          }}
        >
          <span>Type</span>
          <span>Summary</span>
          <span>Risk</span>
          <span>Credits</span>
          <span>Date</span>
        </div>

        {/* Loading skeletons */}
        {isPending && (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <ScanRowSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isPending && initialScans.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{ background: "var(--muted)" }}
            >
              <Activity className="h-8 w-8" style={{ color: "var(--muted-foreground)" }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold" style={{ color: "var(--card-foreground)" }}>
                {currentType ? `No ${SCAN_TYPE_LABELS[currentType]} scans yet` : "No scans yet"}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                Run a scan from the Voice, SMS, or Call analyzer to build your history.
              </p>
            </div>
          </div>
        )}

        {/* Scan rows */}
        {!isPending && initialScans.length > 0 && (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {initialScans.map((scan) => {
              const Icon = SCAN_ICON[scan.scan_type];
              const scanColor = SCAN_COLOR[scan.scan_type];
              const riskColor = scan.risk_level ? RISK_COLOR[scan.risk_level] : "var(--muted-foreground)";
              const RiskIcon = scan.is_threat ? AlertTriangle : CheckCircle;

              return (
                <div
                  key={scan.id}
                  className="flex flex-col sm:grid px-5 py-4 gap-3 sm:gap-0 transition-colors hover:bg-opacity-50"
                  style={{
                    gridTemplateColumns: "1fr 1fr auto auto auto",
                    alignItems: "center",
                  }}
                >
                  {/* Type */}
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: `color-mix(in oklch, ${scanColor} 12%, transparent)`,
                        border: `1px solid color-mix(in oklch, ${scanColor} 30%, transparent)`,
                      }}
                    >
                      <Icon className="h-4 w-4" style={{ color: scanColor }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--card-foreground)" }}>
                        {SCAN_TYPE_LABELS[scan.scan_type]}
                      </p>
                      <p className="text-[10px] sm:hidden" style={{ color: "var(--muted-foreground)" }}>
                        {formatDate(scan.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <p
                    className="text-xs max-w-[200px] truncate"
                    style={{ color: "var(--muted-foreground)" }}
                    title={scan.input_summary ?? "—"}
                  >
                    {scan.input_summary ?? "—"}
                  </p>

                  {/* Risk */}
                  <div className="flex items-center gap-1.5">
                    <RiskIcon className="h-3.5 w-3.5 shrink-0" style={{ color: riskColor }} />
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: `color-mix(in oklch, ${riskColor} 12%, transparent)`,
                        color: riskColor,
                        border: `1px solid color-mix(in oklch, ${riskColor} 30%, transparent)`,
                      }}
                    >
                      {scan.risk_level ?? "N/A"}
                    </span>
                  </div>

                  {/* Credits */}
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" style={{ color: "var(--primary)" }} />
                    <span className="text-xs font-semibold" style={{ color: "var(--muted-foreground)" }}>
                      {scan.credits_used}
                    </span>
                  </div>

                  {/* Date */}
                  <p className="hidden sm:block text-[10px]" style={{ color: "var(--muted-foreground)" }}>
                    <Clock className="h-3 w-3 inline mr-1" style={{ color: "var(--muted-foreground)" }} />
                    {formatDate(scan.created_at)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            Showing {((page - 1) * limit) + 1}–{Math.min(page * limit, total)} of {total} scans
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate({ page: String(page - 1) })}
              disabled={page <= 1 || isPending}
              className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => navigate({ page: String(p) })}
                  disabled={isPending}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all hover:scale-105 disabled:opacity-50"
                  style={
                    p === page
                      ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                      : { background: "var(--muted)", color: "var(--muted-foreground)" }
                  }
                >
                  {p}
                </button>
              );
            })}

            <button
              onClick={() => navigate({ page: String(page + 1) })}
              disabled={page >= totalPages || isPending}
              className="flex h-8 w-8 items-center justify-center rounded-xl transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Security note */}
      <div
        className="flex items-start gap-2.5 rounded-xl p-4"
        style={{ background: "var(--muted)" }}
      >
        <Shield className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          All scan data is stored securely in Supabase with Row Level Security. Only you can see your scans.
        </p>
      </div>
    </div>
  );
}
