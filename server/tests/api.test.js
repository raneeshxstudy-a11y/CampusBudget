import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

test('protected API rejects requests without a session', async () => {
  const server = app.listen(0);
  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/expenses`);
    assert.equal(response.status, 401);
    const body = await response.json();
    assert.match(body.error.message, /sign in/i);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test('health endpoint reports disconnected database', async () => {
  const server = app.listen(0);
  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    assert.equal(response.status, 503);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
