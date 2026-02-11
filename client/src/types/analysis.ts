export interface ScoreBreakdown {
  score: number;
  reasons: string[];
}

export interface AtsHumanAnalysis {
  atsScore: ScoreBreakdown;
  humanScore: ScoreBreakdown;
  conflicts: string[];
}

export type FailureReason =
  | "skill_gap"
  | "level_mismatch"
  | "communication"
  | "expectation";

export interface InterviewAnalysisResult {
  likelyFailure: FailureReason;
  explanation: string;
  suggestions: string[];
}