export type ProjectType = "showcase" | "seeking_team" | "opensource";

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
  demoUrl?: string;
  imageUrl?: string;
  likes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}
