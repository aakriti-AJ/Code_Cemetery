import {auth,db,isPreviewMode} from '../lib/firebase';
import {collection,deleteDoc,doc,getDoc,getDocs,limit,query,serverTimestamp,setDoc,where} from 'firebase/firestore';
import {requestApi} from './api.service';
import type {UserProfile} from '../types/user';
import type {Stars} from '../lib/badges';
export interface PublicDeveloper {uid:string;name:string;username:string;bio:string;skills:string[];githubUsername:string;stars:Stars;followers:number;following:number;isFollowing:boolean;}
export interface PublicDirectoryProfile {uid:string;name:string;username:string;bio:string;skills:string[];githubUsername:string;}
export async function publishPublicProfile(p:UserProfile){if(isPreviewMode)return;await setDoc(doc(db,'publicProfiles',p.uid),{uid:p.uid,name:p.name,username:p.username,bio:p.bio,skills:p.skills,githubUsername:p.githubUsername,updatedAt:serverTimestamp()})}
export async function listDevelopers(){const ss=await getDocs(query(collection(db,'publicProfiles'),limit(60)));return ss.docs.map(s=>s.data() as PublicDirectoryProfile)}
export async function getDeveloper(uid:string){return requestApi<PublicDeveloper>(`/api/community/profile?uid=${encodeURIComponent(uid)}`,undefined,'GET')}
export async function getMyFollowingIds(){const uid=auth.currentUser?.uid;if(!uid)return [] as string[];const ss=await getDocs(query(collection(db,'follows'),where('followerId','==',uid),limit(500)));return ss.docs.map(d=>String(d.data().targetId))}
export async function toggleFollow(targetId:string,currentlyFollowing:boolean){const uid=auth.currentUser?.uid;if(!uid)throw new Error('Sign in to follow developers.');if(uid===targetId)throw new Error('You cannot follow yourself.');const ref=doc(db,'follows',`${uid}_${targetId}`);if(currentlyFollowing)await deleteDoc(ref);else await setDoc(ref,{followerId:uid,targetId,createdAt:serverTimestamp()})}
export async function reportDeveloper(targetId:string,reason:string,details:string){const uid=auth.currentUser?.uid;if(!uid)throw new Error('Sign in to report a user.');if(uid===targetId)throw new Error('You cannot report yourself.');await setDoc(doc(db,'reports',`${uid}_${targetId}`),{reporterId:uid,targetId,reason,details:details.trim().slice(0,700),createdAt:serverTimestamp()})}
export async function myTier(){const uid=auth.currentUser?.uid;if(!uid)return 'NONE';const result=await getDoc(doc(db,'entitlements',uid));return result.exists()?String(result.data().tier):'NONE'}
