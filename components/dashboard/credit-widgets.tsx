"use client";

/**
 * components/dashboard/credit-widgets.tsx
 *
 * Four animated stat widgets for the dashboard overview:
 * - Remaining Credits (with progress bar)
 * - Current Plan (with badge)
 * - Credits Used This Month
 * - Total Scans
 */

import { useState } from "react";
import { Zap, Crown, Building2, TrendingUp, Activity } from "lucide-react";
import { UpgradeModal } from "./upgrade-modal";
import type { Plan } from "@/lib/db/types";
import { PLAN_CREDITS } from "@/lib/db/types";

interface CreditWidgetsProps {
  credits:     number;
  plan:        Plan;
  creditsUsed: number;
  totalScans:  number;
  onPlanChange?: (plan: Plan, credits: number) => void;
}

const PLAN_ICONS: Record<Plan, React.ElementType> = {
  free:       Zap,
  pro:        Crown,
  enterprise: Building2,
};

const PLAN_COLORS: Record<Plan, string> = {
  free:       "var(--muted-foreground)",
  pro:        "var(--primary)",
  enterprise: "var(--chart-2)",
};

const PLAN_LABELS: Record<Plan, string> = {
  free:       "Free",
  pro:        "Pro",
  enterprise: "Enterprise",
};

export function CreditWidgets({ credits: initialCredits, plan: initialPlan, creditsUsed, totalScans, onPlanChange }: CreditWidgetsProps) {
  const [credits, setCredits] = useState(initialCredits);
  const [plan,    setPlan]    = useState<Plan>(initialPlan);
  const [showModal, setShowModal] = useState(false);

  const planMax = PLAN_CREDITS[plan];
  const pct     = planMax === 999999 ? 100 : Math.min(100, Math.round((credits / planMax) * 100));
  const PlanIcon = PLAN_ICONS[plan];
  const planColor = PLAN_COLORS[plan];

  function handleUpgradeSuccess(newPlan: Plan, newCredits: number) {
    setPlan(newPlan);
    setCredits(newCredits);
    setShowModal(false);
    onPlanChange?.(newPlan, newCredits);
  }

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Widget 1 — Remaining Credits */}
        <div
          className="col-span-2 lg:col-span-1 rounded-2xl p-5"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "color-mix(in oklch, var(--primary) 15%, transparent)", border: "1px solid color-mix(in oklch, var(--primary) 30%, transparent)" }}
            >
              <Zap className="h-4 w-4" style={{ color: "var(--primary)" }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Credits</span>
          </div>
          <p className="text-3xl font-black mb-0.5" style={{ color: "var(--card-foreground)" }}>
            {credits === 999999 ? "∞" : credits.toLocaleString()}
          </p>
          <p className="text-xs mb-3" style={{ color: "var(--muted-foreground)" }}>Credits remaining</p>

          {/* Progress bar */}
          {credits !== 999999 && (
            <div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--muted)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: pct < 20
                      ? "var(--destructive)"
                      : pct < 50
                      ? "var(--chart-1)"
                      : "var(--primary)",
                  }}
                />
              </div>
              <p className="text-[10px] mt-1" style={{ color: "var(--muted-foreground)" }}>
                {pct}% of {planMax.toLocaleString()} plan credits
              </p>
            </div>
          )}
        </div>

        {/* Widget 2 — Current Plan */}
        <div
          className="rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
          style={{ background: "var(--card)", border: `1px solid ${planColor === "var(--muted-foreground)" ? "var(--border)" : `color-mix(in oklch, ${planColor} 40%, var(--border))`}` }}
          onClick={() => setShowModal(true)}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: `color-mix(in oklch, ${planColor} 15%, transparent)`, border: `1px solid color-mix(in oklch, ${planColor} 30%, transparent)` }}
            >
              <PlanIcon className="h-4 w-4" style={{ color: planColor }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Plan</span>
          </div>
          <p className="text-2xl font-black mb-1" style={{ color: planColor }}>
            {PLAN_LABELS[plan]}
          </p>
          <div
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold"
            style={{ background: `color-mix(in oklch, ${planColor} 15%, transparent)`, color: planColor }}
          >
            Tap to Upgrade
          </div>
        </div>

        {/* Widget 3 — Credits Used */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "color-mix(in oklch, var(--chart-2) 15%, transparent)", border: "1px solid color-mix(in oklch, var(--chart-2) 30%, transparent)" }}
            >
              <TrendingUp className="h-4 w-4" style={{ color: "var(--chart-2)" }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Used</span>
          </div>
          <p className="text-3xl font-black mb-0.5" style={{ color: "var(--card-foreground)" }}>
            {creditsUsed.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Credits spent total</p>
        </div>

        {/* Widget 4 — Total Scans */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: "color-mix(in oklch, var(--chart-1) 15%, transparent)", border: "1px solid color-mix(in oklch, var(--chart-1) 30%, transparent)" }}
            >
              <Activity className="h-4 w-4" style={{ color: "var(--chart-1)" }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted-foreground)" }}>Scans</span>
          </div>
          <p className="text-3xl font-black mb-0.5" style={{ color: "var(--card-foreground)" }}>
            {totalScans.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>Total scans completed</p>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showModal && (
        <UpgradeModal
          currentPlan={plan}
          currentCredits={credits}
          onClose={() => setShowModal(false)}
          onSuccess={handleUpgradeSuccess}
        />
      )}
    </>
  );
}
