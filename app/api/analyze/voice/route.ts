/**
 * app/api/analyze/voice/route.ts
 *
 * POST /api/analyze/voice
 * Accepts multipart/form-data with a single "audio" field.
 * Returns VoiceDetectionResult as JSON.
 *
 * Credit system:
 * - Costs 5 credits
 * - Checked before analysis
 * - Deducted + saved to history after success
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeVoice } from "@/lib/features/voice-detection/voice-detection.service";
import { VoiceUploadRequestSchema } from "@/lib/features/voice-detection/voice-detection.types";
import { deductCredits, getProfile } from "@/lib/db/profile.service";
import { saveScan } from "@/lib/db/scans.service";
import { SCAN_CREDITS } from "@/lib/db/types";

const MAX_BYTES = 25 * 1024 * 1024;
const COST = SCAN_CREDITS.voice; // 5

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

  // ── Parse multipart form ───────────────────────────────────
  let formData: FormData;
  try { formData = await req.formData(); }
  catch { return NextResponse.json({ error: "Invalid form data" }, { status: 400 }); }

  const audioFile = formData.get("audio");
  if (!(audioFile instanceof File)) {
    return NextResponse.json({ error: "Missing 'audio' file field" }, { status: 400 });
  }

  // ── Validate metadata ──────────────────────────────────────
  const metaResult = VoiceUploadRequestSchema.safeParse({
    filename:      audioFile.name,
    mimeType:      audioFile.type,
    fileSizeBytes: audioFile.size,
  });
  if (!metaResult.success) {
    return NextResponse.json(
      { error: metaResult.error.issues[0]?.message ?? "Invalid file" },
      { status: 422 }
    );
  }
  if (audioFile.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 25 MB limit" }, { status: 413 });
  }

  // ── Analyse ────────────────────────────────────────────────
  try {
    const result = await analyzeVoice(audioFile, audioFile.name);

    // ── Deduct credits ─────────────────────────────────────
    const deduction = await deductCredits(user.id, COST);
    if (!deduction.ok) {
      return NextResponse.json({ error: deduction.error }, { status: 402 });
    }

    // ── Save to history ────────────────────────────────────
    await saveScan({
      userId:          user.id,
      scanType:        "voice",
      inputSummary:    audioFile.name,
      result:          result as unknown as Record<string, unknown>,
      confidenceScore: result.confidence,
      riskLevel:       result.riskLevel,
      isThreat:        result.verdict === "Likely AI Generated",
      creditsUsed:     COST,
    });

    return NextResponse.json({
      success: true,
      data: result,
      creditsUsed:     COST,
      creditsRemaining: deduction.remaining,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    console.error("[POST /api/analyze/voice]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
