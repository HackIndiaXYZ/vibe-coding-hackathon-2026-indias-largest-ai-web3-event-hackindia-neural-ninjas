/**
 * lib/db/profile.service.ts
 *
 * Server-side functions for reading and mutating user profiles.
 * All functions use the server-side Supabase client (cookie auth).
 * Must only be called from Server Components, Server Actions, or Route Handlers.
 */

import { createClient } from "@/lib/supabase/server";
import type { Profile, Plan } from "./types";
import { PLAN_CREDITS } from "./types";

// ── Get own profile (upsert on first access) ──────────────────
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Try to fetch existing profile first
  const { data: existing, error: fetchErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (existing && !fetchErr) {
    return existing as Profile;
  }

  // 2. Profile doesn't exist — create it (first Google login, trigger may have missed)
  const { data: created, error: createErr } = await supabase
    .from("profiles")
    .insert({
      id:         user.id,
      email:      user.email,
      full_name:  user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
      credits:    100,
      plan:       "free",
    })
    .select()
    .single();

  if (createErr) {
    // Race condition: another request created it — try fetching again
    const { data: retry } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    return retry as Profile | null;
  }

  return created as Profile;
}

// ── Deduct credits (server-side) ────────────────────────────
export async function deductCredits(
  userId: string,
  amount: number
): Promise<{ ok: boolean; remaining: number; error?: string }> {
  const supabase = await createClient();

  // Read current credits
  const { data: profile, error: readErr } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single();

  if (readErr || !profile) {
    return { ok: false, remaining: 0, error: "Profile not found" };
  }

  const current = (profile as { credits: number }).credits;

  // Enterprise = unlimited (999999)
  if (current >= 999999) {
    return { ok: true, remaining: 999999 };
  }

  if (current < amount) {
    return {
      ok: false,
      remaining: current,
      error: `Insufficient credits. Need ${amount}, have ${current}.`,
    };
  }

  const newCredits = current - amount;
  const { error: updateErr } = await supabase
    .from("profiles")
    .update({ credits: newCredits })
    .eq("id", userId);

  if (updateErr) {
    return { ok: false, remaining: current, error: "Failed to deduct credits" };
  }

  return { ok: true, remaining: newCredits };
}

// ── Upgrade plan (simulation) ────────────────────────────────
export async function upgradePlan(
  userId: string,
  plan: Plan
): Promise<{ ok: boolean; credits: number; error?: string }> {
  const supabase = await createClient();
  const newCredits = PLAN_CREDITS[plan];

  const { error } = await supabase
    .from("profiles")
    .update({ plan, credits: newCredits })
    .eq("id", userId);

  if (error) {
    return { ok: false, credits: 0, error: "Failed to upgrade plan" };
  }

  return { ok: true, credits: newCredits };
}
