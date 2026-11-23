import {doc,updateDoc,serverTimestamp} from 'firebase/firestore';
import {auth,db} from '../lib/firebase';
import {requestApi} from './api.service';
interface ListResult {login:string;repos:{fullName:string}[]}
export async function setGithubAutoImport(enabled:boolean){const uid=auth.currentUser?.uid;if(!uid)throw new Error('Sign in first.');await updateDoc(doc(db,'users',uid),{githubAutoImport:enabled,updatedAt:serverTimestamp()})}
/** Import every eligible public repository as a private DRAFT on explicit opt-in. Re-running is idempotent. */
export async function syncGithubNow(){const data=await requestApi<ListResult>('/api/github/repos',undefined,'GET');let created=0,skipped=0;for(let i=0;i<data.repos.length;i+=20){const names=data.repos.slice(i,i+20).map(p=>p.fullName);if(!names.length)continue;const r=await requestApi<{created:number;skipped:number}>('/api/github/import',{repos:names});created+=r.created;skipped+=r.skipped}return {created,skipped,total:data.repos.length}}
