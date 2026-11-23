import {doc,serverTimestamp,updateDoc} from 'firebase/firestore';
import {sendPasswordResetEmail,updateProfile} from 'firebase/auth';
import {auth,db} from '../lib/firebase';
import {z} from 'zod';
const profileSchema=z.object({name:z.string().trim().min(2).max(80),username:z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,20}$/),githubUsername:z.string().trim().max(39),bio:z.string().trim().max(1000),skills:z.array(z.string().trim().min(1).max(60)).max(30)});
export type EditableProfile=z.infer<typeof profileSchema>;
export async function updateMyProfile(input:EditableProfile){const user=auth.currentUser;if(!user)throw new Error('Please sign in.');const data=profileSchema.parse(input);await updateDoc(doc(db,'users',user.uid),{...data,updatedAt:serverTimestamp()});await updateProfile(user,{displayName:data.name})}
export async function resetMyPassword(){const email=auth.currentUser?.email;if(!email)throw new Error('No email on account.');await sendPasswordResetEmail(auth,email)}
