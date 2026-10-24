import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BudgetSummary from '../components/BudgetSummary.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import { budgetService } from '../services/budgetService.js';
import { expenseService } from '../services/expenseService.js';
import { currentMonth, formatMoney } from '../services/money.js';
import { useAuth } from '../hooks/useAuth.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const [month, setMonth] = useState(currentMonth());
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    Promise.all([budgetService.summary(month), expenseService.list({ month, page: 1, limit: 5 })])
      .then(([result, expenses]) => { if (active) { setSummary(result); setItems(expenses.items); } })
      .catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [month, retry]);

  return <div className="page-container">
    <div className="page-top"><div><span className="eyebrow">YOUR FINANCIAL SNAPSHOT</span><h1>Good to see you, {user.name.split(' ')[0]}.</h1><p>Here’s how your money is moving this month.</p></div><label className="month-label">Viewing month<input type="month" value={month} onChange={e => setMonth(e.target.value)} /></label></div>
    {loading ? <div className="state-panel" role="status">Loading your overview…</div> : error ? <div className="state-panel error-state" role="alert"><p>{error}</p><button className="button secondary" onClick={() => setRetry(value => value + 1)}>Try again</button></div> : <>
      <div className="dashboard-grid"><BudgetSummary summary={summary} /><section className="spent-card panel"><span className="eyebrow">TOTAL SPENT</span><div className="spent-value">{formatMoney(summary.spentPaise)}</div><p>Across {summary.categories.reduce((sum, category) => sum + category.count, 0)} expenses in {new Date(`${month}-01T00:00:00Z`).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' })}.</p><Link to="/expenses" className="inline-link">View all expenses →</Link></section></div>
      <div className="lower-grid"><section className="panel recent-panel"><div className="section-head"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>Latest expenses</h2></div><Link className="inline-link" to="/expenses">View all →</Link></div>{items.length ? <ExpenseList items={items} /> : <div className="empty-state"><div className="empty-icon">₹</div><h3>No expenses yet</h3><p>Add your first expense to see your spending here.</p><Link className="button primary" to="/expenses">Add an expense</Link></div>}</section><section className="panel categories-panel"><span className="eyebrow">WHERE IT WENT</span><h2>By category</h2>{summary.categories.length ? <div className="category-bars">{summary.categories.map(item => <div className="category-bar" key={item.category}><div className="bar-label"><strong>{item.category}</strong><span>{formatMoney(item.amountPaise)}</span></div><div className="bar-track"><span style={{ width: `${summary.spentPaise ? item.amountPaise / summary.spentPaise * 100 : 0}%` }} /></div></div>)}</div> : <p className="muted">Your category breakdown will appear after you add an expense.</p>}</section></div>
    </>}
  </div>;
}
