import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { useAuth } from './hooks/useAuth.js';
import Layout from './components/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ExpensesPage from './pages/ExpensesPage.jsx';
import BudgetPage from './pages/BudgetPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="center-message" role="status">Loading your account…</div>;
  return user ? children : <Navigate to="/login" replace />;
}

function Guest({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="center-message" role="status">Loading…</div>;
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return <AuthProvider><BrowserRouter><Routes>
    <Route path="/login" element={<Guest><LoginPage /></Guest>} />
    <Route path="/register" element={<Guest><RegisterPage /></Guest>} />
    <Route element={<Protected><Layout /></Protected>}>
      <Route index element={<DashboardPage />} />
      <Route path="expenses" element={<ExpensesPage />} />
      <Route path="budget" element={<BudgetPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes></BrowserRouter></AuthProvider>;
}
