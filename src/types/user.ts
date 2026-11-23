
import type { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  name: string;
  username: string;
  email: string;
  githubUsername: string;
  githubAutoImport?: boolean;
  bio: string;
  skills: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface RegisterData {
  name: string;
  username: string;
  email: string;
  password: string;
}
