"use client";

/**
 * components/dashboard/dashboard-overview.tsx
 *
 * Clean, minimal /dashboard overview.
 * — Greeting + subtitle
 * — 2 Quick Scan action cards (SMS Analyzer, Call Analyzer)
 * — 1 Credits overview card
 * — Recent scans table (or empty state)
 */

import Link from "next/link";
import { useState } from "react";
import {
  MessageSquare, Phone, Mic, Zap, Crown, Building2,
  ArrowRight, Shield, AlertTriangle, CheckCircle, Clock, History,
} from "lucide-react";
import { UpgradeModal } from "./upgrade-modal";
import type { Plan } from "@/lib/db/types";
import type { ScanAnalytics } from "@/lib/db/scans.service";
import type { Scan } from "@/lib/db/types";
import { SCAN_TYPE_LABELS } from "@/lib/db/types";

interface DashboardOverviewProps {
  credits:      number;
  plan:         Plan;
  analytics:    ScanAnalytics;
  recentScans?: Scan[];
}

/* ── constants ───────────────────────────────────────────────── */
const PLAN_ICONS: Record<Plan, React.ElementType> = {
  free:       Zap,
  pro:        Crown,
  enterprise: Building2,
};

const PLAN_LABELS: Record<Plan, string> = {
  free:       "Free Plan",
  pro:        "Pro Plan",
  enterprise: "Enterprise",
};

const PLAN_MAX: Record<Plan, number> = {
  free:       100,
  pro:        1000,
  enterprise: 999999,
};

const SCAN_CARDS = [
  {
    icon:        MessageSquare,
    title:       "SMS Analyzer",
    description: "Paste a suspicious message for instant phishing analysis.",
    credits:     2,
    href:        "/dashboard/sms",
    color:       "var(--chart-2)",
  },
  {
    icon:        Phone,
    title:       "Call Analyzer",
    description: "Upload a call recording to detect fraud and scams.",
    credits:     10,
    href:        "/dashboard/call",
    color:       "var(--chart-1)",
  },
];

const SCAN_COLOR: Record<string, string> = {
  voice:   "var(--primary)",
  message: "var(--chart-2)",
  call:    "var(--chart-1)",
};

const RISK_COLOR: Record<string, string> = {
  High:   "var(--destructive)",
  Medium: "var(--chart-1)",
  Low:    "var(--chart-2)",
};

/* ── helpers ─────────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

/* ── component ───────────────────────────────────────────────── */
export function DashboardOverview({
  credits, plan, analytics, recentScans = [],
}: DashboardOverviewProps) {
  const [localCredits, setLocalCredits] = useState(credits);
  const [localPlan,    setLocalPlan]    = useState<Plan>(plan);
  const [showUpgrade,  setShowUpgrade]  = useState(false);

  const planMax  = PLAN_MAX[localPlan];
  const pct      = planMax === 999999 ? 100 : Math.min(100, Math.round((localCredits / planMax) * 100));
  const PlanIcon = PLAN_ICONS[localPlan];

  const hasScans = recentScans.length > 0;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8 space-y-10">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-card-foreground">
          {getGreeting()} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Stay protected from scams and fraud.
        </p>
      </div>

      {/* ── Quick Scan ─────────────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Quick Scan
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {SCAN_CARDS.map(({ icon: Icon, title, description, credits: cost, href, color }) => (
            <Link key={href} href={href} className="group block">
              <div className="flex flex-col h-full rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200">
                {/* Icon */}
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg mb-4 transition-transform duration-200 group-hover:scale-110"
                  style={{
                    background: `color-mix(in oklch, ${color} 12%, transparent)`,
                    border:     `1px solid color-mix(in oklch, ${color} 25%, transparent)`,
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>

                {/* Text */}
                <p className="text-sm font-semibold text-card-foreground mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">{description}</p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {cost} credits / scan
                  </span>
                  <span
                    className="flex items-center gap-1 text-xs font-semibold transition-transform duration-200 group-hover:translate-x-0.5"
                    style={{ color }}
                  >
                    Start <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Credits Overview ───────────────────────────────────── */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Credits & Plan
        </h2>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            {/* Left — numbers */}
            <div>
              <p className="text-3xl font-bold text-card-foreground tabular-nums">
                {localCredits === 999999 ? "∞" : localCredits.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">Credits remaining</p>
            </div>

            {/* Right — plan + upgrade */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <PlanIcon className="h-4 w-4" />
                {PLAN_LABELS[localPlan]}
              </div>
              <button
                onClick={() => setShowUpgrade(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity duration-150"
              >
                <Crown className="h-3.5 w-3.5" />
                Upgrade
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {localCredits !== 999999 && (
            <div className="mt-5 space-y-1.5">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: pct < 20
                      ? "var(--destructive)"
                      : pct < 50
                      ? "var(--chart-1)"
                      : "var(--primary)",
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>{analytics.creditsUsed} used</span>
                <span>{planMax === 999999 ? "Unlimited" : `${planMax.toLocaleString()} total`}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Recent Scans ───────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Recent Scans
          </h2>
          {hasScans && (
            <Link
              href="/dashboard/history"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {/* Empty state */}
        {!hasScans ? (
          <div className="rounded-xl border border-dashed border-border bg-card flex flex-col items-center justify-center py-16 gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Shield className="h-7 w-7 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-card-foreground">No scans yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Run your first security scan above to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid px-5 py-3 border-b border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
              style={{ gridTemplateColumns: "1fr 1fr auto auto auto" }}
            >
              <span>Type</span>
              <span>Summary</span>
              <span>Result</span>
              <span>Credits</span>
              <span>Date</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
              {recentScans.slice(0, 5).map((scan) => {
                const scanColor = SCAN_COLOR[scan.scan_type] ?? "var(--muted-foreground)";
                const riskColor = scan.risk_level ? RISK_COLOR[scan.risk_level] : "var(--muted-foreground)";
                const RiskIcon  = scan.is_threat ? AlertTriangle : CheckCircle;

                return (
                  <div
                    key={scan.id}
                    className="flex flex-col sm:grid px-5 py-4 gap-3 sm:gap-0 sm:items-center hover:bg-muted/40 transition-colors duration-150"
                    style={{ gridTemplateColumns: "1fr 1fr auto auto auto" }}
                  >
                    {/* Type */}
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                        style={{
                          background: `color-mix(in oklch, ${scanColor} 10%, transparent)`,
                          border:     `1px solid color-mix(in oklch, ${scanColor} 25%, transparent)`,
                        }}
                      >
                        {scan.scan_type === "message"
                          ? <MessageSquare className="h-4 w-4" style={{ color: scanColor }} />
                          : scan.scan_type === "call"
                          ? <Phone className="h-4 w-4" style={{ color: scanColor }} />
                          : scan.scan_type === "voice"
                          ? <Mic className="h-4 w-4" style={{ color: scanColor }} />
                          : <Video className="h-4 w-4" style={{ color: scanColor }} />}
                      </div>
                      <span className="text-sm font-medium text-card-foreground">
                        {SCAN_TYPE_LABELS[scan.scan_type]}
                      </span>
                    </div>

                    {/* Summary */}
                    <p
                      className="text-xs text-muted-foreground truncate max-w-[180px]"
                      title={scan.input_summary ?? "—"}
                    >
                      {scan.input_summary ?? "—"}
                    </p>

                    {/* Result */}
                    <div className="flex items-center gap-1.5">
                      <RiskIcon className="h-3.5 w-3.5 shrink-0" style={{ color: riskColor }} />
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: `color-mix(in oklch, ${riskColor} 10%, transparent)`,
                          color:      riskColor,
                          border:     `1px solid color-mix(in oklch, ${riskColor} 25%, transparent)`,
                        }}
                      >
                        {scan.risk_level ?? "N/A"}
                      </span>
                    </div>

                    {/* Credits */}
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-primary" />
                      <span className="text-xs font-medium text-muted-foreground">{scan.credits_used}</span>
                    </div>

                    {/* Date */}
                    <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" />
                      {formatDate(scan.created_at)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer link */}
            <div className="px-5 py-3 border-t border-border">
              <Link
                href="/dashboard/history"
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors duration-150"
              >
                <History className="h-3.5 w-3.5" />
                View full history ({analytics.totalScans} total scans)
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <UpgradeModal
          currentPlan={localPlan}
          currentCredits={localCredits}
          onClose={() => setShowUpgrade(false)}
          onSuccess={(newPlan, newCredits) => {
            setLocalPlan(newPlan);
            setLocalCredits(newCredits);
            setShowUpgrade(false);
          }}
        />
      )}
    </div>
  );
}
