import type { Metadata } from "next";
import { VoiceCheckerPanel } from "@/components/features/voice-detection/voice-checker-panel";
import { Mic, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Voice Scanner — TruScan AI",
  description: "Detect AI-generated or cloned voices with Reality Defender analysis.",
};

// Auth handled by dashboard layout
export default function VoiceScannerPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Page header */}
      <div
        className="relative rounded-2xl p-6 overflow-hidden"
        style={{
          background: "color-mix(in oklch, var(--primary) 10%, var(--card))",
          border: "1px solid color-mix(in oklch, var(--primary) 25%, var(--border))",
        }}
      >
        <div
          className="absolute -top-8 -right-8 h-32 w-32 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "var(--primary)" }}
        />
        <div className="relative z-10 flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background: "color-mix(in oklch, var(--primary) 20%, transparent)",
              border: "1px solid color-mix(in oklch, var(--primary) 35%, transparent)",
            }}
          >
            <Mic className="h-6 w-6" style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black tracking-tight" style={{ color: "var(--card-foreground)" }}>
                Deepfake Voice Checker
              </h1>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "color-mix(in oklch, var(--chart-1) 15%, transparent)",
                  color: "var(--chart-1)",
                  border: "1px solid color-mix(in oklch, var(--chart-1) 30%, transparent)",
                }}
              >
                Reality Defender
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Upload any audio file to detect AI-generated or cloned voices. Supports MP3, WAV, and M4A up to 25 MB.
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { step: "01", label: "Upload Audio", desc: "MP3, WAV, or M4A" },
          { step: "02", label: "AI Analysis",  desc: "Reality Defender scans" },
          { step: "03", label: "Risk Report",  desc: "Authenticity verdict" },
        ].map(({ step, label, desc }) => (
          <div
            key={step}
            className="rounded-xl p-4 text-center"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-black mb-1" style={{ color: "var(--primary)" }}>{step}</p>
            <p className="text-xs font-semibold" style={{ color: "var(--card-foreground)" }}>{label}</p>
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Feature panel */}
      <VoiceCheckerPanel />

      {/* Info footer */}
      <div
        className="flex items-start gap-2.5 rounded-xl p-4"
        style={{ background: "var(--muted)" }}
      >
        <Shield className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Your audio is processed securely on the server and never stored. API keys are never exposed to the client.
        </p>
      </div>
    </div>
  );
}
