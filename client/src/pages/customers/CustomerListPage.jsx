// src/pages/customers/CustomerListPage.jsx
// Shows all customers in a card grid with search, add, delete

import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import CustomerCard from '../../components/customers/CustomerCard';
import ConfirmModal from '../../components/customers/ConfirmModal';
import Toast from '../../components/customers/Toast';
import Button from '../../components/Button';
import { fetchCustomers, deleteCustomer } from '../../services/customerService';
import { debounce } from '../../utils/helpers';
import '../../components/customers/customers.css';

const CustomerListPage = () => {
  const [customers, setCustomers]   = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [pages, setPages]           = useState(1);
  const [search, setSearch]         = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading]       = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast]           = useState({ message: '', type: 'success' });

  // ── Load customers ──────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchCustomers({ search, page, limit: 12 });
      setCustomers(res.data.customers);
      setTotal(res.data.total);
      setPage(res.data.page);
      setPages(res.data.pages);
    } catch (err) {
      setToast({ message: err.message || 'Failed to load customers', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  // ── Debounced search ────────────────────────────────────────────────────────
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((val) => { setSearch(val); setPage(1); }, 400),
    []
  );

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  const clearSearch = () => { setSearchInput(''); setSearch(''); setPage(1); };

  // ── Delete flow ─────────────────────────────────────────────────────────────
  const handleDeleteRequest = (customer) => setDeleteTarget(customer);

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await deleteCustomer(deleteTarget._id);
      setToast({ message: `"${deleteTarget.name}" deleted successfully`, type: 'success' });
      setDeleteTarget(null);
      load();
    } catch (err) {
      setToast({ message: err.message || 'Delete failed', type: 'error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="cm-page">

        {/* Toast */}
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />

        {/* Header */}
        <div className="cm-header">
          <h1>👥 Customers <span style={{ fontSize: 16, color: '#9ca3af', fontWeight: 400 }}>({total})</span></h1>
          <Link to="/customers/new" className="btn btn--primary">+ Add Customer</Link>
        </div>

        {/* Search */}
        <div className="cm-search-bar">
          <input
            type="search"
            placeholder="Search by name, email or phone…"
            value={searchInput}
            onChange={handleSearchChange}
            aria-label="Search customers"
          />
          {searchInput && (
            <Button variant="secondary" onClick={clearSearch}>Clear</Button>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="cm-skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="cm-skeleton-card" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && customers.length === 0 && (
          <div className="cm-empty">
            <div className="cm-empty__icon">🔍</div>
            <h3>{search ? 'No customers found' : 'No customers yet'}</h3>
            <p>{search ? `No results for "${search}"` : 'Add your first customer to get started'}</p>
            {!search && (
              <Link to="/customers/new" className="btn btn--primary" style={{ marginTop: 12 }}>
                + Add Customer
              </Link>
            )}
          </div>
        )}

        {/* Grid */}
        {!loading && customers.length > 0 && (
          <>
            <div className="cm-grid">
              {customers.map((c) => (
                <CustomerCard key={c._id} customer={c} onDelete={handleDeleteRequest} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="cm-pagination">
                <Button variant="secondary" className="btn--sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                  ← Prev
                </Button>
                <span className="cm-page-info">Page {page} of {pages}</span>
                <Button variant="secondary" className="btn--sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>
                  Next →
                </Button>
              </div>
            )}
          </>
        )}

        {/* Delete confirm */}
        {deleteTarget && (
          <ConfirmModal
            title="Delete Customer"
            message={`Are you sure you want to permanently delete "${deleteTarget.name}"? This action cannot be undone.`}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTarget(null)}
            loading={deleteLoading}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CustomerListPage;
