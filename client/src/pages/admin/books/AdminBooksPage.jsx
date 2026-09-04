// src/pages/admin/books/AdminBooksPage.jsx
// Admin — Book list with search, filters, stats, and inline delete

import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import ConfirmModal from '../../../components/admin/ConfirmModal';
import Toast from '../../../components/admin/Toast';
import useToast from '../../../hooks/useToast';
import { fetchBooks, deleteBook } from '../../../services/bookService';
import { BOOK_CATEGORIES } from '../../../utils/constants';
import '../../../components/admin/admin-books.css';

const LIMIT = 15;

const AdminBooksPage = () => {

  // ── Data state ────────────────────────────────────────────────────────────
  const [books, setBooks]           = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [pages, setPages]           = useState(1);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  // ── Filters state ─────────────────────────────────────────────────────────
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('');
  const [available, setAvailable]   = useState('');

  // ── Delete state ──────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget]   = useState(null); // { _id, title }
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Toast ─────────────────────────────────────────────────────────────────
  const [toasts, showToast, closeToast] = useToast();

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const load = useCallback(async (opts = {}) => { // eslint-disable-line react-hooks/exhaustive-deps
    setLoading(true);
    setError('');
    try {
      const res = await fetchBooks({
        search:    opts.search    ?? search,
        category:  opts.category  ?? category,
        available: opts.available ?? available,
        page:      opts.page      ?? page,
        limit:     LIMIT,
        sortBy:    'createdAt',
        order:     'desc',
      });
      setBooks(res.data.books);
      setTotal(res.data.total);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (err) {
      setError(err.message || 'Failed to load books.');
    } finally {
      setLoading(false);
    }
  }, [search, category, available, page]);

  useEffect(() => { load(); }, [load]);


  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  // ── Filter change helpers ─────────────────────────────────────────────────
  const handleCategoryChange = (val) => { setCategory(val); setPage(1); };
  const handleAvailableChange = (val) => { setAvailable(val); setPage(1); };

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = (book) => setDeleteTarget(book);
  const cancelDelete  = ()    => setDeleteTarget(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteBook(deleteTarget._id);
      showToast(`"${deleteTarget.title}" deleted successfully.`, 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.message || 'Delete failed.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────
  const inStock    = books.filter((b) => b.available).length;
  const outOfStock = books.filter((b) => !b.available).length;
  const avgPrice   = books.length ? (books.reduce((s, b) => s + b.price, 0) / books.length).toFixed(2) : '—';

  return (
    <MainLayout>
      <div className="ab-page">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="ab-header">
          <div className="ab-header__left">
            <h1 className="ab-header__title">📚 Book Management</h1>
            <p className="ab-header__subtitle">
              Manage your entire book catalogue — create, edit, and remove books.
            </p>
          </div>
          <Link to="/admin/books/new" className="btn btn--primary" id="add-book-btn">
            + Add Book
          </Link>
        </div>

        {/* ── Stats row ───────────────────────────────────────────────────── */}
        {!loading && !error && (
          <div className="ab-stats">
            <div className="ab-stat">
              <span className="ab-stat__icon">📦</span>
              <span className="ab-stat__label">Total Books</span>
              <span className="ab-stat__value">{total}</span>
            </div>
            <div className="ab-stat">
              <span className="ab-stat__icon">✅</span>
              <span className="ab-stat__label">In Stock (page)</span>
              <span className="ab-stat__value">{inStock}</span>
            </div>
            <div className="ab-stat">
              <span className="ab-stat__icon">❌</span>
              <span className="ab-stat__label">Out of Stock</span>
              <span className="ab-stat__value">{outOfStock}</span>
            </div>
            <div className="ab-stat">
              <span className="ab-stat__icon">💰</span>
              <span className="ab-stat__label">Avg Price (page)</span>
              <span className="ab-stat__value">{avgPrice === '—' ? '—' : `$${avgPrice}`}</span>
            </div>
          </div>
        )}

        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <div className="ab-toolbar">
          {/* Search */}
          <div className="ab-search">
            <span className="ab-search__icon">🔍</span>
            <input
              type="text"
              id="admin-search"
              placeholder="Search by title or author…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Search books"
            />
            {search && (
              <button
                className="ab-search__clear"
                onClick={() => handleSearchChange('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Category filter */}
          <select
            className="ab-select"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            id="admin-category-filter"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {BOOK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Availability filter */}
          <select
            className="ab-select"
            value={available}
            onChange={(e) => handleAvailableChange(e.target.value)}
            id="admin-availability-filter"
            aria-label="Filter by availability"
          >
            <option value="">All Availability</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>

          <span className="ab-toolbar__count">
            {total} book{total !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Loading ──────────────────────────────────────────────────────── */}
        {loading && (
          <div className="ab-table-wrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="ab-skeleton-row" />
            ))}
          </div>
        )}

        {/* ── Error ────────────────────────────────────────────────────────── */}
        {!loading && error && (
          <div className="ab-error">
            <div className="ab-error__icon">⚠️</div>
            <h3>Failed to load books</h3>
            <p>{error}</p>
            <button className="btn btn--secondary" onClick={() => load()} style={{ marginTop: 12 }}>
              Try again
            </button>
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────────────── */}
        {!loading && !error && books.length === 0 && (
          <div className="ab-empty">
            <div className="ab-empty__icon">📭</div>
            <h3>{search || category || available ? 'No books match your filters' : 'No books yet'}</h3>
            <p>
              {search || category || available
                ? 'Try adjusting your search or filters.'
                : 'Get started by adding your first book.'}
            </p>
            {!search && !category && !available && (
              <Link to="/admin/books/new" className="btn btn--primary" style={{ marginTop: 8 }}>
                + Add First Book
              </Link>
            )}
          </div>
        )}

        {/* ── Table ────────────────────────────────────────────────────────── */}
        {!loading && !error && books.length > 0 && (
          <div className="ab-table-wrap">
            <table className="ab-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    {/* Cover + title */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {book.coverImage ? (
                          <img src={book.coverImage} alt="" className="ab-table__cover" />
                        ) : (
                          <div className="ab-table__cover-placeholder">📖</div>
                        )}
                        <div>
                          <p className="ab-table__title" title={book.title}>{book.title}</p>
                          <p className="ab-table__author">by {book.author}</p>
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td>
                      <span className="ab-badge ab-badge--category">{book.category}</span>
                    </td>
                    {/* Price */}
                    <td className="ab-table__price">${Number(book.price).toFixed(2)}</td>
                    {/* Stock */}
                    <td className="ab-table__stock">{book.stock}</td>
                    {/* Availability */}
                    <td>
                      <span className={`ab-badge ${book.available ? 'ab-badge--available' : 'ab-badge--unavailable'}`}>
                        {book.available ? '● In Stock' : '● Out of Stock'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td>
                      <div className="ab-table__actions">
                        <Link
                          to={`/admin/books/${book._id}`}
                          className="ab-btn-icon ab-btn-icon--primary"
                          title="View details"
                          id={`view-${book._id}`}
                        >👁</Link>
                        <Link
                          to={`/admin/books/${book._id}/edit`}
                          className="ab-btn-icon"
                          title="Edit book"
                          id={`edit-${book._id}`}
                        >✏️</Link>
                        <button
                          className="ab-btn-icon ab-btn-icon--danger"
                          title="Delete book"
                          onClick={() => confirmDelete(book)}
                          id={`delete-${book._id}`}
                        >🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '16px 0' }}>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  ← Previous
                </button>
                <span style={{ fontSize: 13, color: '#6b7280' }}>
                  Page {page} of {pages}
                </span>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page >= pages}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Delete confirm modal ──────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Book"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.` : ''}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
        loading={deleteLoading}
      />

      {/* ── Toasts ───────────────────────────────────────────────────────── */}
      <Toast toasts={toasts} onClose={closeToast} />
    </MainLayout>
  );
};

export default AdminBooksPage;
