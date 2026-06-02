"use client";

/**
 * components/features/call-analysis/call-analyzer-panel.tsx
 *
 * Client-side UI for the Fraud Call Analyzer.
 * Calls POST /api/analyze/call and renders ResultCard + transcript.
 */

import { useState, useCallback } from "react";
import { Phone, Loader2, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { FileUploadZone } from "@/components/features/shared/file-upload-zone";
import { ResultCard, ResultCardSkeleton } from "@/components/features/shared/result-card";
import type { CallAnalysisResult } from "@/lib/features/call-analysis/call-analysis.types";

const V = {
  primary:  "var(--primary)",
  primaryFg:"var(--primary-foreground)",
  card:     "var(--card)",
  border:   "var(--border)",
  muted:    "var(--muted)",
  mutedFg:  "var(--muted-foreground)",
  cardFg:   "var(--card-foreground)",
};

export function CallAnalyzerPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"idle" | "transcribing" | "analysing">("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<CallAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);

  const handleFileSelected = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
  }, []);

  const handleScan = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setPhase("transcribing");
    setProgress(0);

    // Simulate granular progress for better UX
    const progInterval = setInterval(() => {
      setProgress((p) => {
        if (p < 45) return p + 3;
        if (p < 80) return p + 1;
        return p;
      });
    }, 400);

    try {
      const form = new FormData();
      form.append("audio", file);

      setPhase("transcribing");
      await new Promise((r) => setTimeout(r, 100)); // allow state flush

      const res = await fetch("/api/analyze/call", {
        method: "POST",
        body: form,
      });

      setPhase("analysing");
      setProgress(90);

      const json = await res.json();
      setProgress(100);

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Analysis failed. Please try again.");
      }

      setResult(json.data as CallAnalysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      clearInterval(progInterval);
      setProgress(0);
      setPhase("idle");
      setLoading(false);
    }
  };

  const phaseLabel =
    phase === "transcribing"
      ? "Transcribing audio with Whisper…"
      : phase === "analysing"
      ? "Analysing transcript with AI…"
      : "Processing…";

  return (
    <div className="space-y-6">
      {/* Upload card */}
      <div className="rounded-2xl p-6" style={{ background: V.card, border: `1px solid ${V.border}` }}>
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: `color-mix(in oklch, ${V.primary} 15%, transparent)`, border: `1px solid color-mix(in oklch, ${V.primary} 30%, transparent)` }}
          >
            <Phone className="h-5 w-5" style={{ color: V.primary }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: V.cardFg }}>Upload Call Recording</p>
            <p className="text-xs" style={{ color: V.mutedFg }}>MP3, WAV, M4A, OGG, WebM</p>
          </div>
        </div>

        <FileUploadZone
          accept=".mp3,.wav,.m4a,.ogg,.webm"
          maxSizeMB={25}
          label="Drop your call recording here"
          sublabel="The audio will be transcribed then analysed"
          onFileSelected={handleFileSelected}
          disabled={loading}
        />

        {/* Progress */}
        {loading && (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs" style={{ color: V.mutedFg }}>
              <span>{phaseLabel}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: V.muted }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: V.primary }}
              />
            </div>
          </div>
        )}

        {/* Scan button */}
        <button
          onClick={handleScan}
          disabled={!file || loading}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          style={{ background: V.primary, color: V.primaryFg }}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {phaseLabel}
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Analyse Call
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="rounded-2xl px-5 py-4 text-sm font-medium"
          style={{ background: "color-mix(in oklch, var(--destructive) 10%, var(--card))", border: "1px solid color-mix(in oklch, var(--destructive) 30%, var(--border))", color: "var(--destructive)" }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Skeleton */}
      {loading && !result && <ResultCardSkeleton />}

      {/* Result */}
      {result && !loading && (
        <>
          <ResultCard
            score={result.riskScore}
            scoreLabel="RISK"
            riskLevel={result.riskLevel}
            verdict={
              result.riskLevel === "High"
                ? "High-Risk Fraudulent Call"
                : result.riskLevel === "Medium"
                ? "Suspicious Call Detected"
                : "Call Appears Legitimate"
            }
            explanation={result.explanation}
            threats={result.threats}
            recommendations={result.recommendations}
            metaRows={[
              { label: "Risk Score", value: `${result.riskScore}/100` },
              { label: "Risk Level", value: result.riskLevel },
            ]}
          />

          {/* Collapsible transcript */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: V.card, border: `1px solid ${V.border}` }}
          >
            <button
              className="w-full flex items-center justify-between px-5 py-4"
              onClick={() => setTranscriptExpanded((v) => !v)}
              type="button"
            >
              <p className="text-sm font-semibold" style={{ color: V.cardFg }}>
                Call Transcript
              </p>
              {transcriptExpanded ? (
                <ChevronUp className="h-4 w-4" style={{ color: V.mutedFg }} />
              ) : (
                <ChevronDown className="h-4 w-4" style={{ color: V.mutedFg }} />
              )}
            </button>

            {transcriptExpanded && (
              <div
                className="px-5 pb-5"
                style={{ borderTop: `1px solid ${V.border}` }}
              >
                <pre
                  className="text-xs leading-relaxed whitespace-pre-wrap font-mono mt-4"
                  style={{ color: V.mutedFg }}
                >
                  {result.transcript}
                </pre>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
