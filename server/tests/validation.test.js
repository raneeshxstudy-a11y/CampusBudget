import test from 'node:test';
import assert from 'node:assert/strict';
import { assertMonth, monthRange, validateExpense } from '../src/middleware/validateRequest.js';

function sample() {
  return { title: 'Canteen lunch', amountPaise: 12550, category: 'Food', spentAt: '2026-01-15', note: '' };
}

test('validates and normalizes an expense', () => {
  const expense = validateExpense({ ...sample(), title: '  Canteen lunch  ' });
  assert.equal(expense.title, 'Canteen lunch');
  assert.equal(expense.amountPaise, 12550);
  assert.equal(expense.spentAt.toISOString(), '2026-01-15T00:00:00.000Z');
});

test('rejects unsafe or incorrect expense input', () => {
  assert.throws(() => validateExpense({ ...sample(), amountPaise: -5 }), /positive whole number/);
  assert.throws(() => validateExpense({ ...sample(), category: 'Not a category' }), /valid category/);
  assert.throws(() => validateExpense({ ...sample(), user: 'another user' }), /Invalid expense fields/);
  assert.throws(() => validateExpense({ ...sample(), spentAt: '2026-02-30' }), /valid date/);
});

test('month range ends at the start of the next month', () => {
  assertMonth('2026-12');
  const range = monthRange('2026-12');
  assert.equal(range.$gte.toISOString(), '2026-12-01T00:00:00.000Z');
  assert.equal(range.$lt.toISOString(), '2027-01-01T00:00:00.000Z');
  assert.throws(() => assertMonth('2026-13'), /YYYY-MM/);
});
