/**
 * lib/features/call-analysis/transcription.service.ts
 *
 * TranscriptionService — wraps the Whisper client.
 * Implements a simple in-memory cache to avoid re-transcribing
 * the same file (keyed by filename + size).
 */

import { transcribeAudio, type TranscriptionResult } from "@/lib/ai/whisper.client";

// Simple LRU-free in-memory cache (per-process lifetime)
const transcriptCache = new Map<string, TranscriptionResult>();

function cacheKey(filename: string, sizeBytes: number): string {
  return `${filename}::${sizeBytes}`;
}

export async function transcribeCallRecording(
  file: File | Blob,
  filename: string
): Promise<TranscriptionResult> {
  const size = file.size;
  const key = cacheKey(filename, size);

  if (transcriptCache.has(key)) {
    console.info("[TranscriptionService] Cache hit:", key);
    return transcriptCache.get(key)!;
  }

  const result = await transcribeAudio({ file, filename });
  transcriptCache.set(key, result);

  // Evict oldest entries if cache grows large
  if (transcriptCache.size > 50) {
    const firstKey = transcriptCache.keys().next().value;
    if (firstKey) transcriptCache.delete(firstKey);
  }

  return result;
}
