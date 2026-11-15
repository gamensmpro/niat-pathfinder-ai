
import { Assessment } from "./types";

export const interests = [
  "Artificial Intelligence",
  "Web Development",
  "Data Science",
  "Robotics",
  "Cybersecurity",
  "Entrepreneurship",
  "Mobile App Development",
  "Game Development"
];

export const streams = [
  "MPC",
  "BiPC",
  "Commerce",
  "Arts",
  "Other"
];

export const languages = [
  "English",
  "Telugu",
  "Hindi",
  "Tamil",
  "Kannada",
  "Malayalam"
] as const;

export function validateAssessment(data: Assessment) {
  return Boolean(
    data.studentName.trim() &&
    data.stream &&
    data.interests.length > 0 &&
    data.experience &&
    data.favoriteSubject &&
    data.careerGoal &&
    languages.includes(data.language as any)
  );
}
