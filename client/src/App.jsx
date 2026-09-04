// src/App.jsx
// Root router — defines all application routes

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ROUTES } from './utils/constants';

// Pages — existing
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Pages — Customer module
import CustomerListPage   from './pages/customers/CustomerListPage';
import CustomerNewPage    from './pages/customers/CustomerNewPage';
import CustomerDetailPage from './pages/customers/CustomerDetailPage';
import CustomerEditPage   from './pages/customers/CustomerEditPage';

// Pages — Book Discovery module (public)
import BooksPage      from './pages/books/BooksPage';
import BookDetailPage from './pages/books/BookDetailPage';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Public ── */}
          <Route path={ROUTES.HOME}     element={<HomePage />} />
          <Route path={ROUTES.LOGIN}    element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

          {/* ── Protected — Dashboard ── */}
          <Route
            path={ROUTES.DASHBOARD}
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />

          {/* ── Protected — Customers ── */}
          <Route
            path={ROUTES.CUSTOMERS}
            element={<ProtectedRoute><CustomerListPage /></ProtectedRoute>}
          />
          <Route
            path={ROUTES.CUSTOMER_NEW}
            element={<ProtectedRoute><CustomerNewPage /></ProtectedRoute>}
          />
          <Route
            path={ROUTES.CUSTOMER_DETAIL}
            element={<ProtectedRoute><CustomerDetailPage /></ProtectedRoute>}
          />
          <Route
            path={ROUTES.CUSTOMER_EDIT}
            element={<ProtectedRoute><CustomerEditPage /></ProtectedRoute>}
          />

          {/* ── Public — Books ── */}
          <Route path={ROUTES.BOOKS}       element={<BooksPage />} />
          <Route path={ROUTES.BOOK_DETAIL} element={<BookDetailPage />} />

          {/* ── 404 ── */}
          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

