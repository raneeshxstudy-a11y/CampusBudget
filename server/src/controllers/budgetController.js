import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';
import mongoose from 'mongoose';
import { HttpError } from '../middleware/errorHandler.js';
import { assertMonth, monthRange, parsePositiveInteger } from '../middleware/validateRequest.js';

export async function getBudget(req, res) {
  const month = assertMonth(req.params.month);
  const budget = await Budget.findOne({ user: req.userId, month }).lean();
  res.json({ budget: budget || null });
}

export async function upsertBudget(req, res) {
  const month = assertMonth(req.params.month);
  if (!req.body || Object.keys(req.body).length !== 1 || !Object.hasOwn(req.body, 'limitPaise')) {
    throw new HttpError(400, 'Only limitPaise is allowed');
  }
  const limitPaise = parsePositiveInteger(req.body.limitPaise, 'Budget', 1000000000);
  const budget = await Budget.findOneAndUpdate(
    { user: req.userId, month }, { $set: { limitPaise } }, { upsert: true, returnDocument: 'after', runValidators: true },
  );
  res.json({ budget });
}

export async function getSummary(req, res) {
  const month = assertMonth(req.params.month);
  const [budget, totals] = await Promise.all([
    Budget.findOne({ user: req.userId, month }).lean(),
    Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.userId), spentAt: monthRange(month) } },
      { $group: { _id: '$category', amountPaise: { $sum: '$amountPaise' }, count: { $sum: 1 } } },
      { $sort: { amountPaise: -1 } },
    ]),
  ]);
  const spentPaise = totals.reduce((sum, item) => sum + item.amountPaise, 0);
  res.json({ month, budgetPaise: budget?.limitPaise ?? 0, spentPaise, remainingPaise: (budget?.limitPaise ?? 0) - spentPaise, categories: totals.map(item => ({ category: item._id, amountPaise: item.amountPaise, count: item.count })) });
}
