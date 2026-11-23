
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";


import { auth, db, isPreviewMode } from "../lib/firebase";
import { previewProjects } from "../lib/previewProjects";
import { projectSchema } from "../lib/projectSchema";

import type {
  Project,
  ProjectInput,
} from "../types/project";

export type PublicStatusFilter =
  | "ALL"
  | "BURIED"
  | "LOOKING_FOR_REVIVAL"
  | "UNDER_REVIVAL"
  | "REVIVED";

export type ProjectCursor = string;

export interface PublicProjectFilters {
  status: PublicStatusFilter;
  category: string;
  minCompletion?: number;
  cursor?: ProjectCursor | null;
}

export interface PublicProjectPage {
  projects: Project[];
  nextCursor: ProjectCursor | null;
  hasMore: boolean;
}

function requireUser() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error(
      "You must be logged in to manage projects."
    );
  }

  return user;
}

// ==========================================
// CREATE PROJECT
// ==========================================

export async function createProject(
  input: ProjectInput
): Promise<string> {
  const user = requireUser();

  const validatedData = projectSchema.parse(input);

  const reference = await addDoc(
    collection(db, "projects"),
    {
      ...validatedData,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return reference.id;
}

// ==========================================
// GET MY PROJECTS
// ==========================================

export async function getMyProjects(): Promise<Project[]> {
  const user = requireUser();

  const projectsQuery = query(
    collection(db, "projects"),
    where("ownerId", "==", user.uid),
    limit(100)
  );

  const snapshot = await getDocs(projectsQuery);

  return snapshot.docs.map((document) => ({
    ...document.data(),
    id: document.id,
  })) as Project[];
}

// ==========================================
// GET SINGLE PROJECT
// ==========================================

export async function getProject(
  projectId: string
): Promise<Project> {
  const user = requireUser();

  const snapshot = await getDoc(
    doc(db, "projects", projectId)
  );

  if (!snapshot.exists()) {
    throw new Error("Project not found.");
  }

  const data = snapshot.data();

  if (data.ownerId !== user.uid) {
    throw new Error(
      "You do not have permission to access this project."
    );
  }

  return {
    ...data,
    id: snapshot.id,
  } as Project;
}

// ==========================================
// UPDATE PROJECT
// ==========================================

export async function updateProject(
  projectId: string,
  input: ProjectInput
): Promise<void> {
  requireUser();

  const validatedData = projectSchema.parse(input);

  await updateDoc(doc(db, "projects", projectId), {
    ...validatedData,
    updatedAt: serverTimestamp(),
  });
}

// ==========================================
// EXPLORE PUBLIC PROJECTS
// ==========================================

export async function getPublicProjects({status,category,minCompletion=0,cursor}:PublicProjectFilters):Promise<PublicProjectPage>{
 if(isPreviewMode){const projects=previewProjects.filter(project=>(status==='ALL'||project.status===status)&&(!category.trim()||project.category===category.trim())&&project.completionPercentage>=minCompletion);return {projects,nextCursor:null,hasMore:false}}
 const params=new URLSearchParams({status,category,minCompletion:String(minCompletion)});if(cursor)params.set('cursor',cursor);
 const token=await auth.currentUser?.getIdToken();const response=await fetch(`/api/projects/public?${params}`,{headers:token?{Authorization:`Bearer ${token}`}:{}});
 if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('Backend unavailable. Run `npx vercel dev` for live Firebase projects.');
 const data=await response.json().catch(()=>({error:'Could not read project list.'}));if(!response.ok)throw new Error(data.error||'Could not read project list.');if(!Array.isArray(data.projects))throw new Error('Invalid API project list response.');return data as PublicProjectPage;
}

export async function getVisibleProject(projectId:string):Promise<Project>{
 if(isPreviewMode){const sample=previewProjects.find(p=>p.id===projectId);if(!sample)throw new Error('Tombstone not found in preview.');return sample}
 const token=await auth.currentUser?.getIdToken();const response=await fetch(`/api/projects/detail?id=${encodeURIComponent(projectId)}`,{headers:token?{Authorization:`Bearer ${token}`}:{}});
 if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('Backend unavailable. Run `npx vercel dev` for live Firebase projects.');
 const data=await response.json().catch(()=>({error:'Unable to load the tombstone.'}));if(!response.ok)throw new Error(data.error||'Unable to load the tombstone.');if(!data.id)throw new Error('Invalid API tombstone response.');return data as Project;
}
