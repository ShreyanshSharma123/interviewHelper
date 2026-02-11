export type JobLevel = "entry" | "mid" | "senior";

export interface JobRole {
  title: string;
  level: JobLevel;
  requiredSkills: string[];
}