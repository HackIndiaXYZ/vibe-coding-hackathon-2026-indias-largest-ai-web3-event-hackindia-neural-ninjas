/**
 * app/api/analyze/voice/route.ts
 *
 * POST /api/analyze/voice
 * Accepts multipart/form-data with a single "audio" field.
 * Returns VoiceDetectionResult as JSON.
 *
 * Security:
 * - Auth required (Supabase session cookie)
 * - File size ≤ 25 MB
 * - MIME type whitelist
 * - No API keys exposed to client
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeVoice } from "@/lib/features/voice-detection/voice-detection.service";
import { VoiceUploadRequestSchema } from "@/lib/features/voice-detection/voice-detection.types";

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  // ── Auth guard ────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse multipart form ─────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const audioFile = formData.get("audio");
  if (!(audioFile instanceof File)) {
    return NextResponse.json(
      { error: "Missing 'audio' file field in form data" },
      { status: 400 }
    );
  }

  // ── Validate metadata ────────────────────────────────────────────────────
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

  // ── Analyse ───────────────────────────────────────────────────────────────
  try {
    const result = await analyzeVoice(audioFile, audioFile.name);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    console.error("[POST /api/analyze/voice]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
