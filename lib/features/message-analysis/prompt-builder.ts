/**
 * lib/features/message-analysis/prompt-builder.ts
 *
 * Centralised prompt construction for message/scam analysis.
 * Keeping prompt engineering separate from service logic makes
 * A/B testing and iteration much easier.
 */

/**
 * Returns a strict JSON-only system prompt for scam detection.
 * The model is instructed to NEVER output prose — only valid JSON.
 */
export function buildScamAnalysisPrompt(message: string): {
  systemPrompt: string;
  userPrompt: string;
} {
  const systemPrompt = `You are an expert cybersecurity analyst specialising in fraud, scam, and phishing detection. 
Your task is to analyse suspicious messages and return a structured risk assessment.

You MUST respond with ONLY valid JSON — no markdown fences, no prose, no explanation outside the JSON object.

The JSON object must have EXACTLY these fields:
{
  "scamProbability": <integer 0-100>,
  "riskLevel": <"Low" | "Medium" | "High">,
  "threats": <array of strings, max 8 items, each ≤ 80 chars>,
  "explanation": <string, 2-4 sentences, plain English>,
  "recommendations": <array of 2-5 action strings>
}

Scoring guide:
- 0–30   → Low risk (benign or very unlikely scam)
- 31–65  → Medium risk (suspicious, warrants caution)
- 66–100 → High risk (very likely scam/phishing)

Threat categories to detect (include only those present):
- Phishing link
- OTP extraction attempt
- Fake bank alert
- Fake job offer
- Cryptocurrency scam
- Investment fraud
- Urgency manipulation
- Impersonation attempt
- Lottery / prize scam
- Malware link`;

  const userPrompt = `Analyse the following message for fraud and scam indicators:

---
${message}
---

Return ONLY the JSON object.`;

  return { systemPrompt, userPrompt };
}
