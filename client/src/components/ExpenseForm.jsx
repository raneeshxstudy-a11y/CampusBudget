import { useState } from 'react';
import { toPaise, todayLocal } from '../services/money.js';

const categories = ['Food', 'Transport', 'Study', 'Housing', 'Health', 'Entertainment', 'Other'];

export default function ExpenseForm({ initial, onSave, onCancel, busy }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [amount, setAmount] = useState(initial ? String(initial.amountPaise / 100) : '');
  const [category, setCategory] = useState(initial?.category || 'Food');
  const [spentAt, setSpentAt] = useState(initial?.spentAt?.slice(0, 10) || todayLocal());
  const [note, setNote] = useState(initial?.note || '');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    const amountPaise = toPaise(amount);
    if (title.trim().length < 2) return setError('Enter a title with at least 2 characters.');
    if (!amountPaise) return setError('Enter a valid amount greater than zero, with up to 2 decimal places.');
    if (!spentAt || spentAt > todayLocal()) return setError('Choose a valid date that is not in the future.');
    setError('');
    try { await onSave({ title: title.trim(), amountPaise, category, spentAt, note: note.trim() }); }
    catch (err) { setError(err.message); }
  }

  return <form className="expense-form" onSubmit={submit}>
    <div className="form-grid">
      <label>What was it for?<input value={title} onChange={e => setTitle(e.target.value)} maxLength="100" placeholder="e.g. Lunch at canteen" required /></label>
      <label>Amount (₹)<input inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required /></label>
      <label>Category<select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select></label>
      <label>Date<input type="date" value={spentAt} max={todayLocal()} onChange={e => setSpentAt(e.target.value)} required /></label>
    </div>
    <label>Note <span className="optional">(optional)</span><textarea value={note} onChange={e => setNote(e.target.value)} maxLength="500" rows="3" placeholder="Anything you want to remember" /></label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button type="button" className="button secondary" onClick={onCancel}>Cancel</button><button className="button primary" disabled={busy}>{busy ? 'Saving…' : initial ? 'Save changes' : 'Add expense'}</button></div>
  </form>;
}
