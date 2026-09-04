// src/pages/admin/books/AdminBookDetailPage.jsx
// Admin — View full book details with edit/delete actions

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import Toast from '../../../components/admin/Toast';
import useToast from '../../../hooks/useToast';
import { fetchBookById, deleteBook } from '../../../services/bookService';
import '../../../components/admin/admin-books.css';

const AdminBookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook]                 = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [imgError, setImgError]         = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toasts, showToast, closeToast] = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchBookById(id);
        setBook(res.data.book);
      } catch (err) {
        setError(err.message || 'Book not found.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteBook(id);
      showToast('Book deleted. Redirecting…', 'success');
      setTimeout(() => navigate('/admin/books'), 1500);
    } catch (err) {
      showToast(err.message || 'Delete failed.', 'error');
      setDeleteLoading(false);
      setShowConfirm(false);
    }
  };

  const fmt = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  return (
    <MainLayout>
      <div className="ab-page">

        {/* Breadcrumb */}
        <nav className="ab-breadcrumb" aria-label="Breadcrumb">
          <a href="/admin/books">Books</a>
          <span className="ab-breadcrumb__sep">›</span>
          <span>{book ? book.title : 'Details'}</span>
        </nav>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
            <div className="ab-skeleton-row" style={{ height: 380, borderRadius: 14 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="ab-skeleton-row" style={{ height: 32 + (i === 0 ? 12 : 0) }} />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="ab-error">
            <div className="ab-error__icon">⚠️</div>
            <h3>Book not found</h3>
            <p>{error}</p>
            <Link to="/admin/books" className="btn btn--secondary" style={{ marginTop: 12 }}>
              Back to Books
            </Link>
          </div>
        )}

        {/* Detail */}
        {!loading && book && (
          <>
            {/* Action bar */}
            <div className="ab-header" style={{ marginBottom: 24 }}>
              <div className="ab-header__left">
                <h1 className="ab-header__title">{book.title}</h1>
                <p className="ab-header__subtitle">by {book.author}</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link to={`/admin/books/${id}/edit`} className="btn btn--secondary" id="edit-book-btn">
                  ✏️ Edit
                </Link>
                <button
                  className="btn btn--danger"
                  onClick={() => setShowConfirm(true)}
                  id="delete-book-btn"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>

            {/* Two-column detail layout */}
            <div className="ab-detail">
              {/* Cover */}
              <div className="ab-detail__cover-wrap">
                {book.coverImage && !imgError ? (
                  <img
                    src={book.coverImage}
                    alt={`Cover of ${book.title}`}
                    className="ab-detail__cover-img"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="ab-detail__cover-placeholder">📖</div>
                )}
              </div>

              {/* Info */}
              <div className="ab-detail__info">
                <p className="ab-detail__category">{book.category}</p>
                <h2 className="ab-detail__title">{book.title}</h2>
                <p className="ab-detail__author">by {book.author}</p>

                {/* Meta grid */}
                <div className="ab-detail__meta">
                  <div className="ab-detail__meta-item">
                    <label>Price</label>
                    <span>${Number(book.price).toFixed(2)}</span>
                  </div>
                  <div className="ab-detail__meta-item">
                    <label>Stock</label>
                    <span>{book.stock}</span>
                  </div>
                  <div className="ab-detail__meta-item">
                    <label>Availability</label>
                    <span>
                      <span className={`ab-badge ${book.available ? 'ab-badge--available' : 'ab-badge--unavailable'}`}>
                        {book.available ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="ab-detail__price">
                  ${Number(book.price).toFixed(2)}
                  <span className={`ab-badge ${book.available ? 'ab-badge--available' : 'ab-badge--unavailable'}`}>
                    {book.available ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                {/* Description */}
                {book.description && (
                  <div>
                    <p className="ab-detail__desc-label">Description</p>
                    <p className="ab-detail__desc">{book.description}</p>
                  </div>
                )}

                {/* Dates */}
                <div className="ab-detail__dates">
                  <span>Created: {fmt(book.createdAt)}</span>
                  <span>Updated: {fmt(book.updatedAt)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Confirm delete */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Delete Book"
        message={book ? `Delete "${book.title}"? This cannot be undone.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        loading={deleteLoading}
      />

      <Toast toasts={toasts} onClose={closeToast} />
    </MainLayout>
  );
};

export default AdminBookDetailPage;
