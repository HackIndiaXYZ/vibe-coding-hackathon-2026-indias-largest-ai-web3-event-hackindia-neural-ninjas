import Link from "next/link";
import { Shield, Mic, MessageSquare, Globe, Video, Lock, Zap, Eye } from "lucide-react";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";

const features = [
  { icon: Mic,           label: "AI Voice Clone Detection", desc: "Unmask synthetic voices in real time"    },
  { icon: MessageSquare, label: "SMS Scam Detection",       desc: "Catch phishing texts before you click"   },
  { icon: Globe,         label: "Website Trust Analysis",   desc: "Verify any URL in seconds"               },
  { icon: Video,         label: "Deepfake Detection",       desc: "Spot manipulated media instantly"         },
];

const trustBadges = [
  { icon: Lock, label: "SOC 2 Compliant" },
  { icon: Zap,  label: "< 2s Analysis"   },
  { icon: Eye,  label: "Zero Data Logs"  },
];

const stats = [
  { num: "2M+",   label: "Scams Blocked"      },
  { num: "99.2%", label: "Accuracy Rate"       },
  { num: "<2s",   label: "Detection Speed"     },
  { num: "150+",  label: "Threat Signatures"   },
];

interface AuthLayoutProps {
  heading:        string;
  description:    string;
  googleLabel:    string;
  footerText:     string;
  footerLinkLabel:string;
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
    <div className=" min-h-screen flex bg-background text-foreground">

      {/* ── LEFT: Auth Panel ── */}
      <div className="relative flex flex-1 lg:w-[45%] lg:flex-none flex-col items-center justify-center px-6 py-12 z-10">
        {/* Subtle background gradient blob */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-32 right-0 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative w-full max-w-sm">

          {/* Logo */}
          <Link href="/" className="mb-10 flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-primary transition-transform group-hover:scale-105">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-card-foreground">
              TruScan <span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Card */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-xl space-y-6">

            {/* Heading */}
            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
                {heading}
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Secure Sign In
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Google Button */}
            <GoogleSignInButton label={googleLabel} />

            {/* Trust badges */}
            <div className="flex gap-2">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-border bg-muted p-2.5 text-center"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] font-medium leading-tight text-muted-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Policy text */}
            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              By signing in, you agree to our{" "}
              <span className="cursor-pointer text-primary underline underline-offset-2">Terms</span>
              {" "}and{" "}
              <span className="cursor-pointer text-primary underline underline-offset-2">Privacy Policy</span>
            </p>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="font-semibold text-primary underline-offset-2 hover:underline transition-colors"
            >
              {footerLinkLabel}
            </Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT: Hero Panel ── */}
      <div className="relative hidden lg:flex flex-1 flex-col justify-between overflow-hidden bg-muted p-16">

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 -left-20 h-96 w-96 rounded-full bg-chart-2/10 blur-3xl" />
          <div className="absolute top-1/2 right-1/3 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-14">

          {/* Headline */}
          <div className="max-w-lg space-y-5">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              AI-Powered Threat Detection
            </div>

            <h2 className="text-5xl font-black leading-[1.1] tracking-tight text-card-foreground">
              Protect Yourself<br />
              From{" "}
              <span className="text-primary">Digital Scams</span>
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              TruScan AI uses advanced machine learning to detect threats before
              they cause harm — keeping you safe online in real time.
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group cursor-default rounded-2xl border border-border bg-card/80 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary/40 hover:bg-card"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 transition-transform group-hover:scale-110">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <p className="mb-0.5 text-sm font-semibold text-card-foreground">{label}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats strip */}
        <div className="relative z-10 flex items-center gap-6 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm">
          {stats.map(({ num, label }) => (
            <div key={label} className="flex-1 text-center">
              <p className="text-xl font-black text-primary">{num}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
