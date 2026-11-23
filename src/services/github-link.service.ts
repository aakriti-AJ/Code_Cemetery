import {GithubAuthProvider,linkWithPopup} from 'firebase/auth';
import {auth} from '../lib/firebase';
/** An existing Google/email user can explicitly link GitHub without creating another account. */
export async function connectGithubAccount(){
 const user=auth.currentUser;if(!user)throw new Error('Sign in before linking GitHub.');
 if(user.providerData.some(p=>p.providerId==='github.com'))return;
 const provider=new GithubAuthProvider();provider.addScope('read:user');provider.addScope('user:email');
 try{await linkWithPopup(user,provider)}catch(e){
  if(e instanceof Error&&('code' in e)&&e.code==='auth/credential-already-in-use')throw new Error('This GitHub account is already linked to another Code Cemetery account. Sign in to that account first.', { cause: e });
  throw e;
 }
}
