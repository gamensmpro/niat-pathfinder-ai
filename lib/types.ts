
export type Language =
  | "English"
  | "Telugu"
  | "Hindi"
  | "Tamil"
  | "Kannada"
  | "Malayalam";

export type Assessment = {
  studentName: string;
  stream: string;
  interests: string[];
  experience: string;
  favoriteSubject: string;
  careerGoal: string;
  language: Language;
};

export type CareerPath = {
  title: string;
  description: string;
  skills: string[];
  suitability: string;
};

export type RoadmapItem = {
  period: string;
  goal: string;
  activities: string[];
};

export type CareerReport = {
  introduction: string;
  careerPaths: CareerPath[];
  recommendedSkills: string[];
  beginnerProject: string;
  projectDescription: string;
  roadmap: RoadmapItem[];
  nextSteps: string[];
  realityCheck: string;
};

export type Lead = Assessment & {
  email: string;
  phone?: string;
  city: string;
  consent: boolean;
  guardianConsent: boolean;
};
