import { api } from './api.js';

export const expenseService = {
  list: (params) => api(`/expenses?${new URLSearchParams(params)}`),
  create: (expense) => api('/expenses', { method: 'POST', body: JSON.stringify(expense) }),
  update: (id, expense) => api(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(expense) }),
  remove: (id) => api(`/expenses/${id}`, { method: 'DELETE' }),
};
