import { createContext, useEffect, useState } from 'react';
import { authService } from '../services/authService.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.me().then(({ user }) => setUser(user)).catch(() => setUser(null)).finally(() => setLoading(false));
  }, []);

  async function login(details) {
    const result = await authService.login(details);
    setUser(result.user);
    return result.user;
  }

  async function register(details) {
    const result = await authService.register(details);
    setUser(result.user);
    return result.user;
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
