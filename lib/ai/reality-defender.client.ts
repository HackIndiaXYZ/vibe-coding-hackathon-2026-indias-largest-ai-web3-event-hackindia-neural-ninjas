/**
 * lib/ai/reality-defender.client.ts
 *
 * Reality Defender API client for deepfake/voice-clone detection.
 * API docs: https://docs.realitydefender.com
 *
 * Workflow:
 *  1. POST /upload  → get media_id
 *  2. Poll GET /media/{media_id} until status != "PROCESSING"
 *  3. Return parsed result
 */

// ── Env validation ──────────────────────────────────────────────────────────
function getRDApiKey(): string {
  const key = process.env.REALITY_DEFENDER_API_KEY;
  if (!key) {
    throw new Error(
      "REALITY_DEFENDER_API_KEY is not set. Add it to your .env.local file."
    );
  }
  return key;
}

const RD_BASE = "https://api.realitydefender.com/api";

// ── Types ───────────────────────────────────────────────────────────────────

export interface RDUploadResponse {
  media_id: string;
  request_id?: string;
}

export interface RDPrediction {
  model_name: string;
  score: number;       // 0–100, higher = more likely fake
  verdict?: string;
}

export interface RDMediaResult {
  media_id: string;
  status: "PROCESSING" | "COMPLETED" | "ERROR" | string;
  predictions?: RDPrediction[];
  overall_score?: number; // 0–100
}

// ── Helpers ─────────────────────────────────────────────────────────────────

async function rdFetch(
  path: string,
  init: RequestInit
): Promise<Response> {
  const res = await fetch(`${RD_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getRDApiKey()}`,
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Reality Defender API error ${res.status}: ${body}`
    );
  }

  return res;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Upload an audio file to Reality Defender and return the media_id.
 */
export async function uploadAudioForAnalysis(
  file: File | Blob,
  filename: string
): Promise<string> {
  const form = new FormData();
  form.append(
    "file",
    file instanceof File ? file : new File([file], filename),
    filename
  );

  const res = await rdFetch("/upload", {
    method: "POST",
    body: form,
  });

  const data = (await res.json()) as RDUploadResponse;
  if (!data.media_id) {
    throw new Error("Reality Defender did not return a media_id");
  }

  return data.media_id;
}

/**
 * Poll for analysis results (max ~60 s).
 */
export async function pollForResults(
  mediaId: string,
  maxAttempts = 15,
  intervalMs = 4000
): Promise<RDMediaResult> {
  for (let i = 0; i < maxAttempts; i++) {
    const res = await rdFetch(`/media/${mediaId}`, { method: "GET" });
    const data = (await res.json()) as RDMediaResult;

    if (data.status !== "PROCESSING") {
      return data;
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }

  throw new Error(
    "Reality Defender analysis timed out after waiting ~60 s."
  );
}

/**
 * High-level helper: upload + poll + return.
 */
export async function analyzeVoiceWithRD(
  file: File | Blob,
  filename: string
): Promise<RDMediaResult> {
  const mediaId = await uploadAudioForAnalysis(file, filename);
  return pollForResults(mediaId);
}
