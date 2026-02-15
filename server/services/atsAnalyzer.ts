import { GeminiAnalyzer } from "./geminiAnalyzer.js";
import type { ProcessedResume, AtsResult } from "../types/index.js";
import { cleanAndParseJson } from "../utils/jsonUtils.js";

const gemini = new GeminiAnalyzer();

/**
 * Analyzes a resume against a job description from an ATS perspective.
 *
 * This function now uses the Gemini API to provide a more nuanced analysis
 * of the resume against the job description.
 */
export async function analyzeWithATS(
  resume: ProcessedResume
): Promise<AtsResult> {
  const prompt = `
    You are an expert ATS (Applicant Tracking System) reviewer. Your task is to analyze the following resume and return a detailed score breakdown in JSON format. You will evaluate it on general ATS-friendliness without a specific job description.

    **Resume Content:**
    ---
    ${resume.fullText}
    ---

    **Instructions:**
    1.  **Keyword Score (0-100):** Calculate a score based on the presence of common keywords and action verbs relevant to the candidate's likely field.
    2.  **Clarity & Conciseness (0-100):** Assess how clear and concise the resume is.
    3.  **Formatting Score (0-100):** Evaluate the resume's formatting for ATS-friendliness. Penalize for complex layouts, images, and non-standard fonts.
    4.  **Overall Score (0-100):** Provide an overall score, which should be a weighted average of the above scores.
    5.  **Suggestions (string[]):** Provide a list of actionable suggestions for the candidate to improve their resume for general ATS compatibility.

    **Output Format (JSON only):**
    {
      "keywordMatch": {
        "score": <number>,
        "explanation": "<string>"
      },
      "relevance": {
        "score": <number>,
        "explanation": "<string>"
      },
      "formatting": {
        "score": <number>,
        "explanation": "<string>"
      },
      "overall": {
        "score": <number>,
        "explanation": "<string>"
      },
      "suggestions": ["<string>", "<string>", ...]
    }
  `;

  try {
    const response = await gemini.generateText(prompt);
    const analysis = cleanAndParseJson(response);
    return analysis;
  } catch (error) {
    console.error("Error analyzing with Gemini-powered ATS:", error);
    throw new Error("Failed to get ATS analysis from Gemini.");
  }
}
