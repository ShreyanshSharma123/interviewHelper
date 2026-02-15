// ─── Shared types for the analysis engine ───

export type AnalysisType = "ats" | "interview" | "reality";
export type JobLevel = "entry" | "mid" | "senior";
export type FailureReason =
  | "skill_gap"
  | "level_mismatch"
  | "communication"
  | "expectation";

// ─── Request ───

export interface AnalysisRequest {
  resumeText: string;
  analysisType: AnalysisType;
  context?: {
    jobRole?: string;
    feedback?: string;
    targetLevel?: JobLevel;
  };
}

// ─── Preprocessed resume ───

export interface ProcessedResume {
  cleanText: string;
  fullText: string; // Keep original for context
  skills: string[];
  yearsOfExperience: number;
  candidateLevel: JobLevel;
  sections: Record<string, string>;
  bulletPoints: string[];
  hasQuantifiedImpact: boolean;
  educationLevel: string | null;
}

// ─── Generic score component ───
export interface ScoreComponent {
  score: number;
  explanation: string;
}

// ─── ATS vs Human ───

export interface AtsResult {
  keywordMatch: ScoreComponent;
  relevance: ScoreComponent;
  formatting: ScoreComponent;
  overall: ScoreComponent;
  suggestions: string[];
}

export interface HumanResult {
  clarity: ScoreComponent;
  impact: ScoreComponent;
  layout: ScoreComponent;
  overall: ScoreComponent;
  suggestions: string[];
}

export interface AtsHumanResult {
  ats: AtsResult;
  human: HumanResult;
}

// ─── Interview Analysis ───

export interface InterviewFailurePoint {
  reason: string;
  advice: string;
}

export interface InterviewAnalysisResult {
  screening: InterviewFailurePoint[];
  technical: InterviewFailurePoint[];
  behavioral: InterviewFailurePoint[];
}

// ─── Reality Check ───

export interface RealityCheckResult {
  inferredLevel: string;
  verdict: "Ready" | "Stretching" | "Not Ready";
  explanation: string;
  nextSteps: string[];
}

// ─── Unified API response ───

export interface AnalysisResponse {
  success: boolean;
  analysisType: AnalysisType;
  data: AtsHumanResult | InterviewAnalysisResult | RealityCheckResult;
}
