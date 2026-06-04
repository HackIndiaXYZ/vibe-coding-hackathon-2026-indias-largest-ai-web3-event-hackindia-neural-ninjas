/**
 * app/api/analyze/message/route.ts
 *
 * POST /api/analyze/message
 * Body: { message: string }
 * Returns MessageAnalysisResult as JSON.
 *
 * Credit system:
 * - Costs 2 credits
 * - Checked before analysis
 * - Deducted + saved to history after success
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeMessage } from "@/lib/features/message-analysis/message-analyzer.service";
import { MessageAnalysisRequestSchema } from "@/lib/features/message-analysis/message-analysis.types";
import { deductCredits, getProfile } from "@/lib/db/profile.service";
import { saveScan } from "@/lib/db/scans.service";
import { SCAN_CREDITS } from "@/lib/db/types";

const COST = SCAN_CREDITS.message; // 2

export async function POST(req: NextRequest) {
  // ── Auth guard ─────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ── Credit pre-check ───────────────────────────────────────
  const profile = await getProfile();
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  if (profile.credits < COST) {
    return NextResponse.json(
      { error: `Insufficient credits. Need ${COST}, have ${profile.credits}.`, insufficientCredits: true, required: COST, available: profile.credits },
      { status: 402 }
    );
  }

  // ── Parse + validate body ──────────────────────────────────
  let body: unknown;
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const parsed = MessageAnalysisRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 422 }
    );
  }

  // ── Analyse ────────────────────────────────────────────────
  try {
    const result = await analyzeMessage(parsed.data.message);

    // ── Deduct credits ─────────────────────────────────────
    const deduction = await deductCredits(user.id, COST);
    if (!deduction.ok) {
      return NextResponse.json({ error: deduction.error }, { status: 402 });
    }

    // ── Save to history ────────────────────────────────────
    const summary = parsed.data.message.slice(0, 120) + (parsed.data.message.length > 120 ? "…" : "");
    await saveScan({
      userId:          user.id,
      scanType:        "message",
      inputSummary:    summary,
      result:          result as unknown as Record<string, unknown>,
      confidenceScore: result.scamProbability,
      riskLevel:       result.riskLevel,
      isThreat:        result.riskLevel === "High",
      creditsUsed:     COST,
    });

    return NextResponse.json({
      success: true,
      data: result,
      creditsUsed:      COST,
      creditsRemaining: deduction.remaining,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    console.error("[POST /api/analyze/message]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
