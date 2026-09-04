// src/pages/admin/books/AdminBookEditPage.jsx
// Admin — Edit an existing book

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import BookForm from '../../../components/admin/BookForm';
import Toast from '../../../components/admin/Toast';
import useToast from '../../../hooks/useToast';
import { fetchBookById, updateBook } from '../../../services/bookService';
import '../../../components/admin/admin-books.css';

const AdminBookEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook]         = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError]     = useState('');
  const [saveLoading, setSaveLoading]   = useState(false);
  const [toasts, showToast, closeToast] = useToast();

  // Load existing book data
  useEffect(() => {
    const load = async () => {
      setFetchLoading(true);
      setFetchError('');
      try {
        const res = await fetchBookById(id);
        setBook(res.data.book);
      } catch (err) {
        setFetchError(err.message || 'Could not load book.');
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (payload) => {
    setSaveLoading(true);
    try {
      await updateBook(id, payload);
      showToast('Book updated successfully! Redirecting…', 'success');
      setTimeout(() => navigate(`/admin/books/${id}`), 1500);
    } catch (err) {
      showToast(err.message || 'Failed to update book.', 'error');
      setSaveLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="ab-page">

        {/* Breadcrumb */}
        <nav className="ab-breadcrumb" aria-label="Breadcrumb">
          <a href="/admin/books">Books</a>
          <span className="ab-breadcrumb__sep">›</span>
          {book && <a href={`/admin/books/${id}`}>{book.title}</a>}
          {book && <span className="ab-breadcrumb__sep">›</span>}
          <span>Edit</span>
        </nav>

        {/* Header */}
        <div className="ab-header">
          <div className="ab-header__left">
            <h1 className="ab-header__title">✏️ Edit Book</h1>
            <p className="ab-header__subtitle">
              {book ? `Editing: ${book.title}` : 'Update the book details below.'}
            </p>
          </div>
        </div>

        {/* Loading */}
        {fetchLoading && (
          <div className="ab-form-card">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="ab-skeleton-row" style={{ marginBottom: 16, borderRadius: 10, height: 48 }} />
            ))}
          </div>
        )}

        {/* Fetch error */}
        {!fetchLoading && fetchError && (
          <div className="ab-error">
            <div className="ab-error__icon">⚠️</div>
            <h3>Failed to load book</h3>
            <p>{fetchError}</p>
            <button className="btn btn--secondary" onClick={() => navigate('/admin/books')} style={{ marginTop: 12 }}>
              Back to Books
            </button>
          </div>
        )}

        {/* Form */}
        {!fetchLoading && book && (
          <div className="ab-form-card">
            <BookForm
              initialValues={{
                title:       book.title       ?? '',
                author:      book.author      ?? '',
                category:    book.category    ?? '',
                price:       String(book.price ?? ''),
                stock:       String(book.stock ?? ''),
                description: book.description ?? '',
                coverImage:  book.coverImage  ?? '',
              }}
              onSubmit={handleSubmit}
              loading={saveLoading}
              submitLabel="Save Changes"
              onCancel={() => navigate(`/admin/books/${id}`)}
            />
          </div>
        )}
      </div>

      <Toast toasts={toasts} onClose={closeToast} />
    </MainLayout>
  );
};

export default AdminBookEditPage;
