export interface ResumeSection {
  title: string;
  content: string[];
}

export interface ResumeData {
  fileName: string;
  sections: ResumeSection[];
  skills: string[];
  yearsOfExperience: number;
}