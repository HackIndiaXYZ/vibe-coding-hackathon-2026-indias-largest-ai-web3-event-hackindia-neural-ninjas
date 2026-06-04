"use client";

/**
 * components/dashboard/upgrade-modal.tsx
 *
 * SaaS-style upgrade modal with plan cards, simulated payment,
 * and success animation. Calls the Server Action upgradePlanAction.
 */

import { useState, useTransition } from "react";
import { Check, X, Zap, Crown, Building2, Loader2, Sparkles } from "lucide-react";
import { upgradePlanAction } from "@/lib/db/actions";
import type { Plan, PlanConfig } from "@/lib/db/types";
import { PLANS } from "@/lib/db/types";

interface UpgradeModalProps {
  currentPlan: Plan;
  currentCredits: number;
  onClose: () => void;
  onSuccess: (plan: Plan, credits: number) => void;
}

const PLAN_ICONS: Record<Plan, React.ElementType> = {
  free:       Zap,
  pro:        Crown,
  enterprise: Building2,
};

export function UpgradeModal({ currentPlan, currentCredits, onClose, onSuccess }: UpgradeModalProps) {
  const [selected, setSelected] = useState<Plan | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpgrade(plan: Plan) {
    if (plan === currentPlan) return;
    setSelected(plan);
    setError(null);

    startTransition(async () => {
      const result = await upgradePlanAction(plan);
      if (result.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess(plan, result.credits);
          onClose();
        }, 2000);
      } else {
        setError(result.error ?? "Upgrade failed");
        setSelected(null);
      }
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "color-mix(in oklch, var(--foreground) 25%, transparent)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        {/* Header */}
        <div
          className="relative px-6 py-5 overflow-hidden"
          style={{ background: "color-mix(in oklch, var(--primary) 10%, var(--card))", borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="absolute -top-6 right-8 h-24 w-24 rounded-full blur-2xl opacity-30 pointer-events-none"
            style={{ background: "var(--primary)" }}
          />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4" style={{ color: "var(--primary)" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--primary)" }}>
                  Upgrade Plan
                </span>
              </div>
              <h2 className="text-xl font-black" style={{ color: "var(--card-foreground)" }}>
                Choose your protection tier
              </h2>
              <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
                Currently on <span className="font-semibold capitalize">{currentPlan}</span> · {currentCredits === 999999 ? "Unlimited" : currentCredits} credits remaining
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors"
              style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 gap-4">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-full"
              style={{ background: "color-mix(in oklch, var(--chart-2) 15%, transparent)", border: "2px solid var(--chart-2)" }}
            >
              <Check className="h-10 w-10" style={{ color: "var(--chart-2)" }} />
            </div>
            <div className="text-center">
              <p className="text-xl font-black" style={{ color: "var(--card-foreground)" }}>Plan upgraded successfully!</p>
              <p className="text-sm mt-1" style={{ color: "var(--muted-foreground)" }}>Your new credits are ready to use.</p>
            </div>
          </div>
        ) : (
          /* Plan cards */
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PLANS.map((plan) => {
              const Icon = PLAN_ICONS[plan.id];
              const isCurrent = plan.id === currentPlan;
              const isSelecting = selected === plan.id && isPending;

              return (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  Icon={Icon}
                  isCurrent={isCurrent}
                  isSelecting={isSelecting}
                  onSelect={() => handleUpgrade(plan.id)}
                  disabled={isPending || isCurrent}
                />
              );
            })}
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="mx-6 mb-4 rounded-xl px-4 py-3 text-sm"
            style={{ background: "color-mix(in oklch, var(--destructive) 10%, transparent)", color: "var(--destructive)", border: "1px solid color-mix(in oklch, var(--destructive) 30%, transparent)" }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Footer note */}
        {!success && (
          <div
            className="px-6 py-4 text-center text-xs"
            style={{ borderTop: "1px solid var(--border)", color: "var(--muted-foreground)" }}
          >
            🔒 This is a demo. No real payment is processed. Credits are applied instantly.
          </div>
        )}
      </div>
    </div>
  );
}

// ── Plan card sub-component ──────────────────────────────────
interface PlanCardProps {
  plan:        PlanConfig;
  Icon:        React.ElementType;
  isCurrent:   boolean;
  isSelecting: boolean;
  onSelect:    () => void;
  disabled:    boolean;
}

function PlanCard({ plan, Icon, isCurrent, isSelecting, onSelect, disabled }: PlanCardProps) {
  const accentColor = plan.id === "pro" ? "var(--primary)" : plan.id === "enterprise" ? "var(--chart-2)" : "var(--muted-foreground)";

  return (
    <div
      className="relative flex flex-col rounded-2xl p-5 transition-all duration-200"
      style={{
        background:  isCurrent ? `color-mix(in oklch, ${accentColor} 8%, var(--card))` : "var(--card)",
        border:      isCurrent ? `2px solid ${accentColor}` : plan.popular ? `1.5px solid color-mix(in oklch, ${accentColor} 50%, var(--border))` : "1px solid var(--border)",
        boxShadow:   plan.popular ? `0 0 24px color-mix(in oklch, ${accentColor} 15%, transparent)` : undefined,
      }}
    >
      {/* Badge */}
      {plan.badge && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-0.5 rounded-full"
          style={{ background: accentColor, color: "var(--card)" }}
        >
          {plan.badge}
        </span>
      )}
      {isCurrent && (
        <span
          className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold px-3 py-0.5 rounded-full"
          style={{ background: accentColor, color: "var(--card)" }}
        >
          Current Plan
        </span>
      )}

      {/* Icon + Name */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: `color-mix(in oklch, ${accentColor} 15%, transparent)`, border: `1px solid color-mix(in oklch, ${accentColor} 30%, transparent)` }}
        >
          <Icon className="h-4 w-4" style={{ color: accentColor }} />
        </div>
        <p className="text-sm font-black" style={{ color: "var(--card-foreground)" }}>{plan.name}</p>
      </div>

      {/* Price */}
      <p className="text-2xl font-black mb-1" style={{ color: accentColor }}>
        {plan.price}
      </p>
      <p className="text-xs mb-4" style={{ color: "var(--muted-foreground)" }}>
        {plan.credits === 999999 ? "Unlimited credits" : `${plan.credits.toLocaleString()} credits`}
      </p>

      {/* Features */}
      <ul className="space-y-1.5 flex-1 mb-5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
            <Check className="h-3.5 w-3.5 shrink-0" style={{ color: accentColor }} />
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={onSelect}
        disabled={disabled}
        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] disabled:scale-100"
        style={
          isCurrent
            ? { background: `color-mix(in oklch, ${accentColor} 15%, transparent)`, color: accentColor, border: `1px solid ${accentColor}` }
            : { background: accentColor, color: "var(--card)" }
        }
      >
        {isSelecting ? (
          <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing…</>
        ) : isCurrent ? (
          "Current Plan"
        ) : (
          `Upgrade to ${plan.name}`
        )}
      </button>
    </div>
  );
}
