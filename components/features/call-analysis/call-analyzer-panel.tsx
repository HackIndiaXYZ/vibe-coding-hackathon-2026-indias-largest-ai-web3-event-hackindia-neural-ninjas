"use client";

/**
 * components/features/call-analysis/call-analyzer-panel.tsx
 *
 * Client-side UI for the Fraud Call Analyzer.
 * Calls POST /api/analyze/call.
 * On submit → opens CallResultModal immediately (shows live progress → result).
 * All analysis logic is unchanged.
 */

import { useState, useCallback } from "react";
import { Phone, Shield, Zap } from "lucide-react";
import { FileUploadZone } from "@/components/features/shared/file-upload-zone";
import { InsufficientCreditsBanner } from "@/components/dashboard/insufficient-credits-banner";
import { CallResultModal } from "./call-result-modal";
import type { CallAnalysisResult } from "@/lib/features/call-analysis/call-analysis.types";
import { SCAN_CREDITS } from "@/lib/db/types";

const COST = SCAN_CREDITS.call; // 10

export function CallAnalyzerPanel() {
  const [file,                setFile]                = useState<File | null>(null);
  const [loading,             setLoading]             = useState(false);
  const [phase,               setPhase]               = useState<"idle" | "transcribing" | "analysing">("idle");
  const [progress,            setProgress]            = useState(0);
  const [modalOpen,           setModalOpen]           = useState(false);
  const [result,              setResult]              = useState<CallAnalysisResult | null>(null);
  const [error,               setError]               = useState<string | null>(null);
  const [creditsRemaining,    setCreditsRemaining]    = useState<number | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState<{ required: number; available: number } | null>(null);

  const handleFileSelected = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
    setInsufficientCredits(null);
    setCreditsRemaining(null);
  }, []);

  const handleScan = async () => {
    if (!file) return;

    // Open modal immediately — shows loading state
    setLoading(true);
    setModalOpen(true);
    setResult(null);
    setError(null);
    setInsufficientCredits(null);
    setCreditsRemaining(null);
    setPhase("transcribing");
    setProgress(0);

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

      const res = await fetch("/api/analyze/call", {
        method: "POST",
        body:   form,
      });

      setPhase("analysing");
      setProgress(90);

      const json = await res.json();
      setProgress(100);

      if (res.status === 402 && json.insufficientCredits) {
        // Close modal, show inline banner
        setModalOpen(false);
        setInsufficientCredits({ required: json.required, available: json.available });
        return;
      }

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Analysis failed. Please try again.");
      }

      setResult(json.data as CallAnalysisResult);
      if (typeof json.creditsRemaining === "number") {
        setCreditsRemaining(json.creditsRemaining);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      clearInterval(progInterval);
      setProgress(0);
      setPhase("idle");
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setLoading(false);
  };

  const handleAnalyzeAnother = () => {
    setModalOpen(false);
    setLoading(false);
    setResult(null);
    setError(null);
    setCreditsRemaining(null);
    setFile(null);
    setProgress(0);
    setPhase("idle");
  };

  const phaseLabel =
    phase === "transcribing" ? "Transcribing audio with Whisper…"
    : phase === "analysing"  ? "Analysing transcript with AI…"
    : "Processing…";

  return (
    <>
      {/* ── Upload card ── */}
      <div className="rounded-2xl p-6 border border-border bg-card space-y-4">
        {/* Card header */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "color-mix(in oklch, var(--primary) 12%, transparent)",
              border:     "1px solid color-mix(in oklch, var(--primary) 25%, transparent)",
            }}
          >
            <Phone className="h-5 w-5" style={{ color: "var(--primary)" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-card-foreground">Upload Call Recording</p>
            <p className="text-xs text-muted-foreground">MP3 · WAV · M4A · OGG · WebM (max 25 MB)</p>
          </div>
          {/* Credits badge */}
          <div
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "color-mix(in oklch, var(--primary) 8%, transparent)",
              color:      "var(--muted-foreground)",
              border:     "1px solid var(--border)",
            }}
          >
            <Zap className="h-3 w-3" style={{ color: "var(--primary)" }} />
            {COST} credits
          </div>
        </div>

        {/* File upload zone */}
        <FileUploadZone
          accept=".mp3,.wav,.m4a,.ogg,.webm"
          maxSizeMB={25}
          label="Drop your call recording here"
          sublabel="The audio will be transcribed then analysed for fraud signals"
          onFileSelected={handleFileSelected}
          disabled={loading}
        />

        {/* Analyze button */}
        <button
          onClick={handleScan}
          disabled={!file || loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          <Shield className="h-4 w-4" />
          Analyze Call · {COST} Credits
        </button>
      </div>

      {/* Insufficient credits banner (inline, no modal) */}
      {insufficientCredits && (
        <InsufficientCreditsBanner
          required={insufficientCredits.required}
          available={insufficientCredits.available}
          currentPlan="free"
          currentCredits={insufficientCredits.available}
        />
      )}

      {/* ── Result Modal ── */}
      <CallResultModal
        open={modalOpen}
        loading={loading}
        phaseLabel={phaseLabel}
        progress={progress}
        result={result}
        error={error}
        creditsRemaining={creditsRemaining}
        creditsUsed={COST}
        onClose={handleCloseModal}
        onAnalyzeAnother={handleAnalyzeAnother}
      />
    </>
  );
}
