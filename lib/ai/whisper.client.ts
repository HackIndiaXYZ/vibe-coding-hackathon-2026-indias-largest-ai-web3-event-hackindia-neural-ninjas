/**
 * lib/ai/whisper.client.ts
 *
 * Whisper transcription via Groq's audio API (whisper-large-v3-turbo).
 * Accepts a File / Blob / Buffer and returns the raw transcript string.
 */

import { getGroqClient } from "./groq.client";

export interface TranscriptionOptions {
  /** Audio file as a File or Blob */
  file: File | Blob;
  /** Original filename with extension (needed for MIME detection) */
  filename: string;
  language?: string;
}

export interface TranscriptionResult {
  transcript: string;
  duration?: number;
}

/**
 * Transcribe audio using Groq's whisper-large-v3-turbo.
 * Must be called server-side only.
 */
export async function transcribeAudio(
  opts: TranscriptionOptions
): Promise<TranscriptionResult> {
  const client = getGroqClient();

  // Groq SDK expects a File-like object with a name property
  const fileWithName =
    opts.file instanceof File
      ? opts.file
      : new File([opts.file], opts.filename, { type: opts.file.type });

  const response = await client.audio.transcriptions.create({
    file: fileWithName,
    model: "whisper-large-v3-turbo",
    language: opts.language ?? "en",
    response_format: "verbose_json",
  });

  return {
    transcript: response.text ?? "",
    duration: (response as { duration?: number }).duration,
  };
}
