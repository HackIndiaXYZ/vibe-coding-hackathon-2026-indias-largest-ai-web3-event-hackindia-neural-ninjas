import type { Metadata } from "next";
import { MessageAnalyzerPanel } from "@/components/features/message-analysis/message-analyzer-panel";
import { MessageSquare, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "SMS Scanner — TruScan AI",
  description: "Detect fraud and scam messages using AI analysis.",
};

// Auth handled by dashboard layout
export default function SmsScannerPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page header */}
      <div
        className="relative rounded-2xl p-6 overflow-hidden"
        style={{
          background: "color-mix(in oklch, var(--chart-2) 10%, var(--card))",
          border: "1px solid color-mix(in oklch, var(--chart-2) 25%, var(--border))",
        }}
      >
        <div
          className="absolute -top-8 -right-8 h-32 w-32 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: "var(--chart-2)" }}
        />
        <div className="relative z-10 flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background: "color-mix(in oklch, var(--chart-2) 20%, transparent)",
              border: "1px solid color-mix(in oklch, var(--chart-2) 35%, transparent)",
            }}
          >
            <MessageSquare className="h-6 w-6" style={{ color: "var(--chart-2)" }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black tracking-tight" style={{ color: "var(--card-foreground)" }}>
                Fraud & Scam Message Analyzer
              </h1>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "color-mix(in oklch, var(--chart-2) 15%, transparent)",
                  color: "var(--chart-2)",
                  border: "1px solid color-mix(in oklch, var(--chart-2) 30%, transparent)",
                }}
              >
                Llama 3.1
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Paste any suspicious SMS, email, WhatsApp, or social media message for instant AI-powered fraud detection.
            </p>
          </div>
        </div>
      </div>

      {/* What we detect */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>
          What we detect
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Phishing", "OTP Scams", "Fake Bank Alerts", "Fake Job Offers",
            "Crypto Scams", "Investment Fraud", "Urgency Manipulation",
            "Suspicious Links", "Impersonation",
          ].map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{
                background: "var(--muted)",
                color: "var(--muted-foreground)",
                border: "1px solid var(--border)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Feature panel */}
      <MessageAnalyzerPanel />

      {/* Info footer */}
      <div
        className="flex items-start gap-2.5 rounded-xl p-4"
        style={{ background: "var(--muted)" }}
      >
        <Shield className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Messages are processed securely server-side using Groq + Llama 3.1. Your content is never stored or used for training.
        </p>
      </div>
    </div>
  );
}
