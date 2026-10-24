import { Link } from 'react-router-dom';
import { formatMoney } from '../services/money.js';

export default function BudgetSummary({ summary, linkToBudget = false }) {
  const budget = summary.budgetPaise;
  const percent = budget ? Math.min(100, Math.round(summary.spentPaise / budget * 100)) : 0;
  const Container = linkToBudget ? Link : 'section';
  return <Container className={`budget-summary panel${linkToBudget ? ' budget-summary-link' : ''}`} {...(linkToBudget ? { to: '/budget', 'aria-label': 'View monthly budget' } : {})}>
    <div className="summary-head"><div><span className="eyebrow">MONTHLY BUDGET</span><h2>{budget ? formatMoney(budget) : 'No budget set'}</h2></div><div className="summary-percent">{budget ? `${percent}% used` : 'Get started'}</div></div>
    <div className="progress-track" role="progressbar" aria-label="Budget used" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${percent}%` }} className={summary.remainingPaise < 0 ? 'over-budget' : ''} /></div>
    <div className="summary-foot"><span>Spent <strong>{formatMoney(summary.spentPaise)}</strong></span><span>Remaining <strong className={summary.remainingPaise < 0 ? 'negative' : ''}>{formatMoney(summary.remainingPaise)}</strong></span></div>
  </Container>;
}
