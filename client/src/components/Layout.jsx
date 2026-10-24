import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try { await logout(); navigate('/login'); }
    catch { window.alert('Could not sign out. Please try again.'); }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark">₹</span><span>Campus<span className="brand-accent">Budget</span></span></div>
      <p className="sidebar-caption">YOUR MONEY, MADE CLEAR</p>
      <nav aria-label="Main navigation" className="nav-links">
        <NavLink to="/" end>Overview</NavLink>
        <NavLink to="/expenses">Expenses</NavLink>
        <NavLink to="/budget">Monthly budget</NavLink>
      </nav>
      <div className="sidebar-bottom"><div className="avatar">{user?.name?.[0]?.toUpperCase()}</div><div className="account"><strong>{user?.name}</strong><small>{user?.email}</small></div><button className="text-button" onClick={handleLogout} aria-label="Sign out">↪</button></div>
    </aside>
    <div className="main-area"><header className="mobile-header"><div className="brand"><span className="brand-mark">₹</span>Campus<span className="brand-accent">Budget</span></div><nav aria-label="Mobile navigation"><NavLink to="/" end>Overview</NavLink><NavLink to="/expenses">Expenses</NavLink><NavLink to="/budget">Budget</NavLink></nav></header><main><Outlet /></main></div>
  </div>;
}
