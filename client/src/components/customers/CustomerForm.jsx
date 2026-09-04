// src/components/customers/CustomerForm.jsx
// Reusable Add / Edit form — receives form state from useCustomerForm hook

import Button from '../Button';

const Field = ({ label, required, error, children }) => (
  <div className="cm-field">
    <label>
      {label}
      {required && <span className="cm-required" aria-hidden>*</span>}
    </label>
    {children}
    {error && <p className="cm-field__error" role="alert">{error}</p>}
  </div>
);

const CustomerForm = ({ form, errors, handleChange, onSubmit, onCancel, loading, mode = 'add' }) => (
  <div className="cm-form-card">
    <h2>{mode === 'edit' ? '✏️ Edit Customer' : '➕ Add New Customer'}</h2>

    <form onSubmit={onSubmit} noValidate>
      {/* ── Basic Info ───────────────────────────────────────────── */}
      <p className="cm-form-section">Basic Information</p>

      <Field label="Full Name" required error={errors.name}>
        <input
          type="text"
          name="name"
          id="customer-name"
          value={form.name}
          onChange={handleChange}
          placeholder="Alice Johnson"
          className={errors.name ? 'cm-input--error' : ''}
          autoComplete="name"
        />
      </Field>

      <div className="cm-field-row">
        <Field label="Email" required error={errors.email}>
          <input
            type="email"
            name="email"
            id="customer-email"
            value={form.email}
            onChange={handleChange}
            placeholder="alice@example.com"
            className={errors.email ? 'cm-input--error' : ''}
            autoComplete="email"
          />
        </Field>

        <Field label="Phone" required error={errors.phone}>
          <input
            type="tel"
            name="phone"
            id="customer-phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+14155551234"
            className={errors.phone ? 'cm-input--error' : ''}
            autoComplete="tel"
          />
        </Field>
      </div>

      {/* ── Address ─────────────────────────────────────────────── */}
      <p className="cm-form-section">Address (optional)</p>

      <Field label="Street">
        <input
          type="text"
          name="address.street"
          value={form.address?.street ?? ''}
          onChange={handleChange}
          placeholder="123 Main St"
          autoComplete="street-address"
        />
      </Field>

      <div className="cm-field-row">
        <Field label="City">
          <input
            type="text"
            name="address.city"
            value={form.address?.city ?? ''}
            onChange={handleChange}
            placeholder="New York"
            autoComplete="address-level2"
          />
        </Field>
        <Field label="State / Province">
          <input
            type="text"
            name="address.state"
            value={form.address?.state ?? ''}
            onChange={handleChange}
            placeholder="NY"
            autoComplete="address-level1"
          />
        </Field>
      </div>

      <div className="cm-field-row">
        <Field label="Postal Code">
          <input
            type="text"
            name="address.postalCode"
            value={form.address?.postalCode ?? ''}
            onChange={handleChange}
            placeholder="10001"
            autoComplete="postal-code"
          />
        </Field>
        <Field label="Country">
          <input
            type="text"
            name="address.country"
            value={form.address?.country ?? ''}
            onChange={handleChange}
            placeholder="USA"
            autoComplete="country-name"
          />
        </Field>
      </div>

      {/* ── Actions ─────────────────────────────────────────────── */}
      <div className="cm-form-actions">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {mode === 'edit' ? 'Save Changes' : 'Add Customer'}
        </Button>
      </div>
    </form>
  </div>
);

export default CustomerForm;
