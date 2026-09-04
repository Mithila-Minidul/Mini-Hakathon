// src/pages/customers/CustomerDetailPage.jsx
// Read-only detail view with edit / delete actions

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import ConfirmModal from '../../components/customers/ConfirmModal';
import Toast from '../../components/customers/Toast';
import Button from '../../components/Button';
import { fetchCustomerById, deleteCustomer } from '../../services/customerService';
import '../../components/customers/customers.css';

const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');

const DetailField = ({ label, value }) =>
  value ? (
    <div className="cm-detail__field">
      <label>{label}</label>
      <p>{value}</p>
    </div>
  ) : null;

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [notFound, setNotFound]     = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast]           = useState({ message: '', type: 'success' });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchCustomerById(id);
        setCustomer(res.data.customer);
      } catch (err) {
        if (err.status === 404 || err.status === 400) setNotFound(true);
        else setToast({ message: err.message || 'Failed to load customer', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await deleteCustomer(id);
      navigate('/customers', { state: { successMessage: `"${customer.name}" deleted successfully` } });
    } catch (err) {
      setToast({ message: err.message || 'Delete failed', type: 'error' });
      setDeleteLoading(false);
      setShowDelete(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="cm-page">
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div className="cm-skeleton-card" style={{ height: 360, borderRadius: 16 }} />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (notFound || !customer) {
    return (
      <MainLayout>
        <div className="cm-page">
          <div className="cm-empty">
            <div className="cm-empty__icon">❓</div>
            <h3>Customer not found</h3>
            <p>The requested customer does not exist or has been deleted.</p>
            <Link to="/customers" className="btn btn--primary" style={{ marginTop: 12 }}>
              Back to Customers
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const { name, email, phone, address, createdAt } = customer;
  const fullAddress = [
    address?.street,
    address?.city,
    address?.state,
    address?.postalCode,
    address?.country,
  ].filter(Boolean).join(', ');

  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  return (
    <MainLayout>
      <div className="cm-page">
        {/* Breadcrumb */}
        <nav className="cm-breadcrumb">
          <Link to="/customers">Customers</Link>
          <span>›</span>
          <span>{name}</span>
        </nav>

        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />

        <div className="cm-detail">
          {/* Hero */}
          <div className="cm-detail__hero">
            <div className="cm-detail__avatar">{initials(name)}</div>
            <div>
              <p className="cm-detail__name">{name}</p>
              <span className="cm-detail__badge">Customer</span>
            </div>
          </div>

          {/* Info grid */}
          <div className="cm-detail__grid">
            <DetailField label="Email"         value={email} />
            <DetailField label="Phone"         value={phone} />
            <DetailField label="Address"       value={fullAddress || '—'} />
            <DetailField label="Member since"  value={memberSince} />
          </div>

          {/* Actions */}
          <div className="cm-detail__actions">
            <Button variant="secondary" onClick={() => navigate('/customers')}>
              ← Back
            </Button>
            <Link to={`/customers/${id}/edit`} className="btn btn--ghost">
              ✏️ Edit
            </Link>
            <Button variant="danger" onClick={() => setShowDelete(true)}>
              🗑 Delete
            </Button>
          </div>
        </div>

        {/* Delete modal */}
        {showDelete && (
          <ConfirmModal
            title="Delete Customer"
            message={`Permanently delete "${name}"? This cannot be undone.`}
            onConfirm={handleDelete}
            onCancel={() => setShowDelete(false)}
            loading={deleteLoading}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default CustomerDetailPage;
