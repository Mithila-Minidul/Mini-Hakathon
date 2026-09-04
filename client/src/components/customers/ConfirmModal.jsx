// src/components/customers/ConfirmModal.jsx
// Delete-confirmation dialog

import Button from '../Button';

const ConfirmModal = ({ title, message, onConfirm, onCancel, loading }) => (
  <div className="cm-modal-overlay" role="dialog" aria-modal="true">
    <div className="cm-modal">
      <h3>⚠️ {title}</h3>
      <p>{message}</p>
      <div className="cm-modal__actions">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          Delete
        </Button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
