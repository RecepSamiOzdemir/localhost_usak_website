export type CareerType = "job" | "internship" | "freelance" | "mentorship";
export type WorkMode = "remote" | "hybrid" | "onsite";
export type Schedule = "fulltime" | "parttime" | "project";

export interface CareerItem {
  id: number;
  title: string;
  company?: string;
  type: CareerType;
  workMode: WorkMode;
  schedule: Schedule;
  description: string;
  technologies: string[];
  applyUrl?: string;
  contact?: string;
  postedBy: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}
