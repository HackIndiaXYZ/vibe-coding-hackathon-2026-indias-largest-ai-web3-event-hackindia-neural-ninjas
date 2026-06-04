"use client";

/**
 * components/dashboard/analytics-dashboard.tsx
 *
 * Full analytics dashboard with:
 * - Summary metric cards (Stripe/Linear style)
 * - Scan type distribution bar chart (pure CSS)
 * - Weekly activity heatmap
 * - Threat rate gauge
 * - Credit usage breakdown
 * - Monthly summary
 */

import {
  BarChart3, Mic, MessageSquare, Phone, AlertTriangle,
  Shield, TrendingUp, Zap, CheckCircle, Activity,
  Clock, Target, Crown,
} from "lucide-react";
import type { Plan, Scan, ScanType } from "@/lib/db/types";
import type { ScanAnalytics } from "@/lib/db/scans.service";
import { PLAN_CREDITS, SCAN_TYPE_LABELS } from "@/lib/db/types";

interface AnalyticsDashboardProps {
  analytics:   ScanAnalytics;
  plan:        Plan;
  credits:     number;
  recentScans: Scan[];
}

const V = {
  primary:    "var(--primary)",
  primaryFg:  "var(--primary-foreground)",
  card:       "var(--card)",
  border:     "var(--border)",
  muted:      "var(--muted)",
  mutedFg:    "var(--muted-foreground)",
  cardFg:     "var(--card-foreground)",
  chart1:     "var(--chart-1)",
  chart2:     "var(--chart-2)",
  chart4:     "var(--chart-4)",
  destructive:"var(--destructive)",
};

const SCAN_COLORS: Record<ScanType, string> = {
  voice:   V.primary,
  message: V.chart2,
  call:    V.chart1,
};

// Group scans by day for weekly activity
function groupByDay(scans: Scan[], days = 7): { label: string; count: number }[] {
  const result: { label: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const label   = d.toLocaleDateString("en-IN", { weekday: "short" });
    const count   = scans.filter((s) => s.created_at.startsWith(dateStr)).length;
    result.push({ label, count });
  }
  return result;
}

// Group scans by week for monthly view
function groupByWeek(scans: Scan[]): { label: string; count: number }[] {
  const result: { label: string; count: number }[] = [];
  for (let w = 3; w >= 0; w--) {
    const start = new Date();
    start.setDate(start.getDate() - (w + 1) * 7);
    const end = new Date();
    end.setDate(end.getDate() - w * 7);
    const count = scans.filter((s) => {
      const d = new Date(s.created_at);
      return d >= start && d < end;
    }).length;
    result.push({ label: `W${4 - w}`, count });
  }
  return result;
}

export function AnalyticsDashboard({ analytics, plan, credits, recentScans }: AnalyticsDashboardProps) {
  const { totalScans, voiceScans, messageScans, callScans, threatsDetected, creditsUsed } = analytics;
  const weeklyData  = groupByDay(recentScans);
  const monthlyData = groupByWeek(recentScans);
  const maxWeekly   = Math.max(...weeklyData.map((d) => d.count), 1);
  const maxMonthly  = Math.max(...monthlyData.map((d) => d.count), 1);
  const threatRate  = totalScans > 0 ? Math.round((threatsDetected / totalScans) * 100) : 0;
  const planMax     = PLAN_CREDITS[plan];
  const creditPct   = planMax === 999999 ? 0 : Math.min(100, Math.round((creditsUsed / planMax) * 100));
  const safeRate    = 100 - threatRate;

  const metricCards = [
    {
      icon:  BarChart3,
      label: "Total Scans",
      value: totalScans,
      color: V.primary,
      sub:   "All time",
      trend: totalScans > 0 ? `+${totalScans} this session` : "Run your first scan",
    },
    {
      icon:  AlertTriangle,
      label: "Threats Detected",
      value: threatsDetected,
      color: V.destructive,
      sub:   `${threatRate}% threat rate`,
      trend: threatsDetected > 0 ? "Stay vigilant" : "All clear ✓",
    },
    {
      icon:  CheckCircle,
      label: "Safe Scans",
      value: totalScans - threatsDetected,
      color: V.chart2,
      sub:   `${safeRate}% safe rate`,
      trend: "Protected",
    },
    {
      icon:  Zap,
      label: "Credits Used",
      value: creditsUsed,
      color: V.chart1,
      sub:   `of ${planMax === 999999 ? "∞" : planMax} plan credits`,
      trend: credits === 999999 ? "Unlimited" : `${credits} remaining`,
    },
  ];

  const scanTypeBreakdown = [
    { type: "voice" as ScanType,   label: "Voice",   count: voiceScans,   Icon: Mic          },
    { type: "message" as ScanType, label: "SMS",     count: messageScans, Icon: MessageSquare },
    { type: "call" as ScanType,    label: "Call",    count: callScans,    Icon: Phone        },
  ];
  const maxScanCount = Math.max(voiceScans, messageScans, callScans, 1);

  return (
    <div className="p-4 sm:p-6 space-y-6">

      {/* ── Page header ── */}
      <div
        className="relative rounded-2xl p-6 overflow-hidden"
        style={{
          background: `color-mix(in oklch, ${V.chart2} 10%, ${V.card})`,
          border: `1px solid color-mix(in oklch, ${V.chart2} 25%, ${V.border})`,
        }}
      >
        <div
          className="absolute -top-8 -right-8 h-32 w-32 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: V.chart2 }}
        />
        <div className="relative z-10 flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background: `color-mix(in oklch, ${V.chart2} 20%, transparent)`,
              border: `1px solid color-mix(in oklch, ${V.chart2} 35%, transparent)`,
            }}
          >
            <BarChart3 className="h-6 w-6" style={{ color: V.chart2 }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black tracking-tight" style={{ color: V.cardFg }}>
                Analytics Dashboard
              </h1>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: `color-mix(in oklch, ${V.chart2} 15%, transparent)`,
                  color: V.chart2,
                  border: `1px solid color-mix(in oklch, ${V.chart2} 30%, transparent)`,
                }}
              >
                LIVE
              </span>
            </div>
            <p className="text-sm" style={{ color: V.mutedFg }}>
              Real-time insights from your scan history — powered by Supabase.
            </p>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map(({ icon: Icon, label, value, color, sub, trend }) => (
          <div
            key={label}
            className="rounded-2xl p-5 space-y-3 transition-all hover:scale-[1.02]"
            style={{ background: V.card, border: `1px solid ${V.border}` }}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: `color-mix(in oklch, ${color} 15%, transparent)`,
                border: `1px solid color-mix(in oklch, ${color} 30%, transparent)`,
              }}
            >
              <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div>
              <p className="text-3xl font-black" style={{ color: V.cardFg }}>{value}</p>
              <p className="text-xs mt-0.5 font-semibold" style={{ color: V.mutedFg }}>{label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: V.mutedFg }}>{sub}</p>
            </div>
            <p className="text-[11px] font-medium" style={{ color }}>{trend}</p>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid lg:grid-cols-2 gap-4">

        {/* Weekly Activity bar chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: V.card, border: `1px solid ${V.border}` }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-bold" style={{ color: V.cardFg }}>Weekly Activity</p>
              <p className="text-xs" style={{ color: V.mutedFg }}>Scans per day (last 7 days)</p>
            </div>
            <Activity className="h-4 w-4" style={{ color: V.mutedFg }} />
          </div>
          <div className="flex items-end gap-2 h-32">
            {weeklyData.map(({ label, count }) => {
              const pct = (count / maxWeekly) * 100;
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                    <div
                      className="w-full rounded-t-lg transition-all duration-700"
                      style={{
                        height: `${Math.max(pct, 4)}%`,
                        background: count > 0
                          ? `color-mix(in oklch, ${V.primary} 80%, transparent)`
                          : `color-mix(in oklch, ${V.primary} 20%, transparent)`,
                        minHeight: "4px",
                      }}
                    />
                  </div>
                  <p className="text-[10px]" style={{ color: V.mutedFg }}>{label}</p>
                  {count > 0 && (
                    <p className="text-[9px] font-bold" style={{ color: V.primary }}>{count}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Scan type distribution */}
        <div
          className="rounded-2xl p-5"
          style={{ background: V.card, border: `1px solid ${V.border}` }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-bold" style={{ color: V.cardFg }}>Scan Distribution</p>
              <p className="text-xs" style={{ color: V.mutedFg }}>Breakdown by scan type</p>
            </div>
            <Target className="h-4 w-4" style={{ color: V.mutedFg }} />
          </div>
          {totalScans === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <Shield className="h-8 w-8" style={{ color: V.mutedFg }} />
              <p className="text-xs" style={{ color: V.mutedFg }}>No scans yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scanTypeBreakdown.map(({ type, label, count, Icon }) => {
                const color = SCAN_COLORS[type];
                const pct = totalScans > 0 ? Math.round((count / totalScans) * 100) : 0;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" style={{ color }} />
                        <span className="text-xs font-semibold" style={{ color: V.cardFg }}>{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color }}>{count}</span>
                        <span className="text-[10px]" style={{ color: V.mutedFg }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: V.muted }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(count / maxScanCount) * 100}%`,
                          background: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Monthly + Threat Row ── */}
      <div className="grid lg:grid-cols-3 gap-4">

        {/* Monthly usage */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: V.card, border: `1px solid ${V.border}` }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-bold" style={{ color: V.cardFg }}>Monthly Summary</p>
              <p className="text-xs" style={{ color: V.mutedFg }}>Scans by week (last 4 weeks)</p>
            </div>
            <Clock className="h-4 w-4" style={{ color: V.mutedFg }} />
          </div>
          <div className="flex items-end gap-3 h-32">
            {monthlyData.map(({ label, count }) => {
              const pct = (count / maxMonthly) * 100;
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                    <div
                      className="w-full rounded-t-xl transition-all duration-700"
                      style={{
                        height: `${Math.max(pct, 4)}%`,
                        background: count > 0
                          ? `color-mix(in oklch, ${V.chart2} 80%, transparent)`
                          : `color-mix(in oklch, ${V.chart2} 15%, transparent)`,
                        minHeight: "4px",
                      }}
                    />
                  </div>
                  <p className="text-[10px]" style={{ color: V.mutedFg }}>{label}</p>
                  {count > 0 && (
                    <p className="text-[9px] font-bold" style={{ color: V.chart2 }}>{count}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Threat gauge + Credit usage */}
        <div className="space-y-4">
          {/* Threat Gauge */}
          <div
            className="rounded-2xl p-5"
            style={{ background: V.card, border: `1px solid ${V.border}` }}
          >
            <p className="text-sm font-bold mb-1" style={{ color: V.cardFg }}>Threat Rate</p>
            <p className="text-xs mb-4" style={{ color: V.mutedFg }}>% of scans flagged as threats</p>
            <div className="flex items-center justify-center">
              <div
                className="relative flex h-24 w-24 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(${V.destructive} 0% ${threatRate}%, ${V.muted} ${threatRate}% 100%)`,
                  padding: "3px",
                }}
              >
                <div
                  className="flex h-full w-full flex-col items-center justify-center rounded-full"
                  style={{ background: V.card }}
                >
                  <span className="text-xl font-black" style={{ color: V.destructive }}>{threatRate}</span>
                  <span className="text-[9px] font-semibold" style={{ color: V.mutedFg }}>%</span>
                </div>
              </div>
            </div>
            <p className="text-center text-xs mt-3" style={{ color: V.mutedFg }}>
              {totalScans === 0
                ? "No data yet"
                : threatRate === 0
                ? "✓ No threats detected"
                : `${threatsDetected} of ${totalScans} flagged`}
            </p>
          </div>

          {/* Credit usage card */}
          <div
            className="rounded-2xl p-5"
            style={{ background: V.card, border: `1px solid ${V.border}` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Crown className="h-3.5 w-3.5" style={{ color: V.chart1 }} />
              <p className="text-sm font-bold" style={{ color: V.cardFg }}>Credit Usage</p>
            </div>
            <p className="text-2xl font-black mb-0.5" style={{ color: V.cardFg }}>
              {creditsUsed}
            </p>
            <p className="text-xs mb-3" style={{ color: V.mutedFg }}>
              of {planMax === 999999 ? "∞" : planMax} credits used
            </p>
            {planMax !== 999999 && (
              <div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: V.muted }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${creditPct}%`,
                      background: creditPct > 80 ? V.destructive : creditPct > 50 ? V.chart1 : V.primary,
                    }}
                  />
                </div>
                <p className="text-[10px] mt-1" style={{ color: V.mutedFg }}>{creditPct}% used</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Recent High-Risk Scans ── */}
      {recentScans.filter((s) => s.is_threat).length > 0 && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: V.card, border: `1px solid ${V.border}` }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${V.border}` }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" style={{ color: V.destructive }} />
              <p className="text-sm font-semibold" style={{ color: V.cardFg }}>Threats Detected</p>
            </div>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{
                background: `color-mix(in oklch, ${V.destructive} 15%, transparent)`,
                color: V.destructive,
              }}
            >
              {recentScans.filter((s) => s.is_threat).length} found
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: V.border }}>
            {recentScans.filter((s) => s.is_threat).slice(0, 5).map((scan) => {
              const Icon = scan.scan_type === "voice" ? Mic : scan.scan_type === "message" ? MessageSquare : Phone;
              const color = SCAN_COLORS[scan.scan_type];
              return (
                <div key={scan.id} className="flex items-center gap-4 px-5 py-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: `color-mix(in oklch, ${color} 12%, transparent)`,
                      border: `1px solid color-mix(in oklch, ${color} 30%, transparent)`,
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: V.cardFg }}>
                      {SCAN_TYPE_LABELS[scan.scan_type]}
                    </p>
                    <p className="text-xs truncate" style={{ color: V.mutedFg }}>
                      {scan.input_summary ?? "—"}
                    </p>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      background: `color-mix(in oklch, ${V.destructive} 12%, transparent)`,
                      color: V.destructive,
                      border: `1px solid color-mix(in oklch, ${V.destructive} 30%, transparent)`,
                    }}
                  >
                    {scan.risk_level}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state for no scans */}
      {totalScans === 0 && (
        <div
          className="rounded-2xl p-10 flex flex-col items-center gap-4"
          style={{ background: V.card, border: `1px solid ${V.border}` }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: V.muted }}
          >
            <TrendingUp className="h-8 w-8" style={{ color: V.mutedFg }} />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold" style={{ color: V.cardFg }}>No analytics yet</p>
            <p className="text-xs mt-1" style={{ color: V.mutedFg }}>
              Run scans using Voice, SMS, or Call analyzers to populate your analytics.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
