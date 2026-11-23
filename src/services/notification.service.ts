import {collection,doc,getDocs,limit,query,updateDoc,where} from 'firebase/firestore';
import {auth,db} from '../lib/firebase';
import type {AppNotification} from '../types/revival';
export async function getNotifications():Promise<AppNotification[]>{const uid=auth.currentUser?.uid;if(!uid)return [];const snap=await getDocs(query(collection(db,'notifications'),where('userId','==',uid),limit(100)));return snap.docs.map(d=>({...d.data(),id:d.id}) as AppNotification).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0))}
export async function markNotificationRead(id:string){await updateDoc(doc(db,'notifications',id),{read:true})}
