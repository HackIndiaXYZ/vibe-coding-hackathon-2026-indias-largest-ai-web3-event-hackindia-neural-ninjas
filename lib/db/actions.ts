"use server";

/**
 * lib/db/actions.ts
 *
 * Next.js Server Actions for profile mutations.
 * These are called directly from Client Components using the `action` prop
 * or via `startTransition(async () => { await action() })`.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { upgradePlan as dbUpgradePlan } from "./profile.service";
import type { Plan } from "./types";

// ── Upgrade user plan (simulated payment) ───────────────────
export async function upgradePlanAction(
  plan: Plan
): Promise<{ ok: boolean; credits: number; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { ok: false, credits: 0, error: "Not authenticated" };

  const result = await dbUpgradePlan(user.id, plan);

  if (result.ok) {
    // Revalidate all dashboard pages so they show fresh data
    revalidatePath("/dashboard", "layout");
  }

  return result;
}
