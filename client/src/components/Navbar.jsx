// src/components/Navbar.jsx
// Top navigation bar — uses AuthContext to show/hide links

import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to={ROUTES.HOME} className="navbar__brand">
        📚 BookLedger
      </Link>

      <ul className="navbar__links">
        {/* Public — Book Discovery */}
        <li>
          <NavLink to={ROUTES.BOOKS}>Books</NavLink>
        </li>

        {/* Admin — Book Management (always visible for demo) */}
        <li>
          <NavLink
            to={ROUTES.ADMIN_BOOKS}
            style={({ isActive }) =>
              isActive ? { color: '#6366f1', fontWeight: 700 } : {}
            }
          >
            🛠 Admin
          </NavLink>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <NavLink to={ROUTES.DASHBOARD}>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.CUSTOMERS}>Customers</NavLink>
            </li>
            <li>
              <button onClick={logout} className="btn btn--ghost">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to={ROUTES.LOGIN}>Login</NavLink>
            </li>
            <li>
              <NavLink to={ROUTES.REGISTER} className="btn btn--primary">
                Register
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
