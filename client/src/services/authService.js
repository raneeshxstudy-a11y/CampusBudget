import { api } from './api.js';

export const authService = {
  me: () => api('/auth/me'),
  register: (details) => api('/auth/register', { method: 'POST', body: JSON.stringify(details) }),
  login: (details) => api('/auth/login', { method: 'POST', body: JSON.stringify(details) }),
  logout: () => api('/auth/logout', { method: 'POST' }),
};
