import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try { await login({ email, password }); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <div className="auth-page"><div className="auth-intro"><div className="brand"><span className="brand-mark">₹</span>Campus<span className="brand-accent">Budget</span></div><div><span className="eyebrow">YOUR MONEY, MADE CLEAR</span><h1>See where your money goes.<br /><em>Make more of what’s left.</em></h1><p>A simple budget and expense tracker built for student life.</p></div><div className="auth-decoration" aria-hidden="true">₹</div></div><div className="auth-content"><div className="auth-card"><span className="eyebrow">WELCOME BACK</span><h2>Sign in to your account</h2><p>Keep your spending in sight, one day at a time.</p><form onSubmit={submit}><label>Email address<input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" /></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button primary full" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button></form><p className="auth-switch">New here? <Link to="/register">Create an account</Link></p></div></div></div>;
}
