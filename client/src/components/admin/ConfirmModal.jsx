// src/components/admin/ConfirmModal.jsx
// Accessible delete-confirmation modal dialog

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;
  return (
    <div
      className="ab-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="ab-modal">
        <div className="ab-modal__icon">🗑️</div>
        <h3 id="confirm-title">{title || 'Are you sure?'}</h3>
        <p>{message || 'This action cannot be undone.'}</p>
        <div className="ab-modal__actions">
          <button
            className="btn btn--ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={loading}
            id="confirm-delete-btn"
          >
            {loading ? <span className="btn__spinner" aria-hidden="true" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
