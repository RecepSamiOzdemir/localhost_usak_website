export type ProjectType = "showcase" | "seeking_team" | "opensource";

// FAZ5: açık kaynak projeleri için ek alanlar (hepsi opsiyonel)
export type ProjectStatus = "idea" | "development" | "active";
export type ProjectDifficulty = "beginner" | "intermediate" | "advanced";

export interface ProjectItem {
  id: number;
  name: string;
  description: string;
  type: ProjectType;
  technologies: string[];
  owner: string;
  teamSize: number;
  teamMax?: number;
  rolesNeeded?: string[];    // e.g. ["Frontend Dev", "UI Designer"]
  githubUrl?: string;
  contributingGuideUrl?: string;
  projectStatus?: ProjectStatus;
  difficultyLevel?: ProjectDifficulty;
  demoUrl?: string;
  imageUrl?: string;
  likes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
