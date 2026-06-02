"use client";

/**
 * components/features/voice-detection/voice-checker-panel.tsx
 *
 * Client-side UI for the Deepfake Voice Checker.
 * Calls POST /api/analyze/voice and renders ResultCard.
 * No business logic here — all AI work is server-side.
 */

import { useState, useCallback } from "react";
import { Mic, Loader2, Shield } from "lucide-react";
import { FileUploadZone } from "@/components/features/shared/file-upload-zone";
import { ResultCard, ResultCardSkeleton } from "@/components/features/shared/result-card";
import type { VoiceDetectionResult } from "@/lib/features/voice-detection/voice-detection.types";

const V = {
  primary:  "var(--primary)",
  primaryFg:"var(--primary-foreground)",
  card:     "var(--card)",
  border:   "var(--border)",
  muted:    "var(--muted)",
  mutedFg:  "var(--muted-foreground)",
  cardFg:   "var(--card-foreground)",
};

export function VoiceCheckerPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VoiceDetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

    // Simulate upload progress
    setProgress(0);
    const progInterval = setInterval(() => {
      setProgress((p) => (p < 85 ? p + 5 : p));
    }, 400);

    try {
      const form = new FormData();
      form.append("audio", file);

      const res = await fetch("/api/analyze/voice", {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      setProgress(100);

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Analysis failed. Please try again.");
      }

      setResult(json.data as VoiceDetectionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      clearInterval(progInterval);
      setProgress(0);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      <div className="rounded-2xl p-6" style={{ background: V.card, border: `1px solid ${V.border}` }}>
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: `color-mix(in oklch, ${V.primary} 15%, transparent)`, border: `1px solid color-mix(in oklch, ${V.primary} 30%, transparent)` }}
          >
            <Mic className="h-5 w-5" style={{ color: V.primary }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: V.cardFg }}>Upload Audio File</p>
            <p className="text-xs" style={{ color: V.mutedFg }}>Drag and drop or click to browse</p>
          </div>
        </div>

        <FileUploadZone
          accept=".mp3,.wav,.m4a"
          maxSizeMB={25}
          label="Drop your audio file here"
          sublabel="MP3, WAV, M4A supported"
          onFileSelected={handleFileSelected}
          disabled={loading}
        />

        {/* Progress bar */}
        {loading && progress > 0 && (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs" style={{ color: V.mutedFg }}>
              <span>Analysing…</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: V.muted }}>
              <div
                className="h-full rounded-full transition-all duration-300"
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
              Analysing Voice…
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Scan for Deepfake
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

      {/* Loading skeleton */}
      {loading && !result && <ResultCardSkeleton />}

      {/* Result */}
      {result && !loading && (
        <ResultCard
          score={result.authenticityScore}
          scoreLabel="AUTH"
          riskLevel={result.riskLevel}
          verdict={result.verdict}
          explanation={result.explanation}
          metaRows={[
            { label: "Confidence", value: `${result.confidence}%` },
            { label: "Risk Level", value: result.riskLevel },
            { label: "Verdict", value: result.verdict },
          ]}
        />
      )}
    </div>
  );
}
