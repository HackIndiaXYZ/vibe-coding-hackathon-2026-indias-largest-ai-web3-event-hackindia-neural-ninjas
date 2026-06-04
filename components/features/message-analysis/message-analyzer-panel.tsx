"use client";

/**
 * components/features/message-analysis/message-analyzer-panel.tsx
 *
 * Client-side UI for the Fraud & Scam Message Analyzer.
 * Calls POST /api/analyze/message.
 * On submit → opens SmsResultModal (loading → result).
 * All analysis logic is unchanged.
 */

import { useState } from "react";
import { MessageSquare, Shield, X, Zap } from "lucide-react";
import { InsufficientCreditsBanner } from "@/components/dashboard/insufficient-credits-banner";
import { SmsResultModal } from "./sms-result-modal";
import type { MessageAnalysisResult } from "@/lib/features/message-analysis/message-analysis.types";
import { SCAN_CREDITS } from "@/lib/db/types";

const COST = SCAN_CREDITS.message; // 2

const EXAMPLE_MESSAGES = [
  "URGENT: Your bank account has been suspended. Click here to verify: bit.ly/bank-verify",
  "Congratulations! You've won ₹50,000. Send your OTP to claim: +91 98765 43210",
  "We are from CBI. You have a pending arrest warrant. Call back immediately to resolve.",
];

export function MessageAnalyzerPanel() {
  const [message,             setMessage]             = useState("");
  const [loading,             setLoading]             = useState(false);
  const [modalOpen,           setModalOpen]           = useState(false);
  const [result,              setResult]              = useState<MessageAnalysisResult | null>(null);
  const [error,               setError]               = useState<string | null>(null);
  const [creditsRemaining,    setCreditsRemaining]    = useState<number | null>(null);
  const [insufficientCredits, setInsufficientCredits] = useState<{ required: number; available: number } | null>(null);

  const handleScan = async () => {
    if (message.trim().length < 10) return;

    // Open modal immediately (shows loading state)
    setLoading(true);
    setModalOpen(true);
    setResult(null);
    setError(null);
    setInsufficientCredits(null);
    setCreditsRemaining(null);

    try {
      const res  = await fetch("/api/analyze/message", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: message.trim() }),
      });

      const json = await res.json();

      if (res.status === 402 && json.insufficientCredits) {
        // Close modal, show inline banner instead
        setModalOpen(false);
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
    setMessage("");
  };

  const isValid = message.trim().length >= 10;

  return (
    <>
      {/* ── Input card ── */}
      <div className="rounded-2xl p-6 border border-border bg-card space-y-4">
        {/* Card header */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "color-mix(in oklch, var(--primary) 12%, transparent)",
              border: "1px solid color-mix(in oklch, var(--primary) 25%, transparent)",
            }}
          >
            <MessageSquare className="h-5 w-5" style={{ color: "var(--primary)" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-card-foreground">Paste Suspicious Message</p>
            <p className="text-xs text-muted-foreground">SMS · Email · WhatsApp · Social media</p>
          </div>
          {/* Credits badge */}
          <div
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "color-mix(in oklch, var(--primary) 8%, transparent)",
              color: "var(--muted-foreground)",
              border: "1px solid var(--border)",
            }}
          >
            <Zap className="h-3 w-3" style={{ color: "var(--primary)" }} />
            {COST} credits
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (insufficientCredits) setInsufficientCredits(null);
            }}
            placeholder="Paste the suspicious message here…"
            rows={6}
            maxLength={10000}
            disabled={loading}
            className="w-full resize-none rounded-xl px-4 py-3 text-sm outline-none transition-all disabled:opacity-60"
            style={{
              background: "var(--muted)",
              color: "var(--card-foreground)",
              border: "1px solid var(--border)",
              caretColor: "var(--primary)",
            }}
          />
          {message && (
            <button
              onClick={() => { setMessage(""); setInsufficientCredits(null); }}
              className="absolute top-2 right-2 p-1 rounded-lg text-muted-foreground hover:text-card-foreground transition-colors"
              type="button"
              aria-label="Clear message"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Examples + char count */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {EXAMPLE_MESSAGES.map((ex, i) => (
              <button
                key={i}
                onClick={() => setMessage(ex)}
                className="text-[10px] px-2.5 py-1 rounded-full bg-muted text-muted-foreground hover:text-card-foreground transition-colors"
                type="button"
              >
                Example {i + 1}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0">
            {message.length} / 10,000
          </span>
        </div>

        {/* Analyze button */}
        <button
          onClick={handleScan}
          disabled={!isValid || loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          <Shield className="h-4 w-4" />
          Analyze for Scam · {COST} Credits
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
      <SmsResultModal
        open={modalOpen}
        loading={loading}
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
