/**
 * lib/features/call-analysis/call-analysis.types.ts
 *
 * Shared types + Zod schemas for the Fraud Call Analyzer feature.
 */

import { z } from "zod";

// ── Zod schemas ─────────────────────────────────────────────────────────────

export const CallAnalysisResultSchema = z.object({
  transcript:      z.string(),
  riskScore:       z.number().min(0).max(100),
  riskLevel:       z.enum(["Low", "Medium", "High"]),
  threats:         z.array(z.string()),
  explanation:     z.string(),
  recommendations: z.array(z.string()),
});

export type CallAnalysisResult = z.infer<typeof CallAnalysisResultSchema>;

export const CallUploadRequestSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z
    .string()
    .refine(
      (t) =>
        [
          "audio/mpeg",
          "audio/wav",
          "audio/x-wav",
          "audio/mp4",
          "audio/x-m4a",
          "audio/m4a",
          "audio/ogg",
          "audio/webm",
        ].includes(t),
      { message: "Unsupported audio format." }
    ),
  fileSizeBytes: z
    .number()
    .max(25 * 1024 * 1024, "File must be ≤ 25 MB"),
});

export type CallUploadRequest = z.infer<typeof CallUploadRequestSchema>;
