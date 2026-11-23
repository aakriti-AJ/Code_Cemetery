import {collection,deleteDoc,doc,getDocs,serverTimestamp,setDoc} from 'firebase/firestore';
import {auth,db} from '../lib/firebase';
import {getVisibleProject} from './project.service';
import type {Project} from '../types/project';
function ref(projectId:string){const uid=auth.currentUser?.uid;if(!uid)throw new Error('Please sign in to save projects.');return doc(db,'users',uid,'bookmarks',projectId)}
export async function saveBookmark(projectId:string){await getVisibleProject(projectId);await setDoc(ref(projectId),{projectId,createdAt:serverTimestamp()})}
export async function removeBookmark(projectId:string){await deleteDoc(ref(projectId))}
export async function getBookmarkIds(){const uid=auth.currentUser?.uid;if(!uid)return [];const snap=await getDocs(queryBookmarks(uid));return snap.docs.map(d=>d.id)}
function queryBookmarks(uid:string){return collection(db,'users',uid,'bookmarks')}
export async function getBookmarks():Promise<Project[]>{const ids=(await getBookmarkIds()).slice(0,50);const results=await Promise.allSettled(ids.map(getVisibleProject));return results.flatMap(r=>r.status==='fulfilled'?[r.value]:[])}
export async function getRecentBookmarkIds(){const uid=auth.currentUser?.uid;if(!uid)return [];const snap=await getDocs(collection(db,'users',uid,'bookmarks'));return snap.docs.slice(0,100).map(d=>d.id)}
