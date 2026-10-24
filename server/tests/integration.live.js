import 'dotenv/config';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { connectDatabase } from '../src/config/db.js';
import User from '../src/models/User.js';
import Expense from '../src/models/Expense.js';
import Budget from '../src/models/Budget.js';

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  throw new Error('Set MONGODB_URI and JWT_SECRET in server/.env before the live integration test');
}

let server;
const userIds = [];
try {
  await connectDatabase(process.env.MONGODB_URI);
  server = await new Promise((resolve, reject) => {
    const instance = app.listen(0, '127.0.0.1', () => resolve(instance));
    instance.on('error', reject);
  });
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  async function request(path, { method = 'GET', body, cookie } = {}) {
    const response = await fetch(base + path, {
      method,
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = response.status === 204 ? null : await response.json();
    return { response, data, cookie: response.headers.get('set-cookie')?.split(';')[0] };
  }

  const suffix = randomUUID().slice(0, 12);
  const password = `Test-${randomUUID()}!`;
  const a = await request('/api/auth/register', { method: 'POST', body: { name: 'Test User A', email: `campusbudget-a-${suffix}@example.invalid`, password } });
  assert.equal(a.response.status, 201);
  userIds.push(a.data.user.id);
  const b = await request('/api/auth/register', { method: 'POST', body: { name: 'Test User B', email: `campusbudget-b-${suffix}@example.invalid`, password } });
  assert.equal(b.response.status, 201);
  userIds.push(b.data.user.id);

  const unauthenticated = await request('/api/expenses');
  assert.equal(unauthenticated.response.status, 401);

  const month = '2026-01';
  const budget = await request(`/api/budgets/${month}`, { method: 'PUT', cookie: a.cookie, body: { limitPaise: 500000 } });
  assert.equal(budget.response.status, 200);
  const validExpense = { title: 'Canteen lunch', amountPaise: 12550, category: 'Food', spentAt: '2026-01-15', note: 'Test record' };
  const created = await request('/api/expenses', { method: 'POST', cookie: a.cookie, body: validExpense });
  assert.equal(created.response.status, 201);
  const id = created.data.expense._id;

  const invalid = await request('/api/expenses', { method: 'POST', cookie: a.cookie, body: { ...validExpense, amountPaise: -1 } });
  assert.equal(invalid.response.status, 400);
  const listA = await request(`/api/expenses?month=${month}&category=Food&page=1&limit=10`, { cookie: a.cookie });
  assert.equal(listA.data.pagination.total, 1);
  const listB = await request(`/api/expenses?month=${month}`, { cookie: b.cookie });
  assert.equal(listB.data.pagination.total, 0);
  const otherUserRead = await request(`/api/expenses/${id}`, { cookie: b.cookie });
  assert.equal(otherUserRead.response.status, 404);
  const otherUserDelete = await request(`/api/expenses/${id}`, { method: 'DELETE', cookie: b.cookie });
  assert.equal(otherUserDelete.response.status, 404);

  const summary = await request(`/api/budgets/${month}/summary`, { cookie: a.cookie });
  assert.equal(summary.data.spentPaise, 12550);
  assert.equal(summary.data.remainingPaise, 487450);

  const updated = await request(`/api/expenses/${id}`, { method: 'PUT', cookie: a.cookie, body: { ...validExpense, amountPaise: 15000 } });
  assert.equal(updated.response.status, 200);
  const removed = await request(`/api/expenses/${id}`, { method: 'DELETE', cookie: a.cookie });
  assert.equal(removed.response.status, 204);
  console.log('Live integration passed: auth, validation, expense CRUD, filtering, budget summary, and ownership.');
} finally {
  if (server) await new Promise(resolve => server.close(resolve));
  if (mongoose.connection.readyState === 1 && userIds.length) {
    await Promise.all([
      Expense.deleteMany({ user: { $in: userIds } }),
      Budget.deleteMany({ user: { $in: userIds } }),
    ]);
    await User.deleteMany({ _id: { $in: userIds } });
  }
  await mongoose.disconnect();
}
