import mongoose from 'mongoose';
import { CATEGORIES } from '../models/Expense.js';
import { HttpError } from './errorHandler.js';

export function assertId(id) {
  if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'Invalid ID');
}

export function assertMonth(month) {
  if (typeof month !== 'string' || !/^(20\d{2}|21\d{2})-(0[1-9]|1[0-2])$/.test(month)) {
    throw new HttpError(400, 'Month must be YYYY-MM');
  }
  return month;
}

export function monthRange(month) {
  assertMonth(month);
  const [year, number] = month.split('-').map(Number);
  return {
    $gte: new Date(Date.UTC(year, number - 1, 1)),
    $lt: new Date(Date.UTC(year, number, 1)),
  };
}

export function parsePositiveInteger(value, field, maximum) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1 || number > maximum) {
    throw new HttpError(400, `${field} must be a positive whole number up to ${maximum}`);
  }
  return number;
}

export function validateExpense(input) {
  const allowed = ['title', 'amountPaise', 'category', 'spentAt', 'note'];
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !allowed.includes(key))) {
    throw new HttpError(400, 'Invalid expense fields');
  }
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  const note = input.note === undefined ? '' : input.note;
  if (title.length < 2 || title.length > 100) throw new HttpError(400, 'Title must be 2–100 characters');
  const amountPaise = parsePositiveInteger(input.amountPaise, 'Amount', 1000000000);
  if (!CATEGORIES.includes(input.category)) throw new HttpError(400, 'Choose a valid category');
  if (typeof input.spentAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(input.spentAt)) throw new HttpError(400, 'Date must be YYYY-MM-DD');
  const spentAt = new Date(`${input.spentAt}T00:00:00.000Z`);
  const indiaToday = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  if (Number.isNaN(spentAt.getTime()) || spentAt.toISOString().slice(0, 10) !== input.spentAt || input.spentAt > indiaToday) {
    throw new HttpError(400, 'Choose a valid date that is not in the future');
  }
  if (typeof note !== 'string' || note.length > 500) throw new HttpError(400, 'Note must be at most 500 characters');
  return { title, amountPaise, category: input.category, spentAt, note: note.trim() };
}
