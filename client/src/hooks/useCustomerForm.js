// src/hooks/useCustomerForm.js
// Form state + validation for Add / Edit customer forms

import { useState } from 'react';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  address: { street: '', city: '', state: '', postalCode: '', country: '' },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[1-9]\d{6,14}$/;

const validate = (form) => {
  const errs = {};
  if (!form.name.trim()) errs.name = 'Name is required';
  else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

  if (!form.email.trim()) errs.email = 'Email is required';
  else if (!EMAIL_RE.test(form.email.trim())) errs.email = 'Enter a valid email address';

  if (!form.phone.trim()) errs.phone = 'Phone is required';
  else if (!PHONE_RE.test(form.phone.trim()))
    errs.phone = 'Enter a valid phone number (7–15 digits, optional leading +)';

  return errs;
};

const useCustomerForm = (initial = EMPTY_FORM) => {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setForm((prev) => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    // Clear the field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const isValid = () => {
    const errs = validate(form);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const reset = () => { setForm(EMPTY_FORM); setErrors({}); };

  return { form, setForm, errors, handleChange, isValid, reset };
};

export default useCustomerForm;
