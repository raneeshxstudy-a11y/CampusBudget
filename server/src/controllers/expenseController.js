import Expense, { CATEGORIES } from '../models/Expense.js';
import { HttpError } from '../middleware/errorHandler.js';
import { assertId, assertMonth, monthRange, parsePositiveInteger, validateExpense } from '../middleware/validateRequest.js';

export async function listExpenses(req, res) {
  const allowed = ['month', 'category', 'search', 'page', 'limit'];
  if (Object.keys(req.query).some(key => !allowed.includes(key))) throw new HttpError(400, 'Invalid filter');
  const page = req.query.page === undefined ? 1 : parsePositiveInteger(req.query.page, 'Page', 100000);
  const limit = req.query.limit === undefined ? 10 : parsePositiveInteger(req.query.limit, 'Limit', 50);
  const filter = { user: req.userId };
  if (req.query.month) filter.spentAt = monthRange(assertMonth(req.query.month));
  if (req.query.category) {
    if (typeof req.query.category !== 'string' || !CATEGORIES.includes(req.query.category)) throw new HttpError(400, 'Invalid category');
    filter.category = req.query.category;
  }
  if (req.query.search) {
    if (typeof req.query.search !== 'string' || req.query.search.length > 100) throw new HttpError(400, 'Search must be at most 100 characters');
    const escaped = req.query.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (escaped) filter.title = { $regex: escaped, $options: 'i' };
  }
  const [items, total] = await Promise.all([
    Expense.find(filter).sort({ spentAt: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Expense.countDocuments(filter),
  ]);
  res.json({ items, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function createExpense(req, res) {
  const data = validateExpense(req.body);
  const expense = await Expense.create({ ...data, user: req.userId });
  res.status(201).json({ expense });
}

export async function getExpense(req, res) {
  assertId(req.params.id);
  const expense = await Expense.findOne({ _id: req.params.id, user: req.userId });
  if (!expense) throw new HttpError(404, 'Expense not found');
  res.json({ expense });
}

export async function updateExpense(req, res) {
  assertId(req.params.id);
  const data = validateExpense(req.body);
  const expense = await Expense.findOneAndUpdate({ _id: req.params.id, user: req.userId }, data, { returnDocument: 'after', runValidators: true });
  if (!expense) throw new HttpError(404, 'Expense not found');
  res.json({ expense });
}

export async function deleteExpense(req, res) {
  assertId(req.params.id);
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!expense) throw new HttpError(404, 'Expense not found');
  res.status(204).end();
}
