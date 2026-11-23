import {collection,doc,getDoc,getDocs,limit,orderBy,query,where} from 'firebase/firestore';
import {auth,db} from '../lib/firebase';
import {revivalSchema} from '../lib/revivalSchema';
import {requestApi} from './api.service';
import type {ProposalInput,RevivalProposal,Contributor} from '../types/revival';
function currentUid(){const uid=auth.currentUser?.uid;if(!uid)throw new Error('Please sign in first.');return uid}
function unpack(snapshot:Awaited<ReturnType<typeof getDocs>>):RevivalProposal[]{return snapshot.docs.map(d=>({...(d.data() as Record<string,unknown>),id:d.id}) as RevivalProposal)}
export async function myProposal(projectId:string){const id=`${projectId}_${currentUid()}`;const snap=await getDoc(doc(db,'revivalProposals',id));return snap.exists()?({...snap.data(),id:snap.id} as RevivalProposal):null}
export async function submitProposal(projectId:string,input:ProposalInput){const valid=revivalSchema.parse(input);return requestApi<{id:string}>('/api/proposals/submit',{projectId,...valid});}
export async function getReceivedProposals(){const snap=await getDocs(query(collection(db,'revivalProposals'),where('ownerId','==',currentUid()),limit(100)));return unpack(snap).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0))}
export async function getSentProposals(){const snap=await getDocs(query(collection(db,'revivalProposals'),where('applicantId','==',currentUid()),limit(100)));return unpack(snap).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0))}
export async function decideProposal(proposalId:string,decision:'ACCEPTED'|'REJECTED'){return requestApi<{success:boolean}>('/api/proposals/decision',{proposalId,decision});}
export async function markProjectRevived(projectId:string){return requestApi<{success:boolean}>('/api/proposals/complete',{projectId});}
export async function getContributors(projectId:string){const snap=await getDocs(query(collection(db,'projects',projectId,'contributors'),orderBy('joinedAt','asc'),limit(50)));return snap.docs.map(d=>({...d.data(),userId:d.id}) as Contributor)}
