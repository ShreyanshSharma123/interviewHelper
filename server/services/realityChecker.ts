import { GeminiAnalyzer } from "./geminiAnalyzer.js";
import type {
  ProcessedResume,
  JobLevel,
  RealityCheckResult,
} from "../types/index.js";

const gemini = new GeminiAnalyzer();

const LEVEL_LABELS: Record<JobLevel, string> = {
  entry: "Entry Level",
  mid: "Mid Level",
  senior: "Senior Level",
};

/**
 * Uses Gemini to compare the candidate's inferred level with a target role level
 * and return an honest readiness assessment with realistic next steps.
 */
export async function checkReality(
  resume: ProcessedResume,
  targetLevel: JobLevel
): Promise<RealityCheckResult> {
  const targetLabel = LEVEL_LABELS[targetLevel];

  const prompt = `
    You are a pragmatic and experienced tech recruiter. Your task is to perform a "reality check" for a candidate based on their resume and their target job level.

    **Candidate's Resume:**
    ---
    ${resume.fullText}
    ---

    **Candidate's Target Job Level:** ${targetLabel}

    **Instructions:**
    1.  **Infer Candidate's Level:** Based on the resume (years of experience, technologies used, project complexity, and role titles), infer the candidate's current professional level (e.g., Entry Level, Mid Level, Senior Level).
    2.  **Assess Readiness:** Compare the inferred level to the target level.
    3.  **Provide a Verdict:**
        *   **"Ready"**: The candidate appears qualified for the target level.
        *   **"Stretching"**: The candidate is close but might be considered a stretch. It's an ambitious but plausible goal.
        *   **"Not Ready"**: The candidate does not seem to have the required experience for the target level yet.
    4.  **Write an Explanation:** Provide a concise, honest, and constructive explanation for your verdict. Justify your reasoning by referencing parts of the resume.
    5.  **Suggest Next Steps:** Give 2-3 realistic and actionable next steps the candidate can take to bridge the gap to the target level (or to excel if they are ready).

    **Output Format (JSON only):**
    {
      "inferredLevel": "<string>",
      "verdict": "<'Ready' | 'Stretching' | 'Not Ready'>",
      "explanation": "<string>",
      "nextSteps": ["<string>", "<string>", ...]
    }
  `;

  try {
    const response = await gemini.generateText(prompt);
    const cleanedResponse = response.replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(cleanedResponse);
    return analysis;
  } catch (error) {
    console.error("Error performing reality check with Gemini:", error);
    throw new Error("Failed to get reality check analysis from Gemini.");
  }
}
