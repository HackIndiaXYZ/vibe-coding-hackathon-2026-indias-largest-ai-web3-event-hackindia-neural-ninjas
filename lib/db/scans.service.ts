/**
 * lib/db/scans.service.ts
 *
 * Server-side functions for creating and reading scan records.
 * Must only be called from Server Components, Server Actions, or Route Handlers.
 */

import { createClient } from "@/lib/supabase/server";
import type { Scan, ScanType, RiskLevel } from "./types";

export interface SaveScanInput {
  userId:          string;
  scanType:        ScanType;
  inputSummary?:   string;
  result:          Record<string, unknown>;
  confidenceScore?: number;
  riskLevel?:      RiskLevel;
  isThreat:        boolean;
  creditsUsed:     number;
}

// ── Save a completed scan ────────────────────────────────────
export async function saveScan(input: SaveScanInput): Promise<Scan | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scans")
    .insert({
      user_id:          input.userId,
      scan_type:        input.scanType,
      input_summary:    input.inputSummary ?? null,
      result:           input.result,
      confidence_score: input.confidenceScore ?? null,
      risk_level:       input.riskLevel ?? null,
      is_threat:        input.isThreat,
      credits_used:     input.creditsUsed,
    })
    .select()
    .single();

  if (error) {
    console.error("[saveScan] Failed to save scan:", error.message);
    return null;
  }

  return data as Scan;
}

// ── List scans for the authenticated user ────────────────────
export interface ListScansOptions {
  scanType?: ScanType;
  limit?:    number;
  offset?:   number;
  orderBy?:  "newest" | "oldest";
}

export interface ListScansResult {
  scans: Scan[];
  total: number;
}

export async function listScans(opts: ListScansOptions = {}): Promise<ListScansResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { scans: [], total: 0 };

  const { limit = 10, offset = 0, orderBy = "newest", scanType } = opts;
  const ascending = orderBy === "oldest";

  let query = supabase
    .from("scans")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending })
    .range(offset, offset + limit - 1);

  if (scanType) {
    query = query.eq("scan_type", scanType);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("[listScans]", error.message);
    return { scans: [], total: 0 };
  }

  return { scans: (data ?? []) as Scan[], total: count ?? 0 };
}

// ── Analytics counts for the dashboard ──────────────────────
export interface ScanAnalytics {
  totalScans:      number;
  voiceScans:      number;
  messageScans:    number;
  callScans:       number;
  threatsDetected: number;
  creditsUsed:     number;
}

export async function getScanAnalytics(): Promise<ScanAnalytics> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return {
    totalScans: 0, voiceScans: 0, messageScans: 0,
    callScans: 0, threatsDetected: 0, creditsUsed: 0,
  };

  const { data, error } = await supabase
    .from("scans")
    .select("scan_type, is_threat, credits_used")
    .eq("user_id", user.id);

  if (error || !data) return {
    totalScans: 0, voiceScans: 0, messageScans: 0,
    callScans: 0, threatsDetected: 0, creditsUsed: 0,
  };

  return {
    totalScans:      data.length,
    voiceScans:      data.filter((s) => s.scan_type === "voice").length,
    messageScans:    data.filter((s) => s.scan_type === "message").length,
    callScans:       data.filter((s) => s.scan_type === "call").length,
    threatsDetected: data.filter((s) => s.is_threat).length,
    creditsUsed:     data.reduce((sum, s) => sum + (s.credits_used ?? 0), 0),
  };
}
