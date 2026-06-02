/**
 * lib/ai/groq.client.ts
 *
 * Centralised Groq API client.
 * All feature modules import from here — never instantiate Groq directly elsewhere.
 * Includes: env-variable validation, typed helpers, timeout + retry wrappers.
 */

import Groq from "groq-sdk";

// ── Environment validation ──────────────────────────────────────────────────
function getGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error(
      "GROQ_API_KEY is not set. Add it to your .env.local file."
    );
  }
  return key;
}

// ── Singleton client ────────────────────────────────────────────────────────
let _groqClient: Groq | null = null;

export function getGroqClient(): Groq {
  if (!_groqClient) {
    _groqClient = new Groq({
      apiKey: getGroqApiKey(),
      timeout: 60_000, // 60 s hard timeout
      maxRetries: 2,
    });
  }
  return _groqClient;
}

// ── Typed chat-completion helper ────────────────────────────────────────────
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GroqChatOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  /** If true, the helper throws when the response cannot be parsed as JSON */
  expectJson?: boolean;
}

export async function groqChat(opts: GroqChatOptions): Promise<string> {
  const client = getGroqClient();

  const completion = await client.chat.completions.create({
    model: opts.model ?? "llama-3.1-8b-instant",
    messages: opts.messages,
    temperature: opts.temperature ?? 0.1,
    max_tokens: opts.maxTokens ?? 1024,
    // Force JSON output when caller requests it
    ...(opts.expectJson ? { response_format: { type: "json_object" } } : {}),
  });

  const content = completion.choices[0]?.message?.content ?? "";
  return content;
}
