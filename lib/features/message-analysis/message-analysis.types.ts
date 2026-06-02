/**
 * lib/features/message-analysis/message-analysis.types.ts
 *
 * Shared types + Zod schemas for the Fraud & Scam Message Analyzer.
 */

import { z } from "zod";

// ── Zod schemas ─────────────────────────────────────────────────────────────

export const MessageAnalysisResultSchema = z.object({
  scamProbability:  z.number().min(0).max(100),
  riskLevel:        z.enum(["Low", "Medium", "High"]),
  threats:          z.array(z.string()),
  explanation:      z.string(),
  recommendations:  z.array(z.string()),
});

export type MessageAnalysisResult = z.infer<typeof MessageAnalysisResultSchema>;

export const MessageAnalysisRequestSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(10_000, "Message must be under 10,000 characters."),
});

export type MessageAnalysisRequest = z.infer<typeof MessageAnalysisRequestSchema>;
