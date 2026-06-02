/**
 * lib/features/call-analysis/threat-classifier.ts
 *
 * ThreatClassifier — builds the Groq prompt for call analysis
 * and parses the JSON output into typed CallAnalysisResult.
 */

import { groqChat } from "@/lib/ai/groq.client";
import { CallAnalysisResultSchema, type CallAnalysisResult } from "./call-analysis.types";

function buildCallAnalysisPrompt(transcript: string): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `You are an expert fraud investigator and call analytics AI.
Analyse phone call transcripts and identify fraud, scam, and social engineering tactics.

You MUST respond with ONLY valid JSON — no markdown, no prose outside the JSON.

Return EXACTLY this structure:
{
  "riskScore": <integer 0-100>,
  "riskLevel": <"Low" | "Medium" | "High">,
  "threats": <array of strings, max 8 items>,
  "explanation": <string, 2-5 sentences>,
  "recommendations": <array of 2-5 action strings>
}

Fraud patterns to detect:
- Social engineering / psychological manipulation
- OTP or verification code extraction
- Financial fraud (bank transfers, UPI, crypto)
- Identity theft attempts (PAN, Aadhaar, account details)
- Urgency or fear tactics
- Authority impersonation (police, bank, government)
- Fake technical support scams
- Voice impersonation indicators

Risk scoring:
- 0–30  → Low (normal conversation, minor concerns)
- 31–65 → Medium (suspicious, warrants review)
- 66–100→ High (clear fraud / scam indicators)`;

  const userPrompt = `Analyse the following phone call transcript for fraud indicators:

---TRANSCRIPT START---
${transcript}
---TRANSCRIPT END---

Return ONLY the JSON object.`;

  return { systemPrompt, userPrompt };
}

function parseCallAnalysisResponse(
  rawJson: string,
  transcript: string
): CallAnalysisResult {
  const cleaned = rawJson
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`LLM returned non-JSON. Raw: ${rawJson.slice(0, 200)}`);
  }

  // Merge transcript into parsed object for final validation
  return CallAnalysisResultSchema.parse({ ...(parsed as object), transcript });
}

/**
 * Classify threats in a call transcript using Llama via Groq.
 * Must be called server-side only.
 */
export async function classifyCallThreats(
  transcript: string
): Promise<CallAnalysisResult> {
  const { systemPrompt, userPrompt } = buildCallAnalysisPrompt(transcript);

  const rawJson = await groqChat({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.05,
    maxTokens: 1024,
    expectJson: true,
  });

  return parseCallAnalysisResponse(rawJson, transcript);
}
