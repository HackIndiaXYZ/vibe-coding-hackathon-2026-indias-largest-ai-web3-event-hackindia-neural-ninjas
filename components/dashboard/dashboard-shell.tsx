"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield, MessageSquare, Phone, History,
  LogOut, Menu, X, Zap, Crown, Building2, LayoutDashboard,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UpgradeModal } from "./upgrade-modal";
import type { Plan } from "@/lib/db/types";

interface Props {
  name:      string | null;
  email:     string | null;
  avatarUrl: string | null;
  credits:   number;
  plan:      Plan;
  children?: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/dashboard"         },
  { icon: MessageSquare,   label: "SMS Analyzer",href: "/dashboard/sms"     },
  { icon: Phone,           label: "Call Analyzer",href: "/dashboard/call"   },
  { icon: History,         label: "Scan History",href: "/dashboard/history" },
];

const PLAN_ICONS: Record<Plan, React.ElementType> = {
  free:       Zap,
  pro:        Crown,
  enterprise: Building2,
};

const PLAN_LABELS: Record<Plan, string> = {
  free:       "Free Plan",
  pro:        "Pro Plan",
  enterprise: "Enterprise",
};

export function DashboardShell({
  name, email, avatarUrl, credits: initialCredits, plan: initialPlan, children,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [credits, setCredits] = useState(initialCredits);
  const [plan, setPlan] = useState<Plan>(initialPlan);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const supabase  = createClient();
  const pathname  = usePathname();
  const initials  = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/sign-in";
  }

  function isActive(href: string) {
    return href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);
  }

  /* ─── Sidebar content ─── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-16 px-5 border-b border-sidebar-border shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary shrink-0">
          <Shield className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-bold tracking-tight text-card-foreground">
          TruScan <span className="text-primary">AI</span>
        </span>
        <button
          className="ml-auto lg:hidden text-muted-foreground"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, href }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={[
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-card-foreground hover:bg-muted",
              ].join(" ")}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — Upgrade + User */}
      <div className="px-3 pb-4 space-y-2 shrink-0">
        {/* Upgrade button */}
        <button
          onClick={() => setShowUpgrade(true)}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity duration-150"
        >
          <Crown className="h-4 w-4 shrink-0" />
          Upgrade Plan
        </button>

        {/* User row */}
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg bg-muted">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold bg-primary text-primary-foreground overflow-hidden"
          >
            {avatarUrl
              ? <img src={avatarUrl} alt={name ?? "User"} className="h-8 w-8 object-cover" />
              : initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate text-card-foreground">{name ?? "User"}</p>
            <p className="text-[10px] truncate text-muted-foreground">{email}</p>
          </div>
          <button
            onClick={signOut}
            title="Sign out"
            className="p-1.5 rounded-md text-muted-foreground hover:text-card-foreground transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-sidebar border-r border-sidebar-border lg:hidden">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between px-4 sm:px-6 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 -ml-1 rounded-lg text-muted-foreground hover:text-card-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Credits chip */}
            <button
              onClick={() => setShowUpgrade(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors duration-150"
            >
              <Zap className="h-3.5 w-3.5" />
              {credits === 999999 ? "∞" : credits} credits
            </button>
          </div>

          {/* Right — Plan label + avatar */}
          <div className="flex items-center gap-3">
            {/* Plan badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              {(() => { const PlanIcon = PLAN_ICONS[plan]; return <PlanIcon className="h-3.5 w-3.5" />; })()}
              {PLAN_LABELS[plan]}
            </span>

            {/* Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold overflow-hidden">
              {avatarUrl
                ? <img src={avatarUrl} alt={name ?? "User"} className="h-8 w-8 object-cover" />
                : initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <UpgradeModal
          currentPlan={plan}
          currentCredits={credits}
          onClose={() => setShowUpgrade(false)}
          onSuccess={(newPlan, newCredits) => {
            setPlan(newPlan);
            setCredits(newCredits);
            setShowUpgrade(false);
          }}
        />
      )}

      {/* Low credit toast */}
      {credits < 20 && credits > 0 && credits !== 999999 && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg text-sm font-semibold bg-card border border-border max-w-xs">
          <Zap className="h-4 w-4 shrink-0 text-chart-1" />
          <span className="text-card-foreground">Only {credits} credits left!</span>
          <button
            onClick={() => setShowUpgrade(true)}
            className="ml-auto text-xs font-bold px-2.5 py-1 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Upgrade
          </button>
        </div>
      )}
    </div>
  );
}
