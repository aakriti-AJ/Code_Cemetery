import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { loginUser } from '../services/auth.service';
import { getAuthErrorMessage } from '../lib/authErrors';
import { useAuth } from '../context/useAuth';
import { auth } from '../lib/firebase';
import Icon from '../components/Icon';
import SocialSignIn from '../components/SocialSignIn';
import { isPreviewMode } from '../lib/firebase';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  function destination() {
    const from = (location.state as { from?: string } | null)?.from;
    return from?.startsWith('/') && !from.startsWith('//') ? from : '/dashboard';
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPreviewMode) { setError('This is a read-only design showcase. Add your Firebase credentials in .env.local to enable accounts.'); return; }
    setBusy(true);
    setError('');
    try {
      await loginUser(email, password);
      navigate(destination(), { replace: true });
    } catch (cause) {
      setError(getAuthErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  async function reset() {
    if (isPreviewMode) { setError('Password reset requires Firebase credentials.'); return; }
    if (!email.trim()) {
      setError('Enter your email address first.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage('Password reset email sent. Check your inbox.');
      setError('');
    } catch (cause) {
      setError(getAuthErrorMessage(cause));
    }
  }

  if (loading) return <div className="skeleton" />;
  if (currentUser && userProfile && !busy) return <Navigate to="/dashboard" replace />;

  return (
    <section className="surface auth-card" aria-labelledby="signin-heading">
      <div className="auth-panel">
        <div>
          <p className="eyebrow auth-eyebrow">THE GATES ARE OPEN</p>
          <h1 className="auth-title">Return to<br />the <span>afterlife.</span></h1>
          <p className="auth-description">Your tombstones, lost ideas, and second chances are all where you left them.</p>
        </div>
        <p className="auth-quote">Some stories deserve a second life.</p>
      </div>

      <form onSubmit={submit} className="auth-form">
        {isPreviewMode && <div className="alert-box" role="status">Design showcase only. Connect Firebase to enable accounts and saving.</div>}
        <div className="auth-form-heading">
          <p className="eyebrow auth-form-eyebrow">WELCOME BACK, GRAVEKEEPER</p>
          <h2 id="signin-heading" className="section-title">Sign in to continue</h2>
        </div>

        <div className="field">
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" />
        </div>
        <button className="auth-reset" type="button" onClick={reset}>Forgot password?</button>
        {error && <div className="alert-box" role="alert">{error}</div>}
        {message && <div className="alert-box success-box" role="status">{message}</div>}
        <button className="btn btn-primary w-full" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'} <Icon name="arrow-right" size={17} />
        </button>
        {<SocialSignIn onError={setError} onSuccess={() => navigate(destination(), { replace: true })} disabled={busy} />}
        <p className="auth-footer">New here? <Link to="/register">Create an account</Link></p>
      </form>
    </section>
  );
}
