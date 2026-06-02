/**
 * lib/features/voice-detection/voice-detection.types.ts
 *
 * Shared types + Zod schemas for the Deepfake Voice Checker feature.
 */

import { z } from "zod";

// ── Zod schemas ─────────────────────────────────────────────────────────────

export const VoiceDetectionResultSchema = z.object({
  authenticityScore: z.number().min(0).max(100),
  confidence:        z.number().min(0).max(100),
  verdict:           z.enum(["Likely Real", "Likely AI Generated"]),
  riskLevel:         z.enum(["Low", "Medium", "High"]),
  explanation:       z.string(),
});

export type VoiceDetectionResult = z.infer<typeof VoiceDetectionResultSchema>;

export const VoiceUploadRequestSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z
    .string()
    .refine(
      (t) => ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/x-m4a", "audio/m4a"].includes(t),
      { message: "Only MP3, WAV, and M4A files are supported." }
    ),
  fileSizeBytes: z
    .number()
    .max(25 * 1024 * 1024, "File must be ≤ 25 MB"),
});

export type VoiceUploadRequest = z.infer<typeof VoiceUploadRequestSchema>;
