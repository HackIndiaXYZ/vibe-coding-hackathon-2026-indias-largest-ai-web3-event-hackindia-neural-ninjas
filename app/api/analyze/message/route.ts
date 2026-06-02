/**
 * app/api/analyze/message/route.ts
 *
 * POST /api/analyze/message
 * Body: { message: string }
 * Returns MessageAnalysisResult as JSON.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeMessage } from "@/lib/features/message-analysis/message-analyzer.service";
import { MessageAnalysisRequestSchema } from "@/lib/features/message-analysis/message-analysis.types";

export async function POST(req: NextRequest) {
  // ── Auth guard ────────────────────────────────────────────────────────────
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse + validate body ─────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = MessageAnalysisRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 422 }
    );
  }

  // ── Analyse ───────────────────────────────────────────────────────────────
  try {
    const result = await analyzeMessage(parsed.data.message);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";
    console.error("[POST /api/analyze/message]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
