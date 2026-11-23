import { useState } from 'react';
import { signInWithSocialProvider } from '../services/socialAuth.service';
import type { SocialProvider } from '../services/socialAuth.service';
import { getAuthErrorMessage } from '../lib/authErrors';
import { FirebaseError } from 'firebase/app';
import Icon from './Icon';
import { isPreviewMode } from '../lib/firebase';
import { Link } from 'react-router';

const providers: { id: SocialProvider; name: string }[] = [
  { id: 'google', name: 'Google' },
  { id: 'github', name: 'GitHub' },
];

export default function SocialSignIn({
  onSuccess,
  onError,
  disabled,
}: {
  onSuccess: () => void;
  onError: (message: string) => void;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState<SocialProvider | null>(null);

  async function authenticate(provider: SocialProvider) {
    if (disabled || busy) return;
    if (isPreviewMode) {
      onError('Google and GitHub sign-in need a real Firebase web configuration. Copy .env.example to .env.local, fill in your Firebase Web App settings, enable the provider in Firebase Authentication, and restart the app.');
      return;
    }
    onError('');
    setBusy(provider);
    try {
      await signInWithSocialProvider(provider);
      onSuccess();
    } catch (error) {
      // This will show the exact Firebase error in the browser console.
      console.error(`[Code Cemetery] ${provider} sign-in failed:`, error);
      if (error instanceof FirebaseError && error.code === 'auth/invalid-credential') {
        onError('Firebase returned auth/invalid-credential. Check the enabled provider and configured Firebase web app.');
      } else if (error instanceof FirebaseError && error.code === 'auth/internal-error') {
        onError('Firebase returned auth/internal-error. Check the provider configuration and Chrome Developer Tools → Console for the underlying cause.');
      } else {
        onError(error instanceof Error && !(error instanceof FirebaseError)
          ? error.message
          : getAuthErrorMessage(error));
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="social-login" aria-label="Other sign-in options">
      <div className="social-divider"><span>or continue with</span></div>
      <div className="social-buttons">
        {providers.map(({ id, name }) => (
          <button
            key={id}
            type="button"
            className="social-button"
            onClick={() => authenticate(id)}
            disabled={disabled || busy !== null}
            title={`Continue with ${name}`}
          >
            {id === 'google' ? <span className="google-g" aria-hidden="true">G</span> : <Icon name="github" size={19} />}
            <span>{busy === id ? 'Opening…' : `Continue with ${name}`}</span>
          </button>
        ))}
      </div>
      {isPreviewMode && <div className="social-signin-preview">OAuth buttons are shown but cannot authenticate in showcase mode. Configure Firebase and enable Google/GitHub providers. Meanwhile, <Link to="/github">browse real public GitHub repositories</Link>.</div>}
    </div>
  );
}
