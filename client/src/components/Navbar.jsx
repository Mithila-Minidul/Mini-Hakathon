// src/components/Navbar.jsx
// Top navigation bar — uses AuthContext to show/hide links

import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to={ROUTES.HOME} className="navbar__brand">
        Mini Hakathon
      </Link>

      <ul className="navbar__links">
        {/* Always visible — Books is a public page */}
        <li>
          <Link to={ROUTES.BOOKS}>📚 Books</Link>
        </li>

        {isAuthenticated ? (
          <>
            <li>
              <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
            </li>
            <li>
              <Link to={ROUTES.CUSTOMERS}>Customers</Link>
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
              <Link to={ROUTES.LOGIN}>Login</Link>
            </li>
            <li>
              <Link to={ROUTES.REGISTER} className="btn btn--primary">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
