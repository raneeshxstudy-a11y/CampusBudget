import { useEffect, useState } from 'react';
import BudgetSummary from '../components/BudgetSummary.jsx';
import { budgetService } from '../services/budgetService.js';
import { currentMonth, formatMoney, toPaise } from '../services/money.js';

export default function BudgetPage() {
  const [month, setMonth] = useState(currentMonth());
  const [summary, setSummary] = useState(null);
  const [limit, setLimit] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true; setLoading(true); setError(''); setSuccess('');
    budgetService.summary(month).then(result => { if (active) { setSummary(result); setLimit(result.budgetPaise ? String(result.budgetPaise / 100) : ''); } }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [month, retry]);

  async function save(event) {
    event.preventDefault(); setError(''); setSuccess('');
    const limitPaise = toPaise(limit);
    if (!limitPaise) return setError('Enter a valid budget greater than zero, with up to 2 decimal places.');
    setBusy(true);
    try { await budgetService.save(month, limitPaise); setSummary(await budgetService.summary(month)); setSuccess('Your monthly budget was saved.'); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return <div className="page-container"><div className="page-top"><div><span className="eyebrow">PLAN AHEAD</span><h1>Your monthly budget</h1><p>Give your spending a direction that works for you.</p></div><label className="month-label">Viewing month<input type="month" value={month} onChange={e => setMonth(e.target.value)} /></label></div>
    {loading ? <div className="state-panel" role="status">Loading your budget…</div> : <div className="budget-page-grid"><section className="panel form-panel"><span className="eyebrow">SET YOUR LIMIT</span><h2>Plan your month</h2><p className="muted">Choose an amount you want to stay within. You can update it at any time.</p><form onSubmit={save}><label>Monthly budget (₹)<input inputMode="decimal" value={limit} onChange={e => setLimit(e.target.value)} placeholder="e.g. 5000.00" required /></label>{error && <p className="form-error" role="alert">{error} <button type="button" className="text-button" onClick={() => setRetry(value => value + 1)}>Retry loading</button></p>}{success && <p className="form-success" role="status">{success}</p>}<button className="button primary" disabled={busy}>{busy ? 'Saving…' : 'Save budget'}</button></form></section>{summary && <div className="budget-side"><BudgetSummary summary={summary} /><section className="panel tip-panel"><span className="eyebrow">AT A GLANCE</span><h2>{summary.budgetPaise ? summary.remainingPaise >= 0 ? 'You’re on your way' : 'Over your budget' : 'Start with a plan'}</h2><p>{summary.budgetPaise ? summary.remainingPaise >= 0 ? `${formatMoney(summary.remainingPaise)} remains for this month.` : `You have spent ${formatMoney(-summary.remainingPaise)} more than planned.` : 'Set a monthly budget to see what remains after your expenses.'}</p></section></div>}</div>}
  </div>;
}
