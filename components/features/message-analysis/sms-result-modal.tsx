"use client";

/**
 * components/features/message-analysis/sms-result-modal.tsx
 *
 * Premium security-dashboard modal for SMS analysis results.
 * Dashboard layout: sticky header → 3-col grid body → sticky footer.
 * No new colors — only existing CSS vars from globals.css.
 */

import { useEffect, useState } from "react";
import {
  X, Shield, AlertTriangle, CheckCircle, XCircle,
  Zap, ScanLine, Link2, UserX, Clock3,
  Ban, Phone, FileWarning, ShieldAlert, ChevronRight,
  Activity, Info,
} from "lucide-react";
import type { MessageAnalysisResult } from "@/lib/features/message-analysis/message-analysis.types";

/* ─────────────────────────────────────────────────────────── */
/* Color helpers (no new colors)                               */
/* ─────────────────────────────────────────────────────────── */

function rc(level: "Low" | "Medium" | "High") {
  if (level === "High")   return "var(--destructive)";
  if (level === "Medium") return "var(--chart-1)";
  return "var(--chart-2)";
}

/* ─────────────────────────────────────────────────────────── */
/* Loading steps                                              */
/* ─────────────────────────────────────────────────────────── */

const LOADING_STEPS = [
  { icon: ScanLine, text: "Scanning message content…"       },
  { icon: Link2,    text: "Inspecting embedded URLs…"       },
  { icon: UserX,    text: "Checking impersonation signals…" },
  { icon: Clock3,   text: "Evaluating urgency tactics…"     },
];

/* ─────────────────────────────────────────────────────────── */
/* Helpers                                                    */
/* ─────────────────────────────────────────────────────────── */

/** Icon to use for each recommendation based on text content */
function recIcon(text: string) {
  const t = text.toLowerCase();
  if (t.includes("link") || t.includes("url") || t.includes("click")) return Ban;
  if (t.includes("call") || t.includes("contact") || t.includes("verify")) return Phone;
  if (t.includes("report") || t.includes("block")) return FileWarning;
  if (t.includes("otp") || t.includes("password") || t.includes("share")) return ShieldAlert;
  return ChevronRight;
}

/** Split explanation paragraph into 3–4 concise insight strings */
function toInsights(explanation: string): string[] {
  return explanation
    .split(/\.\s+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter((s) => s.length > 20)
    .slice(0, 4);
}

/* ─────────────────────────────────────────────────────────── */
/* Props                                                      */
/* ─────────────────────────────────────────────────────────── */

interface SmsResultModalProps {
  open: boolean;
  loading: boolean;
  result: MessageAnalysisResult | null;
  error: string | null;
  creditsRemaining: number | null;
  creditsUsed: number;
  onClose: () => void;
  onAnalyzeAnother: () => void;
}

/* ─────────────────────────────────────────────────────────── */
/* Component                                                  */
/* ─────────────────────────────────────────────────────────── */

export function SmsResultModal({
  open, loading, result, error,
  creditsRemaining, creditsUsed,
  onClose, onAnalyzeAnother,
}: SmsResultModalProps) {

  /* Loading step animation */
  const [stepIdx, setStepIdx] = useState(0);
  useEffect(() => {
    if (!loading) { setStepIdx(0); return; }
    const id = setInterval(() => setStepIdx((i) => (i + 1) % LOADING_STEPS.length), 900);
    return () => clearInterval(id);
  }, [loading]);

  /* Progress bar animation */
  const [barW, setBarW] = useState(0);
  useEffect(() => {
    if (!loading) { setBarW(0); return; }
    const t = setTimeout(() => setBarW(85), 120);
    return () => clearTimeout(t);
  }, [loading]);

  if (!open) return null;

  const riskColor   = result ? rc(result.riskLevel) : "var(--primary)";
  const RiskIcon    = result
    ? result.riskLevel === "High" ? XCircle
    : result.riskLevel === "Medium" ? AlertTriangle
    : CheckCircle
    : Shield;

  const verdict = result
    ? result.riskLevel === "High"   ? "🚨 Likely Scam"
    : result.riskLevel === "Medium" ? "⚠️ Potential Scam"
    : "✅ Appears Safe"
    : "";

  const insights = result ? toInsights(result.explanation) : [];

  /* ── Render ── */
  return (
    /* Backdrop — overflow-hidden kills white gap */
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center"
      style={{ background: "color-mix(in oklch, var(--foreground) 45%, transparent)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/*
       * Modal shell:
       * • Mobile: full-width sheet from bottom
       * • Desktop: wide centered dialog up to ~1100px
       * • flex-col so header+footer are sticky, body scrolls if needed
       */}
      <div
        className="relative w-full sm:max-w-5xl sm:mx-4 flex flex-col"
        style={{
          background:    "var(--card)",
          border:        "1px solid var(--border)",
          borderRadius:  "1.5rem 1.5rem 0 0",
          maxHeight:     "88dvh",
          boxShadow:     "0 -4px 40px -4px hsl(0 0% 0% / 0.18), 0 32px 64px -8px hsl(0 0% 0% / 0.28)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="SMS Analysis Result"
      >

        {/* ═══════════ LOADING STATE ═══════════ */}
        {loading && (
          <div className="flex flex-col items-center justify-center gap-6 py-20 px-8">
            <div className="relative flex items-center justify-center">
              <span className="absolute h-20 w-20 rounded-full animate-ping opacity-20" style={{ background: "var(--primary)" }} />
              <div
                className="relative flex h-16 w-16 items-center justify-center rounded-full"
                style={{
                  background: "color-mix(in oklch, var(--primary) 15%, transparent)",
                  border:     "2px solid color-mix(in oklch, var(--primary) 40%, transparent)",
                }}
              >
                <Shield className="h-8 w-8 animate-pulse" style={{ color: "var(--primary)" }} />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-bold text-card-foreground">Analyzing Message…</p>
              <p className="text-sm text-muted-foreground">Our AI is scanning for fraud indicators</p>
            </div>
            <div
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium w-full max-w-sm justify-center"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              {(() => { const Icon = LOADING_STEPS[stepIdx].icon; return <Icon className="h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />; })()}
              <span key={stepIdx}>{LOADING_STEPS[stepIdx].text}</span>
            </div>
            <div className="w-full max-w-sm">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                <div className="h-full rounded-full transition-all duration-[2s] ease-out" style={{ width: `${barW}%`, background: "var(--primary)" }} />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ ERROR STATE ═══════════ */}
        {!loading && error && (
          <div className="p-10 flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: "color-mix(in oklch, var(--destructive) 12%, var(--muted))", border: "1px solid color-mix(in oklch, var(--destructive) 30%, var(--border))" }}>
              <XCircle className="h-7 w-7" style={{ color: "var(--destructive)" }} />
            </div>
            <div>
              <p className="font-semibold text-card-foreground">Analysis Failed</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors">Close</button>
              <button onClick={onAnalyzeAnother} className="px-5 py-2.5 rounded-xl text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity" style={{ background: "var(--primary)" }}>Try Again</button>
            </div>
          </div>
        )}

        {/* ═══════════ RESULT STATE ═══════════ */}
        {!loading && !error && result && (
          <>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-card-foreground transition-colors"
              style={{ background: "color-mix(in oklch, var(--muted-foreground) 10%, transparent)" }}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* ── STICKY HEADER ── */}
            <div
              className="shrink-0 px-6 pt-6 pb-5"
              style={{
                background:    `color-mix(in oklch, ${riskColor} 8%, var(--card))`,
                borderBottom:  `1px solid color-mix(in oklch, ${riskColor} 25%, var(--border))`,
                borderRadius:  "1.5rem 1.5rem 0 0",
              }}
            >
              <div className="flex items-center gap-4 pr-10">
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background: `color-mix(in oklch, ${riskColor} 15%, transparent)`,
                    border:     `1px solid color-mix(in oklch, ${riskColor} 35%, transparent)`,
                  }}>
                  <RiskIcon className="h-6 w-6" style={{ color: riskColor }} />
                </div>

                {/* Verdict */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <p className="text-2xl font-black text-card-foreground leading-tight">{verdict}</p>
                    <span
                      className="text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wide"
                      style={{
                        background: `color-mix(in oklch, ${riskColor} 15%, transparent)`,
                        color:       riskColor,
                        border:      `1px solid color-mix(in oklch, ${riskColor} 40%, transparent)`,
                      }}
                    >
                      {result.riskLevel} Risk
                    </span>
                  </div>
                  <p className="text-sm mt-0.5 font-semibold" style={{ color: riskColor }}>
                    {result.scamProbability}% Scam Probability
                  </p>
                </div>

                {/* Credits pill */}
                {creditsRemaining !== null && (
                  <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0"
                    style={{
                      background: "color-mix(in oklch, var(--chart-1) 8%, var(--muted))",
                      border:     "1px solid color-mix(in oklch, var(--chart-1) 20%, var(--border))",
                      color:      "var(--chart-1)",
                    }}>
                    <Zap className="h-3 w-3" />
                    {creditsUsed} cr used · {creditsRemaining} left
                  </div>
                )}
              </div>

              {/* Score bar */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-medium">Risk Score</span>
                  <span className="font-bold" style={{ color: riskColor }}>{result.scamProbability} / 100</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${result.scamProbability}%`, background: riskColor }} />
                </div>
              </div>
            </div>

            {/*
             * ── SCROLLABLE BODY (3-col grid on desktop) ──
             * col 1 (1fr):  Risk stats panel
             * col 2–3 (2fr): Findings + Insights + Recommendations
             */}
            <div
              className="flex-1 overflow-y-auto p-5"
              style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">

                {/* ── LEFT COLUMN: Risk Stats ── */}
                <div className="sm:col-span-1 flex flex-col gap-4">

                  {/* Big score card */}
                  <div
                    className="rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2"
                    style={{
                      background: `color-mix(in oklch, ${riskColor} 8%, var(--muted))`,
                      border:     `1px solid color-mix(in oklch, ${riskColor} 20%, var(--border))`,
                    }}
                  >
                    {/* Circular score */}
                    <div
                      className="relative flex h-24 w-24 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(${riskColor} 0% ${result.scamProbability}%, var(--muted) ${result.scamProbability}% 100%)`,
                        padding: "3px",
                      }}
                    >
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-full" style={{ background: "var(--card)" }}>
                        <span className="text-2xl font-black" style={{ color: riskColor }}>{result.scamProbability}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">/ 100</span>
                      </div>
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest" style={{ color: riskColor }}>
                      {result.riskLevel} Risk
                    </p>
                    <p className="text-xs text-muted-foreground">Scam Probability Score</p>
                  </div>

                  {/* Stat pills */}
                  <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
                    {[
                      { label: "Threat Level",  value: result.riskLevel,             color: riskColor         },
                      { label: "Threats Found", value: `${result.threats.length}`,   color: "var(--card-foreground)" },
                      { label: "Actions",       value: `${result.recommendations.length}`, color: "var(--primary)"  },
                    ].map(({ label, value, color }, i, arr) => (
                      <div
                        key={label}
                        className="flex items-center justify-between px-4 py-3 text-sm"
                        style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : undefined }}
                      >
                        <span className="text-muted-foreground text-xs font-medium">{label}</span>
                        <span className="font-bold text-xs" style={{ color }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mobile credits */}
                  {creditsRemaining !== null && (
                    <div className="sm:hidden flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold"
                      style={{
                        background: "color-mix(in oklch, var(--chart-1) 8%, var(--muted))",
                        border:     "1px solid color-mix(in oklch, var(--chart-1) 20%, var(--border))",
                        color:      "var(--chart-1)",
                      }}>
                      <Zap className="h-3 w-3 shrink-0" />
                      {creditsUsed} credits used · {creditsRemaining} remaining
                    </div>
                  )}
                </div>

                {/* ── RIGHT SECTION (col-span-2) ── */}
                <div className="sm:col-span-2 flex flex-col gap-4">

                  {/* Key Findings — 2-col grid */}
                  {result.threats.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <Activity className="h-3.5 w-3.5" style={{ color: riskColor }} />
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Key Findings</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {result.threats.map((t, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                            style={{
                              background: `color-mix(in oklch, ${riskColor} 7%, var(--muted))`,
                              border:     `1px solid color-mix(in oklch, ${riskColor} 18%, var(--border))`,
                            }}
                          >
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: riskColor }} />
                            <span className="text-xs font-medium text-card-foreground leading-snug">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Insights — sentence cards in 2-col grid */}
                  {insights.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">AI Insights</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {insights.map((insight, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
                            style={{ background: "var(--muted)", border: "1px solid var(--border)" }}
                          >
                            <span className="mt-0.5 text-[10px] font-black text-muted-foreground shrink-0 w-4">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className="text-xs text-card-foreground leading-snug">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations — 2-col grid */}
                  {result.recommendations.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2.5">
                        <Shield className="h-3.5 w-3.5" style={{ color: "var(--primary)" }} />
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recommended Actions</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {result.recommendations.map((r, i) => {
                          const RecIcon = recIcon(r);
                          return (
                            <div
                              key={i}
                              className="flex items-start gap-2.5 px-3 py-3 rounded-xl"
                              style={{
                                background: "color-mix(in oklch, var(--primary) 5%, var(--card))",
                                border:     "1px solid color-mix(in oklch, var(--primary) 18%, var(--border))",
                              }}
                            >
                              <div
                                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md mt-0.5"
                                style={{
                                  background: "color-mix(in oklch, var(--primary) 12%, transparent)",
                                  border:     "1px solid color-mix(in oklch, var(--primary) 25%, transparent)",
                                }}
                              >
                                <RecIcon className="h-3 w-3" style={{ color: "var(--primary)" }} />
                              </div>
                              <p className="text-xs text-card-foreground leading-snug">{r}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── STICKY FOOTER ── */}
            <div
              className="shrink-0 flex flex-col sm:flex-row gap-2.5 px-5 py-4"
              style={{ borderTop: "1px solid var(--border)", background: "var(--card)" }}
            >
              <button
                onClick={onAnalyzeAnother}
                className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted hover:text-card-foreground transition-all duration-150"
              >
                Analyze Another Message
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-5 py-2.5 rounded-xl text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity duration-150"
                style={{ background: "var(--primary)" }}
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
