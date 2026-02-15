import { GeminiAnalyzer } from "./geminiAnalyzer.js";
import type {
  ProcessedResume,
  InterviewAnalysisResult,
} from "../types/index.js";

const gemini = new GeminiAnalyzer();

/**
 * Uses Gemini to analyze a resume and predict potential reasons for
 * interview failure at different stages, providing targeted advice.
 */
export async function analyzeInterviewReadiness(
  resume: ProcessedResume
): Promise<InterviewAnalysisResult> {
  const prompt = `
    You are a senior hiring manager and interview coach. Based on the provided resume, your task is to anticipate potential reasons why this candidate might fail at different interview stages.

    **Candidate's Resume:**
    ---
    ${resume.fullText}
    ---

    **Instructions:**
    For each interview stage (Screening, Technical, Behavioral), identify the top 2-3 most likely failure points based *only* on the information in the resume. Provide a brief explanation and a concrete piece of advice for each point.

    **Output Format (JSON only):**
    {
      "screening": [
        {
          "reason": "<string>",
          "advice": "<string>"
        },
        ...
      ],
      "technical": [
        {
          "reason": "<string>",
          "advice": "<string>"
        },
        ...
      ],
      "behavioral": [
        {
          "reason": "<string>",
          "advice": "<string>"
        },
        ...
      ]
    }
  `;

  try {
    const response = await gemini.generateText(prompt);
    const cleanedResponse = response.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(cleanedResponse);
    return analysis;
  } catch (error) {
    console.error("Error analyzing interview readiness with Gemini:", error);
    throw new Error("Failed to get interview analysis from Gemini.");
  }
}
