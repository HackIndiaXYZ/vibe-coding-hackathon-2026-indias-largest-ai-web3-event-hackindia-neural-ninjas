import type { Metadata } from "next";
import { Globe, Shield, Construction } from "lucide-react";

export const metadata: Metadata = {
  title: "Website Scanner — TruScan AI",
  description: "Detect fake websites, typosquatted domains, and malicious URLs.",
};

export default function WebsiteScannerPage() {
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
            <Globe className="h-6 w-6" style={{ color: "var(--chart-1)" }} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-black tracking-tight" style={{ color: "var(--card-foreground)" }}>
                Website Scanner
              </h1>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "color-mix(in oklch, var(--chart-1) 15%, transparent)",
                  color: "var(--chart-1)",
                  border: "1px solid color-mix(in oklch, var(--chart-1) 30%, transparent)",
                }}
              >
                Coming Soon
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Enter any URL to detect fake websites, phishing domains, and malicious content.
            </p>
          </div>
        </div>
      </div>

      {/* Coming soon card */}
      <div
        className="rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <div
          className="flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: "var(--muted)" }}
        >
          <Construction className="h-8 w-8" style={{ color: "var(--muted-foreground)" }} />
        </div>
        <div>
          <p className="text-lg font-bold" style={{ color: "var(--card-foreground)" }}>
            Website Scanner — Coming Soon
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>
            Real-time URL trust analysis is under development. Check back soon.
          </p>
        </div>
      </div>

      <div
        className="flex items-start gap-2.5 rounded-xl p-4"
        style={{ background: "var(--muted)" }}
      >
        <Shield className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--primary)" }} />
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          URL scanning will use AI-powered heuristics and real-time threat databases. No URLs are stored.
        </p>
      </div>
    </div>
  );
}
