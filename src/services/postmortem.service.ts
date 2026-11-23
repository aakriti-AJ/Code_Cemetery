
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../lib/firebase";
import { postmortemSchema } from "../lib/postmortemSchema";
import { getProject } from "./project.service";

import type {
  PostmortemInput,
  ProjectPostmortem,
} from "../types/postmortem";

function postmortemReference(projectId: string) {
  return doc(
    db,
    "projects",
    projectId,
    "postmortem",
    "summary"
  );
}

// Retrieve a project's postmortem.
export async function getProjectPostmortem(
  projectId: string
): Promise<ProjectPostmortem | null> {
  const snapshot = await getDoc(
    postmortemReference(projectId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return snapshot.data() as ProjectPostmortem;
}

// Create or update the owner's postmortem.
export async function saveProjectPostmortem(
  projectId: string,
  input: PostmortemInput
): Promise<void> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "You must be logged in to edit a postmortem."
    );
  }

  // Confirm project ownership.
  const project = await getProject(projectId);

  if (project.ownerId !== user.uid) {
    throw new Error(
      "Only the project owner can edit its postmortem."
    );
  }

  const editableStatuses = [
    "DRAFT",
    "BURIED",
    "LOOKING_FOR_REVIVAL",
  ];

  if (!editableStatuses.includes(project.status)) {
    throw new Error(
      "This postmortem cannot be edited in the project's current state."
    );
  }

  const validatedData = postmortemSchema.parse(input);

  const reference = postmortemReference(projectId);
  const snapshot = await getDoc(reference);

  if (snapshot.exists()) {
    await updateDoc(reference, {
      ...validatedData,
      updatedAt: serverTimestamp(),
    });
  } else {
    await setDoc(reference, {
      ...validatedData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}
