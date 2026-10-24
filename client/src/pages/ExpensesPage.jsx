import { useCallback, useEffect, useState } from 'react';
import ExpenseForm from '../components/ExpenseForm.jsx';
import ExpenseList from '../components/ExpenseList.jsx';
import { expenseService } from '../services/expenseService.js';
import { currentMonth } from '../services/money.js';

const categories = ['All categories', 'Food', 'Transport', 'Study', 'Housing', 'Health', 'Entertainment', 'Other'];

export default function ExpensesPage() {
  const [month, setMonth] = useState(currentMonth());
  const [category, setCategory] = useState('All categories');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], pagination: { page: 1, pages: 0, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const load = useCallback(async () => {
    const params = { month, page, limit: 10 };
    if (category !== 'All categories') params.category = category;
    if (search.trim()) params.search = search.trim();
    return expenseService.list(params);
  }, [month, category, search, page]);

  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    const timer = setTimeout(() => { load().then(result => { if (active) setData(result); }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); }); }, search ? 300 : 0);
    return () => { active = false; clearTimeout(timer); };
  }, [load, refresh, search]);

  async function save(expense) {
    setBusy(true);
    try {
      if (editing) await expenseService.update(editing._id, expense);
      else await expenseService.create(expense);
      setEditing(null); setFormOpen(false); setPage(1); setRefresh(value => value + 1);
    } finally { setBusy(false); }
  }

  async function remove(expense) {
    if (!window.confirm(`Delete “${expense.title}”? This cannot be undone.`)) return;
    setDeletingId(expense._id); setError('');
    try { await expenseService.remove(expense._id); setRefresh(value => value + 1); }
    catch (err) { setError(err.message); }
    finally { setDeletingId(null); }
  }

  return <div className="page-container"><div className="page-top"><div><span className="eyebrow">KEEP TRACK</span><h1>Your expenses</h1><p>Every little expense is part of the bigger picture.</p></div><button className="button primary" onClick={() => { setEditing(null); setFormOpen(true); }}>+ Add expense</button></div>
    {formOpen && <section className="panel form-panel"><div className="section-head"><div><span className="eyebrow">{editing ? 'UPDATE RECORD' : 'NEW RECORD'}</span><h2>{editing ? 'Edit expense' : 'Add an expense'}</h2></div></div><ExpenseForm key={editing?._id || 'new'} initial={editing} onSave={save} onCancel={() => { setFormOpen(false); setEditing(null); }} busy={busy} /></section>}
    <section className="panel list-panel"><div className="section-head"><div><span className="eyebrow">SPENDING HISTORY</span><h2>All expenses</h2></div><span className="count-label">{data.pagination.total} records</span></div><div className="filters"><label>Month<input type="month" value={month} onChange={e => { setMonth(e.target.value); setPage(1); }} /></label><label>Category<select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>{categories.map(item => <option key={item}>{item}</option>)}</select></label><label>Search<input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} maxLength="100" placeholder="Search expense title" /></label></div>
      {error && <div className="form-error" role="alert">{error} <button className="text-button" onClick={() => setRefresh(value => value + 1)}>Try again</button></div>}
      {loading ? <div className="state-panel" role="status">Loading expenses…</div> : data.items.length ? <ExpenseList items={data.items} onEdit={item => { setEditing(item); setFormOpen(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onDelete={remove} deletingId={deletingId} /> : <div className="empty-state"><div className="empty-icon">₹</div><h3>No expenses found</h3><p>Try another month or category, or add a new expense.</p></div>}
      {data.pagination.pages > 1 && <div className="pagination"><button className="button secondary" disabled={page <= 1} onClick={() => setPage(value => value - 1)}>Previous</button><span>Page {page} of {data.pagination.pages}</span><button className="button secondary" disabled={page >= data.pagination.pages} onClick={() => setPage(value => value + 1)}>Next</button></div>}
    </section></div>;
}
