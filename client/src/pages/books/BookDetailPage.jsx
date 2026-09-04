// src/pages/books/BookDetailPage.jsx
// Full book detail view — cover, all metadata, description
// Uses the shared /api/books/:id endpoint (same data as Admin module)

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { fetchBookById } from '../../services/bookService';
import '../../components/books/books.css';

const BookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError]       = useState('');
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      setError('');
      setImgError(false);
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

  // ── All fields come from the single shared Book model ──────────────────────
  // Fields: _id, title, author, category, price, stock, description,
  //         coverImage, available, createdAt, updatedAt
  const {
    title, author, category, description,
    price, stock, coverImage, available,
  } = book;

  // `available` is always stored server-side (stock > 0 → true, stock = 0 → false).
  // The fallback handles any legacy documents that predate the stored field.
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
            {coverImage && !imgError ? (
              <img
                src={coverImage}
                alt={`Cover of ${title}`}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="bk-detail__cover-placeholder" aria-hidden>📖</div>
            )}
          </div>

          {/* Info */}
          <div className="bk-detail__info">
            <p className="bk-detail__category">{category}</p>
            <h1 className="bk-detail__title">{title}</h1>
            <p className="bk-detail__author">by <strong>{author}</strong></p>

            {/* Core meta — uses only fields guaranteed by the Book model */}
            <div className="bk-detail__meta">
              <div className="bk-detail__meta-item">
                <label>Stock</label>
                <span>{stock !== undefined ? `${stock} copies` : '—'}</span>
              </div>
              <div className="bk-detail__meta-item">
                <label>Category</label>
                <span>{category}</span>
              </div>
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
