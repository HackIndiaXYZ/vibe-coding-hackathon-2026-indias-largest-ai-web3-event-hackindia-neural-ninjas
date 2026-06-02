/**
 * lib/features/message-analysis/risk-assessment.engine.ts
 *
 * RiskAssessmentEngine — post-processes raw LLM JSON output.
 * Validates schema, clamps numbers, and normalises arrays.
 */

import { MessageAnalysisResultSchema, type MessageAnalysisResult } from "./message-analysis.types";

/**
 * Parse and validate raw LLM JSON string into a typed MessageAnalysisResult.
 * Throws ZodError if the shape is invalid.
 */
export function parseAnalysisResponse(rawJson: string): MessageAnalysisResult {
  // Strip accidental markdown fences the model might still include
  const cleaned = rawJson
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(
      `LLM returned non-JSON response. Raw: ${rawJson.slice(0, 200)}`
    );
  }

  // Zod validates and coerces types
  return MessageAnalysisResultSchema.parse(parsed);
}
