// src/components/customers/CustomerCard.jsx
// Single customer card shown in the list/grid view

import { Link } from 'react-router-dom';
import Button from '../Button';

const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

const CustomerCard = ({ customer, onDelete }) => {
  const { _id, name, email, phone, address } = customer;
  const cityCountry = [address?.city, address?.country].filter(Boolean).join(', ');

  return (
    <article className="cm-card">
      <div className="cm-card__top">
        <div className="cm-card__avatar" aria-hidden="true">
          {initials(name)}
        </div>
        <div>
          <p className="cm-card__name">{name}</p>
          {cityCountry && (
            <p className="cm-card__email" style={{ fontSize: 12 }}>
              📍 {cityCountry}
            </p>
          )}
        </div>
      </div>

      <p className="cm-card__email">✉️ {email}</p>
      <p className="cm-card__phone">📞 {phone}</p>

      <div className="cm-card__actions">
        <Link to={`/customers/${_id}`} className="btn btn--secondary btn--sm">
          View
        </Link>
        <Link to={`/customers/${_id}/edit`} className="btn btn--ghost btn--sm">
          Edit
        </Link>
        <Button
          variant="danger"
          className="btn--sm"
          onClick={() => onDelete(customer)}
        >
          Delete
        </Button>
      </div>
    </article>
  );
};

export default CustomerCard;
