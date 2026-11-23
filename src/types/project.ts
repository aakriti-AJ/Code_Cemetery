
import type { Timestamp } from "firebase/firestore";

export type ProjectStatus =
  | "DRAFT"
  | "BURIED"
  | "LOOKING_FOR_REVIVAL"
  | "UNDER_REVIVAL"
  | "REVIVED";

export type EditableProjectStatus =
  | "DRAFT"
  | "BURIED"
  | "LOOKING_FOR_REVIVAL";

export interface ProjectInput {
  title: string;
  description: string;
  githubUrl: string;
  sourceType?: "GITHUB" | "CUSTOM";
  archivePath?: string;
  availableForPurchase?: boolean;
  technologies: string[];
  category: string;
  completionPercentage: number;
  causeOfAbandonment: string;
  workingFeatures: string[];
  incompleteFeatures: string[];
  knownIssues: string[];
  requiredSkills: string[];
  status: EditableProjectStatus;
}

export interface Project
  extends Omit<ProjectInput, "status"> {
  id: string;
  ownerId: string;
  status: ProjectStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  locked?: boolean;
}
