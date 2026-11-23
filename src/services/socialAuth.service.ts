import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import type { User, UserCredential } from 'firebase/auth';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export type SocialProvider = 'google' | 'github';

function buildProvider(provider: SocialProvider) {
  if (provider === 'google') {
    const google = new GoogleAuthProvider();
    google.addScope('profile');
    google.addScope('email');
    return google;
  }
  if (provider === 'github') {
    const github = new GithubAuthProvider();
    github.addScope('user:email');
    return github;
  }

  throw new Error('Unsupported authentication provider.');
}

function makeUsername(user: User) {
  const namePart = (user.displayName || user.email?.split('@')[0] || 'developer')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 12) || 'user';
  // A UID suffix avoids most collisions; the profile schema limits to 20 chars.
  return `${namePart}_${user.uid.slice(0, 6).toLowerCase()}`.slice(0, 20);
}

async function ensureProfile(user: User, provider: SocialProvider) {
  if (!user.email) {
    await signOut(auth);
    throw new Error('This account did not share an email address. Enable email access with your sign-in provider and try again.');
  }

  const ref = doc(db, 'users', user.uid);
  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(ref);
    if (snapshot.exists()) return;

    transaction.set(ref, {
      uid: user.uid,
      name: (user.displayName?.trim().length ?? 0) >= 2 ? user.displayName!.trim().slice(0, 80) : 'Developer',
      username: makeUsername(user),
      email: user.email,
      githubUsername: provider === 'github' ? (user.providerData.find(p => p.providerId === 'github.com')?.displayName || '').slice(0, 39) : '',
      githubAutoImport: provider === 'github',
      bio: '',
      skills: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

export async function signInWithSocialProvider(provider: SocialProvider): Promise<UserCredential> {
  // A popup may close immediately if Firebase rejects the OAuth configuration.
  // Keep popup errors separate from Firestore profile errors for accurate diagnosis.
  const credential = await signInWithPopup(auth, buildProvider(provider));
  try {
    await ensureProfile(credential.user, provider);
    return credential;
  } catch (error) {
    // Authentication succeeded, but creating the Firestore profile failed.
    // Keep the original Firebase error code available to the UI.
    await signOut(auth).catch(() => {});
    const cause = error as { code?: unknown };
    if (typeof cause?.code === 'string') {
      throw new Error(`Google/GitHub authentication succeeded, but Firestore profile setup failed (${cause.code}). Verify your deployed Firestore rules and refresh.`, { cause: error });
    }
    throw error;
  }
}
