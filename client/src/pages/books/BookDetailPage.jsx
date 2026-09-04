// src/pages/books/BookDetailPage.jsx
// Full book detail view — cover, all metadata, description

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { fetchBookById } from '../../services/bookService';
import '../../components/books/books.css';

const MetaItem = ({ label, value }) =>
  value ? (
    <div className="bk-detail__meta-item">
      <label>{label}</label>
      <span>{value}</span>
    </div>
  ) : null;

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchBookById(id);
        setBook(res.data.book);
      } catch (err) {
        if (err.status === 404 || err.status === 400) setNotFound(true);
        else setError(err.message || 'Failed to load book details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <MainLayout>
        <div className="bk-page">
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40, maxWidth: 900, margin: '0 auto' }}>
            <div className="bk-skeleton-card" style={{ height: 420, borderRadius: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[40, 24, 32, 80, 16, 16, 100].map((h, i) => (
                <div key={i} className="bk-skeleton-card" style={{ height: h, borderRadius: 8, width: i === 0 ? '60%' : '100%' }} />
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <MainLayout>
        <div className="bk-page">
          <div className="bk-empty">
            <div className="bk-empty__icon">❓</div>
            <h3>Book not found</h3>
            <p>This book doesn't exist or has been removed.</p>
            <Link to="/books" className="btn btn--primary" style={{ marginTop: 16 }}>← Browse Books</Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── API error ────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <MainLayout>
        <div className="bk-page">
          <div className="bk-error">
            <div className="bk-error__icon">⚠️</div>
            <h3>Failed to load</h3>
            <p>{error}</p>
            <button className="btn btn--ghost" style={{ marginTop: 16 }} onClick={() => navigate('/books')}>← Go Back</button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const {
    title, author, category, description, price,
    stock, coverImage, publisher, publishedYear,
    language, pages, isbn, available,
  } = book;

  const isAvailable = available !== undefined ? available : stock > 0;

  return (
    <MainLayout>
      <div className="bk-page">

        {/* Breadcrumb */}
        <nav className="bk-breadcrumb">
          <Link to="/books">Books</Link>
          <span>›</span>
          <span>{category}</span>
          <span>›</span>
          <span>{title}</span>
        </nav>

        <div className="bk-detail">
          {/* Cover */}
          <div className="bk-detail__cover">
            {coverImage ? (
              <img src={coverImage} alt={`Cover of ${title}`} />
            ) : (
              <div className="bk-detail__cover-placeholder" aria-hidden>📖</div>
            )}
          </div>

          {/* Info */}
          <div className="bk-detail__info">
            <p className="bk-detail__category">{category}</p>
            <h1 className="bk-detail__title">{title}</h1>
            <p className="bk-detail__author">by <strong>{author}</strong></p>

            {/* Meta grid */}
            <div className="bk-detail__meta">
              <MetaItem label="Published"  value={publishedYear} />
              <MetaItem label="Publisher"  value={publisher} />
              <MetaItem label="Language"   value={language} />
              <MetaItem label="Pages"      value={pages} />
              <MetaItem label="ISBN"       value={isbn} />
              <MetaItem label="Stock"      value={stock !== undefined ? `${stock} copies` : undefined} />
            </div>

            {/* Price + availability */}
            <div className="bk-detail__price">
              ${Number(price).toFixed(2)}
              <span className={`bk-detail__avail-badge ${isAvailable ? 'bk-detail__avail-badge--in' : 'bk-detail__avail-badge--out'}`}>
                {isAvailable ? '✅ In Stock' : '❌ Out of Stock'}
              </span>
            </div>

            {/* Description */}
            {description && (
              <div>
                <p className="bk-detail__desc-heading">About this book</p>
                <p className="bk-detail__desc">{description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="bk-detail__actions">
              <Link to="/books" className="btn btn--secondary">← Browse More</Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BookDetailPage;
