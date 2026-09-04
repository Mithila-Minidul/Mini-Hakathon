// src/pages/books/BooksPage.jsx
// Public Book Discovery page — search, filter, browse all books

import { useState, useCallback, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import BookCard from '../../components/books/BookCard';
import BookFilters from '../../components/books/BookFilters';
import { fetchBooks, fetchCategories } from '../../services/bookService';
import { debounce } from '../../utils/helpers';
import '../../components/books/books.css';

const BooksPage = () => {
  // ── Filter state ─────────────────────────────────────────────────────────────
  const [searchInput, setSearchInput]   = useState('');
  const [search, setSearch]             = useState('');
  const [category, setCategory]         = useState('');
  const [available, setAvailable]       = useState('');
  const [page, setPage]                 = useState(1);

  // ── Data state ───────────────────────────────────────────────────────────────
  const [books, setBooks]               = useState([]);
  const [total, setTotal]               = useState(0);
  const [pages, setPages]               = useState(1);
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  // ── Load categories once ─────────────────────────────────────────────────────
  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data.categories))
      .catch(() => {}); // silently ignore – filters still work without it
  }, []);

  // ── Load books on filter/page change ─────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchBooks({ search, category, available, page, limit: 12 });
      setBooks(res.data.books);
      setTotal(res.data.total);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (err) {
      setError(err.message || 'Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category, available, page]);

  useEffect(() => { load(); }, [load]);

  // ── Debounced search ──────────────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((val) => { setSearch(val); setPage(1); }, 400),
    []
  );

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const handleCategoryChange = (e) => { setCategory(e.target.value); setPage(1); };
  const handleAvailableChange = (e) => { setAvailable(e.target.value); setPage(1); };

  return (
    <MainLayout>
      <div className="bk-page">

        {/* Hero header */}
        <div className="bk-hero">
          <h1>📚 Bookstore</h1>
          <p>Discover your next great read from our curated collection</p>
        </div>

        {/* Search + filters */}
        <BookFilters
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
          onSearchClear={handleSearchClear}
          category={category}
          categories={categories}
          onCategoryChange={handleCategoryChange}
          available={available}
          onAvailableChange={handleAvailableChange}
          total={total}
          loading={loading}
        />

        {/* Error state */}
        {error && (
          <div className="bk-error">
            <div className="bk-error__icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p>{error}</p>
            <button className="btn btn--primary" style={{ marginTop: 12 }} onClick={load}>
              Retry
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="bk-skeleton-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bk-skeleton-card" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && books.length === 0 && (
          <div className="bk-empty">
            <div className="bk-empty__icon">🔍</div>
            <h3>No books found</h3>
            <p>
              {search || category || available
                ? 'Try adjusting your search or filters'
                : 'No books have been added yet'}
            </p>
            {(search || category || available) && (
              <button
                className="btn btn--ghost"
                style={{ marginTop: 12 }}
                onClick={() => { handleSearchClear(); setCategory(''); setAvailable(''); }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Book grid */}
        {!loading && !error && books.length > 0 && (
          <>
            <div className="bk-grid">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="bk-pagination">
                <button
                  className="bk-pagination__btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  ← Previous
                </button>
                <span className="bk-pagination__info">Page {page} of {pages}</span>
                <button
                  className="bk-pagination__btn"
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  disabled={page === pages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default BooksPage;
