/**
 * lib/features/voice-detection/voice-detection.service.ts
 *
 * VoiceDetectionService — converts Reality Defender raw response
 * into a typed VoiceDetectionResult.
 *
 * Architecture: pure service, no I/O, no HTTP calls here.
 * Depends on reality-defender.client for API interaction.
 */

import { analyzeVoiceWithRD, type RDMediaResult } from "@/lib/ai/reality-defender.client";
import {
  VoiceDetectionResultSchema,
  type VoiceDetectionResult,
} from "./voice-detection.types";

// ── Risk mapping ─────────────────────────────────────────────────────────────
function scoreToRisk(score: number): "Low" | "Medium" | "High" {
  if (score < 35) return "Low";
  if (score < 65) return "Medium";
  return "High";
}

// ── Parse RD result into typed output ─────────────────────────────────────
function parseRDResult(raw: RDMediaResult): VoiceDetectionResult {
  // overall_score: 0 = authentic, 100 = fake
  const fakeScore = raw.overall_score ?? 50;
  const authenticityScore = Math.round(100 - fakeScore);
  const riskLevel = scoreToRisk(fakeScore);
  const verdict: VoiceDetectionResult["verdict"] =
    fakeScore >= 50 ? "Likely AI Generated" : "Likely Real";

  // Derive confidence from how far from 50 the score is
  const confidence = Math.round(Math.abs(fakeScore - 50) * 2);

  let explanation = "";
  if (verdict === "Likely AI Generated") {
    explanation = `Our analysis detected patterns consistent with AI-generated or cloned voice content (confidence: ${confidence}%). The voice shows ${riskLevel.toLowerCase()} risk indicators of synthetic origin.`;
  } else {
    explanation = `The audio appears to be authentic human speech (confidence: ${confidence}%). No significant AI-generation artefacts were detected.`;
  }

  return VoiceDetectionResultSchema.parse({
    authenticityScore,
    confidence,
    verdict,
    riskLevel,
    explanation,
  });
}

// ── Fallback when RD API key is missing — simulate for dev ─────────────────
function mockResult(): VoiceDetectionResult {
  return {
    authenticityScore: 72,
    confidence: 44,
    verdict: "Likely Real",
    riskLevel: "Low",
    explanation:
      "Demo mode: Reality Defender API key not configured. Add REALITY_DEFENDER_API_KEY to .env.local to enable live analysis.",
  };
}

// ── Main service function ────────────────────────────────────────────────────
export async function analyzeVoice(
  file: File | Blob,
  filename: string
): Promise<VoiceDetectionResult> {
  // Gracefully fall back to mock when API key is absent
  if (!process.env.REALITY_DEFENDER_API_KEY) {
    console.warn("[VoiceDetectionService] No REALITY_DEFENDER_API_KEY — using mock result");
    return mockResult();
  }

  const raw = await analyzeVoiceWithRD(file, filename);

  if (raw.status === "ERROR") {
    throw new Error("Reality Defender returned an error status for this file.");
  }

  return parseRDResult(raw);
}
