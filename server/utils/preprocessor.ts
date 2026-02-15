import type { ProcessedResume, JobLevel } from "../types/index.js";

// ─── Skill dictionary (lowercase) ───
const SKILL_KEYWORDS: string[] = [
  // Languages
  "javascript", "typescript", "python", "java", "c++", "c#", "go", "rust",
  "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl",
  // Frontend
  "react", "angular", "vue", "svelte", "next.js", "nextjs", "nuxt",
  "html", "css", "sass", "tailwind", "bootstrap", "webpack", "vite",
  // Backend
  "node.js", "nodejs", "express", "fastify", "django", "flask", "spring",
  "spring boot", "asp.net", ".net", "rails", "laravel",
  // Databases
  "sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "dynamodb",
  "sqlite", "oracle", "cassandra", "elasticsearch",
  // Cloud & DevOps
  "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "jenkins",
  "ci/cd", "github actions", "gitlab ci", "ansible", "nginx", "linux",
  // Data & ML
  "machine learning", "deep learning", "tensorflow", "pytorch", "pandas",
  "numpy", "scikit-learn", "data analysis", "data science", "nlp",
  "computer vision", "spark", "hadoop",
  // Tools
  "git", "jira", "figma", "postman", "graphql", "rest", "restful",
  "microservices", "agile", "scrum", "kanban",
  // Mobile
  "react native", "flutter", "ios", "android",
  // Other
  "api", "oauth", "jwt", "websocket", "testing", "jest", "mocha",
  "cypress", "selenium", "unit testing", "integration testing",
  "system design", "design patterns", "oop", "functional programming",
];

// ─── Common section headings ───
const SECTION_PATTERNS: Record<string, RegExp> = {
  experience: /\b(experience|work\s*history|employment|professional\s*experience)\b/i,
  education: /\b(education|academic|degree|university|college)\b/i,
  skills: /\b(skills|technical\s*skills|technologies|competencies|proficiencies)\b/i,
  projects: /\b(projects|portfolio|personal\s*projects)\b/i,
  summary: /\b(summary|objective|about|profile|overview)\b/i,
  certifications: /\b(certifications?|licenses?|credentials?)\b/i,
  achievements: /\b(achievements?|awards?|honors?|accomplishments?)\b/i,
};

/**
 * Parse and preprocess raw resume text into a structured representation.
 */
export function preprocessResume(rawText: string): ProcessedResume {
  const fullText = rawText;
  const cleanText = rawText
    .toLowerCase()
    .replace(/[^\w\s\.\+\-\#\@]/g, " ") // Keep relevant symbols
    .replace(/\s+/g, " ")
    .trim();

  const skills = extractSkills(cleanText);
  const yearsOfExperience = inferYearsOfExperience(cleanText);
  const candidateLevel = inferCandidateLevel(yearsOfExperience, skills.length);
  const sections = extractSections(cleanText);
  const bulletPoints = extractBulletPoints(cleanText);
  const hasQuantifiedImpact = detectQuantifiedImpact(cleanText);
  const educationLevel = inferEducationLevel(cleanText);

  return {
    fullText,
    cleanText,
    skills,
    yearsOfExperience,
    candidateLevel,
    sections,
    bulletPoints,
    hasQuantifiedImpact,
    educationLevel,
  };
}

// ─── Helpers ───

function cleanResumeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[\t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return SKILL_KEYWORDS.filter((skill) => {
    // Word-boundary check for short keywords to avoid false positives
    if (skill.length <= 2) {
      const re = new RegExp(`\\b${escapeRegex(skill)}\\b`, "i");
      return re.test(lower);
    }
    return lower.includes(skill);
  });
}

function inferYearsOfExperience(text: string): number {
  // Pattern: "X years of experience" or "X+ years"
  const directMatch = text.match(
    /(\d{1,2})\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)?/i
  );
  if (directMatch) return parseInt(directMatch[1], 10);

  // Try to infer from date ranges (e.g., "2019 - 2023", "Jan 2018 – Present")
  const years: number[] = [];
  const datePattern =
    /(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*)?(\d{4})\s*[-–—to]+\s*(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*)?(\d{4}|present|current|now)/gi;
  let match;
  while ((match = datePattern.exec(text)) !== null) {
    const start = parseInt(match[1], 10);
    const end = /present|current|now/i.test(match[2])
      ? new Date().getFullYear()
      : parseInt(match[2], 10);
    if (start >= 1990 && start <= 2030 && end >= start) {
      years.push(end - start);
    }
  }

  if (years.length > 0) return Math.max(...years);

  // Fallback: look for graduation year and estimate
  const gradMatch = text.match(/(?:graduated?|class\s*of)\s*(\d{4})/i);
  if (gradMatch) {
    const gradYear = parseInt(gradMatch[1], 10);
    const currentYear = new Date().getFullYear();
    const diff = currentYear - gradYear;
    if (diff >= 0 && diff <= 40) return diff;
  }

  return 0;
}

function inferCandidateLevel(
  yearsOfExperience: number,
  skillCount: number
): JobLevel {
  if (yearsOfExperience >= 6 || (yearsOfExperience >= 4 && skillCount >= 12))
    return "senior";
  if (yearsOfExperience >= 2 || (yearsOfExperience >= 1 && skillCount >= 8))
    return "mid";
  return "entry";
}

function extractSections(text: string): Record<string, string> {
  const lines = text.split("\n");
  const sections: Record<string, string> = {};
  let currentSection = "header";
  let currentContent: string[] = [];

  for (const line of lines) {
    let matched = false;
    for (const [name, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(line) && line.trim().length < 60) {
        // Save previous section
        if (currentContent.length > 0) {
          sections[currentSection] = currentContent.join("\n").trim();
        }
        currentSection = name;
        currentContent = [];
        matched = true;
        break;
      }
    }
    if (!matched) {
      currentContent.push(line);
    }
  }
  // Save last section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join("\n").trim();
  }

  return sections;
}

function extractBulletPoints(text: string): string[] {
  const bullets: string[] = [];
  const lines = text.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-•▪▸►◦*]/.test(trimmed) || /^\d+[.)]\s/.test(trimmed)) {
      bullets.push(trimmed.replace(/^[-•▪▸►◦*]\s*/, "").replace(/^\d+[.)]\s*/, ""));
    }
  }
  return bullets;
}

function detectQuantifiedImpact(text: string): boolean {
  // Look for numbers with context: percentages, dollar amounts, user counts, etc.
  return /\d+%|\$\d+|increased|reduced|improved|grew|saved|generated|delivered|managed\s+\d+/i.test(
    text
  );
}

function inferEducationLevel(text: string): string | null {
  const lower = text.toLowerCase();
  if (/\bph\.?d\.?\b|\bdoctorate\b/.test(lower)) return "phd";
  if (/\bm\.?s\.?\b|\bmaster'?s?\b|\bm\.?tech\b|\bm\.?b\.?a\.?\b/.test(lower))
    return "masters";
  if (/\bb\.?s\.?\b|\bbachelor'?s?\b|\bb\.?tech\b|\bb\.?e\.?\b|\bb\.?a\.?\b/.test(lower))
    return "bachelors";
  if (/\bassociate'?s?\b|\bdiploma\b/.test(lower)) return "associates";
  return null;
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}