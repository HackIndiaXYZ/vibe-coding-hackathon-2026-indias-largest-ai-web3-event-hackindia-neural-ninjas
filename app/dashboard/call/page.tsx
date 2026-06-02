import type { Metadata } from "next";
import { CallAnalyzerPanel } from "@/components/features/call-analysis/call-analyzer-panel";
import { Phone, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Call Analyzer — TruScan AI",
  description: "Detect fraud and social engineering in recorded phone calls.",
};

// Auth handled by dashboard layout
export default function CallAnalyzerPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page header */}
      <div
        className="relative rounded-2xl p-6 overflow-hidden"
        style={{
          background: "color-mix(in oklch, var(--chart-1) 10%, var(--card))",
          border: "1px solid color-mix(in oklch, var(--chart-1) 25%, var(--border))",
        }}
      >
        <div
          className="absolute -top-8 -right-8 h-32 w-32 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "var(--chart-1)" }}
        />
        <div className="relative z-10 flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background: "color-mix(in oklch, var(--chart-1) 20%, transparent)",
              border: "1px solid color-mix(in oklch, var(--chart-1) 35%, transparent)",
            }}
          >
            <Phone className="h-6 w-6" style={{ color: "var(--chart-1)" }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black tracking-tight" style={{ color: "var(--card-foreground)" }}>
                Fraud Call Analyzer
              </h1>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "color-mix(in oklch, var(--chart-1) 15%, transparent)",
                  color: "var(--chart-1)",
                  border: "1px solid color-mix(in oklch, var(--chart-1) 30%, transparent)",
                }}
              >
                Whisper + Llama 3.1
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Upload a recorded phone call to transcribe and detect social engineering, OTP extraction, and financial fraud patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Pipeline steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { step: "01", label: "Upload Recording", desc: "MP3, WAV, M4A, OGG" },
          { step: "02", label: "Whisper STT",       desc: "whisper-large-v3-turbo" },
          { step: "03", label: "Llama Analysis",    desc: "llama-3.1-8b-instant" },
          { step: "04", label: "Risk Report",        desc: "Threats + advice" },
        ].map(({ step, label, desc }) => (
          <div
            key={step}
            className="rounded-xl p-4 text-center"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-black mb-1" style={{ color: "var(--chart-1)" }}>{step}</p>
            <p className="text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>{label}</p>
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* What we detect */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--muted-foreground)" }}>
          Patterns detected
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Social Engineering", "OTP Extraction", "Financial Fraud",
            "Identity Theft", "Urgency Tactics", "Authority Impersonation",
            "Voice Impersonation", "Fake Tech Support",
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
      <CallAnalyzerPanel />

      {/* Info footer */}
      <div
        className="flex items-start gap-2.5 rounded-xl p-4"
        style={{ background: "var(--muted)" }}
      >
        <Shield className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Call recordings are processed server-side only using Whisper for transcription and Llama for analysis. Audio is never stored or retained.
        </p>
      </div>
    </div>
  );
}
