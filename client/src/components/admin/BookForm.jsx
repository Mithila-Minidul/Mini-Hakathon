// src/components/admin/BookForm.jsx
// Reusable form for creating and editing books — includes full validation

import { useState } from 'react';
import { BOOK_CATEGORIES } from '../../utils/constants';

const INITIAL = {
  title: '',
  author: '',
  category: '',
  price: '',
  stock: '',
  description: '',
  coverImage: '',
};

const validate = (fields) => {
  const errors = {};
  if (!fields.title.trim())       errors.title       = 'Title is required.';
  if (!fields.author.trim())      errors.author      = 'Author is required.';
  if (!fields.category)           errors.category    = 'Category is required.';
  if (!fields.description.trim()) errors.description = 'Description is required.';

  const price = parseFloat(fields.price);
  if (fields.price === '' || isNaN(price)) errors.price = 'Price is required.';
  else if (price <= 0)                     errors.price = 'Price must be greater than 0.';

  const stock = parseInt(fields.stock, 10);
  if (fields.stock === '' || isNaN(stock)) errors.stock = 'Stock is required.';
  else if (stock < 0)                      errors.stock = 'Stock must be 0 or greater.';

  return errors;
};

/**
 * @param {object}   initialValues  - Pre-populated values when editing
 * @param {function} onSubmit       - (payload) => Promise<void>
 * @param {boolean}  loading        - Submit spinner state
 * @param {string}   submitLabel    - Text on the submit button
 */
const BookForm = ({ initialValues = INITIAL, onSubmit, loading, submitLabel = 'Save Book', onCancel }) => {
  const [fields, setFields] = useState({ ...INITIAL, ...initialValues });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imgError, setImgError] = useState(false);

  const set = (name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    // Live-clear error as user corrects the field
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleBlur = (name) => setTouched((prev) => ({ ...prev, [name]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.keys(INITIAL).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);

    const errs = validate(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      title:       fields.title.trim(),
      author:      fields.author.trim(),
      category:    fields.category,
      price:       parseFloat(fields.price),
      stock:       parseInt(fields.stock, 10),
      description: fields.description.trim(),
      coverImage:  fields.coverImage.trim(),
    };
    await onSubmit(payload);
  };

  const field = (name) => ({
    id: `book-${name}`,
    name,
    value: fields[name],
    onChange: (e) => set(name, e.target.value),
    onBlur:   () => handleBlur(name),
    className: [
      name === 'description' ? 'ab-form__textarea' :
      name === 'category'   ? 'ab-form__select'   : 'ab-form__input',
      touched[name] && errors[name] ? (
        name === 'description' ? 'ab-form__textarea--error' :
        name === 'category'   ? 'ab-form__select--error'   : 'ab-form__input--error'
      ) : '',
    ].join(' ').trim(),
  });

  const err = (name) =>
    touched[name] && errors[name]
      ? <p className="ab-form__error">⚠ {errors[name]}</p>
      : null;

  return (
    <form className="ab-form" onSubmit={handleSubmit} noValidate id="book-form">
      {/* Row 1: Title + Author */}
      <div className="ab-form__row">
        <div className="ab-form__group">
          <label className="ab-form__label" htmlFor="book-title">
            Title <span className="ab-form__required">*</span>
          </label>
          <input
            {...field('title')}
            type="text"
            placeholder="e.g. Clean Code"
            maxLength={300}
            autoFocus
          />
          {err('title')}
        </div>
        <div className="ab-form__group">
          <label className="ab-form__label" htmlFor="book-author">
            Author <span className="ab-form__required">*</span>
          </label>
          <input
            {...field('author')}
            type="text"
            placeholder="e.g. Robert C. Martin"
            maxLength={150}
          />
          {err('author')}
        </div>
      </div>

      {/* Row 2: Category + Price + Stock */}
      <div className="ab-form__row">
        <div className="ab-form__group">
          <label className="ab-form__label" htmlFor="book-category">
            Category <span className="ab-form__required">*</span>
          </label>
          <select {...field('category')} id="book-category">
            <option value="">— Select category —</option>
            {BOOK_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {err('category')}
        </div>

        <div className="ab-form__group">
          <label className="ab-form__label" htmlFor="book-price">
            Price ($) <span className="ab-form__required">*</span>
          </label>
          <input
            {...field('price')}
            type="number"
            min="0.01"
            step="0.01"
            placeholder="e.g. 19.99"
          />
          {err('price')}
        </div>
      </div>

      {/* Row 3: Stock */}
      <div className="ab-form__row">
        <div className="ab-form__group">
          <label className="ab-form__label" htmlFor="book-stock">
            Stock <span className="ab-form__required">*</span>
          </label>
          <input
            {...field('stock')}
            type="number"
            min="0"
            step="1"
            placeholder="e.g. 25"
          />
          <p className="ab-form__hint">Stock = 0 automatically marks the book as unavailable.</p>
          {err('stock')}
        </div>
        <div className="ab-form__group">
          <label className="ab-form__label" htmlFor="book-coverImage">
            Cover Image URL
          </label>
          <input
            {...field('coverImage')}
            type="url"
            placeholder="https://example.com/cover.jpg"
          />
          <p className="ab-form__hint">Optional — paste a direct image link.</p>
          {/* Live preview */}
          {fields.coverImage && (
            <div className="ab-form__cover-preview">
              {imgError ? (
                <div className="ab-form__cover-placeholder">📖</div>
              ) : (
                <img
                  src={fields.coverImage}
                  alt="Cover preview"
                  className="ab-form__cover-img"
                  onError={() => setImgError(true)}
                  onLoad={() => setImgError(false)}
                />
              )}
              <span className="ab-form__cover-text">Preview</span>
            </div>
          )}
        </div>
      </div>

      {/* Description — full width */}
      <div className="ab-form__group ab-form__group--full">
        <label className="ab-form__label" htmlFor="book-description">
          Description <span className="ab-form__required">*</span>
        </label>
        <textarea
          {...field('description')}
          placeholder="A brief description of the book…"
          maxLength={2000}
          rows={4}
        />
        {err('description')}
      </div>

      {/* Form actions */}
      <div className="ab-form__actions">
        <button type="submit" className="btn btn--primary" disabled={loading} id="book-form-submit">
          {loading ? <span className="btn__spinner" aria-hidden="true" /> : submitLabel}
        </button>
        {onCancel && (
          <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default BookForm;
