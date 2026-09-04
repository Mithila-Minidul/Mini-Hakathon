// src/pages/LoginPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { loginUser } from '../services/authService';
import { ROUTES } from '../utils/constants';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(form);
      login(res.data.token, res.data.user);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2>Sign In</h2>
      {error && <p className="form__error">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="form__group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form__group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <Button type="submit" loading={loading}>
          Login
        </Button>
      </form>
      <p>
        Don't have an account? <Link to={ROUTES.REGISTER}>Register</Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
