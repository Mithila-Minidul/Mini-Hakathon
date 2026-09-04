// src/pages/customers/CustomerNewPage.jsx
// Add new customer form page

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import CustomerForm from '../../components/customers/CustomerForm';
import Toast from '../../components/customers/Toast';
import useCustomerForm from '../../hooks/useCustomerForm';
import { createCustomer } from '../../services/customerService';
import '../../components/customers/customers.css';

const CustomerNewPage = () => {
  const navigate = useNavigate();
  const { form, errors, handleChange, isValid } = useCustomerForm();
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState({ message: '', type: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) return;

    setLoading(true);
    try {
      const res = await createCustomer(form);
      const newId = res.data.customer._id;
      // Brief success flash then navigate to detail
      setToast({ message: 'Customer created successfully! 🎉', type: 'success' });
      setTimeout(() => navigate(`/customers/${newId}`), 1200);
    } catch (err) {
      setToast({ message: err.message || 'Failed to create customer', type: 'error' });
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="cm-page">
        {/* Breadcrumb */}
        <nav className="cm-breadcrumb">
          <Link to="/customers">Customers</Link>
          <span>›</span>
          <span>New Customer</span>
        </nav>

        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />

        <CustomerForm
          form={form}
          errors={errors}
          handleChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/customers')}
          loading={loading}
          mode="add"
        />
      </div>
    </MainLayout>
  );
};

export default CustomerNewPage;
