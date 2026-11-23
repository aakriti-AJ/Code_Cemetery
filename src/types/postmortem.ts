
import type { Timestamp } from "firebase/firestore";

export interface PostmortemInput {
  technicalChallenges: string;
  lessonsLearned: string;
  recommendedNextSteps: string;
}

export interface ProjectPostmortem extends PostmortemInput {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
