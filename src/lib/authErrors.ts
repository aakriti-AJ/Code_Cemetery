import { FirebaseError } from 'firebase/app';

/**
 * Present a useful, safe error identifier instead of a generic failure.
 * Do not display provider access tokens or the raw OAuth response.
 */
export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
  }

  const code = error.code;
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Please choose a stronger password.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'The credentials were rejected. For Google sign-in, check the enabled provider and the configured OAuth application. (' + code + ')';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'The sign-in window closed before authentication finished (auth/popup-closed-by-user). Try again with browser extensions or popup blockers temporarily disabled. If it closes immediately, inspect Chrome Developer Tools → Console.';
    case 'auth/cancelled-popup-request':
      return 'Another sign-in attempt replaced the popup. Retry once without double-clicking. (auth/cancelled-popup-request)';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Allow popups for localhost and retry. (auth/popup-blocked)';
    case 'auth/operation-not-allowed':
      return 'This sign-in provider is not enabled in Firebase Authentication. (auth/operation-not-allowed)';
    case 'auth/unauthorized-domain':
      return 'Add localhost under Firebase Authentication → Settings → Authorized domains. (auth/unauthorized-domain)';
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
      return 'The Firebase Web App API key was rejected. Copy the exact apiKey again from Firebase Project Settings → Your apps, update .env.local and restart Vite. (' + code + ')';
    case 'auth/configuration-not-found':
    case 'auth/invalid-app-credential':
    case 'auth/invalid-auth-domain':
      return 'Firebase OAuth configuration is missing or invalid. Check your Firebase web app configuration and enabled provider. (' + code + ')';
    case 'auth/operation-not-supported-in-this-environment':
    case 'auth/web-storage-unsupported':
      return 'This browser is blocking the authentication mechanism. Enable cookies/storage and try a standard Chrome window. (' + code + ')';
    case 'auth/account-exists-with-different-credential':
      return 'This email already uses another sign-in method. Sign in with that method first, then link the accounts. (auth/account-exists-with-different-credential)';
    case 'auth/network-request-failed':
      return 'Firebase authentication could not reach the network. Check connectivity or browser extensions. (auth/network-request-failed)';
    case 'permission-denied':
      return 'Firestore permissions blocked profile creation. Check the deployed Firestore rules. (permission-denied)';
    default:
      // Expose only Firebase's structured identifier, not raw provider data.
      return `Sign-in failed (${code}). Please share this error code so we can diagnose the correct integration.`;
  }
}
