export interface ScoreComponent {
  score: number;
  explanation: string;
}

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

export interface AtsHumanAnalysis {
  ats: AtsResult;
  human: HumanResult;
}

export type JobLevel = "entry" | "mid" | "senior";

export interface InterviewFailurePoint {
  reason: string;
  advice: string;
}

export interface InterviewAnalysisResult {
  screening: InterviewFailurePoint[];
  technical: InterviewFailurePoint[];
  behavioral: InterviewFailurePoint[];
}

export interface RealityCheckResult {
  inferredLevel: string;
  verdict: "Ready" | "Stretching" | "Not Ready";
  explanation: string;
  nextSteps: string[];
}