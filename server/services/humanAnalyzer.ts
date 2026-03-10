import { GeminiAnalyzer } from "./geminiAnalyzer.js";
import type { ProcessedResume, HumanResult } from "../types/index.js";
import { cleanAndParseJson } from "../utils/jsonUtils.js";

const gemini = new GeminiAnalyzer();

export async function analyzeHumanReadability(
  resume: ProcessedResume
): Promise<HumanResult> {
  const prompt = `
    You are an expert career coach and recruiter. Your task is to analyze the provided resume from the perspective of a human hiring manager who spends 30 seconds scanning it. Provide a score breakdown in JSON format.

    **Resume Content:**
    ---
    ${resume.fullText}
    ---

    **Instructions:**
    1.  **Clarity & Conciseness Score (0-100):** How easy is it to understand the candidate's skills and experience? Are bullet points concise and impactful?
    2.  **Impact & Accomplishments Score (0-100):** Does the resume effectively showcase achievements using quantifiable results (metrics, numbers, percentages) rather than just listing responsibilities?
    3.  **Visual Appeal & Layout Score (0-100):** How clean and professional is the layout? Is there good use of whitespace? Is the font readable? (Infer this from the text structure).
    4.  **Overall Readability Score (0-100):** A weighted average of the above, representing the overall impression the resume would make on a human reviewer.
    5.  **Suggestions (string[]):** Provide actionable suggestions to improve the resume's human readability.

    **Output Format (JSON only):**
    {
      "clarity": {
        "score": <number>,
        "explanation": "<string>"
      },
      "impact": {
        "score": <number>,
        "explanation": "<string>"
      },
      "layout": {
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
    console.error("Error analyzing human readability with Gemini:", error);
    throw new Error("Failed to get human readability analysis from Gemini.");
  }
}

export function detectConflicts(
  resume: ProcessedResume,
  atsScore: number,
  humanScore: number
): string[] {
  const conflicts: string[] = [];

  if (atsScore > 70 && humanScore < 60) {
    conflicts.push(
      "Resume is keyword-heavy which helps ATS but may feel robotic to a recruiter"
    );
  }

  if (atsScore < 60 && humanScore > 70) {
    conflicts.push(
      "Resume reads well for humans but lacks keywords that ATS scanners look for"
    );
  }

  if (resume.bulletPoints.length > 0) {
    const avgLen =
      resume.bulletPoints.reduce((s, b) => s + b.length, 0) /
      resume.bulletPoints.length;
    if (avgLen > 120) {
      conflicts.push(
        "Long bullet points may help ATS extract more keywords, but recruiters skip dense text"
      );
    }
  }

  if (resume.skills.length > 15) {
    conflicts.push(
      "Large skills list boosts ATS matching but can appear unfocused to a human reviewer"
    );
  }

  if (!resume.sections["summary"] && resume.skills.length >= 5) {
    conflicts.push(
      "Skills are listed but no summary ties them into a narrative — recruiters want context"
    );
  }

  if (!resume.hasQuantifiedImpact && resume.bulletPoints.length >= 5) {
    conflicts.push(
      "Multiple bullet points but none have measurable results — both ATS and humans value metrics"
    );
  }

  if (conflicts.length === 0) {
    conflicts.push(
      "No major conflicts detected — ATS and human readability are reasonably balanced"
    );
  }

  return conflicts;
}
