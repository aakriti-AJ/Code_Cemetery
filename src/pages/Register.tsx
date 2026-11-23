import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { z } from 'zod';
import { registerUser } from '../services/auth.service';
import { getAuthErrorMessage } from '../lib/authErrors';
import { useAuth } from '../context/useAuth';
import Icon from '../components/Icon';
import SocialSignIn from '../components/SocialSignIn';
import { isPreviewMode } from '../lib/firebase';

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,20}$/, 'Username must be 3–20 lowercase letters, numbers, or underscores.'),
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(128),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword'],
});

type RegistrationField = 'name' | 'username' | 'email' | 'password' | 'confirmPassword';
const fields: { key: RegistrationField; label: string; type: string; placeholder: string; autocomplete: string }[] = [
  { key: 'name', label: 'Your name', type: 'text', placeholder: 'Ada Lovelace', autocomplete: 'name' },
  { key: 'username', label: 'Username', type: 'text', placeholder: 'ada_builds', autocomplete: 'username' },
  { key: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', autocomplete: 'email' },
  { key: 'password', label: 'Password', type: 'password', placeholder: 'At least 8 characters', autocomplete: 'new-password' },
  { key: 'confirmPassword', label: 'Confirm password', type: 'password', placeholder: 'Repeat your password', autocomplete: 'new-password' },
];

export default function Register() {
  const navigate = useNavigate();
  const { currentUser, userProfile, loading } = useAuth();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const result = schema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0]?.message || 'Check your details.');
      return;
    }
    if (isPreviewMode) { setError('This is a read-only design showcase. Add your Firebase credentials in .env.local to enable accounts.'); return; }
    setBusy(true);
    try {
      await registerUser(result.data);
      navigate('/dashboard', { replace: true });
    } catch (cause) {
      setError(getAuthErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="skeleton" />;
  if (currentUser && userProfile && !busy) return <Navigate to="/dashboard" replace />;

  return (
    <section className="surface auth-card auth-card-register" aria-labelledby="register-heading">
      <div className="auth-panel">
        <div>
          <p className="eyebrow auth-eyebrow">A NEW SOUL AT THE GATES</p>
          <h1 className="auth-title">Write your<br /><span>legacy.</span></h1>
          <p className="auth-description">Bring your unfinished ideas. Find the curious developers who believe in second chances.</p>
        </div>
        <p className="auth-quote">No great idea deserves to be forgotten.</p>
      </div>

      <form className="auth-form" onSubmit={submit}>
        {isPreviewMode && <div className="alert-box" role="status">Design showcase only. Connect Firebase to enable accounts and saving.</div>}
        <div className="auth-form-heading">
          <p className="eyebrow auth-form-eyebrow">JOIN THE AFTERLIFE</p>
          <h2 id="register-heading" className="section-title">Create an account</h2>
        </div>
        <div className="form-grid auth-register-fields">
          {fields.map(({ key, label, type, placeholder, autocomplete }) => (
            <div className={`field ${key === 'email' ? 'md:col-span-2' : ''}`} key={key}>
              <label htmlFor={key}>{label}</label>
              <input
                id={key}
                type={type}
                required
                minLength={key === 'password' ? 8 : undefined}
                value={form[key]}
                onChange={event => setForm(previous => ({ ...previous, [key]: event.target.value }))}
                placeholder={placeholder}
                autoComplete={autocomplete}
              />
            </div>
          ))}
        </div>
        {error && <div className="alert-box" role="alert">{error}</div>}
        <button className="btn btn-primary w-full" type="submit" disabled={busy}>
          {busy ? 'Creating your account…' : 'Create my account'} <Icon name="arrow-right" size={17} />
        </button>
        {<SocialSignIn onError={setError} onSuccess={() => navigate('/dashboard', { replace: true })} disabled={busy} />}
        <p className="auth-footer">Already a member? <Link to="/login">Sign in</Link></p>
      </form>
    </section>
  );
}
