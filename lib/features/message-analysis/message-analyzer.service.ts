/**
 * lib/features/message-analysis/message-analyzer.service.ts
 *
 * MessageAnalyzerService — orchestrates Groq + prompt + parsing
 * for the Fraud & Scam Message Analyzer feature.
 */

import { groqChat } from "@/lib/ai/groq.client";
import { buildScamAnalysisPrompt } from "./prompt-builder";
import { parseAnalysisResponse } from "./risk-assessment.engine";
import type { MessageAnalysisResult } from "./message-analysis.types";

/**
 * Analyse a suspicious text message for scam/fraud indicators.
 * Must be called server-side only.
 */
export async function analyzeMessage(
  message: string
): Promise<MessageAnalysisResult> {
  const { systemPrompt, userPrompt } = buildScamAnalysisPrompt(message);

  const rawJson = await groqChat({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.05, // Very low — we want deterministic JSON
    maxTokens: 1024,
    expectJson: true,
  });

  return parseAnalysisResponse(rawJson);
}
