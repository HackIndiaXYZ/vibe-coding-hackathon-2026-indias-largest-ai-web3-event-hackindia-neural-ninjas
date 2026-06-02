"use client";

/**
 * components/features/shared/result-card.tsx
 *
 * Shared ResultCard — renders any scan result with risk level badge,
 * score ring, threats list, and recommendations.
 * Uses ONLY CSS vars from globals.css — no new design system.
 */

import { Shield, AlertTriangle, CheckCircle, XCircle, ChevronRight } from "lucide-react";

// ── CSS var helpers (mirrors dashboard-shell.tsx) ─────────────────────────
const V = {
  card:         "var(--card)",
  border:       "var(--border)",
  primary:      "var(--primary)",
  primaryFg:    "var(--primary-foreground)",
  muted:        "var(--muted)",
  mutedFg:      "var(--muted-foreground)",
  fg:           "var(--foreground)",
  cardFg:       "var(--card-foreground)",
  chart1:       "var(--chart-1)",
  chart2:       "var(--chart-2)",
  chart4:       "var(--chart-4)",
  destructive:  "var(--destructive)",
  input:        "var(--input)",
};

function riskColor(level: "Low" | "Medium" | "High"): string {
  if (level === "High")   return V.destructive;
  if (level === "Medium") return V.chart1;
  return V.chart2;
}

// ── Props ─────────────────────────────────────────────────────────────────
interface ResultCardProps {
  /** 0–100, displayed in the ring */
  score: number;
  /** Label below the score */
  scoreLabel: string;
  riskLevel: "Low" | "Medium" | "High";
  verdict: string;
  explanation: string;
  threats?: string[];
  recommendations?: string[];
  /** Extra info rows e.g. { label: "Confidence", value: "82%" } */
  metaRows?: { label: string; value: string }[];
}

export function ResultCard({
  score,
  scoreLabel,
  riskLevel,
  verdict,
  explanation,
  threats = [],
  recommendations = [],
  metaRows = [],
}: ResultCardProps) {
  const rc = riskColor(riskLevel);
  const isHigh = riskLevel === "High";

  const RiskIcon = isHigh ? XCircle : riskLevel === "Medium" ? AlertTriangle : CheckCircle;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: `1px solid ${rc}55`,
        background: `color-mix(in oklch, ${rc} 6%, var(--card))`,
      }}
    >
      {/* Header band */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: `1px solid ${rc}33` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: `color-mix(in oklch, ${rc} 15%, transparent)`,
              border: `1px solid ${rc}44`,
            }}
          >
            <RiskIcon className="h-5 w-5" style={{ color: rc }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "var(--card-foreground)" }}>
              {verdict}
            </p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              Scan Complete
            </p>
          </div>
        </div>

        {/* Risk badge */}
        <span
          className="text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide"
          style={{
            background: `color-mix(in oklch, ${rc} 15%, transparent)`,
            color: rc,
            border: `1px solid ${rc}44`,
          }}
        >
          {riskLevel} Risk
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5">
        {/* Score ring + meta */}
        <div className="flex items-center gap-5">
          {/* Ring */}
          <div
            className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(${rc} 0% ${score}%, var(--muted) ${score}% 100%)`,
              padding: "3px",
            }}
          >
            <div
              className="flex h-full w-full flex-col items-center justify-center rounded-full"
              style={{ background: "var(--card)" }}
            >
              <span className="text-lg font-black" style={{ color: rc }}>{score}</span>
              <span className="text-[8px] font-semibold" style={{ color: "var(--muted-foreground)" }}>
                {scoreLabel}
              </span>
            </div>
          </div>

          {/* Meta rows */}
          <div className="flex-1 space-y-1.5">
            {metaRows.map(({ label, value }) => (
              <div key={label} className="flex justify-between text-xs">
                <span style={{ color: "var(--muted-foreground)" }}>{label}</span>
                <span className="font-semibold" style={{ color: "var(--card-foreground)" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          {explanation}
        </p>

        {/* Threats */}
        {threats.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>
              Detected Threats
            </p>
            <ul className="space-y-1.5">
              {threats.map((t, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl"
                  style={{
                    background: `color-mix(in oklch, ${rc} 8%, var(--muted))`,
                    color: "var(--card-foreground)",
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: rc }}
                  />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>
              Recommendations
            </p>
            <ul className="space-y-1.5">
              {recommendations.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: V.primary }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Small loading skeleton ──────────────────────────────────────────────────
export function ResultCardSkeleton() {
  return (
    <div
      className="rounded-2xl p-5 space-y-4 animate-pulse"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl" style={{ background: "var(--muted)" }} />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-32 rounded-full" style={{ background: "var(--muted)" }} />
          <div className="h-2 w-20 rounded-full" style={{ background: "var(--muted)" }} />
        </div>
      </div>
      <div className="h-20 rounded-xl" style={{ background: "var(--muted)" }} />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-8 rounded-xl" style={{ background: "var(--muted)" }} />
        ))}
      </div>
    </div>
  );
}
