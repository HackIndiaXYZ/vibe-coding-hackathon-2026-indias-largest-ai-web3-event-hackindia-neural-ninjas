"use client";

/**
 * components/features/message-analysis/message-analyzer-panel.tsx
 *
 * Client-side UI for the Fraud & Scam Message Analyzer.
 * Calls POST /api/analyze/message and renders ResultCard.
 * Handles credit pre-check (402) and shows remaining credits after scan.
 */

import { useState } from "react";
import { MessageSquare, Loader2, Shield, X, Zap } from "lucide-react";
import { ResultCard, ResultCardSkeleton } from "@/components/features/shared/result-card";
import { InsufficientCreditsBanner } from "@/components/dashboard/insufficient-credits-banner";
import type { MessageAnalysisResult } from "@/lib/features/message-analysis/message-analysis.types";
import { SCAN_CREDITS } from "@/lib/db/types";

const V = {
  primary:  "var(--primary)",
  primaryFg:"var(--primary-foreground)",
  card:     "var(--card)",
  border:   "var(--border)",
  muted:    "var(--muted)",
  mutedFg:  "var(--muted-foreground)",
  cardFg:   "var(--card-foreground)",
  input:    "var(--input)",
  chart1:   "var(--chart-1)",
};

const COST = SCAN_CREDITS.message; // 2

const EXAMPLE_MESSAGES = [
  "URGENT: Your bank account has been suspended. Click here to verify: bit.ly/bank-verify",
  "Congratulations! You've won ₹50,000. Send your OTP to claim: +91 98765 43210",
  "We are from CBI. You have a pending arrest warrant. Call back immediately to resolve.",
];

export function MessageAnalyzerPanel() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MessageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState<{
    required: number;
    available: number;
  } | null>(null);

  const handleScan = async () => {
    if (message.trim().length < 10) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setInsufficientCredits(null);
    setCreditsRemaining(null);

    try {
      const res = await fetch("/api/analyze/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });

      const json = await res.json();

      if (res.status === 402 && json.insufficientCredits) {
        setInsufficientCredits({ required: json.required, available: json.available });
        return;
      }

      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "Analysis failed. Please try again.");
      }

      setResult(json.data as MessageAnalysisResult);
      if (typeof json.creditsRemaining === "number") {
        setCreditsRemaining(json.creditsRemaining);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const charCount = message.length;
  const isValid = message.trim().length >= 10;

  return (
    <div className="space-y-6">
      {/* Input card */}
      <div className="rounded-2xl p-6" style={{ background: V.card, border: `1px solid ${V.border}` }}>
        <div className="flex items-center gap-3 mb-5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: `color-mix(in oklch, ${V.primary} 15%, transparent)`, border: `1px solid color-mix(in oklch, ${V.primary} 30%, transparent)` }}
          >
            <MessageSquare className="h-5 w-5" style={{ color: V.primary }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: V.cardFg }}>Paste Suspicious Message</p>
            <p className="text-xs" style={{ color: V.mutedFg }}>SMS, email, WhatsApp, social media</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: `color-mix(in oklch, ${V.primary} 10%, transparent)`,
              color: V.mutedFg,
              border: `1px solid ${V.border}`,
            }}
          >
            <Zap className="h-3 w-3" style={{ color: V.primary }} />
            {COST} credits
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (result) setResult(null);
              if (error) setError(null);
              if (insufficientCredits) setInsufficientCredits(null);
            }}
            placeholder="Paste the suspicious message here…"
            rows={6}
            maxLength={10000}
            disabled={loading}
            className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={{
              background: V.muted,
              color: V.cardFg,
              border: `1px solid ${V.border}`,
              caretColor: V.primary,
            }}
          />
          {message && (
            <button
              onClick={() => { setMessage(""); setResult(null); setError(null); setInsufficientCredits(null); }}
              className="absolute top-2 right-2 p-1 rounded-lg"
              style={{ color: V.mutedFg }}
              type="button"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Char count + example buttons */}
        <div className="flex items-center justify-between mt-2 mb-4">
          <div className="flex gap-1.5 flex-wrap">
            {EXAMPLE_MESSAGES.map((ex, i) => (
              <button
                key={i}
                onClick={() => { setMessage(ex); setResult(null); }}
                className="text-[10px] px-2 py-0.5 rounded-full transition-colors"
                style={{ background: V.muted, color: V.mutedFg }}
                type="button"
              >
                Example {i + 1}
              </button>
            ))}
          </div>
          <span className="text-[10px]" style={{ color: V.mutedFg }}>
            {charCount} / 10,000
          </span>
        </div>

        {/* Scan button */}
        <button
          onClick={handleScan}
          disabled={!isValid || loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          style={{ background: V.primary, color: V.primaryFg }}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analysing Message…
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Analyse for Scam · {COST} Credits
            </>
          )}
        </button>
      </div>

      {/* Insufficient credits */}
      {insufficientCredits && (
        <InsufficientCreditsBanner
          required={insufficientCredits.required}
          available={insufficientCredits.available}
          currentPlan="free"
          currentCredits={insufficientCredits.available}
        />
      )}

      {/* Error */}
      {error && (
        <div
          className="rounded-2xl px-5 py-4 text-sm font-medium"
          style={{ background: "color-mix(in oklch, var(--destructive) 10%, var(--card))", border: "1px solid color-mix(in oklch, var(--destructive) 30%, var(--border))", color: "var(--destructive)" }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Credits deducted toast */}
      {creditsRemaining !== null && result && (
        <div
          className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold"
          style={{
            background: `color-mix(in oklch, ${V.chart1} 10%, ${V.card})`,
            border: `1px solid color-mix(in oklch, ${V.chart1} 25%, ${V.border})`,
            color: V.chart1,
          }}
        >
          <Zap className="h-3.5 w-3.5 shrink-0" />
          {COST} credits used · {creditsRemaining} credits remaining
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !result && <ResultCardSkeleton />}

      {/* Result */}
      {result && !loading && (
        <ResultCard
          score={result.scamProbability}
          scoreLabel="RISK"
          riskLevel={result.riskLevel}
          verdict={result.riskLevel === "High" ? "Likely Scam / Fraud" : result.riskLevel === "Medium" ? "Potentially Suspicious" : "Appears Legitimate"}
          explanation={result.explanation}
          threats={result.threats}
          recommendations={result.recommendations}
          metaRows={[
            { label: "Scam Probability", value: `${result.scamProbability}%` },
            { label: "Risk Level", value: result.riskLevel },
          ]}
        />
      )}
    </div>
  );
}
