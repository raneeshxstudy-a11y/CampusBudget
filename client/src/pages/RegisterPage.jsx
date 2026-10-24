import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try { await register({ name, email, password }); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><div className="auth-intro"><div className="brand"><span className="brand-mark">₹</span>Campus<span className="brand-accent">Budget</span></div><div><span className="eyebrow">START FRESH</span><h1>Good money habits<br /><em>start right here.</em></h1><p>Know your spending. Set a plan. Make every rupee count.</p></div><div className="auth-decoration" aria-hidden="true">₹</div></div><div className="auth-content"><div className="auth-card"><span className="eyebrow">JOIN CAMPUSBUDGET</span><h2>Create your account</h2><p>It takes a minute to get started.</p><form onSubmit={submit}><label>Your name<input autoComplete="name" value={name} onChange={e => setName(e.target.value)} minLength="2" maxLength="80" required placeholder="Your name" /></label><label>Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" /></label><label>Password<input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} minLength="8" required placeholder="At least 8 characters" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button primary full" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button></form><p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p></div></div></div>;
}
