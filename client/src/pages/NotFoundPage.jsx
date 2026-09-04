// src/pages/NotFoundPage.jsx

import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to={ROUTES.HOME} className="btn btn--primary">
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
