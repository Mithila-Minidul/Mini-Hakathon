// src/pages/admin/books/AdminBookNewPage.jsx
// Admin — Create a new book

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../layouts/MainLayout';
import BookForm from '../../../components/admin/BookForm';
import Toast from '../../../components/admin/Toast';
import useToast from '../../../hooks/useToast';
import { createBook } from '../../../services/bookService';
import '../../../components/admin/admin-books.css';

const AdminBookNewPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toasts, showToast, closeToast] = useToast();

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      await createBook(payload);
      showToast('Book created successfully! Redirecting…', 'success');
      setTimeout(() => navigate('/admin/books'), 1500);
    } catch (err) {
      showToast(err.message || 'Failed to create book.', 'error');
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="ab-page">

        {/* Breadcrumb */}
        <nav className="ab-breadcrumb" aria-label="Breadcrumb">
          <a href="/admin/books">Books</a>
          <span className="ab-breadcrumb__sep">›</span>
          <span>New Book</span>
        </nav>

        {/* Header */}
        <div className="ab-header">
          <div className="ab-header__left">
            <h1 className="ab-header__title">➕ Add New Book</h1>
            <p className="ab-header__subtitle">
              Fill in the details below to add a new book to the catalogue.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="ab-form-card">
          <BookForm
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Create Book"
            onCancel={() => navigate('/admin/books')}
          />
        </div>
      </div>

      <Toast toasts={toasts} onClose={closeToast} />
    </MainLayout>
  );
};

export default AdminBookNewPage;
