import Link from "next/link";
import { Shield, Mic, MessageSquare, Globe, Video, Check, Lock, Zap, Eye } from "lucide-react";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";

const features = [
  { icon: Mic, label: "AI Voice Clone Detection", desc: "Unmask synthetic voices in real time", color: "#a78bfa" },
  { icon: MessageSquare, label: "SMS Scam Detection", desc: "Catch phishing texts before you click", color: "#60a5fa" },
  { icon: Globe, label: "Website Trust Analysis", desc: "Verify any URL in seconds", color: "#34d399" },
  { icon: Video, label: "Deepfake Detection", desc: "Spot manipulated media instantly", color: "#f472b6" },
];

const trustBadges = [
  { icon: Lock, label: "SOC 2 Compliant" },
  { icon: Zap, label: "< 2s Analysis" },
  { icon: Eye, label: "Zero Data Logs" },
];

interface AuthLayoutProps {
  heading: string;
  description: string;
  googleLabel: string;
  footerText: string;
  footerLinkLabel: string;
  footerLinkHref: string;
}

export function AuthLayout({
  heading,
  description,
  googleLabel,
  footerText,
  footerLinkLabel,
  footerLinkHref,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex dark" style={{ background: "oklch(0.09 0.015 260)" }}>

      {/* ── LEFT: Auth Panel ── */}
      <div className="flex flex-1 lg:w-[45%] lg:flex-none flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Subtle left-side grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

        <div className="w-full max-w-sm relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-10 group">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-2xl transition-transform group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, oklch(0.7 0.22 295) 0%, oklch(0.65 0.2 240) 100%)",
                boxShadow: "0 0 20px oklch(0.7 0.22 295 / 0.4)",
              }}
            >
              <Shield className="h-5 w-5" style={{ color: "oklch(0.09 0.015 260)" }} />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: "oklch(0.92 0.01 260)" }}>
              TruScan <span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Card */}
          <div
            className="rounded-3xl p-8 space-y-6"
            style={{
              background: "oklch(0.13 0.015 260)",
              border: "1px solid oklch(0.22 0.015 260)",
              boxShadow: "0 8px 40px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(0.22 0.015 260)",
            }}
          >
            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: "oklch(0.92 0.01 260)" }}>
                {heading}
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.55 0.01 260)" }}>
                {description}
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "oklch(0.22 0.015 260)" }} />
              <span className="text-xs font-medium" style={{ color: "oklch(0.45 0.01 260)" }}>
                SECURE SIGN IN
              </span>
              <div className="flex-1 h-px" style={{ background: "oklch(0.22 0.015 260)" }} />
            </div>

            {/* Google Button */}
            <GoogleSignInButton label={googleLabel} />

            {/* Trust badges */}
            <div className="flex gap-2">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex-1 flex flex-col items-center gap-1 p-2 rounded-xl text-center"
                  style={{
                    background: "oklch(0.16 0.012 260)",
                    border: "1px solid oklch(0.22 0.015 260)",
                  }}
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: "oklch(0.7 0.22 295)" }} />
                  <span className="text-[10px] font-medium leading-tight" style={{ color: "oklch(0.55 0.01 260)" }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Policy text */}
            <p className="text-[11px] text-center leading-relaxed" style={{ color: "oklch(0.42 0.01 260)" }}>
              By signing in, you agree to our{" "}
              <span className="underline underline-offset-2 cursor-pointer" style={{ color: "oklch(0.7 0.22 295)" }}>
                Terms
              </span>{" "}
              and{" "}
              <span className="underline underline-offset-2 cursor-pointer" style={{ color: "oklch(0.7 0.22 295)" }}>
                Privacy Policy
              </span>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-sm text-center" style={{ color: "oklch(0.45 0.01 260)" }}>
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="font-semibold transition-colors hover:underline underline-offset-2"
              style={{ color: "oklch(0.7 0.22 295)" }}
            >
              {footerLinkLabel}
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT: Hero Panel ── */}
      <div
        className="hidden lg:flex flex-1 flex-col justify-between p-16 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.14 0.04 295) 0%, oklch(0.11 0.03 260) 40%, oklch(0.13 0.04 320) 100%)",
        }}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern pointer-events-none" />

        {/* Animated blobs */}
        <div
          className="animate-float-orb pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-30"
          style={{ background: "oklch(0.7 0.22 295)" }}
        />
        <div
          className="animate-float-orb-slow pointer-events-none absolute bottom-20 -left-20 h-96 w-96 rounded-full blur-3xl opacity-20"
          style={{ background: "oklch(0.65 0.2 240)" }}
        />
        <div
          className="animate-float-orb pointer-events-none absolute top-1/2 right-1/4 h-48 w-48 rounded-full blur-3xl opacity-20"
          style={{ background: "oklch(0.72 0.22 340)", animationDelay: "4s" }}
        />

        {/* Content */}
        <div className="relative z-10 space-y-16">
          {/* Headline */}
          <div className="space-y-5 max-w-lg">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: "oklch(0.7 0.22 295 / 0.15)",
                border: "1px solid oklch(0.7 0.22 295 / 0.3)",
                color: "oklch(0.82 0.15 295)",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "oklch(0.75 0.2 155)" }} />
              AI-Powered Threat Detection
            </div>

            <h2 className="text-5xl font-black leading-[1.1] tracking-tight" style={{ color: "oklch(0.92 0.01 260)" }}>
              Protect Yourself<br />
              From{" "}
              <span className="gradient-text">Digital Scams</span>
            </h2>
            <p className="text-base leading-relaxed" style={{ color: "oklch(0.6 0.01 260)" }}>
              TruScan AI uses advanced machine learning to detect threats before
              they cause harm — keeping you safe online in real time.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, label, desc, color }) => (
              <div
                key={label}
                className="group p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-default"
                style={{
                  background: "oklch(0.13 0.015 260 / 0.8)",
                  border: "1px solid oklch(0.22 0.015 260)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl mb-3 transition-transform group-hover:scale-110"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                >
                  <Icon className="h-4.5 w-4.5" style={{ color }} />
                </div>
                <p className="text-sm font-semibold mb-0.5" style={{ color: "oklch(0.88 0.01 260)" }}>
                  {label}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "oklch(0.5 0.01 260)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust strip */}
        <div
          className="relative z-10 flex items-center gap-6 p-4 rounded-2xl"
          style={{
            background: "oklch(0.13 0.015 260 / 0.6)",
            border: "1px solid oklch(0.22 0.015 260)",
            backdropFilter: "blur(12px)",
          }}
        >
          {[
            { num: "2M+", label: "Scams Blocked" },
            { num: "99.2%", label: "Accuracy Rate" },
            { num: "<2s", label: "Detection Speed" },
            { num: "150+", label: "Threat Signatures" },
          ].map(({ num, label }) => (
            <div key={label} className="flex-1 text-center">
              <p className="text-xl font-black gradient-text">{num}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "oklch(0.5 0.01 260)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
