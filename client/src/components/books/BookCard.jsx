// src/components/books/BookCard.jsx
// Individual book card shown in the discovery grid

import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const { _id, title, author, category, price, stock, coverImage, available } = book;
  const isAvailable = available !== undefined ? available : stock > 0;

  return (
    <article className="bk-card">
      {/* Cover */}
      <Link to={`/books/${_id}`} className="bk-card__cover" aria-label={`View details for ${title}`}>
        {coverImage ? (
          <img src={coverImage} alt={`Cover of ${title}`} loading="lazy" />
        ) : (
          <div className="bk-card__cover-placeholder" aria-hidden>📖</div>
        )}
        <span className={`bk-card__badge ${isAvailable ? 'bk-card__badge--available' : 'bk-card__badge--unavailable'}`}>
          {isAvailable ? 'In Stock' : 'Out of Stock'}
        </span>
      </Link>

      {/* Body */}
      <div className="bk-card__body">
        <p className="bk-card__category">{category}</p>
        <h3 className="bk-card__title" title={title}>{title}</h3>
        <p className="bk-card__author">by {author}</p>
      </div>

      {/* Footer */}
      <div className="bk-card__footer">
        <span className="bk-card__price">${Number(price).toFixed(2)}</span>
        <Link to={`/books/${_id}`} className="bk-card__btn">
          View Details
        </Link>
      </div>
    </article>
  );
};

export default BookCard;
