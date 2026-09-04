// src/pages/customers/CustomerEditPage.jsx
// Edit existing customer — pre-fills the form with current data

import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import CustomerForm from '../../components/customers/CustomerForm';
import Toast from '../../components/customers/Toast';
import useCustomerForm from '../../hooks/useCustomerForm';
import { fetchCustomerById, updateCustomer } from '../../services/customerService';
import '../../components/customers/customers.css';

const CustomerEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { form, setForm, errors, handleChange, isValid } = useCustomerForm();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [notFound, setNotFound] = useState(false);

  // ── Pre-fill form ────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchCustomerById(id);
        const c = res.data.customer;
        setForm({
          name:    c.name    ?? '',
          email:   c.email   ?? '',
          phone:   c.phone   ?? '',
          address: {
            street:     c.address?.street     ?? '',
            city:       c.address?.city       ?? '',
            state:      c.address?.state      ?? '',
            postalCode: c.address?.postalCode ?? '',
            country:    c.address?.country    ?? '',
          },
        });
      } catch (err) {
        if (err.status === 404 || err.status === 400) setNotFound(true);
        else setToast({ message: err.message || 'Failed to load customer', type: 'error' });
      } finally {
        setFetchLoading(false);
      }
    };
    load();
  }, [id, setForm]);

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) return;

    setSubmitLoading(true);
    try {
      await updateCustomer(id, form);
      setToast({ message: 'Customer updated successfully! ✅', type: 'success' });
      setTimeout(() => navigate(`/customers/${id}`), 1200);
    } catch (err) {
      setToast({ message: err.message || 'Failed to update customer', type: 'error' });
      setSubmitLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <MainLayout>
        <div className="cm-page">
          <div className="cm-skeleton-grid" style={{ maxWidth: 640, margin: '0 auto' }}>
            <div className="cm-skeleton-card" style={{ height: 480 }} />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (notFound) {
    return (
      <MainLayout>
        <div className="cm-page">
          <div className="cm-empty">
            <div className="cm-empty__icon">❓</div>
            <h3>Customer not found</h3>
            <p>The customer you are trying to edit doesn't exist.</p>
            <Link to="/customers" className="btn btn--primary" style={{ marginTop: 12 }}>
              Back to Customers
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="cm-page">
        <nav className="cm-breadcrumb">
          <Link to="/customers">Customers</Link>
          <span>›</span>
          <Link to={`/customers/${id}`}>Details</Link>
          <span>›</span>
          <span>Edit</span>
        </nav>

        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />

        <CustomerForm
          form={form}
          errors={errors}
          handleChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/customers/${id}`)}
          loading={submitLoading}
          mode="edit"
        />
      </div>
    </MainLayout>
  );
};

export default CustomerEditPage;
