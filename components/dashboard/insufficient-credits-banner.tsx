"use client";

/**
 * components/dashboard/insufficient-credits-banner.tsx
 *
 * Shown inside scan panels when the API returns 402 with insufficientCredits.
 * Offers an inline upgrade CTA that opens the UpgradeModal.
 */

import { useState } from "react";
import { Zap, X } from "lucide-react";
import { UpgradeModal } from "./upgrade-modal";
import type { Plan } from "@/lib/db/types";

interface InsufficientCreditsBannerProps {
  required:       number;
  available:      number;
  currentPlan:    Plan;
  currentCredits: number;
  onUpgradeSuccess?: (plan: Plan, credits: number) => void;
}

export function InsufficientCreditsBanner({
  required,
  available,
  currentPlan,
  currentCredits,
  onUpgradeSuccess,
}: InsufficientCreditsBannerProps) {
  const [showModal, setShowModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <>
      <div
        className="rounded-2xl px-5 py-4 flex items-start gap-3"
        style={{
          background: "color-mix(in oklch, var(--chart-4) 10%, var(--card))",
          border:     "1px solid color-mix(in oklch, var(--chart-4) 35%, var(--border))",
        }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl mt-0.5"
          style={{ background: "color-mix(in oklch, var(--chart-4) 20%, transparent)" }}
        >
          <Zap className="h-4 w-4" style={{ color: "var(--chart-4)" }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold" style={{ color: "var(--card-foreground)" }}>
            Not enough credits
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            This scan requires <strong>{required}</strong> credits, but you only have <strong>{available}</strong>.
            Upgrade your plan to continue scanning.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all hover:scale-[1.03]"
            style={{ background: "var(--chart-4)", color: "var(--card)" }}
          >
            <Zap className="h-3.5 w-3.5" />
            Upgrade Plan
          </button>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-1.5 rounded-lg transition-colors"
          style={{ color: "var(--muted-foreground)" }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {showModal && (
        <UpgradeModal
          currentPlan={currentPlan}
          currentCredits={currentCredits}
          onClose={() => setShowModal(false)}
          onSuccess={(plan, credits) => {
            setShowModal(false);
            setDismissed(true);
            onUpgradeSuccess?.(plan, credits);
          }}
        />
      )}
    </>
  );
}
