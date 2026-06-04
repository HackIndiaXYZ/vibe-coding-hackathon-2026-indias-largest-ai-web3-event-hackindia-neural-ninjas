"use client";

/**
 * components/features/call-analysis/call-result-modal.tsx
 *
 * Premium security-dashboard modal for Call analysis results.
 * Same layout as SmsResultModal: sticky header → 3-col grid body → sticky footer.
 * Extra: collapsible transcript section inside the scrollable body.
 * Zero new colors — only existing CSS vars from globals.css.
 */

import { useEffect, useState } from "react";
import {
  X, Shield, AlertTriangle, CheckCircle, XCircle,
  Zap, Mic, FileAudio, UserX, Clock3,
  Ban, Phone, FileWarning, ShieldAlert, ChevronRight,
  Activity, Info, ChevronDown, ChevronUp,
} from "lucide-react";
import type { CallAnalysisResult } from "@/lib/features/call-analysis/call-analysis.types";

/* ─────────────────────────────────────────────────────────── */
/* Helpers                                                     */
/* ─────────────────────────────────────────────────────────── */

function rc(level: "Low" | "Medium" | "High") {
  if (level === "High")   return "var(--destructive)";
  if (level === "Medium") return "var(--chart-1)";
  return "var(--chart-2)";
}

/* Loading steps specific to call analysis */
const LOADING_STEPS = [
  { icon: FileAudio, text: "Uploading audio file…"              },
  { icon: Mic,       text: "Transcribing with Whisper…"         },
  { icon: UserX,     text: "Detecting impersonation signals…"   },
  { icon: Clock3,    text: "Evaluating fraud patterns…"         },
];

function recIcon(text: string) {
  const t = text.toLowerCase();
  if (t.includes("link") || t.includes("url") || t.includes("click")) return Ban;
  if (t.includes("call") || t.includes("contact") || t.includes("verify")) return Phone;
  if (t.includes("report") || t.includes("block")) return FileWarning;
  if (t.includes("otp") || t.includes("password") || t.includes("share")) return ShieldAlert;
  return ChevronRight;
}

function toInsights(explanation: string): string[] {
  return explanation
    .split(/\.\s+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter((s) => s.length > 20)
    .slice(0, 4);
}

/* ─────────────────────────────────────────────────────────── */
/* Props                                                       */
/* ─────────────────────────────────────────────────────────── */

interface CallResultModalProps {
  open: boolean;
  /** True while the API call + transcription is in-flight */
  loading: boolean;
  /** Friendly label of the current loading phase */
  phaseLabel: string;
  /** 0-100 upload/processing progress */
  progress: number;
  result: CallAnalysisResult | null;
  error: string | null;
  creditsRemaining: number | null;
  creditsUsed: number;
  onClose: () => void;
  onAnalyzeAnother: () => void;
}

/* ─────────────────────────────────────────────────────────── */
/* Component                                                   */
/* ─────────────────────────────────────────────────────────── */

export function CallResultModal({
  open, loading, phaseLabel, progress, result, error,
  creditsRemaining, creditsUsed,
  onClose, onAnalyzeAnother,
}: CallResultModalProps) {
  const [stepIdx, setStepIdx] = useState(0);
  useEffect(() => {
    if (!loading) { setStepIdx(0); return; }
    const id = setInterval(() => setStepIdx((i) => (i + 1) % LOADING_STEPS.length), 1200);
    return () => clearInterval(id);
  }, [loading]);

  const [transcriptOpen, setTranscriptOpen] = useState(false);

  if (!open) return null;

  const riskColor = result ? rc(result.riskLevel) : "var(--primary)";
  const RiskIcon  = result
    ? result.riskLevel === "High"   ? XCircle
    : result.riskLevel === "Medium" ? AlertTriangle
    : CheckCircle
    : Shield;

  const verdict = result
    ? result.riskLevel === "High"   ? "🚨 Fraudulent Call"
    : result.riskLevel === "Medium" ? "⚠️ Suspicious Call"
    : "✅ Call Appears Safe"
    : "";

  const insights = result ? toInsights(result.explanation) : [];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center"
      style={{ background: "color-mix(in oklch, var(--foreground) 45%, transparent)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal shell */}
      <div
        className="relative w-full sm:max-w-5xl sm:mx-4 flex flex-col"
        style={{
          background:   "var(--card)",
          border:       "1px solid var(--border)",
          borderRadius: "1.5rem 1.5rem 0 0",
          maxHeight:    "88dvh",
          boxShadow:    "0 -4px 40px -4px hsl(0 0% 0% / 0.18), 0 32px 64px -8px hsl(0 0% 0% / 0.28)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Call Analysis Result"
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
                <Mic className="h-8 w-8 animate-pulse" style={{ color: "var(--primary)" }} />
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-lg font-bold text-card-foreground">Analyzing Call…</p>
              <p className="text-sm text-muted-foreground">Transcribing and scanning for fraud signals</p>
            </div>

            {/* Current phase */}
            <div
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium w-full max-w-sm justify-center"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              {(() => { const Icon = LOADING_STEPS[stepIdx].icon; return <Icon className="h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />; })()}
              <span key={stepIdx}>{phaseLabel || LOADING_STEPS[stepIdx].text}</span>
            </div>

            {/* Real progress bar (driven by parent) */}
            <div className="w-full max-w-sm space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%`, background: "var(--primary)" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ ERROR STATE ═══════════ */}
        {!loading && error && (
          <div className="p-10 flex flex-col items-center gap-4 text-center">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background: "color-mix(in oklch, var(--destructive) 12%, var(--muted))",
                border:     "1px solid color-mix(in oklch, var(--destructive) 30%, var(--border))",
              }}
            >
              <XCircle className="h-7 w-7" style={{ color: "var(--destructive)" }} />
            </div>
            <div>
              <p className="font-semibold text-card-foreground">Analysis Failed</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:bg-muted transition-colors">
                Close
              </button>
              <button onClick={onAnalyzeAnother} className="px-5 py-2.5 rounded-xl text-sm font-bold text-primary-foreground hover:opacity-90 transition-opacity" style={{ background: "var(--primary)" }}>
                Try Again
              </button>
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
                background:   `color-mix(in oklch, ${riskColor} 8%, var(--card))`,
                borderBottom: `1px solid color-mix(in oklch, ${riskColor} 25%, var(--border))`,
                borderRadius: "1.5rem 1.5rem 0 0",
              }}
            >
              <div className="flex items-center gap-4 pr-10">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background: `color-mix(in oklch, ${riskColor} 15%, transparent)`,
                    border:     `1px solid color-mix(in oklch, ${riskColor} 35%, transparent)`,
                  }}
                >
                  <RiskIcon className="h-6 w-6" style={{ color: riskColor }} />
                </div>

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
                    {result.riskScore}% Fraud Probability
                  </p>
                </div>

                {/* Credits pill */}
                {creditsRemaining !== null && (
                  <div
                    className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full shrink-0"
                    style={{
                      background: "color-mix(in oklch, var(--chart-1) 8%, var(--muted))",
                      border:     "1px solid color-mix(in oklch, var(--chart-1) 20%, var(--border))",
                      color:      "var(--chart-1)",
                    }}
                  >
                    <Zap className="h-3 w-3" />
                    {creditsUsed} cr used · {creditsRemaining} left
                  </div>
                )}
              </div>

              {/* Score bar */}
              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="font-medium">Fraud Risk Score</span>
                  <span className="font-bold" style={{ color: riskColor }}>{result.riskScore} / 100</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${result.riskScore}%`, background: riskColor }}
                  />
                </div>
              </div>
            </div>

            {/* ── SCROLLABLE BODY ── */}
            <div
              className="flex-1 overflow-y-auto p-5"
              style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* LEFT: Risk stats */}
                <div className="sm:col-span-1 flex flex-col gap-4">
                  {/* Circular score */}
                  <div
                    className="rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-2"
                    style={{
                      background: `color-mix(in oklch, ${riskColor} 8%, var(--muted))`,
                      border:     `1px solid color-mix(in oklch, ${riskColor} 20%, var(--border))`,
                    }}
                  >
                    <div
                      className="relative flex h-24 w-24 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(${riskColor} 0% ${result.riskScore}%, var(--muted) ${result.riskScore}% 100%)`,
                        padding:    "3px",
                      }}
                    >
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-full" style={{ background: "var(--card)" }}>
                        <span className="text-2xl font-black" style={{ color: riskColor }}>{result.riskScore}</span>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">/ 100</span>
                      </div>
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest" style={{ color: riskColor }}>
                      {result.riskLevel} Risk
                    </p>
                    <p className="text-xs text-muted-foreground">Fraud Probability Score</p>
                  </div>

                  {/* Stat rows */}
                  <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
                    {[
                      { label: "Threat Level",  value: result.riskLevel,               color: riskColor                    },
                      { label: "Threats Found", value: `${result.threats.length}`,      color: "var(--card-foreground)"     },
                      { label: "Actions",       value: `${result.recommendations.length}`, color: "var(--primary)"          },
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
                    <div
                      className="sm:hidden flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold"
                      style={{
                        background: "color-mix(in oklch, var(--chart-1) 8%, var(--muted))",
                        border:     "1px solid color-mix(in oklch, var(--chart-1) 20%, var(--border))",
                        color:      "var(--chart-1)",
                      }}
                    >
                      <Zap className="h-3 w-3 shrink-0" />
                      {creditsUsed} credits used · {creditsRemaining} remaining
                    </div>
                  )}
                </div>

                {/* RIGHT: Findings + Insights + Recommendations */}
                <div className="sm:col-span-2 flex flex-col gap-4">

                  {/* Key Findings */}
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

                  {/* AI Insights */}
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

                  {/* Recommendations */}
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

                  {/* Collapsible Transcript */}
                  {result.transcript && (
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
                      <button
                        className="w-full flex items-center justify-between px-4 py-3"
                        onClick={() => setTranscriptOpen((v) => !v)}
                        type="button"
                      >
                        <div className="flex items-center gap-2">
                          <Mic className="h-3.5 w-3.5 text-muted-foreground" />
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Call Transcript</p>
                        </div>
                        {transcriptOpen
                          ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </button>
                      {transcriptOpen && (
                        <div className="px-4 pb-4" style={{ borderTop: "1px solid var(--border)" }}>
                          <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono mt-3 text-muted-foreground max-h-40 overflow-y-auto">
                            {result.transcript}
                          </pre>
                        </div>
                      )}
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
                Analyze Another Call
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
