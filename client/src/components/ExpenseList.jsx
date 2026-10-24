import { formatMoney } from '../services/money.js';

export default function ExpenseList({ items, onEdit, onDelete, deletingId }) {
  return <div className="expense-list">{items.map(item => <article className="expense-row" key={item._id}>
    <span className={`category-icon category-${item.category.toLowerCase()}`} aria-hidden="true">{item.category[0]}</span>
    <div className="expense-name"><strong>{item.title}</strong><small>{item.category} · {new Date(item.spentAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</small>{item.note && <small>{item.note}</small>}</div>
    <strong className="expense-amount">−{formatMoney(item.amountPaise)}</strong>
    {onEdit && <div className="row-actions"><button className="text-button" onClick={() => onEdit(item)}>Edit</button><button className="text-button danger" onClick={() => onDelete(item)} disabled={deletingId === item._id}>{deletingId === item._id ? 'Deleting…' : 'Delete'}</button></div>}
  </article>)}</div>;
}
