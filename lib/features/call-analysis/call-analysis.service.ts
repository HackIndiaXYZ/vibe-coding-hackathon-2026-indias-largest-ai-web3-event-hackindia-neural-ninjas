/**
 * lib/features/call-analysis/call-analysis.service.ts
 *
 * CallAnalysisService — orchestrates transcription + threat classification.
 * This is the single entry point for the call analysis feature.
 */

import { transcribeCallRecording } from "./transcription.service";
import { classifyCallThreats } from "./threat-classifier";
import type { CallAnalysisResult } from "./call-analysis.types";

/**
 * Analyse a call recording end-to-end:
 * 1. Transcribe with Whisper
 * 2. Classify threats with Llama
 *
 * Must be called server-side only.
 */
export async function analyzeCall(
  file: File | Blob,
  filename: string
): Promise<CallAnalysisResult> {
  // Step 1: Transcription (with caching)
  const { transcript } = await transcribeCallRecording(file, filename);

  if (!transcript || transcript.trim().length < 20) {
    throw new Error(
      "The audio file could not be transcribed or contains too little speech. Please upload a clear call recording."
    );
  }

  // Step 2: Threat analysis
  const result = await classifyCallThreats(transcript);

  return result;
}
