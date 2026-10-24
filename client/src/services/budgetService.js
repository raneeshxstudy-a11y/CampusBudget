import { api } from './api.js';

export const budgetService = {
  get: (month) => api(`/budgets/${month}`),
  summary: (month) => api(`/budgets/${month}/summary`),
  save: (month, limitPaise) => api(`/budgets/${month}`, { method: 'PUT', body: JSON.stringify({ limitPaise }) }),
};
