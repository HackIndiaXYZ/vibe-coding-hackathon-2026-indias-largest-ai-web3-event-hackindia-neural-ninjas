"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield, Mic, MessageSquare, Globe, Video, Phone,
  Activity, AlertTriangle, BarChart3,
  LogOut, CreditCard, Bell, ChevronRight, Menu,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

/* ── Types ── */
interface Props {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  children?: React.ReactNode;
}

/* ── Nav ── */
const navItems = [
  { icon: BarChart3,     label: "Overview",        href: "/dashboard"          },
  { icon: Mic,           label: "Voice Scanner",    href: "/dashboard/voice"    },
  { icon: MessageSquare, label: "SMS Scanner",      href: "/dashboard/sms"      },
  { icon: Phone,         label: "Call Analyzer",    href: "/dashboard/call"     },
  { icon: Globe,         label: "Website Scanner",  href: "/dashboard/website"  },
  { icon: Video,         label: "Deepfake Scanner", href: "/dashboard/deepfake" },
  { icon: Activity,      label: "Scan History",     href: "/dashboard/history"  },
];

/* ── Quick actions — use primary for both ── */
const quickActions = [
  {
    icon: Mic,
    title: "Audio Scan",
    desc: "Upload or record audio to detect AI-generated voice clones",
    badge: "Most Used",
    href: "/dashboard/voice",
    variant: "primary" as const,
  },
  {
    icon: MessageSquare,
    title: "SMS Scan",
    desc: "Paste any suspicious message and get an instant risk score",
    badge: null,
    href: "/dashboard/sms",
    variant: "chart2" as const,
  },
];

/* ── Tool cards use chart-1 / chart-4 ── */
const toolCards = [
  {
    icon: Globe,
    title: "Website Scanner",
    desc: "Enter any URL for instant trust analysis",
    variant: "chart1" as const,
    status: "Active",
    href: "/dashboard/website",
  },
  {
    icon: Video,
    title: "Deepfake Detector",
    desc: "Upload media for deepfake analysis",
    variant: "chart4" as const,
    status: "Beta",
    href: "/dashboard/deepfake",
  },
];

/* ── Stats ── */
const stats = [
  { icon: Shield,       label: "Protection Score", value: "98", unit: "%", trend: "+2.1% this week", up: true,  variant: "chart1" as const, desc: "Excellent"     },
  { icon: Activity,     label: "Scans This Month",  value: "0",  unit: "",  trend: "Start scanning",  up: null,  variant: "primary" as const, desc: "Get started"  },
  { icon: AlertTriangle,label: "Threats Blocked",   value: "0",  unit: "",  trend: "All clear",       up: true,  variant: "chart2" as const, desc: "Stay safe"    },
  { icon: CreditCard,   label: "Credits Remaining", value: "50", unit: "",  trend: "Free tier",       up: null,  variant: "chart4" as const, desc: "Upgrade anytime" },
];

/* ── Threat feed — semantic red/yellow/green ── */
const recentThreats = [
  { type: "Voice Clone",  risk: "HIGH",   time: "2 min ago", severity: "high"   },
  { type: "SMS Phishing", risk: "MEDIUM", time: "1 hr ago",  severity: "medium" },
  { type: "Fake Website", risk: "HIGH",   time: "3 hrs ago", severity: "high"   },
  { type: "Deepfake",     risk: "LOW",    time: "Yesterday", severity: "low"    },
];

/* ─────────────────────────────────────────────────────────────
   CSS var() helpers — all values come from globals.css tokens
───────────────────────────────────────────────────────────── */
const V = {
  bg:             "var(--background)",
  card:           "var(--card)",
  sidebar:        "var(--sidebar)",
  border:         "var(--border)",
  sidebarBorder:  "var(--sidebar-border)",
  primary:        "var(--primary)",
  primaryFg:      "var(--primary-foreground)",
  muted:          "var(--muted)",
  mutedFg:        "var(--muted-foreground)",
  fg:             "var(--foreground)",
  cardFg:         "var(--card-foreground)",
  sidebarFg:      "var(--sidebar-foreground)",
  sidebarAccent:  "var(--sidebar-accent)",
  sidebarAccentFg:"var(--sidebar-accent-foreground)",
  chart1:         "var(--chart-1)",  // warm orange
  chart2:         "var(--chart-2)",  // purple/violet
  chart3:         "var(--chart-3)",
  chart4:         "var(--chart-4)",  // mauve
  chart5:         "var(--chart-5)",
  destructive:    "var(--destructive)",
  input:          "var(--input)",
  ring:           "var(--ring)",
};

/* Variant → token lookup */
function variantColor(v: "primary" | "chart1" | "chart2" | "chart4") {
  return { primary: V.primary, chart1: V.chart1, chart2: V.chart2, chart4: V.chart4 }[v];
}

/* Severity → destructive / chart1 / chart2 */
function severityColor(s: string) {
  if (s === "high")   return V.destructive;
  if (s === "medium") return V.chart1;
  return V.chart2;
}

/* ── S: style shortcuts fully in CSS vars ── */
const S = {
  sidebar:     { background: V.sidebar,  borderRight:   `1px solid ${V.sidebarBorder}` },
  topbar:      { background: V.bg,       borderBottom:  `1px solid ${V.border}` },
  mainBg:      { background: V.bg },
  card:        { background: V.card,     border: `1px solid ${V.border}` },
  muted:       { color: V.mutedFg },
  text:        { color: V.cardFg },
  textSub:     { color: V.mutedFg },
  pill:        {
    background: `color-mix(in oklch, ${V.primary} 15%, transparent)`,
    color: V.primary,
    border: `1px solid color-mix(in oklch, ${V.primary} 35%, transparent)`,
  },
  activeNav:   {
    background: `color-mix(in oklch, ${V.primary} 15%, transparent)`,
    color: V.primary,
    border: `1px solid color-mix(in oklch, ${V.primary} 30%, transparent)`,
  },
  inactiveNav: { color: V.mutedFg },
  inputBg:     { background: V.muted },
};

/* ── Component ── */
export function DashboardShell({ name, email, avatarUrl, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const supabase = createClient();
  const pathname = usePathname();
  const firstName = name?.split(" ")[0] ?? "there";
  const initials  = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/sign-in";
  }

  // Determine which nav item is active based on current pathname
  function isActive(href: string): boolean {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex h-screen overflow-hidden" style={S.mainBg}>

      {/* ── SIDEBAR ── */}
      <>
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: "oklch(0 0 0 / 0.5)" }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed lg:relative inset-y-0 left-0 z-50 w-64 flex flex-col
            transition-transform duration-300 lg:translate-x-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={S.sidebar}
        >
          {/* Logo */}
          <div
            className="flex h-16 items-center gap-2.5 px-5"
            style={{ borderBottom: `1px solid ${V.border}` }}
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0"
              style={{ background: V.primary }}
            >
              <Shield className="h-4 w-4" style={{ color: V.primaryFg }} />
            </div>
            <span className="text-base font-bold tracking-tight" style={S.text}>
              TruScan{" "}
              <span style={{ color: V.primary }}>AI</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-widest mb-2" style={S.muted}>
              Navigation
            </p>
            {navItems.map(({ icon: Icon, label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                  style={active ? S.activeNav : S.inactiveNav}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                  {active && (
                    <ChevronRight className="h-3 w-3 ml-auto" style={{ color: V.primary }} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="p-3" style={{ borderTop: `1px solid ${V.border}` }}>
            <div
              className="flex items-center gap-3 px-2 py-2 rounded-xl"
              style={S.inputBg}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: avatarUrl ? "transparent" : V.primary,
                  color: V.primaryFg,
                }}
              >
                {avatarUrl
                  ? <img src={avatarUrl} alt={name ?? "User"} className="h-8 w-8 rounded-full object-cover" />
                  : initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate" style={S.text}>{name ?? "User"}</p>
                <p className="text-[10px] truncate" style={S.muted}>{email}</p>
              </div>
              <button
                onClick={signOut}
                title="Sign out"
                className="p-1.5 rounded-lg transition-colors"
                style={S.muted}
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>
      </>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 sm:px-6 shrink-0"
          style={S.topbar}
        >
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl"
              style={S.muted}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1.5 text-sm" style={S.muted}>
              <span>Dashboard</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span style={S.text} className="font-medium">Overview</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
              style={S.card}
            >
              <Bell className="h-4 w-4" style={{ color: V.mutedFg }} />
              <span
                className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full"
                style={{ background: V.primary }}
              />
            </button>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold shrink-0"
              style={{
                background: avatarUrl ? "transparent" : V.primary,
                color: V.primaryFg,
              }}
            >
              {avatarUrl
                ? <img src={avatarUrl} alt={name ?? "User"} className="h-9 w-9 rounded-xl object-cover" />
                : initials}
            </div>
          </div>
        </header>

        {/* Scrollable content — children for sub-pages, overview for /dashboard */}
        <main className="flex-1 overflow-y-auto">
          {children ? (
            children
          ) : (
          <div className="p-4 sm:p-6 space-y-6">

          {/* ── Welcome hero ── */}
          <div
            className="relative rounded-2xl p-6 sm:p-8 overflow-hidden"
            style={{
              background: `color-mix(in oklch, ${V.primary} 12%, ${V.card})`,
              border: `1px solid color-mix(in oklch, ${V.primary} 30%, ${V.border})`,
            }}
          >
            {/* Subtle blob */}
            <div
              className="absolute -top-10 -right-10 h-40 w-40 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ background: V.primary }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                {/* Live badge */}
                <div
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={S.pill}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ background: V.chart1 }}
                  />
                  All systems operational
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={S.text}>
                  Good {getGreeting()},{" "}
                  <span style={{ color: V.primary }}>{firstName}!</span>
                </h1>
                <p className="text-sm" style={S.textSub}>
                  Your protection suite is active. Run a scan to get started.
                </p>
              </div>

              {/* Protection score ring */}
              <div className="flex items-center gap-4 shrink-0">
                <div
                  className="relative flex h-24 w-24 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(${V.chart1} 0% 98%, ${V.muted} 98% 100%)`,
                    padding: "3px",
                  }}
                >
                  <div
                    className="flex h-full w-full flex-col items-center justify-center rounded-full"
                    style={{ background: V.card }}
                  >
                    <span className="text-xl font-black" style={{ color: V.chart1 }}>98</span>
                    <span className="text-[9px] font-semibold" style={S.muted}>SCORE</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: V.chart1 }}>Excellent</p>
                  <p className="text-xs" style={S.muted}>Protection Score</p>
                  <p className="text-[10px] mt-1" style={{ color: V.chart1 }}>↑ +2.1% this week</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ icon: Icon, label, value, unit, trend, up, variant, desc }) => {
              const c = variantColor(variant);
              return (
                <div
                  key={label}
                  className="rounded-2xl p-4 sm:p-5 space-y-3 transition-all duration-200 hover:scale-[1.02]"
                  style={S.card}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-xl"
                      style={{
                        background: `color-mix(in oklch, ${c} 15%, transparent)`,
                        border: `1px solid color-mix(in oklch, ${c} 30%, transparent)`,
                      }}
                    >
                      <Icon className="h-4 w-4" style={{ color: c }} />
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={S.inputBg}
                    >
                      <span style={S.muted}>{desc}</span>
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-black" style={S.text}>
                      {value}<span className="text-base">{unit}</span>
                    </p>
                    <p className="text-xs mt-0.5" style={S.muted}>{label}</p>
                  </div>
                  <p
                    className="text-[11px]"
                    style={{
                      color: up === true ? V.chart1 : up === false ? V.destructive : V.mutedFg,
                    }}
                  >
                    {trend}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ── Quick Actions ── */}
          <div>
            <h2 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={S.muted}>
              Quick Scan
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {quickActions.map(({ icon: Icon, title, desc, badge, href, variant }) => {
                const c = variantColor(variant);
                return (
                  <Link key={title} href={href}>
                    <div
                      className="group relative rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                      style={{
                        background: `color-mix(in oklch, ${c} 10%, ${V.card})`,
                        border: `1px solid color-mix(in oklch, ${c} 35%, ${V.border})`,
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
                          style={{
                            background: `color-mix(in oklch, ${c} 18%, transparent)`,
                            border: `1px solid color-mix(in oklch, ${c} 30%, transparent)`,
                          }}
                        >
                          <Icon className="h-6 w-6" style={{ color: c }} />
                        </div>
                        {badge && (
                          <span
                            className="text-[10px] font-bold px-2 py-1 rounded-full"
                            style={{
                              background: `color-mix(in oklch, ${c} 18%, transparent)`,
                              color: c,
                              border: `1px solid color-mix(in oklch, ${c} 30%, transparent)`,
                            }}
                          >
                            {badge}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-1" style={S.text}>{title}</h3>
                      <p className="text-sm leading-relaxed" style={S.textSub}>{desc}</p>
                      <div
                        className="flex items-center gap-1.5 mt-4 text-xs font-semibold"
                        style={{ color: c }}
                      >
                        Start Scan
                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── Tool cards + Threat feed ── */}
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={S.muted}>
                More Tools
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {toolCards.map(({ icon: Icon, title, desc, variant, status, href }) => {
                  const c = variantColor(variant);
                  return (
                    <Link key={title} href={href}>
                      <div
                        className="group rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                        style={S.card}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                            style={{
                              background: `color-mix(in oklch, ${c} 15%, transparent)`,
                              border: `1px solid color-mix(in oklch, ${c} 30%, transparent)`,
                            }}
                          >
                            <Icon className="h-5 w-5" style={{ color: c }} />
                          </div>
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1"
                            style={{
                              background: `color-mix(in oklch, ${c} 15%, transparent)`,
                              color: c,
                              border: `1px solid color-mix(in oklch, ${c} 30%, transparent)`,
                            }}
                          >
                            {status}
                          </span>
                        </div>
                        <p className="text-sm font-semibold mb-1" style={S.text}>{title}</p>
                        <p className="text-xs" style={S.muted}>{desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Credits */}
              <div className="rounded-2xl p-5" style={S.card}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold" style={S.text}>Credits</p>
                    <p className="text-xs" style={S.muted}>Free tier — 50 scans/month</p>
                  </div>
                  <button
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all hover:scale-105"
                    style={S.pill}
                  >
                    Upgrade
                  </button>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={S.inputBg}>
                  <div
                    className="h-full w-1/2 rounded-full"
                    style={{ background: V.primary }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px]" style={S.muted}>25 used</span>
                  <span className="text-[10px]" style={S.muted}>50 total</span>
                </div>
              </div>
            </div>

            {/* Threat feed */}
            <div className="rounded-2xl p-5" style={S.card}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold" style={S.text}>Threat Intelligence</p>
                <span
                  className="flex items-center gap-1 text-[10px] font-semibold"
                  style={{ color: V.chart1 }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ background: V.chart1 }}
                  />
                  LIVE
                </span>
              </div>
              <div className="space-y-3">
                {recentThreats.map(({ type, risk, time, severity }, i) => {
                  const sc = severityColor(severity);
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={S.inputBg}
                    >
                      <div
                        className="h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: sc }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate" style={S.text}>{type}</p>
                        <p className="text-[10px]" style={S.muted}>{time}</p>
                      </div>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0"
                        style={{
                          background: `color-mix(in oklch, ${sc} 15%, transparent)`,
                          color: sc,
                          border: `1px solid color-mix(in oklch, ${sc} 30%, transparent)`,
                        }}
                      >
                        {risk}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button
                className="w-full mt-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                style={S.inputBg}
              >
                <span style={S.muted}>View All Threats →</span>
              </button>
            </div>
          </div>
          </div>
          )}
        </main>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
